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
    name: "Spain Digital Nomad Visa Consulting",
    description: heroBody,
    provider: { "@type": "Organization", name: "Digital Nomad In Spain", url: "https://www.digitalnomadinspain.com" },
    areaServed: "Worldwide",
    url: "https://www.digitalnomadinspain.com/services/digital-nomad-visa",
    offers: { "@type": "Offer", price: pricingFrom.replace(/[€,]/g, ""), priceCurrency: "EUR", description: pricingNote },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.digitalnomadinspain.com" },
      { "@type": "ListItem", position: 2, name: "Services", item: "https://www.digitalnomadinspain.com/services" },
      { "@type": "ListItem", position: 3, name: "Digital Nomad Visa", item: "https://www.digitalnomadinspain.com/services/digital-nomad-visa" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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

              {/* Application route comparison */}
              <div>
                <h2 className="text-2xl font-bold text-[#0F1F3D] mb-2">
                  Two Ways to Apply
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Spain offers two distinct routes for the Digital Nomad Visa. The right one depends on where you are when you apply — and they have different income thresholds.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  {/* Consulate route */}
                  <div className="rounded-2xl border-2 border-[#1B3A6B]/20 bg-[#F7F9FD] p-5">
                    <div className="inline-flex items-center gap-2 bg-[#1B3A6B] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                      🏛️ Consulate Route
                    </div>
                    <p className="text-xs text-gray-500 mb-4">Apply from outside Spain at your nearest Spanish consulate</p>

                    <dl className="space-y-2.5 text-sm mb-4">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Who it&apos;s for</span>
                        <span className="font-medium text-[#0F1F3D] text-right">Living abroad</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Where you apply</span>
                        <span className="font-medium text-[#0F1F3D] text-right">Via BLS International</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Processing time</span>
                        <span className="font-medium text-[#0F1F3D] text-right">6–10 weeks</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Result</span>
                        <span className="font-medium text-[#0F1F3D] text-right">Type D visa → TIE</span>
                      </div>
                    </dl>

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
                      <div className="bg-[#1B3A6B] text-white text-xs font-semibold px-3 py-2">
                        Min. Income (2026)
                      </div>
                      {[
                        { size: "1 applicant", amount: "€2,646" },
                        { size: "2 applicants", amount: "€3,638" },
                        { size: "3 applicants", amount: "€3,969" },
                        { size: "4 applicants", amount: "€4,300" },
                        { size: "5 applicants", amount: "€4,631" },
                        { size: "6 applicants", amount: "€4,962" },
                      ].map((row) => (
                        <div key={row.size} className="flex justify-between px-3 py-2 border-b border-gray-100 last:border-0">
                          <span className="text-xs text-gray-500">{row.size}</span>
                          <span className="text-xs font-semibold text-[#1B3A6B]">{row.amount}/mo</span>
                        </div>
                      ))}
                    </div>

                    <ul className="space-y-1.5">
                      <li className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-green-500 shrink-0">✓</span>
                        Apply from the comfort of home
                      </li>
                      <li className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-green-500 shrink-0">✓</span>
                        Lower income threshold
                      </li>
                      <li className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-red-400 shrink-0">✗</span>
                        Longer processing time
                      </li>
                      <li className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-red-400 shrink-0">✗</span>
                        Quality varies by consulate
                      </li>
                    </ul>
                  </div>

                  {/* UGE route */}
                  <div className="rounded-2xl border-2 border-[#FF6B35]/30 bg-[#FFF8F5] p-5">
                    <div className="inline-flex items-center gap-2 bg-[#FF6B35] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                      🇪🇸 UGE Route (In Spain)
                    </div>
                    <p className="text-xs text-gray-500 mb-4">Apply directly in Spain through the UGE (Unidad de Grandes Empresas)</p>

                    <dl className="space-y-2.5 text-sm mb-4">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Who it&apos;s for</span>
                        <span className="font-medium text-[#0F1F3D] text-right">Already in Spain</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Where you apply</span>
                        <span className="font-medium text-[#0F1F3D] text-right">Online (digital cert. or via us)</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Processing time</span>
                        <span className="font-medium text-[#0F1F3D] text-right">20–45 days</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Result</span>
                        <span className="font-medium text-[#0F1F3D] text-right">Residency auth. → TIE</span>
                      </div>
                    </dl>

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
                      <div className="bg-[#FF6B35] text-white text-xs font-semibold px-3 py-2">
                        Min. Income (2026)
                      </div>
                      {[
                        { size: "1 applicant", amount: "€2,849" },
                        { size: "2 applicants", amount: "€3,917" },
                        { size: "3 applicants", amount: "€4,274" },
                        { size: "4 applicants", amount: "€4,630" },
                        { size: "5 applicants", amount: "€4,986" },
                        { size: "6 applicants", amount: "€5,342" },
                      ].map((row) => (
                        <div key={row.size} className="flex justify-between px-3 py-2 border-b border-gray-100 last:border-0">
                          <span className="text-xs text-gray-500">{row.size}</span>
                          <span className="text-xs font-semibold text-[#FF6B35]">{row.amount}/mo</span>
                        </div>
                      ))}
                    </div>

                    <ul className="space-y-1.5">
                      <li className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-green-500 shrink-0">✓</span>
                        Much faster processing
                      </li>
                      <li className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-green-500 shrink-0">✓</span>
                        Consistent, centralised office
                      </li>
                      <li className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-green-500 shrink-0">✓</span>
                        Live in Spain during process
                      </li>
                      <li className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-red-400 shrink-0">✗</span>
                        Higher income threshold
                      </li>
                    </ul>

                    <div className="mt-4 p-3 bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-xl flex items-start gap-2">
                      <span className="shrink-0 text-base">⭐</span>
                      <p className="text-xs text-[#0F1F3D] leading-relaxed">
                        <strong>Recommended if you can.</strong> If your nationality allows visa-free entry to Spain, or you&apos;re willing to get a Schengen tourist visa first — the UGE route is strongly advisable. Faster, more consistent, and you start your Spanish life immediately.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#EBF0FA] rounded-xl border border-[#1B3A6B]/10 flex items-start gap-3">
                  <span className="text-lg shrink-0">💡</span>
                  <p className="text-sm text-[#1B3A6B] leading-relaxed">
                    <strong>Not sure which route fits you?</strong> We help clients with both. Book a free consultation and we&apos;ll map out the right strategy based on where you are and your income situation.
                  </p>
                </div>
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
                className={`relative rounded-2xl p-8 ${pkg.popular ? "bg-[#1B3A6B] text-white" : "bg-white border border-gray-200"}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-6 bg-[#FF6B35] text-white text-xs font-bold px-3 py-1 rounded-full">
                    Popular
                  </div>
                )}
                <h3 className={`text-lg font-semibold mb-2 ${pkg.popular ? "text-white" : "text-[#0F1F3D]"}`}>{pkg.name}</h3>
                <div className={`text-4xl font-bold mb-3 ${pkg.popular ? "text-white" : "text-[#1B3A6B]"}`}>{pkg.price}</div>
                <p className={`text-sm mb-6 ${pkg.popular ? "text-blue-200" : "text-gray-500"}`}>{pkg.description}</p>
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${pkg.popular ? "text-blue-200" : "text-[#1B3A6B]"}`} />
                      <span className={pkg.popular ? "text-white" : "text-gray-700"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/book"
                  className={`block text-center px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
                    pkg.popular ? "bg-[#FF6B35] text-white hover:bg-[#E85520]" : "bg-[#1B3A6B] text-white hover:bg-[#0F1F3D]"
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
                  <div className="text-[#1B3A6B] font-bold text-sm mb-2">{addOn.price}</div>
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
