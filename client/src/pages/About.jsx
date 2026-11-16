import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { PageHero, useSite } from "../components/Layout";
import { paragraphs, useTitle } from "../lib";

export function About() {
  const site = useSite();
  const [quotes, setQuotes] = useState([]);
  const [copied, setCopied] = useState(false);
  useTitle("About");

  useEffect(() => {
    api("/quotes")
      .then((data) => setQuotes(data.items || []))
      .catch(() => setQuotes([]));
  }, []);

  if (!site) return <div className="loading">Marven Jean</div>;

  const kit = `${site.artistName}\n${site.location}\n${site.shortBio}\nBooking: ${site.bookingEmail}\nPress & general: ${site.email}`;

  async function copyKit() {
    try {
      await navigator.clipboard.writeText(kit);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <PageHero kicker="About" title={site.artistName} lede={site.shortBio} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap story-layout">
          {site.portraitImage ? (
            <img className="portrait" src={site.portraitImage} alt={`${site.artistName}`} />
          ) : (
            <div className="portrait" />
          )}
          <div className="prose">
            {paragraphs(site.bio).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <p className="muted">{site.location}</p>
          </div>
        </div>
      </section>

      {quotes.length ? (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <p className="eyebrow">In the room</p>
            <div className="quote-list">
              {quotes.map((quote) => (
                <figure key={quote.id}>
                  <blockquote>“{quote.quote}”</blockquote>
                  <figcaption>{quote.source}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap contact-grid">
          <div>
            <p className="eyebrow">Press kit</p>
            <h2>Short version.</h2>
            <p className="lede" style={{ marginTop: "1rem" }}>
              A bio, a city, and the inboxes that actually get read. Photos on this site are placeholders until you swap them in Backstage.
            </p>
          </div>
          <div className="panel">
            <p style={{ whiteSpace: "pre-wrap" }}>{kit}</p>
            <div className="about-actions">
              <button className="btn btn-gold" type="button" onClick={copyKit}>
                {copied ? "Copied" : "Copy press text"}
              </button>
              <a className="btn btn-ghost" href={`mailto:${site.bookingEmail}`}>Email booking</a>
              <Link className="btn btn-ghost" to="/contact">Write a note</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
