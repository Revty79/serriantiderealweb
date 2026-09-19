"use client";
import Link from "next/link";
import { useMemo,useState } from "react";
import { readUsers,writeUsers,type LocalUser } from "@/lib/local-user-store";
const roles=["admin","god","player"] as const;
const labels={admin:"ADMIN",god:"G.O.D.",player:"PLAYER"};
export default function AdminUsersPage(){
 const [version,setVersion]=useState(0);const [name,setName]=useState("");const [username,setUsername]=useState("");const [email,setEmail]=useState("");
 const users=useMemo(()=>{void version;return readUsers()},[version]);
 function save(rows:LocalUser[]){writeUsers(rows);setVersion(v=>v+1)}
 function add(){if(!name.trim()||!username.trim()||!email.trim())return;save([...users,{id:"local-"+Date.now(),name:name.trim(),username:username.trim(),email:email.trim(),roles:["player"],createdAt:new Date().toISOString()}]);setName("");setUsername("");setEmail("")}
 function toggle(id:string,role:typeof roles[number]){save(users.map(u=>u.id===id?{...u,roles:u.roles.includes(role)?u.roles.filter(r=>r!==role):[...u.roles,role]}:u))}
 function remove(id:string){const u=users.find(x=>x.id===id);if(!u||window.prompt("Type "+u.name+" to delete this local user:")!==u.name)return;save(users.filter(x=>x.id!==id))}
 return <main className="relative z-10 min-h-screen px-6 py-10"><div className="mx-auto w-full max-w-7xl">
  <header className="rounded-3xl border border-white/10 bg-black/35 px-7 py-7 shadow-2xl backdrop-blur-md sm:px-9"><div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><Link href="/admin" className="font-portcullion bg-gradient-to-r from-purple-500 via-amber-300 to-purple-500 bg-clip-text text-5xl text-transparent">Serrian Tide</Link><p className="mt-3 text-xs uppercase tracking-[.14em] text-purple-200">Administration</p></div><div className="sm:text-right"><p className="text-sm text-slate-400">{users.length} local accounts</p><Link href="/admin" className="mt-2 inline-block text-sm text-amber-200">← Admin Dashboard</Link></div></div></header>
  <section className="mt-8"><h2 className="text-4xl text-slate-100">User Management</h2><p className="mt-2 text-slate-400">Prototype accounts and role assignments. These records are disposable browser-local data.</p>
   <div className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-5 sm:grid-cols-4"><input className="rounded-xl border border-white/15 bg-black/50 p-3" placeholder="Name" value={name} onChange={e=>setName(e.target.value)}/><input className="rounded-xl border border-white/15 bg-black/50 p-3" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)}/><input className="rounded-xl border border-white/15 bg-black/50 p-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/><button className="rounded-xl border border-amber-300/40 bg-amber-300/10 text-amber-100" onClick={add}>Add Local User</button></div>
   <div className="mt-6 space-y-4">{users.map(u=><article key={u.id} className="rounded-3xl border border-white/10 bg-black/35 p-6 shadow-xl"><div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div><h3 className="text-2xl text-slate-100">{u.name}</h3><p className="mt-2 text-sm text-slate-400">@{u.username} · {u.email}</p><Link href={"/admin/users/"+encodeURIComponent(u.id)} className="mt-3 inline-flex text-amber-200">Open Account</Link></div><div className="flex flex-wrap gap-2">{roles.map(role=><button key={role} onClick={()=>toggle(u.id,role)} className={"rounded-full border px-3 py-2 text-xs "+(u.roles.includes(role)?"border-amber-300/50 bg-amber-300/10 text-amber-100":"border-white/15 text-slate-400")}>{labels[role]}</button>)}<button onClick={()=>remove(u.id)} className="rounded-full border border-red-300/30 px-3 py-2 text-xs text-red-200">Delete</button></div></div></article>)}</div>
  </section>
 </div></main>;
}
