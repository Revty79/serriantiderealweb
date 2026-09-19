"use client";
import Link from "next/link";
import { useMemo } from "react";
import { readCampaigns,readCharacters,readRaces } from "@/lib/local-character-store";
import { readSpells } from "@/lib/local-spell-store";
import { readSkills } from "@/lib/local-skill-store";
import { readDerivedAbilities } from "@/lib/local-derived-store";
import { readItems } from "@/lib/local-item-store";
import { readCreatures } from "@/lib/local-creature-store";
import { readNpcs } from "@/lib/local-npc-store";
import { readChat } from "@/lib/local-chat-store";

function readArray(key:string):Array<{archivedAt?:string|null}>{
 if(typeof window==="undefined")return[];
 try{const p=JSON.parse(localStorage.getItem(key)??"[]");return Array.isArray(p)?p:[]}catch{return[]}
}
export default function ContentOverview(){
 const data=useMemo(()=>({
  campaigns:readCampaigns(),characters:readCharacters(),races:readRaces(),skills:readSkills(),derived:readDerivedAbilities(),
  equipment:readItems("equipment"),inventory:readItems("inventory"),creatures:readCreatures(),npcs:readNpcs(),spells:readSpells(),
  shops:readArray("serrian-tide:prototype:shops:v1"),towns:readArray("serrian-tide:prototype:towns:v1"),chat:readChat()
 }),[]);
 const counts=(rows:Array<{archivedAt?:string|null}>)=>({total:rows.length,active:rows.filter(r=>!r.archivedAt).length,archived:rows.filter(r=>r.archivedAt).length});
 const cards=[
  ["Campaigns",counts(data.campaigns)],["Player Characters",counts(data.characters)],["Races",counts(data.races)],["Skills",counts(data.skills)],
  ["Derived Abilities",counts(data.derived)],["Equipment",counts(data.equipment)],["Inventory",counts(data.inventory)],["Creatures",counts(data.creatures)],
  ["NPCs",counts(data.npcs)],["Shops",counts(data.shops)],["Towns",counts(data.towns)],["Saved Spells",{total:data.spells.length,active:data.spells.length,archived:0}],
 ];
 return <main className="relative z-10 min-h-screen px-6 py-10"><div className="mx-auto max-w-7xl">
  <header className="rounded-3xl border border-white/10 bg-black/35 p-7"><p className="text-xs uppercase tracking-[.14em] text-purple-200">Administration / Site-wide Content</p><h1 className="mt-3 text-4xl text-slate-100">Content Overview</h1><p className="mt-3 text-slate-400">Counts the disposable local prototype data currently being authored in this browser.</p><nav className="mt-4 flex gap-4"><Link href="/admin" className="text-amber-200">Admin Dashboard</Link><Link href="/heavens" className="text-slate-300">The Heavens</Link></nav></header>
  <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{cards.map(([label,value])=>{const count=value as {total:number;active:number;archived:number};return <article key={String(label)} className="rounded-2xl border border-white/10 bg-black/35 p-5"><p className="text-xs uppercase text-slate-400">{label}</p><p className="mt-3 text-3xl text-amber-200">{count.total}</p><p className="mt-2 text-sm text-slate-400"><span className="text-emerald-200">{count.active} active</span> · <span className="text-orange-200">{count.archived} archived</span></p></article>})}</section>
  <section className="mt-8 rounded-3xl border border-white/10 bg-black/35 p-7"><p className="text-xs uppercase tracking-[.14em] text-purple-200">Shared Libraries</p><h2 className="mt-2 text-3xl">Catalog Health</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{[["Races","/heavens/races"],["Skills","/heavens/skills"],["Derived Abilities","/heavens/derived-abilities"],["Equipment","/heavens/equipment"],["Inventory","/heavens/inventory"],["Creatures","/heavens/creatures"],["Shops","/heavens/shops"],["Towns","/heavens/towns"],["NPCs","/heavens/npcs"],["Campaigns","/heavens/campaigns"]].map(([label,href])=><Link key={label} href={href} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 hover:border-amber-300/40"><p>{label}</p><p className="mt-3 text-xs text-purple-200">Open library</p></Link>)}</div></section>
  <section className="mt-8 rounded-3xl border border-white/10 bg-black/35 p-7"><p className="text-xs uppercase tracking-[.14em] text-purple-200">Crossroads</p><h2 className="mt-2 text-3xl">Local Communication</h2><p className="mt-4 text-slate-300">{data.chat.messages.length} messages · {data.chat.directConversations.length} direct conversations</p><Link href="/chat" className="mt-4 inline-flex text-amber-200">Open The Crossroads →</Link></section>
 </div></main>;
}