export const SKILL_STORAGE_KEY="serrian-tide:prototype:skills:v2";
export type LocalSkillRelationship={parentSkillId:number;parentSkillName:string;relationship:string};
export type LocalProgressiveTier={id:number;name:string;condition:string;description:string;flavorChange:string;notes:string};
export type LocalSpellConstruction={
 tradition:string;spellDescription:string;flavorLine:string;constructionNotes:string;baseMana:number|null;spellMastery:number|null;baseCombatTime:number|null;
 outOfCombat:boolean;progressive:boolean;containerType:string;range:number|null;rangeDescription:string;shape:string;multiTarget:boolean;additionalTargets:number|null;
 duration:string;healingApplication:string;tiers:LocalProgressiveTier[];
};
export type LocalSkill={
 id:number;name:string;classification:string;tier:number|null;primaryAttribute:string|null;secondaryAttribute:string|null;definition:string;
 relationships:LocalSkillRelationship[];construction:LocalSpellConstruction|null;archivedAt:string|null;archiveReason:string;createdAt:string;updatedAt:string;
};
export function readSkills():LocalSkill[]{if(typeof window==="undefined")return[];try{const p=JSON.parse(localStorage.getItem(SKILL_STORAGE_KEY)??"[]");return Array.isArray(p)?p:[]}catch{return[]}}
export function writeSkills(rows:LocalSkill[]){localStorage.setItem(SKILL_STORAGE_KEY,JSON.stringify(rows))}
export function blankSkill():LocalSkill{const now=new Date().toISOString();return{id:0,name:"",classification:"standard",tier:1,primaryAttribute:"DEX",secondaryAttribute:null,definition:"",relationships:[],construction:null,archivedAt:null,archiveReason:"",createdAt:now,updatedAt:now}}
export function blankConstruction():LocalSpellConstruction{return{tradition:"Spellcraft",spellDescription:"",flavorLine:"",constructionNotes:"",baseMana:null,spellMastery:null,baseCombatTime:null,outOfCombat:false,progressive:false,containerType:"",range:null,rangeDescription:"",shape:"",multiTarget:false,additionalTargets:null,duration:"",healingApplication:"",tiers:[]}}
