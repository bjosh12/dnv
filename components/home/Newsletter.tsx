"use client";

import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";

const DEFAULTS = {
  newsletterTitle: "Stay ahead of Spain visa changes",
  newsletterSubtext: "Immigration law changes frequently. Get our monthly newsletter with the latest DNV & NLV updates, tips from our visa experts, and inspiring stories from Spain.",
};

export default function Newsletter({ data }: { data?: Partial<typeof DEFAULTS> | null }) {
  const d = { ...DEFAULTS, ...data };
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-16 bg-[#EBF0FA]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-[#1B3A6B] flex items-center justify-center mx-auto mb-4">
          <Mail className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-[#0F1F3D] mb-2">
          {d.newsletterTitle}
        </h3>
        <p className="text-gray-600 mb-8 text-sm leading-relaxed">
          {d.newsletterSubtext}
        </p>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-xl px-6 py-4 text-green-700 font-medium">
            🎉 You&apos;re subscribed! Check your inbox for a welcome email.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#0F1F3D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] text-sm"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1B3A6B] text-white font-semibold text-sm hover:bg-[#0F1F3D] transition-colors"
            >
              Subscribe
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
        <p className="mt-3 text-xs text-gray-500">
          No spam. Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </section>
  );
}
