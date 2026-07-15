import { getRssPostSummaries } from "@/lib/rss-posts";

const DOMAIN = "https://sheethub.web.id";

export const revalidate = 3600;

interface FeedItem {
  title: string;
  link: string;
  description: string;
  pubDate: Date;
  tags?: string[];
}

function rfc822Date(date: Date): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const d = date.getUTCDate();
  const day = days[date.getUTCDay()];
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const h = String(date.getUTCHours()).padStart(2, "0");
  const m = String(date.getUTCMinutes()).padStart(2, "0");
  const s = String(date.getUTCSeconds()).padStart(2, "0");
  return day + ", " + d + " " + month + " " + year + " " + h + ":" + m + ":" + s + " GMT";
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function renderItem(item: FeedItem): string {
  const cats = item.tags?.length
    ? item.tags.map((t) => "    <category>" + escapeXml(t) + "</category>").join("\n") + "\n"
    : "";

  return [
    "    <item>",
    "      <title>" + escapeXml(item.title) + "</title>",
    "      <link>" + escapeXml(item.link) + "</link>",
    "      <description>" + escapeXml(item.description) + "</description>",
    "      <pubDate>" + rfc822Date(item.pubDate) + "</pubDate>",
    '      <guid isPermaLink="true">' + escapeXml(item.link) + "</guid>",
    cats,
    "    </item>",
  ].filter(Boolean).join("\n");
}

export async function GET() {
  const posts = await getRssPostSummaries();

  const feedItems: FeedItem[] = posts.map((post) => ({
    title: post.frontmatter.title,
    link: DOMAIN + "/blog/" + post.slug,
    description: post.frontmatter.description,
    pubDate: new Date(post.frontmatter.date),
    tags: post.frontmatter.tags,
  }));

  feedItems.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
  const latest = feedItems.slice(0, 50);
  const lastBuildDate = latest.length > 0 ? rfc822Date(latest[0].pubDate) : rfc822Date(new Date());

  const rss = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    "    <title>SheetHub</title>",
    "    <link>" + DOMAIN + "</link>",
    "    <description>Excel and Google Sheets tutorials, practical formula guides, and quick updates for daily workflows.</description>",
    "    <language>en</language>",
    "    <lastBuildDate>" + lastBuildDate + "</lastBuildDate>",
    '    <atom:link href="' + DOMAIN + '/rss.xml" rel="self" type="application/rss+xml"/>',
    ...latest.map(renderItem),
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
