import { defineLive } from "next-sanity/live";
import { client } from "./sanity";

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({ apiVersion: "2025-01-01" }),
  // Server-side token for fetching draft content
  serverToken: process.env.SANITY_WRITE_TOKEN,
  // Browser-safe token for the live EventSource subscription
  browserToken: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});
