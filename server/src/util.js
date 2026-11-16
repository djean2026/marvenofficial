export function slugify(value) {
  const slug = String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || "note";
}

export function str(value, max = 500) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export function optionalUrl(value, max = 500) {
  const cleaned = str(value, max);
  if (!cleaned) return "";
  if (!/^https?:\/\//i.test(cleaned)) return null;
  return cleaned;
}

export function isEmail(value) {
  return typeof value === "string" && value.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function dateStr(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return value;
}

export function todayISO() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function youtubeId(input) {
  const value = String(input || "").trim();
  if (/^[\w-]{11}$/.test(value)) return value;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0] || "";
      return /^[\w-]{11}$/.test(id) ? id : null;
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
    return null;
  }
  return null;
}
