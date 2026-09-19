import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="dashboard-placeholder">
      <section>
        <h1 className="st-brand dashboard-brand">Serrian Tide</h1>
        <p>You made it through the temporary login.</p>
        <p>This is where we build the real dashboard next.</p>
        <Link className="landing-enter" href="/">
          Back to Landing Page
        </Link>
      </section>
    </main>
  );
}
