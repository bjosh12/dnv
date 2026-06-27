import { createClient } from "@sanity/client";
import { readFileSync } from "fs";

const env = readFileSync(".env.local", "utf8");
const token = env.match(/SANITY_WRITE_TOKEN=(.+)/)?.[1]?.trim();

const client = createClient({
  projectId: "wllgq317",
  dataset: "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const result = await client
  .patch("8QUhaZiXPU4aVA3z9q3Muh")
  .set({
    seo: {
      _type: "seoObject",
      title: "Spain Digital Nomad Visa: Complete 2026 Guide",
      description: "Your complete 2026 guide to Spain's Digital Nomad Visa — eligibility, income thresholds, required documents, tax benefits, and how to apply.",
    },
  })
  .commit();

console.log("✅ SEO fields patched on:", result._id);
