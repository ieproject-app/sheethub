# SheetHub

> A modern, minimalist tech blog and internal toolkit — built with Next.js 16, React 19, and Tailwind CSS v4.

SheetHub is a bilingual (EN/ID) content platform for publishing technical articles, short notes, and running web-based tools. It uses the Next.js App Router with a `[locale]` dynamic segment for full i18n support, MDX for rich content, and Firebase/App Hosting for deployment and optional app services.

---

## ✨ Features

### 📝 Blog & Notes
- MDX-powered articles and short-form notes with full syntax highlighting (via Shiki, `github-dark` theme)
- **Zoomable Images**: Interactive image previews with click-to-exit functionality.
- **Download Buttons**: Custom MDX components for software/file downloads.
- Table of Contents auto-generated from `##` and `###` headings
- Reading time estimation
- Fallback to EN when a locale-specific translation does not exist
- Tag and category system with a colour-coded badge library (`category-badge.tsx`)
- Giscus comment system (GitHub Discussions), lazy-loaded on scroll, production-only

### 🌐 Internationalization (i18n)
- Two locales: **English (`en`)** — default, no URL prefix — and **Indonesian (`id`)** — `/id/` prefix
- Locale detection via `Accept-Language` header with cookie-based persistence (`NEXT_LOCALE`)
- Client-side locale switching with `router.push(..., { scroll: false })` — no page reload, no scroll jump
- `hreflang` alternates on every public page for SEO

### 🎨 Theme System (3-mode)
- **Light / Dark / System** — cycled via a single button in the header and a floating button on scroll
- Preference persisted in `localStorage` with a 1-week expiry for manual overrides (light/dark)
- Switching to "System" removes the expiry so OS preference takes over immediately
- Smooth crossfade via the **View Transitions API** (`document.startViewTransition`) with a `prefers-reduced-motion` fallback

### 🔍 Search
- Full client-side search across all blog posts and notes, built into the header
- Highlights matching substrings in results

### 📚 Reading List
- Save/remove articles to a persistent reading list stored in `localStorage`
- Accessible from the header at any time

### 🛠️ Tools
Current direction: content-first rollout. Public pages stay fully accessible, while login-gated flows are temporarily isolated.

| Tool | Access | Status |
|---|---|---|
| AI Article Prompt Generator | Internal | Temporarily Isolated |
| Employee History (Riwayat Karyawan) | Internal | Temporarily Isolated |
| Number Generator | Internal | Temporarily Isolated |
| Number to Words | Public | 🚧 Coming Soon |
| Random Name Generator | Public | 🚧 Coming Soon |

### 📢 Notification Bar
- Custom status-bar notification system (`useNotification`) shown in the header
- Used for reading list actions, copy confirmations, etc.
- **Do not** replace with Shadcn's `useToast` for these short feedback messages

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm

### Install & Run

```bash
npm install
npm run dev        # starts on http://localhost:3000 (Turbopack)
```

### Other Scripts

```bash
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit (no build artefacts)
npm run lint       # ESLint
```

---

## 🔧 Firebase Configuration

SheetHub uses Firebase App Hosting and optional Firebase app services. Firebase config is loaded **exclusively from environment variables** — never hardcoded.

### Local Development (`.env.local`)

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_ENABLE_LOGIN=false

# Optional: restrict internal tools to specific Google accounts/domains
# Example: alice@sheethub.web.id,bob@gmail.com,@telkomakses.co.id
NEXT_PUBLIC_INTERNAL_TOOL_ALLOWLIST=
```

`NEXT_PUBLIC_ENABLE_LOGIN=false` keeps login-related flows isolated while the site focuses on public content rollout.

If `NEXT_PUBLIC_INTERNAL_TOOL_ALLOWLIST` is empty, internal tools remain accessible to any authenticated Google account (legacy behavior). If set, only matching emails/domains can access non-public tools.

### Production (Google Cloud — `apphosting.yaml`)

The project is deployed via **Firebase App Hosting**. Environment variables for production are injected through `apphosting.yaml`.

Current production setup uses project `sheethub-next` and keeps login disabled by default with `NEXT_PUBLIC_ENABLE_LOGIN=false`.

**Deployment steps (3 steps):**
1. `git push` to `main`
2. Open Firebase Console → **App Hosting** → **Rollouts**
3. Click **"Start Rollout"** and verify rollout + custom domain health after build finishes

---

## 📁 Project Structure

```
src/
├── app/
│   ├── [locale]/               # All public pages (blog, notes, tools, about, …)
│   │   ├── blog/
│   │   │   ├── [slug]/         # Individual post page (MDX rendered server-side)
│   │   │   └── page.tsx        # Blog list
│   │   ├── notes/
│   │   │   └── [slug]/         # Individual note page
│   │   ├── tools/              # Tool pages (prompt-generator, employee-history, …)
│   │   └── layout.tsx          # Locale layout — fonts, ThemeProvider, Header, Footer
│   ├── globals.css             # Tailwind 4 CSS (CSS variables for light/dark)
│   ├── not-found.tsx           # 404 page (ThemeProvider-aware, correct fonts)
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── layout/                 # layout-header.tsx, layout-footer.tsx, layout-breadcrumbs.tsx
│   ├── blog/                   # article-meta.tsx, article-share.tsx, article-related.tsx, article-toc.tsx, article-tags.tsx
│   ├── home/                   # home-hero.tsx, home-latest.tsx, home-topics.tsx, home-tutorials.tsx, home-updates.tsx
│   ├── ui/                     # Shadcn/UI primitives + custom (SnipTooltip, Skeleton, …)
│   └── icons/                  # Custom SVG icons (XLogo, TikTokLogo, SheetHubLogo)
├── dictionaries/
│   ├── en.json                 # English strings
│   └── id.json                 # Indonesian strings (must always be in sync with en.json)
├── firebase/                   # Firebase singleton init, auth, firestore, storage helpers
├── hooks/
│   ├── use-theme-mode.ts       # Centralised theme cycling + persistence logic
│   ├── use-reading-list.tsx    # Reading list context + localStorage persistence
│   ├── use-notification.tsx    # Status bar notification context
│   └── use-mobile.tsx
├── lib/
│   ├── constants.ts            # localStorage key constants (STORAGE_KEYS)
│   ├── utils.ts                # cn(), getLinkPrefix(), resolveHeroImage(), formatRelativeTime()
│   ├── posts.ts                # MDX post utilities (read, sort, translate)
│   ├── notes.ts                # MDX notes utilities
│   ├── mdx-utils.ts            # extractHeadings() for ToC
│   ├── get-dictionary.ts       # Async dictionary loader
│   ├── placeholder-images.ts   # Typed wrapper for placeholder-images.json
│   └── placeholder-images.json # Image placeholder registry (id → imageUrl + hint)
└── middleware.ts               # Locale detection + cookie-based redirect/rewrite
```

### Content Directories

```
_posts/
├── en/   # English MDX posts
└── id/   # Indonesian MDX posts

_notes/
├── en/
└── id/
```

---

## ✍️ Writing Content

### Required Frontmatter

Every `.mdx` file **must** include:

```yaml
---
title: "Your Article Title"
date: "2025-01-15"
updated: "2025-01-20"       # optional — used in sitemap lastModified
description: "One-sentence summary for SEO and card previews."
translationKey: "english-kebab-case-slug"  # REQUIRED — same in EN and ID versions
heroImage: "img-id-from-json"              # Use an ID from placeholder-images.json
# heroImage: "/images/blog/custom.webp"   # or a /images/ path for a custom image
published: true                            # false = draft (visible only in dev)
featured: false                            # true = shown in HomeHero carousel
category: "Tutorial"                       # drives the colour-coded badge
tags: ["Windows", "PowerShell"]
---
```

### Heading Structure
- Use only `##` (H2) and `###` (H3) — these are automatically parsed into the Table of Contents
- Never use `#` (H1) inside content — the page `<h1>` is the article title

### Content Workflow
1. Check `src/lib/placeholder-images.json` for a suitable hero image `id`
2. If none fits, add a new entry to the JSON first
3. Create the MDX file in `_posts/en/` (and optionally `_posts/id/` with the same `translationKey`)
4. Set `published: false` while drafting — the Dev Tools draft panel shows all unpublished files

---

## 🎨 Design System

### Typography (fluid — always use tokens, never raw `text-5xl`)

| Token | Range | Use |
|---|---|---|
| `text-display-sm` | 36–68px | Page H1 (blog list, contact, notes list) |
| `text-h1` – `text-h6` | 14–30px | Section and card headings |
| `text-article-base` | 17–20px | Article body prose |
| `text-ui-sm` / `text-ui-xs` | 11 / 10px | Badges, timestamps |

### Colour Philosophy
- **Never** hardcode Tailwind palette classes (`text-blue-500`, `bg-gray-900`)
- Always use semantic CSS variable tokens: `text-primary`, `text-accent`, `bg-muted`, etc.
- Use opacity modifiers for variants: `text-primary/60`, `bg-primary/10`

### Spacing Tokens
```tsx
// ✅ Semantic section padding
<section className="py-section-sm sm:py-section-md">

// ❌ Hardcoded — avoid
<section className="py-12 sm:py-16">
```

### Component Rules
| Element | Rule |
|---|---|
| Rounded corners | `rounded-xl` or `rounded-2xl` — never `rounded-sm` |
| Glassmorphism | `bg-card/50 backdrop-blur-sm border-primary/5` |
| Icons | Lucide React only — never guess icon names |
| Badges | Use `CategoryBadge` — never create colours ad-hoc |
| Notifications | `useNotification()` — never `useToast()` for short feedback |

---

## 🔑 localStorage Key Reference

All keys are defined in `src/lib/constants.ts` as `STORAGE_KEYS`. **Always use the constant, never a raw string.**

| Constant | Key | Purpose |
|---|---|---|
| `STORAGE_KEYS.READING_LIST` | `readingList` | Saved reading list items (JSON array) |
| `STORAGE_KEYS.THEME_MANUAL_EXPIRE` | `snipgeek-theme-manual-expire` | Unix ms timestamp — manual theme expiry |
| `STORAGE_KEYS.THEME` | `theme` | Active theme (`light`/`dark`/`system`) |
| `STORAGE_KEYS.LOCALE` | `NEXT_LOCALE` | User's chosen language |

---

## 🌍 i18n Rules

- `i18n.defaultLocale` is `"en"` — English URLs have **no prefix** (e.g., `/blog/my-post`)
- Indonesian URLs use `/id/` prefix (e.g., `/id/blog/my-post`)
- When adding new dictionary keys, **always update both** `en.json` and `id.json` simultaneously
- `i18n.locales` is a readonly tuple — use spread `[...i18n.locales]` when a mutable array is needed
- Every public `page.tsx` **must** export `generateMetadata` with `alternates.languages` for hreflang SEO

---

## 🛡️ Security Headers

The following HTTP headers are applied to all routes via `next.config.ts`:

| Header | Value |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | camera, mic, geolocation, interest-cohort blocked |
| `Strict-Transport-Security` | 1 year, includeSubDomains |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + Shadcn/UI |
| Icons | Lucide React |
| Fonts | Bricolage Grotesque, Plus Jakarta Sans, Lora, JetBrains Mono |
| Content | MDX via `next-mdx-remote` v6 |
| Syntax Highlighting | Shiki (`github-dark` theme) |
| Auth & DB | Firebase v11 (Auth/Firestore ready, currently login-gated flows disabled by feature flag) |
| Animations | Framer Motion + CSS View Transitions API |
| i18n | Custom middleware + `@formatjs/intl-localematcher` |
| Ads | Google AdSense (`lazyOnload` strategy) |
| Comments | Giscus (GitHub Discussions) |
| Deployment | Firebase App Hosting (Google Cloud) |

---

## 📋 Firebase Singleton Pattern

All Firebase services are initialised once via `src/firebase/config.ts` using a `memoizedServices` pattern. **Never** call `getAuth()` or `getFirestore()` directly outside the provider.

Note: for the current content-first phase, login-gated features are intentionally isolated. Keep auth-related code paths feature-flagged and non-blocking for public pages.

```typescript
// ✅ Always guard against null before Firestore operations
const handleSubmit = async () => {
  if (!db) return;
  // safe to use db
};

// ✅ getStorage needs undefined, not null
const storage = getStorage(firebaseApp ?? undefined);
```

---
---

## 📄 License

This project uses a **dual license** — please read carefully:

### Source Code — MIT License
All application code in this repository (under `src/`, config files, etc.) is licensed under the **MIT License**.
See the [`LICENSE`](./LICENSE) file for the full terms.

### Content — All Rights Reserved
All written content, articles, and notes — including everything under `_posts/`, `_notes/`, and `_pages/` — are the exclusive intellectual property of **SheetHub (sheethub.web.id)**.

You may **NOT** reproduce, republish, or create derivative works from this content without explicit written permission.

For inquiries: hello@sheethub.web.id

---

*SheetHub &copy; 2026 — Iwan Efendi. All Rights Reserved.*