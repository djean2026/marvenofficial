export function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function SaveRow({ saving, notice, onClear }) {
  return (
    <div className="save-row">
      <button className="btn btn-gold" type="submit" disabled={saving}>
        {saving ? "Saving…" : "Save"}
      </button>
      {onClear ? (
        <button className="btn btn-ghost" type="button" onClick={onClear}>
          Clear
        </button>
      ) : null}
      {notice ? <p className="notice" role="status">{notice}</p> : null}
    </div>
  );
}

export function ItemList({ items, loading, activeId, onEdit, onDelete, render }) {
  if (loading) return <p className="muted">Loading…</p>;
  if (!items.length) return <p className="muted">Nothing here yet.</p>;
  return (
    <ul className="item-list">
      {items.map((item) => (
        <li key={item.id} className={item.id === activeId ? "item-row is-on" : "item-row"}>
          <button type="button" className="linkish" onClick={() => onEdit(item)}>
            {render(item)}
          </button>
          <button type="button" className="danger-text" onClick={() => onDelete(item.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export function bind(form, setForm, key) {
  return {
    value: form[key] ?? "",
    onChange: (event) => setForm({ ...form, [key]: event.target.value }),
  };
}
