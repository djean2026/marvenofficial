import "../src/env.js";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const site = await prisma.settings.findUnique({ where: { id: 1 } });
const releases = await prisma.release.findMany({ orderBy: { releaseDate: "desc" } });
const videos = await prisma.video.findMany({ orderBy: { publishedAt: "desc" } });
const events = await prisma.event.findMany({ orderBy: { date: "asc" } });
const posts = await prisma.post.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } });
const quotes = await prisma.quote.findMany({ orderBy: [{ featured: "desc" }, { id: "asc" }] });

const target = join(dirname(fileURLToPath(import.meta.url)), "../../client/src/catalog.json");
writeFileSync(target, `${JSON.stringify({ site, releases, videos, events, posts, quotes }, null, 2)}\n`);
console.log(`Wrote ${target}`);
await prisma.$disconnect();
