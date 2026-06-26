import Link from "next/link";
import { Laptop, Palmtree, ArrowRight, Check } from "lucide-react";

type ServiceCard = { title?: string; subtitle?: string; description?: string; features?: string[] };
type ServicesData = { dnv?: ServiceCard; nlv?: ServiceCard };

const DEFAULT_DNV = {
  title: "Digital Nomad Visa",
  subtitle: "Spain's DNV — Ley de Startups",
  description: "Perfect for remote workers and freelancers who earn income from outside Spain. Live in Spain for up to 1 year (renewable to 3+) while working for international clients.",
  features: ["Work remotely from anywhere in Spain", "Bring your family (spouse + children)", "Access to Spanish healthcare", "Path to permanent residency", "Minimum income: ~€2,646/month"],
};

const DEFAULT_NLV = {
  title: "Non-Lucrative Visa",
  subtitle: "Passive income & retirees",
  description: "Ideal for retirees, passive income earners, and those with sufficient savings. Live in Spain without the right to work, perfect for those financially independent.",
  features: ["Live in Spain long-term", "Include family members", "Access to public services", "Renewable every year", "Minimum income: ~€2,400/month"],
};

export default function ServicesOverview({ data }: { data?: ServicesData | null }) {
  const dnv = { ...DEFAULT_DNV, ...data?.dnv };
  const nlv = { ...DEFAULT_NLV, ...data?.nlv };

  const services = [
    {
      ...dnv,
      icon: Laptop,
      href: "/services/digital-nomad-visa",
      color: "#1B3A6B",
      image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=700&q=80",
    },
    {
      ...nlv,
      icon: Palmtree,
      href: "/services/non-lucrative-visa",
      color: "#FF6B35",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#FF6B35] text-sm font-semibold uppercase tracking-wider">Our Services</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F1F3D] mt-2 mb-4">
            Two paths to your life in Spain
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Whether you&apos;re a remote worker, freelancer, or retiree — we have the right visa pathway for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service.href}
              className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: service.color }}>
                    <service.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-300">{service.subtitle}</p>
                    <p className="font-bold text-base">{service.title}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-5">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {(service.features ?? []).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: service.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={service.href}
                  className="inline-flex items-center gap-2 font-semibold text-sm transition-colors group"
                  style={{ color: service.color }}
                >
                  Learn more
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Not sure which visa is right for you?</p>
          <Link
            href="/eligibility"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#1B3A6B] text-[#1B3A6B] font-semibold text-sm hover:bg-[#1B3A6B] hover:text-white transition-all"
          >
            Take our eligibility checker
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
