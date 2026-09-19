import Link from "next/link";
import "./shops.css";
import "../design-mode.css";

export default function ShopsPage() {
  return <main className="shops-page">
    <header className="shops-header">
      <Link href="/heavens" className="font-portcullion shops-logo">Serrian<br />Tide</Link>
      <div><p>THE HEAVENS / SHOPS</p><h1 className="font-sans">Shop Builder</h1><span>Create practical Campaign storefronts, staff them with persistent NPCs, and curate Campaign-authorized offerings.</span></div>
      <nav><Link href="/heavens">← The Heavens</Link></nav>
    </header>

    <section className="shops-scope is-god"><strong>DESIGN MODE · Campaign owner scope</strong><span>All authoring controls are visible for layout review. Nothing saves yet.</span></section>

    <section className="shops-context">
      <div><p>CAMPAIGN CONTEXT</p><h2 className="font-sans">Choose the Shop archive</h2></div>
      <label className="shops-field"><span>Campaign</span><select><option>Design Campaign</option></select></label>
      <button type="button">Create Shop</button>
    </section>

    <div className="shops-layout">
      <aside className="shops-library">
        <header>
          <div><p>SHOP LIBRARY</p><h2>Design Campaign</h2></div>
          <div className="shops-segmented"><button aria-pressed="true">Active</button><button>Archived</button></div>
        </header>
        <label className="shops-field"><span>Search Shops</span><input type="search" placeholder="Name, type, description, or location" /></label>
        <div className="shops-index">
          <button type="button" className="is-selected"><span><strong>New Shop Draft</strong><small>Unconfigured</small></span><span className="shops-index__meta"><em>draft</em><small>0 staff · 0 offerings</small></span></button>
        </div>
      </aside>

      <section className="shops-editor">
        <header className="shops-editor__header">
          <div><p>NEW SHOP DRAFT · DESIGN CAMPAIGN</p><h2 className="font-sans">New Shop Draft</h2><span>Design mode · local only</span></div>
          <div className="shops-editor__actions"><button disabled>Archive Shop</button><button className="is-danger" disabled>Delete Shop</button></div>
        </header>

        <section className="shops-panel">
          <header><div><p>SHOP RECORD</p><h3>Identity, location &amp; balance</h3></div><button disabled>Save Shop</button></header>
          <div className="shops-form-grid">
            <label className="shops-field"><span>Shop Name</span><input /></label>
            <label className="shops-field"><span>Type / Category</span><input placeholder="Armorer, apothecary, ferry…" /></label>
            <label className="shops-field is-wide"><span>Description</span><textarea rows={4} /></label>
            <label className="shops-field is-wide"><span>Location Notes</span><textarea rows={3} /></label>
            <label className="shops-field"><span>Balance · canonical Campaign Credits</span><input type="number" min={0} step="0.01" /><small>Tracked balance once persistence exists.</small></label>
            <label className="shops-field"><span>Storefront</span><select defaultValue="closed"><option value="closed">Closed</option><option value="open">Open</option></select><small>New and restored Shops default to closed.</small></label>
          </div>
        </section>

        <section className="shops-panel">
          <header><div><p>TRANSACTION POLICIES</p><h3>Approval and resale settings</h3></div><button disabled>Save Policies</button></header>
          <div className="shops-form-grid">
            <label className="shops-field"><span>Character Purchases</span><select><option>G.O.D. approval required</option><option>Immediate</option></select></label>
            <label className="shops-field"><span>Sold Item Handling</span><select><option>Add to Shop stock</option><option>Remove from active play</option></select></label>
            <label className="shops-field is-wide"><span>Changed Sale Terms</span><textarea rows={3} /></label>
          </div>
        </section>

        <section className="shops-panel">
          <header><div><p>SHOP STAFF</p><h3>Persistent NPC assignments</h3></div><span>0 staff</span></header>
          <div className="shops-form-grid">
            <label className="shops-field"><span>Find eligible NPC</span><input type="search" /></label>
            <label className="shops-field"><span>NPC</span><select><option>Choose NPC</option></select></label>
            <label className="shops-field"><span>Responsibility / Role</span><input placeholder="Owner, clerk, guard…" /></label>
            <label className="shops-check"><input type="checkbox" /><span>Primary contact</span></label>
          </div>
        </section>

        <section className="shops-panel">
          <header><div><p>SHOP OFFERINGS</p><h3>Catalog, pricing, stock &amp; fulfillment</h3></div><span>0 listings</span></header>
          <div className="shops-form-grid">
            <label className="shops-field is-wide"><span>Search permitted Items</span><input type="search" /></label>
            <label className="shops-field"><span>Canonical price</span><input type="number" step="0.01" /></label>
            <label className="shops-field"><span>Fulfillment</span><select><option>Transfer Item into Character inventory</option><option>Record service / narrative offering</option></select></label>
            <label className="shops-field"><span>Stock Tracking</span><select><option>Unlimited</option><option>Limited</option></select></label>
            <label className="shops-field"><span>Limited Quantity</span><input type="number" min={0} /></label>
            <label className="shops-field"><span>Selling Override · Credits</span><input type="number" min={0} step="0.01" /></label>
            <label className="shops-field"><span>Buying Override · Credits</span><input type="number" min={0} step="0.01" /></label>
            <label className="shops-field is-wide"><span>Shop-Facing Note</span><textarea rows={2} /></label>
            <label className="shops-check"><input type="checkbox" defaultChecked /><span>Listing enabled</span></label>
          </div>
        </section>
      </section>
    </div>
  </main>;
}
