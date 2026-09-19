"use client";
import Link from "next/link";
import { useMemo,useState } from "react";
import { readCampaigns } from "@/lib/local-character-store";
import { readUsers } from "@/lib/local-user-store";
import { readChat,writeChat,type LocalChatMessage } from "@/lib/local-chat-store";

const CURRENT_USER_ID="prototype-admin";
type Room={id:string;label:string;detail:string;scope:"global"|"campaign"|"direct"};

export default function LocalCrossroads(){
 const campaigns=useMemo(()=>readCampaigns().filter(c=>!c.archivedAt),[]);
 const users=useMemo(()=>readUsers(),[]);
 const currentUser=users.find(u=>u.id===CURRENT_USER_ID)??users[0]??{id:CURRENT_USER_ID,name:"Adventurer",username:"adventurer"};
 const [version,setVersion]=useState(0);const [activeRoomId,setActiveRoomId]=useState("global:crossroads");const [draft,setDraft]=useState("");const [dmUserId,setDmUserId]=useState("");
 const store=useMemo(()=>{void version;return readChat()},[version]);
 const rooms:Room[]=[
  {id:"global:crossroads",label:"The Crossroads",detail:"Global discussion",scope:"global"},
  ...campaigns.map(c=>({id:"campaign:"+c.id,label:c.name,detail:"Campaign room",scope:"campaign" as const})),
  ...store.directConversations.map(d=>({id:d.id,label:d.label,detail:"Direct conversation",scope:"direct" as const}))
 ];
 const active=rooms.find(r=>r.id===activeRoomId)??rooms[0]!;
 const messages=store.messages.filter(m=>m.roomId===active.id).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
 function send(){const content=draft.trim();if(!content)return;const next=readChat();const id=next.messages.reduce((m,x)=>Math.max(m,x.id),0)+1;next.messages.push({id,roomId:active.id,senderUserId:currentUser.id,senderName:currentUser.name||currentUser.username||"Adventurer",content,createdAt:new Date().toISOString()});writeChat(next);setDraft("");setVersion(v=>v+1)}
 function deleteMessage(id:number){const next=readChat();next.messages=next.messages.filter(m=>m.id!==id);writeChat(next);setVersion(v=>v+1)}
 function createDm(){const other=users.find(u=>u.id===dmUserId);if(!other||other.id===currentUser.id)return;const ids=[currentUser.id,other.id].sort();const id="dm:"+ids.join(":");const next=readChat();if(!next.directConversations.some(d=>d.id===id)){next.directConversations.push({id,userIds:ids,label:other.name||other.username,createdAt:new Date().toISOString()});writeChat(next)}setActiveRoomId(id);setDmUserId("");setVersion(v=>v+1)}
 function roomButton(room:Room){return <button key={room.id} className={"room-button"+(active.id===room.id?" is-active":"")} type="button" onClick={()=>setActiveRoomId(room.id)}><span><strong>{room.label}</strong><small>{room.detail}</small></span>{active.id===room.id?<em>Current</em>:null}</button>}
 return <main className="crossroads-page"><div className="crossroads-shell">
  <header className="crossroads-hero"><div className="crossroads-brand-block"><Link href="/dashboard" className="crossroads-brand">Serrian Tide</Link><p>Communication Center</p></div><div className="crossroads-copy"><p className="portal-eyebrow">Shared Communications</p><h1 className="font-evanescent">The Crossroads</h1><span>Global, Campaign, and direct conversations meet here.</span></div><div className="crossroads-account"><span>Signed in as</span><strong>{currentUser.name||currentUser.username}</strong><Link href="/dashboard">Return to Paths</Link></div></header>
  <section className="crossroads-workspace">
   <aside className="crossroads-sidebar">
    <div className="room-group"><h2>Global</h2>{roomButton(rooms[0]!)}</div>
    <div className="room-group"><h2>Campaign Rooms</h2>{rooms.filter(r=>r.scope==="campaign").map(roomButton)}{!campaigns.length?<p>No local Campaign rooms yet.</p>:null}</div>
    <div className="room-group"><h2>Direct Messages</h2><div className="crossroads-dm-create"><select value={dmUserId} onChange={e=>setDmUserId(e.target.value)}><option value="">Choose a local user</option>{users.filter(u=>u.id!==currentUser.id).map(u=><option key={u.id} value={u.id}>{u.name||u.username}</option>)}</select><button className="small-room-action" disabled={!dmUserId} onClick={createDm}>New conversation</button></div>{rooms.filter(r=>r.scope==="direct").map(roomButton)}{!store.directConversations.length?<p>No direct messages yet.</p>:null}</div>
   </aside>
   <div className="crossroads-conversation">
    <header><div><p>{active.scope.toUpperCase()} ROOM</p><h2>{active.label}</h2><span>{active.detail}</span></div><span className="chat-status"><i/> Local prototype</span></header>
    <div className="crossroads-history">{messages.length?<ul className="crossroads-message-list">{messages.map(m=><li key={m.id} className={m.senderUserId===currentUser.id?"is-own":""}><header><strong>{m.senderName}</strong><time>{new Date(m.createdAt).toLocaleString()}</time></header><p>{m.content}</p>{m.senderUserId===currentUser.id?<button onClick={()=>deleteMessage(m.id)}>Delete</button>:null}</li>)}</ul>:<div className="crossroads-empty"><span className="font-evanescent">The road is quiet for now.</span><p>Send the first local prototype message in this room.</p></div>}</div>
    <div className="crossroads-composer"><label htmlFor="chat-draft">Message</label><div><textarea id="chat-draft" value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}} placeholder={"Message "+active.label}/><button onClick={send} disabled={!draft.trim()}>Send</button></div></div>
   </div>
  </section>
 </div></main>;
}
