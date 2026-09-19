"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type CampaignTab = "rules" | "races" | "inventory";

type LocalCampaign = {
  id: number;
  name: string;
  overview: string;
  attributePoints: number;
  skillPoints: number;
  maxStartingSkill: number;
  pointsToUnlockNextTier: number;
  maxPointsInSkill: number;
  startingCreditAmount: number;
  currencySystem: "Credits" | "Derived Currency";
  fatePointMethod: "Assigned" | "Rolled";
  assignedFatePoints: number | null;
  allowedSystems: string[];
  derivedCurrencies: Array<{
    id: number;
    name: string;
    description: string;
    creditsPerUnit: number;
  }>;
  campaignRaceIds: number[];
  allowedRaceIds: number[];
  inventoryTagIds: number[];
  inventoryItemIds: number[];
  archivedAt: string | null;
  archiveReason: string;
  createdAt: string;
  updatedAt: string;
};

type LocalRace = {
  id: number;
  core: { name: string; size: string };
  archivedAt: string | null;
};

const CAMPAIGN_KEY = "serrian-tide:prototype:campaigns:v1";
const RACE_KEY = "serrian-tide:prototype:races:v1";
const TABS: Array<{ id: CampaignTab; label: string }> = [
  { id: "rules", label: "Rules & Systems" },
  { id: "races", label: "Allowed Races" },
  { id: "inventory", label: "Inventory Access" },
];
const SYSTEMS = [
  "Tier 1",
  "Tier 2",
  "Tier 3",
  "Spellcraft",
  "Talismanism",
  "Faith",
  "Psyonics",
  "Special Abilities",
  "Bardic Resonance",
  "Derived Abilities",
];

function readCampaigns(): LocalCampaign[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CAMPAIGN_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCampaigns(rows: LocalCampaign[]) {
  window.localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(rows));
}

function readRaces(): LocalRace[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(RACE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function newCampaign(id = 0): LocalCampaign {
  const now = new Date().toISOString();
  return {
    id,
    name: "",
    overview: "",
    attributePoints: 0,
    skillPoints: 0,
    maxStartingSkill: 0,
    pointsToUnlockNextTier: 0,
    maxPointsInSkill: 0,
    startingCreditAmount: 0,
    currencySystem: "Credits",
    fatePointMethod: "Assigned",
    assignedFatePoints: 0,
    allowedSystems: ["Tier 1"],
    derivedCurrencies: [],
    campaignRaceIds: [],
    allowedRaceIds: [],
    inventoryTagIds: [],
    inventoryItemIds: [],
    archivedAt: null,
    archiveReason: "",
    createdAt: now,
    updatedAt: now,
  };
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
  return <label className={wide ? "campaign-field campaign-field--wide" : "campaign-field"}><span>{label}</span>{children}</label>;
}

function SectionHeading({
  eyebrow,
  title,
  action,
  onAction,
}: {
  eyebrow: string;
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return <header className="campaign-section-heading">
    <div><p>{eyebrow}</p><h3 className="font-sans">{title}</h3></div>
    {action && onAction ? <button type="button" onClick={onAction}>{action}</button> : null}
  </header>;
}

export function CampaignWorkspace() {
  const [libraryView, setLibraryView] = useState<"active" | "archived">("active");
  const [draft, setDraft] = useState<LocalCampaign>(() => newCampaign());
  const [tab, setTab] = useState<CampaignTab>("rules");
  const [dirty, setDirty] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(null);
  const [raceSearch, setRaceSearch] = useState("");
  const [storeVersion, setStoreVersion] = useState(0);

  const campaigns = useMemo(() => {
    void storeVersion;
    return readCampaigns()
      .filter((campaign) => Boolean(campaign.archivedAt) === (libraryView === "archived"))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [libraryView, storeVersion]);

  const races = useMemo(() => {
    void storeVersion;
    const query = raceSearch.trim().toLocaleLowerCase("en-US");
    return readRaces()
      .filter((race) => !race.archivedAt)
      .filter((race) => !query || race.core.name.toLocaleLowerCase("en-US").includes(query) || race.core.size.toLocaleLowerCase("en-US").includes(query))
      .sort((a, b) => a.core.name.localeCompare(b.core.name));
  }, [raceSearch, storeVersion]);

  function change(next: LocalCampaign) {
    setDraft(next);
    setDirty(true);
    setFeedback(null);
  }

  function beginNew() {
    if (dirty && !window.confirm("Discard unsaved Campaign changes?")) return;
    setDraft(newCampaign());
    setTab("rules");
    setDirty(false);
    setFeedback(null);
    setLibraryView("active");
  }

  function openCampaign(id: number) {
    if (dirty && !window.confirm("Discard unsaved Campaign changes?")) return;
    const row = readCampaigns().find((campaign) => campaign.id === id);
    if (!row) return;
    setDraft(row);
    setTab("rules");
    setDirty(false);
    setFeedback(null);
  }

  function saveCampaign() {
    if (!draft.name.trim()) {
      setFeedback({ kind: "error", message: "Campaign Name is required." });
      return;
    }
    const rows = readCampaigns();
    const now = new Date().toISOString();
    if (draft.id) {
      const index = rows.findIndex((campaign) => campaign.id === draft.id);
      if (index < 0) {
        setFeedback({ kind: "error", message: "That local Campaign no longer exists." });
        return;
      }
      const saved = { ...draft, updatedAt: now };
      rows[index] = saved;
      writeCampaigns(rows);
      setDraft(saved);
    } else {
      const id = rows.reduce((max, campaign) => Math.max(max, campaign.id), 0) + 1;
      const saved = { ...draft, id, createdAt: now, updatedAt: now };
      rows.push(saved);
      writeCampaigns(rows);
      setDraft(saved);
    }
    setDirty(false);
    setFeedback({ kind: "success", message: "Campaign saved locally." });
    setStoreVersion((value) => value + 1);
  }

  function archiveCampaign() {
    if (!draft.id) return;
    const reason = window.prompt("Archive reason (optional):") ?? "";
    const rows = readCampaigns();
    const index = rows.findIndex((campaign) => campaign.id === draft.id);
    if (index < 0) return;
    const saved = { ...draft, archivedAt: new Date().toISOString(), archiveReason: reason, updatedAt: new Date().toISOString() };
    rows[index] = saved;
    writeCampaigns(rows);
    setDraft(saved);
    setDirty(false);
    setStoreVersion((value) => value + 1);
  }

  function restoreCampaign() {
    if (!draft.id) return;
    const rows = readCampaigns();
    const index = rows.findIndex((campaign) => campaign.id === draft.id);
    if (index < 0) return;
    const saved = { ...draft, archivedAt: null, archiveReason: "", updatedAt: new Date().toISOString() };
    rows[index] = saved;
    writeCampaigns(rows);
    setDraft(saved);
    setDirty(false);
    setStoreVersion((value) => value + 1);
  }

  function deleteCampaign() {
    if (!draft.id) return;
    const confirmation = window.prompt("Type " + draft.name + " to permanently delete this local prototype Campaign:");
    if (confirmation !== draft.name) return;
    writeCampaigns(readCampaigns().filter((campaign) => campaign.id !== draft.id));
    setDraft(newCampaign());
    setDirty(false);
    setTab("rules");
    setFeedback({ kind: "success", message: "Local Campaign deleted." });
    setStoreVersion((value) => value + 1);
  }

  function clearLocalCampaigns() {
    if (!window.confirm("Clear every locally saved prototype Campaign?")) return;
    window.localStorage.removeItem(CAMPAIGN_KEY);
    setDraft(newCampaign());
    setDirty(false);
    setTab("rules");
    setLibraryView("active");
    setFeedback({ kind: "success", message: "Local Campaign library cleared." });
    setStoreVersion((value) => value + 1);
  }

  const selectedCampaignRace = (id: number) => draft.campaignRaceIds.includes(id);
  const selectedPlayableRace = (id: number) => draft.allowedRaceIds.includes(id);

  return <main className="campaign-page">
    <header className="campaign-header">
      <Link href="/heavens" className="font-portcullion campaign-logo">Serrian<br />Tide</Link>
      <div><p>THE HEAVENS / CAMPAIGN SETTINGS</p><h1 className="font-sans">{draft.id ? "Edit Campaign" : "Create Campaign"}</h1><span>Local prototype · no database · creator-owned rules, access, currency, and authorized content.</span></div>
      <nav>
        <Link href="/heavens">← Return to Campaign Control</Link>
        <button className="is-primary campaign-nav-button" type="button" onClick={beginNew}>New Campaign</button>
      </nav>
    </header>

    {feedback ? <p className={"campaign-feedback is-" + feedback.kind}>{feedback.message}</p> : null}

    <div className="campaign-workspace">
      <aside className="campaign-library">
        <header>
          <div><p>CAMPAIGN WORLDS</p><h2>Campaign Library</h2></div>
          <div className="campaign-library-filters" aria-label="Campaign lifecycle view">
            <button type="button" className={libraryView === "active" ? "is-active" : ""} onClick={() => setLibraryView("active")}>Active</button>
            <button type="button" className={libraryView === "archived" ? "is-active" : ""} onClick={() => setLibraryView("archived")}>Archived</button>
          </div>
        </header>

        <div>
          {campaigns.map((entry) => (
            <button key={entry.id} type="button" className={draft.id === entry.id ? "is-selected" : ""} onClick={() => openCampaign(entry.id)}>
              <div className="campaign-library-card-heading">
                <strong>{entry.name}</strong>
                <em className="campaign-access-badge is-owner">Yours</em>
              </div>
              <span>0 Players · 0 Characters · 0 NPCs</span>
              <small>{entry.archivedAt ? "Archived · " : ""}{entry.currencySystem} · Local prototype</small>
            </button>
          ))}
          {!campaigns.length ? <p>No {libraryView} Campaigns.</p> : null}
        </div>

        <div className="campaign-local-reset">
          <button type="button" onClick={clearLocalCampaigns}>Reset Local Campaign Library</button>
        </div>
      </aside>

      <section className="campaign-editor">
        <header className="campaign-editor-header">
          <div>
            <p>{draft.id ? "CAMPAIGN " + draft.id : "NEW CAMPAIGN DRAFT"}</p>
            <h2>{draft.name || "Untitled Campaign"}</h2>
            <span>{draft.archivedAt ? "Archived" : dirty ? "Unsaved changes" : draft.id ? "Saved locally" : "Not yet persisted"}</span>
          </div>
          <div className="campaign-editor-actions">
            <button type="button" disabled={draft.archivedAt !== null} onClick={saveCampaign}>Save Campaign</button>
            {draft.id ? (
              <>
                {draft.archivedAt ? <button type="button" onClick={restoreCampaign}>Restore</button> : <button type="button" disabled={dirty} onClick={archiveCampaign}>Archive</button>}
                <button type="button" className="is-danger" disabled={dirty} onClick={deleteCampaign}>Delete</button>
              </>
            ) : null}
          </div>
        </header>

        <nav className="campaign-tabs">
          {TABS.map((entry) => <button key={entry.id} type="button" className={tab === entry.id ? "is-active" : ""} onClick={() => setTab(entry.id)}>{entry.label}</button>)}
        </nav>

        <div className="campaign-editor-content">
          {tab === "rules" ? <Rules draft={draft} onChange={change} /> : null}
          {tab === "races" ? (
            <div className="campaign-section">
              <SectionHeading eyebrow="CHARACTER CREATION" title="Race Access" />
              <input className="campaign-search" type="search" value={raceSearch} placeholder="Search Races" onChange={(event) => setRaceSearch(event.target.value)} />
              <div className="campaign-selection-grid">
                <RaceColumn
                  title="All Races"
                  subtitle="Local active catalog"
                  entries={races}
                  selectedIds={draft.campaignRaceIds}
                  onToggle={(raceId) => change({
                    ...draft,
                    campaignRaceIds: selectedCampaignRace(raceId)
                      ? draft.campaignRaceIds.filter((id) => id !== raceId)
                      : [...draft.campaignRaceIds, raceId],
                    allowedRaceIds: selectedCampaignRace(raceId)
                      ? draft.allowedRaceIds.filter((id) => id !== raceId)
                      : draft.allowedRaceIds,
                  })}
                />
                <RaceColumn
                  title="Campaign Races"
                  subtitle="World availability"
                  entries={races.filter((race) => selectedCampaignRace(race.id))}
                  selectedIds={draft.campaignRaceIds}
                  onToggle={(raceId) => change({
                    ...draft,
                    campaignRaceIds: draft.campaignRaceIds.filter((id) => id !== raceId),
                    allowedRaceIds: draft.allowedRaceIds.filter((id) => id !== raceId),
                  })}
                />
                <RaceColumn
                  title="Playable Races"
                  subtitle="Character creation subset"
                  entries={races.filter((race) => selectedCampaignRace(race.id))}
                  selectedIds={draft.allowedRaceIds}
                  onToggle={(raceId) => change({
                    ...draft,
                    allowedRaceIds: selectedPlayableRace(raceId)
                      ? draft.allowedRaceIds.filter((id) => id !== raceId)
                      : [...draft.allowedRaceIds, raceId],
                  })}
                />
              </div>
            </div>
          ) : null}

          {tab === "inventory" ? <InventoryAccess draft={draft} onChange={change} /> : null}
        </div>
      </section>
    </div>
  </main>;
}

function Rules({ draft, onChange }: { draft: LocalCampaign; onChange: (draft: LocalCampaign) => void }) {
  const set = (update: Partial<LocalCampaign>) => onChange({ ...draft, ...update });

  return <div className="campaign-section">
    <div className="campaign-form-grid">
      <Field label="Campaign Name" wide><input value={draft.name} onChange={(event) => set({ name: event.target.value })} /></Field>
      <Field label="Campaign Overview" wide><textarea rows={8} value={draft.overview} onChange={(event) => set({ overview: event.target.value })} /></Field>
      <Field label="Attribute Points"><input type="number" min={0} value={draft.attributePoints} onChange={(event) => set({ attributePoints: Number(event.target.value) })} /></Field>
      <Field label="Skill Points"><input type="number" min={0} value={draft.skillPoints} onChange={(event) => set({ skillPoints: Number(event.target.value) })} /></Field>
      <Field label="Max Starting Points per Skill"><input type="number" min={0} value={draft.maxStartingSkill} onChange={(event) => set({ maxStartingSkill: Number(event.target.value) })} /></Field>
      <Field label="Points to Unlock Next Tier"><input type="number" min={0} value={draft.pointsToUnlockNextTier} onChange={(event) => set({ pointsToUnlockNextTier: Number(event.target.value) })} /></Field>
      <Field label="Max Points in Standard Skill"><input type="number" min={0} value={draft.maxPointsInSkill} onChange={(event) => set({ maxPointsInSkill: Number(event.target.value) })} /></Field>
      <Field label="Starting Credits"><input type="number" min={0} value={draft.startingCreditAmount} onChange={(event) => set({ startingCreditAmount: Number(event.target.value) })} /></Field>
      <Field label="Fate Method"><select value={draft.fatePointMethod} onChange={(event) => set({ fatePointMethod: event.target.value as LocalCampaign["fatePointMethod"] })}><option>Assigned</option><option>Rolled</option></select></Field>
      {draft.fatePointMethod === "Assigned" ? <Field label="Assigned Fate Points"><input type="number" min={0} step={1} value={draft.assignedFatePoints ?? 0} onChange={(event) => set({ assignedFatePoints: Math.max(0, Math.trunc(Number(event.target.value))) })} /></Field> : null}
      <Field label="Currency System"><select value={draft.currencySystem} onChange={(event) => set({ currencySystem: event.target.value as LocalCampaign["currencySystem"] })}><option>Credits</option><option>Derived Currency</option></select></Field>
    </div>

    <SectionHeading eyebrow="RULE AVAILABILITY" title="Allowed Systems" />
    <div className="campaign-check-grid">
      {SYSTEMS.map((system) => (
        <label key={system} className={draft.allowedSystems.includes(system) ? "is-selected" : ""}>
          <input
            type="checkbox"
            checked={draft.allowedSystems.includes(system)}
            onChange={(event) => set({
              allowedSystems: event.target.checked
                ? [...draft.allowedSystems, system]
                : draft.allowedSystems.filter((entry) => entry !== system),
            })}
          />
          <span>{system}</span>
        </label>
      ))}
    </div>

    {draft.currencySystem === "Derived Currency" ? (
      <>
        <SectionHeading eyebrow="DENOMINATIONS" title="Derived Currencies" action="Add Currency" onAction={() => set({
          derivedCurrencies: [...draft.derivedCurrencies, { id: Date.now(), name: "", description: "", creditsPerUnit: 1 }],
        })} />
        <div className="campaign-currency-list">
          {draft.derivedCurrencies.map((currency, index) => (
            <article key={currency.id}>
              <input placeholder="Name" value={currency.name} onChange={(event) => set({ derivedCurrencies: draft.derivedCurrencies.map((entry, i) => i === index ? { ...entry, name: event.target.value } : entry) })} />
              <input placeholder="Description" value={currency.description} onChange={(event) => set({ derivedCurrencies: draft.derivedCurrencies.map((entry, i) => i === index ? { ...entry, description: event.target.value } : entry) })} />
              <input type="number" min={0.000001} step="any" value={currency.creditsPerUnit} onChange={(event) => set({ derivedCurrencies: draft.derivedCurrencies.map((entry, i) => i === index ? { ...entry, creditsPerUnit: Number(event.target.value) } : entry) })} />
              <button type="button" onClick={() => set({ derivedCurrencies: draft.derivedCurrencies.filter((_, i) => i !== index) })}>Remove</button>
            </article>
          ))}
        </div>
      </>
    ) : null}
  </div>;
}

function RaceColumn({
  title,
  subtitle,
  entries,
  selectedIds,
  onToggle,
}: {
  title: string;
  subtitle: string;
  entries: LocalRace[];
  selectedIds: number[];
  onToggle: (raceId: number) => void;
}) {
  return <div className="campaign-selection-column">
    <header><p>{title} <span className="campaign-race-count">{entries.length}</span></p><h4>{subtitle}</h4></header>
    <div className="campaign-selection-list">
      {entries.length ? entries.map((race) => (
        <button key={race.id} type="button" className={selectedIds.includes(race.id) ? "is-selected" : ""} aria-pressed={selectedIds.includes(race.id)} onClick={() => onToggle(race.id)}>
          <div><strong>{race.core.name}</strong><span>{race.core.size}</span></div>
          <small>{selectedIds.includes(race.id) ? "Selected" : "Available"}</small>
        </button>
      )) : <p className="campaign-empty-state">No races match this filter.</p>}
    </div>
  </div>;
}

function InventoryAccess({ draft, onChange }: { draft: LocalCampaign; onChange: (draft: LocalCampaign) => void }) {
  const placeholderTags = [
    { id: 1, name: "Fantasy", group: "Genre" },
    { id: 2, name: "Modern", group: "Genre" },
    { id: 3, name: "Firearms", group: "Equipment" },
    { id: 4, name: "Magic", group: "Equipment" },
  ];
  const placeholderItems = [
    { id: 1, name: "Sample Weapon" },
    { id: 2, name: "Sample Armor" },
    { id: 3, name: "Sample Inventory Item" },
  ];

  return <div className="campaign-section">
    <SectionHeading eyebrow="CAMPAIGN CATALOG" title="Inventory Access" />
    <p className="campaign-help">Temporary local choices are here so the authorization UI remains fully testable until Equipment and Inventory expose their own local libraries.</p>

    <div className="campaign-tag-grid">
      {placeholderTags.map((tag) => (
        <label key={tag.id} className={draft.inventoryTagIds.includes(tag.id) ? "is-selected" : ""}>
          <input
            type="checkbox"
            checked={draft.inventoryTagIds.includes(tag.id)}
            onChange={(event) => onChange({
              ...draft,
              inventoryTagIds: event.target.checked
                ? [...draft.inventoryTagIds, tag.id]
                : draft.inventoryTagIds.filter((id) => id !== tag.id),
            })}
          />
          <div><strong>{tag.name}</strong><span>{tag.group}</span></div>
        </label>
      ))}
    </div>

    <SectionHeading eyebrow="EXPLICIT ITEMS" title="Individual Item Access" />
    <div className="campaign-tag-grid">
      {placeholderItems.map((item) => (
        <label key={item.id} className={draft.inventoryItemIds.includes(item.id) ? "is-selected" : ""}>
          <input
            type="checkbox"
            checked={draft.inventoryItemIds.includes(item.id)}
            onChange={(event) => onChange({
              ...draft,
              inventoryItemIds: event.target.checked
                ? [...draft.inventoryItemIds, item.id]
                : draft.inventoryItemIds.filter((id) => id !== item.id),
            })}
          />
          <div><strong>{item.name}</strong><span>Temporary prototype item</span></div>
        </label>
      ))}
    </div>
  </div>;
}
