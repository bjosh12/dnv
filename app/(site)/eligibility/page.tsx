import type { Metadata } from "next";
import EligibilityChecker from "@/components/eligibility/EligibilityChecker";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Eligibility Checker",
  description:
    "Find out in 2 minutes whether you qualify for Spain's Digital Nomad Visa or Non-Lucrative Visa. Free personalized assessment sent to your email.",
  alternates: { canonical: `${SITE_URL}/eligibility` },
};

export default function EligibilityPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-[#1B3A6B] to-[#0F1F3D] pt-32 pb-16 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 bg-[#FF6B35]/20 border border-[#FF6B35]/40 text-[#FF6B35] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            Free · Personalized · Results in 2 minutes
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Check Your Eligibility
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            Answer 6 quick sections and get a free personalized assessment of
            your Spanish visa eligibility — on screen and in your inbox.
          </p>
        </div>
      </section>

      {/* Checker */}
      <section className="py-16 bg-[#F7F8FC]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <EligibilityChecker />

          <p className="text-center text-xs text-gray-500 mt-6 max-w-md mx-auto leading-relaxed">
            This checker provides general guidance based on common criteria.
            Individual circumstances vary. Always consult a qualified immigration
            expert before submitting an application.
          </p>
        </div>
      </section>
    </>
  );
}
