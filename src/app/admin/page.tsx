import Link from "next/link";

const adminSections = [
  { title: "USER MANAGEMENT", subtitle: "Accounts", description: "View Serrian Tide users and manage their access to the system.", area: "admin-users" },
  { title: "CONTENT OVERVIEW", subtitle: "Site-wide Content", description: "Review Campaigns, Characters, NPCs, ownership, and shared catalog totals.", area: "admin-content" },
  { title: "APPEARANCE", subtitle: "Site Theme", description: "Choose site-wide colors, presentation rules, and future appearance settings.", area: "admin-appearance" },
  { title: "ROLE MANAGEMENT", subtitle: "Permissions", description: "Assign and remove Admin, G.O.D., and Player capabilities.", area: "admin-roles" },
  { title: "SYSTEM OVERVIEW", subtitle: "Administration", description: "Review the health and configuration of the Serrian Tide system.", area: "admin-system" },
];

export default function AdminPage() {
  return (
    <main className="portal-page">
      <div className="portal-shell">
        <header className="admin-hero">
          <div>
            <Link href="/dashboard" className="portal-brand">Serrian Tide</Link>
            <p className="portal-eyebrow">Administration</p>
          </div>
          <div className="admin-identity">
            <span>Signed in as</span>
            <strong>Adventurer</strong>
            <Link href="/dashboard">Return to Access</Link>
          </div>
        </header>

        <section className="portal-section">
          <div className="portal-section-heading">
            <div>
              <h1 className="font-evanescent">Admin Dashboard</h1>
              <p>Manage accounts, permissions, and site-wide content oversight for <span className="inline-brand">Serrian Tide</span>.</p>
            </div>
          </div>

          <div className="admin-grid">
            {adminSections.map((section) => (
              <Link key={section.title} href={"/coming-soon?area=" + section.area} className="admin-card">
                <div>
                  <span className="portal-pill">{section.subtitle}</span>
                  <h2>{section.title}</h2>
                  <p>{section.description}</p>
                </div>
                <strong>Open Management →</strong>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
