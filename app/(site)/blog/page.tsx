import type { Metadata } from "next";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { sanityFetch } from "@/lib/live";
import { urlFor } from "@/lib/sanity";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Expert guides on Spain's Digital Nomad Visa, Non-Lucrative Visa, expat life, taxes, banking, and everything you need to know before moving to Spain.",
};

type SanityPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  mainImage?: unknown;
  categories?: string[];
  featured?: boolean;
};

const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  mainImage,
  "categories": categories[]->title,
  featured
}`;

const ALL_CATEGORIES = ["All", "Digital Nomad Visa", "Non-Lucrative Visa", "Spain Life", "Taxes & Banking", "Success Stories", "After Approval", "Comparison", "After Approval"];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getImageUrl(mainImage: unknown): string {
  if (!mainImage) return "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=700&q=80";
  try {
    return urlFor(mainImage).width(700).height(400).url();
  } catch {
    return "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=700&q=80";
  }
}

export default async function BlogPage() {
  const { data: rawPosts } = await sanityFetch({ query: POSTS_QUERY }).catch(() => ({ data: [] }));
  const posts = (rawPosts ?? []) as SanityPost[];

  // Derive unique categories from actual posts, keeping a sensible order
  const postCategories = Array.from(new Set(posts.flatMap((p) => p.categories ?? [])));
  const categories = ["All", ...ALL_CATEGORIES.filter((c) => c !== "All" && postCategories.includes(c)), ...postCategories.filter((c) => !ALL_CATEGORIES.includes(c))];

  const featured = posts.find((p) => p.featured) ?? posts[0] ?? null;
  const rest = posts.filter((p) => p._id !== featured?._id);

  return (
    <>
      {/* Header */}
      <section className="bg-[#1B3A6B] pt-32 pb-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-blue-200 text-lg max-w-2xl">
            Expert guides, real client stories, and everything you need to know
            about moving to Spain.
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#F7F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  cat === "All"
                    ? "bg-[#1B3A6B] text-white"
                    : "bg-white text-gray-600 hover:bg-[#EBF0FA] hover:text-[#1B3A6B] border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured post */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group block mb-10 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <img
                    src={getImageUrl(featured.mainImage)}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-[#FF6B35] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Featured
                  </span>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  {featured.categories?.[0] && (
                    <span className="text-xs font-semibold text-[#1B3A6B] uppercase tracking-wider mb-2">
                      {featured.categories[0]}
                    </span>
                  )}
                  <h2 className="text-2xl font-bold text-[#0F1F3D] mb-3 group-hover:text-[#1B3A6B] transition-colors leading-snug">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {featured.excerpt}
                    </p>
                  )}
                  {featured.publishedAt && (
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(featured.publishedAt)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 mt-4 text-sm font-semibold text-[#FF6B35]">
                    Read article
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Empty state */}
          {posts.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg font-medium">No posts yet</p>
              <p className="text-sm mt-1">Blog posts will appear here once published.</p>
            </div>
          )}

          {/* Post grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={getImageUrl(post.mainImage)}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {post.categories?.[0] && (
                    <span className="absolute top-3 left-3 bg-[#1B3A6B] text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      {post.categories[0]}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  {post.publishedAt && (
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>
                  )}
                  <h3 className="font-bold text-[#0F1F3D] text-sm leading-snug mb-2 group-hover:text-[#1B3A6B] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-[#FF6B35]">
                    Read more
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
