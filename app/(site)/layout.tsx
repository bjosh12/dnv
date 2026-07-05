import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButtonLazy";
import CookieBanner from "@/components/layout/CookieBannerLazy";
import { SanityLive } from "@/lib/live";
import { getSiteSettings } from "@/lib/sanity";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraft } = await draftMode();
  const settings = await getSiteSettings().catch(() => null);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton phoneNumber={settings?.whatsappNumber} />
      <CookieBanner />
      <SanityLive includeDrafts={isDraft} />
      {isDraft && (
        <>
          <VisualEditing />
          <div className="fixed bottom-4 left-4 z-50">
            <a
              href="/api/draft-mode/disable"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1B3A6B] text-white text-xs font-semibold hover:bg-[#0F1F3D] transition-colors shadow-lg"
            >
              Exit preview mode
            </a>
          </div>
        </>
      )}
    </div>
  );
}
