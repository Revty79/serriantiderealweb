export default function Home() {
  return (
    <main className="landing-page">
      <section className="landing-hero" aria-labelledby="serrian-tide-title">
        <h1 id="serrian-tide-title" className="st-brand">
          Serrian Tide
        </h1>

        <div className="landing-actions" aria-label="Serrian Tide entry">
          <button
            className="landing-enter"
            type="button"
            disabled
            title="Login and account access are coming next."
          >
            Enter Your Imagination
          </button>
        </div>
      </section>
    </main>
  );
}
