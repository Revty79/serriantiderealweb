import Link from "next/link";
import "./towns.css";
import "../design-mode.css";

export default function TownsPage() {
  return <main className="towns-page">
    <header className="towns-header">
      <Link href="/heavens" className="font-portcullion towns-logo">Serrian<br />Tide</Link>
      <div><p>THE HEAVENS / TOWN BUILDER</p><h1 className="font-sans">Campaign Towns</h1><span>Organize existing Shops and NPCs with Town-owned descriptive Places.</span></div>
      <nav><Link href="/heavens">← The Heavens</Link></nav>
    </header>

    <p className="towns-scope">DESIGN MODE · All Town authoring fields are visible. Nothing saves yet.</p>

    <section className="towns-context">
      <div><p>Campaign scope</p><h2>Design Campaign</h2><span>Results never cross the selected Campaign.</span></div>
      <label className="towns-field"><span>Campaign</span><select><option>Design Campaign</option></select></label>
      <button type="button">New Town</button>
    </section>

    <div className="towns-layout">
      <aside className="towns-library">
        <header><div><p>Campaign library</p><h2>Towns</h2></div><span>1 shown</span></header>
        <div className="towns-segmented"><button aria-pressed="true">Active</button><button>Archived</button></div>
        <label className="towns-field"><span>Search Towns</span><input type="search" placeholder="Name, category, overview, location" /></label>
        <div className="towns-index"><button className="is-selected"><strong>New Town Draft</strong><span>Unconfigured</span><small>0 Shops · 0 NPCs · 0 Places</small></button></div>
      </aside>

      <section className="towns-editor">
        <header className="towns-editor__header">
          <div><p>NEW TOWN DRAFT · DESIGN CAMPAIGN</p><h2>New Town Draft</h2><span>Design mode · local only</span></div>
          <div className="towns-actions"><button disabled>Save Town</button><button disabled>Archive / Delete</button></div>
        </header>

        <section className="towns-panel towns-core">
          <header><div><p>Town record</p><h3>Identity &amp; notes</h3></div></header>
          <div className="towns-grid two">
            <label className="towns-field"><span>Name</span><input /></label>
            <label className="towns-field"><span>Type / category</span><input /></label>
            <label className="towns-field is-wide"><span>Overview</span><textarea rows={4} /></label>
            <label className="towns-field"><span>Location notes</span><textarea rows={3} /></label>
            <label className="towns-field"><span>G.O.D. notes</span><textarea rows={3} /></label>
          </div>
        </section>

        <section className="towns-panel">
          <header><div><p>Existing Campaign records</p><h3>Shops</h3><span>One Town per Shop; Shop staff, offerings, balances, and state remain unchanged.</span></div><strong>0 attached</strong></header>
          <label className="towns-field"><span>Search Shops</span><input type="search" /></label>
          <div className="towns-add-row">
            <label className="towns-field"><span>Available Campaign Shop</span><select><option>Choose a Shop</option></select></label>
            <button disabled>Attach Shop</button>
          </div>
        </section>

        <section className="towns-panel">
          <header><div><p>Campaign characters</p><h3>NPCs</h3><span>Direct Town associations and staff at active attached Shops appear once per NPC.</span></div><strong>0 attached</strong></header>
          <label className="towns-field"><span>Search NPCs</span><input type="search" /></label>
          <div className="towns-grid two">
            <label className="towns-field"><span>Available Campaign NPC</span><select><option>Choose an NPC</option></select></label>
            <label className="towns-field"><span>Town relationship</span><input placeholder="Mayor, resident, guide…" /></label>
            <label className="towns-field is-wide"><span>Town note</span><textarea rows={2} /></label>
          </div>
        </section>

        <section className="towns-panel">
          <header><div><p>Town-owned descriptions</p><h3>Places</h3><span>Places describe the Town; they do not create runtime mechanics.</span></div><strong>0 places</strong></header>
          <div className="towns-grid two">
            <label className="towns-field"><span>Place name</span><input /></label>
            <label className="towns-field"><span>Type / category</span><input /></label>
            <label className="towns-field is-wide"><span>Description</span><textarea rows={3} /></label>
            <label className="towns-field"><span>Location notes</span><textarea rows={2} /></label>
            <label className="towns-field"><span>G.O.D. notes</span><textarea rows={2} /></label>
            <label className="towns-field is-wide"><span>Search Places</span><input type="search" /></label>
          </div>
        </section>
      </section>
    </div>
  </main>;
}
