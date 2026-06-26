import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/lib/sanity";
import { sanityFetch } from "@/lib/live";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: raw } = await sanityFetch({
    query: `*[_type == "post" && slug.current == $slug][0] {
      title, excerpt,
      seo { title, description, "imageUrl": image.asset->url, noIndex }
    }`,
    params: { slug },
  }).catch(() => ({ data: null }));
  const post = raw as { title?: string; excerpt?: string; seo?: { title?: string; description?: string; imageUrl?: string; noIndex?: boolean } } | null;
  if (!post) return { title: "Post Not Found" };
  return buildMetadata(post.seo, {
    title: post.title ?? "Blog Post",
    description: post.excerpt ?? "",
    path: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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
  };

  const { data: postRaw } = await sanityFetch({
    query: `*[_type == "post" && slug.current == $slug][0] {
      _id, title, slug, publishedAt, excerpt, body, mainImage,
      "categories": categories[]->title,
      "author": author->{ name, image }
    }`,
    params: { slug },
  }).catch(() => ({ data: null }));
  const post = postRaw as SanityPost | null;

  if (!post) notFound();

  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(480).url()
    : "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85";

  const category = post.categories?.[0] ?? null;
  const publishedAt = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <>
      {/* Hero image */}
      <div className="relative h-72 sm:h-96 lg:h-[480px] overflow-hidden">
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F3D]/80 via-[#0F1F3D]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-gray-300 text-sm mb-4 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All Posts
            </Link>
            {category && (
              <span className="inline-block bg-[#FF6B35] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                {category}
              </span>
            )}
            <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight max-w-3xl">
              {post.title}
            </h1>
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

      {/* Content */}
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
                        h2: ({ children }) => (
                          <h2 className="text-2xl font-bold text-[#0F1F3D] mt-8 mb-4">{children}</h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-xl font-bold text-[#0F1F3D] mt-6 mb-3">{children}</h3>
                        ),
                        normal: ({ children }) => (
                          <p className="leading-relaxed mb-4 text-gray-600">{children}</p>
                        ),
                      },
                    }}
                  />
                </div>
              ) : (
                <p className="text-gray-500 italic">No content yet — add body text in the Studio.</p>
              )}
              {(post.categories?.length ?? 0) > 0 && (
                <div className="mt-10 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-500 font-medium">Tagged:</span>
                    {(post.categories ?? []).map((tag: string) => (
                      <span key={tag} className="text-xs bg-[#EBF0FA] text-[#1B3A6B] px-3 py-1 rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>

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
          </div>
        </div>
      </section>
    </>
  );
}
