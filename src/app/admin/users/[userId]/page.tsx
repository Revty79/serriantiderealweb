import { LocalUserDetail } from "./local-user-detail";
export default async function UserPage({params}:{params:Promise<{userId:string}>}){const {userId}=await params;return <LocalUserDetail userId={userId}/>;}
