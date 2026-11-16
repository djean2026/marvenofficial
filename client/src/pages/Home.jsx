import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { ErrorNote, Loading, SubscribeForm } from "../components/Layout";
import { ReleaseSpotlight } from "../components/Release";
import { ShowRow } from "../components/ShowRow";
import { formatLong, formatStamp, useTitle } from "../lib";

function Bars() {
  return (
    <span className="bars" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

export function Home() {
  const [state, setState] = useState({ loading: true, error: "", data: null });
  useTitle("Official");

  function load() {
    setState({ loading: true, error: "", data: null });
    api("/home")
      .then((data) => setState({ loading: false, error: "", data }))
      .catch((error) => setState({ loading: false, error: error.message, data: null }));
  }

  useEffect(() => {
    load();
  }, []);

  if (state.loading) return <Loading />;
  if (state.error) return <ErrorNote onRetry={load}>{state.error}</ErrorNote>;

  const { settings, release, events, video, posts, quotes } = state.data;
  const next = events[0];
  const line = `${settings.artistName}  ·  ${release?.title || "New music"}  ·  ${settings.location}  ·  Live  ·  `;
  const marquee = line.repeat(4);

  return (
    <>
      <section className="hero">
        {settings.heroImage ? <img className="hero-bg" src={settings.heroImage} alt="" /> : null}
        <div className="hero-shade" />
        <p className="hero-rail">{settings.artistName} official</p>
        <div className="hero-content">
          <p className="kicker"><span className="pulse" /> {settings.heroKicker}</p>
          <h1>{settings.artistName}</h1>
          <p className="tagline">{settings.tagline}</p>
          <div className="hero-bottom">
            <div className="hero-actions">
              <a className="btn btn-gold" href="#release"><Bars /> Listen</a>
              <a className="btn btn-ghost" href="#shows">Upcoming shows</a>
            </div>
            {next ? (
              <Link className="next-show" to="/tour">
                <span>Next show</span>
                <strong>{next.city}</strong>
                <em>{formatLong(next.date)} · {next.venue}</em>
              </Link>
            ) : null}
          </div>
        </div>
        <a className="scroll-cue" href="#info">Scroll</a>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <span>{marquee}</span>
          <span>{marquee}</span>
        </div>
      </div>

      <section id="info">
        <div className="wrap">
          <ul className="facts">
            <li><span>Based in</span><strong>{settings.location}</strong></li>
            <li><span>Latest</span><strong>{release?.title || "Soon"}</strong></li>
            <li>
              <span>Booking</span>
              <strong><a href={`mailto:${settings.bookingEmail}`}>{settings.bookingEmail}</a></strong>
            </li>
            <li><span>Next city</span><strong>{next?.city || "To be announced"}</strong></li>
          </ul>
        </div>
      </section>

      <section className="section" id="release">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">01 — New release</p>
              <h2>Now playing</h2>
            </div>
            <Link className="text-link" to="/music">All music</Link>
          </div>
          <ReleaseSpotlight release={release} />
        </div>
      </section>

      {quotes?.[0] ? (
        <section className="quote-band">
          <blockquote>“{quotes[0].quote}”</blockquote>
          <p>{quotes[0].source}</p>
        </section>
      ) : null}

      <section className="section" id="about">
        <div className="wrap about-split">
          <div className="portrait-frame">
            {settings.portraitImage ? (
              <img className="portrait" src={settings.portraitImage} alt={`${settings.artistName} on stage`} />
            ) : (
              <div className="portrait" />
            )}
          </div>
          <div className="about-copy">
            <p className="eyebrow">02 — About</p>
            <h2>Written at the piano.</h2>
            <p className="lede">{settings.shortBio}</p>
            <div className="about-actions">
              <Link className="btn btn-gold" to="/about">Read the story</Link>
              <Link className="btn btn-ghost" to="/contact">Booking</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="shows">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">03 — On the road</p>
              <h2>Upcoming</h2>
            </div>
            <Link className="text-link" to="/tour">All dates</Link>
          </div>
          {events.length ? (
            events.map((event) => <ShowRow key={event.id} event={event} />)
          ) : (
            <p className="muted">No shows on the books yet. New dates land here first.</p>
          )}
        </div>
      </section>

      {video ? (
        <section className="section" id="video">
          <div className="wrap">
            <div className="section-head">
              <div>
                <p className="eyebrow">04 — Watch</p>
                <h2>Picture</h2>
              </div>
              <Link className="text-link" to="/videos">All videos</Link>
            </div>
            <figure className="cinema">
              <div className="frame">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <figcaption>
                <div>
                  <h3>{video.title}</h3>
                  {video.description ? <p className="muted">{video.description}</p> : null}
                </div>
              </figcaption>
            </figure>
          </div>
        </section>
      ) : null}

      <section className="section" id="journal">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">05 — Journal</p>
              <h2>Notes</h2>
            </div>
            <Link className="text-link" to="/journal">All notes</Link>
          </div>
          {posts.length ? (
            <div className="journal-grid">
              {posts.map((post, index) => (
                <Link key={post.id} to={`/journal/${post.slug}`} className={index === 0 ? "story story-large" : "story"}>
                  {post.coverImage ? <img src={post.coverImage} alt="" /> : null}
                  <div className="shade" />
                  <div>
                    <p>{formatStamp(post.createdAt)}</p>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="muted">No notes yet.</p>
          )}
        </div>
      </section>

      <section className="list-band" id="list">
        <div className="wrap">
          <p className="eyebrow" style={{ color: "#8a5a22" }}>Stay close</p>
          <h2>Hear it before the room does.</h2>
          <p style={{ maxWidth: "36rem", marginTop: "0.8rem" }}>{settings.newsletterNote}</p>
          <SubscribeForm ink idPrefix="home" />
        </div>
      </section>
    </>
  );
}
