import "./magic.css";import { LocalMagicWorkspace } from "./local-magic-workspace";
export default async function MagicPage({params}:{params:Promise<{characterId:string}>}){const {characterId}=await params;return <LocalMagicWorkspace characterId={Number(characterId)}/>;}
