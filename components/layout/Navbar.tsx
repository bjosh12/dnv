"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import SiteLogo from "@/components/ui/SiteLogo";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-white shadow-md"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <SiteLogo
              textColor={scrolled || open ? "#1B3A6B" : "#FFFFFF"}
              className="h-7 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label} className="relative group">
                  <button
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      scrolled
                        ? "text-[#1B3A6B] hover:bg-[#EBF0FA]"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    {link.label}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-[#1B3A6B] hover:bg-[#EBF0FA] hover:text-[#FF6B35] transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    scrolled
                      ? "text-[#1B3A6B] hover:bg-[#EBF0FA]"
                      : "text-white hover:bg-white/10"
                  } ${pathname === link.href ? "font-semibold" : ""}`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <Link href="/book"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-[#FF6B35] text-white text-sm font-semibold hover:bg-[#E85520] transition-colors shadow-sm"
            >
              Book Now
            </Link>
            <button
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                scrolled || open
                  ? "text-[#1B3A6B] hover:bg-[#EBF0FA]"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-gray-100 py-4 space-y-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-[#1B3A6B] hover:bg-[#EBF0FA] rounded-lg transition-colors"
                  >
                    {link.label}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {servicesOpen && (
                    <div className="pl-4 mt-1 space-y-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-[#FF6B35] hover:bg-[#EBF0FA] rounded-lg transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2.5 text-sm font-medium text-[#1B3A6B] hover:bg-[#EBF0FA] rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="pt-3 px-3">
              <Link href="/book"
                className="block text-center px-4 py-3 rounded-lg bg-[#FF6B35] text-white text-sm font-semibold hover:bg-[#E85520] transition-colors"
              >
                Book a Free Consultation
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
