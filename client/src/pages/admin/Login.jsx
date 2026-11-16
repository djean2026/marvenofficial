import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { api, getToken, saveSession } from "../../api";
import { useTitle } from "../../lib";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useTitle("Backstage");

  if (getToken()) return <Navigate to="/admin" replace />;

  async function onSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await api("/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      saveSession(data.token, data.admin);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-brand">
        <p className="kicker">Marven Jean official</p>
        <h1>Backstage.</h1>
      </div>
      <div className="login-panel">
        <form className="login-card stack" onSubmit={onSubmit}>
          <p className="eyebrow">Sign in</p>
          <h2 style={{ fontSize: "2.6rem" }}>The desk is yours.</h2>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <label className="field">
            <span>Email</span>
            <input type="email" autoFocus autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          <button className="btn btn-gold" disabled={busy}>{busy ? "Checking…" : "Enter"}</button>
          <aside className="demo-card">
            <p>Sample login, until you change it under Site.</p>
            <p><strong>xavier.y@example.org</strong></p>
            <p><strong>marven-admin</strong></p>
            <button
              className="btn btn-ghost"
              type="button"
              style={{ marginTop: "0.7rem" }}
              onClick={() => {
                setEmail("xavier.y@example.org");
                setPassword("marven-admin");
              }}
            >
              Fill demo login
            </button>
          </aside>
        </form>
      </div>
    </div>
  );
}
