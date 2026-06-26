import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Laptop, Palmtree } from "lucide-react";
import { BOOKING_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Visa Services",
  description:
    "Expert assistance for Spain's Digital Nomad Visa and Non-Lucrative Visa. Compare both options and choose the right path for your move to Spain.",
};

const services = [
  {
    icon: Laptop,
    title: "Digital Nomad Visa (DNV)",
    subtitle: "For remote workers & freelancers",
    description:
      "Spain's Digital Nomad Visa, introduced under the Startup Law (Ley de Startups) in 2023, allows non-EU remote workers to live in Spain legally while working for international clients or employers.",
    ideal: ["Remote employees", "Freelancers", "Self-employed professionals", "Digital entrepreneurs"],
    keyPoints: [
      "Minimum income: ~€2,646/month (200% SMI)",
      "Initial 1-year authorization → renewable to 3 years",
      "Can work for Spanish companies (up to 20% income)",
      "Includes spouse and dependent children",
      "Access to public healthcare (after TIE registration)",
      "Path to long-term residency after 5 years",
    ],
    href: "/services/digital-nomad-visa",
    color: "#1B3A6B",
    image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: Palmtree,
    title: "Non-Lucrative Visa (NLV)",
    subtitle: "For retirees & passive income earners",
    description:
      "The Non-Lucrative Visa allows non-EU citizens to live in Spain without the right to work. It's ideal for retirees, those with passive income (dividends, rental income), or anyone financially independent.",
    ideal: ["Retirees", "Passive income earners", "Investors", "Early retirees (FIRE)"],
    keyPoints: [
      "Minimum income: ~€2,400/month (living costs)",
      "Initial 1-year visa → renewable in 2-year increments",
      "No right to work in Spain",
      "Bring spouse and dependents",
      "Access to Spanish healthcare via private insurance",
      "Path to permanent residency after 5 years",
    ],
    href: "/services/non-lucrative-visa",
    color: "#FF6B35",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-[#1B3A6B] pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <span className="text-[#FF6B35] text-sm font-semibold uppercase tracking-wider">
            Our Services
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-2 mb-4">
            Two pathways to Spain
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Both visas let you build your life in Spain. The difference is how
            you earn — we&apos;ll help you choose the right one.
          </p>
        </div>
      </section>

      {/* Services detail */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {services.map((service, i) => (
            <div
              key={service.title}
              className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
            >
              {/* Image */}
              <div className={`relative ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="rounded-3xl overflow-hidden shadow-xl">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-80 object-cover"
                  />
                </div>
                <div
                  className="absolute -bottom-5 -right-5 w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: service.color }}
                >
                  <service.icon className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <span
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: service.color }}
                >
                  {service.subtitle}
                </span>
                <h2 className="text-3xl font-bold text-[#0F1F3D] mt-1 mb-4">
                  {service.title}
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <div className="mb-6">
                  <p className="text-sm font-semibold text-[#0F1F3D] mb-3 uppercase tracking-wide">
                    Ideal for:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {service.ideal.map((item) => (
                      <span
                        key={item}
                        className="text-xs font-medium px-3 py-1 rounded-full border"
                        style={{ color: service.color, borderColor: service.color + "40", backgroundColor: service.color + "10" }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <ul className="space-y-2.5 mb-8">
                  {service.keyPoints.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: service.color }} />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={service.href}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                    style={{ backgroundColor: service.color }}
                  >
                    Full Guide
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/eligibility"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border-2 transition-all"
                    style={{ color: service.color, borderColor: service.color }}
                  >
                    Check Eligibility
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#F7F8FC]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-[#0F1F3D] mb-3">
            Not sure which visa fits you?
          </h3>
          <p className="text-gray-600 mb-8">
            Take our free 2-minute eligibility checker or book a consultation
            and we&apos;ll tell you exactly which route to take.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/eligibility"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FF6B35] text-white font-semibold text-sm hover:bg-[#E85520] transition-colors"
            >
              Check Eligibility
            </Link>
            <Link href="/book"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[#1B3A6B] text-[#1B3A6B] font-semibold text-sm hover:bg-[#1B3A6B] hover:text-white transition-all"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
