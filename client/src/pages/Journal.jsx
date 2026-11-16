import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { ErrorNote, Loading, PageHero } from "../components/Layout";
import { formatStamp, useTitle } from "../lib";

export function Journal() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useTitle("Journal");

  function load() {
    setLoading(true);
    api("/posts")
      .then((data) => {
        setItems(data.items || []);
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

  return (
    <>
      <PageHero kicker="Journal" title="Notes from the road." lede="Letters, tour scraps, and anything else worth posting. Drafts stay hidden until you publish them." />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          {items.length ? (
            <div className="journal-grid">
              {items.map((post, index) => (
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
    </>
  );
}
