"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { readCharacters, readRaces, writeCharacters } from "@/lib/local-character-store";

const focusOptions=[
 {value:"balanced",label:"Balanced",description:"Spread attention across physical, mental, and social traits."},
 {value:"physical",label:"Physical",description:"Favor STR, DEX, and CON."},
 {value:"mental",label:"Mental",description:"Favor INT and WIS."},
 {value:"social",label:"Social",description:"Favor CHR and story-driven strengths."},
];
const magicOptions=[
 {value:"none",label:"No Magical Focus",description:"Favor ordinary Skills."},
 {value:"surprise",label:"Surprise Me",description:"Allow any future permitted magical direction."},
 {value:"Spellcraft",label:"Spellcraft",description:"Favor Spellcraft."},
 {value:"Talismanism",label:"Talismanism",description:"Favor Talismanism."},
 {value:"Faith",label:"Faith",description:"Favor Faith."},
 {value:"Psyonics",label:"Psyonics",description:"Favor Psyonics."},
 {value:"Bardic Resonance",label:"Bardic Resonance",description:"Favor Bardic Resonance."},
];
const equipmentOptions=[
 {value:"mixed",label:"Mixed",description:"Balanced starting gear."},
 {value:"melee",label:"Melee",description:"Favor close-combat Equipment."},
 {value:"ranged",label:"Ranged",description:"Favor ranged Equipment."},
 {value:"light",label:"Light",description:"Favor low-weight general gear."},
];
const temperamentOptions=[
 {value:"curious",label:"Curious",description:"Exploratory and questioning."},
 {value:"driven",label:"Driven",description:"Goal-focused and ambitious."},
 {value:"guarded",label:"Guarded",description:"Private and cautious."},
 {value:"bold",label:"Bold",description:"Direct and risk-tolerant."},
];

export function LocalGuidedRandom({characterId}:{characterId:number}){
 const character=useMemo(()=>readCharacters().find(c=>c.id===characterId)??null,[characterId]);
 const races=useMemo(()=>readRaces().filter(r=>!r.archivedAt),[]);
 const [step,setStep]=useState(0); const [name,setName]=useState(character?.name??""); const [raceId,setRaceId]=useState(character?.raceId?String(character.raceId):"");
 const [focus,setFocus]=useState("balanced"); const [magic,setMagic]=useState("surprise"); const [equipment,setEquipment]=useState("mixed"); const [temperament,setTemperament]=useState("curious"); const [done,setDone]=useState(false);
 if(!character)return <main className="random-character-page"><section className="random-character-result"><h1>Character not found.</h1><Link href="/realms">Return</Link></section></main>;
 const steps=["Identity","Approach","Magic","Equipment","Temperament"];
 function generate(){
   const rows=readCharacters(); const i=rows.findIndex(c=>c.id===character.id); if(i<0)return;
   const attrs={...character.attributes}; if(focus==="physical"){attrs.STR=60;attrs.DEX=60;attrs.CON=60}else if(focus==="mental"){attrs.INT=65;attrs.WIS=60}else if(focus==="social"){attrs.CHR=70}else {attrs.STR=50;attrs.DEX=50;attrs.CON=50;attrs.INT=50;attrs.WIS=50;attrs.CHR=50}
   const personality=temperament==="curious"?"Curious, observant, and eager to understand the unknown.":temperament==="driven"?"Driven, focused, and unwilling to abandon a goal.":temperament==="guarded"?"Guarded, careful, and slow to reveal personal motives.":"Bold, decisive, and willing to take risks.";
   rows[i]={...character,name:name.trim()||"Random Adventurer",raceId:raceId?Number(raceId):(races[0]?.id??null),attributes:attrs,
     personality,goals:"Generated goal awaiting review.",secrets:"Generated secret awaiting review.",backstory:"Generated backstory awaiting review.",motivations:"Generated motivation awaiting review.",
     updatedAt:new Date().toISOString()};
   writeCharacters(rows); setDone(true);
 }
 if(done)return <main className="random-character-page"><section className="random-character-result"><p>GUIDED RANDOM COMPLETE</p><h1>{name.trim()||"Random Adventurer"}</h1><span>The local draft was updated and remains fully editable.</span><div className="random-character-result-actions"><Link href={"/realms/characters/"+character.id}>Review Character</Link><button className="secondary" onClick={()=>setDone(false)}>Generate Again</button></div></section></main>;
 const options=step===1?focusOptions:step===2?magicOptions:step===3?equipmentOptions:temperamentOptions;
 const value=step===1?focus:step===2?magic:step===3?equipment:temperament;
 const setValue=(v:string)=>{if(step===1)setFocus(v);else if(step===2)setMagic(v);else if(step===3)setEquipment(v);else setTemperament(v)};
 return <main className="random-character-page"><div className="random-character-shell">
  <header className="random-character-header"><div><p>THE REALMS · LOCAL PROTOTYPE</p><h1>Guided Random Character</h1><span>You make the broad choices. The local generator updates a reviewable permanent draft.</span></div><Link href={"/realms/characters/"+character.id}>Cancel & Return</Link></header>
  <section className="random-character-form"><header className="random-character-step-header"><div><p>GUIDED RANDOM · QUESTION {step+1} OF {steps.length}</p><h2>{steps[step]}</h2></div><strong>{Math.round(((step+1)/steps.length)*100)}%</strong></header><div className="random-character-progress"><i style={{width:((step+1)/steps.length)*100+"%"}}/></div>
   {step===0?<section className="random-character-question"><h3>Who should the program begin with?</h3><p>Name and Race remain editable afterward.</p><label className="random-character-field"><span>Character Name</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="Generate a name for me"/></label><label className="random-character-field"><span>Race</span><select value={raceId} onChange={e=>setRaceId(e.target.value)}><option value="">Surprise Me</option>{races.map(r=><option key={r.id} value={r.id}>{r.core.name}</option>)}</select></label></section>:<fieldset className="random-character-choice-group"><legend>{steps[step]}</legend><p>Prototype choice set retained for redesign.</p><div>{options.map(o=><button key={o.value} className={value===o.value?"is-selected":""} onClick={()=>setValue(o.value)}><strong>{o.label}</strong><span>{o.description}</span></button>)}</div></fieldset>}
   <footer className="random-character-submit"><button onClick={()=>step===0?window.location.href="/realms/characters/"+character.id:setStep(s=>s-1)}>{step===0?"Cancel":"Back"}</button>{step<steps.length-1?<button onClick={()=>setStep(s=>s+1)}>Next Question</button>:<button onClick={generate}>Generate Character</button>}</footer>
  </section>
 </div></main>;
}
