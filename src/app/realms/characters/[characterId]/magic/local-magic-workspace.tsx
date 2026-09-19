"use client";
import Link from "next/link";
import { useMemo,useState } from "react";
import { readCharacters } from "@/lib/local-character-store";
import { newSpell,readSpells,writeSpells,type LocalSpell } from "@/lib/local-spell-store";

const systems=["Spellcraft","Talismanism","Faith","Psyonics","Bardic Resonance"];

export function LocalMagicWorkspace({characterId}:{characterId:number}){
 const character=useMemo(()=>readCharacters().find(c=>c.id===characterId)??null,[characterId]);
 const [version,setVersion]=useState(0); const [search,setSearch]=useState(""); const [draft,setDraft]=useState<LocalSpell>(()=>newSpell(characterId)); const [dirty,setDirty]=useState(false); const [feedback,setFeedback]=useState("");
 const spells=useMemo(()=>{void version;const q=search.trim().toLowerCase();return readSpells().filter(s=>s.characterId===characterId&&(!q||[s.name,s.tradition,s.castingSystem].some(v=>v.toLowerCase().includes(q)))).sort((a,b)=>a.name.localeCompare(b.name))},[characterId,search,version]);
 if(!character)return <main className="magic-page"><section className="magic-editor"><h1>Character not found.</h1><Link href="/realms">Return</Link></section></main>;
 function change(update:Partial<LocalSpell>){setDraft(d=>({...d,...update}));setDirty(true);setFeedback("")}
 function open(id:number){if(dirty&&!window.confirm("Discard unsaved Spell changes?"))return;const row=readSpells().find(s=>s.id===id);if(row){setDraft(row);setDirty(false);setFeedback("")}}
 function startNew(){if(dirty&&!window.confirm("Discard unsaved Spell changes?"))return;setDraft(newSpell(characterId));setDirty(false);setFeedback("")}
 function save(){if(!draft.name.trim()){setFeedback("Spell Name is required.");return;}const rows=readSpells();const now=new Date().toISOString();let saved:LocalSpell;if(draft.id){const i=rows.findIndex(s=>s.id===draft.id);if(i<0)return;saved={...draft,updatedAt:now};rows[i]=saved}else{const id=rows.reduce((m,s)=>Math.max(m,s.id),0)+1;saved={...draft,id,updatedAt:now};rows.push(saved)}writeSpells(rows);setDraft(saved);setDirty(false);setFeedback("Spell saved locally.");setVersion(v=>v+1)}
 function duplicate(){if(!draft.id)return;const copy={...draft,id:0,name:(draft.name||"Spell")+" Copy",inSpellbook:false};setDraft(copy);setDirty(true)}
 function remove(){if(!draft.id)return;if(window.prompt("Type "+draft.name+" to delete this local Spell:")!==draft.name)return;writeSpells(readSpells().filter(s=>s.id!==draft.id));setDraft(newSpell(characterId));setDirty(false);setVersion(v=>v+1)}
 function toggleBook(){change({inSpellbook:!draft.inSpellbook})}
 return <main className="magic-page">
  <header className="magic-header"><Link href="/realms" className="font-portcullion magic-logo">Serrian<br/>Tide</Link><div><p>THE REALMS / CHARACTER MAGIC</p><h1>Magic Calculator</h1><span>{character.name} · local spell authoring · no casting runtime</span></div><nav><Link href={"/realms/characters/"+character.id+"/spellbook"}>Spellbook</Link><Link href="/realms">Return to Realms</Link></nav></header>
  {feedback?<p className="magic-feedback is-success">{feedback}</p>:null}
  <div className="magic-workspace">
   <aside className="magic-library"><header><div><p>SAVED SPELLS</p><h2>{spells.length} local spells</h2></div><button onClick={startNew}>New Spell</button></header><label><span>Search Saved Spells</span><input value={search} onChange={e=>setSearch(e.target.value)}/></label><div>{spells.map(s=><button key={s.id} className={draft.id===s.id?"is-selected":""} onClick={()=>open(s.id)}><strong>{s.name||"Untitled Spell"}</strong><span>{s.castingSystem} · {s.baseMana} Mana</span><small>{s.inSpellbook?"Spellbook":"Draft"}</small></button>)}{!spells.length?<p>No saved Spells yet.</p>:null}</div></aside>
   <section className="magic-editor">
    <header className="magic-editor-header"><div><p>{draft.id?"SPELL "+draft.id:"NEW SPELL DRAFT"}</p><h2>{draft.name||"Untitled Spell"}</h2><span>{dirty?"Unsaved changes":draft.id?"Saved locally":"Not yet persisted"}</span></div><div><button onClick={duplicate} disabled={!draft.id}>Duplicate</button><button onClick={toggleBook}>{draft.inSpellbook?"Remove from Spellbook":"Add to Spellbook"}</button><button className="is-danger" disabled={!draft.id||dirty} onClick={remove}>Delete</button><button className="is-primary" onClick={save}>Save Spell</button></div></header>
    <div className="magic-document-fields">
      <label><span>Spell Name</span><input value={draft.name} onChange={e=>change({name:e.target.value})}/></label>
      <label><span>Casting System</span><select value={draft.castingSystem} onChange={e=>change({castingSystem:e.target.value,tradition:e.target.value})}>{systems.map(s=><option key={s}>{s}</option>)}</select></label>
      <label><span>Tradition</span><select value={draft.tradition} onChange={e=>change({tradition:e.target.value})}>{systems.map(s=><option key={s}>{s}</option>)}</select></label>
      <label><span>Base Mana</span><input type="number" min={0} value={draft.baseMana} onChange={e=>change({baseMana:Number(e.target.value)})}/></label>
      <label><span>Spell Mastery</span><input type="number" min={0} value={draft.spellMastery} onChange={e=>change({spellMastery:Number(e.target.value)})}/></label>
      <label><span>Base Combat Time</span><input type="number" min={0} value={draft.baseCombatTime} onChange={e=>change({baseCombatTime:Number(e.target.value)})}/></label>
      <label><span>Container Type</span><input value={draft.containerType} onChange={e=>change({containerType:e.target.value})}/></label>
      <label><span>Range</span><input type="number" value={draft.range??""} onChange={e=>change({range:e.target.value===""?null:Number(e.target.value)})}/></label>
      <label><span>Range description</span><input value={draft.rangeDescription} onChange={e=>change({rangeDescription:e.target.value})}/></label>
      <label><span>Shape</span><input value={draft.shape} onChange={e=>change({shape:e.target.value})}/></label>
      <label><span>Duration</span><input value={draft.duration} onChange={e=>change({duration:e.target.value})}/></label>
      <label><span>Healing Application</span><input value={draft.healingApplication} onChange={e=>change({healingApplication:e.target.value})}/></label>
      <label><span>Out of Combat</span><input type="checkbox" checked={draft.outOfCombat} onChange={e=>change({outOfCombat:e.target.checked})}/></label>
      <label><span>Attach Progressive Spell behavior</span><input type="checkbox" checked={draft.progressive} onChange={e=>change({progressive:e.target.checked})}/></label>
      <label><span>Multi-Target</span><input type="checkbox" checked={draft.multiTarget} onChange={e=>change({multiTarget:e.target.checked})}/></label>
      <label><span>Additional targets</span><input type="number" min={0} value={draft.additionalTargets??""} onChange={e=>change({additionalTargets:e.target.value===""?null:Number(e.target.value)})}/></label>
    </div>
    <div className="magic-local-textareas"><label><span>Spell Description</span><textarea rows={5} value={draft.description} onChange={e=>change({description:e.target.value})}/></label><label><span>Flavor Line</span><textarea rows={2} value={draft.flavorLine} onChange={e=>change({flavorLine:e.target.value})}/></label><label><span>Construction Notes</span><textarea rows={5} value={draft.constructionNotes} onChange={e=>change({constructionNotes:e.target.value})}/></label></div>
   </section>
  </div>
 </main>;
}
