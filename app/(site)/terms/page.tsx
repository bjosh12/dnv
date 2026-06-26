import type { Metadata } from "next";
import { SITE_NAME, CONTACT_EMAIL, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for ${SITE_NAME} visa consulting services.`,
};

export default function TermsPage() {
  return (
    <>
      <section className="bg-[#1B3A6B] pt-32 pb-12 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-blue-200">Last updated: January 1, 2025</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-gray-600">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-8">
              <p className="text-sm text-amber-800 font-medium">
                ⚠️ These terms are provided as a general framework. Please have
                them reviewed by a qualified legal professional before publishing.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-[#0F1F3D]">
              1. Agreement to Terms
            </h2>
            <p>
              By accessing or using the services of {SITE_NAME} (&quot;Company&quot;,
              &quot;we&quot;, &quot;us&quot;), you agree to be bound by these Terms of Service. If
              you do not agree, do not use our services.
            </p>

            <h2 className="text-2xl font-bold text-[#0F1F3D] mt-8">
              2. Services Provided
            </h2>
            <p>
              {SITE_NAME} provides visa consulting and document preparation
              assistance for Spanish residency visas. We are not a law firm and
              do not provide legal advice. Our services are consultancy in nature
              — we help prepare and organize applications, but final approval
              rests with Spanish government authorities.
            </p>

            <h2 className="text-2xl font-bold text-[#0F1F3D] mt-8">
              3. No Guarantee of Approval
            </h2>
            <p>
              While we maintain a high approval rate, we cannot guarantee visa
              approval. Spanish immigration authorities make final decisions.
              Changes in immigration law, consulate practices, or your personal
              circumstances may affect outcomes.
            </p>

            <h2 className="text-2xl font-bold text-[#0F1F3D] mt-8">
              4. Client Responsibilities
            </h2>
            <p>You agree to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide accurate and complete information</li>
              <li>Respond to requests for additional information promptly</li>
              <li>Disclose any factors that may affect your eligibility</li>
              <li>Pay agreed fees on time</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0F1F3D] mt-8">
              5. Fees and Refunds
            </h2>
            <p>
              Service fees are outlined in your engagement agreement. Fees paid
              for completed work (document preparation, translations arranged, etc.)
              are non-refundable. If your application is refused due to errors on
              our part, we will re-work the application at no additional charge.
            </p>

            <h2 className="text-2xl font-bold text-[#0F1F3D] mt-8">
              6. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, {SITE_NAME} is not liable
              for visa refusals, delays by government authorities, or losses
              arising from circumstances outside our reasonable control.
            </p>

            <h2 className="text-2xl font-bold text-[#0F1F3D] mt-8">
              7. Intellectual Property
            </h2>
            <p>
              All content on this website, including guides, articles, and
              tools, is the property of {SITE_NAME} and may not be reproduced
              without written permission.
            </p>

            <h2 className="text-2xl font-bold text-[#0F1F3D] mt-8">
              8. Governing Law
            </h2>
            <p>
              These terms are governed by the laws of Spain. Disputes shall be
              resolved in the courts of Spain.
            </p>

            <h2 className="text-2xl font-bold text-[#0F1F3D] mt-8">
              9. Contact
            </h2>
            <p>
              Questions about these terms? Email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#1B3A6B]">
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
