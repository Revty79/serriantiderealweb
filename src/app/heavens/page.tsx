import Link from "next/link";

const coreTools = [
  { title: "RACES", subtitle: "Peoples", description: "Create and manage playable Races, attribute caps, movement, quirks, and racial Skills.", area: "races" },
  { title: "SKILLS", subtitle: "Abilities", description: "Manage every Serrian Tide Skill, including magical and specialized abilities.", area: "skills" },
  { title: "DERIVED ABILITIES", subtitle: "Milestones", description: "Create abilities automatically gained when Characters meet campaign-approved mechanical requirements.", area: "derived-abilities" },
  { title: "EQUIPMENT", subtitle: "Arsenal", description: "Create weapons, armor, and general Equipment with full combat profiles.", area: "equipment" },
  { title: "INVENTORY", subtitle: "Items", description: "Create and manage all non-equipment Inventory content and relationships.", area: "inventory" },
  { title: "CREATURES", subtitle: "Bestiary", description: "Create and manage Creatures, attacks, hit locations, defenses, variants, and CR.", area: "creatures" },
  { title: "SHOP BUILDER", subtitle: "Campaign Commerce", description: "Create Campaign Shops, assign persistent NPC staff, and curate authorized Equipment and Inventory offerings.", area: "shops" },
  { title: "TOWN BUILDER", subtitle: "Campaign Places", description: "Organize Campaign Shops, persistent NPCs, and descriptive Places into living Town references.", area: "towns" },
  { title: "NPCS", subtitle: "Characters", description: "Create Race NPCs and independent Creature NPC individuals inside Campaigns.", area: "npcs", wide: true },
];

export default function HeavensPage() {
  return (
    <main className="relative z-10 min-h-screen px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <header className="grid overflow-hidden rounded-3xl border border-white/10 bg-black/35 shadow-2xl backdrop-blur-md md:grid-cols-[0.9fr_1.1fr]">
          <div className="flex min-h-[180px] items-center justify-center px-8 py-8">
            <Link href="/dashboard" className="text-center">
              <h1 className="font-portcullion bg-gradient-to-r from-purple-500 via-amber-300 to-purple-500 bg-clip-text text-5xl tracking-tight text-transparent drop-shadow-lg sm:text-6xl">
                Serrian Tide
              </h1>
            </Link>
          </div>

          <div className="flex flex-col justify-center border-t border-white/10 px-8 py-8 md:border-l md:border-t-0 lg:px-12">
            <p className="text-xs uppercase tracking-[0.14em] text-purple-200">G.O.D. Creation Portal</p>
            <h2 className="font-evanescent mt-3 bg-gradient-to-r from-slate-100 via-amber-100 to-slate-100 bg-clip-text text-4xl text-transparent sm:text-5xl">
              The Heavens
            </h2>
            <p className="mt-4 text-sm text-slate-400">
              Welcome, <span className="text-amber-200">Adventurer</span>
              <span className="text-slate-300"> — G.O.D.</span>
            </p>
          </div>
        </header>

        <section className="mt-7 rounded-3xl border border-white/10 bg-black/35 p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-purple-200">Working Context</p>
              <h3 className="mt-2 text-3xl text-slate-100">Campaign Control</h3>
            </div>
            <p className="max-w-md text-sm text-slate-300 sm:text-right">
              Select the Campaign, Player, and Character you are currently working with.
            </p>
          </div>

          <div className="mt-3">
            <ControlRow label="Campaign">
              <select disabled className="h-11 w-full rounded-xl border border-white/15 bg-black/50 px-4 text-sm text-slate-300 outline-none backdrop-blur-sm disabled:opacity-70">
                <option>No Campaigns Yet</option>
              </select>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <button disabled className="min-h-10 rounded-full border border-white/15 bg-black/20 px-4 py-2.5 text-sm text-slate-300 opacity-40">Campaign Information</button>
                <Link href="/coming-soon?area=campaign-settings" className="min-h-10 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2.5 text-sm text-amber-100/80">Edit Campaign</Link>
                <Link href="/coming-soon?area=new-campaign" className="min-h-10 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2.5 text-sm text-amber-100/80">Create Campaign</Link>
              </div>
            </ControlRow>

            <ControlRow label="Player">
              <select disabled className="h-11 w-full rounded-xl border border-white/15 bg-black/50 px-4 text-sm text-slate-300 outline-none backdrop-blur-sm disabled:opacity-50">
                <option>Select a Campaign First</option>
              </select>
              <span className="text-xs text-slate-300 lg:text-right">0 Campaign Players</span>
            </ControlRow>

            <ControlRow label="Character" last>
              <select disabled className="h-11 w-full rounded-xl border border-white/15 bg-black/50 px-4 text-sm text-slate-300 outline-none backdrop-blur-sm disabled:opacity-50">
                <option>Select a Player First</option>
              </select>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <button disabled className="min-h-10 rounded-full border border-amber-300/50 bg-amber-300/10 px-4 text-sm text-amber-100 opacity-40">Active</button>
                <button disabled className="min-h-10 rounded-full border border-white/15 px-4 text-sm text-slate-300 opacity-40">Archived</button>
                <button disabled className="min-h-10 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 text-sm text-amber-100/80 opacity-40">New Character</button>
                <span className="min-h-10 rounded-full border border-white/10 px-4 py-2.5 text-sm text-slate-400">Edit Character</span>
                <span className="min-h-10 rounded-full border border-white/10 px-4 py-2.5 text-sm text-slate-400">Character lifecycle</span>
              </div>
            </ControlRow>
          </div>
        </section>

        <section className="mt-7">
          <Link
            href="/coming-soon?area=tabletop"
            className="group grid gap-5 overflow-hidden rounded-3xl border border-amber-300/20 bg-gradient-to-r from-purple-950/35 via-black/40 to-teal-950/25 p-6 shadow-2xl backdrop-blur-md transition hover:border-amber-300/45 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-purple-200">Live Table Management</p>
              <h3 className="mt-2 text-3xl text-slate-100">Tabletop Operations</h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Plan, start, complete, and reopen Campaign Sessions while persistent Character and NPC state remains authoritative.
              </p>
            </div>
            <span className="text-sm text-amber-200">Open Sessions →</span>
          </Link>
        </section>

        <section className="mt-10">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-purple-200">Creation Libraries</p>
              <h3 className="mt-2 text-3xl text-slate-100">Create &amp; Manage <span className="font-portcullion">Serrian Tide</span></h3>
            </div>
            <p className="text-sm text-slate-300">Build the systems behind the world.</p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {coreTools.map((tool) => (
              <Link
                key={tool.title}
                href={"/heavens/" + tool.area}
                className={"group relative block min-h-[160px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 p-6 shadow-xl backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-amber-300/40 hover:bg-black/45 hover:shadow-2xl" + (tool.wide ? " text-center md:col-span-2" : "")}
              >
                <div className="absolute -bottom-14 -right-14 h-32 w-32 rounded-full border border-purple-400/10 transition duration-300 group-hover:scale-110 group-hover:border-amber-300/20" aria-hidden="true" />
                <span className="absolute right-5 top-4 text-xl text-amber-300/40 transition group-hover:text-amber-300/70" aria-hidden="true">◇</span>
                <p className="text-xs uppercase tracking-[0.14em] text-purple-300">{tool.subtitle}</p>
                <h4 className="mt-3 text-2xl text-slate-100 transition group-hover:text-amber-200">{tool.title}</h4>
                <p className={"mt-3 max-w-[90%] text-sm leading-6 text-slate-400" + (tool.wide ? " mx-auto" : "")}>{tool.description}</p>
                <p className="mt-5 text-xs font-medium tracking-wide text-amber-200/60 transition group-hover:text-amber-200">Creation tools →</p>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
          <Link href="/dashboard" className="rounded-full border border-amber-300/40 bg-amber-300/10 px-5 py-2.5 text-sm text-amber-100 backdrop-blur-sm transition hover:border-amber-300/70 hover:bg-amber-300/20">← Return to Paths</Link>
          <span className="font-portcullion hidden text-xl text-slate-400 sm:block">Serrian Tide</span>
        </footer>
      </div>
    </main>
  );
}

function ControlRow({
  label,
  children,
  last = false,
}: {
  label: string;
  children: [React.ReactNode, React.ReactNode];
  last?: boolean;
}) {
  return (
    <div className={"grid gap-3 py-4 sm:grid-cols-[110px_minmax(0,1fr)] lg:grid-cols-[110px_minmax(0,1fr)_auto] lg:items-center " + (last ? "" : "border-b border-white/10")}>
      <span className="text-lg text-slate-200">{label}</span>
      {children[0]}
      <div className="sm:col-start-2 lg:col-start-auto">{children[1]}</div>
    </div>
  );
}
