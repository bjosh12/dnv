// Run: node scripts/seed-sanity.mjs
// Requires SANITY_WRITE_TOKEN in .env.local

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";

// Load .env.local manually
const env = readFileSync(".env.local", "utf8");
const token = env.match(/SANITY_WRITE_TOKEN=(.+)/)?.[1]?.trim();
if (!token || token === "paste_your_editor_token_here") {
  console.error("❌ Add your SANITY_WRITE_TOKEN to .env.local first");
  process.exit(1);
}

const client = createClient({
  projectId: "wllgq317",
  dataset: "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

async function seed() {
  console.log("🌱 Seeding Sanity with existing content...\n");

  // ── Site Settings ──────────────────────────────────────────────────────────
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    siteName: "Digital Nomad In Spain",
    tagline: "Your trusted guide to living and working legally in Spain",
    contactEmail: "hello@digitalnomadrespain.com",
    whatsappNumber: "34600000000",
    stats: [
      { _key: "s1", value: "500+", label: "Visas Approved" },
      { _key: "s2", value: "98%", label: "Success Rate" },
      { _key: "s3", value: "50+", label: "Countries Served" },
      { _key: "s4", value: "5★", label: "Average Rating" },
      { _key: "s5", value: "6+", label: "Years Experience" },
    ],
    socialLinks: {
      instagram: "https://instagram.com/digitalnomadrespain",
      facebook: "https://facebook.com/digitalnomadrespain",
      linkedin: "https://linkedin.com/company/digitalnomadrespain",
      youtube: "https://youtube.com/@digitalnomadrespain",
    },
  });
  console.log("✅ Site Settings");

  // ── Home Page ──────────────────────────────────────────────────────────────
  await client.createOrReplace({
    _id: "homePage",
    _type: "homePage",
    heroHeadline: "Live & Work Legally",
    heroSubheadline: "in Spain",
    heroBody: "We guide digital nomads and remote workers through Spain's Digital Nomad Visa and Non-Lucrative Visa — handling every document, every step, so you can focus on your dream life.",
    heroBadgeText: "Trusted Spain Visa Consultants",
    heroHighlights: ["Digital Nomad Visa experts", "98% success rate", "End-to-end support"],
    howItWorksSteps: [
      { _key: "h1", number: "01", title: "Check Eligibility", description: "Take our free 2-minute eligibility quiz to see if you qualify for the Digital Nomad Visa or Non-Lucrative Visa." },
      { _key: "h2", number: "02", title: "Book a Consultation", description: "Schedule a 45-minute Zoom call with one of our visa experts. We'll map out your exact pathway and answer every question." },
      { _key: "h3", number: "03", title: "Document Preparation", description: "We provide a personalised checklist and guide you through gathering, translating, and apostilling all required documents." },
      { _key: "h4", number: "04", title: "Application & Approval", description: "We submit your complete application and handle all follow-up with the Spanish consulate. You relax — we manage the process." },
    ],
    whyUsPoints: [
      { _key: "w1", icon: "Shield", title: "98% Approval Rate", description: "Our meticulous document preparation and deep knowledge of Spanish immigration law means your application is virtually always approved." },
      { _key: "w2", icon: "Clock", title: "Faster Processing", description: "We know exactly what consulates want. Our clients typically receive approval 30% faster than self-applicants." },
      { _key: "w3", icon: "Users", title: "Dedicated Case Manager", description: "Every client gets a personal case manager who knows your situation inside out. No call centers, no strangers." },
      { _key: "w4", icon: "Globe", title: "We Speak Your Language", description: "Our multilingual team serves clients from the US, UK, Australia, Canada, and 50+ other countries." },
      { _key: "w5", icon: "FileCheck", title: "End-to-End Service", description: "From your first question to your approval letter — we handle everything including translations and apostilles." },
      { _key: "w6", icon: "HeartHandshake", title: "After-Approval Support", description: "We don't disappear after you're approved. We help with TIE cards, tax registration, and settling into Spain." },
    ],
    servicesSection: {
      dnv: {
        title: "Digital Nomad Visa",
        subtitle: "Spain's DNV — Ley de Startups",
        description: "Perfect for remote workers and freelancers who earn income from outside Spain. Live in Spain for up to 1 year (renewable to 3+) while working for international clients.",
        features: ["Work remotely from anywhere in Spain", "Bring your family (spouse + children)", "Access to Spanish healthcare", "Path to permanent residency", "Minimum income: ~€2,646/month"],
      },
      nlv: {
        title: "Non-Lucrative Visa",
        subtitle: "Passive income & retirees",
        description: "Ideal for retirees, passive income earners, and those with sufficient savings. Live in Spain without the right to work, perfect for those financially independent.",
        features: ["Live in Spain long-term", "Include family members", "Access to public services", "Renewable every year", "Minimum income: ~€2,400/month"],
      },
    },
    ctaHeadline: "Ready to make Spain your home?",
    ctaBody: "Thousands of digital nomads and expats have already made the move. Your visa journey starts with a single conversation.",
    newsletterTitle: "Stay ahead of Spain visa changes",
    newsletterSubtext: "Immigration law changes frequently. Get our monthly newsletter with the latest DNV & NLV updates, tips from our visa experts, and inspiring stories from Spain.",
  });
  console.log("✅ Home Page");

  // ── About Page ─────────────────────────────────────────────────────────────
  await client.createOrReplace({
    _id: "aboutPage",
    _type: "aboutPage",
    stats: [
      { _key: "a1", value: "500+", label: "Visas approved" },
      { _key: "a2", value: "98%", label: "Success rate" },
      { _key: "a3", value: "6+", label: "Years experience" },
    ],
    story1: "We started Digital Nomad In Spain in 2019 after our founder Carlos — a Spanish immigration consultant — watched too many talented remote workers get rejected or delayed because of simple documentation errors.",
    story2: "When Spain launched the Digital Nomad Visa in 2023, we were among the first consultancies to specialise in it. We developed proprietary checklists, built relationships with consulates across the US, UK, and Australia, and created a streamlined process that consistently gets applications approved.",
    story3: "Today, we've helped over 500 people from 50+ countries start their Spanish life. Our clients range from Silicon Valley software engineers to British retirees, Australian freelancers to Canadian teachers — all united by their dream of living in Spain.",
    values: [
      { _key: "v1", icon: "Award", title: "Expertise you can trust", description: "We specialise exclusively in Spain residency visas. Not general immigration, not other countries — just Spain. That focus means better results for you." },
      { _key: "v2", icon: "Users", title: "Real humans, real care", description: "Every client gets a dedicated case manager who knows your name, your situation, and your timeline. We don't hand you off to call centers." },
      { _key: "v3", icon: "Globe", title: "International perspective", description: "Our team includes people who have gone through the Spain visa process themselves. We understand the stress and what matters most to you." },
      { _key: "v4", icon: "MapPin", title: "Based in Spain", description: "We operate from Spain, which means we have direct, up-to-date knowledge of consulate requirements, local laws, and the immigration landscape." },
    ],
    consultationCovers: [
      "Quick eligibility check — find out if you qualify",
      "Simple Q&A about the DNV or NLV process",
      "Visa comparison — DNV vs NLV for your situation",
      "General guidance on next steps and timeline",
      "Honest referral to legal help if you need it",
    ],
  });
  console.log("✅ About Page");

  // ── Testimonials ───────────────────────────────────────────────────────────
  const testimonials = [
    { _id: "testimonial-1", name: "Sarah Mitchell", country: "🇺🇸 United States", visa: "Digital Nomad Visa", quote: "I was completely overwhelmed by the paperwork requirements until I found Digital Nomad In Spain. They made the entire process feel effortless. I received my DNV approval in just 6 weeks!", rating: 5, order: 1 },
    { _id: "testimonial-2", name: "James & Patricia Wong", country: "🇬🇧 United Kingdom", visa: "Non-Lucrative Visa", quote: "We retired early and wanted to spend our years in Spain. The team guided us through every step — from apostilling our pension statements to submitting in Madrid. Couldn't have done it without them.", rating: 5, order: 2 },
    { _id: "testimonial-3", name: "Marco Fernandez", country: "🇦🇺 Australia", visa: "Digital Nomad Visa", quote: "As a freelance developer, the DNV was perfect for me. The team explained every income threshold, every document, and followed up with the consulate on my behalf. Now I'm living in Barcelona and loving it!", rating: 5, order: 3 },
  ];
  for (const t of testimonials) {
    await client.createOrReplace({ ...t, _type: "testimonial" });
  }
  console.log("✅ Testimonials (3)");

  // ── Team Members ───────────────────────────────────────────────────────────
  const team = [
    { _id: "team-1", name: "Carlos Martínez", role: "Lead Immigration Consultant", bio: "10+ years in Spanish immigration law. Helped 300+ clients secure their DNV and NLV. Former consultant at Spain's largest immigration law firm.", country: "🇪🇸 Spain", order: 1 },
    { _id: "team-2", name: "Sarah Johnson", role: "Client Success Manager", bio: "Originally from the UK, Sarah relocated to Barcelona on the NLV and now helps others do the same. She personally guides every client through their journey.", country: "🇬🇧 → 🇪🇸", order: 2 },
    { _id: "team-3", name: "Miguel Torres", role: "Document Specialist", bio: "Certified Spanish legal translator and document expert. Miguel ensures every application package is complete, correctly translated, and ready to submit.", country: "🇪🇸 Spain", order: 3 },
  ];
  for (const m of team) {
    await client.createOrReplace({ ...m, _type: "teamMember" });
  }
  console.log("✅ Team Members (3)");

  // ── FAQ Items ──────────────────────────────────────────────────────────────
  const faqs = [
    { _id: "faq-1", category: "Digital Nomad Visa", order: 1, question: "What is Spain's Digital Nomad Visa?", answer: "Spain's Digital Nomad Visa (officially: Authorization for International Remote Work Activity) was introduced in January 2023 under the Startup Law (Ley 28/2022). It allows non-EU citizens to live in Spain while working remotely for foreign employers or clients." },
    { _id: "faq-2", category: "Digital Nomad Visa", order: 2, question: "How much income do I need for the Digital Nomad Visa?", answer: "You need a minimum of 200% of Spain's monthly minimum wage (SMI), which currently equates to approximately €2,646/month. This threshold is adjusted when Spain's minimum wage changes." },
    { _id: "faq-3", category: "Digital Nomad Visa", order: 3, question: "Can I be a freelancer/self-employed for the DNV?", answer: "Yes! Freelancers and self-employed workers are eligible. You need to demonstrate at least 1 year of remote working history and provide client contracts or invoices showing consistent income." },
    { _id: "faq-4", category: "Digital Nomad Visa", order: 4, question: "How long does the DNV last?", answer: "The initial DNV is valid for 1 year. It can be renewed for up to 3 years (in one 2-year renewal). After 5 years of legal residency, you may apply for long-term residency." },
    { _id: "faq-5", category: "Digital Nomad Visa", order: 5, question: "Can I work for Spanish companies on the DNV?", answer: "Yes, but with limits. Up to 20% of your total income can come from Spanish companies or clients. If you exceed this, you'll need a different work authorization." },
    { _id: "faq-6", category: "Non-Lucrative Visa", order: 1, question: "What is the Non-Lucrative Visa (NLV)?", answer: "The NLV allows non-EU citizens to live in Spain without the right to work. It's intended for financially independent individuals who can support themselves through savings, pensions, passive income, or investments." },
    { _id: "faq-7", category: "Non-Lucrative Visa", order: 2, question: "How much money do I need for the Non-Lucrative Visa?", answer: "Generally, you need to demonstrate approximately €2,400/month for the main applicant, plus ~€600/month for each additional family member. Requirements can vary slightly by consulate." },
    { _id: "faq-8", category: "Non-Lucrative Visa", order: 3, question: "Can I work remotely on the Non-Lucrative Visa?", answer: "No. The NLV explicitly prohibits any gainful employment in Spain, including remote work for foreign companies. If you need to work, you should apply for the Digital Nomad Visa instead." },
    { _id: "faq-9", category: "Non-Lucrative Visa", order: 4, question: "How long does the NLV last?", answer: "The initial NLV is granted for 1 year. After that, you can renew in 2-year increments. You must spend at least 6 months per year in Spain to maintain your residency." },
    { _id: "faq-10", category: "Documents & Process", order: 1, question: "What is an apostille and do I need one?", answer: "An apostille is an internationally recognized certification that authenticates official documents for use in other countries. Both the DNV and NLV require key documents to be apostilled under the Hague Convention." },
    { _id: "faq-11", category: "Documents & Process", order: 2, question: "Where do I apply for a Spain visa?", answer: "You apply at the Spanish consulate in your country of residence. The consulate you apply through can affect document requirements and processing times — something we help clients navigate." },
    { _id: "faq-12", category: "Documents & Process", order: 3, question: "How long does the visa process take?", answer: "For the DNV, typically 6–10 weeks from a complete submission. For the NLV, 8–12 weeks. Incomplete or incorrectly prepared applications significantly extend timelines." },
    { _id: "faq-13", category: "Documents & Process", order: 4, question: "Can I apply while already in Spain?", answer: "Generally, you must apply from your home country at a Spanish consulate. However, some exceptions exist. We recommend consulting with us to understand your specific situation." },
    { _id: "faq-14", category: "After Approval", order: 1, question: "What is a TIE card and do I need one?", answer: "The TIE (Tarjeta de Identidad de Extranjero) is your Spanish residency card. After arriving in Spain with your visa, you must apply for a TIE at a local National Police station within 30 days." },
    { _id: "faq-15", category: "After Approval", order: 2, question: "Do I have to pay taxes in Spain?", answer: "If you spend 183+ days per year in Spain, you become a Spanish tax resident. DNV holders may qualify for Spain's Beckham Law, which applies a flat 24% tax rate on Spanish-sourced income for the first 5 years." },
    { _id: "faq-16", category: "After Approval", order: 3, question: "Can my family join me in Spain?", answer: "Yes. Both the DNV and NLV allow you to include your spouse/registered partner and dependent children in the application as family unit members." },
  ];
  for (const f of faqs) {
    await client.createOrReplace({ ...f, _type: "faqItem" });
  }
  console.log("✅ FAQ Items (16)");

  // ── Service Content ────────────────────────────────────────────────────────
  await client.createOrReplace({
    _id: "service-dnv",
    _type: "serviceContent",
    slug: "digital-nomad-visa",
    heroHeadline: "Spain's Digital Nomad Visa",
    heroBody: "The legal way for remote workers and freelancers to live and work from Spain. Our team has helped hundreds of digital nomads secure their DNV with a 98% approval rate.",
    requirements: [
      "Non-EU/EEA nationality",
      "Work remotely for a non-Spanish employer or clients",
      "Minimum 1 year of employment/freelance history",
      "Monthly income of at least €2,646 (200% of Spain's minimum wage)",
      "Valid private health insurance covering Spain",
      "Clean criminal record (apostilled)",
      "No prior Spanish visa violations",
    ],
    documents: [
      { _key: "d1", item: "Valid passport (6+ months remaining)", note: "Copy of all pages" },
      { _key: "d2", item: "Completed national visa application form", note: "Form EX-01" },
      { _key: "d3", item: "Recent passport-sized photos", note: "2 photos, white background" },
      { _key: "d4", item: "Criminal record certificate", note: "Apostilled & translated" },
      { _key: "d5", item: "Proof of remote work", note: "Employment contract or client contracts" },
      { _key: "d6", item: "Income documentation", note: "3+ months bank statements + payslips or invoices" },
      { _key: "d7", item: "Private health insurance policy", note: "Valid in Spain, no co-payment clause" },
      { _key: "d8", item: "Proof of address in Spain (or intent)", note: "Rental agreement or letter of intent" },
      { _key: "d9", item: "Company registration documents", note: "If self-employed/freelancer" },
    ],
    faqs: [
      { _key: "f1", q: "Can I work for Spanish companies on the DNV?", a: "Yes, up to 20% of your total income can come from Spanish clients or companies. Beyond that, you'd need a different authorization." },
      { _key: "f2", q: "How long does the process take?", a: "Typically 6–10 weeks from submitting a complete application. Incomplete applications significantly extend this timeline." },
      { _key: "f3", q: "Can I include my family?", a: "Yes. Your spouse, registered partner, and dependent children can apply as family unit members alongside your main application." },
      { _key: "f4", q: "Do I pay taxes in Spain on the DNV?", a: "If you spend 183+ days in Spain in a calendar year, you become a Spanish tax resident. However, you may qualify for the Beckham Law (flat 24% tax rate on Spanish income) for the first 5 years." },
    ],
    pricingFrom: "€1,499",
    pricingNote: "Full end-to-end service. Government fees extra.",
    pricingIncludes: ["Document checklist & guidance", "Translation coordination", "Application preparation", "Consulate submission support", "Follow-up & queries"],
    quickFacts: [
      { _key: "q1", label: "Min. Income", value: "€2,646/month" },
      { _key: "q2", label: "Initial Duration", value: "1 year" },
      { _key: "q3", label: "Max Renewal", value: "3 years" },
      { _key: "q4", label: "Processing Time", value: "6–10 weeks" },
      { _key: "q5", label: "Apply From", value: "Spanish Consulate" },
      { _key: "q6", label: "Right to Work", value: "Remote only" },
    ],
  });
  console.log("✅ Service: Digital Nomad Visa");

  await client.createOrReplace({
    _id: "service-nlv",
    _type: "serviceContent",
    slug: "non-lucrative-visa",
    heroHeadline: "Spain's Non-Lucrative Visa",
    heroBody: "Live the good life in Spain without working. The Non-Lucrative Visa is the classic route for retirees, passive income earners, and anyone financially independent.",
    requirements: [
      "Non-EU/EEA nationality",
      "Sufficient financial means (no employment required)",
      "Monthly income of at least €2,400 (living costs threshold)",
      "Private health insurance covering Spain (no co-payment)",
      "Clean criminal record (apostilled)",
      "Medical certificate (no contagious diseases)",
      "Commitment not to work in Spain during the visa period",
    ],
    documents: [
      { _key: "d1", item: "Valid passport (6+ months remaining)", note: "Certified copy of all pages" },
      { _key: "d2", item: "Completed national visa form (EX-01)", note: "2 copies signed" },
      { _key: "d3", item: "Recent passport-sized photos", note: "2 photos, white background" },
      { _key: "d4", item: "Criminal record certificate", note: "Apostilled & translated" },
      { _key: "d5", item: "Medical certificate", note: "From your GP, apostilled" },
      { _key: "d6", item: "Proof of sufficient income", note: "Bank statements, pension, investment income" },
      { _key: "d7", item: "Private health insurance", note: "Full coverage, no co-payment, no time limit" },
      { _key: "d8", item: "Proof of accommodation in Spain", note: "Rental contract or property ownership" },
    ],
    faqs: [
      { _key: "f1", q: "Can I work at all on a Non-Lucrative Visa?", a: "No. The NLV explicitly prohibits any gainful employment in Spain, including remote work for international clients. If you need to work, consider the Digital Nomad Visa instead." },
      { _key: "f2", q: "What counts as 'sufficient income'?", a: "You need to demonstrate approximately €2,400/month for yourself, plus around €600/month for each additional family member. This can come from pensions, savings, investments, rental income, or other passive sources." },
      { _key: "f3", q: "How long does the initial visa last?", a: "The initial NLV is granted for 1 year. After that, you can renew for 2-year periods. After 5 years, you can apply for long-term residency." },
      { _key: "f4", q: "Do I have to stay in Spain?", a: "You must spend at least 6 months per year in Spain (183 days) to maintain your residency status. Going below this may jeopardize renewal." },
    ],
    pricingFrom: "€1,299",
    pricingNote: "Full end-to-end service. Government fees extra.",
    pricingIncludes: ["Personalised document checklist", "Income verification guidance", "Document translation coordination", "Application preparation & review", "Consulate appointment support"],
    quickFacts: [
      { _key: "q1", label: "Min. Income", value: "€2,400/month" },
      { _key: "q2", label: "Initial Duration", value: "1 year" },
      { _key: "q3", label: "Renewal", value: "2-year periods" },
      { _key: "q4", label: "Processing Time", value: "8–12 weeks" },
      { _key: "q5", label: "Apply From", value: "Spanish Consulate" },
      { _key: "q6", label: "Right to Work", value: "No" },
    ],
  });
  console.log("✅ Service: Non-Lucrative Visa");

  console.log("\n🎉 Seed complete! Open /studio to edit everything.");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
