import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api";
import { PageHero, useSite } from "../components/Layout";
import { useTitle } from "../lib";

const topics = ["General", "Booking", "Press", "Tickets", "Other"];

export function Contact() {
  const site = useSite();
  const [params] = useSearchParams();
  const initialTopic = topics.includes(params.get("topic")) ? params.get("topic") : "General";
  const [form, setForm] = useState({ name: "", email: "", subject: initialTopic, body: "", company: "" });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useTitle("Contact");

  function set(key) {
    return (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    setError("");
    try {
      await api("/contact", { method: "POST", body: JSON.stringify(form) });
      setForm({ name: "", email: "", subject: form.subject, body: "", company: "" });
      setNotice("Sent. It'll be waiting in Backstage.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHero
        kicker="Contact"
        title="Write in."
        lede="Booking, press, and everything else lands in the Backstage inbox."
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap contact-grid">
          <div className="stack">
            <div className="panel">
              <p className="eyebrow">Booking</p>
              <h2 style={{ fontSize: "2.2rem" }}>{site?.bookingEmail || "booking@marvenofficial.com"}</h2>
              {site?.bookingEmail ? <a className="text-link" href={`mailto:${site.bookingEmail}`}>Email directly</a> : null}
            </div>
            <div className="panel">
              <p className="eyebrow">General</p>
              <p>{site?.email || "hello@marvenofficial.com"}</p>
              <p className="muted" style={{ marginTop: "0.4rem" }}>{site?.location}</p>
            </div>
          </div>
          <form className="panel stack" onSubmit={onSubmit}>
            {error ? <p className="form-error" role="alert">{error}</p> : null}
            <label className="field">
              <span>Name</span>
              <input required value={form.name} onChange={set("name")} autoComplete="name" />
            </label>
            <label className="field">
              <span>Email</span>
              <input required type="email" value={form.email} onChange={set("email")} autoComplete="email" />
            </label>
            <label className="field">
              <span>Topic</span>
              <select value={form.subject} onChange={set("subject")}>
                {topics.map((topic) => <option key={topic}>{topic}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Message</span>
              <textarea required rows={7} value={form.body} onChange={set("body")} />
            </label>
            <input className="hp" tabIndex={-1} autoComplete="off" value={form.company} onChange={set("company")} aria-hidden="true" />
            <button className="btn btn-gold" disabled={busy}>{busy ? "Sending…" : "Send"}</button>
            {notice ? <p className="notice" role="status">{notice}</p> : null}
          </form>
        </div>
      </section>
    </>
  );
}
