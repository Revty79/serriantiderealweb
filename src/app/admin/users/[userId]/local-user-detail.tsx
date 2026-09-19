"use client";
import Link from "next/link";
import { useMemo } from "react";
import { readUsers } from "@/lib/local-user-store";
import { readCampaigns,readCharacters } from "@/lib/local-character-store";
export function LocalUserDetail({userId}:{userId:string}){
 const user=useMemo(()=>readUsers().find(u=>u.id===userId)??null,[userId]);const campaigns=useMemo(()=>readCampaigns(),[]);const chars=useMemo(()=>readCharacters(),[]);
 if(!user)return <main className="relative z-10 min-h-screen p-10"><Link href="/admin/users">← Users</Link><h1>User not found.</h1></main>;
 return <main className="relative z-10 min-h-screen px-6 py-10"><div className="mx-auto max-w-7xl">
  <header className="rounded-3xl border border-white/10 bg-black/35 p-7"><p className="text-xs uppercase tracking-[.14em] text-purple-200">Administration / User Account</p><h1 className="mt-3 text-4xl text-slate-100">{user.name}</h1><p className="mt-2 text-slate-400">{user.email}</p><nav className="mt-4 flex gap-4"><Link className="text-amber-200" href="/admin/users">Back to User Management</Link><Link className="text-slate-300" href="/admin">Admin Dashboard</Link></nav></header>
  <section className="mt-8 rounded-3xl border border-white/10 bg-black/35 p-7"><p className="text-xs uppercase tracking-[.14em] text-purple-200">Account Summary</p><dl className="mt-5 grid gap-5 sm:grid-cols-2"><div><dt className="text-xs text-slate-400">Name</dt><dd>{user.name}</dd></div><div><dt className="text-xs text-slate-400">Username</dt><dd>{user.username}</dd></div><div><dt className="text-xs text-slate-400">Email</dt><dd>{user.email}</dd></div><div><dt className="text-xs text-slate-400">Roles</dt><dd>{user.roles.join(" · ")}</dd></div></dl></section>
  <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{[["Campaigns Created",campaigns.length],["Campaigns Joined",0],["Player Characters",chars.length],["Race NPCs Controlled",0],["Creature NPCs Controlled",0]].map(([label,count])=><article key={String(label)} className="rounded-2xl border border-white/10 bg-black/35 p-5"><p className="text-xs uppercase text-slate-400">{label}</p><p className="mt-3 text-3xl text-amber-200">{count}</p></article>)}</section>
 </div></main>;
}
