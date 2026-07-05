import { Shield, Clock, Users, Globe, FileCheck, HeartHandshake } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Shield, Clock, Users, Globe, FileCheck, HeartHandshake,
};

const DEFAULT_POINTS = [
  { icon: "Shield", title: "98% Approval Rate", description: "Our meticulous document preparation and deep knowledge of Spanish immigration law means your application is virtually always approved." },
  { icon: "Clock", title: "Faster Processing", description: "We know exactly what consulates want. Our clients typically receive approval 30% faster than self-applicants." },
  { icon: "Users", title: "Dedicated Case Manager", description: "Every client gets a personal case manager who knows your situation inside out. No call centers, no strangers." },
  { icon: "Globe", title: "We Speak Your Language", description: "Our multilingual team serves clients from the US, UK, Australia, Canada, and 50+ other countries." },
  { icon: "FileCheck", title: "End-to-End Service", description: "From your first question to your approval letter — we handle everything including translations and apostilles." },
  { icon: "HeartHandshake", title: "After-Approval Support", description: "We don't disappear after you're approved. We help with TIE cards, tax registration, and settling into Spain." },
];

type Point = { icon?: string; title: string; description: string };

export default function WhyUs({ data }: { data?: { whyUsPoints?: Point[] } | null }) {
  const points = data?.whyUsPoints?.length ? data.whyUsPoints : DEFAULT_POINTS;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80"
                alt="Our team helping clients"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F3D]/40 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-5 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold text-[#C2410C]">98%</div>
                <div className="text-xs text-gray-600 leading-tight">
                  Visa approval
                  <span className="block font-semibold text-[#1B3A6B]">success rate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2">
            <span className="text-[#C2410C] text-sm font-semibold uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F1F3D] mt-2 mb-4">
              Spain visa experts you can actually trust
            </h2>
            <p className="text-gray-600 mb-10 text-lg leading-relaxed">
              We&apos;re not a generic immigration firm. We specialise exclusively in Spain residency visas,
              which means deeper expertise and better results for you.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {points.map((p) => {
                const Icon = (p.icon && ICON_MAP[p.icon]) ? ICON_MAP[p.icon] : Shield;
                return (
                  <div key={p.title} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EBF0FA] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#1B3A6B]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0F1F3D] text-sm mb-1">{p.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{p.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
