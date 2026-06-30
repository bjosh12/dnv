"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Check,
  Search,
  X,
} from "lucide-react";
import { BOOKING_URL } from "@/lib/constants";

// ─── Types ──────────────────────────────────────────────────────────────────

type Answers = Record<string, string | string[]>;

type Option = {
  label: string;
  value: string;
  icon?: string;
  sublabel?: string;
};

type StepDef = {
  id: string;
  section: string;
  sectionNum: number;
  question: string;
  subtext?: string;
  incomeTable?: boolean;
  type: "single" | "multi" | "country-search";
  maxSelections?: number;
  options: Option[];
  earlyExit?: (value: string | string[], allAnswers: Answers) => Result | null;
  skipIf?: (answers: Answers) => boolean;
};

type Result = {
  status: "eligible" | "likely" | "not-eligible";
  label: string;
  title: string;
  message: string;
  next: string;
  flags?: string[];
};

// ─── EU / EEA countries (for early-exit detection) ───────────────────────────

const EU_EEA_SET = new Set([
  "Austria","Belgium","Bulgaria","Croatia","Cyprus","Czech Republic","Denmark",
  "Estonia","Finland","France","Germany","Greece","Hungary","Ireland","Italy",
  "Latvia","Lithuania","Luxembourg","Malta","Netherlands","Poland","Portugal",
  "Romania","Slovakia","Slovenia","Spain","Sweden",
  "Iceland","Liechtenstein","Norway", // EEA non-EU
]);

// ─── Full country list ────────────────────────────────────────────────────────

const ALL_COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda",
  "Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain",
  "Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan",
  "Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria",
  "Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada",
  "Central African Republic","Chad","Chile","China","Colombia","Comoros",
  "Congo (Brazzaville)","Congo (Kinshasa)","Costa Rica","Croatia","Cuba",
  "Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic",
  "Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia",
  "Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia",
  "Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau",
  "Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran",
  "Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan",
  "Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho",
  "Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar",
  "Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania",
  "Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro",
  "Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands",
  "New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia",
  "Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea",
  "Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania",
  "Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia",
  "Saint Vincent and the Grenadines","Samoa","San Marino","São Tomé and Príncipe",
  "Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore",
  "Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea",
  "South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland",
  "Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo",
  "Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu",
  "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States",
  "Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen",
  "Zambia","Zimbabwe",
];

// ─── Income threshold table ──────────────────────────────────────────────────

const INCOME_ROWS = [
  { size: "Solo (just you)", amount: "€2,849" },
  { size: "+ 1 person", amount: "€3,324" },
  { size: "+ 2 people", amount: "€3,799" },
  { size: "+ 3 people", amount: "€4,274" },
  { size: "+ 4 people", amount: "€4,749" },
  { size: "+ 5 people", amount: "€5,224" },
  { size: "+ 6 or more", amount: "€5,698" },
];

// ─── Steps ───────────────────────────────────────────────────────────────────

const steps: StepDef[] = [
  // ── Section 1 ──────────────────────────────────────────────────────────────
  {
    id: "nationality",
    section: "Legal Eligibility",
    sectionNum: 1,
    question: "What passport(s) do you hold?",
    subtext: "Search and select up to 3 — useful if you hold dual or triple citizenship.",
    type: "country-search",
    maxSelections: 3,
    options: [],
    earlyExit: (value) => {
      const selected = value as string[];
      if (selected.some((c) => EU_EEA_SET.has(c))) {
        return {
          status: "not-eligible",
          label: "No visa needed",
          title: "Good news — you don't need a visa",
          message:
            "As an EU/EEA passport holder, you're already free to live and work anywhere in Spain. No visa application required. You'll just need to register at your local town hall and obtain a TIE or EU registration certificate once you arrive.",
          next: "We're happy to guide you through the registration process.",
        };
      }
      return null;
    },
  },
  {
    id: "criminal",
    section: "Legal Eligibility",
    sectionNum: 1,
    question:
      "Over the last 2 years, across every country you've called home — do you have a clean criminal record?",
    type: "single",
    options: [
      { label: "Yes, completely clear", value: "clean", icon: "✅" },
      { label: "I have a past conviction", value: "no", icon: "❌" },
      { label: "I'm genuinely not certain", value: "unsure", icon: "🤔" },
    ],
    earlyExit: (value) => {
      if (value === "no") {
        return {
          status: "not-eligible",
          label: "Not currently eligible",
          title: "A criminal record is a hard stop",
          message:
            "Spain's Digital Nomad Visa requires a clean criminal record covering every country you've resided in over the past 2 years. An existing conviction — even a minor one — is an automatic disqualifier under current rules.",
          next: "Eligibility may improve as the conviction ages. Book a consultation to understand your timeline.",
        };
      }
      return null;
    },
  },

  // ── Section 2 ──────────────────────────────────────────────────────────────
  {
    id: "remote_type",
    section: "Your Work Setup",
    sectionNum: 2,
    question:
      "Does your job ever require you to physically show up somewhere — an office, client site, or any other location?",
    type: "single",
    options: [
      { label: "Never — I work entirely online", value: "full", icon: "💻" },
      { label: "Rarely, but it does happen occasionally", value: "mostly", icon: "⚠️" },
      { label: "Yes, in-person presence is part of the role", value: "no", icon: "❌" },
    ],
    earlyExit: (value) => {
      if (value === "no") {
        return {
          status: "not-eligible",
          label: "Not eligible for DNV",
          title: "The DNV requires fully remote work",
          message:
            "Spain's Digital Nomad Visa is built around 100% telematic (online) work. If your role requires any physical presence at a fixed location, it doesn't meet the visa's core requirement — regardless of how infrequently that happens.",
          next: "Get in touch and we can look at whether any other pathway fits your situation.",
        };
      }
      return null;
    },
  },
  {
    id: "work_type",
    section: "Your Work Setup",
    sectionNum: 2,
    question: "How would you describe your current working arrangement?",
    type: "single",
    options: [
      { label: "Employee on a payroll", value: "employee", icon: "🏢" },
      { label: "Freelancer or independent contractor", value: "freelancer", icon: "🖥️" },
      { label: "Business owner serving other companies (B2B)", value: "b2b", icon: "📊" },
      { label: "A mix of the above", value: "hybrid", icon: "🔀" },
      { label: "None of these fit my situation", value: "none", icon: "❓" },
    ],
  },
  {
    id: "contract_length",
    section: "Your Work Setup",
    sectionNum: 2,
    question: "What does your current contract or working agreement look like?",
    type: "single",
    options: [
      { label: "Open-ended — no fixed end date", value: "indefinite", icon: "♾️" },
      { label: "Fixed-term with at least 12 months left", value: "1yr-plus", icon: "📅" },
      { label: "Fixed-term with less than 12 months remaining", value: "under-1yr", icon: "⚠️" },
      { label: "I work without a formal contract", value: "none", icon: "📝" },
    ],
  },

  // ── Section 3 ──────────────────────────────────────────────────────────────
  {
    id: "employer_age",
    section: "Employer & Client Details",
    sectionNum: 3,
    question:
      "Has the company you work for — or your main client, if you freelance — been a registered legal entity for at least one year?",
    type: "single",
    options: [
      { label: "Yes, they've been established for over a year", value: "yes", icon: "✅" },
      { label: "No, they're relatively new", value: "no", icon: "❌" },
      { label: "I'm not entirely sure", value: "unsure", icon: "🤔" },
    ],
  },
  {
    id: "employer_spain",
    section: "Employer & Client Details",
    sectionNum: 3,
    question:
      "Does your employer — or main client — have any legal footprint in Spain? Think branches, subsidiaries, registered offices, or any kind of Spanish entity.",
    type: "single",
    options: [
      { label: "No, they operate exclusively outside Spain", value: "no", icon: "✅" },
      { label: "Yes, they have a presence in Spain", value: "yes", icon: "⚠️" },
      { label: "Not sure — I'd need to check", value: "unsure", icon: "🤔" },
    ],
  },
  {
    id: "employer_letter",
    section: "Employer & Client Details",
    sectionNum: 3,
    question:
      "Would your employer (or main client) be willing to put their name to a letter confirming you're authorised to work from Spain?",
    type: "single",
    options: [
      { label: "Yes, they'd have no issue with that", value: "yes", icon: "✅" },
      { label: "No, that's not something they'd do", value: "no", icon: "❌" },
      { label: "I haven't raised it with them yet", value: "not-asked", icon: "🔄" },
      { label: "I honestly don't know their position", value: "unsure", icon: "🤔" },
    ],
  },

  // ── Section 4 ──────────────────────────────────────────────────────────────
  {
    id: "qualifications",
    section: "Qualifications",
    sectionNum: 4,
    question:
      "Do you hold a university degree in your field? Or if not, can you back up 3 years of professional experience with official paperwork — tax returns, social security records, that sort of thing?",
    type: "single",
    options: [
      { label: "Yes — I have a relevant degree", value: "degree", icon: "🎓" },
      { label: "Yes — 3+ years of fully documented experience", value: "exp-proven", icon: "📂" },
      { label: "3+ years of experience, but proving it on paper is tricky", value: "exp-hard", icon: "⚠️" },
      { label: "Both a degree and solid work history", value: "both", icon: "⭐" },
      { label: "No degree, and my experience is hard to document", value: "neither", icon: "❌" },
    ],
    earlyExit: (value) => {
      if (value === "neither") {
        return {
          status: "not-eligible",
          label: "Qualification gap",
          title: "A degree or proven experience is required",
          message:
            "The DNV requires applicants to demonstrate either a university-level qualification or at least 3 years of verifiable professional experience in their field. Without either, the application is unlikely to succeed under current rules.",
          next: "Talk to us — there may be ways to strengthen your evidence before applying.",
        };
      }
      return null;
    },
  },

  // ── Section 5 ──────────────────────────────────────────────────────────────
  {
    id: "dependents",
    section: "Income & Finances",
    sectionNum: 5,
    question:
      "How many people — a spouse or partner, children, or dependent parents — will be joining your application?",
    type: "single",
    options: [
      { label: "None — this application is just for me", value: "0", icon: "👤" },
      { label: "Between 1 and 5 people", value: "1-5", icon: "👨‍👩‍👧" },
      { label: "6 or more", value: "6plus", icon: "👨‍👩‍👧‍👦" },
    ],
  },
  {
    id: "income_meets",
    section: "Income & Finances",
    sectionNum: 5,
    question:
      "Does your gross monthly income — before any deductions — reach the minimum threshold for your household size?",
    subtext:
      "These are the 2026 figures. Check which row matches your situation above, then answer below.",
    incomeTable: true,
    type: "single",
    options: [
      { label: "Yes, I'm at or above the threshold", value: "yes", icon: "✅" },
      { label: "No, I fall short of the minimum", value: "no", icon: "❌" },
    ],
    earlyExit: (value) => {
      if (value === "no") {
        return {
          status: "not-eligible",
          label: "Income below threshold",
          title: "Your income doesn't currently meet the 2026 minimum",
          message:
            "The DNV sets firm income floors tied to Spain's minimum wage — and these shift each year. If your earnings fall below the threshold for your household size, the application will be refused. The good news: there are often ways to structure and document income that applicants overlook.",
          next: "Book a call before giving up — we may be able to help.",
        };
      }
      return null;
    },
  },
  {
    id: "taxes",
    section: "Income & Finances",
    sectionNum: 5,
    question:
      "Once you're a resident in Spain, are you prepared to pay personal income tax there?",
    subtext:
      "DNV holders who spend 183+ days/year in Spain become tax residents. You may qualify for Spain's Beckham Law (flat 24% rate) for your first 5 years.",
    type: "single",
    options: [
      { label: "Yes — I understand and I'm fine with that", value: "yes", icon: "✅" },
      { label: "No — I'm not willing to pay Spanish taxes", value: "no", icon: "❌" },
    ],
    earlyExit: (value) => {
      if (value === "no") {
        return {
          status: "not-eligible",
          label: "Tax obligation required",
          title: "Spanish tax residency comes with the territory",
          message:
            "If you spend more than 183 days a year in Spain, you become a Spanish tax resident — that's not optional. The visa itself doesn't force you to stay that long, but if you plan to actually live there, tax residency applies. Refusing the obligation isn't a valid workaround under Spanish immigration law.",
          next: "Let's talk through your tax situation — there are legitimate strategies worth knowing about.",
        };
      }
      return null;
    },
  },
  {
    id: "payment_method",
    section: "Income & Finances",
    sectionNum: 5,
    question: "How do you typically receive your income?",
    type: "single",
    options: [
      { label: "Directly into my personal bank account", value: "personal-bank", icon: "🏦" },
      { label: "Into a business bank account in my name", value: "business-bank", icon: "🏢" },
      { label: "Via platforms like Stripe, PayPal, Wise, or Payoneer", value: "platform", icon: "💳" },
      { label: "A mix — it varies by client or job", value: "mixed", icon: "🔀" },
    ],
  },

  // ── Section 6 ──────────────────────────────────────────────────────────────
  {
    id: "residence_country",
    section: "Travel & Documents",
    sectionNum: 6,
    question: "Where do you currently live?",
    subtext: "Search and select up to 3 if you split your time between countries.",
    type: "country-search",
    maxSelections: 3,
    options: [],
  },
  {
    id: "submission_location",
    section: "Travel & Documents",
    sectionNum: 6,
    question: "Where are you planning to hand in your application?",
    type: "single",
    options: [
      { label: "At the Spanish consulate in my country of residence", value: "consulate", icon: "🏛️" },
      { label: "I'm already in Spain", value: "in-spain", icon: "🇪🇸", sublabel: "Different route applies" },
      { label: "Still figuring this out", value: "unsure", icon: "🤔" },
    ],
  },
  {
    id: "schengen",
    section: "Travel & Documents",
    sectionNum: 6,
    question:
      "If your passport requires a Schengen visa to travel in Europe, can you obtain one before heading to Spain?",
    type: "single",
    options: [
      { label: "Yes, I can apply for a Schengen visa", value: "yes", icon: "✅" },
      { label: "My passport is already Schengen-exempt", value: "exempt", icon: "🛂" },
      { label: "No, I wouldn't be able to get one", value: "no", icon: "❌" },
      { label: "Not sure if my nationality requires one", value: "unsure", icon: "🤔" },
    ],
  },
  {
    id: "lived_countries",
    section: "Travel & Documents",
    sectionNum: 6,
    question:
      "Which countries have you officially lived in over the past 2 years? (for criminal record certificates)",
    subtext: "You'll need to obtain a police clearance certificate from each country listed. Select up to 3.",
    type: "country-search",
    maxSelections: 3,
    options: [],
  },
];

// ─── Scoring ─────────────────────────────────────────────────────────────────

function computeResult(answers: Answers): Result {
  const flags: string[] = [];

  // Criminal record uncertainty
  if (answers.criminal === "unsure") {
    flags.push("Criminal record — you'll need to request certificates from every country of residence");
  }

  // Mostly remote
  if (answers.remote_type === "mostly") {
    flags.push("Occasional in-person work — the consulate will scrutinise whether your role is truly telematic");
  }

  // Work type with no contract
  const workType = answers.work_type as string;
  const contract = answers.contract_length as string;
  if (contract === "under-1yr") {
    flags.push("Contract under 12 months — Spain expects evidence of stable, ongoing engagement");
  }
  if (contract === "none" && workType === "employee") {
    flags.push("No formal employment contract — employees need a written agreement to satisfy consulate requirements");
  }

  // Employer age
  if (answers.employer_age === "unsure") {
    flags.push("Employer registration date unknown — you'll need to confirm they've been operating for 1+ year");
  }
  if (answers.employer_age === "no") {
    flags.push("Employer established under a year ago — this is a notable risk factor for the application");
  }

  // Employer in Spain
  if (answers.employer_spain === "yes") {
    flags.push("Employer has a Spanish entity — this can blur the 'work for non-Spanish company' requirement and needs careful handling");
  }
  if (answers.employer_spain === "unsure") {
    flags.push("Employer's Spanish presence unknown — worth checking before applying");
  }

  // Employer letter
  if (answers.employer_letter === "no") {
    flags.push("Employer unwilling to provide an authorisation letter — this is a significant obstacle");
  }
  if (answers.employer_letter === "not-asked") {
    flags.push("Haven't raised the authorisation letter with your employer yet — this conversation needs to happen early");
  }

  // Qualifications
  if (answers.qualifications === "exp-hard") {
    flags.push("Experience hard to document on paper — we can help structure your evidence before you apply");
  }

  // Payment method
  if (answers.payment_method === "platform") {
    flags.push("Payment via online platforms only — consulates require clear evidence of regular, traceable income; platform screenshots alone often aren't enough");
  }

  // Schengen
  if (answers.schengen === "no") {
    flags.push("Unable to obtain a Schengen visa — you would need to resolve this before travelling to collect your DNV");
  }
  if (answers.schengen === "unsure") {
    flags.push("Schengen visa requirement uncertain — worth checking your nationality's entry rules early");
  }

  // Submission location
  if (answers.submission_location === "in-spain") {
    flags.push("Already in Spain — the process differs from applying at a consulate; confirm which route applies to your situation");
  }

  // Result
  const seriousFlags = flags.filter((f) =>
    f.includes("Employer unwilling") ||
    f.includes("Spanish entity") ||
    f.includes("established under a year")
  );

  if (seriousFlags.length >= 2) {
    return {
      status: "likely",
      label: "Digital Nomad Visa",
      title: "You may qualify, but there are hurdles",
      message:
        "Your answers show you're broadly in the right territory for the Digital Nomad Visa, but there are a few complications that could seriously affect your application. These aren't necessarily deal-breakers — but they need to be addressed properly before you submit.",
      next: "A consultation is the right next step so we can map out a strategy around your specific situation.",
      flags,
    };
  }

  if (flags.length >= 3) {
    return {
      status: "likely",
      label: "Digital Nomad Visa",
      title: "Looking promising — with some things to sort out",
      message:
        "On balance, you appear to meet the core requirements for Spain's Digital Nomad Visa. There are a handful of points that will need attention before you apply, but none look like definitive blockers based on what you've shared.",
      next: "Book a free consultation and we'll walk through each flag and tell you exactly what to do.",
      flags,
    };
  }

  if (flags.length >= 1) {
    return {
      status: "eligible",
      label: "Digital Nomad Visa",
      title: "You look like a strong candidate",
      message:
        "Based on your answers, you meet the main requirements for Spain's Digital Nomad Visa. There's one or two smaller points worth double-checking, but nothing that should stand in your way with the right preparation.",
      next: "Let's go through the detail and get you ready to apply.",
      flags,
    };
  }

  return {
    status: "eligible",
    label: "Digital Nomad Visa",
    title: "Excellent — you look eligible",
    message:
      "Your profile lines up well with what Spain's Digital Nomad Visa requires. Income, work setup, qualifications, employer situation — everything points in the right direction. The next step is preparing a complete, well-documented application.",
    next: "Book a free consultation and we'll map out your exact application plan.",
  };
}

// ─── Status config ───────────────────────────────────────────────────────────

const statusConfig = {
  eligible: {
    bg: "bg-green-50",
    border: "border-green-200",
    icon: CheckCircle,
    iconColor: "text-green-600",
    badge: "bg-green-100 text-green-800",
  },
  likely: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: AlertCircle,
    iconColor: "text-amber-600",
    badge: "bg-amber-100 text-amber-800",
  },
  "not-eligible": {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: XCircle,
    iconColor: "text-red-500",
    badge: "bg-red-100 text-red-800",
  },
};

// ─── Section colour map ──────────────────────────────────────────────────────

const sectionColors: Record<number, string> = {
  1: "bg-[#EBF0FA] text-[#1B3A6B]",
  2: "bg-[#FFF4EF] text-[#E85520]",
  3: "bg-[#EBF0FA] text-[#1B3A6B]",
  4: "bg-[#FFF4EF] text-[#E85520]",
  5: "bg-[#EBF0FA] text-[#1B3A6B]",
  6: "bg-[#FFF4EF] text-[#E85520]",
};

// ─── Income table component ──────────────────────────────────────────────────

function IncomeTable() {
  return (
    <div className="mb-5 rounded-xl border border-gray-200 overflow-hidden text-xs">
      <div className="bg-[#1B3A6B] text-white px-3 py-2 font-semibold">
        2026 Gross Income Minimums
      </div>
      <div className="divide-y divide-gray-100">
        {INCOME_ROWS.map((row) => (
          <div key={row.size} className="flex justify-between px-3 py-2 bg-white">
            <span className="text-gray-600">{row.size}</span>
            <span className="font-semibold text-[#1B3A6B]">{row.amount}/mo</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Country search combobox ──────────────────────────────────────────────────

function CountrySearchInput({
  selected,
  max,
  search,
  onSearchChange,
  onToggle,
  onContinue,
}: {
  selected: string[];
  max: number;
  search: string;
  onSearchChange: (v: string) => void;
  onToggle: (v: string) => void;
  onContinue: () => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = search.trim().length < 1
    ? []
    : ALL_COUNTRIES.filter(
        (c) =>
          c.toLowerCase().includes(search.toLowerCase()) &&
          !selected.includes(c)
      ).slice(0, 8);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function pick(country: string) {
    if (selected.length < max) onToggle(country);
    onSearchChange("");
    setOpen(false);
  }

  return (
    <div>
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selected.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1.5 bg-[#EBF0FA] text-[#1B3A6B] text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              {c}
              <button
                onClick={() => onToggle(c)}
                className="hover:text-[#E85520] transition-colors"
                aria-label={`Remove ${c}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search input */}
      {selected.length < max && (
        <div ref={containerRef} className="relative mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder="Type to search countries…"
              className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1B3A6B] outline-none text-sm text-gray-700 transition-colors"
            />
          </div>

          {/* Dropdown */}
          {open && filtered.length > 0 && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {filtered.map((c) => (
                <button
                  key={c}
                  onMouseDown={(e) => { e.preventDefault(); pick(c); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#EBF0FA] hover:text-[#1B3A6B] transition-colors"
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {open && search.trim().length > 0 && filtered.length === 0 && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3 text-sm text-gray-400">
              No countries found
            </div>
          )}
        </div>
      )}

      <button
        onClick={onContinue}
        disabled={selected.length === 0}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#1B3A6B] text-white font-semibold text-sm hover:bg-[#0F1F3D] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function EligibilityChecker() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [multiSelection, setMultiSelection] = useState<string[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [countrySearch, setCountrySearch] = useState("");

  const visibleSteps = steps;
  const totalSteps = visibleSteps.length;
  const step = visibleSteps[stepIndex];
  const progress = (stepIndex / totalSteps) * 100;

  // ── Advance logic ─────────────────────────────────────────────────────────

  function advance(value: string | string[]) {
    const newAnswers = { ...answers, [step.id]: value };
    setAnswers(newAnswers);
    setMultiSelection([]);
    setCountrySearch("");

    // Check for early exit on this step
    if (step.earlyExit) {
      const early = step.earlyExit(value, newAnswers);
      if (early) {
        setResult(early);
        return;
      }
    }

    if (stepIndex < totalSteps - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setResult(computeResult(newAnswers));
    }
  }

  function handleSingleSelect(value: string) {
    advance(value);
  }

  function toggleMulti(value: string) {
    const max = step.maxSelections ?? 3;
    setMultiSelection((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : prev.length < max
        ? [...prev, value]
        : prev
    );
  }

  function handleMultiContinue() {
    if (multiSelection.length === 0) return;
    advance(multiSelection);
  }

  function handleBack() {
    if (result) {
      setResult(null);
      setMultiSelection([]);
      setCountrySearch("");
    } else if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      setMultiSelection([]);
      setCountrySearch("");
    }
  }

  function handleReset() {
    setAnswers({});
    setResult(null);
    setStepIndex(0);
    setMultiSelection([]);
    setCountrySearch("");
  }

  const cfg = result ? statusConfig[result.status] : null;
  const StatusIcon = cfg?.icon;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden max-w-2xl mx-auto">
      {/* Progress bar */}
      {!result && (
        <div className="h-1.5 bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-[#1B3A6B] to-[#FF6B35] transition-all duration-500"
            style={{ width: `${Math.max(progress, 4)}%` }}
          />
        </div>
      )}

      <div className="p-6 sm:p-8">
        {!result ? (
          <>
            {/* Header row */}
            <div className="flex items-center justify-between mb-4">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${sectionColors[step.sectionNum]}`}
              >
                Section {step.sectionNum} — {step.section}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">
                  {stepIndex + 1} / {totalSteps}
                </span>
                {stepIndex > 0 && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#1B3A6B] transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                )}
              </div>
            </div>

            {/* Question */}
            <h2 className="text-lg sm:text-xl font-bold text-[#0F1F3D] mb-2 leading-snug">
              {step.question}
            </h2>

            {step.subtext && (
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">{step.subtext}</p>
            )}

            {/* Income table */}
            {step.incomeTable && <IncomeTable />}

            {/* Options */}
            {step.type === "single" ? (
              <div className="space-y-2.5">
                {step.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSingleSelect(opt.value)}
                    className="w-full text-left flex items-center gap-3 p-4 rounded-xl border-2 border-gray-100 hover:border-[#1B3A6B] hover:bg-[#EBF0FA] transition-all group"
                  >
                    {opt.icon && (
                      <span className="text-lg w-7 text-center shrink-0">{opt.icon}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-sm text-gray-700 group-hover:text-[#1B3A6B] leading-snug block">
                        {opt.label}
                      </span>
                      {opt.sublabel && (
                        <span className="text-xs text-gray-400">{opt.sublabel}</span>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#FF6B35] shrink-0 transition-colors" />
                  </button>
                ))}
              </div>
            ) : step.type === "country-search" ? (
              /* Country search combobox */
              <CountrySearchInput
                selected={multiSelection}
                max={step.maxSelections ?? 3}
                search={countrySearch}
                onSearchChange={setCountrySearch}
                onToggle={toggleMulti}
                onContinue={handleMultiContinue}
              />
            ) : (
              /* Multi-select */
              <div>
                <div className="space-y-2.5 mb-4">
                  {step.options.map((opt) => {
                    const selected = multiSelection.includes(opt.value);
                    const maxed =
                      !selected && multiSelection.length >= (step.maxSelections ?? 3);
                    return (
                      <button
                        key={opt.value}
                        onClick={() => !maxed && toggleMulti(opt.value)}
                        disabled={maxed}
                        className={`w-full text-left flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                          selected
                            ? "border-[#1B3A6B] bg-[#EBF0FA]"
                            : maxed
                            ? "border-gray-100 opacity-40 cursor-not-allowed"
                            : "border-gray-100 hover:border-[#1B3A6B] hover:bg-[#EBF0FA]"
                        }`}
                      >
                        {opt.icon && (
                          <span className="text-lg w-7 text-center shrink-0">{opt.icon}</span>
                        )}
                        <div className="flex-1 min-w-0">
                          <span
                            className={`font-medium text-sm leading-snug block ${
                              selected ? "text-[#1B3A6B]" : "text-gray-700"
                            }`}
                          >
                            {opt.label}
                          </span>
                          {opt.sublabel && (
                            <span className="text-xs text-gray-400">{opt.sublabel}</span>
                          )}
                        </div>
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                            selected
                              ? "bg-[#1B3A6B] border-[#1B3A6B]"
                              : "border-gray-300"
                          }`}
                        >
                          {selected && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={handleMultiContinue}
                  disabled={multiSelection.length === 0}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#1B3A6B] text-white font-semibold text-sm hover:bg-[#0F1F3D] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* ── Result ──────────────────────────────────────────────────────── */
          <div>
            <div className={`rounded-2xl ${cfg!.bg} ${cfg!.border} border p-5 mb-5`}>
              <div className="flex items-start gap-3">
                {StatusIcon && (
                  <StatusIcon className={`w-7 h-7 ${cfg!.iconColor} shrink-0 mt-0.5`} />
                )}
                <div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg!.badge} mb-2 inline-block`}
                  >
                    {result.label}
                  </span>
                  <h3 className="text-xl font-bold text-[#0F1F3D] mb-2">{result.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{result.message}</p>
                </div>
              </div>
            </div>

            {/* Yellow flags */}
            {result.flags && result.flags.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Points to address before applying
                </p>
                <ul className="space-y-2">
                  {result.flags.map((flag, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                      <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                        !
                      </span>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-sm text-gray-600 mb-5 font-medium">{result.next}</p>

            <div className="space-y-2.5">
              <Link href="/book"
                className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl bg-[#FF6B35] text-white font-semibold text-sm hover:bg-[#E85520] transition-colors"
              >
                Book Free Consultation
                <ExternalLink className="w-4 h-4" />
              </Link>
              <button
                onClick={handleReset}
                className="flex items-center justify-center w-full px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium text-sm hover:border-[#1B3A6B] hover:text-[#1B3A6B] transition-all"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
