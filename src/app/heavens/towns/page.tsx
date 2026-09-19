import Link from "next/link";
import "./towns.css";

export default function TownsPage() {
  return <main className="towns-page">
    <header className="towns-header">
      <Link href="/heavens" className="font-portcullion towns-logo">Serrian<br />Tide</Link>
      <div><p>THE HEAVENS / TOWN BUILDER</p><h1 className="font-sans">Campaign Towns</h1><span>Organize existing Shops and NPCs with Town-owned descriptive Places.</span></div>
      <nav><Link href="/heavens">← The Heavens</Link></nav>
    </header>
    <p className="towns-scope">Only Campaigns you own are available here.</p>
    <section className="towns-context">
      <div><p>Campaign scope</p><h2>Choose a Campaign</h2><span>Results never cross the selected Campaign.</span></div>
      <label className="towns-field"><span>Campaign</span><select disabled><option>Choose a Campaign</option></select></label>
      <button type="button" disabled>New Town</button>
    </section>
    <div className="towns-layout">
      <aside className="towns-library">
        <header><div><p>Campaign library</p><h2>Towns</h2></div><span>0 shown</span></header>
        <div className="towns-segmented"><button disabled aria-pressed="true">Active</button><button disabled>Archived</button></div>
        <label className="towns-field"><span>Search Towns</span><input type="search" disabled placeholder="Name, category, overview, location" /></label>
        <p className="towns-empty">Choose a Campaign to view Towns.</p>
      </aside>
      <section className="towns-editor"><div className="towns-empty is-large"><h2>Select a Town</h2><p>Create or choose a Town to manage its descriptive record and relationships.</p></div></section>
    </div>
  </main>;
}
