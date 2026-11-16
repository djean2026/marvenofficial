import { useTitle } from "../../lib";
import { Field, ItemList, SaveRow, bind } from "./Fields";
import { useEditor } from "./state";

const empty = { quote: "", source: "", featured: false };

export function PressAdmin() {
  const editor = useEditor("quotes", empty);
  const field = (key) => bind(editor.form, editor.setForm, key);
  useTitle("Press");

  return (
    <>
      <p className="eyebrow">Press</p>
      <h1>{editor.form.id ? "Edit quote" : "New quote"}</h1>
      <p className="lede">The featured line is the big quote on the homepage. The about page shows every line.</p>
      <div className="split-admin" style={{ marginTop: "1rem" }}>
        <form className="panel" onSubmit={editor.save}>
          {editor.error ? <p className="form-error">{editor.error}</p> : null}
          <Field label="Quote"><textarea required rows={4} {...field("quote")} /></Field>
          <Field label="Source"><input required placeholder="Night Desk" {...field("source")} /></Field>
          <label className="check">
            <input
              type="checkbox"
              checked={Boolean(editor.form.featured)}
              onChange={(event) => editor.setForm({ ...editor.form, featured: event.target.checked })}
            />
            <span>Feature on the homepage</span>
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
                <strong>{item.source}</strong>
                <small>{item.featured ? " · Homepage" : ""}</small>
              </>
            )}
          />
        </div>
      </div>
    </>
  );
}
