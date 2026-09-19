import { DesignWorkspaceShell, type DesignTab } from "@/components/design-workspace-shell";
import "../skills/skills.css";
import "./races.css";
import "../design-mode.css";

const tabs: DesignTab[] = [
  { id: "overview", label: "Overview", intro: "Identity, physical description, age, and broad Race information.", fields: [
    { key:"name", label:"Name", wide:true }, { key:"size", label:"Size", type:"select", options:["Tiny","Small","Medium","Large","Huge"] },
    { key:"baseMagic", label:"Base Magic", type:"number" }, { key:"ageText", label:"Age Range Text" }, { key:"ageMin", label:"Minimum Age", type:"number" },
    { key:"ageMax", label:"Maximum Age", type:"number" }, { key:"physicalCharacteristics", label:"Physical Characteristics", type:"textarea", wide:true },
    { key:"physicalDescription", label:"Physical Description", type:"textarea", wide:true }, { key:"legacyDescription", label:"Legacy Description", type:"textarea", wide:true },
  ]},
  { id:"mechanics", label:"Attributes & Movement", fields:[
    {key:"strCap",label:"STR Attribute Cap",type:"number"},{key:"dexCap",label:"DEX Attribute Cap",type:"number"},{key:"conCap",label:"CON Attribute Cap",type:"number"},
    {key:"intCap",label:"INT Attribute Cap",type:"number"},{key:"wisCap",label:"WIS Attribute Cap",type:"number"},{key:"chrCap",label:"CHR Attribute Cap",type:"number"},
    {key:"movementMode",label:"Movement Mode"},{key:"movementBase",label:"Movement Base Value",type:"number"},{key:"movementNotes",label:"Movement Notes",wide:true},
  ], note:"The old editor supports multiple Attribute Cap and Movement Mode rows. This draft shows the fields used by each row."},
  { id:"quirk", label:"Quirk", fields:[
    {key:"quirkName",label:"Racial Quirk Name",wide:true},{key:"quirkSuccess",label:"Success Effect",type:"textarea",wide:true},{key:"quirkFailure",label:"Failure Effect",type:"textarea",wide:true},
  ]},
  { id:"skills", label:"Skills & Abilities", fields:[
    {key:"skillSearch",label:"Search"},{key:"classification",label:"Classification",type:"select",options:["standard","special ability","sphere","spell","discipline","psionic skill","resonance","reverberation"]},
    {key:"matchingSkill",label:"Matching Skills",type:"select",options:[]},{key:"linkType",label:"Link Type",type:"select",options:["Skill","Granted"]},{key:"linkValue",label:"Value",type:"number"},
  ]},
  { id:"culture", label:"Culture & Play", fields:[
    {key:"languages",label:"Common Languages Known",type:"textarea",wide:true},{key:"archetypes",label:"Common Archetypes",type:"textarea",wide:true},
    {key:"genre",label:"Genre Examples",type:"textarea",wide:true},{key:"mindset",label:"Cultural Mindset",type:"textarea",wide:true},{key:"magicOutlook",label:"Outlook on Magic",type:"textarea",wide:true},
  ]},
  { id:"preview", label:"Preview", note:"The old page renders a read-only Race preview here. We can redesign that preview once the authoring fields are settled." },
];

export default function RacesPage(){return <DesignWorkspaceShell pageClass="races-page" workspaceClass="races-workspace" brandClass="race-brand" breadcrumb="THE HEAVENS / RACES" title="Races" libraryTitle="Race Library" newLabel="New Race" searchPlaceholder="Search by name" libraryFilters={[{label:"Size",options:["Tiny","Small","Medium","Large","Huge"]}]} countLabel="races" tabs={tabs}/>;}
