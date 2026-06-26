const DEFAULT_STEPS = [
  { number: "01", title: "Check Eligibility", description: "Take our free 2-minute eligibility quiz to see if you qualify for the Digital Nomad Visa or Non-Lucrative Visa." },
  { number: "02", title: "Book a Consultation", description: "Schedule a 45-minute Zoom call with one of our visa experts. We'll map out your exact pathway and answer every question." },
  { number: "03", title: "Document Preparation", description: "We provide a personalised checklist and guide you through gathering, translating, and apostilling all required documents." },
  { number: "04", title: "Application & Approval", description: "We submit your complete application and handle all follow-up with the Spanish consulate. You relax — we manage the process." },
];

export default function HowItWorks({ data }: { data?: { howItWorksSteps?: typeof DEFAULT_STEPS } | null }) {
  const steps = data?.howItWorksSteps?.length ? data.howItWorksSteps : DEFAULT_STEPS;

  return (
    <section className="py-24 bg-[#F7F8FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#FF6B35] text-sm font-semibold uppercase tracking-wider">Simple Process</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F1F3D] mt-2 mb-4">How it works</h2>
          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            We&apos;ve helped hundreds of people move to Spain. Here&apos;s exactly how we do it.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-[#1B3A6B]/20 to-[#FF6B35]/20 -translate-x-4 z-0" />
              )}
              <div className="relative z-10 flex flex-col">
                <div className="w-16 h-16 rounded-2xl bg-[#1B3A6B] text-white flex items-center justify-center mb-5 shadow-lg">
                  <span className="text-xl font-bold text-[#FF6B35]">{step.number}</span>
                </div>
                <h3 className="text-lg font-bold text-[#0F1F3D] mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
