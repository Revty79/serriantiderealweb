import "../../../characters/character.css";
import { LocalCharacterEditor } from "../local-character-editor";

export default async function NewCharacterPage({searchParams}:{searchParams:Promise<{campaign?:string;player?:string}>}) {
  const query=await searchParams;
  const campaignId=Number(query.campaign);
  return <LocalCharacterEditor characterId={null} campaignId={Number.isInteger(campaignId)&&campaignId>0?campaignId:null} playerUserId={query.player??null}/>;
}
