import { MetadataRoute } from 'next';

/**
 * Generates the robots.txt file for the site.
 *
 * Rule groups (ordered by specificity):
 *   1. Search engines (Googlebot, Bingbot, etc.)
 *   2. AI/LLM crawlers (GPTBot, ClaudeBot, etc.)
 *   3. Social media crawlers (Twitterbot, Facebook, etc.)
 *   4. Catch-all (*)
 */
export default function robots(): MetadataRoute.Robots {
  const commonDisallow = ["/api/admin/", "/api/dev/"];

  const searchDisallow = [...commonDisallow, "/api/"];
  const aiDisallow = [...commonDisallow, "/api/"];
  const socialDisallow = [...commonDisallow, "/api/"];

  return {
    rules: [
      {
        userAgent: ["Googlebot", "Bingbot", "Applebot", "Amazonbot"],
        allow: "/",
        disallow: searchDisallow,
      },
      {
        userAgent: [
          "GPTBot",
          "ClaudeBot",
          "anthropic-ai",
          "PerplexityBot",
          "Applebot-Extended",
          "Bytespider",
        ],
        allow: "/",
        disallow: aiDisallow,
      },
      {
        userAgent: [
          "Twitterbot",
          "facebookexternalhit",
          "LinkedInBot",
          "Slackbot",
          "Discordbot",
          "WhatsApp",
          "TelegramBot",
        ],
        allow: "/",
        disallow: socialDisallow,
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: searchDisallow,
      },
    ],
    sitemap: "https://sheethub.web.id/sitemap.xml",
  };
}
