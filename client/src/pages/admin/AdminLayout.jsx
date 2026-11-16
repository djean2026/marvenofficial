import { NavLink, Navigate, Outlet } from "react-router-dom";
import { clearSession, currentAdmin, getToken } from "../../api";

const links = [
  ["/admin", "Overview", true],
  ["/admin/releases", "Releases"],
  ["/admin/videos", "Videos"],
  ["/admin/shows", "Shows"],
  ["/admin/journal", "Journal"],
  ["/admin/press", "Press"],
  ["/admin/inbox", "Inbox"],
  ["/admin/fans", "Mailing list"],
  ["/admin/settings", "Site"],
];

export function AdminLayout() {
  const admin = currentAdmin();

  function signOut() {
    clearSession();
    window.location.assign("/admin/login");
  }

  return (
    <div className="admin-shell">
      <aside className="side">
        <p className="eyebrow">Backstage</p>
        <strong>{admin?.name || "Signed in"}</strong>
        <nav aria-label="Backstage">
          {links.map(([to, label, end]) => (
            <NavLink key={to} to={to} end={Boolean(end)}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="side-foot">
          <a href="/">View site</a>
          <button className="linkish" type="button" onClick={signOut}>Sign out</button>
        </div>
      </aside>
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}

export function RequireAuth() {
  if (!getToken()) return <Navigate to="/admin/login" replace />;
  return <AdminLayout />;
}
