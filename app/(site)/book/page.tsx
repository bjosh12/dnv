import type { Metadata } from "next";
import BookPageClient from "@/components/book/BookPageClient";
import { getAboutPage } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description: "Schedule a free 45-minute visa consultation with our Spain immigration experts. Pick a time that works for you.",
};

export const revalidate = 60;

export default async function BookPage() {
  const aboutData = await getAboutPage().catch(() => null);

  return (
    <>
      {/* Header */}
      <section className="bg-[#1B3A6B] pt-32 pb-16 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Book a Consultation</h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            Two types of consultation — pick what fits your situation.
          </p>
        </div>
      </section>

      <BookPageClient freeItems={aboutData?.consultationCovers} />
    </>
  );
}
