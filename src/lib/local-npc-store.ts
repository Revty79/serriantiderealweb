export const NPC_STORAGE_KEY="serrian-tide:prototype:npcs:v1";
export type LocalNpc={
 id:number;campaignId:number;name:string;roleLabel:string;origin:"race"|"creature";sourceId:number;sourceName:string;buildMode:"simple"|"detailed";
 personalityDescription:string;notes:string;attributes:{STR:number;DEX:number;CON:number;INT:number;WIS:number;CHR:number};
 personality:string;goals:string;secrets:string;backstory:string;motivations:string;archivedAt:string|null;archiveReason:string;createdAt:string;updatedAt:string;
};
export function readNpcs():LocalNpc[]{if(typeof window==="undefined")return[];try{const p=JSON.parse(localStorage.getItem(NPC_STORAGE_KEY)??"[]");return Array.isArray(p)?p:[]}catch{return[]}}
export function writeNpcs(rows:LocalNpc[]){localStorage.setItem(NPC_STORAGE_KEY,JSON.stringify(rows))}
export function blankNpc(campaignId=0):LocalNpc{const now=new Date().toISOString();return{id:0,campaignId,name:"",roleLabel:"",origin:"race",sourceId:0,sourceName:"",buildMode:"simple",personalityDescription:"",notes:"",attributes:{STR:0,DEX:0,CON:0,INT:0,WIS:0,CHR:0},personality:"",goals:"",secrets:"",backstory:"",motivations:"",archivedAt:null,archiveReason:"",createdAt:now,updatedAt:now}}
