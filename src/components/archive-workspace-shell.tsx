import Link from "next/link";

type Filter = { label: string; options: string[] };

export function ArchiveWorkspaceShell({
  pageClass, workspaceClass, brandClass, breadcrumb, title, libraryTitle,
  newLabel, searchPlaceholder, filters, countLabel, emptyEyebrow,
  emptyTitle, emptyDescription,
}: {
  pageClass: string; workspaceClass: string; brandClass: string;
  breadcrumb: string; title: string; libraryTitle: string; newLabel: string;
  searchPlaceholder: string; filters: Filter[]; countLabel: string;
  emptyEyebrow: string; emptyTitle: string; emptyDescription: string;
}) {
  const searchId = title.toLowerCase().replaceAll(" ", "-") + "-search";
  return (
    <main className={"skills-page " + pageClass}>
      <header className="skills-page__header">
        <div className="skills-page__brand">
          <Link href="/heavens" className={"font-portcullion " + brandClass}>Serrian<br />Tide</Link>
        </div>
        <div className="skills-page__title">
          <p>{breadcrumb}</p><h1>{title}</h1><span>G.O.D. archive · Adventurer</span>
        </div>
        <div className="skills-page__navigation"><Link href="/heavens">Back to The Heavens</Link></div>
      </header>

      <div className={"skills-workspace " + workspaceClass}>
        <aside className="skill-library">
          <div className="skill-library__heading">
            <div><p>MASTER CONTENT</p><h2>{libraryTitle}</h2></div>
            <button className="skills-primary-button" type="button" disabled>{newLabel}</button>
          </div>

          <div className="skill-library__search">
            <label htmlFor={searchId}>Search</label>
            <input id={searchId} type="search" placeholder={searchPlaceholder} disabled />
          </div>

          {filters.length ? (
            <div className="skill-library__filters">
              {filters.map((filter) => (
                <label key={filter.label}>
                  <span>{filter.label}</span>
                  <select disabled defaultValue="">
                    <option value="">All</option>
                    {filter.options.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
              ))}
            </div>
          ) : null}

          <div className="skill-library__toolbar">
            <div className="skill-library__view-toggle">
              <button type="button" className="is-active" disabled>Active</button>
              <button type="button" disabled>Archived</button>
            </div>
            <span>0 {countLabel}</span>
          </div>

          <div className="skill-library__results">
            <p className="skill-library__empty">No records are connected yet.</p>
          </div>

          <nav className="skill-library__pagination">
            <button type="button" disabled>Previous</button>
            <span>Page 1 of 1</span>
            <button type="button" disabled>Next</button>
          </nav>
        </aside>

        <section className="skill-editor skill-editor--empty">
          <p>{emptyEyebrow}</p>
          <h2>{emptyTitle}</h2>
          <span>{emptyDescription}</span>
        </section>
      </div>
    </main>
  );
}
