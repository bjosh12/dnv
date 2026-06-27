// Server component — answers are in initial HTML, fully indexable by Google and AI crawlers

type FaqItem = { _id?: string; q?: string; question?: string; a?: string; answer?: string };
type FaqSection = { category: string; questions: FaqItem[] };

export default function FaqAccordion({ sections }: { sections: FaqSection[] }) {
  return (
    <div className="space-y-12">
      {sections.map((section) => (
        <div key={section.category}>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-4 pb-2 border-b-2 border-[#FF6B35]">
            {section.category}
          </h2>
          <div className="space-y-1">
            {section.questions.map((faq, i) => {
              const question = faq.q ?? faq.question ?? "";
              const answer = faq.a ?? faq.answer ?? "";
              return (
                <details
                  key={faq._id ?? i}
                  className="group border-b border-gray-100 last:border-0"
                >
                  <summary className="flex items-start justify-between gap-4 py-4 cursor-pointer list-none text-left select-none">
                    <span className="font-medium text-[#0F1F3D] text-sm">{question}</span>
                    <span className="w-4 h-4 shrink-0 mt-0.5 text-gray-400 transition-transform group-open:rotate-180">
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </summary>
                  <p className="pb-4 text-sm text-gray-600 leading-relaxed">{answer}</p>
                </details>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
