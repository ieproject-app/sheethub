---
name: sheethub-rules
description: Engineering, architecture, and content rules for the SheetHub project — Next.js, Tailwind CSS, English-only MDX content, Disqus comments, SEO canonical URLs, typography, theme mode, and build safety.
---

# SheetHub Project Rules

These are permanent instructions that MUST be followed at all times when working on the SheetHub project (`sheethub.web.id`). All rules reflect real implementation patterns and agreed architectural decisions.

---

## 1. Tech Stack & Architecture Standards
- **Framework**: Next.js (App Router) + TypeScript + Tailwind CSS (v4).
- **Theme**: Dark/Light mode using `next-themes` (attribute `class` on `<html>`).
- **Icons**: Lucide React.
- **Components**: Radix UI primitives.

## 2. Content & Routing Rules
- **English-Only Content**: All articles in `_posts/*.mdx` are strictly English.
- **Routing**: Flat structure `/blog/[slug]`.
- **Comments**: Disqus integration for community engagement.
- **SEO & Canonical URLs**: Canonical domain is `https://sheethub.web.id`. Ensure metadata exports appropriate canonical links and OpenGraph tags.

## 3. Template & Downloadable Assets Policy
- All interactive templates (`.xlsx`, Google Sheets links) MUST be hosted externally on Google Drive.
- Template IDs must be registered in `src/lib/data-downloads.ts`.
- Repository stays lightweight for code and MDX content only.

## 4. Build Safety & Verification
- Always ensure `npm run typecheck` and `npm run lint` pass before committing.
- Pre-commit hook enforces automatic preflight checks.
