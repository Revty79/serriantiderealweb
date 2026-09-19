"use client";

import Link from "next/link";
import { useMemo } from "react";
import { readCampaigns, readCharacters, readRaces } from "@/lib/local-character-store";
import { readSkills } from "@/lib/local-skill-store";
import { readDerivedAbilities } from "@/lib/local-derived-store";
import { readItems } from "@/lib/local-item-store";
import { readCreatures } from "@/lib/local-creature-store";
import { readNpcs } from "@/lib/local-npc-store";
import { readUsers } from "@/lib/local-user-store";
import { readSpells } from "@/lib/local-spell-store";

function readArray(key: string) {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export default function SystemOverviewPage() {
  const stats = useMemo(
    () => [
      ["Users", readUsers().length],
      ["Campaigns", readCampaigns().length],
      ["Characters", readCharacters().length],
      ["Races", readRaces().length],
      ["Skills", readSkills().length],
      ["Derived Abilities", readDerivedAbilities().length],
      ["Equipment", readItems("equipment").length],
      ["Inventory", readItems("inventory").length],
      ["Creatures", readCreatures().length],
      ["NPCs", readNpcs().length],
      ["Shops", readArray("serrian-tide:prototype:shops:v1").length],
      ["Towns", readArray("serrian-tide:prototype:towns:v1").length],
      ["Saved Spells", readSpells().length],
    ] as const,
    [],
  );

  return (
    <main className="relative z-10 min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-3xl border border-white/10 bg-black/35 p-7 shadow-2xl backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.14em] text-purple-200">
            Administration / Prototype Health
          </p>
          <h1 className="font-evanescent mt-3 text-4xl text-slate-100">
            System Overview
          </h1>
          <p className="mt-3 text-slate-400">
            Current disposable browser-local Serrian Tide prototype state.
          </p>
          <Link href="/admin" className="mt-4 inline-flex text-amber-200">
            ← Admin Dashboard
          </Link>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map(([label, count]) => (
            <article
              key={label}
              className="rounded-2xl border border-white/10 bg-black/35 p-5"
            >
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                {label}
              </p>
              <p className="mt-3 text-3xl text-amber-200">{count}</p>
              <p className="mt-2 text-xs text-slate-500">Local prototype records</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-black/35 p-7">
          <h2 className="text-2xl text-slate-100">Persistence Strategy</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-400">
            The current build intentionally uses browser-local disposable data.
            PostgreSQL and Drizzle will be introduced only after the authoring models
            are approved. The development database can then be recreated from a
            consolidated schema whenever migration history becomes noisy.
          </p>
        </section>
      </div>
    </main>
  );
}
