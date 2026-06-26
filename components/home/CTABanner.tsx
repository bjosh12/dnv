import Link from "next/link";
import { ArrowRight } from "lucide-react";

const DEFAULTS = {
  ctaHeadline: "Ready to make Spain your home?",
  ctaBody: "Thousands of digital nomads and expats have already made the move. Your visa journey starts with a single conversation.",
};

export default function CTABanner({ data }: { data?: Partial<typeof DEFAULTS> | null }) {
  const d = { ...DEFAULTS, ...data };

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920&q=85"
          alt="Spain lifestyle"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0F1F3D]/85" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h2 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
          {d.ctaHeadline.includes("your home") ? (
            <>
              {d.ctaHeadline.split("your home")[0]}
              <span className="text-[#FF6B35]">your home?</span>
            </>
          ) : (
            d.ctaHeadline
          )}
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          {d.ctaBody}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/book"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#FF6B35] text-white font-semibold text-base hover:bg-[#E85520] transition-all shadow-lg"
          >
            Book Free Consultation
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/eligibility"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold text-base hover:bg-white/20 transition-all border border-white/30"
          >
            Check Eligibility First
          </Link>
        </div>
        <p className="mt-6 text-sm text-gray-400">No obligation · 45-minute Zoom call · Expert advice</p>
      </div>
    </section>
  );
}
