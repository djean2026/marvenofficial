import { Link } from "react-router-dom";
import { useTitle } from "../../lib";
import { Field, ItemList, SaveRow, bind } from "./Fields";
import { useEditor } from "./state";

const empty = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  coverImage: "",
  published: true,
};

export function JournalAdmin() {
  const editor = useEditor("posts", empty);
  const field = (key) => bind(editor.form, editor.setForm, key);
  useTitle("Journal");

  return (
    <>
      <p className="eyebrow">Journal</p>
      <h1>{editor.form.id ? "Edit note" : "New note"}</h1>
      <p className="lede">Post anything — a letter, a date change, a thank-you. Unpublished notes stay off the site.</p>
      <div className="split-admin" style={{ marginTop: "1rem" }}>
        <form className="panel" onSubmit={editor.save}>
          {editor.error ? <p className="form-error">{editor.error}</p> : null}
          <Field label="Title"><input required {...field("title")} /></Field>
          <Field label="Slug, optional"><input placeholder="Filled in from the title if you leave it blank" {...field("slug")} /></Field>
          <Field label="Excerpt"><textarea required rows={3} {...field("excerpt")} /></Field>
          <Field label="Note"><textarea required rows={12} {...field("body")} /></Field>
          <Field label="Cover image URL"><input placeholder="https://" {...field("coverImage")} /></Field>
          <label className="check">
            <input
              type="checkbox"
              checked={Boolean(editor.form.published)}
              onChange={(event) => editor.setForm({ ...editor.form, published: event.target.checked })}
            />
            <span>Published</span>
          </label>
          <SaveRow saving={editor.saving} notice={editor.notice} onClear={editor.clear} />
          {editor.form.slug ? (
            <p style={{ marginTop: "0.8rem" }}>
              <Link className="text-link" to={`/journal/${editor.form.slug}`}>View on the site</Link>
            </p>
          ) : null}
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
                <small>{item.published ? "" : " · Draft"}</small>
              </>
            )}
          />
        </div>
      </div>
    </>
  );
}
