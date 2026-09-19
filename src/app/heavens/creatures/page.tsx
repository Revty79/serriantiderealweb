import { ArchiveWorkspaceShell } from "@/components/archive-workspace-shell";
import "../skills/skills.css";
import "./creatures.css";

export default function CreaturesPage() {
  return <ArchiveWorkspaceShell
    pageClass="creatures-page" workspaceClass="creatures-workspace" brandClass="creature-brand"
    breadcrumb="THE HEAVENS / CREATURES" title="Creatures" libraryTitle="Bestiary"
    newLabel="New Creature" searchPlaceholder="Search by name"
    filters={[
      { label: "Family", options: [] }, { label: "Type", options: [] },
      { label: "Size", options: ["Tiny", "Small", "Medium", "Large", "Huge"] }, { label: "CR", options: [] }
    ]}
    countLabel="creatures" emptyEyebrow="CREATURE EDITOR"
    emptyTitle="Select a Creature or begin a new one."
    emptyDescription="Creature identity, stats, anatomy, attacks, defenses, Skills, abilities, variants, and Challenge Rating open here."
  />;
}
