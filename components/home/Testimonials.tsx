const DEFAULT_TESTIMONIALS = [
  {
    _id: "1",
    name: "Sarah Mitchell",
    country: "🇺🇸 United States",
    visa: "Digital Nomad Visa",
    quote: "I was completely overwhelmed by the paperwork requirements until I found Digital Nomad In Spain. They made the entire process feel effortless. I received my DNV approval in just 6 weeks!",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
    rating: 5,
  },
  {
    _id: "2",
    name: "James & Patricia Wong",
    country: "🇬🇧 United Kingdom",
    visa: "Non-Lucrative Visa",
    quote: "We retired early and wanted to spend our years in Spain. The team guided us through every step — from apostilling our pension statements to submitting in Madrid. Couldn't have done it without them.",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
    rating: 5,
  },
  {
    _id: "3",
    name: "Marco Fernandez",
    country: "🇦🇺 Australia",
    visa: "Digital Nomad Visa",
    quote: "As a freelance developer, the DNV was perfect for me. The team explained every income threshold, every document, and followed up with the consulate on my behalf. Now I'm living in Barcelona and loving it!",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    rating: 5,
  },
];

type SanityTestimonial = {
  _id: string;
  name: string;
  country?: string;
  visa?: string;
  quote: string;
  avatarUrl?: string;
  rating?: number;
};

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials({ data }: { data?: SanityTestimonial[] | null }) {
  const items = data?.length ? data : DEFAULT_TESTIMONIALS;

  return (
    <section className="py-24 bg-[#F7F8FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#FF6B35] text-sm font-semibold uppercase tracking-wider">
            Client Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F1F3D] mt-2 mb-4">
            Real people, real approvals
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            Join hundreds of happy clients now living their best life in Spain.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((t) => (
            <div key={t._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-5xl text-[#FF6B35] font-serif leading-none mb-4">&quot;</div>
              <p className="text-gray-700 text-sm leading-relaxed mb-6">{t.quote}</p>
              <div className="flex items-center gap-3">
                {t.avatarUrl && (
                  <img src={t.avatarUrl} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                )}
                <div>
                  <p className="font-semibold text-[#0F1F3D] text-sm">{t.name}</p>
                  {t.country && <p className="text-xs text-gray-500">{t.country}</p>}
                  {t.visa && <p className="text-xs text-[#1B3A6B] font-medium">{t.visa}</p>}
                </div>
                {t.rating && (
                  <div className="ml-auto">
                    <Stars count={t.rating} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
