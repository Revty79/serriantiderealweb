import { ArchiveWorkspaceShell } from "@/components/archive-workspace-shell";
import "../skills/skills.css";
import "./races.css";

export default function RacesPage() {
  return <ArchiveWorkspaceShell
    pageClass="races-page" workspaceClass="races-workspace" brandClass="race-brand"
    breadcrumb="THE HEAVENS / RACES" title="Races" libraryTitle="Race Library"
    newLabel="New Race" searchPlaceholder="Search by name"
    filters={[{ label: "Size", options: ["Tiny", "Small", "Medium", "Large", "Huge"] }]}
    countLabel="races" emptyEyebrow="RACE EDITOR"
    emptyTitle="Select a Race or begin a new one."
    emptyDescription="Race identity, Attributes, movement, quirks, Skills, culture, and preview open here."
  />;
}
