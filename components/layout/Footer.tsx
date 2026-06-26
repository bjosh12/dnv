import Link from "next/link";
import { Mail } from "lucide-react";
import { SITE_NAME, SOCIAL_LINKS, CONTACT_EMAIL } from "@/lib/constants";

type SiteSettings = {
  siteName?: string;
  contactEmail?: string;
  socialLinks?: { instagram?: string; facebook?: string; linkedin?: string; youtube?: string };
};
import { LakbyteAmbassadorBadge } from "@/components/ui/LakbyteBadge";

function SocialIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    instagram: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    facebook: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    linkedin: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    youtube: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  };
  return <>{icons[type]}</>;
}

const footerLinks = {
  Services: [
    { label: "Digital Nomad Visa", href: "/services/digital-nomad-visa" },
    { label: "Non-Lucrative Visa", href: "/services/non-lucrative-visa" },
    { label: "Eligibility Checker", href: "/eligibility" },
    { label: "Book Consultation", href: "/book" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer({ settings }: { settings?: SiteSettings | null }) {
  const email = settings?.contactEmail ?? CONTACT_EMAIL;
  const siteName = settings?.siteName ?? SITE_NAME;
  const social = {
    instagram: settings?.socialLinks?.instagram ?? SOCIAL_LINKS.instagram,
    facebook: settings?.socialLinks?.facebook ?? SOCIAL_LINKS.facebook,
    linkedin: settings?.socialLinks?.linkedin ?? SOCIAL_LINKS.linkedin,
    youtube: settings?.socialLinks?.youtube ?? SOCIAL_LINKS.youtube,
  };
  return (
    <footer className="bg-[#0F1F3D] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#FF6B35] flex items-center justify-center">
                <span className="text-white font-bold text-sm">DN</span>
              </div>
              <span className="font-bold text-lg">
                Digital Nomad
                <span className="block text-[#FF6B35] text-base">In Spain</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Spain&apos;s most trusted visa consulting service for digital nomads
              and remote workers. We make your move to Spain simple, legal, and
              stress-free.
            </p>
            <div className="flex items-center gap-1 text-sm text-gray-400 mb-2">
              <Mail className="w-4 h-4 text-[#FF6B35]" />
              <a
                href={`mailto:${email}`}
                className="hover:text-white transition-colors"
              >
                {email}
              </a>
            </div>
            {/* Lakbyte ambassador */}
            <div className="mt-5 mb-1">
              <LakbyteAmbassadorBadge variant="dark" href="https://lakbyte.com" />
            </div>

            {/* Social */}
            <div className="flex gap-3 mt-4">
              {[
                { type: "instagram", href: social.instagram, label: "Instagram" },
                { type: "facebook", href: social.facebook, label: "Facebook" },
                { type: "linkedin", href: social.linkedin, label: "LinkedIn" },
                { type: "youtube", href: social.youtube, label: "YouTube" },
              ].map(({ type, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[#FF6B35] transition-colors"
                >
                  <SocialIcon type={type} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-400 hover:text-[#FF6B35] transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-[#FF6B35] transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span>🇪🇺</span>
            <span>Spain-based service · EU-compliant · GDPR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
