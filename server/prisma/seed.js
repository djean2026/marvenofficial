import "../src/env.js";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/auth.js";

const prisma = new PrismaClient();

const shot = (id, width = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

const search = (title) => `https://open.spotify.com/search/${encodeURIComponent(`Marven Jean ${title}`)}`;
const apple = (title) => `https://music.apple.com/us/search?term=${encodeURIComponent(`Marven Jean ${title}`)}`;

async function main() {
  await prisma.message.deleteMany();
  await prisma.subscriber.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.post.deleteMany();
  await prisma.event.deleteMany();
  await prisma.video.deleteMany();
  await prisma.release.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.settings.deleteMany();

  await prisma.admin.create({
    data: {
      email: "xavier.y@example.org",
      name: "Marven Jean",
      passwordHash: await hashPassword("marven-admin"),
    },
  });

  await prisma.settings.create({
    data: {
      id: 1,
      artistName: "Marven Jean",
      tagline: "Instrumental jazz, written at the piano.",
      heroKicker: "New single · Make it Happen",
      shortBio:
        "Pianist and jazz composer. Marven Jean writes instrumental music for the hour after the room goes quiet.",
      bio: `Marven Jean is a pianist and jazz composer. The music is instrumental: the piano in front, harmony that takes the long way around a melody, and arrangements built to stand without a lyric.

The writing sits with jazz standards and hymns carried back to the keyboard — familiar lines, new voicings, the left hand keeping time. Make it Happen is the new single. Beautiful Love, No One Ever Cared Like Jesus, and Il me conduit sit beside it.

On stage it is the piano, close enough to hear the hammers. The next rooms are Jacmel, Jeremie, Les Cayes, and Cap Haitien. If you stay after the last chord, Marven Jean usually stays too.`,
      location: "Port-au-Prince",
      email: "hello@marvenofficial.com",
      bookingEmail: "booking@marvenofficial.com",
      instagram: "https://www.instagram.com/marven.jean/",
      facebook: "https://www.facebook.com/marven.jean.35",
      tiktok: "https://www.tiktok.com/@marvenofficial",
      youtube: "https://www.youtube.com/channel/UCMWOA2nu0JMo8mDatujJhEg",
      spotify: "https://open.spotify.com/search/Marven%20Jean",
      appleMusic: "https://music.apple.com/us/search?term=Marven%20Jean",
      soundcloud: "https://soundcloud.com/search?q=Marven%20Jean",
      heroImage: shot("1470229722913-7c0e2dbbafd3", 2200),
      portraitImage: shot("1493225457124-a3eb161ffa5f", 1400),
      newsletterNote: "New music, show dates, and the occasional note from the piano. No clutter.",
    },
  });

  await prisma.release.createMany({
    data: [
      {
        title: "Make it Happen",
        type: "Single",
        releaseDate: "2026-11-06",
        coverImage: shot("1514525253161-7a46d19cd819", 1400),
        description: "The new single.",
        tracklist: "Make it Happen",
        spotifyUrl: search("Make it Happen"),
        appleUrl: apple("Make it Happen"),
        youtubeUrl: "https://www.youtube.com/watch?v=TBEPBIZq2vI",
        featured: true,
      },
      {
        title: "Beautiful Love",
        type: "EP",
        releaseDate: "2026-06-20",
        coverImage: shot("1470225620780-dba8ba36b745", 1400),
        description: "The standard, played as instrumental jazz. The melody stays in the open and the harmony takes its time.",
        tracklist: "Beautiful Love",
        spotifyUrl: search("Beautiful Love"),
        appleUrl: apple("Beautiful Love"),
        youtubeUrl: "https://www.youtube.com/watch?v=jfgolSWPWj4",
        featured: false,
      },
      {
        title: "No One Ever Cared Like Jesus",
        type: "Single",
        releaseDate: "2025-11-14",
        coverImage: shot("1483412033650-1015ddeb83d1", 1400),
        description: "The hymn set for solo piano. No vocal line — the changes carry it.",
        tracklist: "No One Ever Cared Like Jesus",
        spotifyUrl: search("No One Ever Cared Like Jesus"),
        appleUrl: apple("No One Ever Cared Like Jesus"),
        youtubeUrl: "https://www.youtube.com/watch?v=R3LrgrPXals",
        featured: false,
      },
      {
        title: "Il me conduit",
        type: "Album",
        releaseDate: "2025-04-02",
        coverImage: shot("1459749411174-04c53bf479b0", 1400),
        description: "Il me conduit, arranged for piano. The melody leads and the left hand answers.",
        tracklist: "Il me conduit",
        spotifyUrl: search("Il me conduit"),
        appleUrl: apple("Il me conduit"),
        youtubeUrl: "https://www.youtube.com/watch?v=EvcQ-FaoSD8",
        featured: false,
      },
    ],
  });

  await prisma.video.createMany({
    data: [
      {
        title: "Marven Jean — Interview | Make it Happen",
        youtubeUrl: "https://www.youtube.com/watch?v=3rx1-dyVJbk",
        youtubeId: "3rx1-dyVJbk",
        description: "Interview and Make it Happen.",
        featured: false,
        publishedAt: "2026-11-06",
      },
      {
        title: "Make it Happen",
        youtubeUrl: "https://www.youtube.com/watch?v=TBEPBIZq2vI",
        youtubeId: "TBEPBIZq2vI",
        description: "The new single.",
        featured: true,
        publishedAt: "2026-10-02",
      },
      {
        title: "Amazing Grace",
        youtubeUrl: "https://www.youtube.com/watch?v=P1iqNg5Ez4E",
        youtubeId: "P1iqNg5Ez4E",
        description: "",
        featured: false,
        publishedAt: "2026-08-14",
      },
      {
        title: "Il me conduit / He Leadeth Me",
        youtubeUrl: "https://www.youtube.com/watch?v=EvcQ-FaoSD8",
        youtubeId: "EvcQ-FaoSD8",
        description: "",
        featured: false,
        publishedAt: "2026-06-20",
      },
      {
        title: "Beautiful Love",
        youtubeUrl: "https://www.youtube.com/watch?v=jfgolSWPWj4",
        youtubeId: "jfgolSWPWj4",
        description: "",
        featured: false,
        publishedAt: "2026-04-11",
      },
      {
        title: "No One Ever Cared Like Jesus / Holy Holy Holy",
        youtubeUrl: "https://www.youtube.com/watch?v=R3LrgrPXals",
        youtubeId: "R3LrgrPXals",
        description: "",
        featured: false,
        publishedAt: "2026-02-07",
      },
      {
        title: "It Could Happen to You",
        youtubeUrl: "https://www.youtube.com/watch?v=zViBHLlLH4g",
        youtubeId: "zViBHLlLH4g",
        description: "",
        featured: false,
        publishedAt: "2025-12-13",
      },
    ],
  });

  await prisma.event.createMany({
    data: [
      {
        title: "Live",
        venue: "To be announced",
        city: "Jacmel",
        date: "2026-12-05",
        time: "8:00 PM",
        ticketUrl: "",
        soldOut: false,
      },
      {
        title: "Live",
        venue: "To be announced",
        city: "Jeremie",
        date: "2026-12-19",
        time: "8:00 PM",
        ticketUrl: "",
        soldOut: false,
      },
      {
        title: "Live",
        venue: "To be announced",
        city: "Les Cayes",
        date: "2027-01-17",
        time: "8:00 PM",
        ticketUrl: "",
        soldOut: false,
      },
      {
        title: "Live",
        venue: "To be announced",
        city: "Cap Haitien",
        date: "2027-02-07",
        time: "8:00 PM",
        ticketUrl: "",
        soldOut: false,
      },
    ],
  });

  await prisma.post.createMany({
    data: [
      {
        title: "Make it Happen is out",
        slug: "make-it-happen-is-out",
        excerpt: "The new single is out.",
        body: `Make it Happen is out today. It started as a sketch at the piano and refused to stay small.

The left hand found the time, the right hand kept the melody in the open, and the last pass got one more chorus of chords than planned. If it finds you late, that is when it was written.

Thank you for waiting on it. The next rooms are on the tour page.`,
        coverImage: shot("1464375117522-1311d6a5b81f", 1600),
        published: true,
        createdAt: new Date("2026-11-06T16:00:00.000Z"),
        updatedAt: new Date("2026-11-06T16:00:00.000Z"),
      },
      {
        title: "The long way through the tour",
        slug: "the-long-way-through-the-tour",
        excerpt: "Dates, vans, and the cities where the second chorus of chords got louder.",
        body: `The dates are up. The run moves through Jacmel, Jeremie, Les Cayes, and Cap Haitien.

Soundcheck is at five when the room allows it. If you are coming early, the quiet pieces happen first. If you are coming late, stay for the last one anyway.

Tickets land city by city. If your town is missing, write — the list is not finished.`,
        coverImage: shot("1429962714451-bb934ecdc4ec", 1600),
        published: true,
        createdAt: new Date("2026-10-28T15:00:00.000Z"),
        updatedAt: new Date("2026-10-28T15:00:00.000Z"),
      },
      {
        title: "What we played in the van",
        slug: "what-we-played-in-the-van",
        excerpt: "A short list from the miles between the last two rooms.",
        body: `The aux cord has a hierarchy. Up-tempo records win in the afternoon. Ballads win after midnight. Someone always puts on a piece we were trying not to be influenced by, and then we are.

A few that stayed in the rotation: a hymn from childhood, a standard that keeps changing key, and a piano sketch that might be the next single.

If you have a song the van should hear, send it with the contact form. We actually read those.`,
        coverImage: shot("1506157786151-b8491531f063", 1600),
        published: true,
        createdAt: new Date("2026-09-14T18:00:00.000Z"),
        updatedAt: new Date("2026-09-14T18:00:00.000Z"),
      },
    ],
  });

  await prisma.quote.createMany({
    data: [
      {
        quote: "A piano that stays in the room after the lights come up.",
        source: "Night Desk",
        featured: true,
      },
      {
        quote: "Make it Happen sits in the hands — a line you mean to play once and then keep.",
        source: "The Late Set",
        featured: false,
      },
      {
        quote: "Live, it is the piano, close enough to hear the hammers.",
        source: "City Pages",
        featured: false,
      },
    ],
  });

  console.log("Seeded Marven Jean. Admin login: xavier.y@example.org / marven-admin");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
