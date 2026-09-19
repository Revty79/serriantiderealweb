import { DesignWorkspaceShell, type DesignTab } from "@/components/design-workspace-shell";
import "../skills/skills.css"; import "./creatures.css"; import "../design-mode.css";
const tabs: DesignTab[] = [
  {id:"overview",label:"Overview",fields:[
    {key:"canonicalName",label:"Canonical Name",wide:true},{key:"size",label:"Size",type:"select",options:["Tiny","Small","Medium","Large","Huge"]},{key:"family",label:"Family"},
    {key:"creatureType",label:"Creature Type"},{key:"derivedFrom",label:"Derived From"},{key:"description",label:"Description",type:"textarea",wide:true},
    {key:"behavior",label:"Typical Behavior",type:"textarea",wide:true},{key:"habitat",label:"Habitat & Ecology",type:"textarea",wide:true},{key:"notes",label:"Notes",type:"textarea",wide:true},
  ]},
  {id:"stats",label:"Attributes & Movement",fields:[
    {key:"str",label:"Strength",type:"number"},{key:"dex",label:"Dexterity",type:"number"},{key:"con",label:"Constitution",type:"number"},
    {key:"int",label:"Intelligence",type:"number"},{key:"wis",label:"Wisdom",type:"number"},{key:"chr",label:"Charisma",type:"number"},
    {key:"hpSteps",label:"HP Multiplier Steps",type:"number"},{key:"moveSteps",label:"Base Movement Steps",type:"number"},{key:"magicSteps",label:"Base Magic Steps",type:"number"},
    {key:"moveMode",label:"Movement Mode"},{key:"moveValue",label:"Movement Value",type:"number"},{key:"moveNotes",label:"Movement Notes",wide:true},
  ]},
  {id:"hp",label:"HP & Hit Locations",fields:[
    {key:"totalHp",label:"Total HP",type:"number"},{key:"rollNum",label:"Roll #",type:"number"},{key:"location",label:"Location Name"},{key:"bodyParts",label:"Body Parts"},
    {key:"hpPool",label:"HP Pool"},{key:"naturalArmor",label:"Natural Armor"},{key:"soak",label:"Soak",type:"number"},{key:"locationEffect",label:"Location Effect",type:"textarea",wide:true},
  ]},
  {id:"combat",label:"Attacks & Skills",fields:[
    {key:"attackName",label:"Attack Name"},{key:"attackPercent",label:"Attack %",type:"number"},{key:"attackDamage",label:"Damage",type:"number"},{key:"attackDamageType",label:"Damage Type"},
    {key:"rangeReach",label:"Range / Reach"},{key:"requiredAnatomy",label:"Required Anatomy"},{key:"usesRecharge",label:"Uses / Recharge"},
    {key:"requirements",label:"Requirements",wide:true},{key:"specialEffect",label:"Special Effect",type:"textarea",wide:true},{key:"attackNotes",label:"Notes",type:"textarea",wide:true},
    {key:"skillSearch",label:"Search"},{key:"matchingSkill",label:"Matching Skill",type:"select",options:[]},{key:"skillRank",label:"Skill Rank"},{key:"skillNotes",label:"Skill Notes"},
  ]},
  {id:"special",label:"Abilities & Defenses",fields:[
    {key:"abilityName",label:"Ability Name"},{key:"abilityType",label:"Type"},{key:"activation",label:"Activation"},{key:"crImpact",label:"CR Impact"},
    {key:"abilityRecharge",label:"Uses / Recharge"},{key:"abilityRequirements",label:"Requirements",wide:true},{key:"abilityDescription",label:"Description",type:"textarea",wide:true},
    {key:"mechanicalNotes",label:"Mechanical Notes (Legacy Text)",type:"textarea",wide:true},{key:"abilityNotes",label:"Notes",type:"textarea",wide:true},
    {key:"defenseType",label:"Defense Type"},{key:"against",label:"Against"},{key:"defenseValue",label:"Value"},{key:"defenseCrImpact",label:"Defense CR Impact"},
  ]},
  {id:"cr",label:"Variants & CR",fields:[
    {key:"manualAdjustment",label:"Manual CR Adjustment",type:"number"},{key:"adjustmentReason",label:"Adjustment Reason",type:"textarea",wide:true},
    {key:"cr",label:"CR",type:"number"},{key:"calculatedCr",label:"Calculated CR",type:"number"},{key:"killXp",label:"Kill XP",type:"number"},
  ]},
  {id:"preview",label:"Preview",note:"The old workspace renders the full Creature preview here."},
];
export default function CreaturesPage(){return <DesignWorkspaceShell pageClass="creatures-page" workspaceClass="creatures-workspace" brandClass="creature-brand" breadcrumb="THE HEAVENS / CREATURES" title="Creatures" libraryTitle="Bestiary" newLabel="New Creature" searchPlaceholder="Search by name" libraryFilters={[{label:"Family",options:[]},{label:"Type",options:[]},{label:"Size",options:["Tiny","Small","Medium","Large","Huge"]},{label:"CR",options:[]}]} countLabel="creatures" tabs={tabs} storageKey="serrian-tide:prototype:creatures:v1" nameKey="canonicalName"/>;}
