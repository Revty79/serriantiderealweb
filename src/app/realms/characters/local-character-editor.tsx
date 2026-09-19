"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { readSkills } from "@/lib/local-skill-store";
import { readItems } from "@/lib/local-item-store";
import {
  newCharacter,
  readCampaigns,
  readCharacters,
  readRaces,
  writeCharacters,
  type LocalCharacter,
} from "@/lib/local-character-store";

const TABS = [
  ["identity","Identity"],
  ["attributes","Attributes"],
  ["skills","Skills & Abilities"],
  ["story","Story & Personality"],
  ["equipment","Equipment"],
  ["god","G.O.D. Controls"],
  ["sheet","Character Sheet"],
] as const;

type Tab=(typeof TABS)[number][0];
const ATTRIBUTES=[["STR","Strength"],["DEX","Dexterity"],["CON","Constitution"],["INT","Intelligence"],["WIS","Wisdom"],["CHR","Charisma"]] as const;
function Field({label,children,wide=false}:{label:string;children:React.ReactNode;wide?:boolean}) {
  return <label className={wide?"character-field character-field--wide":"character-field"}><span>{label}</span>{children}</label>;
}
function SectionHeading({eyebrow,title,detail}:{eyebrow:string;title:string;detail?:string}) {
  return <header className="character-section-heading"><div><p>{eyebrow}</p><h2 className="font-sans">{title}</h2></div>{detail?<span>{detail}</span>:null}</header>;
}

export function LocalCharacterEditor({characterId,campaignId,playerUserId}:{characterId:number|null;campaignId:number|null;playerUserId?:string|null}) {
  const stored=useMemo(()=>characterId?readCharacters().find((row)=>row.id===characterId)??null:null,[characterId]);
  const initialCampaignId=stored?.campaignId ?? campaignId ?? readCampaigns().find((row)=>!row.archivedAt)?.id ?? 0;
  const [draft,setDraft]=useState<LocalCharacter>(() => {
    if (stored) return stored;
    const base = { ...newCharacter(initialCampaignId), playerUserId: playerUserId || "prototype-admin" };
    const localSkills = readSkills()
      .filter((skill) => !skill.archivedAt && (skill.tier === 1 || skill.classification === "special ability"))
      .map((skill) => ({ id: skill.id, name: skill.name, attribute: skill.primaryAttribute || "", points: 0, rank: 0 }));
    return { ...base, skills: localSkills.length ? localSkills : base.skills };
  });
  const [tab,setTab]=useState<Tab>("identity");
  const [dirty,setDirty]=useState(false);
  const [feedback,setFeedback]=useState("");
  const campaigns=useMemo(()=>readCampaigns().filter((row)=>!row.archivedAt),[]);
  const races=useMemo(()=>readRaces().filter((row)=>!row.archivedAt),[]);
  const campaign=campaigns.find((row)=>row.id===draft.campaignId) ?? null;
  const selectedRace=races.find((row)=>row.id===draft.raceId) ?? null;
  const localCatalog = useMemo(() => {
    const equipment = readItems("equipment").filter((item) => !item.archivedAt);
    const inventory = readItems("inventory").filter((item) => !item.archivedAt);
    const combined = [
      ...equipment.map((item) => ({ ...item, catalogKey: "equipment:" + item.id })),
      ...inventory.map((item) => ({ ...item, catalogKey: "inventory:" + item.id })),
    ];
    const explicit = campaign?.inventoryItemKeys ?? [];
    const tagKeys = campaign?.inventoryTagKeys ?? [];
    if (!explicit.length && !tagKeys.length) return combined;
    return combined.filter((item) => {
      if (explicit.includes(item.catalogKey)) return true;
      return item.tags.some((tag) => tagKeys.includes(item.scope + ":" + tag.group + ":" + tag.tag));
    });
  }, [campaign]);

  function change(update:Partial<LocalCharacter>) { setDraft(current=>({...current,...update})); setDirty(true); setFeedback(""); }
  function save() {
    if(!draft.name.trim()){setFeedback("Character Name is required.");return;}
    const rows=readCharacters();
    const now=new Date().toISOString();
    let saved:LocalCharacter;
    if(draft.id){
      const index=rows.findIndex(row=>row.id===draft.id);
      if(index<0){setFeedback("That local Character no longer exists.");return;}
      saved={...draft,updatedAt:now}; rows[index]=saved;
    } else {
      const id=rows.reduce((max,row)=>Math.max(max,row.id),0)+1;
      saved={...draft,id,creditsRemaining:draft.creditsRemaining || campaign?.startingCreditAmount || 0,
        fatePoints:draft.fatePoints ?? (campaign?.fatePointMethod==="Assigned"?campaign.assignedFatePoints:null),updatedAt:now};
      rows.push(saved);
    }
    writeCharacters(rows); setDraft(saved); setDirty(false); setFeedback("Character saved locally.");
    if(typeof window!=="undefined" && window.location.pathname.endsWith("/new")){
      window.history.replaceState(null,"","/realms/characters/"+saved.id);
    }
  }
  function archive(){ if(!draft.id)return; const reason=window.prompt("Archive reason (optional):")??""; const rows=readCharacters(); const i=rows.findIndex(r=>r.id===draft.id); if(i<0)return; const saved={...draft,archivedAt:new Date().toISOString(),archiveReason:reason}; rows[i]=saved; writeCharacters(rows); setDraft(saved); setDirty(false); }
  function restore(){ if(!draft.id)return; const rows=readCharacters(); const i=rows.findIndex(r=>r.id===draft.id); if(i<0)return; const saved={...draft,archivedAt:null,archiveReason:""}; rows[i]=saved; writeCharacters(rows); setDraft(saved); setDirty(false); }
  function del(){ if(!draft.id)return; if(window.prompt("Type "+draft.name+" to delete this local Character:")!==draft.name)return; writeCharacters(readCharacters().filter(r=>r.id!==draft.id)); window.location.href="/realms"; }

  const archived=Boolean(draft.archivedAt);
  const totalAttributePoints=Object.values(draft.attributes).reduce((sum,value)=>sum+value,0);
  const skillPoints=draft.skills.reduce((sum,skill)=>sum+skill.points,0);
  const totalCost=draft.items.reduce((sum,item)=>sum+item.quantity*item.unitCost,0);

  return <main className="character-page">
    <header className="character-header">
      <Link href="/realms" className="font-portcullion character-logo">Serrian<br/>Tide</Link>
      <div className="character-header__identity"><p>THE REALMS / CHARACTER</p><h1>{draft.name||"New Character"}</h1><span>{campaign?.name||"No Campaign"} · local prototype · no database</span></div>
      <div className="character-header__actions"><Link href="/realms">Back to The Realms</Link></div>
    </header>

    <div className="character-status-strip">
      {ATTRIBUTES.map(([key])=><div key={key}><span>{key}</span><strong>{draft.attributes[key]}</strong></div>)}
      <div><span>Race</span><strong>{selectedRace?.core.name||"Unselected"}</strong></div>
      <div className="character-status-strip__actions">
        <button type="button" className="is-primary" disabled={archived} onClick={save}>Save</button>
        {draft.id?(archived?<button onClick={restore}>Restore</button>:<button disabled={dirty} onClick={archive}>Archive</button>):null}
        {draft.id?<button disabled={dirty} onClick={del}>Delete</button>:null}
      </div>
    </div>

    {feedback?<p className="character-feedback is-success">{feedback}</p>:null}

    <div className="character-workspace">
      <nav className="character-tabs">{TABS.map(([id,label])=><button key={id} className={tab===id?"is-active":""} onClick={()=>setTab(id)}><span>{label}</span></button>)}</nav>
      <section className="character-editor">
        {tab==="identity"?<div className="character-section character-form-grid">
          <SectionHeading eyebrow="PERSONAL RECORD" title="Identity" detail="Fields marked Required determine readiness." />
          <Field label="Character Name · Required"><input disabled={archived} value={draft.name} onChange={e=>change({name:e.target.value})}/></Field>
          <Field label="Campaign"><select disabled={archived} value={draft.campaignId} onChange={e=>change({campaignId:Number(e.target.value),raceId:null})}><option value={0}>Choose Campaign</option>{campaigns.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
          <Field label="Race · Required"><select disabled={archived} value={draft.raceId??""} onChange={e=>change({raceId:e.target.value?Number(e.target.value):null})}><option value="">Choose a Campaign Race</option>{races.filter(r=>!campaign?.allowedRaceIds?.length||campaign.allowedRaceIds.includes(r.id)).map(r=><option key={r.id} value={r.id}>{r.core.name}</option>)}</select></Field>
          <Field label="Age · Required"><input type="number" min={0} disabled={archived} value={draft.age??""} onChange={e=>change({age:e.target.value===""?null:Number(e.target.value)})}/></Field>
          <Field label="Sex · Required"><input disabled={archived} value={draft.sex} onChange={e=>change({sex:e.target.value})}/></Field>
          <div className="character-height-field"><span>Height · Required</span><div><Field label="Feet"><input type="number" min={0} value={draft.heightFeet??""} onChange={e=>change({heightFeet:e.target.value===""?null:Number(e.target.value)})}/></Field><Field label="Inches"><input type="number" min={0} max={11} value={draft.heightInches??""} onChange={e=>change({heightInches:e.target.value===""?null:Number(e.target.value)})}/></Field></div></div>
          <Field label="Weight · Required"><input type="number" min={0} value={draft.weight??""} onChange={e=>change({weight:e.target.value===""?null:Number(e.target.value)})}/></Field>
          <Field label="Skin Color · Required"><input value={draft.skinColor} onChange={e=>change({skinColor:e.target.value})}/></Field>
          <Field label="Eye Color · Required"><input value={draft.eyeColor} onChange={e=>change({eyeColor:e.target.value})}/></Field>
          <Field label="Hair Color · Required"><input value={draft.hairColor} onChange={e=>change({hairColor:e.target.value})}/></Field>
          <Field label="Deity · Required"><input placeholder="Enter None if the Character has no deity" value={draft.deity} onChange={e=>change({deity:e.target.value})}/></Field>
          <Field label="Fate Points"><input type="number" min={0} value={draft.fatePoints??""} onChange={e=>change({fatePoints:e.target.value===""?null:Number(e.target.value)})}/></Field>
          <Field label="Defining Marks & Character Quirks · Required" wide><textarea rows={5} value={draft.definingMarks} onChange={e=>change({definingMarks:e.target.value})}/></Field>
        </div>:null}

        {tab==="attributes"?<div className="character-section">
          <SectionHeading eyebrow="CAMPAIGN ALLOCATION" title="Attributes" detail={totalAttributePoints+" total points"} />
          <div className="character-attribute-grid">{ATTRIBUTES.map(([key,label])=><article key={key}><header><div><span>{key}</span><h3>{label}</h3></div><small>Race cap review later</small></header><label><span>Score</span><input type="number" min={0} value={draft.attributes[key]} onChange={e=>change({attributes:{...draft.attributes,[key]:Number(e.target.value)}})}/></label><dl><div><dt>Modifier</dt><dd>{Math.floor((draft.attributes[key]-50)/10)}</dd></div><div><dt>Roll Target</dt><dd>{Math.max(0,100-draft.attributes[key])}%</dd></div></dl></article>)}</div>
        </div>:null}

        {tab==="skills"?<div className="character-section">
          <SectionHeading eyebrow="CURRENT SKILL CATALOG" title="Skills & Abilities" detail={skillPoints+" invested points"} />
          <p className="character-notice">This allocation list comes from the locally saved Skill library for new Characters.</p>
          <section className="character-skill-group"><header><span>Prototype Skill Group</span><small>{draft.skills.length} Skills</small></header><div>{draft.skills.map((skill,index)=><div className="character-skill-row" key={skill.id}><div className="character-skill-row__identity"><div><strong>{skill.name}</strong></div><span>Tier 1 · {skill.attribute}</span></div><label><span>Points</span><input type="number" min={0} value={skill.points} onChange={e=>{const points=Number(e.target.value);change({skills:draft.skills.map((row,i)=>i===index?{...row,points,rank:Math.floor(points/5)}:row)})}}/></label><div><span>Rank</span><strong>{skill.rank}</strong></div><div><span>Roll Target</span><strong>{Math.max(0,100-(draft.attributes[skill.attribute as keyof typeof draft.attributes]??0)-skill.rank)}%</strong></div></div>)}</div></section>
        </div>:null}

        {tab==="story"?<div className="character-section">
          <SectionHeading eyebrow="REQUIRED NARRATIVE RECORD" title="Story & Personality" detail="Every field is required before completion." />
          <div className="character-story-grid">
            {[["personality","Personality Summary"],["goals","Goals"],["secrets","Secrets"],["backstory","Backstory"],["motivations","Motivations"]].map(([key,label])=><Field key={key} label={label+" · Required"}><textarea rows={key==="backstory"?8:5} value={String(draft[key as keyof LocalCharacter]??"")} onChange={e=>change({[key]:e.target.value} as Partial<LocalCharacter>)}/></Field>)}
          </div>
        </div>:null}

        {tab==="equipment"?<div className="character-section">
          <SectionHeading eyebrow="CAMPAIGN-AUTHORIZED CATALOG" title="Starting Equipment Store" detail={(campaign?.startingCreditAmount??0)-totalCost+" Credits remaining"} />
          <p className="character-notice">This store reads the locally authored Equipment and Inventory catalogs and applies the selected Campaign access rules.</p>
          <div className="character-equipment-list">{localCatalog.map(item=>{const key="catalogKey" in item?item.catalogKey:(item.scope+":"+item.id);const owned=draft.items.find(row=>row.catalogKey===key||(!row.catalogKey&&row.id===item.id));const qty=owned?.quantity??0;const unitCost=item.credits??0;return <article key={key} className={qty>0?"is-owned":""}><div className="character-equipment-list__identity"><p>{item.canonicalId||key} · {item.recordType}</p><h3>{item.name}</h3><span>{item.category}{item.equipmentGroup?" · "+item.equipmentGroup:""}</span></div><div className="character-equipment-list__purchase"><div><span>Cost</span><strong>{unitCost} Credits</strong><small>{item.priceBasis}</small></div><label><span>Owned</span><input type="number" min={0} value={qty} onChange={e=>{const quantity=Math.max(0,Number(e.target.value));const row={id:item.id,catalogKey:key,name:item.name,category:item.category,quantity,unitCost};change({items:quantity===0?draft.items.filter(r=>(r.catalogKey||String(r.id))!==key):[...draft.items.filter(r=>(r.catalogKey||String(r.id))!==key),row]})}}/></label><button onClick={()=>{const row={id:item.id,catalogKey:key,name:item.name,category:item.category,quantity:qty+1,unitCost};change({items:[...draft.items.filter(r=>(r.catalogKey||String(r.id))!==key),row]})}}>Buy One</button></div></article>})}{!localCatalog.length?<p className="character-notice">No Campaign-authorized local Items are available yet.</p>:null}</div>
        </div>:null}

        {tab==="god"?<div className="character-section">
          <SectionHeading eyebrow="ADMINISTRATIVE OVERRIDE" title="G.O.D. Controls" detail="Permanent Character record fields only." />
          <p className="character-notice">Live HP, Mana, Effects, combat state, firearm readiness, and all Tabletop runtime controls are intentionally excluded.</p>
          <div className="character-god-grid">
            {[["fame","Fame"],["experience","Available Experience"],["totalExperience","Lifetime Experience"],["quintessence","Available Quintessence"],["totalQuintessence","Lifetime Quintessence"],["hpMultiplierSteps","HP Multiplier Steps"],["baseMovementSteps","Base Movement Steps"],["baseMagicSteps","Base Magic Steps"],["creditsRemaining","Current Credits"]].map(([key,label])=><Field key={key} label={label}><input type="number" min={0} value={Number(draft[key as keyof LocalCharacter]??0)} onChange={e=>change({[key]:Number(e.target.value)} as Partial<LocalCharacter>)}/></Field>)}
          </div>
        </div>:null}

        {tab==="sheet"?<div className="character-section">
          <SectionHeading eyebrow="PERMANENT CHARACTER RECORD" title="Character Sheet" detail="No live Tabletop state on this rebuild." />
          <div className="character-race-card"><header><p>{selectedRace?.core.size||"Race"}</p><h3>{draft.name||"Untitled Character"}</h3></header><div className="character-race-summary"><div><span>Campaign</span><strong>{campaign?.name||"None"}</strong></div><div><span>Race</span><strong>{selectedRace?.core.name||"None"}</strong></div><div><span>Age</span><strong>{draft.age??"—"}</strong></div><div><span>Fate</span><strong>{draft.fatePoints??"—"}</strong></div></div></div>
          <div className="character-rule-ledger">{ATTRIBUTES.map(([key])=><span key={key}>{key} <strong>{draft.attributes[key]}</strong></span>)}<span>Credits <strong>{draft.creditsRemaining}</strong></span><span>Fame <strong>{draft.fame}</strong></span><span>XP <strong>{draft.experience}</strong></span><span>Quintessence <strong>{draft.quintessence}</strong></span></div>
          <div className="character-story-grid"><Field label="Personality"><textarea readOnly rows={4} value={draft.personality}/></Field><Field label="Goals"><textarea readOnly rows={4} value={draft.goals}/></Field><Field label="Backstory"><textarea readOnly rows={7} value={draft.backstory}/></Field><Field label="Motivations"><textarea readOnly rows={4} value={draft.motivations}/></Field></div>
        </div>:null}
      </section>
    </div>
  </main>;
}
