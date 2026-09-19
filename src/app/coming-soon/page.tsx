import Link from "next/link";

export default async function ComingSoonPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string }>;
}) {
  const { area } = await searchParams;
  const label = (area ?? "this area")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <main className="coming-soon-page">
      <section>
        <p className="font-evanescent coming-soon-accent">Under Construction</p>
        <h1>{label}</h1>
        <p>We have the path in place. We just have not built this section yet.</p>
        <Link className="landing-enter" href="/dashboard">
          Back to Dashboard
        </Link>
      </section>
    </main>
  );
}
