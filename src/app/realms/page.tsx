import Link from "next/link";

const actions = [
  { title: "TABLETOP CONSOLE", subtitle: "Live Session Workspace", description: "Open current table state, requests, sources, Rolls, and recent history." },
  { title: "CHARACTER SHEET", subtitle: "Identity & Record", description: "Open your selected Character sheet or continue building an unfinished Character." },
  { title: "ADVANCE CHARACTER", subtitle: "Experience & Quintessence", description: "Spend Experience and Quintessence after Character creation is complete." },
  { title: "SPELLBOOK", subtitle: "Known Magic", description: "Review and manage this Character's saved Spells." },
  { title: "MAGIC CALCULATOR", subtitle: "Spell Construction", description: "Build, test, and save magic for the selected Character." },
];

export default function RealmsPage() {
  return (
    <main className="portal-page">
      <div className="portal-shell">
        <header className="split-hero">
          <Link href="/dashboard" className="split-brand">Serrian Tide</Link>
          <div>
            <p className="portal-eyebrow">Player Portal</p>
            <h1 className="font-evanescent">The Realms</h1>
            <p>Welcome, Adventurer</p>
          </div>
        </header>

        <section className="portal-panel">
          <div className="portal-section-heading portal-section-heading--split">
            <div>
              <p className="portal-eyebrow">Adventuring Context</p>
              <h2>Your Realm</h2>
            </div>
            <p>Select the Campaign and Character whose story you want to continue.</p>
          </div>

          <div className="context-grid context-grid--two">
            <label>Campaign<select disabled><option>No Campaign Memberships</option></select></label>
            <label>Character<select disabled><option>Select a Campaign First</option></select></label>
          </div>

          <div className="realm-buttons">
            <button disabled>Open Character Editor</button>
            <button disabled>Random Character</button>
            <span>Character tools will activate after the Character system is connected.</span>
          </div>
        </section>

        <section className="portal-panel">
          <div className="portal-section-heading portal-section-heading--split">
            <div>
              <p className="portal-eyebrow">Character Actions</p>
              <h2>Your Character</h2>
            </div>
            <p>Choose a Character above.</p>
          </div>

          <div className="realm-action-grid">
            {actions.map((action) => (
              <article key={action.title} className="realm-action-card is-disabled">
                <span>{action.subtitle}</span>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
                <strong>Select a Character</strong>
              </article>
            ))}
          </div>
        </section>

        <footer className="portal-footer">
          <Link href="/dashboard">← Return to Paths</Link>
          <span className="footer-brand">Serrian Tide</span>
        </footer>
      </div>
    </main>
  );
}
