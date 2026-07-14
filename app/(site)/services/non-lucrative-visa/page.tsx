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
  const pricingNote = sanity?.pricingNote ?? "No hidden fees. Pay in 3 easy installments.";
  const pricingPackages = sanity?.pricingPackages?.length ? sanity.pricingPackages : [
    {
      name: "Standard Package",
      price: "€950",
      description: "For the independent nomad beginning their journey with foundational support.",
      features: ["List of required documents for the visa", "Personalized application review", "Assistance in scheduling visa and NIE appointments", "Submission of application if applying in Spain", "Unlimited email support"],
      popular: false,
    },
    {
      name: "Standard Plus Package",
      price: "€1,500",
      description: "For nomads who want to save on translation costs.",
      features: ["Everything in the Standard Package", "Translations of all your documents into Spanish (by a sworn and accredited translator)", "Assistance in scheduling TIE appointments"],
      popular: true,
    },
  ];
  const addOns = sanity?.addOns?.length ? sanity.addOns : [
    { name: "Appointments", price: "€100/appointment", description: "Assistance for NIE, TIE, and Regreso appointments and forms." },
    { name: "Apostilles", price: "TBD", description: "Get your documents from the US, Canada, and Australia apostilled." },
    { name: "Translations", price: "€30/page", description: "Get your documents translated by a sworn Spanish translator." },
  ];
  const dependentFeeNote = sanity?.dependentFeeNote ?? "€500 per additional dependent";
  const pricingFrom = pricingPackages[0]?.price ?? "€950";

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Spain Non-Lucrative Visa Consulting",
    description: heroBody,
    provider: { "@type": "Organization", name: "Digital Nomad In Spain", url: "https://www.digitalnomadinspain.com" },
    areaServed: "Worldwide",
    url: "https://www.digitalnomadinspain.com/services/non-lucrative-visa",
    offers: { "@type": "Offer", price: pricingFrom.replace(/[€,]/g, ""), priceCurrency: "EUR", description: pricingNote },
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

            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-[#F7F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F1F3D] mb-2">{pricingNote}</h2>
            <p className="text-gray-500 text-sm">Government fees extra. {dependentFeeNote} regardless of package.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
            {pricingPackages.map((pkg: { name: string; price: string; description: string; features: string[]; popular?: boolean }) => (
              <div
                key={pkg.name}
                className={`relative rounded-2xl p-8 ${pkg.popular ? "bg-[#0F1F3D] text-white" : "bg-white border border-gray-200"}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-6 bg-[#FF6B35] text-white text-xs font-bold px-3 py-1 rounded-full">
                    Popular
                  </div>
                )}
                <h3 className={`text-lg font-semibold mb-2 ${pkg.popular ? "text-white" : "text-[#0F1F3D]"}`}>{pkg.name}</h3>
                <div className={`text-4xl font-bold mb-3 ${pkg.popular ? "text-white" : "text-[#FF6B35]"}`}>{pkg.price}</div>
                <p className={`text-sm mb-6 ${pkg.popular ? "text-gray-300" : "text-gray-500"}`}>{pkg.description}</p>
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${pkg.popular ? "text-gray-300" : "text-[#FF6B35]"}`} />
                      <span className={pkg.popular ? "text-white" : "text-gray-700"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/book"
                  className={`block text-center px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
                    pkg.popular ? "bg-[#FF6B35] text-white hover:bg-[#E85520]" : "bg-[#0F1F3D] text-white hover:bg-black"
                  }`}
                >
                  Choose {pkg.name.replace(" Package", "")}
                </Link>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">Additional Services</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {addOns.map((addOn: { name: string; price: string; description: string }) => (
                <div key={addOn.name} className="bg-white border border-gray-200 rounded-2xl p-5 text-center">
                  <h4 className="font-semibold text-[#0F1F3D] mb-1">{addOn.name}</h4>
                  <div className="text-[#FF6B35] font-bold text-sm mb-2">{addOn.price}</div>
                  <p className="text-xs text-gray-500 leading-relaxed">{addOn.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
