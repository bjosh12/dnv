"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = { _id?: string; q?: string; question?: string; a?: string; answer?: string };
type FaqSection = { category: string; questions: FaqItem[] };

function FaqItemRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-4 text-left"
      >
        <span className="font-medium text-[#0F1F3D] text-sm">{q}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 mt-0.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="pb-4 text-sm text-gray-600 leading-relaxed">{a}</p>}
    </div>
  );
}

export default function FaqAccordion({ sections }: { sections: FaqSection[] }) {
  return (
    <div className="space-y-12">
      {sections.map((section) => (
        <div key={section.category}>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-4 pb-2 border-b-2 border-[#FF6B35]">
            {section.category}
          </h2>
          <div>
            {section.questions.map((faq, i) => (
              <FaqItemRow
                key={faq._id ?? i}
                q={faq.q ?? faq.question ?? ""}
                a={faq.a ?? faq.answer ?? ""}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
