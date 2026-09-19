import Link from "next/link";

const tools = [
  { title: "RACES", subtitle: "Peoples", description: "Create and manage playable Races, anatomy, attributes, movement, traits, and racial Skills.", area: "races" },
  { title: "SKILLS", subtitle: "Abilities", description: "Manage every Serrian Tide Skill, including magical and specialized abilities.", area: "skills" },
  { title: "DERIVED ABILITIES", subtitle: "Milestones", description: "Create abilities gained when Characters meet approved mechanical requirements.", area: "derived-abilities" },
  { title: "EQUIPMENT", subtitle: "Arsenal", description: "Create weapons, armor, ammunition, and general Equipment.", area: "equipment" },
  { title: "INVENTORY", subtitle: "Items", description: "Create and manage non-equipment Inventory content and relationships.", area: "inventory" },
  { title: "CREATURES", subtitle: "Bestiary", description: "Create and manage Creatures, attacks, anatomy, defenses, abilities, variants, and CR.", area: "creatures" },
  { title: "SHOP BUILDER", subtitle: "Campaign Commerce", description: "Create Campaign Shops, staff, stock, and authorized offerings.", area: "shops" },
  { title: "TOWN BUILDER", subtitle: "Campaign Places", description: "Organize Shops, NPCs, and descriptive Places into Town references.", area: "towns" },
  { title: "NPCS", subtitle: "Characters", description: "Create Race NPCs and independent Creature NPC individuals inside Campaigns.", area: "npcs" },
];

export default function HeavensPage() {
  return (
    <main className="portal-page">
      <div className="portal-shell">
        <header className="split-hero">
          <Link href="/dashboard" className="split-brand">Serrian Tide</Link>
          <div>
            <p className="portal-eyebrow">G.O.D. Creation Portal</p>
            <h1 className="font-evanescent">The Heavens</h1>
            <p>Welcome, <strong>Adventurer</strong> — G.O.D.</p>
          </div>
        </header>

        <section className="portal-panel">
          <div className="portal-section-heading portal-section-heading--split">
            <div>
              <p className="portal-eyebrow">Working Context</p>
              <h2>Campaign Control</h2>
            </div>
            <p>Select the Campaign, Player, and Character you are currently working with.</p>
          </div>

          <div className="context-grid">
            <label>Campaign<select disabled><option>No Campaign Selected</option></select></label>
            <label>Player<select disabled><option>Select a Campaign First</option></select></label>
            <label>Character<select disabled><option>Select a Player First</option></select></label>
          </div>
          <p className="shell-note">Campaign context will become active when the database and auth systems are connected.</p>
        </section>

        <Link href="/coming-soon?area=tabletop" className="tabletop-card">
          <div>
            <p className="portal-eyebrow">Live Table Management</p>
            <h2>Tabletop Operations</h2>
            <p>Plan, start, complete, and reopen Campaign Sessions while persistent Character and NPC state remains authoritative.</p>
          </div>
          <strong>Open Sessions →</strong>
        </Link>

        <section className="creation-section">
          <div className="portal-section-heading portal-section-heading--split">
            <div>
              <p className="portal-eyebrow">Creation Libraries</p>
              <h2>Create &amp; Manage <span className="inline-brand">Serrian Tide</span></h2>
            </div>
            <p>Build the systems behind the world.</p>
          </div>

          <div className="creation-grid">
            {tools.map((tool) => (
              <Link key={tool.title} href={"/coming-soon?area=" + tool.area} className="creation-card">
                <span>{tool.subtitle}</span>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
                <strong>Creation tools →</strong>
              </Link>
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
