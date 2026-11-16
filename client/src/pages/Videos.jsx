import { useEffect, useState } from "react";
import { api } from "../api";
import { ErrorNote, Loading, PageHero } from "../components/Layout";
import { formatLong, useTitle } from "../lib";

export function Videos() {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useTitle("Videos");

  function load() {
    setLoading(true);
    api("/videos")
      .then((data) => {
        const list = data.items || [];
        setItems(list);
        const featured = list.find((item) => item.featured) || list[0];
        setActiveId(featured?.id ?? null);
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

  const active = items.find((item) => item.id === activeId) || items[0];

  return (
    <>
      <PageHero kicker="Videos" title="Watch." lede="New clips land here as soon as you paste a YouTube link in Backstage." />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          {active ? (
            <figure className="cinema">
              <div className="frame">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${active.youtubeId}?rel=0`}
                  title={active.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <figcaption>
                <div>
                  <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>{active.title}</h2>
                  <p className="muted">{formatLong(active.publishedAt)}</p>
                  {active.description ? <p style={{ marginTop: "0.6rem" }}>{active.description}</p> : null}
                </div>
              </figcaption>
            </figure>
          ) : (
            <p className="muted">No videos yet.</p>
          )}
          <div className="video-grid" style={{ marginTop: "1.6rem" }}>
            {items.map((video) => (
              <button
                key={video.id}
                type="button"
                className={video.id === active?.id ? "video-card on" : "video-card"}
                onClick={() => {
                  setActiveId(video.id);
                  document.getElementById("content")?.scrollIntoView();
                }}
              >
                <img src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`} alt="" />
                <h3>{video.title}</h3>
                <p>{formatLong(video.publishedAt)}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
