import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = buildMetadata(undefined, {
  title: "Contact Us — Spain Visa Consultants",
  description:
    "Get in touch with Digital Nomad In Spain. Questions about the Digital Nomad Visa or Non-Lucrative Visa? Send us a message and we'll reply within 24 hours.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactForm />;
}
