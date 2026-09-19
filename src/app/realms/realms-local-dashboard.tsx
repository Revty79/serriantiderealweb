"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { readCampaigns, readCharacters } from "@/lib/local-character-store";

export function LocalRealmsDashboard() {
  const campaigns=useMemo(()=>readCampaigns().filter(c=>!c.archivedAt),[]);
  const characters=useMemo(()=>readCharacters().filter(c=>!c.archivedAt),[]);
  const [campaignId,setCampaignId]=useState("");
  const [characterId,setCharacterId]=useState("");
  const selectedCampaign=campaigns.find(c=>String(c.id)===campaignId)??null;
  const visibleCharacters=characters.filter(c=>String(c.campaignId)===campaignId);
  const selectedCharacter=visibleCharacters.find(c=>String(c.id)===characterId)??null;

  return <main className="realms-page"><div className="realms-shell">
    <header className="realms-header">
      <Link href="/dashboard" className="font-portcullion realms-logo">Serrian<br/>Tide</Link>
      <div><p>PLAYER PORTAL</p><h1 className="font-evanescent">The Realms</h1><span>Local prototype · no database</span></div>
    </header>

    <section className="realms-control">
      <div className="realms-section-heading"><div><p>ADVENTURING CONTEXT</p><h2>Your Realm</h2></div><span>Select a local Campaign and Character whose record you want to continue.</span></div>
      <div className="realms-control-grid">
        <label><span>Campaign</span><select value={campaignId} onChange={e=>{setCampaignId(e.target.value);setCharacterId("")}}><option value="">{campaigns.length?"No Campaign Selected":"No Local Campaigns"}</option>{campaigns.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        <label><span>Character</span><select value={characterId} disabled={!campaignId} onChange={e=>setCharacterId(e.target.value)}><option value="">{campaignId?"No Character Selected":"Select a Campaign First"}</option>{visibleCharacters.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      </div>
      <div className="realms-character-create"><div className="realms-character-create__buttons">
        {selectedCampaign?<Link className="realms-local-button" href={"/realms/characters/new?campaign="+selectedCampaign.id}>New Character</Link>:<span className="realms-local-button is-disabled">New Character</span>}
        {selectedCharacter?<Link className="realms-local-button" href={"/realms/characters/"+selectedCharacter.id}>Open Character Editor</Link>:<span className="realms-local-button is-disabled">Open Character Editor</span>}
        {selectedCharacter?<Link className="realms-local-button" href={"/realms/characters/"+selectedCharacter.id+"/advance"}>Advance Character</Link>:null}
        {selectedCharacter?<Link className="realms-local-button" href={"/realms/characters/"+selectedCharacter.id+"/magic"}>Magic Calculator</Link>:null}
        {selectedCharacter?<Link className="realms-local-button" href={"/realms/characters/"+selectedCharacter.id+"/spellbook"}>Spellbook</Link>:null}
      </div><span>Character creation and permanent records run locally until the new database is approved.</span></div>
    </section>

    <section className="realms-actions">
      <div className="realms-section-heading"><div><p>CHARACTER ACTIONS</p><h2>Your Character</h2></div><span>{selectedCharacter?selectedCharacter.name:"Choose a Character above."}</span></div>
      <div className="realms-action-grid">
        {[
          ["CHARACTER SHEET","Identity & Record","Open the permanent Character authoring record."],
          ["ADVANCE CHARACTER","Experience & Quintessence","Plan permanent advancement without live runtime state."],
          ["SPELLBOOK","Known Magic","Review locally authored saved Spells."],
          ["MAGIC CALCULATOR","Spell Construction","Build and save local spell definitions."],
          ["GUIDED RANDOM","Character Generator","Exercise guided Character generation choices."]
        ].map(([title,subtitle,description])=><article key={title} className={"realms-action-card"+(!selectedCharacter?" is-disabled":"")}><span>{subtitle}</span><h3>{title}</h3><p>{description}</p><strong>{selectedCharacter?"Available above":"Select a Character"}</strong></article>)}
      </div>
    </section>

    <footer className="realms-footer"><Link href="/dashboard">← Return to Paths</Link><span className="font-portcullion">Serrian Tide</span></footer>
  </div></main>;
}
