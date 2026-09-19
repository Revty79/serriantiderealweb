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

type StoredDraft = {
  id: number;
  values: Record<string, string | boolean>;
  archivedAt: string | null;
  archiveReason: string;
  updatedAt: string;
};

function readStore(key: string): StoredDraft[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStore(key: string, rows: StoredDraft[]) {
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
  titleFieldKey = "name",
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
  titleFieldKey?: string;
}) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "");
  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [archived, setArchived] = useState(false);
  const [version, setVersion] = useState(0);
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const current = useMemo(
    () => tabs.find((tab) => tab.id === activeTab) ?? tabs[0],
    [activeTab, tabs],
  );

  const library = useMemo(() => {
    void version;
    const query = search.trim().toLowerCase();
    return readStore(storageKey)
      .filter((row) => Boolean(row.archivedAt) === archived)
      .filter((row) => {
        if (!query) return true;
        return Object.values(row.values).some((value) =>
          String(value).toLowerCase().includes(query),
        );
      })
      .sort((a, b) =>
        String(a.values[titleFieldKey] ?? "").localeCompare(
          String(b.values[titleFieldKey] ?? ""),
        ),
      );
  }, [archived, search, storageKey, titleFieldKey, version]);

  function setValue(key: string, value: string | boolean) {
    setValues((currentValues) => ({ ...currentValues, [key]: value }));
    setFeedback(null);
  }

  function newDraft() {
    setValues({});
    setSelectedId(null);
    setActiveTab(tabs[0]?.id ?? "");
    setFeedback(null);
    setArchived(false);
  }

  function openDraft(id: number) {
    const row = readStore(storageKey).find((entry) => entry.id === id);
    if (!row) return;
    setSelectedId(id);
    setValues(row.values);
    setActiveTab(tabs[0]?.id ?? "");
    setFeedback(null);
  }

  function saveDraft() {
    const rows = readStore(storageKey);
    const now = new Date().toISOString();

    if (selectedId !== null) {
      const index = rows.findIndex((row) => row.id === selectedId);
      if (index >= 0) {
        rows[index] = { ...rows[index]!, values: { ...values }, updatedAt: now };
      }
    } else {
      const id = rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
      rows.push({
        id,
        values: { ...values },
        archivedAt: null,
        archiveReason: "",
        updatedAt: now,
      });
      setSelectedId(id);
    }

    writeStore(storageKey, rows);
    setFeedback("Saved locally. No database was used.");
    setVersion((value) => value + 1);
  }

  function archiveDraft() {
    if (selectedId === null) return;
    const rows = readStore(storageKey);
    const index = rows.findIndex((row) => row.id === selectedId);
    if (index < 0) return;
    rows[index] = {
      ...rows[index]!,
      archivedAt: new Date().toISOString(),
      archiveReason: window.prompt("Archive reason (optional):") ?? "",
    };
    writeStore(storageKey, rows);
    newDraft();
    setVersion((value) => value + 1);
  }

  function restoreDraft() {
    if (selectedId === null) return;
    const rows = readStore(storageKey);
    const index = rows.findIndex((row) => row.id === selectedId);
    if (index < 0) return;
    rows[index] = { ...rows[index]!, archivedAt: null, archiveReason: "" };
    writeStore(storageKey, rows);
    newDraft();
    setVersion((value) => value + 1);
  }

  function deleteDraft() {
    if (selectedId === null) return;
    if (!window.confirm("Delete this local prototype record?")) return;
    writeStore(
      storageKey,
      readStore(storageKey).filter((row) => row.id !== selectedId),
    );
    newDraft();
    setVersion((value) => value + 1);
  }

  const selectedRow =
    selectedId === null
      ? null
      : readStore(storageKey).find((row) => row.id === selectedId) ?? null;

  const singularTitle = title.endsWith("s") ? title.slice(0, -1) : title;
  const displayTitle =
    String(values[titleFieldKey] ?? "").trim() || "Untitled " + singularTitle;

  return (
    <main className={"skills-page " + pageClass}>
      <header className="skills-page__header">
        <div className="skills-page__brand">
          <Link href="/heavens" className={"font-portcullion " + brandClass}>
            Serrian<br />Tide
          </Link>
        </div>
        <div className="skills-page__title">
          <p>{breadcrumb}</p>
          <h1>{title}</h1>
          <span>Local prototype · no database</span>
        </div>
        <div className="skills-page__navigation">
          <Link href="/heavens">Back to The Heavens</Link>
        </div>
      </header>

      <div className={"skills-workspace " + workspaceClass}>
        <aside className="skill-library">
          <div className="skill-library__heading">
            <div>
              <p>MASTER CONTENT</p>
              <h2>{libraryTitle}</h2>
            </div>
            <button className="skills-primary-button" type="button" onClick={newDraft}>
              {newLabel}
            </button>
          </div>

          <div className="skill-library__search">
            <label>Search</label>
            <input
              type="search"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {libraryFilters.length ? (
            <div className="skill-library__filters">
              {libraryFilters.map((filter) => (
                <label key={filter.label}>
                  <span>{filter.label}</span>
                  <select defaultValue="">
                    <option value="">All</option>
                    {filter.options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          ) : null}

          <div className="skill-library__toolbar">
            <div className="skill-library__view-toggle">
              <button
                type="button"
                className={!archived ? "is-active" : ""}
                onClick={() => setArchived(false)}
              >
                Active
              </button>
              <button
                type="button"
                className={archived ? "is-active" : ""}
                onClick={() => setArchived(true)}
              >
                Archived
              </button>
            </div>
            <span>{library.length} {countLabel}</span>
          </div>

          <div className="skill-library__results">
            {library.map((row) => (
              <button
                key={row.id}
                type="button"
                className={"skill-library__row" + (selectedId === row.id ? " is-selected" : "")}
                onClick={() => openDraft(row.id)}
              >
                <span className="skill-library__row-name">
                  {String(row.values[titleFieldKey] ?? "Prototype " + row.id)}
                </span>
                {row.archivedAt ? <span className="skill-library__row-status">Archived</span> : null}
                <span className="skill-library__row-meta">Local prototype #{row.id}</span>
                <span className="skill-library__row-parents">
                  Updated {new Date(row.updatedAt).toLocaleString()}
                </span>
              </button>
            ))}
            {!library.length ? (
              <p className="skill-library__empty">No locally saved records match this view.</p>
            ) : null}
          </div>
        </aside>

        <section className="skill-editor">
          <header className="skill-editor__header">
            <div>
              <p>
                {selectedId
                  ? title.toUpperCase() + " " + selectedId
                  : "NEW " + title.toUpperCase() + " DRAFT"}
              </p>
              <h2>{displayTitle}</h2>
              <span>
                {selectedRow?.archivedAt
                  ? "Archived"
                  : selectedId
                    ? "Saved locally"
                    : "Not yet persisted"}
              </span>
            </div>
            <div className="skill-editor__actions">
              {selectedId ? (
                selectedRow?.archivedAt ? (
                  <button type="button" onClick={restoreDraft}>Restore</button>
                ) : (
                  <button type="button" onClick={archiveDraft}>Archive</button>
                )
              ) : null}
              {selectedId ? (
                <button className="skills-danger-button" type="button" onClick={deleteDraft}>
                  Delete
                </button>
              ) : null}
              <button className="skills-primary-button" type="button" onClick={saveDraft}>
                Save Locally
              </button>
            </div>
          </header>

          {feedback ? (
            <p className="skill-editor__feedback is-success">{feedback}</p>
          ) : null}

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

          <fieldset
            className="skill-editor__content design-editor-content"
            disabled={Boolean(selectedRow?.archivedAt)}
          >
            {current?.intro ? (
              <div className="skill-editor__intro">
                <p>{current.intro}</p>
              </div>
            ) : null}

            {current?.fields?.length ? (
              <div className="design-form-grid">
                {current.fields.map((field) => (
                  <label
                    key={field.key}
                    className={"design-field" + (field.wide ? " is-wide" : "")}
                  >
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
                            {(field.options ?? []).map((option) => (
                              <option key={option}>{option}</option>
                            ))}
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
