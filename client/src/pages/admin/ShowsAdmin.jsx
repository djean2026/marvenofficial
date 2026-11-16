import { todayISO, useTitle } from "../../lib";
import { Field, ItemList, SaveRow, bind } from "./Fields";
import { useEditor } from "./state";

const empty = {
  title: "",
  venue: "",
  city: "",
  date: todayISO(),
  time: "",
  ticketUrl: "",
  soldOut: false,
};

export function ShowsAdmin() {
  const editor = useEditor("events", empty);
  const field = (key) => bind(editor.form, editor.setForm, key);
  useTitle("Shows");

  return (
    <>
      <p className="eyebrow">Tour</p>
      <h1>{editor.form.id ? "Edit show" : "New show"}</h1>
      <div className="split-admin" style={{ marginTop: "1rem" }}>
        <form className="panel" onSubmit={editor.save}>
          {editor.error ? <p className="form-error">{editor.error}</p> : null}
          <Field label="Tour or headline"><input required placeholder="Live" {...field("title")} /></Field>
          <div className="form-grid">
            <Field label="City"><input required {...field("city")} /></Field>
            <Field label="Venue"><input required {...field("venue")} /></Field>
          </div>
          <div className="form-grid">
            <Field label="Date"><input type="date" required {...field("date")} /></Field>
            <Field label="Time"><input placeholder="8:00 PM" {...field("time")} /></Field>
          </div>
          <Field label="Ticket link"><input placeholder="https:// — leave blank to send fans to the contact form" {...field("ticketUrl")} /></Field>
          <label className="check">
            <input
              type="checkbox"
              checked={Boolean(editor.form.soldOut)}
              onChange={(event) => editor.setForm({ ...editor.form, soldOut: event.target.checked })}
            />
            <span>Sold out</span>
          </label>
          <SaveRow saving={editor.saving} notice={editor.notice} onClear={editor.clear} />
        </form>
        <div className="panel">
          <ItemList
            items={editor.items}
            loading={editor.loading}
            activeId={editor.form.id}
            onEdit={editor.edit}
            onDelete={editor.remove}
            render={(item) => (
              <>
                <strong>{item.city}</strong>
                <small> · {item.date} · {item.venue}</small>
              </>
            )}
          />
        </div>
      </div>
    </>
  );
}
