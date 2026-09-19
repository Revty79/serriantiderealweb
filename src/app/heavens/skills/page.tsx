import { DesignWorkspaceShell, type DesignTab } from "@/components/design-workspace-shell";
import "./skills.css";
import "../design-mode.css";

const tabs: DesignTab[] = [
  {id:"core",label:"Core Details",intro:"Universal information shared by every Serrian Tide Skill.",fields:[
    {key:"name",label:"Name *",wide:true},{key:"classification",label:"Classification",type:"select",options:["standard","sphere","spell","discipline","psionic skill","resonance","reverberation","magic access","magic regeneration","magic stabalization","special ability"]},
    {key:"tier",label:"Tier",type:"number"},{key:"primary",label:"Primary Attribute",type:"select",options:["STR","DEX","CON","INT","WIS","CHR"]},{key:"secondary",label:"Secondary Attribute",type:"select",options:["STR","DEX","CON","INT","WIS","CHR"]},
    {key:"definition",label:"Definition",type:"textarea",wide:true},
  ]},
  {id:"pathing",label:"Pathing",fields:[
    {key:"parentSearch",label:"Find an exact parent at any depth",wide:true},{key:"parentSkill",label:"Matching Skill identity",type:"select",options:[]},
    {key:"relationship",label:"Relationship",type:"select",options:["Parent","Child","Alternative Path"]},
  ],note:"This mirrors the old lineage/path editor controls. Stored path relationships will be wired after the new Skill schema is settled."},
  {id:"construction",label:"Construction",fields:[
    {key:"tradition",label:"Tradition",type:"select",options:["Spellcraft","Talismanism","Faith","Psyonics","Bardic Resonance"]},
    {key:"spellDescription",label:"Spell Description",type:"textarea",wide:true},{key:"flavor",label:"Flavor Line",wide:true},{key:"constructionNotes",label:"Construction Notes",type:"textarea",wide:true},
    {key:"baseMana",label:"Base Mana",type:"number"},{key:"mastery",label:"Spell Mastery",type:"number"},{key:"combatTime",label:"Base Combat Time",type:"number"},
    {key:"outOfCombat",label:"Out of Combat",type:"checkbox"},{key:"progressive",label:"Attach Progressive Spell behavior",type:"checkbox"},
    {key:"containerType",label:"Container Type"},{key:"range",label:"Range",type:"number"},{key:"rangeDescription",label:"Range description"},
    {key:"shape",label:"Shape"},{key:"multiTarget",label:"Multi-Target",type:"checkbox"},{key:"additionalTargets",label:"Additional targets",type:"number"},
    {key:"duration",label:"Duration"},{key:"healingApplication",label:"Healing Application"},
  ]},
  {id:"preview",label:"Preview",note:"The old page renders the complete Skill and construction preview here."},
];

export default function SkillsPage(){return <DesignWorkspaceShell pageClass="" workspaceClass="" brandClass="" breadcrumb="THE HEAVENS / SKILLS" title="Skills" libraryTitle="Skill Library" newLabel="New Skill" searchPlaceholder="Search name, path, or description" libraryFilters={[{label:"Attribute",options:["STR","DEX","CON","INT","WIS","CHR"]},{label:"Tier",options:["1","2","3"]}]} countLabel="skills" tabs={tabs} storageKey="serrian-tide:prototype:skills:v1"/>;}
