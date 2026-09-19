import Link from "next/link";
import "./realms.css";

const actions = [
  { title: "TABLETOP CONSOLE", subtitle: "Live Session Workspace", description: "Open current table state, requests, sources, Rolls, and recent history." },
  { title: "CHARACTER SHEET", subtitle: "Identity & Record", description: "Open your selected Character sheet or continue building an unfinished Character." },
  { title: "ADVANCE CHARACTER", subtitle: "Experience & Quintessence", description: "Spend Experience and Quintessence after Character creation is complete." },
  { title: "SPELLBOOK", subtitle: "Known Magic", description: "Review and manage this Character's saved Spells." },
  { title: "MAGIC CALCULATOR", subtitle: "Spell Construction", description: "Build, test, and save magic for the selected Character." },
];

export default function RealmsPage() {
  return (
    <main className="realms-page">
      <div className="realms-shell">
        <header className="realms-header">
          <Link href="/dashboard" className="font-portcullion realms-logo">Serrian<br />Tide</Link>
          <div>
            <p>PLAYER PORTAL</p>
            <h1 className="font-evanescent">The Realms</h1>
            <span>Welcome, Adventurer</span>
          </div>
        </header>

        <section className="realms-control">
          <div className="realms-section-heading">
            <div>
              <p>ADVENTURING CONTEXT</p>
              <h2>Your Realm</h2>
            </div>
            <span>Select the Campaign and Character whose story you want to continue.</span>
          </div>

          <div className="realms-control-grid">
            <label>
              <span>Campaign</span>
              <select disabled>
                <option>No Campaign Memberships</option>
              </select>
            </label>
            <label>
              <span>Character</span>
              <select disabled>
                <option>Select a Campaign First</option>
              </select>
            </label>
          </div>

          <div className="realms-character-create">
            <div className="realms-character-create__buttons">
              <button type="button" disabled>Open Character Editor</button>
              <button type="button" disabled>Random Character</button>
            </div>
            <span>Select a Character assigned to you, then open its editor or let the generator build an unfinished draft.</span>
          </div>
        </section>

        <section className="realms-actions">
          <div className="realms-section-heading">
            <div>
              <p>CHARACTER ACTIONS</p>
              <h2>Your Character</h2>
            </div>
            <span>Choose a Character above.</span>
          </div>

          <div className="realms-action-grid">
            {actions.map((action) => (
              <article key={action.title} className="realms-action-card is-disabled">
                <span>{action.subtitle}</span>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
                <strong>Select a Character</strong>
              </article>
            ))}
          </div>
        </section>

        <footer className="realms-footer">
          <Link href="/dashboard">← Return to Paths</Link>
          <span className="font-portcullion">Serrian Tide</span>
        </footer>
      </div>
    </main>
  );
}
