import { ArchiveWorkspaceShell } from "@/components/archive-workspace-shell";
import "./skills.css";

export default function SkillsPage() {
  return <ArchiveWorkspaceShell
    pageClass="" workspaceClass="" brandClass=""
    breadcrumb="THE HEAVENS / SKILLS" title="Skills" libraryTitle="Skill Library"
    newLabel="New Skill" searchPlaceholder="Search name, path, or description"
    filters={[{ label: "Attribute", options: ["STR", "DEX", "CON", "INT", "WIS", "CHR"] }, { label: "Tier", options: ["1", "2", "3"] }]}
    countLabel="skills" emptyEyebrow="SKILL EDITOR"
    emptyTitle="Select a Skill or begin a new one."
    emptyDescription="Skill hierarchy, relationships, governing Attributes, and specialized construction open here."
  />;
}
