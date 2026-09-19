"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { readCampaigns, readCharacters } from "@/lib/local-character-store";
import { readUsers } from "@/lib/local-user-store";

export function HeavensLocalCampaignControl() {
  const campaigns = useMemo(() => readCampaigns().filter((campaign) => !campaign.archivedAt), []);
  const users = useMemo(() => readUsers().filter((user) => user.roles.includes("player")), []);
  const characters = useMemo(() => readCharacters().filter((character) => !character.archivedAt), []);
  const [campaignId, setCampaignId] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [characterId, setCharacterId] = useState("");
  const [informationOpen, setInformationOpen] = useState(false);

  const campaign = campaigns.find((entry) => String(entry.id) === campaignId) ?? null;
  const campaignCharacters = characters.filter((entry) => String(entry.campaignId) === campaignId);
  const playerCharacters = campaignCharacters.filter((entry) => (entry.playerUserId || "prototype-admin") === playerId);
  const selectedCharacter = playerCharacters.find((entry) => String(entry.id) === characterId) ?? null;

  return (
    <div className="mt-3">
      <ControlRow label="Campaign">
        <select
          value={campaignId}
          onChange={(event) => {
            setCampaignId(event.target.value);
            setPlayerId("");
            setCharacterId("");
            setInformationOpen(false);
          }}
          className="h-11 w-full rounded-xl border border-white/15 bg-black/50 px-4 text-sm text-slate-300 outline-none backdrop-blur-sm"
        >
          <option value="">{campaigns.length ? "No Campaign Selected" : "No Local Campaigns Yet"}</option>
          {campaigns.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
        </select>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <button
            type="button"
            disabled={!campaign}
            onClick={() => setInformationOpen((value) => !value)}
            className="min-h-10 rounded-full border border-white/15 bg-black/20 px-4 py-2.5 text-sm text-slate-300 disabled:opacity-40"
          >
            Campaign Information
          </button>
          <Link href={campaign ? "/heavens/campaigns?campaign=" + campaign.id : "/heavens/campaigns"} className="min-h-10 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2.5 text-sm text-amber-100/80">
            Edit Campaign
          </Link>
          <Link href="/heavens/campaigns" className="min-h-10 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2.5 text-sm text-amber-100/80">
            Create Campaign
          </Link>
        </div>
      </ControlRow>

      {informationOpen && campaign ? (
        <section className="mb-2 rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-purple-200">Campaign Information</p>
          <h3 className="mt-1 text-2xl text-slate-100">{campaign.name}</h3>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
            <div><dt className="text-slate-400">Characters</dt><dd className="mt-1 text-slate-200">{campaignCharacters.length}</dd></div>
            <div><dt className="text-slate-400">Starting Credits</dt><dd className="mt-1 text-slate-200">{campaign.startingCreditAmount}</dd></div>
            <div><dt className="text-slate-400">Campaign Races</dt><dd className="mt-1 text-slate-200">{campaign.campaignRaceIds?.length ?? 0}</dd></div>
            <div><dt className="text-slate-400">Playable Races</dt><dd className="mt-1 text-slate-200">{campaign.allowedRaceIds?.length ?? 0}</dd></div>
          </dl>
        </section>
      ) : null}

      <ControlRow label="Player">
        <select
          value={playerId}
          disabled={!campaignId}
          onChange={(event) => {
            setPlayerId(event.target.value);
            setCharacterId("");
          }}
          className="h-11 w-full rounded-xl border border-white/15 bg-black/50 px-4 text-sm text-slate-300 outline-none backdrop-blur-sm disabled:opacity-50"
        >
          <option value="">{!campaignId ? "Select a Campaign First" : "No Player Selected"}</option>
          {users.map((user) => <option key={user.id} value={user.id}>{user.name || user.username}</option>)}
        </select>
        <span className="text-xs text-slate-300 lg:text-right">{users.length} Local Players</span>
      </ControlRow>

      <ControlRow label="Character" last>
        <select
          value={characterId}
          disabled={!playerId}
          onChange={(event) => setCharacterId(event.target.value)}
          className="h-11 w-full rounded-xl border border-white/15 bg-black/50 px-4 text-sm text-slate-300 outline-none backdrop-blur-sm disabled:opacity-50"
        >
          <option value="">{!playerId ? "Select a Player First" : "No Character Selected"}</option>
          {playerCharacters.map((character) => <option key={character.id} value={character.id}>{character.name}</option>)}
        </select>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          {campaignId && playerId ? (
            <Link href={"/realms/characters/new?campaign=" + campaignId + "&player=" + encodeURIComponent(playerId)} className="min-h-10 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2.5 text-sm text-amber-100/80">
              New Character
            </Link>
          ) : <span className="min-h-10 rounded-full border border-white/10 px-4 py-2.5 text-sm text-slate-500">New Character</span>}
          {selectedCharacter ? (
            <Link href={"/realms/characters/" + selectedCharacter.id} className="min-h-10 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2.5 text-sm text-amber-100/80">
              Edit Character
            </Link>
          ) : <span className="min-h-10 rounded-full border border-white/10 px-4 py-2.5 text-sm text-slate-500">Edit Character</span>}
        </div>
      </ControlRow>
    </div>
  );
}

function ControlRow({ label, children, last = false }: { label: string; children: [React.ReactNode, React.ReactNode]; last?: boolean }) {
  return (
    <div className={"grid gap-3 py-4 sm:grid-cols-[110px_minmax(0,1fr)] lg:grid-cols-[110px_minmax(0,1fr)_auto] lg:items-center " + (last ? "" : "border-b border-white/10")}>
      <span className="text-lg text-slate-200">{label}</span>
      {children[0]}
      <div className="sm:col-start-2 lg:col-start-auto">{children[1]}</div>
    </div>
  );
}
