export const USER_STORAGE_KEY="serrian-tide:prototype:users:v1";
export type LocalUser={id:string;name:string;username:string;email:string;roles:Array<"admin"|"god"|"player">;createdAt:string};
const seed:LocalUser={id:"prototype-admin",name:"Prototype Admin",username:"adventurer",email:"prototype@serriantide.local",roles:["admin","god","player"],createdAt:new Date(0).toISOString()};
export function readUsers():LocalUser[]{if(typeof window==="undefined")return[seed];try{const raw=window.localStorage.getItem(USER_STORAGE_KEY);if(!raw)return[seed];const parsed=JSON.parse(raw);return Array.isArray(parsed)&&parsed.length?parsed:[seed]}catch{return[seed]}}
export function writeUsers(rows:LocalUser[]){window.localStorage.setItem(USER_STORAGE_KEY,JSON.stringify(rows))}
