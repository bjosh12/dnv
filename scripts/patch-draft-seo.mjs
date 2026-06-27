import { createClient } from "@sanity/client";
import { readFileSync } from "fs";

const env = readFileSync("/sessions/admiring-happy-bardeen/mnt/DNV Website June 2026/.env.local", "utf8");
const token = env.match(/SANITY_WRITE_TOKEN=(.+)/)?.[1]?.trim();

const client = createClient({
  projectId: "wllgq317",
  dataset: "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const seo = {
  _type: "seoObject",
  title: "Spain Digital Nomad Visa: Complete 2026 Guide",
  description: "Your complete 2026 guide to Spain's Digital Nomad Visa — eligibility, income thresholds, required documents, tax benefits, and how to apply.",
};

// Patch both the draft and the published document
const [draft, published] = await Promise.all([
  client.patch("drafts.8QUhaZiXPU4aVA3z9q3Muh").set({ seo }).commit(),
  client.patch("8QUhaZiXPU4aVA3z9q3Muh").set({ seo }).commit(),
]);

console.log("✅ Draft patched:", draft._id);
console.log("✅ Published patched:", published._id);
