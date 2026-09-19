import Link from "next/link";

export const metadata = {
  title: "The Crossroads | Serrian Tide",
  description: "Serrian Tide's role-neutral communication center.",
};

export default function ChatPage() {
  return (
    <main className="crossroads-page">
      <div className="crossroads-shell">
        <header className="crossroads-hero">
          <div className="crossroads-brand-block">
            <Link href="/dashboard" className="crossroads-brand">Serrian Tide</Link>
            <p>Communication Center</p>
          </div>
          <div className="crossroads-copy">
            <p className="portal-eyebrow">Shared Communications</p>
            <h1 className="font-evanescent">The Crossroads</h1>
            <span>Global, Campaign, and direct conversations meet here.</span>
          </div>
          <div className="crossroads-account">
            <span>Signed in as</span>
            <strong>Adventurer</strong>
            <Link href="/dashboard">Return to Paths</Link>
          </div>
        </header>

        <section className="crossroads-workspace">
          <aside className="crossroads-sidebar">
            <div className="room-group">
              <h2>Global</h2>
              <button className="room-button is-active" type="button">
                <span><strong>The Crossroads</strong><small>Global discussion</small></span>
                <em>Current</em>
              </button>
            </div>

            <div className="room-group">
              <h2>Campaign Rooms</h2>
              <p>No Campaign rooms yet.</p>
            </div>

            <div className="room-group">
              <h2>Direct Messages</h2>
              <button className="small-room-action" type="button" disabled>New conversation</button>
              <p>Direct messages will appear here.</p>
            </div>
          </aside>

          <div className="crossroads-conversation">
            <header>
              <div>
                <p>GLOBAL ROOM</p>
                <h2>The Crossroads</h2>
                <span>Serrian Tide community discussion</span>
              </div>
              <span className="chat-status"><i /> Build mode</span>
            </header>

            <div className="crossroads-history">
              <div className="crossroads-empty">
                <span className="font-evanescent">The road is quiet for now.</span>
                <p>Messages will appear here once Crossroads is connected to accounts and the database.</p>
              </div>
            </div>

            <div className="crossroads-composer">
              <label htmlFor="chat-draft">Message</label>
              <div>
                <textarea id="chat-draft" disabled placeholder="Crossroads chat is not connected yet." />
                <button disabled type="button">Send</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
