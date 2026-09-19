import Link from "next/link";
import "./shops.css";

export default function ShopsPage() {
  return <main className="shops-page">
    <header className="shops-header">
      <Link href="/heavens" className="font-portcullion shops-logo">Serrian<br />Tide</Link>
      <div><p>THE HEAVENS / SHOPS</p><h1 className="font-sans">Shop Builder</h1><span>Create practical Campaign storefronts, staff them with persistent NPCs, and curate Campaign-authorized offerings.</span></div>
      <nav><Link href="/heavens">← The Heavens</Link></nav>
    </header>
    <section className="shops-scope is-god"><strong>Campaign owner scope</strong><span>Only Campaigns you own are available here.</span></section>
    <section className="shops-context">
      <div><p>CAMPAIGN CONTEXT</p><h2 className="font-sans">Choose the Shop archive</h2></div>
      <label className="shops-field"><span>Campaign</span><select disabled><option>No Campaign Selected</option></select></label>
      <button type="button" disabled>Create Shop</button>
    </section>
    <div className="shops-layout">
      <aside className="shops-library">
        <header><div><p>SHOP LIBRARY</p><h2>No Campaign</h2></div><div className="shops-segmented"><button disabled aria-pressed="true">Active</button><button disabled>Archived</button></div></header>
        <label className="shops-field"><span>Search Shops</span><input type="search" disabled placeholder="Name, type, description, or location" /></label>
        <p className="shops-empty">Choose a Campaign to view its Shops.</p>
      </aside>
      <section className="shops-editor"><div className="shops-editor-empty"><p>SHOP WORKSPACE</p><h2 className="font-sans">Open a Shop</h2><span>Select an existing Shop or create one for this Campaign.</span></div></section>
    </div>
  </main>;
}
