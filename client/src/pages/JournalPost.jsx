import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import { Loading } from "../components/Layout";
import { formatStamp, paragraphs, useTitle } from "../lib";

export function JournalPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useTitle(post?.title || "Journal");

  useEffect(() => {
    setLoading(true);
    setError("");
    api(`/posts/${slug}`)
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <Loading />;
  if (error) {
    return (
      <header className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Journal</p>
          <h1>That note is gone.</h1>
          <p className="lede">{error}</p>
          <Link className="btn btn-gold" to="/journal" style={{ marginTop: "1.2rem" }}>Back to the journal</Link>
        </div>
      </header>
    );
  }

  return (
    <article>
      <header className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Journal · {formatStamp(post.createdAt)}{post.published ? "" : " · Draft"}</p>
          <h1>{post.title}</h1>
          <p className="lede">{post.excerpt}</p>
        </div>
      </header>
      {post.coverImage ? <img className="article-cover" src={post.coverImage} alt="" /> : null}
      <div className="narrow prose article-body">
        {paragraphs(post.body).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
        <p><Link className="text-link" to="/journal">All notes</Link></p>
      </div>
    </article>
  );
}
