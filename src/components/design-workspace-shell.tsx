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
}) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "");
  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const current = useMemo(() => tabs.find((tab) => tab.id === activeTab) ?? tabs[0], [activeTab, tabs]);

  function setValue(key: string, value: string | boolean) {
    setValues((currentValues) => ({ ...currentValues, [key]: value }));
  }

  return (
    <main className={"skills-page " + pageClass}>
      <header className="skills-page__header">
        <div className="skills-page__brand">
          <Link href="/heavens" className={"font-portcullion " + brandClass}>Serrian<br />Tide</Link>
        </div>
        <div className="skills-page__title">
          <p>{breadcrumb}</p>
          <h1>{title}</h1>
          <span>G.O.D. archive · Adventurer</span>
        </div>
        <div className="skills-page__navigation"><Link href="/heavens">Back to The Heavens</Link></div>
      </header>

      <div className={"skills-workspace " + workspaceClass}>
        <aside className="skill-library">
          <div className="skill-library__heading">
            <div><p>MASTER CONTENT</p><h2>{libraryTitle}</h2></div>
            <button className="skills-primary-button" type="button" onClick={() => setValues({})}>{newLabel}</button>
          </div>

          <div className="skill-library__search">
            <label>Search</label>
            <input type="search" placeholder={searchPlaceholder} />
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
              <button type="button" className="is-active">Active</button>
              <button type="button">Archived</button>
            </div>
            <span>0 {countLabel}</span>
          </div>

          <div className="skill-library__results">
            <p className="skill-library__empty">Design mode: library data is not connected yet.</p>
          </div>

          <nav className="skill-library__pagination">
            <button type="button" disabled>Previous</button>
            <span>Page 1 of 1</span>
            <button type="button" disabled>Next</button>
          </nav>
        </aside>

        <section className="skill-editor">
          <header className="skill-editor__header">
            <div>
              <p>NEW {title.toUpperCase()} DRAFT</p>
              <h2>Untitled {title.replace(/s$/, "")}</h2>
              <span>Design mode · local only · nothing saves</span>
            </div>
            <div className="skill-editor__actions">
              <button type="button" onClick={() => setValues({})}>Reset Draft</button>
              <button className="skills-primary-button" type="button" disabled>Save Disabled</button>
            </div>
          </header>

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

          <fieldset className="skill-editor__content design-editor-content">
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
