import catalog from "./catalog.json";
import { todayISO } from "./lib";

function pickFeatured(items, dateKey) {
  return (
    [...items].sort((a, b) => {
      const feature = Number(b.featured) - Number(a.featured);
      if (feature) return feature;
      return String(b[dateKey]).localeCompare(String(a[dateKey]));
    })[0] || null
  );
}

function postCard(post) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    createdAt: post.createdAt,
  };
}

export function publishedContent(path, today = todayISO()) {
  if (path === "/site") return catalog.site;
  if (path === "/releases") return { items: catalog.releases };
  if (path === "/videos") return { items: catalog.videos };
  if (path === "/events") return { items: catalog.events };
  if (path === "/quotes") return { items: catalog.quotes };
  if (path === "/posts") return { items: catalog.posts.map(postCard) };
  if (path === "/home") {
    return {
      settings: catalog.site,
      release: pickFeatured(catalog.releases, "releaseDate"),
      events: catalog.events.filter((event) => event.date >= today).slice(0, 4),
      video: pickFeatured(catalog.videos, "publishedAt"),
      posts: catalog.posts.slice(0, 3).map(postCard),
      quotes: catalog.quotes,
    };
  }
  if (path.startsWith("/posts/")) {
    const slug = decodeURIComponent(path.slice("/posts/".length));
    const post = catalog.posts.find((item) => item.slug === slug);
    if (!post) {
      const error = new Error("That note could not be found");
      error.status = 404;
      throw error;
    }
    return post;
  }
  return null;
}
