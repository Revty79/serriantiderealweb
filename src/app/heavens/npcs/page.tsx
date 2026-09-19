import Link from "next/link";
import "./npcs.css";
import "../design-mode.css";

export default function NpcsPage() {
  return <main className="npcs-page">
    <header className="npcs-header">
      <Link href="/heavens" className="font-portcullion npcs-logo">Serrian<br />Tide</Link>
      <div><p>THE HEAVENS / NPCS</p><h1 className="font-sans">NPC Master Sheet</h1><span>Create, find, edit, archive, and restore Campaign NPCs.</span></div>
      <nav><Link href="/heavens">← The Heavens</Link></nav>
    </header>

    <aside className="npcs-scope-banner is-god">
      <div><p>DESIGN MODE · G.O.D. OWNER SCOPE</p><h2 className="font-sans">NPCs in Campaigns you own</h2></div>
      <span>All compact NPC authoring fields and creation controls are visible for redesign. Nothing saves yet.</span>
    </aside>

    <section className="npcs-control">
      <div><p>CAMPAIGN CONTEXT</p><h2 className="font-sans">Choose the NPC archive</h2></div>
      <label><span>Campaign</span><select><option>Design Campaign</option></select></label>
      <button type="button">Create NPC</button>
    </section>

    <section className="npcs-master">
      <header>
        <div><p>MASTER NPC INDEX</p><h2 className="font-sans">Design Campaign</h2><span>1 design NPC record</span></div>
        <div className="npcs-index-tools">
          <div className="npcs-segmented"><button aria-pressed="true">Active</button><button>Archived</button></div>
          <input type="search" aria-label="Search NPCs" placeholder="Search name, role, or source" />
        </div>
      </header>
      <div className="npcs-grid">
        <article className="npcs-card">
          <header><span>NPC-DRAFT</span><span className="npcs-status is-active">draft</span></header>
          <strong>New NPC Draft</strong><p>No role label</p>
          <dl><div><dt>Kind</dt><dd>Race NPC</dd></div><div><dt>Build</dt><dd>Simple</dd></div><div><dt>Source</dt><dd>Unconfigured</dd></div></dl>
          <footer><button type="button">Open Simple Editor</button></footer>
        </article>
      </div>
    </section>

    <section className="npcs-simple-editor" aria-labelledby="simple-npc-heading">
      <header>
        <div><p>COMPACT NPC RECORD</p><h2 id="simple-npc-heading" className="font-sans">New NPC Draft</h2><span>Unconfigured · Simple NPC · design mode</span></div>
        <button type="button" disabled>Close</button>
      </header>
      <div className="npcs-form-grid">
        <label><span>Name</span><input /></label>
        <label><span>Role / Label</span><input /></label>
        <label><span>Origin</span><input placeholder="Race or Creature source" /></label>
        <label className="is-wide"><span>Short Personality / Description</span><textarea rows={3} /></label>
        <label className="is-wide"><span>Notes</span><textarea rows={4} /></label>
      </div>
      <footer>
        <span>Upgrade is one-way. It preserves this record and opens the full editor.</span>
        <div><button type="button" disabled>Save Simple NPC</button><button type="button">Upgrade to Detailed</button></div>
      </footer>
    </section>

    <section className="npcs-simple-editor" aria-labelledby="new-npc-heading">
      <header><div><p>NEW CAMPAIGN NPC</p><h2 id="new-npc-heading" className="font-sans">Choose a source and build depth</h2><span>This mirrors the old creation dialog while we redesign it.</span></div></header>
      <div className="npcs-form-grid">
        <label><span>Origin</span><select><option>Race</option><option>Creature</option></select></label>
        <label><span>Build Mode</span><select><option>Simple</option><option>Detailed</option></select></label>
        <label className="is-wide"><span>Find Source Master</span><input type="search" placeholder="Search Race or master Creature" /></label>
        <label><span>Source Master</span><select><option>Choose source</option></select></label>
        <label><span>NPC Name</span><input /></label>
        <label><span>Role / Label</span><input placeholder="Innkeeper, guide, rival…" /></label>
        <label className="is-wide"><span>Short Personality / Description</span><textarea rows={3} /></label>
        <label className="is-wide"><span>Notes</span><textarea rows={3} /></label>
      </div>
    </section>
  </main>;
}
