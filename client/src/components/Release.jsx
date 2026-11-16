import { formatLong, parseTracks } from "../lib";

export function Sleeve({ release }) {
  return (
    <div className="sleeve">
      <div className="vinyl" aria-hidden="true" />
      {release.coverImage ? (
        <img className="cover" src={release.coverImage} alt={`${release.title} cover art`} />
      ) : (
        <div className="cover cover-fallback" />
      )}
    </div>
  );
}

export function TrackList({ text }) {
  const tracks = parseTracks(text);
  if (!tracks.length) return null;
  return (
    <ol className="tracks">
      {tracks.map((track) => (
        <li key={track.index}>
          <span>{track.index}</span>
          <span>{track.name}</span>
          <span>{track.time}</span>
        </li>
      ))}
    </ol>
  );
}

export function StreamLinks({ release }) {
  if (!release) return null;
  const links = [
    ["Spotify", release.spotifyUrl],
    ["Apple Music", release.appleUrl],
    ["YouTube", release.youtubeUrl],
  ].filter(([, url]) => url);
  if (!links.length) return null;
  return (
    <div className="stream-links">
      {links.map(([label, url]) => (
        <a key={label} className="btn btn-ghost" href={url} target="_blank" rel="noreferrer">
          {label}
        </a>
      ))}
    </div>
  );
}

export function ReleaseSpotlight({ release }) {
  if (!release) return <p className="muted">No release yet. Add one from Backstage.</p>;
  return (
    <div className="release-grid">
      <Sleeve release={release} />
      <div>
        <p className="eyebrow">{release.type} · {formatLong(release.releaseDate)}</p>
        <h2>{release.title}</h2>
        {release.description ? <p className="lede" style={{ marginTop: "1rem" }}>{release.description}</p> : null}
        <TrackList text={release.tracklist} />
        <StreamLinks release={release} />
      </div>
    </div>
  );
}
