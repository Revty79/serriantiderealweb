"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { readUsers, writeUsers } from "@/lib/local-user-store";

const ROLE_LABELS = {
  admin: "Administrator",
  god: "G.O.D.",
  player: "Player",
} as const;

type Role = keyof typeof ROLE_LABELS;

export default function RoleManagementPage() {
  const [version, setVersion] = useState(0);
  const users = useMemo(() => {
    void version;
    return readUsers();
  }, [version]);

  function toggle(userId: string, role: Role) {
    writeUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              roles: user.roles.includes(role)
                ? user.roles.filter((entry) => entry !== role)
                : [...user.roles, role],
            }
          : user,
      ),
    );
    setVersion((value) => value + 1);
  }

  return (
    <main className="relative z-10 min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-3xl border border-white/10 bg-black/35 p-7 shadow-2xl backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.14em] text-purple-200">
            Administration / Permissions
          </p>
          <h1 className="font-evanescent mt-3 text-4xl text-slate-100">
            Role Management
          </h1>
          <p className="mt-3 text-slate-400">
            Prototype role assignments stored only in this browser.
          </p>
          <Link href="/admin" className="mt-4 inline-flex text-amber-200">
            ← Admin Dashboard
          </Link>
        </header>

        <section className="mt-8 space-y-4">
          {users.map((user) => (
            <article
              key={user.id}
              className="rounded-3xl border border-white/10 bg-black/35 p-6 shadow-xl"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl text-slate-100">{user.name}</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    @{user.username} · {user.email}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(Object.keys(ROLE_LABELS) as Role[]).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => toggle(user.id, role)}
                      className={
                        "rounded-full border px-4 py-2 text-sm transition " +
                        (user.roles.includes(role)
                          ? "border-amber-300/50 bg-amber-300/10 text-amber-100"
                          : "border-white/15 bg-black/20 text-slate-400")
                      }
                    >
                      {ROLE_LABELS[role]}
                    </button>
                  ))}
                </div>
              </div>
            </article>
          ))}

          {!users.length ? (
            <div className="rounded-3xl border border-dashed border-white/10 p-8 text-center text-slate-400">
              Create prototype users in User Management first.
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
