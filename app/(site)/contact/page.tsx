"use client";

import type { Metadata } from "next";
import { useState } from "react";
import { Mail, MessageSquare, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/constants";
import TurnstileWidget from "@/components/ui/TurnstileWidget";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const visaOptions = [
  "Digital Nomad Visa (DNV)",
  "Non-Lucrative Visa (NLV)",
  "Not sure — need advice",
  "Other",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    visa: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [turnstileToken, setTurnstileToken] = useState("");
  // Bumped on failed submits to remount the widget — Turnstile tokens are single-use
  const [widgetKey, setWidgetKey] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const honeypot = (e.currentTarget as HTMLFormElement).elements.namedItem(
      "website"
    ) as HTMLInputElement | null;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          website: honeypot?.value ?? "",
          turnstileToken,
        }),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", visa: "", message: "" });
      } else {
        setStatus("error");
        setTurnstileToken("");
        setWidgetKey((k) => k + 1);
      }
    } catch {
      setStatus("error");
      setTurnstileToken("");
      setWidgetKey((k) => k + 1);
    }
  };

  return (
    <>
      {/* Header */}
      <section className="bg-[#1B3A6B] pt-32 pb-16 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-blue-200 text-lg">
            Have a question? We&apos;re here to help. Expect a response within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#F7F8FC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Contact info */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="font-bold text-[#0F1F3D] mb-4">Contact Details</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-[#EBF0FA] rounded-lg flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-[#1B3A6B]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Email</p>
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="text-sm font-medium text-[#1B3A6B] hover:text-[#FF6B35] transition-colors"
                      >
                        {CONTACT_EMAIL}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-[#EBF0FA] rounded-lg flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-[#1B3A6B]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Response Time</p>
                      <p className="text-sm font-medium text-[#0F1F3D]">
                        Within 24 hours (weekdays)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-[#EBF0FA] rounded-lg flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4 text-[#1B3A6B]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Languages</p>
                      <p className="text-sm font-medium text-[#0F1F3D]">
                        English & Spanish
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#1B3A6B] rounded-2xl p-6 text-white">
                <h3 className="font-bold mb-2">Prefer a call?</h3>
                <p className="text-sm text-blue-200 mb-4 leading-relaxed">
                  Skip the inbox and book a 45-minute Zoom session directly
                  with one of our visa experts.
                </p>
                <Link href="/book"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF6B35] text-white font-semibold text-sm hover:bg-[#E85520] transition-colors"
                >
                  Book Free Consultation
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-[#0F1F3D] mb-6">
                  Send us a message
                </h2>

                {status === "success" ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                    <div className="text-3xl mb-3">🎉</div>
                    <h3 className="font-bold text-green-800 mb-2">Message received!</h3>
                    <p className="text-sm text-green-700">
                      We&apos;ll get back to you within 24 hours. In the meantime,
                      feel free to check our FAQ or blog for answers.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Honeypot — hidden from real users, bots auto-fill it */}
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="absolute -left-[9999px] h-0 w-0 opacity-0"
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder="Your full name"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#0F1F3D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#0F1F3D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Phone (optional)
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+1 234 567 8900"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#0F1F3D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Visa Interest *
                        </label>
                        <select
                          name="visa"
                          value={form.visa}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#0F1F3D] focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent bg-white"
                        >
                          <option value="">Select a visa type</option>
                          {visaOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Your Message *
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Tell us about your situation, your timeline, and any specific questions you have..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#0F1F3D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent resize-none"
                      />
                    </div>

                    {TURNSTILE_SITE_KEY && (
                      <TurnstileWidget
                        key={widgetKey}
                        siteKey={TURNSTILE_SITE_KEY}
                        onToken={setTurnstileToken}
                      />
                    )}

                    {status === "error" && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        Something went wrong. Please try again or email us directly at{" "}
                        <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                          {CONTACT_EMAIL}
                        </a>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={
                        status === "loading" ||
                        (!!TURNSTILE_SITE_KEY && !turnstileToken)
                      }
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF6B35] text-white font-semibold text-sm hover:bg-[#E85520] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === "loading" ? "Sending..." : "Send Message"}
                      {status !== "loading" && <ArrowRight className="w-4 h-4" />}
                    </button>
                    <p className="text-xs text-gray-500 text-center">
                      We respect your privacy. Your information is never shared.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
