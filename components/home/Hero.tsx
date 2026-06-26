"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { LakbyteAmbassadorBadge } from "@/components/ui/LakbyteBadge";

const DEFAULTS = {
  heroHeadline: "Live & Work Legally",
  heroSubheadline: "in Spain",
  heroBody: "We guide digital nomads and remote workers through Spain's Digital Nomad Visa and Non-Lucrative Visa — handling every document, every step, so you can focus on your dream life.",
  heroBadgeText: "Trusted Spain Visa Consultants",
  heroHighlights: ["Digital Nomad Visa experts", "98% success rate", "End-to-end support"],
};

export default function Hero({ data }: { data?: Partial<typeof DEFAULTS> | null }) {
  const d = { ...DEFAULTS, ...data };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1920&q=85"
          alt="Barcelona Spain skyline"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-white">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 bg-[#FF6B35]/20 border border-[#FF6B35]/40 text-[#FF6B35] text-sm font-medium px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
              {d.heroBadgeText}
            </div>
            <LakbyteAmbassadorBadge variant="dark" href="https://lakbyte.com" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {d.heroHeadline}
            <span className="block text-[#FF6B35]">{d.heroSubheadline}</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-200 leading-relaxed mb-8 max-w-2xl">
            {d.heroBody}
          </p>

          <ul className="flex flex-col sm:flex-row gap-3 sm:gap-6 mb-10">
            {d.heroHighlights.map((h: string) => (
              <li key={h} className="flex items-center gap-2 text-sm text-gray-200">
                <CheckCircle className="w-4 h-4 text-[#FF6B35] shrink-0" />
                {h}
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/eligibility"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#FF6B35] text-white font-semibold text-base hover:bg-[#E85520] transition-all shadow-lg hover:shadow-[#FF6B35]/30 hover:-translate-y-0.5"
            >
              Check My Eligibility
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold text-base hover:bg-white/20 transition-all border border-white/30"
            >
              Book Free Consultation
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 text-xs">
        <span>Scroll to explore</span>
        <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
