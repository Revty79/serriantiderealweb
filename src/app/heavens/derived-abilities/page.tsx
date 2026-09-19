import { ArchiveWorkspaceShell } from "@/components/archive-workspace-shell";
import "../skills/skills.css";
import "./derived-abilities.css";

export default function DerivedAbilitiesPage() {
  return <ArchiveWorkspaceShell
    pageClass="derived-abilities-page" workspaceClass="derived-abilities-workspace" brandClass="derived-ability-brand"
    breadcrumb="THE HEAVENS / DERIVED ABILITIES" title="Derived Abilities" libraryTitle="Derived Ability Library"
    newLabel="New Ability" searchPlaceholder="Search name, description, or Rules Text"
    filters={[{ label: "Acquisition", options: ["Automatic", "Purchased", "Granted"] }, { label: "Activation", options: ["Passive", "Active", "Triggered"] }]}
    countLabel="abilities" emptyEyebrow="DERIVED ABILITY CONSTRUCTOR"
    emptyTitle="Select an ability or create a new definition."
    emptyDescription="Author Attributes, Skill requirements, prerequisites, use conditions, costs, limits, and mechanical effects."
  />;
}
