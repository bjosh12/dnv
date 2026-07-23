# SEO Audit — digitalnomadinspain.com

**Scope:** Full-site audit (code-based static analysis of the production Next.js source in `bjosh12/dnv`)
**Date:** 2026-07-23
**Method:** LLM-first source review against `resources/references/llm-audit-rubric.md`. Live-URL evidence (rendered HTML, PageSpeed/CWV, security headers, robots/llms.txt fetch) could **not** be collected — see [Environment Limitations](#environment-limitations). All findings below are derived directly from the application source (`app/`, `components/`, `lib/`), which is the ground truth for what ships to production, so confidence is high on everything that doesn't require a live network request.

---

## Environment Limitations

Outbound HTTPS to `digitalnomadinspain.com` is blocked in this session (proxy returns 403 on CONNECT; the WebFetch tool also returned 403; the Vercel MCP account attached to this session does not host this project — its only project is unrelated). Per the skill's guardrails, this is reported as an environment limitation rather than a site issue, and the audit proceeds on source evidence instead. **Not verified live:** rendered DOM/hydration output, actual PageSpeed/CrUX Core Web Vitals, response security headers, robots.txt/llms.txt as served, redirect behavior for the apex domain, broken-link status codes. Anything that depends on these is labeled `Confidence: Hypothesis` and listed again under Unknowns.

---

## Audit Summary

**Overall Score: 66/100 — Needs Improvement** (Score confidence: Medium — code-verified, not live-verified)

**Top 3 issues:**
1. `/contact` is a client component with **no metadata export at all** — it silently inherits the homepage's title/description, creating duplicate `<title>`/meta description on a key conversion page. *(Confirmed)*
2. All Sanity-CDN and testimonial-avatar images render through raw `<img>` tags instead of `next/image`, because `cdn.sanity.io` is missing from `next.config.ts`'s `images.remotePatterns` — no automatic AVIF/WebP, no responsive `srcset`, larger payloads on every blog and testimonial image. *(Confirmed)*
3. Five indexable pages (`/privacy`, `/terms`, `/book`, `/eligibility`, `/services`) have no `alternates.canonical` set. *(Confirmed)*

**Top 3 opportunities:**
1. Add `sameAs` links to the sitewide `ProfessionalService` JSON-LD — the social profiles already exist in `lib/constants.ts` (`SOCIAL_LINKS`) but are never wired into the schema.
2. Add `BreadcrumbList` structured data to service and blog pages — no breadcrumb schema exists anywhere in the codebase.
3. De-duplicate the pricing/add-on boilerplate that is byte-identical between `/services/digital-nomad-visa` and `/services/non-lucrative-visa`.

---

## Findings Table

| Area | Severity | Confidence | Finding | Evidence | Fix |
|---|---|---|---|---|---|
| Technical | 🔴 Critical | Confirmed | `/contact` page has zero metadata (no title, description, or canonical) | `app/(site)/contact/page.tsx:1-19` is `"use client"` with an unused `import type { Metadata }` and no `export const metadata` — Next.js forbids metadata exports from Client Components | Split the page: keep a thin Server Component `page.tsx` that exports `metadata` (via `buildMetadata`, `path: "/contact"`) and renders a new client child (e.g. `ContactForm.tsx`) that owns the `useState`/form logic |
| Technical | ⚠️ Warning | Confirmed | 5 indexable pages have no canonical tag | `app/(site)/privacy/page.tsx`, `terms/page.tsx`, `book/page.tsx`, `eligibility/page.tsx`, `services/page.tsx` — none set `alternates.canonical`, unlike `/faq` and `/blog` which do | Add `alternates: { canonical: \`${SITE_URL}/<path>\` }` to each of these `metadata` objects |
| Technical | ⚠️ Warning | Hypothesis | Apex (`digitalnomadinspain.com`) → `www` redirect not verifiable in source | `lib/constants.ts:3` hardcodes `SITE_URL = "https://www.digitalnomadinspain.com"`; there is no `next.config.ts` redirect, middleware, or `vercel.json` handling the non-www apex — this is likely configured at the Vercel domain level, which this audit can't inspect | Confirm in Vercel project → Domains that the apex 301-redirects to `www` (or vice versa) and that only one canonical host is served |
| Technical | ⚠️ Warning | Confirmed | `X-Frame-Options`/`frame-ancestors` intentionally omitted sitewide | `next.config.ts:6-8` comment: omitted so Sanity Presentation tool can iframe the site | Documented trade-off, not an oversight — no action required unless clickjacking risk is reassessed; scope a `frame-ancestors` CSP allow-list for `*.sanity.io` only, instead of omitting the protection entirely |
| Schema | ⚠️ Warning | Confirmed | `sameAs` is a hardcoded empty array in the sitewide Organization schema | `app/layout.tsx:79` — `sameAs: []` — despite `Instagram/Facebook/LinkedIn/YouTube` URLs already defined in `lib/constants.ts:29-34` (`SOCIAL_LINKS`) and unused here | Populate `sameAs: Object.values(SOCIAL_LINKS)` in the `organizationSchema` object |
| Schema | ⚠️ Warning | Likely | Third-party `faqJsonLd` injected verbatim from BabyLoveGrowth API without knowing its `@type` | `app/(site)/blog/[slug]/page.tsx:89-91` renders `post.faqJsonLd` directly into a `<script type="application/ld+json">` with no validation; `lib/babylovegrowth.ts:22` types it only as `Record<string, unknown>`. If this is `FAQPage` schema (strongly suggested by the field name), it's restricted to government/healthcare sites since Aug 2023 and won't earn rich results on a commercial visa-consulting site | Fetch and inspect an actual `faqJsonLd` payload from the BabyLoveGrowth API to confirm its `@type`; if `FAQPage`, strip it before injection (render the Q&A as visible HTML only, as `/faq` already correctly does) |
| Schema | ℹ️ Info | Confirmed | No `BreadcrumbList` schema anywhere in the codebase | Grepped all `app/**/*.tsx` for schema blocks — only `ProfessionalService`, `WebSite`, `Service`, and `BlogPosting` types found | Add `BreadcrumbList` JSON-LD to service and blog pages, mirroring the nav hierarchy (Home → Services → Digital Nomad Visa) |
| Schema | ℹ️ Info | Confirmed | `BlogPosting.dateModified` always equals `datePublished` for Sanity posts | `app/(site)/blog/[slug]/page.tsx:144` — `dateModified: post.publishedAt ?? undefined` — no separate "updated at" field tracked in the Sanity schema | Add an `updatedAt` field to the Sanity `post` schema and wire it into `dateModified` so genuinely refreshed content shows real freshness signals |
| On-Page | ⚠️ Warning | Confirmed | `/about` title tag is just "About Us" — thin, generic, no brand or keyword | `app/(site)/about/page.tsx:14` passes `title: "About Us"` into `buildMetadata`, which sets `title: { absolute: title }` (`lib/seo.ts:29`) — bypasses the root layout's `%s \| Digital Nomad In Spain` template entirely, so the rendered `<title>` is literally "About Us" | Change to something like `"About Us — Spain Visa Experts Behind Digital Nomad In Spain"` (well within the 30-60 char range in `quality-gates.md`) |
| On-Page | ℹ️ Info | Confirmed | Pages built with `buildMetadata` (home, both service pages, about, blog posts) render an **absolute** title with no automatic brand suffix | `lib/seo.ts:29` comment: "Use absolute to bypass the root layout's title template" — e.g. `/services/digital-nomad-visa`'s title is exactly "Spain's Digital Nomad Visa — Requirements & Application Guide" with no "\| Digital Nomad In Spain" suffix | Intentional design choice (keyword-first titles), not a defect — flagged for awareness since it's inconsistent with the plain-`metadata`-object pages, which do inherit the brand suffix |
| Content | ⚠️ Warning | Confirmed | Pricing/add-on section is byte-identical boilerplate across both service pages | Diffed `services/digital-nomad-visa/page.tsx` and `services/non-lucrative-visa/page.tsx` — the `pricingPackages` and `addOns` fallback arrays (package names, prices, feature bullets, descriptions) are word-for-word identical | Write distinct package descriptions/features per visa type, or at minimum vary the framing text so the two most-important commercial pages aren't near-duplicates in a shared section |
| Content | ✅ Pass | Confirmed | Core service pages carry substantial, unique long-form content | `services/digital-nomad-visa/page.tsx` has ~700+ words of unique route-comparison, requirements, documents, and FAQ content well above the thin-content threshold | — |
| Content | ✅ Pass | Confirmed | `/faq` correctly avoids FAQPage schema for a commercial (non-gov/health) site | `app/(site)/faq/page.tsx` renders 20 Q&As as plain `<details>` HTML with no JSON-LD — correct per the FAQPage restriction | — |
| Performance/CWV | 🔴 Critical | Confirmed | Sanity-hosted images (blog cards, blog hero, testimonial avatars) can never use `next/image` | `next.config.ts:11-13` `images.remotePatterns` only allow-lists `images.unsplash.com`; `cdn.sanity.io` (used by every `urlFor()` call in `lib/sanity.ts`) is absent. Confirmed by the codebase falling back to raw `<img>` in `components/home/Testimonials.tsx:78`, `components/home/BlogPreview.tsx:85`, and `app/(site)/blog/[slug]/page.tsx:228` | Add `{ protocol: "https", hostname: "cdn.sanity.io" }` to `images.remotePatterns`, then migrate these `<img>` tags to `next/image` for automatic AVIF/WebP, responsive `srcset`, and CLS-safe sizing |
| Performance/CWV | ✅ Pass | Confirmed | Homepage LCP hero image is correctly preloaded | `components/home/Hero.tsx:22-31` uses `<Image preload fetchPriority="high" .../>` — verified against the bundled Next.js 16 docs (`node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`): `priority` was deprecated in Next 16.0.0 in favor of the boolean `preload` prop, so this usage is correct, not a bug |
| Performance/CWV | ℹ️ Info | Hypothesis | Actual field/lab Core Web Vitals unmeasured | `scripts/pagespeed.py` requires a live fetch, which is unavailable in this environment | Run `python3 <SKILL_DIR>/scripts/pagespeed.py https://www.digitalnomadinspain.com --strategy mobile` from an environment with outbound network access |
| Images | ✅ Pass | Confirmed | Alt text is present and descriptive on nearly all images | e.g. `Hero.tsx:24` `alt="Barcelona Spain skyline"`, `Testimonials.tsx:78` `alt={t.name}`, decorative background images correctly use `alt=""` (`services/digital-nomad-visa/page.tsx:122`) | — |
| Images | ⚠️ Warning | Confirmed | Same `next/image` gap as above means no format/dimension optimization for CDN images | See Performance/CWV finding above | Same fix |
| GEO/AI | ✅ Pass | Confirmed | `robots.txt` does not block any AI crawler | `app/robots.ts` allows `userAgent: "*"` with only `/studio` and `/api` disallowed — GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc. are all implicitly allowed | — |
| GEO/AI | ℹ️ Info | Confirmed | No `llms.txt` present | `public/` contains only default `create-next-app` SVGs and `hero-barcelona.webp` — no `llms.txt` | Add a `public/llms.txt` (or `app/llms.txt/route.ts`) summarizing the site's purpose, key pages, and visa-consulting scope for AI answer engines |

---

## Unknowns and Follow-ups

To move `Hypothesis`/`Likely` items to `Confirmed`, from a network-enabled environment:
1. `curl -sIL https://digitalnomadinspain.com` and `https://www.digitalnomadinspain.com` — confirm which host is canonical and that the other 301-redirects to it.
2. `python3 scripts/pagespeed.py https://www.digitalnomadinspain.com --strategy mobile` — real LCP/INP/CLS numbers.
3. `python3 scripts/security_headers.py https://www.digitalnomadinspain.com` — confirm the headers in `next.config.ts` are actually served (and check for any CDN/Vercel-level overrides).
4. Pull one live BabyLoveGrowth `faqJsonLd` payload (via `lib/babylovegrowth.ts`'s `fetchArticleBySlug`, which requires `BABYLOVEGROWTH_API_KEY`) and inspect its `@type`.
5. `python3 scripts/robots_checker.py` and `llms_txt_checker.py` against the live site once network access is available.

---

## Page Score Card

```
Overall Score: 66/100  (Needs Improvement)

Technical SEO:      62/100  ██████░░░░
Content Quality:    78/100  ████████░░
On-Page SEO:        65/100  ██████░░░░
Schema/Structured:  72/100  ███████░░░
Performance (CWV):  55/100  █████░░░░░
Image Optimization: 58/100  █████░░░░░
AI Search (GEO):    60/100  ██████░░░░
```

- **Technical (62):** Positives — correct dynamic sitemap with `noIndex` filtering, sane robots.txt, security headers present, `buildMetadata` centralizes canonical/robots for the main money pages. Penalized by the `/contact` metadata gap (Critical, −15) and missing canonicals on 5 pages (Warning, −5).
- **Content (78):** Positives — genuinely long-form, specific content on service/FAQ pages (income tables, route comparisons, real numbers). Penalized by the byte-identical pricing boilerplate across the two service pages (Warning, −5).
- **On-Page (65):** Positives — one `<h1>` per page, logical heading hierarchy observed on every page checked. Penalized by the thin "About Us" title (Warning, −5) and the absolute-title/no-brand-suffix inconsistency (Info).
- **Schema (72):** Positives — sitewide `ProfessionalService` + `WebSite` + per-page `Service`/`BlogPosting` JSON-LD, correctly avoids the restricted `FAQPage` type on `/faq`. Penalized by the empty `sameAs` (Warning, −5) and the unvalidated third-party `faqJsonLd` injection (Warning, −5).
- **Performance (55):** Positives — hero LCP image correctly uses the (version-specific) `preload` API. Penalized hard by the sitewide `<img>` fallback for all Sanity content images (Critical, −15) and unmeasured live CWV (Info).
- **Images (58):** Positives — alt text discipline is consistently good across every component checked. Penalized by the same `next/image` optimization gap (Warning, −5).
- **GEO (60):** Positives — robots.txt doesn't block any AI crawler. Missing `llms.txt` keeps this from scoring higher (Info).
