"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { readSkills } from "@/lib/local-skill-store";

const RACE_SIZE_OPTIONS = [
  "Minuscule",
  "Tiny",
  "Small",
  "Medium",
  "Large",
  "Huge",
  "Gargantuan",
  "Colossal",
] as const;

type Tab = "overview" | "mechanics" | "quirk" | "skills" | "culture" | "preview";

type RaceDraft = {
  id?: number;
  core: {
    name: string;
    legacyDescription: string;
    physicalCharacteristics: string;
    physicalDescription: string;
    ageRangeText: string;
    ageMin: number | null;
    ageMax: number | null;
    size: string;
    baseMagic: number | null;
    racialQuirkName: string;
    quirkSuccessEffect: string;
    quirkFailureEffect: string;
    commonLanguagesKnown: string;
    commonArchetypes: string;
    genreExamples: string;
    culturalMindset: string;
    outlookOnMagic: string;
    sourceSystem: string | null;
    sourceExternalId: string | null;
  };
  attributeCaps: Array<{
    attributeKey: string;
    maxValue: number;
    sortOrder: number;
  }>;
  movementModes: Array<{
    movementMode: string;
    baseValue: number;
    notes: string;
    sortOrder: number;
  }>;
  skillLinks: Array<{
    skillId: number;
    skillName: string;
    skillClassification: string;
    linkType: string;
    value: number | null;
    sortOrder: number;
  }>;
};

type RaceAggregate = RaceDraft & {
  id: number;
  archivedAt: string | null;
  archiveReason: string;
  createdAt: string;
  updatedAt: string;
};

type RaceSummary = {
  id: number;
  name: string;
  size: string;
  ageRangeText: string;
  attributeCapCount: number;
  movementModeCount: number;
  skillLinkCount: number;
  archivedAt: string | null;
};

type RaceSkillCandidate = {
  id: number;
  name: string;
  classification: string;
  tier: number | null;
};

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "mechanics", label: "Attributes & Movement" },
  { id: "quirk", label: "Quirk" },
  { id: "skills", label: "Skills & Abilities" },
  { id: "culture", label: "Culture & Play" },
  { id: "preview", label: "Preview" },
];

const STANDARD_ATTRIBUTES = ["STR", "DEX", "CON", "INT", "WIS", "CHR"];
const STORAGE_KEY = "serrian-tide:prototype:races:v1";


function newRaceDraft(): RaceDraft {
  return {
    core: {
      name: "",
      legacyDescription: "",
      physicalCharacteristics: "",
      physicalDescription: "",
      ageRangeText: "",
      ageMin: null,
      ageMax: null,
      size: "Medium",
      baseMagic: null,
      racialQuirkName: "",
      quirkSuccessEffect: "",
      quirkFailureEffect: "",
      commonLanguagesKnown: "",
      commonArchetypes: "",
      genreExamples: "",
      culturalMindset: "",
      outlookOnMagic: "",
      sourceSystem: null,
      sourceExternalId: null,
    },
    attributeCaps: STANDARD_ATTRIBUTES.map((attributeKey, sortOrder) => ({
      attributeKey,
      maxValue: 50,
      sortOrder,
    })),
    movementModes: [],
    skillLinks: [],
  };
}

function readStore(): RaceAggregate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStore(rows: RaceAggregate[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

function summarize(row: RaceAggregate): RaceSummary {
  return {
    id: row.id,
    name: row.core.name,
    size: row.core.size,
    ageRangeText: row.core.ageRangeText,
    attributeCapCount: row.attributeCaps.length,
    movementModeCount: row.movementModes.length,
    skillLinkCount: row.skillLinks.length,
    archivedAt: row.archivedAt,
  };
}

function validateRace(input: RaceDraft) {
  if (!input.core.name.trim()) throw new Error("Race name is required.");
  if (input.core.ageMin !== null && input.core.ageMin < 0) throw new Error("Minimum Age cannot be negative.");
  if (input.core.ageMax !== null && input.core.ageMax < 0) throw new Error("Maximum Age cannot be negative.");
  if (
    input.core.ageMin !== null &&
    input.core.ageMax !== null &&
    input.core.ageMin > input.core.ageMax
  ) throw new Error("Minimum Age cannot exceed Maximum Age.");

  const keys = new Set<string>();
  for (const cap of input.attributeCaps) {
    const key = cap.attributeKey.trim().toLowerCase();
    if (!key) throw new Error("Every Attribute Cap needs an Attribute.");
    if (keys.has(key)) throw new Error(cap.attributeKey + " cannot be added twice.");
    keys.add(key);
  }

  for (const mode of input.movementModes) {
    if (!mode.movementMode.trim()) throw new Error("Every movement row needs a Movement Mode.");
  }
}

function saveLocalRace(input: RaceDraft): RaceAggregate {
  validateRace(input);
  const rows = readStore();
  const now = new Date().toISOString();

  if (input.id) {
    const index = rows.findIndex((row) => row.id === input.id);
    if (index < 0) throw new Error("That Race no longer exists.");
    const existing = rows[index]!;
    const saved: RaceAggregate = {
      ...input,
      id: existing.id,
      archivedAt: existing.archivedAt,
      archiveReason: existing.archiveReason,
      createdAt: existing.createdAt,
      updatedAt: now,
    };
    rows[index] = saved;
    writeStore(rows);
    return saved;
  }

  const id = rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
  const saved: RaceAggregate = {
    ...input,
    id,
    archivedAt: null,
    archiveReason: "",
    createdAt: now,
    updatedAt: now,
  };
  rows.push(saved);
  writeStore(rows);
  return saved;
}

function isRaceSkillEligible(candidate: RaceSkillCandidate) {
  return candidate.tier === 1 || candidate.classification.trim().toLowerCase() === "special ability";
}

function Field({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "race-field race-field--wide" : "race-field"}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export function RaceWorkspace() {
  const [search, setSearch] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [storeVersion, setStoreVersion] = useState(0);
  const [draft, setDraft] = useState<RaceDraft | RaceAggregate>(newRaceDraft());
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [dirty, setDirty] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    setStoreVersion((value) => value + 1);
  }, []);

  const library = useMemo(() => {
    void storeVersion;
    const query = search.trim().toLocaleLowerCase("en-US");
    return readStore()
      .filter((row) => Boolean(row.archivedAt) === showArchived)
      .filter((row) => !sizeFilter || row.core.size === sizeFilter)
      .filter((row) => !query || row.core.name.toLocaleLowerCase("en-US").includes(query))
      .sort((a, b) => a.core.name.localeCompare(b.core.name))
      .map(summarize);
  }, [search, sizeFilter, showArchived, storeVersion]);

  const isArchived = "archivedAt" in draft && Boolean(draft.archivedAt);

  function createNew() {
    if (dirty && !window.confirm("Discard the unsaved Race draft?")) return;
    setDraft(newRaceDraft());
    setActiveTab("overview");
    setDirty(false);
    setFeedback(null);
    setShowArchived(false);
  }

  function openRace(summary: RaceSummary) {
    if (dirty && !window.confirm("Discard the unsaved Race changes?")) return;
    const row = readStore().find((entry) => entry.id === summary.id);
    if (!row) return;
    setDraft(row);
    setActiveTab("overview");
    setDirty(false);
    setFeedback(null);
  }

  function change(next: RaceDraft) {
    setDraft(next);
    setDirty(true);
    setFeedback(null);
  }

  function persist() {
    try {
      const saved = saveLocalRace(draft);
      setDraft(saved);
      setDirty(false);
      setFeedback({ kind: "success", message: saved.core.name + " was saved locally." });
      setStoreVersion((value) => value + 1);
    } catch (error) {
      setFeedback({
        kind: "error",
        message: error instanceof Error ? error.message : "The Race could not be saved.",
      });
    }
  }

  function archiveCurrent() {
    if (!("id" in draft) || !draft.id) return;
    const reason = window.prompt("Archive reason (optional):") ?? "";
    const rows = readStore();
    const index = rows.findIndex((row) => row.id === draft.id);
    if (index < 0) return;
    const next = { ...rows[index]!, archivedAt: new Date().toISOString(), archiveReason: reason };
    rows[index] = next;
    writeStore(rows);
    setDraft(next);
    setDirty(false);
    setStoreVersion((value) => value + 1);
  }

  function restoreCurrent() {
    if (!("id" in draft) || !draft.id) return;
    const rows = readStore();
    const index = rows.findIndex((row) => row.id === draft.id);
    if (index < 0) return;
    const next = { ...rows[index]!, archivedAt: null, archiveReason: "" };
    rows[index] = next;
    writeStore(rows);
    setDraft(next);
    setDirty(false);
    setStoreVersion((value) => value + 1);
  }

  function deleteCurrent() {
    if (!("id" in draft) || !draft.id) return;
    const confirmation = window.prompt("Type " + draft.core.name + " to permanently delete this local prototype Race:");
    if (confirmation !== draft.core.name) return;
    writeStore(readStore().filter((row) => row.id !== draft.id));
    setDraft(newRaceDraft());
    setDirty(false);
    setActiveTab("overview");
    setFeedback({ kind: "success", message: "Local prototype Race deleted." });
    setStoreVersion((value) => value + 1);
  }

  function clearPrototypeLibrary() {
    if (!window.confirm("Clear every locally saved prototype Race?")) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setDraft(newRaceDraft());
    setDirty(false);
    setActiveTab("overview");
    setShowArchived(false);
    setFeedback({ kind: "success", message: "Local Race prototype library cleared." });
    setStoreVersion((value) => value + 1);
  }

  return (
    <main className="skills-page races-page">
      <header className="skills-page__header">
        <div className="skills-page__brand">
          <Link href="/heavens" className="font-portcullion race-brand">Serrian<br />Tide</Link>
        </div>
        <div className="skills-page__title">
          <p>THE HEAVENS / RACES</p>
          <h1>Races</h1>
          <span>Local prototype · no database</span>
        </div>
        <div className="skills-page__navigation">
          <Link href="/heavens">Back to The Heavens</Link>
        </div>
      </header>

      <div className="skills-workspace races-workspace">
        <aside className="skill-library">
          <div className="skill-library__heading">
            <div><p>MASTER CONTENT</p><h2>Race Library</h2></div>
            <button className="skills-primary-button" type="button" onClick={createNew}>New Race</button>
          </div>

          <div className="skill-library__search">
            <label htmlFor="race-search">Search</label>
            <input id="race-search" type="search" value={search} placeholder="Search by name" onChange={(event) => setSearch(event.target.value)} />
          </div>

          <div className="skill-library__filters race-library-filters">
            <label>
              <span>Size</span>
              <select value={sizeFilter} onChange={(event) => setSizeFilter(event.target.value)}>
                <option value="">All</option>
                {RACE_SIZE_OPTIONS.map((size) => <option key={size}>{size}</option>)}
              </select>
            </label>
          </div>

          <div className="skill-library__toolbar">
            <div className="skill-library__view-toggle" aria-label="Race lifecycle view">
              <button type="button" className={!showArchived ? "is-active" : ""} onClick={() => setShowArchived(false)}>Active</button>
              <button type="button" className={showArchived ? "is-active" : ""} onClick={() => setShowArchived(true)}>Archived</button>
            </div>
            <span>{library.length} races</span>
          </div>

          <div className="skill-library__results">
            {library.map((entry) => (
              <button key={entry.id} type="button" className={"skill-library__row" + (draft.id === entry.id ? " is-selected" : "")} onClick={() => openRace(entry)}>
                <span className="skill-library__row-name">{entry.name}</span>
                {entry.archivedAt ? <span className="skill-library__row-status">Archived</span> : null}
                <span className="skill-library__row-meta">{entry.size || "Size N/A"}{entry.ageRangeText ? " · " + entry.ageRangeText : ""}</span>
                <span className="skill-library__row-parents">{entry.attributeCapCount} caps · {entry.movementModeCount} movement · {entry.skillLinkCount} skill links</span>
              </button>
            ))}
            {!library.length ? <p className="skill-library__empty">No locally saved Races match this view.</p> : null}
          </div>

          <div className="race-prototype-actions">
            <button type="button" onClick={clearPrototypeLibrary}>Reset Local Race Library</button>
          </div>
        </aside>

        <section className="skill-editor race-editor">
          <header className="skill-editor__header">
            <div>
              <p>{draft.id ? "RACE " + draft.id : "NEW RACE DRAFT"}</p>
              <h2>{draft.core.name || "Untitled Race"}</h2>
              <span>{isArchived ? "Archived" : dirty ? "Unsaved changes" : draft.id ? "Saved locally" : "Not yet persisted"}</span>
            </div>

            <div className="skill-editor__actions">
              {draft.id ? (
                <>
                  {isArchived ? (
                    <button type="button" onClick={restoreCurrent}>Restore</button>
                  ) : (
                    <button type="button" disabled={dirty} onClick={archiveCurrent}>Archive</button>
                  )}
                  <button className="skills-danger-button" type="button" disabled={dirty} onClick={deleteCurrent}>Delete</button>
                </>
              ) : null}
              <button className="skills-primary-button" type="button" disabled={isArchived} onClick={persist}>Save Race</button>
            </div>
          </header>

          {feedback ? <p className={"skill-editor__feedback is-" + feedback.kind}>{feedback.message}</p> : null}

          <nav className="skill-editor__tabs">
            {TABS.map((tab) => (
              <button key={tab.id} type="button" className={activeTab === tab.id ? "is-active" : ""} onClick={() => setActiveTab(tab.id)}>
                {tab.label}
              </button>
            ))}
          </nav>

          <fieldset className="skill-editor__content race-editor__content lifecycle-editor-fields" disabled={isArchived}>
            {activeTab === "overview" ? <Overview draft={draft} onChange={change} /> : null}
            {activeTab === "mechanics" ? <Mechanics draft={draft} onChange={change} /> : null}
            {activeTab === "quirk" ? <Quirk draft={draft} onChange={change} /> : null}
            {activeTab === "skills" ? <Skills draft={draft} onChange={change} /> : null}
            {activeTab === "culture" ? <Culture draft={draft} onChange={change} /> : null}
            {activeTab === "preview" ? <Preview draft={draft} /> : null}
          </fieldset>
        </section>
      </div>
    </main>
  );
}

function Overview({ draft, onChange }: { draft: RaceDraft; onChange: (draft: RaceDraft) => void }) {
  const core = draft.core;
  const setCore = (update: Partial<RaceDraft["core"]>) => onChange({ ...draft, core: { ...core, ...update } });

  return <div className="race-section">
    <div className="skill-editor__intro"><p>Identity, physical description, age, and broad Race information.</p></div>
    <div className="race-form-grid">
      <Field label="Name" wide><input value={core.name} onChange={(event) => setCore({ name: event.target.value })} /></Field>
      <Field label="Size"><select value={core.size} onChange={(event) => setCore({ size: event.target.value })}>{RACE_SIZE_OPTIONS.map((size) => <option key={size}>{size}</option>)}</select></Field>
      <Field label="Base Magic"><input type="number" value={core.baseMagic ?? ""} onChange={(event) => setCore({ baseMagic: event.target.value === "" ? null : Number(event.target.value) })} /></Field>
      <Field label="Age Range Text"><input value={core.ageRangeText} onChange={(event) => setCore({ ageRangeText: event.target.value })} /></Field>
      <Field label="Minimum Age"><input type="number" min={0} value={core.ageMin ?? ""} onChange={(event) => setCore({ ageMin: event.target.value === "" ? null : Number(event.target.value) })} /></Field>
      <Field label="Maximum Age"><input type="number" min={0} value={core.ageMax ?? ""} onChange={(event) => setCore({ ageMax: event.target.value === "" ? null : Number(event.target.value) })} /></Field>
      <Field label="Physical Characteristics" wide><textarea rows={5} value={core.physicalCharacteristics} onChange={(event) => setCore({ physicalCharacteristics: event.target.value })} /></Field>
      <Field label="Physical Description" wide><textarea rows={5} value={core.physicalDescription} onChange={(event) => setCore({ physicalDescription: event.target.value })} /></Field>
      <Field label="Legacy Description" wide><textarea rows={5} value={core.legacyDescription} onChange={(event) => setCore({ legacyDescription: event.target.value })} /></Field>
    </div>
  </div>;
}

function Mechanics({ draft, onChange }: { draft: RaceDraft; onChange: (draft: RaceDraft) => void }) {
  return <div className="race-section">
    <div className="race-subheading">
      <div><p>RACIAL LIMITS</p><h3>Attribute Caps</h3></div>
      <button type="button" onClick={() => onChange({ ...draft, attributeCaps: [...draft.attributeCaps, { attributeKey: "", maxValue: 50, sortOrder: draft.attributeCaps.length }] })}>Add Attribute</button>
    </div>

    <div className="race-row-list">
      {draft.attributeCaps.map((cap, index) => (
        <div className="race-repeat-row" key={cap.attributeKey + "-" + index}>
          <input placeholder="Attribute" value={cap.attributeKey} onChange={(event) => onChange({ ...draft, attributeCaps: draft.attributeCaps.map((entry, i) => i === index ? { ...entry, attributeKey: event.target.value } : entry) })} />
          <input type="number" value={cap.maxValue} onChange={(event) => onChange({ ...draft, attributeCaps: draft.attributeCaps.map((entry, i) => i === index ? { ...entry, maxValue: Number(event.target.value) } : entry) })} />
          <button className="is-danger" type="button" onClick={() => onChange({ ...draft, attributeCaps: draft.attributeCaps.filter((_, i) => i !== index) })}>Remove</button>
        </div>
      ))}
    </div>

    <div className="race-subheading race-subheading--spaced">
      <div><p>MOVEMENT</p><h3>Movement Modes</h3></div>
      <button type="button" onClick={() => onChange({ ...draft, movementModes: [...draft.movementModes, { movementMode: "Land", baseValue: 0, notes: "", sortOrder: draft.movementModes.length }] })}>Add Movement</button>
    </div>

    <div className="race-row-list">
      {draft.movementModes.map((movement, index) => (
        <div className="race-repeat-row race-repeat-row--movement" key={movement.movementMode + "-" + index}>
          <input placeholder="Mode" value={movement.movementMode} onChange={(event) => onChange({ ...draft, movementModes: draft.movementModes.map((entry, i) => i === index ? { ...entry, movementMode: event.target.value } : entry) })} />
          <input type="number" placeholder="Base" value={movement.baseValue} onChange={(event) => onChange({ ...draft, movementModes: draft.movementModes.map((entry, i) => i === index ? { ...entry, baseValue: Number(event.target.value) } : entry) })} />
          <input placeholder="Notes" value={movement.notes} onChange={(event) => onChange({ ...draft, movementModes: draft.movementModes.map((entry, i) => i === index ? { ...entry, notes: event.target.value } : entry) })} />
          <button className="is-danger" type="button" onClick={() => onChange({ ...draft, movementModes: draft.movementModes.filter((_, i) => i !== index) })}>Remove</button>
        </div>
      ))}
    </div>
  </div>;
}

function Quirk({ draft, onChange }: { draft: RaceDraft; onChange: (draft: RaceDraft) => void }) {
  const core = draft.core;
  const setCore = (update: Partial<RaceDraft["core"]>) => onChange({ ...draft, core: { ...core, ...update } });

  return <div className="race-section race-form-grid">
    <Field label="Racial Quirk Name" wide><input value={core.racialQuirkName} onChange={(event) => setCore({ racialQuirkName: event.target.value })} /></Field>
    <Field label="Success Effect" wide><textarea rows={8} value={core.quirkSuccessEffect} onChange={(event) => setCore({ quirkSuccessEffect: event.target.value })} /></Field>
    <Field label="Failure Effect" wide><textarea rows={8} value={core.quirkFailureEffect} onChange={(event) => setCore({ quirkFailureEffect: event.target.value })} /></Field>
  </div>;
}

function Skills({ draft, onChange }: { draft: RaceDraft; onChange: (draft: RaceDraft) => void }) {
  const [search, setSearch] = useState("");
  const [classification, setClassification] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [linkType, setLinkType] = useState("Skill");

  const candidates = readSkills().filter((skill) => !skill.archivedAt).map((skill) => ({ id: skill.id, name: skill.name, classification: skill.classification, tier: skill.tier })).filter((candidate) => {
    const query = search.trim().toLocaleLowerCase("en-US");
    return (!query || candidate.name.toLocaleLowerCase("en-US").includes(query))
      && (!classification || candidate.classification === classification);
  });

  const classifications = ["", "standard", "special ability", "sphere", "spell", "discipline", "psionic skill", "resonance", "reverberation"];

  function addLink() {
    const candidate = candidates.find(({ id }) => id === Number(selectedId));
    if (!candidate || !isRaceSkillEligible(candidate)) return;
    if (draft.skillLinks.some((link) => link.skillId === candidate.id && link.linkType.toLowerCase() === linkType.toLowerCase())) return;
    onChange({
      ...draft,
      skillLinks: [...draft.skillLinks, {
        skillId: candidate.id,
        skillName: candidate.name,
        skillClassification: candidate.classification,
        linkType,
        value: null,
        sortOrder: draft.skillLinks.length,
      }],
    });
    setSelectedId("");
  }

  return <div className="race-section">
    <div className="skill-editor__intro"><p>Temporary local Skill candidates are supplied only so this old Race workflow can be exercised before the new Skill library is connected.</p></div>
    <div className="race-skill-picker">
      <Field label="Search"><input type="search" value={search} onChange={(event) => { setSearch(event.target.value); setSelectedId(""); }} /></Field>
      <Field label="Classification"><select value={classification} onChange={(event) => { setClassification(event.target.value); setSelectedId(""); }}>{classifications.map((value) => <option value={value} key={value}>{value || "All"}</option>)}</select></Field>
      <Field label="Matching Skills"><select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}><option value="">Select a Skill</option>{candidates.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.name} · {candidate.classification}{candidate.tier ? " · T" + candidate.tier : ""}</option>)}</select></Field>
      <Field label="Link Type"><select value={linkType} onChange={(event) => setLinkType(event.target.value)}><option>Skill</option><option>Granted</option></select></Field>
      <button className="skills-primary-button race-add-link" type="button" disabled={!selectedId} onClick={addLink}>Add Link</button>
    </div>

    <div className="race-row-list race-skill-links">
      {draft.skillLinks.map((link, index) => (
        <article className="race-skill-link" key={link.skillId + "-" + link.linkType + "-" + index}>
          <div><strong>{link.skillName}</strong><span>{link.skillClassification}</span></div>
          <select value={link.linkType} onChange={(event) => onChange({ ...draft, skillLinks: draft.skillLinks.map((entry, i) => i === index ? { ...entry, linkType: event.target.value } : entry) })}><option>Skill</option><option>Granted</option></select>
          <input type="number" placeholder="Value" value={link.value ?? ""} onChange={(event) => onChange({ ...draft, skillLinks: draft.skillLinks.map((entry, i) => i === index ? { ...entry, value: event.target.value === "" ? null : Number(event.target.value) } : entry) })} />
          <button className="is-danger" type="button" onClick={() => onChange({ ...draft, skillLinks: draft.skillLinks.filter((_, i) => i !== index) })}>Remove</button>
        </article>
      ))}
    </div>
  </div>;
}

function Culture({ draft, onChange }: { draft: RaceDraft; onChange: (draft: RaceDraft) => void }) {
  const core = draft.core;
  const setCore = (update: Partial<RaceDraft["core"]>) => onChange({ ...draft, core: { ...core, ...update } });

  return <div className="race-section race-form-grid">
    <Field label="Common Languages Known" wide><textarea rows={4} value={core.commonLanguagesKnown} onChange={(event) => setCore({ commonLanguagesKnown: event.target.value })} /></Field>
    <Field label="Common Archetypes" wide><textarea rows={4} value={core.commonArchetypes} onChange={(event) => setCore({ commonArchetypes: event.target.value })} /></Field>
    <Field label="Genre Examples" wide><textarea rows={4} value={core.genreExamples} onChange={(event) => setCore({ genreExamples: event.target.value })} /></Field>
    <Field label="Cultural Mindset" wide><textarea rows={6} value={core.culturalMindset} onChange={(event) => setCore({ culturalMindset: event.target.value })} /></Field>
    <Field label="Outlook on Magic" wide><textarea rows={6} value={core.outlookOnMagic} onChange={(event) => setCore({ outlookOnMagic: event.target.value })} /></Field>
  </div>;
}

function Preview({ draft }: { draft: RaceDraft }) {
  return <article className="race-preview">
    <header><p>{draft.core.size || "Race"}</p><h3>{draft.core.name || "Untitled Race"}</h3><span>{draft.core.ageRangeText || "Age range not specified"}</span></header>
    <div className="race-preview__grid">
      <section><h4>Physical</h4><p>{draft.core.physicalDescription || draft.core.physicalCharacteristics || "No physical description."}</p></section>
      <section><h4>Quirk</h4><strong>{draft.core.racialQuirkName || "None"}</strong><p>{draft.core.quirkSuccessEffect || "No success effect."}</p><p>{draft.core.quirkFailureEffect || "No failure effect."}</p></section>
    </div>
    <section><h4>Attribute Caps</h4><div className="race-preview__chips">{draft.attributeCaps.map((cap, index) => <span key={cap.attributeKey + "-" + index}>{cap.attributeKey} {cap.maxValue}</span>)}</div></section>
    <section><h4>Movement</h4><div className="race-preview__chips">{draft.movementModes.map((mode, index) => <span key={mode.movementMode + "-" + index}>{mode.movementMode} {mode.baseValue}</span>)}</div></section>
    <section><h4>Skills & Abilities</h4>{draft.skillLinks.length ? <ul>{draft.skillLinks.map((link, index) => <li key={link.skillId + "-" + index}><strong>{link.skillName}</strong> <span>{link.linkType}{link.value !== null ? " · " + link.value : ""}</span></li>)}</ul> : <p>No linked Skills.</p>}</section>
    <div className="race-preview__grid">
      <section><h4>Culture</h4><p>{draft.core.culturalMindset || "Not specified."}</p></section>
      <section><h4>Magic</h4><p>{draft.core.outlookOnMagic || "Not specified."}</p></section>
    </div>
  </article>;
}
