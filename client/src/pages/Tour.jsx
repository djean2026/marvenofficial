import { useEffect, useState } from "react";
import { api } from "../api";
import { ErrorNote, Loading, PageHero } from "../components/Layout";
import { ShowRow } from "../components/ShowRow";
import { isPast, useTitle } from "../lib";

function groupByYear(events) {
  const groups = new Map();
  for (const event of events) {
    const year = event.date.slice(0, 4);
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year).push(event);
  }
  return [...groups.entries()];
}

export function Tour() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useTitle("Tour");

  function load() {
    setLoading(true);
    api("/events")
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

  const upcoming = items.filter((event) => !isPast(event.date));
  const past = items.filter((event) => isPast(event.date)).reverse();

  return (
    <>
      <PageHero
        kicker="Tour"
        title="Come through."
        lede="A four-piece, no tracks doing the heavy lifting. Dates update as soon as they're added in Backstage."
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          {upcoming.length ? (
            groupByYear(upcoming).map(([year, events]) => (
              <div key={year}>
                <p className="year-label">{year}</p>
                {events.map((event) => <ShowRow key={event.id} event={event} />)}
              </div>
            ))
          ) : (
            <p className="muted">No upcoming shows. New cities will show up here.</p>
          )}

          {past.length ? (
            <>
              <h2 style={{ marginTop: "3.5rem" }}>Previously</h2>
              <div style={{ marginTop: "1rem" }}>
                {past.map((event) => <ShowRow key={event.id} event={event} />)}
              </div>
            </>
          ) : null}
        </div>
      </section>
    </>
  );
}
