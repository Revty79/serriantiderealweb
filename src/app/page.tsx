import Link from "next/link";

export default function Home() {
  return (
    <main className="landing-page">
      <section className="landing-hero" aria-labelledby="serrian-tide-title">
        <h1 id="serrian-tide-title" className="st-brand">
          Serrian Tide
        </h1>

        <div className="landing-actions" aria-label="Serrian Tide entry">
          <Link className="landing-enter" href="/login">
            Enter Your Imagination
          </Link>
        </div>
      </section>
    </main>
  );
}
