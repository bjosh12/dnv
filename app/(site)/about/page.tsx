import { draftMode } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Users, Award, Globe } from "lucide-react";
import { LakbyteFeatureCard } from "@/components/ui/LakbyteBadge";
import { getTeamMembers, getAboutPage } from "@/lib/sanity";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const aboutData = await getAboutPage().catch(() => null);
  return buildMetadata(aboutData?.seo, {
    title: "About Us — Spain Visa Experts | Digital Nomad In Spain",
    description: "Meet the team behind Digital Nomad In Spain — visa experts who have helped 500+ people build their life in Spain.",
    path: "/about",
  });
}

const values = [
  {
    icon: Award,
    title: "Expertise you can trust",
    description:
      "We specialize exclusively in Spain residency visas. Not general immigration, not other countries — just Spain. That focus means better results for you.",
  },
  {
    icon: Users,
    title: "Real humans, real care",
    description:
      "Every client gets a dedicated case manager who knows your name, your situation, and your timeline. We don't hand you off to call centers.",
  },
  {
    icon: Globe,
    title: "International perspective",
    description:
      "Our team includes people who have gone through the Spain visa process themselves. We understand the stress and what matters most to you.",
  },
  {
    icon: MapPin,
    title: "Based in Spain",
    description:
      "We operate from Spain, which means we have direct, up-to-date knowledge of consulate requirements, local laws, and the immigration landscape.",
  },
];

const teamMembers = [
  {
    name: "Carlos Martínez",
    role: "Lead Immigration Consultant",
    bio: "10+ years in Spanish immigration law. Helped 300+ clients secure their DNV and NLV. Former consultant at Spain's largest immigration law firm.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    country: "🇪🇸 Spain",
  },
  {
    name: "Sarah Johnson",
    role: "Client Success Manager",
    bio: "Originally from the UK, Sarah relocated to Barcelona on the NLV and now helps others do the same. She personally guides every client through their journey.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    country: "🇬🇧 → 🇪🇸",
  },
  {
    name: "Miguel Torres",
    role: "Document Specialist",
    bio: "Certified Spanish legal translator and document expert. Miguel ensures every application package is complete, correctly translated, and ready to submit.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    country: "🇪🇸 Spain",
  },
];

const DEFAULT_TEAM = teamMembers;

export default async function AboutPage() {
  const { isEnabled: preview } = await draftMode();
  const [sanityTeam, aboutData] = await Promise.all([
    getTeamMembers(preview).catch(() => []),
    getAboutPage(preview).catch(() => null),
  ]);
  const team = sanityTeam?.length
    ? sanityTeam.map((m: { name: string; role: string; bio: string; photoUrl: string; country: string }) => ({
        name: m.name,
        role: m.role,
        bio: m.bio,
        image: m.photoUrl,
        country: m.country,
      }))
    : DEFAULT_TEAM;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-[#1B3A6B] overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <span className="text-[#FF6B35] text-sm font-semibold uppercase tracking-wider">
              Our Story
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold mt-2 mb-6 leading-tight">
              We help people build
              <span className="text-[#FF6B35]"> their life in Spain</span>
            </h1>
            <p className="text-blue-200 text-lg leading-relaxed mb-8">
              Digital Nomad In Spain was founded by expats who experienced the
              visa process firsthand — the confusion, the paperwork, the
              uncertainty. We created the service we wished we had.
            </p>
            <div className="flex gap-8">
              {(aboutData?.stats?.length ? aboutData.stats : [
                { value: "500+", label: "Visas approved" },
                { value: "98%", label: "Success rate" },
                { value: "6+", label: "Years experience" },
              ]).map((s: { value: string; label: string }) => (
                <div key={s.label}>
                  <div className="text-3xl font-bold text-[#FF6B35]">{s.value}</div>
                  <div className="text-sm text-blue-200">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <LakbyteFeatureCard />
          </div>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="text-xl leading-relaxed text-gray-700">
              {aboutData?.story1 ?? "We started Digital Nomad In Spain in 2019 after our founder Carlos — a Spanish immigration consultant — watched too many talented remote workers get rejected or delayed because of simple documentation errors."}
            </p>
            <p className="leading-relaxed">
              {aboutData?.story2 ?? "When Spain launched the Digital Nomad Visa in 2023, we were among the first consultancies to specialise in it. We developed proprietary checklists, built relationships with consulates across the US, UK, and Australia, and created a streamlined process that consistently gets applications approved."}
            </p>
            <p className="leading-relaxed">
              {aboutData?.story3 ?? "Today, we've helped over 500 people from 50+ countries start their Spanish life. Our clients range from Silicon Valley software engineers to British retirees, Australian freelancers to Canadian teachers — all united by their dream of living in Spain."}
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[#F7F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F1F3D]">Our values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(aboutData?.values?.length ? aboutData.values : values).map((v: { icon?: string; title: string; description: string }) => {
              const iconMap: Record<string, typeof Award> = { Award, Users, Globe, MapPin };
              const Icon = (v.icon && iconMap[v.icon]) ? iconMap[v.icon] : Award;
              return (
                <div key={v.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF0FA] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#1B3A6B]" />
                  </div>
                  <h3 className="font-bold text-[#0F1F3D] mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F1F3D] mb-3">Meet the team</h2>
            <p className="text-gray-600">Real experts. Real people. All here to help you.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member: { name: string; role: string; bio: string; image: string; country: string }) => (
              <div key={member.name} className="text-center">
                <div className="relative inline-block mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-28 h-28 rounded-2xl object-cover mx-auto"
                  />
                </div>
                <span className="text-sm text-gray-500">{member.country}</span>
                <h3 className="font-bold text-[#0F1F3D] mt-1">{member.name}</h3>
                <p className="text-sm text-[#FF6B35] font-medium mb-3">{member.role}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#1B3A6B] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start your Spain journey?</h2>
          <p className="text-blue-200 mb-8">Book a free consultation with our team today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FF6B35] text-white font-semibold text-sm hover:bg-[#E85520] transition-colors"
            >
              Book Free Consultation
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-colors border border-white/30"
            >
              Send a Message
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
