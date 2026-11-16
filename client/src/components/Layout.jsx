import { createContext, useContext, useEffect, useId, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { api } from "../api";
import { socials } from "../lib";

const SiteContext = createContext(null);
export function useSite() {
  return useContext(SiteContext);
}

function Bars() {
  return (
    <span className="bars" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

export function SubscribeForm({ ink = false, idPrefix = "list" }) {
  const reactId = useId();
  const fieldId = `${idPrefix}-${reactId}`;
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    setError("");
    try {
      await api("/subscribe", { method: "POST", body: JSON.stringify({ email, company }) });
      setEmail("");
      setNotice("You're on the list.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="signup" onSubmit={onSubmit}>
      <label className="sr" htmlFor={fieldId}>
        Email address
      </label>
      <input
        id={fieldId}
        type="email"
        required
        autoComplete="email"
        placeholder="Email address"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input className="hp" tabIndex={-1} autoComplete="off" value={company} onChange={(event) => setCompany(event.target.value)} aria-hidden="true" />
      <button className={ink ? "btn btn-ink" : "btn btn-gold"} disabled={busy}>
        {busy ? "Joining…" : "Join"}
      </button>
      {notice ? <p className="notice" role="status">{notice}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}
    </form>
  );
}

function Nav() {
  const site = useSite();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`nav${scrolled || open ? " scrolled" : ""}${open ? " open" : ""}`}>
      <Link className="logo" to="/">
        {site?.artistName || "Marven Jean"}
      </Link>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>
      <nav className="menu" aria-label="Primary">
        <NavLink to="/music">Music</NavLink>
        <NavLink to="/tour">Tour</NavLink>
        <NavLink to="/videos">Videos</NavLink>
        <NavLink to="/journal">Journal</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink className="btn btn-gold" to="/music">
          <Bars /> Listen
        </NavLink>
      </nav>
    </header>
  );
}

function Footer() {
  const site = useSite();
  const links = socials(site);
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <Link className="logo" to="/">{site?.artistName || "Marven Jean"}</Link>
          <p className="muted">{site?.tagline || "Official site"}</p>
          <ul className="socials">
            {links.map(([label, url]) => (
              <li key={label}>
                <a href={url} target="_blank" rel="noreferrer">{label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">Visit</p>
          <ul>
            <li><Link to="/music">Music</Link></li>
            <li><Link to="/tour">Tour</Link></li>
            <li><Link to="/videos">Videos</Link></li>
            <li><Link to="/journal">Journal</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow">Mailing list</p>
          <p className="muted">{site?.newsletterNote}</p>
          <SubscribeForm idPrefix="footer" />
        </div>
      </div>
      <div className="wrap legal">
        <span>© {new Date().getFullYear()} {site?.artistName || "Marven Jean"}</span>
        <span>{site?.location}</span>
        <Link to="/admin">Backstage</Link>
      </div>
    </footer>
  );
}

export function PublicLayout() {
  const [site, setSite] = useState(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    api("/site")
      .then((data) => {
        setSite(data);
        setOffline(false);
      })
      .catch(() => setOffline(true));
  }, []);

  return (
    <SiteContext.Provider value={site}>
      <a className="skip" href="#content">Skip to content</a>
      {offline ? <p className="offline">The site can't reach the server yet. From the project folder, run npm run dev.</p> : null}
      <Nav />
      <main id="content">
        <Outlet />
      </main>
      <Footer />
      <div className="grain" aria-hidden="true" />
    </SiteContext.Provider>
  );
}

export function PageHero({ kicker, title, lede }) {
  return (
    <header className="page-hero">
      <div className="wrap">
        <p className="eyebrow">{kicker}</p>
        <h1>{title}</h1>
        {lede ? <p className="lede">{lede}</p> : null}
      </div>
    </header>
  );
}

export function Loading() {
  return <div className="loading">Marven Jean</div>;
}

export function ErrorNote({ children, onRetry }) {
  return (
    <div className="banner">
      <p>{children}</p>
      {onRetry ? (
        <button className="btn btn-ghost" type="button" onClick={onRetry} style={{ marginTop: "0.8rem" }}>
          Try again
        </button>
      ) : null}
    </div>
  );
}
