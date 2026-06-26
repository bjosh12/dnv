// Isolated layout for Sanity Studio — no site navbar/footer/widgets
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
