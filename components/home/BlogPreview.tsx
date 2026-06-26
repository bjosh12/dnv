import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

// Placeholder posts until Sanity is connected
const placeholderPosts = [
  {
    _id: "1",
    title: "Spain's Digital Nomad Visa: Everything You Need to Know in 2025",
    slug: { current: "spain-digital-nomad-visa-guide-2025" },
    excerpt:
      "A comprehensive guide to Spain's Digital Nomad Visa — requirements, income thresholds, documents, and timeline.",
    publishedAt: "2025-03-15",
    categories: ["Digital Nomad Visa"],
    mainImage: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=700&q=80",
  },
  {
    _id: "2",
    title: "Non-Lucrative Visa vs Digital Nomad Visa: Which Is Right for You?",
    slug: { current: "nlv-vs-dnv-comparison" },
    excerpt:
      "Breaking down the key differences between Spain's two most popular long-stay visas to help you choose the right path.",
    publishedAt: "2025-02-28",
    categories: ["Non-Lucrative Visa"],
    mainImage: "https://images.unsplash.com/photo-1555990793-da11153b6c8d?auto=format&fit=crop&w=700&q=80",
  },
  {
    _id: "3",
    title: "Banking in Spain as an Expat: How to Open a Bank Account",
    slug: { current: "banking-spain-expat-guide" },
    excerpt:
      "Step-by-step guide to opening a Spanish bank account as a non-resident — the banks that actually work for expats.",
    publishedAt: "2025-02-10",
    categories: ["Spain Life"],
    mainImage: "https://images.unsplash.com/photo-1464820453369-31d2c0b651af?auto=format&fit=crop&w=700&q=80",
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPreview({ posts }: { posts?: typeof placeholderPosts | null }) {
  const displayPosts = posts?.length ? posts : placeholderPosts;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[#FF6B35] text-sm font-semibold uppercase tracking-wider">
              From the Blog
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F1F3D] mt-2">
              Visa tips & Spain life
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B3A6B] hover:text-[#FF6B35] transition-colors shrink-0"
          >
            View all posts
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPosts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug.current}`}
              className="group flex flex-col rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={post.mainImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {post.categories?.[0] && (
                  <span className="absolute top-3 left-3 bg-[#1B3A6B] text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    {post.categories[0]}
                  </span>
                )}
              </div>
              <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(post.publishedAt)}
                </div>
                <h3 className="font-bold text-[#0F1F3D] text-sm leading-snug mb-2 group-hover:text-[#1B3A6B] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-[#FF6B35]">
                  Read more
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
