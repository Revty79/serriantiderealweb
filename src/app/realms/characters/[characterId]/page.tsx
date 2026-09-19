import "../../../characters/character.css";
import { LocalCharacterEditor } from "../local-character-editor";

export default async function CharacterPage({params}:{params:Promise<{characterId:string}>}) {
  const {characterId}=await params;
  const id=Number(characterId);
  return <LocalCharacterEditor characterId={Number.isInteger(id)&&id>0?id:null} campaignId={null}/>;
}
