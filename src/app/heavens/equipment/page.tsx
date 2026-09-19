import { DesignWorkspaceShell, type DesignTab } from "@/components/design-workspace-shell";
import "../skills/skills.css"; import "../items/items.css"; import "../items/item-runtime.css"; import "../design-mode.css";
const tabs: DesignTab[] = [
  {id:"overview",label:"Overview",fields:[
    {key:"name",label:"Name",wide:true},{key:"magical",label:"Magical Item",type:"checkbox"},{key:"canonical",label:"Canonical ID",disabled:true},
    {key:"equipmentGroup",label:"Equipment Group",type:"select",options:["general","weapon","armor","ammunition","magazine"]},{key:"recordType",label:"Record Type"},{key:"family",label:"Family"},
    {key:"category",label:"Category"},{key:"subtype",label:"Subtype"},{key:"credits",label:"Credits",type:"number"},{key:"priceBasis",label:"Price Basis"},
    {key:"weight",label:"Weight",type:"number"},{key:"weightUnit",label:"Weight Unit"},{key:"size",label:"Size"},{key:"durability",label:"Durability",type:"number"},
    {key:"description",label:"Description",type:"textarea",wide:true},
  ]},
  {id:"properties",label:"Properties",fields:[
    {key:"propertyName",label:"Property Name"},{key:"propertyValue",label:"Value"},{key:"unit",label:"Unit"},{key:"quantity",label:"Quantity",type:"number"},
    {key:"relation",label:"Relation",type:"select",options:["None","Related Item","Related Creature"]},{key:"findRelation",label:"Find Relation"},{key:"relatedItem",label:"Related Item"},
    {key:"relatedCreature",label:"Related Creature"},{key:"propertyNotes",label:"Notes",type:"textarea",wide:true},
  ]},
  {id:"abilities",label:"Abilities",fields:[
    {key:"useMode",label:"Use Mode",type:"select",options:["none","consume-item","charges","unlimited"]},{key:"activationLabel",label:"Activation Label"},
    {key:"quantityUse",label:"Quantity Consumed Per Use",type:"number"},{key:"maxCharges",label:"Maximum Charges",type:"number"},{key:"chargesUse",label:"Charges Per Use",type:"number"},
    {key:"recharge",label:"Recharge Rule / Notes",type:"textarea",wide:true},{key:"useNotes",label:"Use Notes",type:"textarea",wide:true},
    {key:"effect",label:"Effect"},{key:"effectAmount",label:"Amount",type:"number"},{key:"application",label:"Application"},{key:"condition",label:"Condition Name"},
    {key:"duration",label:"Duration"},{key:"durationCount",label:"Duration Count",type:"number"},{key:"effectLabel",label:"Label"},{key:"channel",label:"Channel"},
    {key:"attribute",label:"Attribute"},{key:"skill",label:"Skill"},{key:"movement",label:"Movement Mode"},{key:"title",label:"Title"},
    {key:"equipmentState",label:"Required Equipment State"},{key:"passiveEffect",label:"Passive Effect"},{key:"lifecycle",label:"Lifecycle"},{key:"instructions",label:"Instructions",type:"textarea",wide:true},
  ]},
  {id:"weapon",label:"Weapon / Ammunition",fields:[
    {key:"profileRecordType",label:"Profile Record Type"},{key:"weaponType",label:"Weapon Type"},{key:"handedness",label:"Handedness"},
    {key:"damageSource",label:"Damage Source"},{key:"damage",label:"Damage",type:"number"},{key:"damageType",label:"Damage Type"},{key:"initiative",label:"Initiative Cost",type:"number"},
    {key:"rangeMode",label:"Range Mode"},{key:"distanceUnit",label:"Distance Unit"},{key:"reach",label:"Reach",type:"number"},{key:"short",label:"Short Range",type:"number"},
    {key:"medium",label:"Medium Range",type:"number"},{key:"long",label:"Long Range",type:"number"},{key:"rof",label:"Rate of Fire"},
    {key:"reloadType",label:"Reload Type"},{key:"capacity",label:"Capacity (Rounds)",type:"number"},{key:"drawInit",label:"Draw Initiative",type:"number"},
    {key:"unloadInit",label:"Unload Initiative",type:"number"},{key:"changeMode",label:"Change Mode Initiative",type:"number"},{key:"cycling",label:"Cycling Initiative Cost",type:"number"},
    {key:"recoil",label:"Recoil Reset Initiative Cost",type:"number"},{key:"cadence",label:"Delivery Cadence"},{key:"roundsCadence",label:"Rounds Per Cadence",type:"number"},
    {key:"compatibility",label:"Compatibility",type:"textarea",wide:true},{key:"weaponRules",label:"Weapon Rules",type:"textarea",wide:true},
  ]},
  {id:"magazine",label:"Magazine",fields:[
    {key:"magCapacity",label:"Capacity (Rounds)",type:"number"},{key:"fillInit",label:"Fill Initiative per Round",type:"number"},{key:"findAmmo",label:"Find Ammunition"},{key:"ammoItem",label:"Ammunition Item"},
  ]},
  {id:"armor",label:"Armor",fields:[
    {key:"armorType",label:"Armor Type"},{key:"baseSoak",label:"Base Soak",type:"number"},{key:"coverage",label:"Coverage",type:"textarea",wide:true},
    {key:"damageModifier",label:"Damage Modifier Source"},{key:"armorRules",label:"Armor Rules",type:"textarea",wide:true},
  ]},
  {id:"tags",label:"Tags",fields:[{key:"group",label:"Group"},{key:"tag",label:"Tag"}]},
  {id:"variants",label:"Variants",fields:[{key:"variantOf",label:"Variant Of"},{key:"variantName",label:"Variant Name"}]},
  {id:"preview",label:"Preview",note:"The old workspace renders the complete Item preview here."}
];
export default function EquipmentPage(){return <DesignWorkspaceShell pageClass="items-page" workspaceClass="items-workspace" brandClass="item-brand" breadcrumb="THE HEAVENS / EQUIPMENT" title="Equipment" libraryTitle="Equipment Library" newLabel="New Equipment" searchPlaceholder="Name or canonical ID" libraryFilters={[{label:"Group",options:["Weapon","Armor","Ammunition","Magazine","Other"]},{label:"Record Type",options:[]},{label:"Category",options:[]},{label:"Tag",options:[]}]} countLabel="records" tabs={tabs} storageKey="serrian-tide:prototype:equipment:v1"/>;}
