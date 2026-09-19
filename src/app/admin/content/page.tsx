"use client";
import Link from "next/link";
import { useMemo } from "react";
import { readCampaigns,readCharacters,readRaces } from "@/lib/local-character-store";
import { readSpells } from "@/lib/local-spell-store";
export default function ContentOverview(){
 const campaigns=useMemo(()=>readCampaigns(),[]),characters=useMemo(()=>readCharacters(),[]),races=useMemo(()=>readRaces(),[]),spells=useMemo(()=>readSpells(),[]);
 const counts=(rows:Array<{archivedAt?:string|null}>)=>({total:rows.length,active:rows.filter(r=>!r.archivedAt).length,archived:rows.filter(r=>r.archivedAt).length});
 const cards=[["Campaigns",counts(campaigns)],["Player Characters",counts(characters)],["Races",counts(races)],["Saved Spells",{total:spells.length,active:spells.length,archived:0}]];
 return <main className="relative z-10 min-h-screen px-6 py-10"><div className="mx-auto max-w-7xl">
  <header className="rounded-3xl border border-white/10 bg-black/35 p-7"><p className="text-xs uppercase tracking-[.14em] text-purple-200">Administration / Site-wide Content</p><h1 className="mt-3 text-4xl text-slate-100">Content Overview</h1><p className="mt-3 text-slate-400">Counts the disposable local prototype data currently being authored in this browser.</p><nav className="mt-4 flex gap-4"><Link href="/admin" className="text-amber-200">Admin Dashboard</Link><Link href="/heavens" className="text-slate-300">The Heavens</Link></nav></header>
  <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label,value])=>{const c=value as {total:number;active:number;archived:number};return <article key={String(label)} className="rounded-2xl border border-white/10 bg-black/35 p-5"><p className="text-xs uppercase text-slate-400">{label}</p><p className="mt-3 text-3xl text-amber-200">{c.total}</p><p className="mt-2 text-sm text-slate-400"><span className="text-emerald-200">{c.active} active</span> · <span className="text-orange-200">{c.archived} archived</span></p></article>})}</section>
  <section className="mt-8 rounded-3xl border border-white/10 bg-black/35 p-7"><p className="text-xs uppercase tracking-[.14em] text-purple-200">Shared Libraries</p><h2 className="mt-2 text-3xl">Catalog Health</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{[["Races","/heavens/races"],["Skills","/heavens/skills"],["Derived Abilities","/heavens/derived-abilities"],["Equipment","/heavens/equipment"],["Inventory","/heavens/inventory"],["Creatures","/heavens/creatures"],["Shops","/heavens/shops"],["Towns","/heavens/towns"],["NPCs","/heavens/npcs"]].map(([label,href])=><Link key={label} href={href} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 hover:border-amber-300/40"><p>{label}</p><p className="mt-3 text-xs text-purple-200">Open library</p></Link>)}</div></section>
 </div></main>;
}
