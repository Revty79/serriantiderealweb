"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type CampaignSettingsTab = "rules" | "races" | "inventory";

type CampaignDraft = {
  id?: number;
  name: string;
  overview: string;
  attributePoints: number;
  skillPoints: number;
  maxStartingSkill: number;
  pointsToUnlockNextTier: number;
  maxPointsInSkill: number;
  startingCreditAmount: number;
  currencySystem: "Credits" | "Derived Currency";
  fatePointMethod: "Assigned" | "Rolled";
  assignedFatePoints: number | null;
  allowedSystems: string[];
  derivedCurrencies: Array<{ id?: number; name: string; description: string; creditsPerUnit: number }>;
  campaignRaceIds: number[];
  allowedRaceIds: number[];
  inventoryTagIds: number[];
  inventoryItemIds: number[];
  archivedAt?: string | null;
  archiveReason?: string;
  createdAt?: string;
  updatedAt?: string;
};

type RaceReference = { id: number; name: string; size: string };

const CAMPAIGN_STORAGE_KEY="serrian-tide:prototype:campaigns:v1";
const RACE_STORAGE_KEY="serrian-tide:prototype:races:v1";

const TABS: Array<{id:CampaignSettingsTab;label:string}>=[
  {id:"rules",label:"Rules & Systems"},
  {id:"races",label:"Allowed Races"},
  {id:"inventory",label:"Inventory Access"},
];

const SYSTEMS=["Tier 1","Tier 2","Tier 3","Spellcraft","Talismanism","Faith","Psyonics","Special Abilities","Bardic Resonance","Derived Abilities"];

function newCampaignDraft(): CampaignDraft {
  return {
    name:"",
    overview:"",
    attributePoints:0,
    skillPoints:0,
    maxStartingSkill:0,
    pointsToUnlockNextTier:0,
    maxPointsInSkill:0,
    startingCreditAmount:0,
    currencySystem:"Credits",
    fatePointMethod:"Assigned",
    assignedFatePoints:0,
    allowedSystems:["Tier 1"],
    derivedCurrencies:[],
    campaignRaceIds:[],
    allowedRaceIds:[],
    inventoryTagIds:[],
    inventoryItemIds:[],
    archivedAt:null,
    archiveReason:"",
  };
}

function readCampaigns(): CampaignDraft[] {
  if(typeof window==="undefined") return [];
  try {
    const raw=window.localStorage.getItem(CAMPAIGN_STORAGE_KEY);
    const parsed=raw?JSON.parse(raw):[];
    return Array.isArray(parsed)?parsed:[];
  } catch { return []; }
}

function writeCampaigns(rows:CampaignDraft[]) {
  window.localStorage.setItem(CAMPAIGN_STORAGE_KEY,JSON.stringify(rows));
}

function readRaceReferences(): RaceReference[] {
  if(typeof window==="undefined") return [];
  try {
    const raw=window.localStorage.getItem(RACE_STORAGE_KEY);
    const parsed=raw?JSON.parse(raw):[];
    if(!Array.isArray(parsed)) return [];
    return parsed
      .filter((row:any)=>!row.archivedAt)
      .map((row:any)=>({id:Number(row.id),name:String(row.core?.name??""),size:String(row.core?.size??"")}))
      .filter((row:RaceReference)=>row.id>0 && row.name);
  } catch { return []; }
}

function Field({label,children,wide=false}:{label:string;children:React.ReactNode;wide?:boolean}) {
  return <label className={wide?"campaign-field campaign-field--wide":"campaign-field"}><span>{label}</span>{children}</label>;
}

function SectionHeading({eyebrow,title,action,onAction}:{eyebrow:string;title:string;action?:string;onAction?:()=>void}) {
  return <div className="campaign-section-heading"><div><p>{eyebrow}</p><h3>{title}</h3></div>{action&&onAction?<button type="button" onClick={onAction}>{action}</button>:null}</div>;
}

export function CampaignWorkspace({startNew=false}:{startNew?:boolean}) {
  const [view,setView]=useState<"active"|"archived">("active");
  const [version,setVersion]=useState(0);
  const [selectedId,setSelectedId]=useState<number|null>(null);
  const [draft,setDraft]=useState<CampaignDraft>(newCampaignDraft());
  const [dirty,setDirty]=useState(false);
  const [tab,setTab]=useState<CampaignSettingsTab>("rules");
  const [raceSearch,setRaceSearch]=useState("");
  const [feedback,setFeedback]=useState<{kind:"success"|"error";message:string}|null>(null);

  const campaigns=useMemo(()=>{
    void version;
    return readCampaigns()
      .filter(row=>Boolean(row.archivedAt)===(view==="archived"))
      .sort((a,b)=>a.name.localeCompare(b.name));
  },[view,version]);

  const races=useMemo(()=>{
    void version;
    const q=raceSearch.trim().toLowerCase();
    return readRaceReferences()
      .filter(r=>!q || r.name.toLowerCase().includes(q) || r.size.toLowerCase().includes(q))
      .sort((a,b)=>a.name.localeCompare(b.name));
  },[raceSearch,version]);

  useState(()=>{ if(startNew) setDraft(newCampaignDraft()); });

  function change(next:CampaignDraft){ setDraft(next); setDirty(true); setFeedback(null); }

  function beginNew(){
    if(dirty&&!window.confirm("Discard unsaved Campaign changes?")) return;
    setSelectedId(null); setDraft(newCampaignDraft()); setDirty(false); setTab("rules"); setFeedback(null); setView("active");
  }

  function openCampaign(id:number){
    if(dirty&&!window.confirm("Discard unsaved Campaign changes?")) return;
    const row=readCampaigns().find(entry=>entry.id===id);
    if(!row) return;
    setSelectedId(id); setDraft(row); setDirty(false); setTab("rules"); setFeedback(null);
  }

  function save(){
    try {
      const name=draft.name.trim();
      if(!name) throw new Error("Campaign Name is required.");
      const rows=readCampaigns();
      const now=new Date().toISOString();
      if(draft.id){
        const index=rows.findIndex(row=>row.id===draft.id);
        if(index<0) throw new Error("That Campaign no longer exists.");
        rows[index]={...draft,name,updatedAt:now};
        writeCampaigns(rows);
        setDraft(rows[index]!);
      } else {
        const id=rows.reduce((m,row)=>Math.max(m,row.id??0),0)+1;
        const saved={...draft,id,name,archivedAt:null,archiveReason:"",createdAt:now,updatedAt:now};
        rows.push(saved); writeCampaigns(rows); setDraft(saved); setSelectedId(id);
      }
      setDirty(false); setFeedback({kind:"success",message:name+" was saved locally."}); setVersion(v=>v+1);
    } catch(error) {
      setFeedback({kind:"error",message:error instanceof Error?error.message:"Campaign could not be saved."});
    }
  }

  function archive(){
    if(!draft.id) return;
    const reason=window.prompt("Archive reason (optional):")??"";
    const rows=readCampaigns(); const i=rows.findIndex(row=>row.id===draft.id); if(i<0)return;
    rows[i]={...rows[i]!,archivedAt:new Date().toISOString(),archiveReason:reason}; writeCampaigns(rows);
    setDraft(rows[i]!); setDirty(false); setVersion(v=>v+1);
  }

  function restore(){
    if(!draft.id)return;
    const rows=readCampaigns(); const i=rows.findIndex(row=>row.id===draft.id); if(i<0)return;
    rows[i]={...rows[i]!,archivedAt:null,archiveReason:""}; writeCampaigns(rows);
    setDraft(rows[i]!); setDirty(false); setVersion(v=>v+1);
  }

  function remove(){
    if(!draft.id)return;
    const confirmation=window.prompt("Type "+draft.name+" to permanently delete this local Campaign:");
    if(confirmation!==draft.name)return;
    writeCampaigns(readCampaigns().filter(row=>row.id!==draft.id));
    beginNew(); setVersion(v=>v+1);
  }

  function toggleSystem(system:string,enabled:boolean){
    change({...draft,allowedSystems:enabled?[...new Set([...draft.allowedSystems,system])]:draft.allowedSystems.filter(entry=>entry!==system)});
  }

  function toggleCampaignRace(id:number){
    const included=draft.campaignRaceIds.includes(id);
    change({
      ...draft,
      campaignRaceIds:included?draft.campaignRaceIds.filter(x=>x!==id):[...draft.campaignRaceIds,id],
      allowedRaceIds:included?draft.allowedRaceIds.filter(x=>x!==id):draft.allowedRaceIds,
    });
  }

  function togglePlayableRace(id:number){
    if(!draft.campaignRaceIds.includes(id))return;
    change({...draft,allowedRaceIds:draft.allowedRaceIds.includes(id)?draft.allowedRaceIds.filter(x=>x!==id):[...draft.allowedRaceIds,id]});
  }

  const archived=Boolean(draft.archivedAt);

  return <main className="campaign-page">
    <header className="campaign-header">
      <Link href="/heavens" className="font-portcullion campaign-logo">Serrian<br/>Tide</Link>
      <div><p>THE HEAVENS / CAMPAIGN SETTINGS</p><h1 className="font-sans">Edit Campaign</h1><span>Creator-owned rules, access, currency, and authorized content.</span></div>
      <nav><Link href="/heavens">← Return to Campaign Control</Link><button className="campaign-nav-button is-primary" type="button" onClick={beginNew}>New Campaign</button></nav>
    </header>

    {feedback?<p className={"campaign-feedback is-"+feedback.kind}>{feedback.message}</p>:null}

    <div className="campaign-workspace">
      <aside className="campaign-library">
        <header><div><p>CAMPAIGN WORLDS</p><h2>Campaign Library</h2></div><div className="campaign-library-filters"><button type="button" className={view==="active"?"is-active":""} onClick={()=>setView("active")}>Active</button><button type="button" className={view==="archived"?"is-active":""} onClick={()=>setView("archived")}>Archived</button></div></header>
        <div>{campaigns.map(entry=><button key={entry.id} type="button" className={selectedId===entry.id?"is-selected":""} onClick={()=>openCampaign(entry.id!)}>
          <div className="campaign-library-card-heading"><strong>{entry.name}</strong><em className="campaign-access-badge is-owner">Yours</em></div>
          <span>Prototype Campaign</span><small>{entry.archivedAt?"Archived · ":""}{entry.currencySystem}</small>
        </button>)}{!campaigns.length?<p>No {view} Campaigns.</p>:null}</div>
      </aside>

      <section className="campaign-editor">
        <header className="campaign-editor-header">
          <div><p>{draft.id?"CAMPAIGN "+draft.id:"NEW CAMPAIGN DRAFT"}</p><h2>{draft.name||"Untitled Campaign"}</h2><span>{archived?"Archived":dirty?"Unsaved changes":draft.id?"Saved locally":"Not yet persisted"}</span></div>
          <div className="campaign-editor-actions">
            {draft.id?(archived?<button type="button" onClick={restore}>Restore</button>:<button type="button" disabled={dirty} onClick={archive}>Archive</button>):null}
            {draft.id?<button className="is-danger" type="button" disabled={dirty} onClick={remove}>Delete</button>:null}
            <button type="button" disabled={archived} onClick={save}>Save Campaign</button>
          </div>
        </header>

        <nav className="campaign-tabs">{TABS.map(entry=><button key={entry.id} type="button" className={tab===entry.id?"is-active":""} onClick={()=>setTab(entry.id)}>{entry.label}</button>)}</nav>

        <div className="campaign-editor-content">
          {tab==="rules"?<Rules draft={draft} onChange={change}/>:null}
          {tab==="races"?<RacesTab draft={draft} races={races} search={raceSearch} onSearch={setRaceSearch} onToggleCampaign={toggleCampaignRace} onTogglePlayable={togglePlayableRace}/>:null}
          {tab==="inventory"?<InventoryTab draft={draft} onChange={change}/>:null}
        </div>
      </section>
    </div>
  </main>;
}

function Rules({draft,onChange}:{draft:CampaignDraft;onChange:(draft:CampaignDraft)=>void}) {
  const set=(update:Partial<CampaignDraft>)=>onChange({...draft,...update});
  return <div className="campaign-section">
    <div className="campaign-form-grid">
      <Field label="Campaign Name" wide><input value={draft.name} onChange={e=>set({name:e.target.value})}/></Field>
      <Field label="Campaign Overview" wide><textarea rows={8} value={draft.overview} onChange={e=>set({overview:e.target.value})}/></Field>
      <Field label="Attribute Points"><input type="number" min={0} value={draft.attributePoints} onChange={e=>set({attributePoints:Number(e.target.value)})}/></Field>
      <Field label="Skill Points"><input type="number" min={0} value={draft.skillPoints} onChange={e=>set({skillPoints:Number(e.target.value)})}/></Field>
      <Field label="Max Starting Points per Skill"><input type="number" min={0} value={draft.maxStartingSkill} onChange={e=>set({maxStartingSkill:Number(e.target.value)})}/></Field>
      <Field label="Points to Unlock Next Tier"><input type="number" min={0} value={draft.pointsToUnlockNextTier} onChange={e=>set({pointsToUnlockNextTier:Number(e.target.value)})}/></Field>
      <Field label="Max Points in Standard Skill"><input type="number" min={0} value={draft.maxPointsInSkill} onChange={e=>set({maxPointsInSkill:Number(e.target.value)})}/></Field>
      <Field label="Starting Credits"><input type="number" min={0} value={draft.startingCreditAmount} onChange={e=>set({startingCreditAmount:Number(e.target.value)})}/></Field>
      <Field label="Fate Method"><select value={draft.fatePointMethod} onChange={e=>set({fatePointMethod:e.target.value as "Assigned"|"Rolled"})}><option>Assigned</option><option>Rolled</option></select></Field>
      {draft.fatePointMethod==="Assigned"?<Field label="Assigned Fate Points"><input type="number" min={0} value={draft.assignedFatePoints??0} onChange={e=>set({assignedFatePoints:Number(e.target.value)})}/></Field>:null}
      <Field label="Currency System"><select value={draft.currencySystem} onChange={e=>set({currencySystem:e.target.value as "Credits"|"Derived Currency"})}><option>Credits</option><option>Derived Currency</option></select></Field>
    </div>

    <SectionHeading eyebrow="RULE AVAILABILITY" title="Allowed Systems"/>
    <div className="campaign-check-grid">{SYSTEMS.map(system=><label key={system} className={draft.allowedSystems.includes(system)?"is-selected":""}><input type="checkbox" checked={draft.allowedSystems.includes(system)} onChange={e=>onChange({...draft,allowedSystems:e.target.checked?[...new Set([...draft.allowedSystems,system])]:draft.allowedSystems.filter(x=>x!==system)})}/><span>{system}</span></label>)}</div>

    {draft.currencySystem==="Derived Currency"?<>
      <SectionHeading eyebrow="DENOMINATIONS" title="Derived Currencies" action="Add Currency" onAction={()=>set({derivedCurrencies:[...draft.derivedCurrencies,{name:"",description:"",creditsPerUnit:1}]})}/>
      <div className="campaign-currency-list">{draft.derivedCurrencies.map((currency,index)=><article key={index}>
        <input placeholder="Name" value={currency.name} onChange={e=>set({derivedCurrencies:draft.derivedCurrencies.map((row,i)=>i===index?{...row,name:e.target.value}:row)})}/>
        <input placeholder="Description" value={currency.description} onChange={e=>set({derivedCurrencies:draft.derivedCurrencies.map((row,i)=>i===index?{...row,description:e.target.value}:row)})}/>
        <input type="number" min={0.000001} step="any" value={currency.creditsPerUnit} onChange={e=>set({derivedCurrencies:draft.derivedCurrencies.map((row,i)=>i===index?{...row,creditsPerUnit:Number(e.target.value)}:row)})}/>
        <button type="button" onClick={()=>set({derivedCurrencies:draft.derivedCurrencies.filter((_,i)=>i!==index)})}>Remove</button>
      </article>)}</div>
    </>:null}
  </div>;
}

function RacesTab({draft,races,search,onSearch,onToggleCampaign,onTogglePlayable}:{draft:CampaignDraft;races:RaceReference[];search:string;onSearch:(v:string)=>void;onToggleCampaign:(id:number)=>void;onTogglePlayable:(id:number)=>void}) {
  return <div className="campaign-section">
    <div><input className="campaign-search" type="search" value={search} placeholder="Search prototype Races" onChange={e=>onSearch(e.target.value)}/></div>
    <p className="campaign-help">Campaign Races are available in the setting. Playable Races are the subset Players may choose.</p>
    <div className="campaign-selection-grid">
      <section className="campaign-selection-column">
        <header><p>LOCAL RACE LIBRARY</p><h4>Available Races</h4></header>
        <div className="campaign-selection-list">{races.map(r=><button type="button" key={r.id} className={draft.campaignRaceIds.includes(r.id)?"is-selected":""} onClick={()=>onToggleCampaign(r.id)}><div><strong>{r.name}</strong><span>{r.size}</span></div><small>{draft.campaignRaceIds.includes(r.id)?"Added":"Add"}</small></button>)}{!races.length?<p className="campaign-empty-state">Create prototype Races first.</p>:null}</div>
      </section>
      <section className="campaign-selection-column">
        <header><p>CAMPAIGN RACES</p><h4>In This Campaign</h4></header>
        <div className="campaign-selection-list">{races.filter(r=>draft.campaignRaceIds.includes(r.id)).map(r=><button type="button" key={r.id} className="is-selected" onClick={()=>onToggleCampaign(r.id)}><div><strong>{r.name}</strong><span>{r.size}</span></div><small>Remove</small></button>)}</div>
      </section>
      <section className="campaign-selection-column">
        <header><p>PLAYER OPTIONS</p><h4>Playable Races</h4></header>
        <div className="campaign-selection-list">{races.filter(r=>draft.campaignRaceIds.includes(r.id)).map(r=><button type="button" key={r.id} className={draft.allowedRaceIds.includes(r.id)?"is-selected":""} onClick={()=>onTogglePlayable(r.id)}><div><strong>{r.name}</strong><span>{r.size}</span></div><small>{draft.allowedRaceIds.includes(r.id)?"Playable":"Enable"}</small></button>)}</div>
      </section>
    </div>
  </div>;
}

function InventoryTab({draft,onChange}:{draft:CampaignDraft;onChange:(draft:CampaignDraft)=>void}) {
  const [tagId,setTagId]=useState("");
  const [itemId,setItemId]=useState("");
  return <div className="campaign-section">
    <div className="skill-editor__intro"><p>Inventory authorization will eventually read from the local Equipment and Inventory prototype libraries. For now you can exercise the selection behavior with prototype IDs while those adapters are converted.</p></div>
    <SectionHeading eyebrow="INVENTORY TAGS" title="Authorized Tag IDs"/>
    <div className="campaign-player-add"><input value={tagId} placeholder="Prototype tag ID" onChange={e=>setTagId(e.target.value)}/><button type="button" onClick={()=>{const id=Number(tagId);if(id&&!draft.inventoryTagIds.includes(id))onChange({...draft,inventoryTagIds:[...draft.inventoryTagIds,id]});setTagId("");}}>Add Tag</button></div>
    <div className="campaign-player-list">{draft.inventoryTagIds.map(id=><article key={id}><strong>Tag {id}</strong><span>Prototype authorization</span><button className="is-danger" type="button" onClick={()=>onChange({...draft,inventoryTagIds:draft.inventoryTagIds.filter(x=>x!==id)})}>Remove</button></article>)}</div>
    <SectionHeading eyebrow="INDIVIDUAL ITEMS" title="Authorized Item IDs"/>
    <div className="campaign-player-add"><input value={itemId} placeholder="Prototype item ID" onChange={e=>setItemId(e.target.value)}/><button type="button" onClick={()=>{const id=Number(itemId);if(id&&!draft.inventoryItemIds.includes(id))onChange({...draft,inventoryItemIds:[...draft.inventoryItemIds,id]});setItemId("");}}>Add Item</button></div>
    <div className="campaign-player-list">{draft.inventoryItemIds.map(id=><article key={id}><strong>Item {id}</strong><span>Prototype authorization</span><button className="is-danger" type="button" onClick={()=>onChange({...draft,inventoryItemIds:draft.inventoryItemIds.filter(x=>x!==id)})}>Remove</button></article>)}</div>
  </div>;
}
