import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { draftMode } from "next/headers";
import { Calendar, ArrowLeft } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/lib/sanity";
import { getPostBySlug } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const revalidate = 60;

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85";

// BabyLoveGrowth articles open with an <h1> title and hero image that duplicate
// this page's own hero banner — strip that lead-in before rendering the body.
function stripDuplicateLead(html: string): string {
  return html
    .replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, "")
    .replace(/^\s*<p>\s*<img[^>]*>\s*<\/p>\s*/i, "");
}

function buildBreadcrumbSchema(postTitle: string, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: postTitle, item: `${SITE_URL}/blog/${slug}` },
    ],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled: preview } = await draftMode();
  const resolved = await getPostBySlug(slug, preview);
  if (!resolved) return { title: "Post Not Found" };

  if (resolved.source === "blg") {
    const post = resolved.data;
    return buildMetadata(
      { title: post.title, description: post.meta_description, imageUrl: post.hero_image_url },
      {
        title: post.title,
        description: post.meta_description ?? post.excerpt ?? "",
        path: `/blog/${slug}`,
        type: "article",
      }
    );
  }

  const post = resolved.data as {
    title?: string;
    excerpt?: string;
    mainImage?: Parameters<typeof urlFor>[0];
    seo?: { title?: string; description?: string; imageUrl?: string; noIndex?: boolean };
  };
  const mainImageUrl = post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : undefined;
  return buildMetadata(
    { ...post.seo, imageUrl: post.seo?.imageUrl || mainImageUrl },
    {
      title: post.title ?? "Blog Post",
      description: post.excerpt ?? "",
      path: `/blog/${slug}`,
      type: "article",
    }
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { isEnabled: preview } = await draftMode();
  const resolved = await getPostBySlug(slug, preview);

  if (!resolved) notFound();

  if (resolved.source === "blg") {
    const post = resolved.data;
    const imageUrl = post.hero_image_url || FALLBACK_IMAGE;
    // post.keywords is BLG's SEO targeting list — too spammy for the hero pill.
    const category = null;
    const publishedAt = post.created_at
      ? new Date(post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : null;

    // BabyLoveGrowth doesn't always return jsonLd for an article — fall back to
    // our own BlogPosting so every post ships structured data, not just some.
    const fallbackArticleSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.meta_description ?? post.excerpt ?? "",
      image: imageUrl,
      datePublished: post.created_at ?? undefined,
      dateModified: post.created_at ?? undefined,
      url: `${SITE_URL}/blog/${slug}`,
      author: { "@type": "Person", name: SITE_NAME, url: `${SITE_URL}/about` },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(post.jsonLd ?? fallbackArticleSchema) }}
        />
        {/* FAQPage rich results are restricted to gov/health sites — never emit
            that type here, whatever the upstream API returns. */}
        {post.faqJsonLd && post.faqJsonLd["@type"] !== "FAQPage" && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(post.faqJsonLd) }} />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema(post.title, slug)) }}
        />
        <BlogHero imageUrl={imageUrl} title={post.title} category={category} publishedAt={publishedAt} />
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-4 gap-12">
              <article className="lg:col-span-3">
                {/* The detail endpoint's `excerpt` field is unreliable (can return a
                    mangled title+image-alt+body blob) — meta_description is clean. */}
                {post.meta_description && (
                  <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-[#FF6B35] pl-4">
                    {post.meta_description}
                  </p>
                )}
                <div
                  className="prose prose-lg max-w-none text-gray-700 prose-headings:text-[#0F1F3D] prose-a:text-[#FF6B35]"
                  dangerouslySetInnerHTML={{ __html: stripDuplicateLead(post.content_html) }}
                />
                {/* post.keywords is BabyLoveGrowth's internal SEO keyword-targeting
                    list, not editorial tags — not meant for public display. */}
              </article>
              <ConsultSidebar />
            </div>
          </div>
        </section>
      </>
    );
  }

  type SanityPost = {
    _id: string;
    title: string;
    slug: { current: string };
    publishedAt?: string;
    excerpt?: string;
    body?: unknown[];
    mainImage?: unknown;
    categories?: string[];
    author?: { name: string; image?: unknown };
    seo?: { title?: string };
  };
  const post = resolved.data as SanityPost;

  const imageUrl = post.mainImage ? urlFor(post.mainImage).width(1200).height(480).url() : FALLBACK_IMAGE;
  const category = post.categories?.[0] ?? null;
  const publishedAt = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;
  // Match the resolved <title> tag (buildMetadata prefers seo.title when set)
  // so the schema headline never diverges from what's actually rendered.
  const resolvedTitle = post.seo?.title || post.title;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: resolvedTitle,
    description: post.excerpt ?? "",
    image: imageUrl,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.publishedAt ?? undefined,
    url: `${SITE_URL}/blog/${slug}`,
    author: {
      "@type": "Person",
      name: post.author?.name ?? SITE_NAME,
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
    ...(post.categories?.length && { keywords: post.categories.join(", ") }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema(resolvedTitle, slug)) }}
      />
      <BlogHero imageUrl={imageUrl} title={post.title} category={category} publishedAt={publishedAt} />
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-12">
            <article className="lg:col-span-3">
              {post.excerpt && (
                <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-[#FF6B35] pl-4">
                  {post.excerpt}
                </p>
              )}
              {post.body ? (
                <div className="prose prose-lg max-w-none text-gray-700">
                  <PortableText
                    value={post.body as import("@portabletext/types").TypedObject[]}
                    components={{
                      block: {
                        h2: ({ children }) => <h2 className="text-2xl font-bold text-[#0F1F3D] mt-8 mb-4">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-bold text-[#0F1F3D] mt-6 mb-3">{children}</h3>,
                        normal: ({ children }) => <p className="leading-relaxed mb-4 text-gray-600">{children}</p>,
                      },
                      marks: {
                        link: ({ children, value }) => {
                          const isInternal = value?.href?.includes("digitalnomadinspain.com");
                          return (
                            <a
                              href={value?.href}
                              target={isInternal ? "_self" : "_blank"}
                              rel={isInternal ? undefined : "noopener noreferrer"}
                              className="text-[#FF6B35] underline underline-offset-2 hover:text-[#E85520] transition-colors"
                            >
                              {children}
                            </a>
                          );
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <p className="text-gray-500 italic">No content yet — add body text in the Studio.</p>
              )}
              <TagFooter tags={post.categories ?? []} />
            </article>
            <ConsultSidebar />
          </div>
        </div>
      </section>
    </>
  );
}

function BlogHero({
  imageUrl,
  title,
  category,
  publishedAt,
}: {
  imageUrl: string;
  title: string;
  category: string | null;
  publishedAt: string | null;
}) {
  return (
    <div className="relative h-72 sm:h-96 lg:h-[480px] overflow-hidden">
      <Image
        src={imageUrl}
        alt={title}
        fill
        preload
        fetchPriority="high"
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F3D]/80 via-[#0F1F3D]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-gray-300 text-sm mb-4 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            All Posts
          </Link>
          {category && (
            <span className="inline-block bg-[#FF6B35] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {category}
            </span>
          )}
          <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight max-w-3xl">{title}</h1>
          {publishedAt && (
            <div className="flex items-center gap-4 mt-3 text-gray-300 text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {publishedAt}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TagFooter({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <div className="mt-10 pt-6 border-t border-gray-100">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500 font-medium">Tagged:</span>
        {tags.map((tag) => (
          <span key={tag} className="text-xs bg-[#EBF0FA] text-[#1B3A6B] px-3 py-1 rounded-full font-medium">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function ConsultSidebar() {
  return (
    <aside className="space-y-6">
      <div className="bg-[#1B3A6B] text-white rounded-2xl p-6 sticky top-24">
        <h3 className="font-bold mb-2">Ready to apply?</h3>
        <p className="text-sm text-blue-200 mb-4 leading-relaxed">
          Book a free 45-minute consultation. We&apos;ll assess your specific situation and give you a clear roadmap.
        </p>
        <Link href="/book" className="block text-center px-4 py-3 rounded-xl bg-[#FF6B35] text-white font-semibold text-sm hover:bg-[#E85520] transition-colors">
          Book Free Consultation
        </Link>
        <Link href="/eligibility" className="block text-center mt-2 px-4 py-3 rounded-xl border border-white/30 text-white font-medium text-sm hover:bg-white/10 transition-colors">
          Check Eligibility
        </Link>
      </div>
    </aside>
  );
}
