import { ArchiveWorkspaceShell } from "@/components/archive-workspace-shell";
import "../skills/skills.css";
import "../items/items.css";
import "../items/item-runtime.css";

export default function InventoryPage() {
  return <ArchiveWorkspaceShell
    pageClass="items-page" workspaceClass="items-workspace" brandClass="item-brand"
    breadcrumb="THE HEAVENS / INVENTORY" title="Inventory" libraryTitle="Inventory Library"
    newLabel="New Item" searchPlaceholder="Name or canonical ID"
    filters={[{ label: "Record Type", options: [] }, { label: "Category", options: [] }, { label: "Tag", options: [] }]}
    countLabel="records" emptyEyebrow="ITEM EDITOR"
    emptyTitle="Select an Item or begin a new definition."
    emptyDescription="General Inventory content, properties, abilities, consumable behavior, and runtime use open here."
  />;
}
