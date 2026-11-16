# Marven

Official artist site: a React homepage for music, shows, videos, and notes, plus a Backstage desk for the owner.

The database is SQLite through Prisma. One file, no database server to install. The content is relational (releases, shows, videos, posts, messages), which fits SQLite better than a document database. To move to Postgres later, change the Prisma provider to `postgresql`, set `DATABASE_URL`, and run the database setup again.

## Run it

```bash
npm run setup
npm run dev
```

Open http://localhost:5173

Backstage: http://localhost:5173/admin/login

- Email: `xavier.y@example.org`
- Password: `marven-admin`

Change that password under Site after you sign in. The sample songs, dates, photos, and videos are placeholders — replace them from Backstage.

## What you can edit

- Site name, bios, photos, and social links
- Releases, with a featured single on the homepage
- YouTube links, with one featured video
- Tour dates
- Journal posts, including drafts
- Press quotes
- Contact messages and the mailing list

Photos and streaming links are ordinary `https` URLs, so you can point them at your own artwork and profiles.

A built site can be served by the API alone:

```bash
npm run build
npm start
```

That listens on http://localhost:4000
