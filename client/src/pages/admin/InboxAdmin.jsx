import { useState } from "react";
import { api } from "../../api";
import { formatStamp, useTitle } from "../../lib";
import { useCollection } from "./state";

export function InboxAdmin() {
  const { items, loading, error, setError, refresh } = useCollection("/admin/messages");
  const [active, setActive] = useState(null);
  useTitle("Inbox");

  async function open(item) {
    setActive(item);
    if (!item.read) {
      try {
        const updated = await api(`/admin/messages/${item.id}`, {
          method: "PATCH",
          body: JSON.stringify({ read: true }),
        });
        setActive(updated);
        await refresh();
      } catch (err) {
        setError(err.message);
      }
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api(`/admin/messages/${id}`, { method: "DELETE" });
      if (active?.id === id) setActive(null);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <p className="eyebrow">Inbox</p>
      <h1>Messages</h1>
      {error ? <p className="form-error">{error}</p> : null}
      <div className="split-admin" style={{ marginTop: "1rem" }}>
        <div className="panel">
          {loading ? <p className="muted">Loading…</p> : null}
          {!loading && !items.length ? <p className="muted">The contact form hasn't been used yet.</p> : null}
          <ul className="item-list">
            {items.map((item) => (
              <li key={item.id} className={active?.id === item.id ? "item-row is-on" : "item-row"}>
                <button type="button" className="linkish" onClick={() => open(item)}>
                  <strong className={item.read ? "" : "unread"}>{item.name}</strong>
                  <small> · {item.subject} · {formatStamp(item.createdAt)}</small>
                </button>
                <button type="button" className="danger-text" onClick={() => remove(item.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel">
          {active ? (
            <>
              <p className="eyebrow">{active.subject}</p>
              <h2 style={{ fontSize: "2rem" }}>{active.name}</h2>
              <p><a className="text-link" href={`mailto:${active.email}`}>{active.email}</a></p>
              <p className="muted">{formatStamp(active.createdAt)}</p>
              <p className="message" style={{ marginTop: "1rem" }}>{active.body}</p>
            </>
          ) : (
            <p className="muted">Open a message to read it.</p>
          )}
        </div>
      </div>
    </>
  );
}
