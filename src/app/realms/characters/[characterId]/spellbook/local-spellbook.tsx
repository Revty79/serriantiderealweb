"use client";
import Link from "next/link";
import { useMemo,useState } from "react";
import { readCharacters } from "@/lib/local-character-store";
import { readSpells } from "@/lib/local-spell-store";
const systems=["Spellcraft","Talismanism","Faith","Psyonics","Bardic Resonance"];
export function LocalSpellbook({characterId}:{characterId:number}){
 const character=useMemo(()=>readCharacters().find(c=>c.id===characterId)??null,[characterId]);
 const [system,setSystem]=useState("Spellcraft");const [search,setSearch]=useState("");const [selectedId,setSelectedId]=useState<number|null>(null);
 const all=useMemo(()=>readSpells().filter(s=>s.characterId===characterId&&s.inSpellbook),[characterId]);
 const filtered=all.filter(s=>s.castingSystem===system&&(!search.trim()||[s.name,s.tradition,s.description].some(v=>v.toLowerCase().includes(search.trim().toLowerCase()))));
 const selected=filtered.find(s=>s.id===selectedId)??filtered[0]??null;
 if(!character)return <main className="spellbook-page"><div className="spellbook-empty"><h3>Character not found.</h3><Link href="/realms">Return</Link></div></main>;
 return <main className="spellbook-page">
  <header className="spellbook-header"><Link href="/realms" className="font-portcullion spellbook-logo">Serrian<br/>Tide</Link><div><p>THE REALMS · CHARACTER MAGIC</p><h1>Spellbook</h1><span>{character.name} · saved permanent spell definitions only</span></div><nav><Link href={"/realms/characters/"+character.id+"/magic"}>Magic Calculator</Link><Link href="/realms">Return to Realms</Link></nav></header>
  <nav className="spellbook-system-tabs">{systems.map(s=>{const count=all.filter(x=>x.castingSystem===s).length;return <button key={s} className={system===s?"is-active":""} onClick={()=>{setSystem(s);setSelectedId(null)}}><span>{s}</span><strong>{count}</strong></button>})}</nav>
  <div className="spellbook-workspace">
   <aside className="spellbook-library"><div className="spellbook-library__heading"><p>KNOWN MAGIC</p><h3>{all.length} {all.length===1?"Spell":"Spells"}</h3></div><label className="spellbook-search"><span>Search {system}</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Name or framework"/></label><div className="spellbook-library__list">{filtered.length?filtered.map(s=><button key={s.id} className={selected?.id===s.id?"is-active":""} onClick={()=>setSelectedId(s.id)}><span>Personal Spell</span><strong>{s.name||"Untitled Spell"}</strong><small>{s.tradition} · {s.baseMana} Mana · Mastery {s.spellMastery}</small></button>):<p className="spellbook-empty-list">This Character has no {system} Spells in the local Spellbook.</p>}</div></aside>
   <section className="spellbook-detail">{selected?<><header className="spellbook-detail__header"><div><p>PERSONAL SPELL · {selected.castingSystem}</p><h3>{selected.name}</h3><span>{selected.tradition}</span></div><strong className="is-valid">Saved</strong></header><div className="spellbook-facts"><div><span>Mana</span><strong>{selected.baseMana}</strong></div><div><span>Mastery</span><strong>{selected.spellMastery}</strong></div><div><span>Combat Time</span><strong>{selected.baseCombatTime}</strong></div><div><span>Range</span><strong>{selected.range??"—"}</strong></div></div><p className="spellbook-detail__description">{selected.description||"No description recorded."}</p><p className="spellbook-draft-note">Casting controls are intentionally not part of the pre-DB authoring rebuild.</p></>:<div className="spellbook-empty spellbook-empty--detail"><p>SPELLBOOK</p><h3>Select a saved Spell.</h3></div>}</section>
  </div>
 </main>;
}
