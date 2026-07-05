import { draftMode } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FaqAccordion from "@/components/faq/FaqAccordion";
import { getFaqItems } from "@/lib/sanity";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: { absolute: "FAQ — Spain Visa Questions Answered | Digital Nomad In Spain" },
  description: "Everything you need to know about Spain's Digital Nomad Visa and Non-Lucrative Visa — income thresholds, documents, timelines, and more.",
  alternates: { canonical: `${SITE_URL}/faq` },
  robots: "index,follow",
};

export const revalidate = 60;

const DEFAULT_FAQS = [
  {
    category: "Digital Nomad Visa",
    questions: [
      { q: "What is Spain's Digital Nomad Visa?", a: "Spain's Digital Nomad Visa (officially: Authorization for International Remote Work Activity) was introduced in January 2023 under the Startup Law (Ley 28/2022). It allows non-EU citizens to live in Spain while working remotely for foreign employers or clients." },
      { q: "How much income do I need for the Digital Nomad Visa?", a: "You need a minimum of 200% of Spain's monthly minimum wage (SMI), which currently equates to approximately €2,646/month. This threshold is adjusted when Spain's minimum wage changes." },
      { q: "Can I be a freelancer/self-employed for the DNV?", a: "Yes! Freelancers and self-employed workers are eligible. You need to demonstrate at least 1 year of remote working history and provide client contracts or invoices showing consistent income." },
      { q: "How long does the DNV last?", a: "The initial DNV is valid for 1 year. It can be renewed for up to 3 years (in one 2-year renewal). After 5 years of legal residency, you may apply for long-term residency." },
      { q: "Can I work for Spanish companies on the DNV?", a: "Yes, but with limits. Up to 20% of your total income can come from Spanish companies or clients. If you exceed this, you'll need a different work authorization." },
    ],
  },
  {
    category: "Non-Lucrative Visa",
    questions: [
      { q: "What is the Non-Lucrative Visa (NLV)?", a: "The NLV allows non-EU citizens to live in Spain without the right to work. It's intended for financially independent individuals who can support themselves through savings, pensions, passive income, or investments." },
      { q: "How much money do I need for the Non-Lucrative Visa?", a: "Generally, you need to demonstrate approximately €2,400/month for the main applicant, plus ~€600/month for each additional family member. Requirements can vary slightly by consulate." },
      { q: "Can I work remotely on the Non-Lucrative Visa?", a: "No. The NLV explicitly prohibits any gainful employment in Spain, including remote work for foreign companies. If you need to work, you should apply for the Digital Nomad Visa instead." },
      { q: "How long does the NLV last?", a: "The initial NLV is granted for 1 year. After that, you can renew in 2-year increments. You must spend at least 6 months per year in Spain to maintain your residency." },
    ],
  },
  {
    category: "Documents & Process",
    questions: [
      { q: "What is an apostille and do I need one?", a: "An apostille is an internationally recognized certification that authenticates official documents for use in other countries. Both the DNV and NLV require key documents to be apostilled under the Hague Convention." },
      { q: "Where do I apply for a Spain visa?", a: "You apply at the Spanish consulate in your country of residence. The consulate you apply through can affect document requirements and processing times — something we help clients navigate." },
      { q: "How long does the visa process take?", a: "For the DNV, typically 6–10 weeks from a complete submission. For the NLV, 8–12 weeks. Incomplete or incorrectly prepared applications significantly extend timelines." },
      { q: "Can I apply while already in Spain?", a: "Generally, you must apply from your home country at a Spanish consulate. However, some exceptions exist. We recommend consulting with us to understand your specific situation." },
    ],
  },
  {
    category: "After Approval",
    questions: [
      { q: "What is a TIE card and do I need one?", a: "The TIE (Tarjeta de Identidad de Extranjero) is your Spanish residency card. After arriving in Spain with your visa, you must apply for a TIE at a local National Police station within 30 days." },
      { q: "Do I have to pay taxes in Spain?", a: "If you spend 183+ days per year in Spain, you become a Spanish tax resident. DNV holders may qualify for Spain's Beckham Law, which applies a flat 24% tax rate on Spanish-sourced income for the first 5 years." },
      { q: "Can my family join me in Spain?", a: "Yes. Both the DNV and NLV allow you to include your spouse/registered partner and dependent children in the application as family unit members." },
    ],
  },
];

export default async function FaqPage() {
  const { isEnabled: preview } = await draftMode();
  const sanityItems = await getFaqItems(preview).catch(() => []);

  // If Sanity has items, group them by category
  let sections = DEFAULT_FAQS;
  if (sanityItems?.length) {
    const grouped: Record<string, typeof sanityItems> = {};
    sanityItems.forEach((item: { category: string }) => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });
    sections = Object.entries(grouped).map(([category, questions]) => ({
      category,
      questions,
    }));
  }

  return (
    <>
      <section className="bg-[#1B3A6B] pt-32 pb-16 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-blue-200 text-lg">
            Everything you need to know about Spain&apos;s residency visas — answered by our experts.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FaqAccordion sections={sections} />
        </div>
      </section>

      <section className="py-16 bg-[#F7F8FC]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-[#0F1F3D] mb-3">Still have questions?</h3>
          <p className="text-gray-600 mb-8">
            Our team is happy to answer your specific situation — no generic advice, just real answers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FF6B35] text-white font-semibold text-sm hover:bg-[#E85520] transition-colors"
            >
              Book Free Consultation
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[#1B3A6B] text-[#1B3A6B] font-semibold text-sm hover:bg-[#1B3A6B] hover:text-white transition-all"
            >
              Send a Message
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
