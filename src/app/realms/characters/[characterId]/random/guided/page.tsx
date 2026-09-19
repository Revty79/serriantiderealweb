import "./random-character.css";import { LocalGuidedRandom } from "./local-guided-random";
export default async function GuidedRandomPage({params}:{params:Promise<{characterId:string}>}){const {characterId}=await params;return <LocalGuidedRandom characterId={Number(characterId)}/>;}
