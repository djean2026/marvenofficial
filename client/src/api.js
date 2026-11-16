import { publishedContent } from "./catalog";

export function getToken() {
  return localStorage.getItem("marven_token") || "";
}

export function saveSession(token, admin) {
  localStorage.setItem("marven_token", token);
  localStorage.setItem("marven_admin", JSON.stringify(admin));
}

export function clearSession() {
  localStorage.removeItem("marven_token");
  localStorage.removeItem("marven_admin");
}

export function currentAdmin() {
  try {
    return JSON.parse(localStorage.getItem("marven_admin") || "null");
  } catch {
    return null;
  }
}

function savedContent(path) {
  try {
    return publishedContent(path);
  } catch (error) {
    if (error?.status) throw error;
    return null;
  }
}

export async function api(path, options = {}) {
  const method = String(options.method || "GET").toUpperCase();
  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response;
  try {
    response = await fetch(`/api${path}`, { ...options, headers });
  } catch {
    if (method === "GET") {
      const saved = savedContent(path);
      if (saved) return saved;
    }
    throw new Error("Can't reach the server. Start it with npm run dev.");
  }

  const text = await response.text();
  let data = null;
  let parsed = false;
  if (text) {
    try {
      data = JSON.parse(text);
      parsed = true;
    } catch {
      parsed = false;
    }
  } else {
    parsed = true;
    data = {};
  }

  if (!parsed) {
    if (method === "GET") {
      const saved = savedContent(path);
      if (saved) return saved;
    }
    throw new Error("The site server didn't answer. This deploy is serving the saved pages only.");
  }

  if (response.status === 401 && path !== "/admin/login") {
    clearSession();
    if (!window.location.pathname.startsWith("/admin/login")) {
      window.location.assign("/admin/login");
    }
  }

  if (!response.ok) {
    const error = new Error(data.error || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data;
}
