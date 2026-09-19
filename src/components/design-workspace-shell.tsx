"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type DesignField = {
  key: string;
  label: string;
  type?: "text" | "number" | "textarea" | "select" | "checkbox";
  options?: string[];
  placeholder?: string;
  wide?: boolean;
  disabled?: boolean;
};

export type DesignTab = {
  id: string;
  label: string;
  intro?: string;
  fields?: DesignField[];
  note?: string;
};

type StoredDesignRecord = {
  id: number;
  values: Record<string, string | boolean>;
  archivedAt: string | null;
  archiveReason: string;
  createdAt: string;
  updatedAt: string;
};

function readRecords(key: string): StoredDesignRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRecords(key: string, rows: StoredDesignRecord[]) {
  window.localStorage.setItem(key, JSON.stringify(rows));
}

export function DesignWorkspaceShell({
  pageClass,
  workspaceClass,
  brandClass,
  breadcrumb,
  title,
  libraryTitle,
  newLabel,
  searchPlaceholder,
  libraryFilters,
  countLabel,
  tabs,
  storageKey,
  nameKey = "name",
}: {
  pageClass: string;
  workspaceClass: string;
  brandClass: string;
  breadcrumb: string;
  title: string;
  libraryTitle: string;
  newLabel: string;
  searchPlaceholder: string;
  libraryFilters: Array<{ label: string; options: string[] }>;
  countLabel: string;
  tabs: DesignTab[];
  storageKey: string;
  nameKey?: string;
}) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "");
  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [recordId, setRecordId] = useState<number | null>(null);
  const [archivedAt, setArchivedAt] = useState<string | null>(null);
  const [archiveReason, setArchiveReason] = useState("");
  const [dirty, setDirty] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"active" | "archived">("active");
  const [version, setVersion] = useState(0);
  const current = useMemo(() => tabs.find((tab) => tab.id === activeTab) ?? tabs[0], [activeTab, tabs]);

  const library = useMemo(() => {
    void version;
    const query = search.trim().toLocaleLowerCase("en-US");
    return readRecords(storageKey)
      .filter((row) => Boolean(row.archivedAt) === (view === "archived"))
      .filter((row) => {
        if (!query) return true;
        return Object.values(row.values).some((value) => String(value).toLocaleLowerCase("en-US").includes(query));
      })
      .sort((left, right) =>
        String(left.values[nameKey] ?? "").localeCompare(String(right.values[nameKey] ?? "")),
      );
  }, [nameKey, search, storageKey, version, view]);

  function setValue(key: string, value: string | boolean) {
    setValues((currentValues) => ({ ...currentValues, [key]: value }));
    setDirty(true);
    setFeedback("");
  }

  function newRecord() {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    setValues({});
    setRecordId(null);
    setArchivedAt(null);
    setArchiveReason("");
    setDirty(false);
    setFeedback("");
    setActiveTab(tabs[0]?.id ?? "");
    setView("active");
  }

  function openRecord(record: StoredDesignRecord) {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    setValues(record.values);
    setRecordId(record.id);
    setArchivedAt(record.archivedAt);
    setArchiveReason(record.archiveReason);
    setDirty(false);
    setFeedback("");
    setActiveTab(tabs[0]?.id ?? "");
  }

  function saveRecord() {
    const displayName = String(values[nameKey] ?? "").trim();
    if (!displayName) {
      setFeedback("Name is required before saving this local prototype record.");
      return;
    }

    const rows = readRecords(storageKey);
    const now = new Date().toISOString();
    if (recordId !== null) {
      const index = rows.findIndex((row) => row.id === recordId);
      if (index < 0) {
        setFeedback("That local prototype record no longer exists.");
        return;
      }
      rows[index] = {
        ...rows[index]!,
        values,
        updatedAt: now,
      };
    } else {
      const id = rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
      rows.push({
        id,
        values,
        archivedAt: null,
        archiveReason: "",
        createdAt: now,
        updatedAt: now,
      });
      setRecordId(id);
    }

    writeRecords(storageKey, rows);
    setDirty(false);
    setFeedback("Saved locally.");
    setVersion((currentVersion) => currentVersion + 1);
  }

  function archiveRecord() {
    if (recordId === null) return;
    const reason = window.prompt("Archive reason (optional):") ?? "";
    const rows = readRecords(storageKey);
    const index = rows.findIndex((row) => row.id === recordId);
    if (index < 0) return;
    const nextArchivedAt = new Date().toISOString();
    rows[index] = { ...rows[index]!, archivedAt: nextArchivedAt, archiveReason: reason, updatedAt: nextArchivedAt };
    writeRecords(storageKey, rows);
    setArchivedAt(nextArchivedAt);
    setArchiveReason(reason);
    setDirty(false);
    setVersion((currentVersion) => currentVersion + 1);
  }

  function restoreRecord() {
    if (recordId === null) return;
    const rows = readRecords(storageKey);
    const index = rows.findIndex((row) => row.id === recordId);
    if (index < 0) return;
    rows[index] = { ...rows[index]!, archivedAt: null, archiveReason: "", updatedAt: new Date().toISOString() };
    writeRecords(storageKey, rows);
    setArchivedAt(null);
    setArchiveReason("");
    setDirty(false);
    setVersion((currentVersion) => currentVersion + 1);
  }

  function deleteRecord() {
    if (recordId === null) return;
    const displayName = String(values[nameKey] ?? title);
    if (window.prompt("Type " + displayName + " to delete this local prototype record:") !== displayName) return;
    writeRecords(storageKey, readRecords(storageKey).filter((row) => row.id !== recordId));
    newRecord();
    setVersion((currentVersion) => currentVersion + 1);
  }

  function resetLibrary() {
    if (!window.confirm("Clear every locally saved " + title + " prototype record?")) return;
    window.localStorage.removeItem(storageKey);
    setValues({});
    setRecordId(null);
    setArchivedAt(null);
    setArchiveReason("");
    setDirty(false);
    setFeedback("Local prototype library cleared.");
    setView("active");
    setVersion((currentVersion) => currentVersion + 1);
  }

  const displayName = String(values[nameKey] ?? "").trim() || "Untitled " + title.replace(/s$/, "");

  return (
    <main className={"skills-page " + pageClass}>
      <header className="skills-page__header">
        <div className="skills-page__brand">
          <Link href="/heavens" className={"font-portcullion " + brandClass}>Serrian<br />Tide</Link>
        </div>
        <div className="skills-page__title">
          <p>{breadcrumb}</p>
          <h1>{title}</h1>
          <span>Local prototype · no database</span>
        </div>
        <div className="skills-page__navigation"><Link href="/heavens">Back to The Heavens</Link></div>
      </header>

      <div className={"skills-workspace " + workspaceClass}>
        <aside className="skill-library">
          <div className="skill-library__heading">
            <div><p>MASTER CONTENT</p><h2>{libraryTitle}</h2></div>
            <button className="skills-primary-button" type="button" onClick={newRecord}>{newLabel}</button>
          </div>

          <div className="skill-library__search">
            <label>Search</label>
            <input type="search" placeholder={searchPlaceholder} value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>

          {libraryFilters.length ? (
            <div className="skill-library__filters">
              {libraryFilters.map((filter) => (
                <label key={filter.label}>
                  <span>{filter.label}</span>
                  <select defaultValue="">
                    <option value="">All</option>
                    {filter.options.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
              ))}
            </div>
          ) : null}

          <div className="skill-library__toolbar">
            <div className="skill-library__view-toggle">
              <button type="button" className={view === "active" ? "is-active" : ""} onClick={() => setView("active")}>Active</button>
              <button type="button" className={view === "archived" ? "is-active" : ""} onClick={() => setView("archived")}>Archived</button>
            </div>
            <span>{library.length} {countLabel}</span>
          </div>

          <div className="skill-library__results">
            {library.map((record) => (
              <button
                key={record.id}
                type="button"
                className={"skill-library__row" + (record.id === recordId ? " is-selected" : "")}
                onClick={() => openRecord(record)}
              >
                <span className="skill-library__row-name">{String(record.values[nameKey] ?? "Untitled")}</span>
                {record.archivedAt ? <span className="skill-library__row-status">Archived</span> : null}
                <span className="skill-library__row-meta">Local prototype #{record.id}</span>
                <span className="skill-library__row-parents">Updated {new Date(record.updatedAt).toLocaleString()}</span>
              </button>
            ))}
            {!library.length ? <p className="skill-library__empty">No locally saved records match this view.</p> : null}
          </div>

          <nav className="skill-library__pagination">
            <button type="button" disabled>Previous</button>
            <span>Page 1 of 1</span>
            <button type="button" disabled>Next</button>
          </nav>

          <div className="local-library-reset">
            <button type="button" onClick={resetLibrary}>Reset Local Library</button>
          </div>
        </aside>

        <section className="skill-editor">
          <header className="skill-editor__header">
            <div>
              <p>{recordId === null ? "NEW " + title.toUpperCase() + " DRAFT" : title.toUpperCase() + " " + recordId}</p>
              <h2>{displayName}</h2>
              <span>{archivedAt ? "Archived" + (archiveReason ? " · " + archiveReason : "") : dirty ? "Unsaved changes" : recordId ? "Saved locally" : "Not yet persisted"}</span>
            </div>
            <div className="skill-editor__actions">
              {recordId !== null ? (
                <>
                  {archivedAt ? <button type="button" onClick={restoreRecord}>Restore</button> : <button type="button" disabled={dirty} onClick={archiveRecord}>Archive</button>}
                  <button className="skills-danger-button" type="button" disabled={dirty} onClick={deleteRecord}>Delete</button>
                </>
              ) : null}
              <button className="skills-primary-button" type="button" disabled={Boolean(archivedAt)} onClick={saveRecord}>Save {title.replace(/s$/, "")}</button>
            </div>
          </header>

          {feedback ? <p className="skill-editor__feedback is-success">{feedback}</p> : null}

          <nav className="skill-editor__tabs" aria-label={title + " editor sections"}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={activeTab === tab.id ? "is-active" : ""}
                aria-pressed={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <fieldset className="skill-editor__content design-editor-content" disabled={Boolean(archivedAt)}>
            {current?.intro ? <div className="skill-editor__intro"><p>{current.intro}</p></div> : null}
            {current?.fields?.length ? (
              <div className="design-form-grid">
                {current.fields.map((field) => (
                  <label key={field.key} className={"design-field" + (field.wide ? " is-wide" : "")}>
                    {field.type === "checkbox" ? (
                      <span className="design-checkbox-row">
                        <input
                          type="checkbox"
                          checked={Boolean(values[field.key])}
                          onChange={(event) => setValue(field.key, event.target.checked)}
                        />
                        <strong>{field.label}</strong>
                      </span>
                    ) : (
                      <>
                        <span>{field.label}</span>
                        {field.type === "textarea" ? (
                          <textarea
                            rows={5}
                            disabled={field.disabled}
                            placeholder={field.placeholder}
                            value={String(values[field.key] ?? "")}
                            onChange={(event) => setValue(field.key, event.target.value)}
                          />
                        ) : field.type === "select" ? (
                          <select
                            disabled={field.disabled}
                            value={String(values[field.key] ?? "")}
                            onChange={(event) => setValue(field.key, event.target.value)}
                          >
                            <option value="">Unconfigured</option>
                            {(field.options ?? []).map((option) => <option key={option}>{option}</option>)}
                          </select>
                        ) : (
                          <input
                            type={field.type === "number" ? "number" : "text"}
                            disabled={field.disabled}
                            placeholder={field.placeholder}
                            value={String(values[field.key] ?? "")}
                            onChange={(event) => setValue(field.key, event.target.value)}
                          />
                        )}
                      </>
                    )}
                  </label>
                ))}
              </div>
            ) : null}
            {current?.note ? <p className="design-tab-note">{current.note}</p> : null}
          </fieldset>
        </section>
      </div>
    </main>
  );
}
