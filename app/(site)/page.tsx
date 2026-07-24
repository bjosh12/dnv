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
import Newsletter from "@/components/home/NewsletterLazy";
import { getHomePage, getTestimonials, getSiteSettings } from "@/lib/sanity";
import { getMergedPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const homePage = await getHomePage().catch(() => null);
  return buildMetadata(homePage?.seo, {
    title: "Spain Digital Nomad Visa Consultants – 98% Approval Rate",
    description: "Get your Spain Digital Nomad Visa approved with expert help. 98% approval rate, 500+ clients, end-to-end support. Book your free consultation today.",
    path: "/",
  });
}

export default async function Home() {
  const { isEnabled: preview } = await draftMode();

  const [homePage, testimonials, allPosts, siteSettings] = await Promise.all([
    getHomePage(preview),
    getTestimonials(preview),
    getMergedPosts(preview),
    getSiteSettings(preview),
  ]);
  const posts = allPosts.slice(0, 3);

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
