import "../../../../characters/character.css";
import "./advance.css";
import { LocalAdvanceWorkspace } from "./local-advance-workspace";
export default async function AdvancePage({params}:{params:Promise<{characterId:string}>}){const {characterId}=await params;return <LocalAdvanceWorkspace characterId={Number(characterId)}/>;}
