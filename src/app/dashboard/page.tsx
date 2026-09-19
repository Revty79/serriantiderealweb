import Link from "next/link";

const accessOptions = [
  {
    key: "admin",
    title: "ADMIN",
    subtitle: "System Administration",
    href: "/coming-soon?area=admin",
    description:
      "Manage Serrian Tide users, permissions, and system-level administration.",
  },
  {
    key: "heavens",
    title: "THE HEAVENS",
    subtitle: "G.O.D. Access",
    href: "/coming-soon?area=heavens",
    description:
      "Enter the G.O.D. side of Serrian Tide to create, manage, and run the systems behind the world.",
  },
  {
    key: "realms",
    title: "THE REALMS",
    subtitle: "Player Access",
    href: "/coming-soon?area=realms",
    description:
      "Enter the player-facing side of Serrian Tide for characters, campaigns, and play.",
  },
  {
    key: "crossroads",
    title: "THE CROSSROADS",
    subtitle: "Communication Center",
    href: "/coming-soon?area=crossroads",
    description:
      "Join global discussions, continue Campaign conversations, and send direct messages from one shared workspace.",
  },
];

export default function DashboardPage() {
  return (
    <main className="access-page">
      <section className="access-shell">
        <div className="access-heading">
          <Link href="/" className="access-brand">
            Serrian Tide
          </Link>

          <h1 className="font-evanescent">Choose Your Path</h1>

          <p>
            Welcome, Adventurer. Choose the path you wish to enter.
          </p>
        </div>

        <div
          className="access-grid"
          data-card-count={accessOptions.length}
          aria-label="Serrian Tide access paths"
        >
          {accessOptions.map((option) => (
            <Link
              key={option.key}
              href={option.href}
              className="access-card"
            >
              <div>
                <span className="access-card-subtitle">
                  {option.subtitle}
                </span>

                <h2>{option.title}</h2>

                <p>{option.description}</p>
              </div>

              <div className="access-card-enter">
                <span>Enter</span>
                <strong aria-hidden="true">→</strong>
              </div>
            </Link>
          ))}
        </div>

        <div className="access-return">
          <Link href="/login">← Return to login</Link>
        </div>
      </section>
    </main>
  );
}
