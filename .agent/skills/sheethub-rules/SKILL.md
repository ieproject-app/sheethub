---
name: sheethub_rules
description: Engineering, architecture, and content rules for the SheetHub project — Next.js, Tailwind CSS, English-only MDX content, Disqus comments, SEO canonical URLs, typography, theme mode, and build safety.
---

# SheetHub Project Rules

These are permanent instructions that MUST be followed at all times when working on the SheetHub project (`sheethub.web.id`). All rules reflect real implementation patterns and agreed architectural decisions.

---

## 1. Site Identity & Locale Architecture

- **Brand Name:** SheetHub
- **Canonical Domain:** `https://sheethub.web.id`
- **Language Policy:** English only (`en`).
- **No i18n Subpaths:** URLs are direct (e.g., `/blog/my-post`, `/about`, `/contact`). Do NOT add `/en/` or `/id/` URL prefixes.

---

## 2. MDX & Content Writing Standards

Content in SheetHub lives directly in the root content directories:
- Blog posts: `_posts/*.mdx`
- Static page content: `_pages/<slug>/en.mdx`

### Required Frontmatter
Every blog `.mdx` file MUST include:
```yaml
title: "Article Title"
description: "Clear and concise summary for SEO and social preview."
date: "2026-07-23"
updated: "2026-07-23"
category: "Excel" # Excel, Google Sheets, AI, Tutorials, etc.
tags: ["XLOOKUP", "Formulas"]
published: true
heroImage: "default-og" # Always use "default-og" (SheetHub standard)
```

### Custom Components
Use custom React components for rich layout inside MDX:
| Element | Required Component |
|---|---|
| Image Gallery | `<Gallery caption="..."> ... </Gallery>` |
| Image Grid | `<ImageGrid columns={2}> ... </ImageGrid>` |
| Callout / Alert | `<Callout variant="info" title="..."> ... </Callout>` |

### React Attribute Rule in MDX
Never use `class="..."`. Always use `className="..."` in all MDX tags.

---

## 3. Key Site Features & Technical Patterns

### Comments System — Disqus Only
- Rendered via `src/components/blog/article-comments.tsx`
- Uses `disqus-react` loaded dynamically with `IntersectionObserver` on scroll.
- Shortname configured via `process.env.NEXT_PUBLIC_DISQUS_SHORTNAME` (default: `gsheets`).

### Theme Mode — `useThemeMode()` Hook
- Managed by `src/hooks/use-theme-mode.ts`.
- Handles Light / Dark / System transitions cleanly.
- Always use `useThemeMode()`, never write manual theme cycling logic outside this hook.

### Notifications — `useNotification()` Hook
- Simple feedback toasts (e.g., copy link, theme change) use `useNotification()`.

---

## 4. Design & UI System

### Fluid Typography Scale
Always use semantic typography tokens from `tailwind.config.ts`:
- `text-display-sm` / `text-display-md` (Page titles / Hero headings)
- `text-h1` (Article title)
- `text-h2` (Section headings / MDX `##`)
- `text-h3` (Subheadings / MDX `###`)
- `text-article-base` (Body text)

### Spacing & Colors
- Use HSL semantic tokens: `text-primary`, `bg-card`, `border-border`, `text-muted-foreground`.
- Section padding: `py-section-sm` (48px) or `py-section-md` (80px).

---

## 5. SEO & Metadata Standards

Every public page route MUST export valid metadata:
- Canonical URL: `https://sheethub.web.id/<path>`
- OpenGraph (`type: "article"` for posts, `image: "https://sheethub.web.id/opengraph-image"`)
- Twitter Card (`summary_large_image`)
- Structured Data (JSON-LD `Article` & `BreadcrumbList` schema)