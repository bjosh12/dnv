import { draftMode } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight, AlertCircle } from "lucide-react";
import { getServiceContent } from "@/lib/sanity";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getServiceContent("digital-nomad-visa").catch(() => null);
  return buildMetadata(s?.seo, {
    title: "Spain's Digital Nomad Visa — Requirements & Application Guide",
    description: "Complete guide to Spain's Digital Nomad Visa (DNV). Requirements, income thresholds, documents, processing times, and expert support.",
    path: "/services/digital-nomad-visa",
  });
}

const requirements = [
  "Non-EU/EEA nationality",
  "Work remotely for a non-Spanish employer or clients",
  "Minimum 1 year of employment/freelance history",
  "Monthly income of at least €2,646 (200% of Spain's minimum wage)",
  "Valid private health insurance covering Spain",
  "Clean criminal record (apostilled)",
  "No prior Spanish visa violations",
];

const documents = [
  { item: "Valid passport (6+ months remaining)", note: "Copy of all pages" },
  { item: "Completed national visa application form", note: "Form EX-01" },
  { item: "Recent passport-sized photos", note: "2 photos, white background" },
  { item: "Criminal record certificate", note: "Apostilled & translated" },
  { item: "Proof of remote work", note: "Employment contract or client contracts" },
  { item: "Income documentation", note: "3+ months bank statements + payslips or invoices" },
  { item: "Private health insurance policy", note: "Valid in Spain, no co-payment clause" },
  { item: "Proof of address in Spain (or intent)", note: "Rental agreement or letter of intent" },
  { item: "Company registration documents", note: "If self-employed/freelancer" },
];

const faqs = [
  {
    q: "Can I work for Spanish companies on the DNV?",
    a: "Yes, up to 20% of your total income can come from Spanish clients or companies. Beyond that, you'd need a different authorization.",
  },
  {
    q: "How long does the process take?",
    a: "Typically 6–10 weeks from submitting a complete application. Incomplete applications significantly extend this timeline.",
  },
  {
    q: "Can I include my family?",
    a: "Yes. Your spouse, registered partner, and dependent children can apply as family unit members alongside your main application.",
  },
  {
    q: "Do I pay taxes in Spain on the DNV?",
    a: "If you spend 183+ days in Spain in a calendar year, you become a Spanish tax resident. However, you may qualify for the Beckham Law (flat 24% tax rate on Spanish income) for the first 5 years.",
  },
];

export default async function DigitalNomadVisaPage() {
  const { isEnabled: preview } = await draftMode();
  const sanity = await getServiceContent("digital-nomad-visa", preview).catch(() => null);

  const req = sanity?.requirements?.length ? sanity.requirements : requirements;
  const docs = sanity?.documents?.length ? sanity.documents : documents;
  const faqList = sanity?.faqs?.length ? sanity.faqs : faqs;
  const facts = sanity?.quickFacts?.length ? sanity.quickFacts : [
    { label: "Min. Income", value: "€2,646/month" },
    { label: "Initial Duration", value: "1 year" },
    { label: "Max Renewal", value: "3 years" },
    { label: "Processing Time", value: "6–10 weeks" },
    { label: "Apply From", value: "Spanish Consulate" },
    { label: "Right to Work", value: "Remote only" },
  ];
  const heroHeadline = sanity?.heroHeadline ?? "Spain's Digital Nomad Visa";
  const heroBody = sanity?.heroBody ?? "The legal way for remote workers and freelancers to live and work from Spain. Our team has helped hundreds of digital nomads secure their DNV with a 98% approval rate.";
  const pricingFrom = sanity?.pricingFrom ?? "€1,499";
  const pricingNote = sanity?.pricingNote ?? "Full end-to-end service. Government fees extra.";
  const pricingIncludes = sanity?.pricingIncludes?.length ? sanity.pricingIncludes : ["Document checklist & guidance", "Translation coordination", "Application preparation", "Consulate submission support", "Follow-up & queries"];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-[#1B3A6B]">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1920&q=60"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-blue-300 text-sm mb-6 hover:text-white transition-colors"
            >
              ← All Services
            </Link>
            <div className="inline-flex items-center gap-2 bg-[#FF6B35]/20 border border-[#FF6B35]/40 text-[#FF6B35] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              Spain&apos;s Ley de Startups — 2023
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              {heroHeadline}
            </h1>
            <p className="text-blue-200 text-lg leading-relaxed mb-8">
              {heroBody}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/book"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FF6B35] text-white font-semibold text-sm hover:bg-[#E85520] transition-colors"
              >
                Book Free Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/eligibility"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold text-sm hover:bg-white/20 transition-colors border border-white/30"
              >
                Check My Eligibility
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-12">
              {/* What is it */}
              <div>
                <h2 className="text-2xl font-bold text-[#0F1F3D] mb-4">
                  What is the Digital Nomad Visa?
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Spain&apos;s Digital Nomad Visa (officially the &quot;Authorization for
                  International Remote Work Activity&quot;) was introduced in January
                  2023 under the Startup Law (Ley 28/2022). It allows non-EU
                  citizens to live in Spain while working remotely for companies
                  or clients based outside Spain.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Unlike tourist visas or short stays, the DNV grants you full
                  legal residency status, access to the Spanish healthcare
                  system (after registering your TIE), and the ability to open
                  Spanish bank accounts and sign rental contracts.
                </p>
              </div>

              {/* Requirements */}
              <div>
                <h2 className="text-2xl font-bold text-[#0F1F3D] mb-4">
                  Eligibility Requirements
                </h2>
                <ul className="space-y-3">
                  {req.map((r: string) => (
                    <li key={r} className="flex items-start gap-3 p-3 bg-[#F7F8FC] rounded-xl">
                      <Check className="w-5 h-5 text-[#1B3A6B] shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Documents */}
              <div>
                <h2 className="text-2xl font-bold text-[#0F1F3D] mb-4">
                  Required Documents
                </h2>
                <div className="space-y-3">
                  {docs.map((doc: { item: string; note: string }) => (
                    <div key={doc.item} className="flex items-start gap-3 border-b border-gray-100 pb-3">
                      <div className="w-5 h-5 rounded-full bg-[#EBF0FA] flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-[#1B3A6B]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0F1F3D]">{doc.item}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{doc.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    All foreign documents must be officially translated into
                    Spanish by a sworn translator and apostilled under the Hague
                    Convention. We handle all of this for our clients.
                  </p>
                </div>
              </div>

              {/* FAQs */}
              <div>
                <h2 className="text-2xl font-bold text-[#0F1F3D] mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {faqList.map((faq: { q: string; a: string }, i: number) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-5">
                      <h3 className="font-semibold text-[#0F1F3D] text-sm mb-2">{faq.q}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick facts */}
              <div className="bg-[#1B3A6B] text-white rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4">Quick Facts</h3>
                <dl className="space-y-3 text-sm">
                  {facts.map(({ label, value }: { label: string; value: string }) => (
                    <div key={label} className="flex justify-between border-b border-white/10 pb-3">
                      <span className="text-blue-200">{label}</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  ))}
                </dl>
              </div>

              {/* CTA card */}
              <div className="bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-2xl p-6">
                <h3 className="font-bold text-[#0F1F3D] mb-2">
                  Ready to apply?
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Book a free 45-minute consultation. We&apos;ll review your
                  situation and give you a clear action plan.
                </p>
                <Link href="/book"
                  className="block text-center px-4 py-3 rounded-xl bg-[#FF6B35] text-white font-semibold text-sm hover:bg-[#E85520] transition-colors"
                >
                  Book Free Consultation
                </Link>
                <Link
                  href="/eligibility"
                  className="block text-center mt-2 px-4 py-3 rounded-xl border border-[#1B3A6B] text-[#1B3A6B] font-semibold text-sm hover:bg-[#1B3A6B] hover:text-white transition-all"
                >
                  Check Eligibility
                </Link>
              </div>

              {/* Pricing */}
              <div className="border border-gray-200 rounded-2xl p-6">
                <h3 className="font-bold text-[#0F1F3D] mb-2">Our Fee</h3>
                <div className="text-3xl font-bold text-[#1B3A6B] mb-1">
                  From {pricingFrom}
                </div>
                <p className="text-xs text-gray-500 mb-4">{pricingNote}</p>
                <ul className="space-y-2 text-xs text-gray-600">
                  {pricingIncludes.map((item: string) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#1B3A6B]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
