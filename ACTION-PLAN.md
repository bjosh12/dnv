# SEO Action Plan — digitalnomadinspain.com

Derived from `FULL-AUDIT-REPORT.md`. Ordered by execution priority: immediate blockers → quick wins → strategic improvements. All fixes below are scoped to source files already identified — no live-site access is required to implement any of them.

---

## 1. Immediate Blockers (Critical)

### 1.1 Give `/contact` real metadata
- **Why:** It currently has none — Google sees the homepage's title/description on this page too (`app/(site)/contact/page.tsx` is `"use client"` with no `metadata` export).
- **Fix:**
  1. Rename the current file's body to a new client component, e.g. `components/contact/ContactForm.tsx`.
  2. Make `app/(site)/contact/page.tsx` a plain Server Component that:
     ```tsx
     import type { Metadata } from "next";
     import { buildMetadata } from "@/lib/seo";
     import ContactForm from "@/components/contact/ContactForm";

     export const metadata: Metadata = buildMetadata(undefined, {
       title: "Contact Us — Spain Visa Consultants",
       description: "Get in touch with Digital Nomad In Spain. Questions about the Digital Nomad Visa or Non-Lucrative Visa? Send us a message.",
       path: "/contact",
     });

     export default function ContactPage() {
       return <ContactForm />;
     }
     ```
- **Effort:** Low | **Classification:** Quick win

### 1.2 Add `cdn.sanity.io` to `next/image` remote patterns and migrate `<img>` usage
- **Why:** Every Sanity-sourced image (blog cards, blog post hero, testimonial avatars) currently bypasses Next's image pipeline entirely — no AVIF/WebP, no responsive `srcset`, larger payloads hurting LCP sitewide.
- **Fix:**
  1. In `next.config.ts`, add to `images.remotePatterns`:
     ```ts
     { protocol: "https", hostname: "cdn.sanity.io" },
     ```
  2. Replace the raw `<img>` tags with `next/image`'s `<Image>` in:
     - `components/home/Testimonials.tsx:78`
     - `components/home/BlogPreview.tsx:85`
     - `app/(site)/blog/[slug]/page.tsx:228` (the `BlogHero` function)
  3. Set explicit `width`/`height` (or `fill` with a sized wrapper, which these components already have via fixed-height containers) to preserve CLS protection.
- **Effort:** Medium | **Classification:** Quick win (high impact, low-medium effort)

---

## 2. Quick Wins (Warning-level, low effort)

### 2.1 Add canonical tags to the 5 pages missing them
Add `alternates: { canonical: \`${SITE_URL}/<path>\` }` to the `metadata` object in:
- `app/(site)/privacy/page.tsx`
- `app/(site)/terms/page.tsx`
- `app/(site)/book/page.tsx`
- `app/(site)/eligibility/page.tsx`
- `app/(site)/services/page.tsx`

Import `SITE_URL` from `@/lib/constants` (already the pattern used in `faq/page.tsx` and `blog/page.tsx`).

### 2.2 Wire `SOCIAL_LINKS` into the Organization schema's `sameAs`
In `app/layout.tsx`, replace `sameAs: []` with:
```ts
sameAs: Object.values(SOCIAL_LINKS),
```
(import `SOCIAL_LINKS` from `@/lib/constants` alongside the existing constants import on line 4).

### 2.3 Rewrite the `/about` title tag
In `app/(site)/about/page.tsx:14`, replace:
```ts
title: "About Us",
```
with something in the 30-60 character range, e.g.:
```ts
title: "About Us — Spain Visa Experts | Digital Nomad In Spain",
```

### 2.4 Differentiate the pricing/add-on boilerplate between the two service pages
Rewrite the `pricingPackages`/`addOns` fallback copy in `services/non-lucrative-visa/page.tsx` so it isn't byte-identical to `services/digital-nomad-visa/page.tsx` — vary the framing/features language to reflect the different visa (e.g. NLV has no work-related paperwork, so "Assistance in scheduling visa and NIE appointments" language should reflect that).

---

## 3. Strategic Improvements (higher effort, plan for next sprint)

### 3.1 Add `BreadcrumbList` JSON-LD
Add breadcrumb schema to service pages (`Home → Services → Digital Nomad Visa`) and blog posts (`Home → Blog → [Post Title]`). Use the `BreadcrumbList` template pattern already established for the other JSON-LD blocks in this codebase (inline `<script type="application/ld+json">`).

### 3.2 Validate and gate the third-party `faqJsonLd` from BabyLoveGrowth
Before the next content sync, fetch one real article via `fetchArticleBySlug` and inspect the `faqJsonLd.@type`. If it's `FAQPage`, strip it in `lib/babylovegrowth.ts` before it reaches `app/(site)/blog/[slug]/page.tsx:89-91` — this site is not government/healthcare, so `FAQPage` schema will never earn rich results and risks being flagged as schema misuse.

### 3.3 Track real `dateModified` for blog posts
Add an `updatedAt` field to the Sanity `post` schema (in the Studio schema definitions, not reviewed in this audit) and pass it into `BlogPosting.dateModified` in `app/(site)/blog/[slug]/page.tsx:144` instead of reusing `publishedAt`.

### 3.4 Add `llms.txt`
Create `public/llms.txt` summarizing the business, core services (Digital Nomad Visa, Non-Lucrative Visa consulting), and links to key pages, for AI answer-engine readability (GEO).

### 3.5 Reassess the omitted `X-Frame-Options`
`next.config.ts` currently omits frame protection sitewide to support the Sanity Presentation tool. Consider scoping this with a `Content-Security-Policy: frame-ancestors 'self' https://*.sanity.io` instead of no protection at all.

---

## Verification Once Network Access Is Available

Run these against the live site to confirm the `Hypothesis`/`Likely` items in the full report and validate the fixes above post-deploy:
```bash
curl -sIL https://digitalnomadinspain.com
curl -sIL https://www.digitalnomadinspain.com
python3 <SKILL_DIR>/scripts/pagespeed.py https://www.digitalnomadinspain.com --strategy mobile
python3 <SKILL_DIR>/scripts/security_headers.py https://www.digitalnomadinspain.com
python3 <SKILL_DIR>/scripts/robots_checker.py https://www.digitalnomadinspain.com
python3 <SKILL_DIR>/scripts/llms_txt_checker.py https://www.digitalnomadinspain.com
python3 <SKILL_DIR>/scripts/validate_schema.py <fetched-page.html>
```
