const DEFAULT_STATS = [
  { value: "500+", label: "Visas Approved" },
  { value: "98%", label: "Success Rate" },
  { value: "50+", label: "Countries Served" },
  { value: "5★", label: "Average Rating" },
  { value: "6+", label: "Years Experience" },
];

export default function StatsStrip({ data }: { data?: { stats?: typeof DEFAULT_STATS } | null }) {
  const stats = data?.stats?.length ? data.stats : DEFAULT_STATS;

  return (
    <section className="bg-[#1B3A6B] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-0 divide-y sm:divide-y-0 lg:divide-x divide-white/10">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center justify-center py-4 lg:py-0 text-center">
              <span className="text-3xl font-bold text-[#FF6B35]">{stat.value}</span>
              <span className="text-sm text-blue-200 mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
