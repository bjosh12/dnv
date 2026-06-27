import { draftMode } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight, AlertCircle } from "lucide-react";
import { getServiceContent } from "@/lib/sanity";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getServiceContent("non-lucrative-visa").catch(() => null);
  return buildMetadata(s?.seo, {
    title: "Spain's Non-Lucrative Visa — Requirements & Application Guide",
    description: "Complete guide to Spain's Non-Lucrative Visa (NLV). Requirements, income proof, documents, timeline, and expert application support.",
    path: "/services/non-lucrative-visa",
  });
}

const requirements = [
  "Non-EU/EEA nationality",
  "Sufficient financial means (no employment required)",
  "Monthly income of at least €2,400 (living costs threshold)",
  "Private health insurance covering Spain (no co-payment)",
  "Clean criminal record (apostilled)",
  "Medical certificate (no contagious diseases)",
  "Commitment not to work in Spain during the visa period",
];

const documents = [
  { item: "Valid passport (6+ months remaining)", note: "Certified copy of all pages" },
  { item: "Completed national visa form (EX-01)", note: "2 copies signed" },
  { item: "Recent passport-sized photos", note: "2 photos, white background" },
  { item: "Criminal record certificate", note: "Apostilled & translated" },
  { item: "Medical certificate", note: "From your GP, apostilled" },
  { item: "Proof of sufficient income", note: "Bank statements, pension, investment income" },
  { item: "Private health insurance", note: "Full coverage, no co-payment, no time limit" },
  { item: "Proof of accommodation in Spain", note: "Rental contract or property ownership" },
];

const faqs = [
  {
    q: "Can I work at all on a Non-Lucrative Visa?",
    a: "No. The NLV explicitly prohibits any gainful employment in Spain, including remote work for international clients. If you need to work, consider the Digital Nomad Visa instead.",
  },
  {
    q: "What counts as 'sufficient income'?",
    a: "You need to demonstrate approximately €2,400/month for yourself, plus around €600/month for each additional family member. This can come from pensions, savings, investments, rental income, or other passive sources.",
  },
  {
    q: "How long does the initial visa last?",
    a: "The initial NLV is granted for 1 year. After that, you can renew for 2-year periods. After 5 years, you can apply for long-term residency.",
  },
  {
    q: "Do I have to stay in Spain?",
    a: "You must spend at least 6 months per year in Spain (183 days) to maintain your residency status. Going below this may jeopardize renewal.",
  },
];

export default async function NonLucrativeVisaPage() {
  const { isEnabled: preview } = await draftMode();
  const sanity = await getServiceContent("non-lucrative-visa", preview).catch(() => null);

  const req = sanity?.requirements?.length ? sanity.requirements : requirements;
  const docs = sanity?.documents?.length ? sanity.documents : documents;
  const faqList = sanity?.faqs?.length ? sanity.faqs : faqs;
  const facts = sanity?.quickFacts?.length ? sanity.quickFacts : [
    { label: "Min. Income", value: "€2,400/month" },
    { label: "Initial Duration", value: "1 year" },
    { label: "Renewal", value: "2-year periods" },
    { label: "Processing Time", value: "8–12 weeks" },
    { label: "Apply From", value: "Spanish Consulate" },
    { label: "Right to Work", value: "No" },
  ];
  const heroHeadline = sanity?.heroHeadline ?? "Spain's Non-Lucrative Visa";
  const heroBody = sanity?.heroBody ?? "Live the good life in Spain without working. The Non-Lucrative Visa is the classic route for retirees, passive income earners, and anyone financially independent.";
  const pricingFrom = sanity?.pricingFrom ?? "€1,299";
  const pricingNote = sanity?.pricingNote ?? "Full end-to-end service. Government fees extra.";
  const pricingIncludes = sanity?.pricingIncludes?.length ? sanity.pricingIncludes : ["Personalised document checklist", "Income verification guidance", "Document translation coordination", "Application preparation & review", "Consulate appointment support"];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Spain Non-Lucrative Visa Consulting",
    description: heroBody,
    provider: { "@type": "Organization", name: "Digital Nomad In Spain", url: "https://www.digitalnomadinspain.com" },
    areaServed: "Worldwide",
    url: "https://www.digitalnomadinspain.com/services/non-lucrative-visa",
    offers: { "@type": "Offer", price: pricingFrom.replace("€", ""), priceCurrency: "EUR", description: pricingNote },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-[#0F1F3D]">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=60"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-gray-400 text-sm mb-6 hover:text-white transition-colors"
            >
              ← All Services
            </Link>
            <div className="inline-flex items-center gap-2 bg-[#FF6B35]/20 border border-[#FF6B35]/40 text-[#FF6B35] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              Ideal for Retirees & Passive Income
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              {heroHeadline}
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
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
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-2xl font-bold text-[#0F1F3D] mb-4">
                  What is the Non-Lucrative Visa?
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  The Non-Lucrative Visa (NLV) is one of Spain&apos;s most popular
                  long-stay visas for non-EU citizens. It grants the right to
                  reside in Spain without the right to work — making it ideal
                  for retirees, those living off passive income, or anyone who
                  wants to enjoy the Spanish lifestyle without employment.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  The NLV is applied for at the Spanish consulate in your home
                  country and, once approved, gives you the right to live in
                  Spain for up to one year initially, with renewal options for
                  longer periods.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#0F1F3D] mb-4">
                  Eligibility Requirements
                </h2>
                <ul className="space-y-3">
                  {req.map((r: string) => (
                    <li key={r} className="flex items-start gap-3 p-3 bg-[#F7F8FC] rounded-xl">
                      <Check className="w-5 h-5 text-[#FF6B35] shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#0F1F3D] mb-4">
                  Required Documents
                </h2>
                <div className="space-y-3">
                  {docs.map((doc: { item: string; note: string }) => (
                    <div key={doc.item} className="flex items-start gap-3 border-b border-gray-100 pb-3">
                      <div className="w-5 h-5 rounded-full bg-[#FFF4EF] flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-[#FF6B35]" />
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
                    Document requirements vary slightly by consulate. We ensure
                    your application is tailored to your specific consulate&apos;s
                    requirements to avoid rejections.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#0F1F3D] mb-6">FAQs</h2>
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
              <div className="bg-[#0F1F3D] text-white rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4">Quick Facts</h3>
                <dl className="space-y-3 text-sm">
                  {facts.map(({ label, value }: { label: string; value: string }) => (
                    <div key={label} className="flex justify-between border-b border-white/10 pb-3">
                      <span className="text-gray-400">{label}</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="bg-[#FFF4EF] border border-[#FF6B35]/20 rounded-2xl p-6">
                <h3 className="font-bold text-[#0F1F3D] mb-2">Ready to apply?</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Let&apos;s review your income sources and build your perfect
                  application package together.
                </p>
                <Link href="/book"
                  className="block text-center px-4 py-3 rounded-xl bg-[#FF6B35] text-white font-semibold text-sm hover:bg-[#E85520] transition-colors"
                >
                  Book Free Consultation
                </Link>
              </div>

              <div className="border border-gray-200 rounded-2xl p-6">
                <h3 className="font-bold text-[#0F1F3D] mb-2">Our Fee</h3>
                <div className="text-3xl font-bold text-[#FF6B35] mb-1">From {pricingFrom}</div>
                <p className="text-xs text-gray-500 mb-4">{pricingNote}</p>
                <ul className="space-y-2 text-xs text-gray-600">
                  {pricingIncludes.map((item: string) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FF6B35]" />
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
