import type { Metadata } from "next";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

// Re-fetch from Sanity every 60 seconds — new posts appear within 1 minute of publishing
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Expert guides on Spain's Digital Nomad Visa, Non-Lucrative Visa, expat life, taxes, banking, and everything you need to know before moving to Spain.",
};

// Placeholder posts — will be replaced by Sanity data
const posts = [
  {
    _id: "1",
    title: "Spain's Digital Nomad Visa: Complete 2025 Guide",
    slug: "spain-digital-nomad-visa-guide-2025",
    excerpt: "Everything you need to know about Spain's DNV — requirements, income thresholds, documents, and the application process explained step by step.",
    category: "Digital Nomad Visa",
    date: "2025-03-15",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=700&q=80",
    featured: true,
  },
  {
    _id: "2",
    title: "Non-Lucrative Visa vs Digital Nomad Visa: Which Is Right for You?",
    slug: "nlv-vs-dnv-comparison",
    excerpt: "A detailed comparison of Spain's two most popular long-stay visas to help you choose the right path for your move.",
    category: "Comparison",
    date: "2025-02-28",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1555990793-da11153b6c8d?auto=format&fit=crop&w=700&q=80",
  },
  {
    _id: "3",
    title: "Banking in Spain as an Expat: How to Open a Bank Account",
    slug: "banking-spain-expat-guide",
    excerpt: "The banks that actually work for non-residents, what documents you need, and how to avoid common pitfalls.",
    category: "Spain Life",
    date: "2025-02-10",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1464820453369-31d2c0b651af?auto=format&fit=crop&w=700&q=80",
  },
  {
    _id: "4",
    title: "Spain's Beckham Law Explained: Tax Benefits for New Residents",
    slug: "spain-beckham-law-explained",
    excerpt: "The special tax regime that lets new Spanish residents pay a flat 24% rate on Spanish income. Who qualifies and how to apply.",
    category: "Taxes & Banking",
    date: "2025-01-20",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=700&q=80",
  },
  {
    _id: "5",
    title: "How Sarah Moved from London to Barcelona in 4 Months",
    slug: "sarah-london-barcelona-nlv-success-story",
    excerpt: "A real client story: how a British retiree navigated the Non-Lucrative Visa and is now living her dream life in Catalonia.",
    category: "Success Stories",
    date: "2025-01-05",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=700&q=80",
  },
  {
    _id: "6",
    title: "The TIE Card: What It Is and How to Get It",
    slug: "tie-card-spain-guide",
    excerpt: "After your visa approval, you'll need to apply for a TIE residency card. Here's the complete process.",
    category: "After Approval",
    date: "2024-12-18",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=700&q=80",
  },
];

const categories = ["All", "Digital Nomad Visa", "Non-Lucrative Visa", "Spain Life", "Taxes & Banking", "Success Stories", "After Approval"];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPage() {
  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

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
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-[#FF6B35] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Featured
                  </span>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <span className="text-xs font-semibold text-[#1B3A6B] uppercase tracking-wider mb-2">
                    {featured.category}
                  </span>
                  <h2 className="text-2xl font-bold text-[#0F1F3D] mb-3 group-hover:text-[#1B3A6B] transition-colors leading-snug">
                    {featured.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(featured.date)}
                    </span>
                    <span>{featured.readTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-4 text-sm font-semibold text-[#FF6B35]">
                    Read article
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
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
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#1B3A6B] text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.date)}
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-bold text-[#0F1F3D] text-sm leading-snug mb-2 group-hover:text-[#1B3A6B] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
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
