import { useState } from "react";
import { api } from "../../api";
import { formatStamp, useTitle } from "../../lib";
import { useCollection } from "./state";

export function FansAdmin() {
  const { items, loading, error, setError, refresh } = useCollection("/admin/subscribers");
  const [notice, setNotice] = useState("");
  useTitle("Mailing list");

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(items.map((item) => item.email).join("\n"));
      setNotice("Copied every address.");
    } catch {
      setNotice("Couldn't copy from this browser.");
    }
  }

  async function remove(id) {
    if (!window.confirm("Remove this address from the list?")) return;
    try {
      await api(`/admin/subscribers/${id}`, { method: "DELETE" });
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <p className="eyebrow">Mailing list</p>
      <h1>Fans</h1>
      <p className="lede">Addresses from the signup on the homepage and in the footer. Copy them into whatever you use to send mail.</p>
      {error ? <p className="form-error">{error}</p> : null}
      <div className="save-row" style={{ margin: "1rem 0" }}>
        <button className="btn btn-gold" type="button" onClick={copyAll} disabled={!items.length}>Copy all</button>
        {notice ? <p className="notice">{notice}</p> : null}
      </div>
      <div className="panel">
        {loading ? <p className="muted">Loading…</p> : null}
        {!loading && !items.length ? <p className="muted">No one has joined yet.</p> : null}
        <ul className="item-list">
          {items.map((item) => (
            <li key={item.id} className="item-row">
              <span>
                <strong>{item.email}</strong>
                <small> · {formatStamp(item.createdAt)}</small>
              </span>
              <button type="button" className="danger-text" onClick={() => remove(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
