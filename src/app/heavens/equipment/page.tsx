import { ArchiveWorkspaceShell } from "@/components/archive-workspace-shell";
import "../skills/skills.css";
import "../items/items.css";
import "../items/item-runtime.css";

export default function EquipmentPage() {
  return <ArchiveWorkspaceShell
    pageClass="items-page" workspaceClass="items-workspace" brandClass="item-brand"
    breadcrumb="THE HEAVENS / EQUIPMENT" title="Equipment" libraryTitle="Equipment Library"
    newLabel="New Equipment" searchPlaceholder="Name or canonical ID"
    filters={[
      { label: "Group", options: ["Weapon", "Armor", "Ammunition", "Magazine", "Other"] },
      { label: "Record Type", options: [] }, { label: "Category", options: [] }, { label: "Tag", options: [] }
    ]}
    countLabel="records" emptyEyebrow="EQUIPMENT EDITOR"
    emptyTitle="Select Equipment or begin a new definition."
    emptyDescription="Overview, properties, abilities, weapon data, ammunition, magazines, armor, and runtime behavior open here."
  />;
}
