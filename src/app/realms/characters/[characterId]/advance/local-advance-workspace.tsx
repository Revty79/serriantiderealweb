"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { readCharacters, writeCharacters, type LocalCharacter } from "@/lib/local-character-store";

const ATTRIBUTES=[["STR","Strength"],["DEX","Dexterity"],["CON","Constitution"],["INT","Intelligence"],["WIS","Wisdom"],["CHR","Charisma"]] as const;

export function LocalAdvanceWorkspace({characterId}:{characterId:number}) {
  const initial=useMemo(()=>readCharacters().find(c=>c.id===characterId)??null,[characterId]);
  const [character,setCharacter]=useState<LocalCharacter|null>(initial);
  const [mode,setMode]=useState<"paths"|"experience"|"quintessence">("paths");
  const [feedback,setFeedback]=useState("");
  const [attr,setAttr]=useState<keyof LocalCharacter["attributes"]>("STR");
  const [qty,setQty]=useState(1);

  if(!character) return <main className="character-page advance-page"><section className="advancement-choice"><h1>Character not found.</h1><Link href="/realms">Return to Realms</Link></section></main>;

  function save(next:LocalCharacter,message:string){
    const rows=readCharacters(); const i=rows.findIndex(c=>c.id===next.id); if(i<0)return;
    rows[i]={...next,updatedAt:new Date().toISOString()}; writeCharacters(rows); setCharacter(rows[i]!); setFeedback(message);
  }
  function spendXp(skillId:number, amount:number){
    if(!character || amount<=0 || amount>character.experience)return;
    const next={...character,
      experience:character.experience-amount,
      totalExperience:character.totalExperience+amount,
      skills:character.skills.map(s=>s.id===skillId?{...s,points:s.points+amount,rank:Math.floor((s.points+amount)/5)}:s)
    };
    save(next,amount+" Experience spent.");
  }
  function spendQuintessence(kind:"attribute"|"fate"|"hp"|"movement"|"magic"|"experience"){
    if(!character)return;
    const cost=Math.max(1,qty);
    if(cost>character.quintessence){setFeedback("Not enough Quintessence.");return;}
    let next:LocalCharacter={...character,quintessence:character.quintessence-cost,totalQuintessence:character.totalQuintessence+cost};
    if(kind==="attribute")next={...next,attributes:{...next.attributes,[attr]:next.attributes[attr]+qty}};
    if(kind==="fate")next={...next,fatePoints:(next.fatePoints??0)+qty};
    if(kind==="hp")next={...next,hpMultiplierSteps:next.hpMultiplierSteps+qty};
    if(kind==="movement")next={...next,baseMovementSteps:next.baseMovementSteps+qty};
    if(kind==="magic")next={...next,baseMagicSteps:next.baseMagicSteps+qty};
    if(kind==="experience")next={...next,experience:next.experience+qty*10};
    save(next,"Quintessence purchase saved locally.");
  }

  return <main className="character-page advance-page">
    <header className="character-header">
      <Link href="/realms" className="font-portcullion character-logo">Serrian<br/>Tide</Link>
      <div className="character-header__identity"><p>THE REALMS / CHARACTER ADVANCEMENT</p><h1>{character.name}</h1><span>Permanent Character growth · local prototype</span></div>
      <div className="character-header__actions"><Link href="/realms">Return to Realms</Link><Link href={"/realms/characters/"+character.id}>Character Sheet</Link></div>
    </header>
    {feedback?<p className="character-feedback is-success">{feedback}</p>:null}

    {mode!=="paths"?<div className="advancement-path-nav"><button onClick={()=>setMode("paths")}>← Advancement Paths</button><span>{mode==="experience"?"Spending Experience":"Spending Quintessence"}</span></div>:null}

    {mode==="paths"?<section className="advancement-choice">
      <header className="advancement-section-heading"><div><p>PERMANENT GROWTH</p><h2>Choose an Advancement Path</h2></div></header>
      <div className="advancement-choice-grid">
        <button onClick={()=>setMode("experience")}><strong>Spend Experience</strong><span>Improve owned Skills and test Skill growth.</span><em>{character.experience} Available XP</em></button>
        <button onClick={()=>setMode("quintessence")}><strong>Spend Quintessence</strong><span>Improve Attributes, Fate, HP multiplier, Movement, Magic, or convert to XP.</span><em>{character.quintessence} Available Quintessence</em></button>
      </div>
    </section>:null}

    {mode==="experience"?<section className="advancement-workspace">
      <header className="advancement-section-heading"><div><p>EXPERIENCE</p><h2>Skill Advancement</h2></div><strong>{character.experience} XP Available</strong></header>
      <div className="advancement-skill-list">{character.skills.map(skill=><article key={skill.id}><div><strong>{skill.name}</strong><span>{skill.attribute} · Rank {skill.rank} · {skill.points} points</span></div><div><input type="number" min={1} defaultValue={1} id={"xp-"+skill.id}/><button onClick={()=>{const el=document.getElementById("xp-"+skill.id) as HTMLInputElement|null;spendXp(skill.id,Number(el?.value??1))}}>Spend XP</button></div></article>)}</div>
    </section>:null}

    {mode==="quintessence"?<section className="advancement-workspace">
      <header className="advancement-section-heading"><div><p>QUINTESSENCE</p><h2>Permanent Improvements</h2></div><strong>{character.quintessence} Available</strong></header>
      <div className="quintessence-grid">
        <article><span>Attribute</span><select value={attr} onChange={e=>setAttr(e.target.value as keyof LocalCharacter["attributes"])}>{ATTRIBUTES.map(([k,l])=><option key={k} value={k}>{l}</option>)}</select><input type="number" min={1} value={qty} onChange={e=>setQty(Math.max(1,Number(e.target.value)))}/><button onClick={()=>spendQuintessence("attribute")}>Increase Attribute</button></article>
        <article><span>Fate Points</span><button onClick={()=>spendQuintessence("fate")}>Buy Fate</button></article>
        <article><span>HP Multiplier</span><button onClick={()=>spendQuintessence("hp")}>Increase HP Multiplier</button></article>
        <article><span>Movement</span><button onClick={()=>spendQuintessence("movement")}>Increase Movement</button></article>
        <article><span>Magic</span><button onClick={()=>spendQuintessence("magic")}>Increase Base Magic</button></article>
        <article><span>Convert to Experience</span><button onClick={()=>spendQuintessence("experience")}>Convert</button></article>
      </div>
    </section>:null}
  </main>;
}
