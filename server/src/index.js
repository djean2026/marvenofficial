import "./env.js";
import express from "express";
import cors from "cors";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "./prisma.js";
import { hashPassword, readAdmin, requireAdmin, signAdmin, verifyPassword } from "./auth.js";
import { dateStr, isEmail, optionalUrl, slugify, str, todayISO, youtubeId } from "./util.js";

const app = express();
app.disable("x-powered-by");
app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));

const router = express.Router();

function asyncRoute(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function idParam(req) {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function uniqueSlug(seed, ignoreId) {
  const base = slugify(seed);
  let slug = base;
  let n = 2;
  while (n < 80) {
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${base}-${n++}`;
  }
  return `${base}-${Date.now()}`;
}

function releaseInput(body) {
  const title = str(body.title, 160);
  const type = str(body.type, 40);
  const releaseDate = dateStr(body.releaseDate);
  const coverImage = optionalUrl(body.coverImage);
  const description = str(body.description, 2000);
  const tracklist = str(body.tracklist, 4000);
  const spotifyUrl = optionalUrl(body.spotifyUrl);
  const appleUrl = optionalUrl(body.appleUrl);
  const youtubeUrl = optionalUrl(body.youtubeUrl);
  if (!title) return { error: "Title is required" };
  if (!["Single", "EP", "Album"].includes(type)) return { error: "Choose Single, EP, or Album" };
  if (!releaseDate) return { error: "A valid release date is required" };
  if ([coverImage, spotifyUrl, appleUrl, youtubeUrl].includes(null)) {
    return { error: "Links and images must start with http:// or https://" };
  }
  return {
    data: {
      title,
      type,
      releaseDate,
      coverImage,
      description,
      tracklist,
      spotifyUrl,
      appleUrl,
      youtubeUrl,
      featured: Boolean(body.featured),
    },
  };
}

function videoInput(body) {
  const title = str(body.title, 160);
  const id = youtubeId(body.youtubeUrl);
  const description = str(body.description, 2000);
  const publishedAt = dateStr(body.publishedAt);
  if (!title) return { error: "Title is required" };
  if (!id) return { error: "Paste a YouTube link, like https://www.youtube.com/watch?v=…" };
  if (!publishedAt) return { error: "A valid publish date is required" };
  return {
    data: {
      title,
      youtubeUrl: `https://www.youtube.com/watch?v=${id}`,
      youtubeId: id,
      description,
      publishedAt,
      featured: Boolean(body.featured),
    },
  };
}

function eventInput(body) {
  const title = str(body.title, 160);
  const venue = str(body.venue, 160);
  const city = str(body.city, 120);
  const date = dateStr(body.date);
  const time = str(body.time, 40);
  const ticketUrl = optionalUrl(body.ticketUrl);
  if (!title || !venue || !city) return { error: "Title, venue, and city are required" };
  if (!date) return { error: "A valid show date is required" };
  if (ticketUrl == null) return { error: "Ticket link must start with http:// or https://" };
  return {
    data: { title, venue, city, date, time, ticketUrl, soldOut: Boolean(body.soldOut) },
  };
}

async function postInput(body, ignoreId) {
  const title = str(body.title, 180);
  const excerpt = str(body.excerpt, 400);
  const content = str(body.body, 20000);
  const coverImage = optionalUrl(body.coverImage);
  const requestedSlug = str(body.slug, 90);
  if (!title) return { error: "Title is required" };
  if (!excerpt) return { error: "Excerpt is required" };
  if (!content) return { error: "Write something for the post" };
  if (coverImage == null) return { error: "Cover image must start with http:// or https://" };
  const slug = await uniqueSlug(requestedSlug || title, ignoreId);
  return {
    data: {
      title,
      slug,
      excerpt,
      body: content,
      coverImage,
      published: Boolean(body.published),
    },
  };
}

function quoteInput(body) {
  const quote = str(body.quote, 500);
  const source = str(body.source, 120);
  if (!quote || !source) return { error: "Quote and source are required" };
  return { data: { quote, source, featured: Boolean(body.featured) } };
}

const urlFields = ["instagram", "facebook", "tiktok", "youtube", "spotify", "appleMusic", "soundcloud", "heroImage", "portraitImage"];

function settingsInput(body) {
  const data = {
    artistName: str(body.artistName, 80),
    tagline: str(body.tagline, 200),
    heroKicker: str(body.heroKicker, 120),
    shortBio: str(body.shortBio, 600),
    bio: str(body.bio, 8000),
    location: str(body.location, 120),
    email: str(body.email, 200).toLowerCase(),
    bookingEmail: str(body.bookingEmail, 200).toLowerCase(),
    newsletterNote: str(body.newsletterNote, 400),
  };
  if (!data.artistName) return { error: "Artist name is required" };
  if (!data.tagline) return { error: "Tagline is required" };
  if (!data.shortBio || !data.bio) return { error: "Both bios are required" };
  if (data.email && !isEmail(data.email)) return { error: "Public email looks invalid" };
  if (data.bookingEmail && !isEmail(data.bookingEmail)) return { error: "Booking email looks invalid" };
  for (const key of urlFields) {
    const value = optionalUrl(body[key]);
    if (value == null) return { error: "Links and images must start with http:// or https://" };
    data[key] = value;
  }
  return { data };
}

function mountCrud(path, { model, orderBy, input, feature }) {
  router.get(
    `/admin/${path}`,
    requireAdmin,
    asyncRoute(async (req, res) => {
      const items = await prisma[model].findMany({ orderBy });
      res.json({ items });
    }),
  );

  router.post(
    `/admin/${path}`,
    requireAdmin,
    asyncRoute(async (req, res) => {
      const parsed = await input(req.body);
      if (parsed.error) return res.status(400).json({ error: parsed.error });
      if (feature && parsed.data.featured) await prisma[model].updateMany({ data: { featured: false } });
      const item = await prisma[model].create({ data: parsed.data });
      res.status(201).json(item);
    }),
  );

  router.put(
    `/admin/${path}/:id`,
    requireAdmin,
    asyncRoute(async (req, res) => {
      const id = idParam(req);
      if (!id) return res.status(400).json({ error: "Invalid id" });
      const parsed = await input(req.body, id);
      if (parsed.error) return res.status(400).json({ error: parsed.error });
      if (feature && parsed.data.featured) await prisma[model].updateMany({ data: { featured: false } });
      const item = await prisma[model].update({ where: { id }, data: parsed.data });
      res.json(item);
    }),
  );

  router.delete(
    `/admin/${path}/:id`,
    requireAdmin,
    asyncRoute(async (req, res) => {
      const id = idParam(req);
      if (!id) return res.status(400).json({ error: "Invalid id" });
      await prisma[model].delete({ where: { id } });
      res.json({ ok: true });
    }),
  );
}

router.get("/health", (req, res) => res.json({ ok: true }));

router.get(
  "/site",
  asyncRoute(async (req, res) => {
    const settings = await prisma.settings.findUnique({ where: { id: 1 } });
    if (!settings) return res.status(503).json({ error: "Site content is not ready yet" });
    res.json(settings);
  }),
);

router.get(
  "/home",
  asyncRoute(async (req, res) => {
    const settings = await prisma.settings.findUnique({ where: { id: 1 } });
    if (!settings) return res.status(503).json({ error: "Site content is not ready yet" });
    const today = todayISO();
    const [release, events, video, posts, quotes] = await Promise.all([
      prisma.release.findFirst({ orderBy: [{ featured: "desc" }, { releaseDate: "desc" }] }),
      prisma.event.findMany({ where: { date: { gte: today } }, orderBy: { date: "asc" }, take: 4 }),
      prisma.video.findFirst({ orderBy: [{ featured: "desc" }, { publishedAt: "desc" }] }),
      prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: { id: true, title: true, slug: true, excerpt: true, coverImage: true, createdAt: true },
      }),
      prisma.quote.findMany({ orderBy: [{ featured: "desc" }, { id: "asc" }] }),
    ]);
    res.json({ settings, release, events, video, posts, quotes });
  }),
);

router.get(
  "/releases",
  asyncRoute(async (req, res) => {
    const items = await prisma.release.findMany({ orderBy: { releaseDate: "desc" } });
    res.json({ items });
  }),
);

router.get(
  "/videos",
  asyncRoute(async (req, res) => {
    const items = await prisma.video.findMany({ orderBy: { publishedAt: "desc" } });
    res.json({ items });
  }),
);

router.get(
  "/events",
  asyncRoute(async (req, res) => {
    const items = await prisma.event.findMany({ orderBy: { date: "asc" } });
    res.json({ items });
  }),
);

router.get(
  "/posts",
  asyncRoute(async (req, res) => {
    const items = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, slug: true, excerpt: true, coverImage: true, createdAt: true },
    });
    res.json({ items });
  }),
);

router.get(
  "/posts/:slug",
  asyncRoute(async (req, res) => {
    const post = await prisma.post.findUnique({ where: { slug: req.params.slug } });
    if (!post || (!post.published && !readAdmin(req))) {
      return res.status(404).json({ error: "That note could not be found" });
    }
    res.json(post);
  }),
);

router.get(
  "/quotes",
  asyncRoute(async (req, res) => {
    const items = await prisma.quote.findMany({ orderBy: [{ featured: "desc" }, { id: "asc" }] });
    res.json({ items });
  }),
);

router.post(
  "/subscribe",
  asyncRoute(async (req, res) => {
    if (str(req.body.company, 200)) return res.json({ ok: true });
    const email = str(req.body.email, 200).toLowerCase();
    if (!isEmail(email)) return res.status(400).json({ error: "Enter a valid email" });
    await prisma.subscriber.upsert({ where: { email }, update: {}, create: { email } });
    res.json({ ok: true });
  }),
);

router.post(
  "/contact",
  asyncRoute(async (req, res) => {
    if (str(req.body.company, 200)) return res.json({ ok: true });
    const name = str(req.body.name, 120);
    const email = str(req.body.email, 200).toLowerCase();
    const subject = str(req.body.subject, 160);
    const body = str(req.body.body, 5000);
    if (!name || !subject || !body) return res.status(400).json({ error: "Name, topic, and a message are required" });
    if (!isEmail(email)) return res.status(400).json({ error: "Enter a valid email" });
    await prisma.message.create({ data: { name, email, subject, body } });
    res.json({ ok: true });
  }),
);

router.post(
  "/admin/login",
  asyncRoute(async (req, res) => {
    const email = str(req.body.email, 200).toLowerCase();
    const password = typeof req.body.password === "string" ? req.body.password.slice(0, 200) : "";
    const admin = email ? await prisma.admin.findUnique({ where: { email } }) : null;
    if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.json({ token: signAdmin(admin), admin: { name: admin.name, email: admin.email } });
  }),
);

mountCrud("releases", { model: "release", orderBy: { releaseDate: "desc" }, input: releaseInput, feature: true });
mountCrud("videos", { model: "video", orderBy: { publishedAt: "desc" }, input: videoInput, feature: true });
mountCrud("events", { model: "event", orderBy: { date: "asc" }, input: eventInput });
mountCrud("posts", { model: "post", orderBy: { createdAt: "desc" }, input: postInput });
mountCrud("quotes", { model: "quote", orderBy: { id: "asc" }, input: quoteInput, feature: true });

router.get(
  "/admin/messages",
  requireAdmin,
  asyncRoute(async (req, res) => {
    const items = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ items });
  }),
);

router.patch(
  "/admin/messages/:id",
  requireAdmin,
  asyncRoute(async (req, res) => {
    const id = idParam(req);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const item = await prisma.message.update({ where: { id }, data: { read: Boolean(req.body.read) } });
    res.json(item);
  }),
);

router.delete(
  "/admin/messages/:id",
  requireAdmin,
  asyncRoute(async (req, res) => {
    const id = idParam(req);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    await prisma.message.delete({ where: { id } });
    res.json({ ok: true });
  }),
);

router.get(
  "/admin/subscribers",
  requireAdmin,
  asyncRoute(async (req, res) => {
    const items = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ items });
  }),
);

router.delete(
  "/admin/subscribers/:id",
  requireAdmin,
  asyncRoute(async (req, res) => {
    const id = idParam(req);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    await prisma.subscriber.delete({ where: { id } });
    res.json({ ok: true });
  }),
);

router.put(
  "/admin/settings",
  requireAdmin,
  asyncRoute(async (req, res) => {
    const parsed = settingsInput(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });
    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: parsed.data,
      create: { id: 1, ...parsed.data },
    });
    res.json(settings);
  }),
);

router.post(
  "/admin/password",
  requireAdmin,
  asyncRoute(async (req, res) => {
    const current = typeof req.body.current === "string" ? req.body.current.slice(0, 200) : "";
    const next = typeof req.body.next === "string" ? req.body.next : "";
    if (next.length < 8 || next.length > 200) {
      return res.status(400).json({ error: "Use 8 to 200 characters" });
    }
    const admin = await prisma.admin.findUnique({ where: { id: req.admin.id } });
    if (!admin || !(await verifyPassword(current, admin.passwordHash))) {
      return res.status(400).json({ error: "Current password is wrong" });
    }
    await prisma.admin.update({
      where: { id: admin.id },
      data: { passwordHash: await hashPassword(next) },
    });
    res.json({ ok: true });
  }),
);

router.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use("/api", router);

const clientDist = join(dirname(fileURLToPath(import.meta.url)), "../../client/dist");
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) return next();
    res.sendFile(join(clientDist, "index.html"), (err) => (err ? next(err) : undefined));
  });
} else {
  app.get("/", (req, res) => {
    res
      .type("html")
      .send(
        '<!doctype html><meta charset="utf-8"><title>Marven Jean API</title><body style="font-family:Georgia,serif;background:#0b0908;color:#f4efe6;padding:3rem"><h1>Marven Jean API is running.</h1><p>Open the site at <a style="color:#e6c48a" href="http://localhost:5173">http://localhost:5173</a>.</p></body>',
      );
  });
}

app.use((err, req, res, next) => {
  if (err?.type === "entity.parse.failed") return res.status(400).json({ error: "Invalid JSON" });
  if (err?.code === "P2025") return res.status(404).json({ error: "Not found" });
  if (err?.code === "P2002") return res.status(400).json({ error: "That already exists" });
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "Something went wrong" });
});

const port = Number(process.env.PORT) || 4000;
const server = app.listen(port, () => {
  console.log(`Marven Jean API listening on http://localhost:${port}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use.`);
    process.exit(1);
  }
  console.error(err);
  process.exit(1);
});
