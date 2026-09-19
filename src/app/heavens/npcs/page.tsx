import Link from "next/link";
import "./npcs.css";

export default function NpcsPage() {
  return <main className="npcs-page">
    <header className="npcs-header">
      <Link href="/heavens" className="font-portcullion npcs-logo">Serrian<br />Tide</Link>
      <div><p>THE HEAVENS / NPCS</p><h1 className="font-sans">NPC Master Sheet</h1><span>Create, find, edit, archive, and restore Campaign NPCs.</span></div>
      <nav><Link href="/heavens">← The Heavens</Link></nav>
    </header>
    <aside className="npcs-scope-banner is-god">
      <div><p>G.O.D. OWNER SCOPE</p><h2 className="font-sans">NPCs in Campaigns you own</h2></div>
      <span>Only active Campaigns you own are listed. Other G.O.D.s&apos; Campaigns remain outside your scope.</span>
    </aside>
    <section className="npcs-control">
      <div><p>CAMPAIGN CONTEXT</p><h2 className="font-sans">Choose the NPC archive</h2></div>
      <label><span>Campaign</span><select disabled><option>No Campaign Selected</option></select></label>
      <button type="button" disabled>Create NPC</button>
    </section>
    <section className="npcs-master">
      <header>
        <div><p>MASTER NPC INDEX</p><h2 className="font-sans">Select a Campaign</h2><span>NPCs live inside their Campaign.</span></div>
        <div className="npcs-index-tools">
          <div className="npcs-segmented"><button disabled aria-pressed="true">Active</button><button disabled>Archived</button></div>
          <input type="search" disabled aria-label="Search NPCs" placeholder="Search name, role, or source" />
        </div>
      </header>
      <div className="npcs-empty"><strong>No Campaign Selected</strong><span>Choose a Campaign above.</span></div>
    </section>
  </main>;
}
