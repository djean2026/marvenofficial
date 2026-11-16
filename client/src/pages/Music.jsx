import { useEffect, useState } from "react";
import { api } from "../api";
import { ErrorNote, Loading, PageHero } from "../components/Layout";
import { ReleaseSpotlight } from "../components/Release";
import { formatLong, useTitle } from "../lib";

const filters = ["All", "Single", "EP", "Album"];

export function Music() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(null);
  useTitle("Music");

  function load() {
    setLoading(true);
    setError("");
    api("/releases")
      .then((data) => {
        const list = data.items || [];
        setItems(list);
        const featured = list.find((item) => item.featured) || list[0];
        setSelectedId(featured?.id ?? null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorNote onRetry={load}>{error}</ErrorNote>;

  const shown = items.filter((item) => filter === "All" || item.type === filter);
  const selected = items.find((item) => item.id === selectedId) || shown[0] || items[0];

  return (
    <>
      <PageHero
        kicker="Music"
        title="The records."
        lede="The single, the EP, and the album. Piano first — pick a cover to read the notes."
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <ReleaseSpotlight release={selected} />
          <div className="chips" style={{ marginTop: "2.5rem" }} role="tablist" aria-label="Filter releases">
            {filters.map((item) => (
              <button key={item} className={filter === item ? "chip on" : "chip"} type="button" onClick={() => setFilter(item)}>
                {item === "All" ? "All" : `${item}s`}
              </button>
            ))}
          </div>
          <div className="album-grid">
            {shown.map((release) => (
              <button
                key={release.id}
                className={release.id === selected?.id ? "album on" : "album"}
                type="button"
                onClick={() => {
                  setSelectedId(release.id);
                  document.getElementById("content")?.focus?.();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                {release.coverImage ? <img src={release.coverImage} alt="" /> : <div className="cover-fallback" style={{ borderRadius: 16, marginBottom: "0.75rem" }} />}
                <h3>{release.title}</h3>
                <p>{release.type} · {formatLong(release.releaseDate)}</p>
              </button>
            ))}
          </div>
          {!shown.length ? <p className="muted">Nothing in this shelf yet.</p> : null}
        </div>
      </section>
    </>
  );
}
