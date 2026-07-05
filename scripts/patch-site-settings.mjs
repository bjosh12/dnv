import { createClient } from "@sanity/client";
import { readFileSync } from "fs";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const token = env.match(/SANITY_WRITE_TOKEN=(.+)/)?.[1]?.trim();

const client = createClient({
  projectId: "wllgq317",
  dataset: "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

await client
  .patch("siteSettings")
  .set({
    contactEmail: "hello@digitalnomadinspain.com",
    socialLinks: {
      instagram: "https://instagram.com/digitalnomadinspain",
      facebook: "https://facebook.com/digitalnomadinspain",
      linkedin: "https://linkedin.com/company/digitalnomadinspain",
      youtube: "https://youtube.com/@digitalnomadinspain",
    },
  })
  .commit();

console.log("✅ siteSettings patched: contactEmail + socialLinks corrected");
