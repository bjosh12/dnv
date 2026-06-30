#!/usr/bin/env node
/**
 * publish-post.mjs
 * Publishes a generated blog post to Sanity.
 *
 * Usage:
 *   node scripts/publish-post.mjs <path-to-post.json>
 *
 * The JSON file must match this shape:
 * {
 *   "title": "...",
 *   "slug": "url-safe-slug",
 *   "excerpt": "One or two sentence summary.",
 *   "category": "Digital Nomad Visa",
 *   "body": [
 *     { "style": "h2", "text": "Section heading" },
 *     { "style": "normal", "text": "Paragraph text..." },
 *     ...
 *   ]
 * }
 *
 * Body styles: "h2", "h3", "normal", "blockquote"
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve } from "path";

// ── Load env ────────────────────────────────────────────────────────────────
const envPath = resolve(process.cwd(), ".env.local");
let token = process.env.SANITY_WRITE_TOKEN;
let projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "wllgq317";
let dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!token) {
  try {
    const env = readFileSync(envPath, "utf8");
    token = env.match(/SANITY_WRITE_TOKEN=(.+)/)?.[1]?.trim();
    projectId = env.match(/NEXT_PUBLIC_SANITY_PROJECT_ID=(.+)/)?.[1]?.trim() || projectId;
    dataset = env.match(/NEXT_PUBLIC_SANITY_DATASET=(.+)/)?.[1]?.trim() || dataset;
  } catch {
    // env file not found, continue with env vars
  }
}

if (!token || token === "paste_your_editor_token_here") {
  console.error("❌  SANITY_WRITE_TOKEN not found. Add it to .env.local or set it as an env variable.");
  process.exit(1);
}

// ── Sanity client ────────────────────────────────────────────────────────────
const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

// ── Load post JSON ───────────────────────────────────────────────────────────
const jsonArg = process.argv[2];
if (!jsonArg) {
  console.error("❌  Usage: node scripts/publish-post.mjs <path-to-post.json>");
  process.exit(1);
}

let post;
try {
  post = JSON.parse(readFileSync(resolve(process.cwd(), jsonArg), "utf8"));
} catch (err) {
  console.error("❌  Failed to read/parse JSON:", err.message);
  process.exit(1);
}

const { title, slug, excerpt, category, body, seoTitle, metaDescription } = post;
if (!title || !slug || !body?.length) {
  console.error("❌  JSON must include: title, slug, body[]");
  process.exit(1);
}

// ── Convert body array → Portable Text blocks ────────────────────────────────
// Supports markdown-style links in text: [anchor text](https://example.com)
function parseSpans(rawText, blockKey) {
  const markDefs = [];
  const children = [];
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;

  let lastIndex = 0;
  let spanIndex = 0;
  let match;

  while ((match = linkRegex.exec(rawText)) !== null) {
    // Text before the link
    if (match.index > lastIndex) {
      children.push({
        _type: "span",
        _key: `${blockKey}s${spanIndex++}`,
        text: rawText.slice(lastIndex, match.index),
        marks: [],
      });
    }

    // The link itself
    const linkKey = `${blockKey}l${spanIndex}`;
    markDefs.push({ _key: linkKey, _type: "link", href: match[2] });
    children.push({
      _type: "span",
      _key: `${blockKey}s${spanIndex++}`,
      text: match[1],
      marks: [linkKey],
    });

    lastIndex = match.index + match[0].length;
  }

  // Remaining text after last link
  if (lastIndex < rawText.length) {
    children.push({
      _type: "span",
      _key: `${blockKey}s${spanIndex++}`,
      text: rawText.slice(lastIndex),
      marks: [],
    });
  }

  // Fallback: plain text with no links
  if (children.length === 0) {
    children.push({
      _type: "span",
      _key: `${blockKey}s0`,
      text: rawText,
      marks: [],
    });
  }

  return { markDefs, children };
}

function toBlock(item, index) {
  const style = item.style || "normal";
  const text = (item.text || "").trim();
  if (!text) return null;

  const blockKey = `b${index}`;
  const { markDefs, children } = parseSpans(text, blockKey);

  return {
    _type: "block",
    _key: blockKey,
    style,
    markDefs,
    children,
  };
}

const portableBody = body.map(toBlock).filter(Boolean);

// ── Resolve or create category ───────────────────────────────────────────────
async function resolveCategory(name) {
  if (!name) return null;

  // Try to find existing category
  const existing = await client.fetch(
    `*[_type == "category" && title == $name][0]{ _id }`,
    { name }
  );
  if (existing?._id) return existing._id;

  // Create it
  const created = await client.create({
    _type: "category",
    title: name,
    description: "",
  });
  console.log(`  Created new category: "${name}" (${created._id})`);
  return created._id;
}

// ── Publish ──────────────────────────────────────────────────────────────────
async function publish() {
  console.log(`\n📝  Publishing: "${title}"\n`);

  const categoryId = await resolveCategory(category);

  const doc = {
    _type: "post",
    title,
    slug: { _type: "slug", current: slug },
    excerpt: excerpt || "",
    publishedAt: new Date().toISOString(),
    body: portableBody,
    ...(categoryId
      ? { categories: [{ _key: categoryId, _type: "reference", _ref: categoryId }] }
      : {}),
    seo: {
      _type: "seoObject",
      title: seoTitle || title,
      description: metaDescription || excerpt || "",
    },
  };

  const result = await client.create(doc);
  console.log(`✅  Published! Sanity document ID: ${result._id}`);
  console.log(`🔗  View at: https://${projectId}.sanity.studio/desk/post;${result._id}\n`);
}

publish().catch((err) => {
  console.error("❌  Publish failed:", err.message);
  process.exit(1);
});
