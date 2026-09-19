import "./spellbook.css";import { LocalSpellbook } from "./local-spellbook";
export default async function SpellbookPage({params}:{params:Promise<{characterId:string}>}){const {characterId}=await params;return <LocalSpellbook characterId={Number(characterId)}/>;}
