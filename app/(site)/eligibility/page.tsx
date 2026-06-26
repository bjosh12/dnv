import type { Metadata } from "next";
import EligibilityChecker from "@/components/eligibility/EligibilityChecker";

export const metadata: Metadata = {
  title: "Eligibility Checker",
  description:
    "Find out in 2 minutes whether you qualify for Spain's Digital Nomad Visa or Non-Lucrative Visa. Free instant eligibility check.",
};

export default function EligibilityPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-[#1B3A6B] to-[#0F1F3D] pt-32 pb-16 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 bg-[#FF6B35]/20 border border-[#FF6B35]/40 text-[#FF6B35] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            Free · Instant · No signup required
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Check Your Eligibility
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            Answer 6 quick questions and find out which Spanish residency visa
            is right for you — no email required, results in under 2 minutes.
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
