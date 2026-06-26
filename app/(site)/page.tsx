import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Hero from "@/components/home/Hero";
import StatsStrip from "@/components/home/StatsStrip";
import ServicesOverview from "@/components/home/ServicesOverview";
import HowItWorks from "@/components/home/HowItWorks";
import WhyUs from "@/components/home/WhyUs";
import Testimonials from "@/components/home/Testimonials";
import BlogPreview from "@/components/home/BlogPreview";
import CTABanner from "@/components/home/CTABanner";
import Newsletter from "@/components/home/Newsletter";
import { getHomePage, getTestimonials, getPosts, getSiteSettings } from "@/lib/sanity";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const homePage = await getHomePage().catch(() => null);
  return buildMetadata(homePage?.seo, {
    title: "Digital Nomad In Spain | Spain Visa Consultants",
    description: "Expert guidance for Spain's Digital Nomad Visa and Non-Lucrative Visa. 98% approval rate, end-to-end support, 500+ approved clients.",
    path: "/",
  });
}

export default async function Home() {
  const { isEnabled: preview } = await draftMode();

  const [homePage, testimonials, posts, siteSettings] = await Promise.all([
    getHomePage(preview),
    getTestimonials(preview),
    getPosts(3, preview),
    getSiteSettings(preview),
  ]);

  return (
    <>
      <Hero data={homePage} />
      <StatsStrip data={siteSettings} />
      <ServicesOverview data={homePage?.servicesSection} />
      <HowItWorks data={homePage} />
      <WhyUs data={homePage} />
      <Testimonials data={testimonials} />
      <BlogPreview posts={posts} />
      <CTABanner data={homePage} />
      <Newsletter data={homePage} />
    </>
  );
}
