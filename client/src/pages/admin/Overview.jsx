import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api";
import { formatStamp, useTitle } from "../../lib";

export function Overview() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useTitle("Backstage");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api("/admin/releases"),
      api("/admin/videos"),
      api("/admin/events"),
      api("/admin/posts"),
      api("/admin/messages"),
      api("/admin/subscribers"),
    ])
      .then(([releases, videos, events, posts, messages, subscribers]) => {
        if (cancelled) return;
        setData({
          releases: releases.items,
          videos: videos.items,
          events: events.items,
          posts: posts.items,
          messages: messages.items,
          subscribers: subscribers.items,
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = data
    ? [
        ["/admin/releases", data.releases.length, "Releases"],
        ["/admin/videos", data.videos.length, "Videos"],
        ["/admin/shows", data.events.length, "Shows"],
        ["/admin/journal", data.posts.length, "Notes"],
        ["/admin/inbox", data.messages.filter((item) => !item.read).length, "Unread notes"],
        ["/admin/fans", data.subscribers.length, "Fans on the list"],
      ]
    : [];

  return (
    <>
      <p className="eyebrow">Overview</p>
      <h1>The house lights.</h1>
      <p className="lede">
        Sample songs, shows, videos, and notes are already on the site so you can see the layout. Replace them with your own, or rewrite the name and bio under Site.
      </p>
      {error ? <p className="form-error">{error}</p> : null}
      {!data && !error ? <p className="muted">Loading the desk…</p> : null}
      <div className="stat-grid">
        {stats.map(([to, value, label]) => (
          <Link key={label} className="stat" to={to}>
            <strong>{value}</strong>
            <span>{label}</span>
          </Link>
        ))}
      </div>
      {data ? (
        <div className="panel">
          <p className="eyebrow">Latest messages</p>
          {data.messages.length ? (
            <ul className="item-list">
              {data.messages.slice(0, 5).map((message) => (
                <li key={message.id} className="item-row">
                  <Link to="/admin/inbox">
                    <strong className={message.read ? "" : "unread"}>{message.name}</strong>
                    <small> · {message.subject} · {formatStamp(message.createdAt)}</small>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No messages yet. The contact form files them here.</p>
          )}
        </div>
      ) : null}
    </>
  );
}
