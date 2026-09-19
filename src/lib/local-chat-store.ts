export const CHAT_STORAGE_KEY="serrian-tide:prototype:chat:v1";
export type LocalChatMessage={id:number;roomId:string;senderUserId:string;senderName:string;content:string;createdAt:string};
export type LocalDirectConversation={id:string;userIds:string[];label:string;createdAt:string};
export type LocalChatStore={messages:LocalChatMessage[];directConversations:LocalDirectConversation[]};
export function readChat():LocalChatStore{if(typeof window==="undefined")return{messages:[],directConversations:[]};try{const p=JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY)??"{}");return{messages:Array.isArray(p.messages)?p.messages:[],directConversations:Array.isArray(p.directConversations)?p.directConversations:[]}}catch{return{messages:[],directConversations:[]}}}
export function writeChat(store:LocalChatStore){localStorage.setItem(CHAT_STORAGE_KEY,JSON.stringify(store))}
