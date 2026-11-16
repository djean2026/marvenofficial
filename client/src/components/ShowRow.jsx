import { Link } from "react-router-dom";
import { formatDay, formatMonth, isPast } from "../lib";

export function ShowRow({ event }) {
  const past = isPast(event.date);
  return (
    <article className={past ? "show is-past" : "show"}>
      <div className="date-block">
        <span>{formatMonth(event.date)}</span>
        <strong>{formatDay(event.date)}</strong>
      </div>
      <div>
        <h3>{event.city}</h3>
        <p>
          {event.venue}
          {event.time ? ` · ${event.time}` : ""}
        </p>
      </div>
      <p className="show-title">{event.title}</p>
      {past ? (
        <span className="badge quiet">Played</span>
      ) : event.soldOut ? (
        <span className="badge">Sold out</span>
      ) : event.ticketUrl ? (
        <a className="btn btn-ghost" href={event.ticketUrl} target="_blank" rel="noreferrer">Tickets</a>
      ) : (
        <Link className="btn btn-ghost" to="/contact?topic=Tickets">Tickets</Link>
      )}
    </article>
  );
}
