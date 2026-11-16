import { todayISO, useTitle, youtubeId } from "../../lib";
import { Field, ItemList, SaveRow, bind } from "./Fields";
import { useEditor } from "./state";

const empty = {
  title: "",
  youtubeUrl: "",
  description: "",
  publishedAt: todayISO(),
  featured: false,
};

export function VideosAdmin() {
  const editor = useEditor("videos", empty);
  const field = (key) => bind(editor.form, editor.setForm, key);
  const previewId = youtubeId(editor.form.youtubeUrl);
  useTitle("Videos");

  return (
    <>
      <p className="eyebrow">YouTube</p>
      <h1>{editor.form.id ? "Edit video" : "New video"}</h1>
      <p className="lede">Paste a YouTube link. The homepage plays whichever video you mark as featured.</p>
      <div className="split-admin" style={{ marginTop: "1rem" }}>
        <form className="panel" onSubmit={editor.save}>
          {editor.error ? <p className="form-error">{editor.error}</p> : null}
          <Field label="Title"><input required {...field("title")} /></Field>
          <Field label="YouTube link">
            <input required placeholder="https://www.youtube.com/watch?v=…" {...field("youtubeUrl")} />
          </Field>
          {previewId ? (
            <div className="frame preview-frame">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${previewId}`}
                title="Preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null}
          <Field label="Publish date"><input type="date" required {...field("publishedAt")} /></Field>
          <Field label="Caption"><textarea rows={4} {...field("description")} /></Field>
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
                <small>{item.featured ? " · Homepage" : ""}</small>
              </>
            )}
          />
        </div>
      </div>
    </>
  );
}
