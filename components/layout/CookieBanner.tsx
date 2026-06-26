"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-[#0F1F3D] text-white rounded-2xl shadow-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm leading-relaxed text-gray-300">
            We use cookies to improve your experience and analyse site traffic.
            By clicking &quot;Accept&quot;, you consent to our use of cookies.{" "}
            <Link href="/privacy" className="text-[#FF6B35] hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-white/20 rounded-lg transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm font-semibold bg-[#FF6B35] hover:bg-[#E85520] text-white rounded-lg transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
