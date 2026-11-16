import { Link } from "react-router-dom";
import { useTitle } from "../lib";

export function NotFound() {
  useTitle("Not found");
  return (
    <header className="page-hero">
      <div className="wrap">
        <p className="eyebrow">404</p>
        <h1>This page left the stage.</h1>
        <p className="lede">The link doesn't match anything on the site.</p>
        <Link className="btn btn-gold" to="/" style={{ marginTop: "1.4rem" }}>Back home</Link>
      </div>
    </header>
  );
}
