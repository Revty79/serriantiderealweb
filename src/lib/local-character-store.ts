export const CHARACTER_STORAGE_KEY = "serrian-tide:prototype:characters:v1";
export const CAMPAIGN_STORAGE_KEY = "serrian-tide:prototype:campaigns:v1";
export const RACE_STORAGE_KEY = "serrian-tide:prototype:races:v1";

export type LocalCharacter = {
  id: number;
  campaignId: number;
  playerUserId: string;
  name: string;
  raceId: number | null;
  age: number | null;
  sex: string;
  heightFeet: number | null;
  heightInches: number | null;
  weight: number | null;
  skinColor: string;
  eyeColor: string;
  hairColor: string;
  deity: string;
  definingMarks: string;
  personality: string;
  goals: string;
  secrets: string;
  backstory: string;
  motivations: string;
  fatePoints: number | null;
  attributes: Record<"STR"|"DEX"|"CON"|"INT"|"WIS"|"CHR", number>;
  skills: Array<{ id:number; name:string; attribute:string; points:number; rank:number }>;
  items: Array<{ id:number; catalogKey?:string; name:string; category:string; quantity:number; unitCost:number }>;
  fame: number;
  experience: number;
  totalExperience: number;
  quintessence: number;
  totalQuintessence: number;
  hpMultiplierSteps: number;
  baseMovementSteps: number;
  baseMagicSteps: number;
  creditsRemaining: number;
  archivedAt: string | null;
  archiveReason: string;
  createdAt: string;
  updatedAt: string;
};

export type LocalCampaignSummary = {
  id:number;
  name:string;
  startingCreditAmount:number;
  assignedFatePoints:number|null;
  fatePointMethod:"Assigned"|"Rolled";
  campaignRaceIds:number[];
  allowedRaceIds:number[];
  inventoryTagKeys?:string[];
  inventoryItemKeys?:string[];
  archivedAt:string|null;
};

export type LocalRaceSummary = {
  id:number;
  core:{name:string;size:string;baseMagic:number|null};
  archivedAt:string|null;
};

export function readJsonArray<T>(key:string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed=JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export function readCharacters(): LocalCharacter[] {
  return readJsonArray<LocalCharacter>(CHARACTER_STORAGE_KEY);
}

export function writeCharacters(rows: LocalCharacter[]) {
  window.localStorage.setItem(CHARACTER_STORAGE_KEY, JSON.stringify(rows));
}

export function readCampaigns(): LocalCampaignSummary[] {
  return readJsonArray<LocalCampaignSummary>(CAMPAIGN_STORAGE_KEY);
}

export function readRaces(): LocalRaceSummary[] {
  return readJsonArray<LocalRaceSummary>(RACE_STORAGE_KEY);
}

export function newCharacter(campaignId:number): LocalCharacter {
  const now=new Date().toISOString();
  return {
    id:0,campaignId,playerUserId:"prototype-admin",name:"",raceId:null,age:null,sex:"",heightFeet:null,heightInches:null,weight:null,
    skinColor:"",eyeColor:"",hairColor:"",deity:"",definingMarks:"",
    personality:"",goals:"",secrets:"",backstory:"",motivations:"",
    fatePoints:null,
    attributes:{STR:0,DEX:0,CON:0,INT:0,WIS:0,CHR:0},
    skills:[
      {id:1,name:"Melee Weapons",attribute:"DEX",points:0,rank:0},
      {id:2,name:"Ranged Weapons",attribute:"DEX",points:0,rank:0},
      {id:3,name:"Hand to Hand Combat",attribute:"DEX",points:0,rank:0},
      {id:4,name:"Spellcraft",attribute:"INT",points:0,rank:0},
    ],
    items:[],
    fame:0,experience:0,totalExperience:0,quintessence:0,totalQuintessence:0,
    hpMultiplierSteps:0,baseMovementSteps:0,baseMagicSteps:0,creditsRemaining:0,
    archivedAt:null,archiveReason:"",createdAt:now,updatedAt:now,
  };
}
