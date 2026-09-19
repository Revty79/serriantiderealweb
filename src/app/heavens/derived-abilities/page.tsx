import { DesignWorkspaceShell, type DesignTab } from "@/components/design-workspace-shell";
import "../skills/skills.css";
import "./derived-abilities.css";
import "../design-mode.css";

const tabs: DesignTab[] = [
  {id:"definition",label:"Definition",fields:[
    {key:"name",label:"Name",wide:true},{key:"description",label:"Description",type:"textarea",wide:true},
    {key:"acquisition",label:"Acquisition Type",type:"select",options:["automatic","purchased","granted"]},{key:"activation",label:"Activation Type",type:"select",options:["passive","active","triggered"]},
    {key:"rules",label:"Rules Text",type:"textarea",wide:true},
  ]},
  {id:"requirements",label:"Requirements",fields:[
    {key:"reqType",label:"Requirement Type",type:"select",options:["attribute","skill","derived-ability","manual"]},{key:"attribute",label:"Attribute",type:"select",options:["STR","DEX","CON","INT","WIS","CHR"]},
    {key:"operator",label:"Operator",type:"select",options:[">=",">","=","<=","<","possessed"]},{key:"value",label:"Value",type:"number"},
    {key:"skill",label:"Skill"},{key:"requiredSkill",label:"Required Skill #",type:"number"},{key:"requiredAbility",label:"Derived Ability"},
    {key:"possession",label:"Possession"},{key:"reqText",label:"Requirement Text",type:"textarea",wide:true},{key:"reqNotes",label:"Notes",type:"textarea",wide:true},
  ]},
  {id:"conditions",label:"Use Conditions",fields:[
    {key:"conditionType",label:"Condition Type"},{key:"comparison",label:"Comparison"},{key:"numeric",label:"Numeric Value",type:"number"},{key:"text",label:"Text Value"},{key:"conditionNotes",label:"Notes",type:"textarea",wide:true},
  ]},
  {id:"costs",label:"Costs",fields:[
    {key:"costType",label:"Cost Type"},{key:"amount",label:"Amount",type:"number"},{key:"resourceKey",label:"Resource Key"},{key:"costNotes",label:"Notes",type:"textarea",wide:true},
  ]},
  {id:"limits",label:"Limits & Recharge",fields:[
    {key:"maxUses",label:"Maximum Uses",type:"number"},{key:"refreshScope",label:"Refresh Scope"},{key:"refreshEvent",label:"Refresh Event Key"},{key:"limitNotes",label:"Notes",type:"textarea",wide:true},
  ]},
];

export default function DerivedAbilitiesPage(){return <DesignWorkspaceShell pageClass="derived-abilities-page" workspaceClass="derived-abilities-workspace" brandClass="derived-ability-brand" breadcrumb="THE HEAVENS / DERIVED ABILITIES" title="Derived Abilities" libraryTitle="Derived Ability Library" newLabel="New Ability" searchPlaceholder="Search name, description, or Rules Text" libraryFilters={[{label:"Acquisition",options:["Automatic","Purchased","Granted"]},{label:"Activation",options:["Passive","Active","Triggered"]}]} countLabel="abilities" tabs={tabs} storageKey="serrian-tide:prototype:derived-abilities:v1"/>;}
