import { useEffect, useState } from "react";
import { api } from "../../api";
import { useTitle } from "../../lib";
import { Field, SaveRow, bind } from "./Fields";

export function SettingsAdmin() {
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [password, setPassword] = useState({ current: "", next: "" });
  const [passwordNotice, setPasswordNotice] = useState("");
  const [passwordError, setPasswordError] = useState("");
  useTitle("Site");

  useEffect(() => {
    api("/site")
      .then(setForm)
      .catch((err) => setError(err.message));
  }, []);

  if (!form) {
    return error ? <p className="form-error">{error}</p> : <p className="muted">Loading site settings…</p>;
  }

  const field = (key) => bind(form, setForm, key);

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    setError("");
    try {
      const saved = await api("/admin/settings", { method: "PUT", body: JSON.stringify(form) });
      setForm(saved);
      setNotice("Site updated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function changePassword(event) {
    event.preventDefault();
    setPasswordNotice("");
    setPasswordError("");
    try {
      await api("/admin/password", { method: "POST", body: JSON.stringify(password) });
      setPassword({ current: "", next: "" });
      setPasswordNotice("Password changed.");
    } catch (err) {
      setPasswordError(err.message);
    }
  }

  return (
    <>
      <p className="eyebrow">Site</p>
      <h1>The front of house.</h1>
      <p className="lede">Name, photos, bio, and the links in the footer. Image fields take a full https address.</p>
      <form className="panel" style={{ marginTop: "1rem" }} onSubmit={save}>
        {error ? <p className="form-error">{error}</p> : null}
        <div className="form-grid">
          <Field label="Artist name"><input required {...field("artistName")} /></Field>
          <Field label="Location"><input {...field("location")} /></Field>
        </div>
        <Field label="Tagline"><input required {...field("tagline")} /></Field>
        <Field label="Hero kicker"><input {...field("heroKicker")} /></Field>
        <Field label="Short bio"><textarea required rows={3} {...field("shortBio")} /></Field>
        <Field label="Full bio"><textarea required rows={10} {...field("bio")} /></Field>
        <Field label="Newsletter line"><input {...field("newsletterNote")} /></Field>
        <div className="form-grid">
          <Field label="Public email"><input type="email" {...field("email")} /></Field>
          <Field label="Booking email"><input type="email" {...field("bookingEmail")} /></Field>
        </div>
        <div className="form-grid">
          <Field label="Hero image"><input placeholder="https://" {...field("heroImage")} /></Field>
          <Field label="Portrait"><input placeholder="https://" {...field("portraitImage")} /></Field>
        </div>
        <div className="form-grid">
          <Field label="Instagram"><input placeholder="https://" {...field("instagram")} /></Field>
          <Field label="Facebook"><input placeholder="https://" {...field("facebook")} /></Field>
          <Field label="TikTok"><input placeholder="https://" {...field("tiktok")} /></Field>
          <Field label="YouTube"><input placeholder="https://" {...field("youtube")} /></Field>
          <Field label="Spotify"><input placeholder="https://" {...field("spotify")} /></Field>
          <Field label="Apple Music"><input placeholder="https://" {...field("appleMusic")} /></Field>
          <Field label="SoundCloud"><input placeholder="https://" {...field("soundcloud")} /></Field>
        </div>
        <SaveRow saving={saving} notice={notice} />
      </form>

      <form className="panel" style={{ marginTop: "1rem" }} onSubmit={changePassword}>
        <p className="eyebrow">Password</p>
        {passwordError ? <p className="form-error">{passwordError}</p> : null}
        <div className="form-grid">
          <Field label="Current password">
            <input type="password" autoComplete="current-password" value={password.current} onChange={(event) => setPassword({ ...password, current: event.target.value })} />
          </Field>
          <Field label="New password">
            <input type="password" autoComplete="new-password" value={password.next} onChange={(event) => setPassword({ ...password, next: event.target.value })} />
          </Field>
        </div>
        <SaveRow saving={false} notice={passwordNotice} />
      </form>
    </>
  );
}
