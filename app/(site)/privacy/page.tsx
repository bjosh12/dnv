import type { Metadata } from "next";
import { SITE_NAME, CONTACT_EMAIL, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE_NAME} — how we collect, use, and protect your personal data.`,
};

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-[#1B3A6B] pt-32 pb-12 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-blue-200">Last updated: January 1, 2025</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-gray-600">
            <h2 className="text-2xl font-bold text-[#0F1F3D]">1. Who We Are</h2>
            <p>
              {SITE_NAME} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the website at{" "}
              <a href={SITE_URL} className="text-[#1B3A6B]">{SITE_URL}</a>. We are
              a visa consultancy service based in Spain, subject to Spanish data
              protection law and the European Union General Data Protection
              Regulation (GDPR).
            </p>
            <p>
              Contact us at:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#1B3A6B]">
                {CONTACT_EMAIL}
              </a>
            </p>

            <h2 className="text-2xl font-bold text-[#0F1F3D] mt-8">
              2. What Data We Collect
            </h2>
            <p>We collect the following personal data:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Name and email address (when you contact us or subscribe to our newsletter)</li>
              <li>Phone number (if you provide it)</li>
              <li>Information you share in consultation bookings or contact forms</li>
              <li>Usage data (pages visited, time on site) via anonymous analytics</li>
              <li>Cookie data (see Section 6)</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0F1F3D] mt-8">
              3. How We Use Your Data
            </h2>
            <p>We use your data to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Respond to your enquiries and provide consultation services</li>
              <li>Send our newsletter (only with your explicit consent)</li>
              <li>Improve our website and services</li>
              <li>Meet legal obligations</li>
            </ul>
            <p>We do not sell your personal data to third parties.</p>

            <h2 className="text-2xl font-bold text-[#0F1F3D] mt-8">
              4. Legal Basis for Processing
            </h2>
            <p>We process your data on the following legal bases:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Contract:</strong> to provide services you request</li>
              <li><strong>Consent:</strong> for newsletter subscriptions and non-essential cookies</li>
              <li><strong>Legitimate interests:</strong> for website security and service improvement</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0F1F3D] mt-8">
              5. Data Retention
            </h2>
            <p>
              We retain your data for as long as necessary to provide our services
              or as required by law. Contact form submissions are retained for 2
              years. Newsletter subscriptions until you unsubscribe.
            </p>

            <h2 className="text-2xl font-bold text-[#0F1F3D] mt-8">6. Cookies</h2>
            <p>
              We use essential cookies to operate the website and, with your
              consent, analytics cookies to understand how visitors use the site.
              You can manage your cookie preferences via our cookie banner.
            </p>

            <h2 className="text-2xl font-bold text-[#0F1F3D] mt-8">7. Your Rights</h2>
            <p>Under GDPR, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p>
              To exercise these rights, email us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#1B3A6B]">
                {CONTACT_EMAIL}
              </a>
              . You also have the right to lodge a complaint with Spain&apos;s data
              protection authority (AEPD).
            </p>

            <h2 className="text-2xl font-bold text-[#0F1F3D] mt-8">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Material
              changes will be notified via email or a prominent notice on our
              website.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
