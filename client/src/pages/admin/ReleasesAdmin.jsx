import { todayISO, useTitle } from "../../lib";
import { Field, ItemList, SaveRow, bind } from "./Fields";
import { useEditor } from "./state";

const empty = {
  title: "",
  type: "Single",
  releaseDate: todayISO(),
  coverImage: "",
  description: "",
  tracklist: "",
  spotifyUrl: "",
  appleUrl: "",
  youtubeUrl: "",
  featured: false,
};

export function ReleasesAdmin() {
  const editor = useEditor("releases", empty);
  const field = (key) => bind(editor.form, editor.setForm, key);
  useTitle("Releases");

  return (
    <>
      <p className="eyebrow">Catalog</p>
      <h1>{editor.form.id ? "Edit release" : "New release"}</h1>
      <div className="split-admin" style={{ marginTop: "1rem" }}>
        <form className="panel" onSubmit={editor.save}>
          {editor.error ? <p className="form-error">{editor.error}</p> : null}
          {editor.form.coverImage ? <img className="thumb" src={editor.form.coverImage} alt="" /> : null}
          <Field label="Title"><input required {...field("title")} /></Field>
          <div className="form-grid">
            <Field label="Type">
              <select {...field("type")}>
                <option>Single</option>
                <option>EP</option>
                <option>Album</option>
              </select>
            </Field>
            <Field label="Release date"><input type="date" required {...field("releaseDate")} /></Field>
          </div>
          <Field label="Cover image URL"><input placeholder="https://" {...field("coverImage")} /></Field>
          <Field label="Description"><textarea rows={4} {...field("description")} /></Field>
          <Field label="Tracks, one per line, with an optional time after |">
            <textarea rows={5} placeholder={"Beautiful Love"} {...field("tracklist")} />
          </Field>
          <Field label="Spotify link"><input placeholder="https://" {...field("spotifyUrl")} /></Field>
          <Field label="Apple Music link"><input placeholder="https://" {...field("appleUrl")} /></Field>
          <Field label="YouTube link"><input placeholder="https://" {...field("youtubeUrl")} /></Field>
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
                <strong>{item.title}</strong>
                <small> · {item.type}{item.featured ? " · Featured" : ""}</small>
              </>
            )}
          />
        </div>
      </div>
    </>
  );
}
