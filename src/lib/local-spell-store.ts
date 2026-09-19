export const SPELL_STORAGE_KEY="serrian-tide:prototype:spells:v1";
export type LocalSpell={
 id:number;characterId:number;name:string;tradition:string;castingSystem:string;description:string;flavorLine:string;constructionNotes:string;
 baseMana:number;spellMastery:number;baseCombatTime:number;outOfCombat:boolean;progressive:boolean;containerType:string;range:number|null;rangeDescription:string;
 shape:string;multiTarget:boolean;additionalTargets:number|null;duration:string;healingApplication:string;inSpellbook:boolean;createdAt:string;updatedAt:string;
};
export function readSpells():LocalSpell[]{if(typeof window==="undefined")return[];try{const v=JSON.parse(window.localStorage.getItem(SPELL_STORAGE_KEY)??"[]");return Array.isArray(v)?v:[]}catch{return[]}}
export function writeSpells(rows:LocalSpell[]){window.localStorage.setItem(SPELL_STORAGE_KEY,JSON.stringify(rows))}
export function newSpell(characterId:number):LocalSpell{const now=new Date().toISOString();return{id:0,characterId,name:"",tradition:"Spellcraft",castingSystem:"Spellcraft",description:"",flavorLine:"",constructionNotes:"",baseMana:0,spellMastery:0,baseCombatTime:0,outOfCombat:false,progressive:false,containerType:"",range:null,rangeDescription:"",shape:"",multiTarget:false,additionalTargets:null,duration:"",healingApplication:"",inSpellbook:false,createdAt:now,updatedAt:now}}
