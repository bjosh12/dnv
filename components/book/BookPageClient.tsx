"use client";

import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { BOOKING_URL, FREE_BOOKING_URL } from "@/lib/constants";
import { LakbyteAmbassadorBadge } from "@/components/ui/LakbyteBadge";

const DEFAULT_FREE_ITEMS = [
  "Quick eligibility check — find out if you qualify",
  "Simple Q&A about the DNV or NLV process",
  "Visa comparison — DNV vs NLV for your situation",
  "General guidance on next steps and timeline",
  "Honest referral to legal help if you need it",
];

const LEGAL_ITEMS = [
  "In-depth legal review of your full application",
  "Formal advice from a qualified immigration lawyer",
  "Document checklist tailored to your consulate",
  "Strategy for complex cases (employer issues, income edge cases)",
  "Written summary of advice provided",
];

type Tab = "free" | "legal";

export default function BookPageClient({ freeItems }: { freeItems?: string[] }) {
  const [active, setActive] = useState<Tab>("free");
  const items = freeItems?.length ? freeItems : DEFAULT_FREE_ITEMS;

  return (
    <>
      {/* Chooser cards */}
      <section className="py-12 bg-[#F7F8FC] border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-5">
            {/* Free card */}
            <button
              onClick={() => setActive("free")}
              className={`text-left p-6 rounded-2xl border-2 transition-all ${
                active === "free" ? "border-[#FF6B35] bg-white shadow-lg" : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full mb-2">FREE</span>
                  <h2 className="text-lg font-bold text-[#0F1F3D]">Advice Call with Joshua</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Lakbyte Ambassador · DNV Specialist</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${active === "free" ? "border-[#FF6B35] bg-[#FF6B35]" : "border-gray-300"}`}>
                  {active === "free" && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                A no-pressure call to check if you qualify, answer your burning questions, and figure out which visa route makes sense for you. Not a legal consultation — think of it as talking to someone who&apos;s been through it.
              </p>
              <ul className="space-y-1.5">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3 text-xs text-gray-500">
                <span>⏱️ 30 min</span><span>·</span><span>🎥 Zoom</span><span>·</span><span>💬 English / Spanish</span>
              </div>
            </button>

            {/* Legal card */}
            <button
              onClick={() => setActive("legal")}
              className={`text-left p-6 rounded-2xl border-2 transition-all ${
                active === "legal" ? "border-[#1B3A6B] bg-white shadow-lg" : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="inline-block bg-[#EBF0FA] text-[#1B3A6B] text-xs font-bold px-2.5 py-1 rounded-full mb-2">PAID</span>
                  <h2 className="text-lg font-bold text-[#0F1F3D]">Legal Consultation</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Via Lakbyte · Qualified immigration lawyers</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${active === "legal" ? "border-[#1B3A6B] bg-[#1B3A6B]" : "border-gray-300"}`}>
                  {active === "legal" && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                A formal session with a qualified Spanish immigration lawyer through the Lakbyte platform. The right choice if your case is complex, your employer situation is unusual, or you need legally binding advice.
              </p>
              <ul className="space-y-1.5">
                {LEGAL_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                    <Check className="w-3.5 h-3.5 text-[#1B3A6B] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3 text-xs text-gray-500">
                <span>⏱️ 45 min</span><span>·</span><span>🎥 Zoom</span><span>·</span><span>⚖️ Legal advice</span>
              </div>
            </button>
          </div>
          <p className="text-center text-xs text-gray-500 mt-5">
            Not sure which to pick?{" "}
            <span className="font-medium text-[#1B3A6B]">Start with the free call</span>{" "}
            — Joshua will tell you if you need to escalate to a lawyer.
          </p>
        </div>
      </section>

      {/* Booking widget */}
      <section className="py-12 bg-[#F7F8FC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {active === "free" ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-[#F7F8FC] flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#0F1F3D]">Book a free advice call with Joshua</p>
                  <p className="text-xs text-gray-500 mt-0.5">All times shown in your local timezone</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 font-bold px-2.5 py-1 rounded-full">FREE · No card required</span>
              </div>
              <iframe src={FREE_BOOKING_URL} width="100%" height="650" frameBorder="0" title="Book a free advice call with Joshua" className="w-full" />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-[#F7F8FC] flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#0F1F3D]">Book a legal consultation via Lakbyte</p>
                  <p className="text-xs text-gray-500 mt-0.5">Qualified immigration lawyers · Paid session</p>
                </div>
                <LakbyteAmbassadorBadge href="https://lakbyte.com" />
              </div>
              <iframe src={BOOKING_URL} width="100%" height="700" frameBorder="0" title="Book a legal consultation via Lakbyte" className="w-full" allow="payment" />
            </div>
          )}
        </div>
      </section>

      {/* Nudge */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Still on the fence? Run the free eligibility checker first — it takes 2 minutes and will tell you exactly where you stand before you book anything.
          </p>
          <a href="/eligibility" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#1B3A6B] text-[#1B3A6B] font-semibold text-sm hover:bg-[#1B3A6B] hover:text-white transition-all">
            Check eligibility first
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </>
  );
}
