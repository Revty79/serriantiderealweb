import Link from "next/link";

const dashboardCards = [
  {
    title: "The Source Forge",
    description: "Create and manage worlds, eras, and settings under your control as G.O.D.",
    action: "Light The Forge",
    href: "/coming-soon?area=source-forge",
    accent: "amber",
  },
  {
    title: "The Gods' Realm",
    description: "Design campaigns, sessions, encounters, and the systems behind your world.",
    action: "Enter Realm",
    href: "/coming-soon?area=gods-realm",
    accent: "gold",
  },
  {
    title: "The Players' Realm",
    description: "Join a table, manage Characters, and continue your adventures.",
    action: "Enter Realm",
    href: "/coming-soon?area=players-realm",
    accent: "emerald",
  },
  {
    title: "Free Tools",
    description: "Access character creators, calculators, and other public utilities.",
    action: "Open Tools",
    href: "/coming-soon?area=free-tools",
    accent: "violet",
  },
  {
    title: "The Astral Gate",
    description: "Gateway to live tables, maps, and the future Serrian Tide VTT.",
    action: "Enter Gate",
    href: "/coming-soon?area=astral-gate",
    accent: "cyan",
  },
  {
    title: "The Bazaar",
    description: "Browse future world packs, tools, modules, and community creations.",
    action: "Enter Shop",
    href: "/coming-soon?area=bazaar",
    accent: "blue",
  },
];

export default function DashboardPage() {
  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title font-evanescent">Dashboard</h1>
          <p>Welcome, Adventurer</p>
        </div>

        <div className="dashboard-account-actions">
          <Link href="/coming-soon?area=profile">Profile</Link>
          <Link href="/">Logout</Link>
        </div>
      </header>

      <section className="dashboard-grid" aria-label="Serrian Tide destinations">
        {dashboardCards.map((card) => (
          <article key={card.title} className={`dashboard-card dashboard-card--${card.accent}`}>
            <div className="dashboard-card-mark" aria-hidden="true">
              <span />
            </div>

            <h2>{card.title}</h2>
            <p>{card.description}</p>

            <Link className="dashboard-card-action" href={card.href}>
              {card.action}
            </Link>
          </article>
        ))}
      </section>

      <section className="dashboard-status" aria-label="Temporary access status">
        <p>
          <span className="font-evanescent">Build mode</span>
          <strong>Temporary click-through enabled</strong>
        </p>
        <span>Authentication and role permissions will be connected later.</span>
      </section>

      <footer className="dashboard-footer">
        <Link href="/">← Return Home</Link>
        <span className="dashboard-footer-brand">Serrian Tide</span>
      </footer>
    </main>
  );
}
