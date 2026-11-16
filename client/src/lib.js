import { useEffect } from "react";

export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Marven Jean` : "Marven Jean — Official";
  }, [title]);
}

export function todayISO() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function parts(iso) {
  const [year, month, day] = String(iso || "").split("-").map(Number);
  return new Date(year || 1970, (month || 1) - 1, day || 1);
}

export function formatLong(iso) {
  if (!iso) return "";
  return parts(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function formatMonth(iso) {
  return parts(iso).toLocaleDateString("en-US", { month: "short" });
}

export function formatDay(iso) {
  return String(parts(iso).getDate()).padStart(2, "0");
}

export function formatStamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return formatLong(value);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function isPast(iso) {
  return String(iso) < todayISO();
}

export function paragraphs(text) {
  return String(text || "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function parseTracks(text) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [name, time] = line.split("|").map((part) => part.trim());
      return { index: String(index + 1).padStart(2, "0"), name, time: time || "" };
    });
}

export function youtubeId(input) {
  const value = String(input || "").trim();
  if (/^[\w-]{11}$/.test(value)) return value;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0] || "";
      return /^[\w-]{11}$/.test(id) ? id : "";
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      const watch = url.searchParams.get("v");
      if (watch && /^[\w-]{11}$/.test(watch)) return watch;
      const parts = url.pathname.split("/").filter(Boolean);
      const marker = parts.findIndex((part) => part === "embed" || part === "shorts" || part === "live");
      const id = marker >= 0 ? parts[marker + 1] : "";
      if (/^[\w-]{11}$/.test(id || "")) return id;
    }
  } catch {
    return "";
  }
  return "";
}

export function socials(site) {
  if (!site) return [];
  return [
    ["Instagram", site.instagram],
    ["Facebook", site.facebook],
    ["TikTok", site.tiktok],
    ["YouTube", site.youtube],
    ["Spotify", site.spotify],
    ["Apple Music", site.appleMusic],
    ["SoundCloud", site.soundcloud],
  ].filter(([, url]) => url);
}
