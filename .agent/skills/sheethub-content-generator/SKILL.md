---
name: sheethub-content-generator
description: Mandatory standards for SheetHub blog content generation. Includes MDX components, SEO frontmatter, tag standardization, and English-only post rules.
---

# SheetHub Content Generator Skill

Use this skill when generating or modifying blog posts (`_posts/*.mdx`). This skill centralizes the SheetHub "Golden Standard" for MDX and SEO.

## 1. Content Placement

> [!WARNING]
> **CRITICAL:** Content folder `_posts` MUST be located at the **absolute root** of the project (`_posts/*.mdx`). **NEVER** place posts inside `src/` or nested locale subfolders.

- **Blog Posts**: `_posts/slug.mdx` (Flat structure directly in `_posts/`)
- **Static Pages**: `_pages/{slug}/en.mdx`

---

## 2. Frontmatter Standards

Every `.mdx` file in `_posts` MUST include the following frontmatter:

```yaml
title: "Complete Guide to XLOOKUP in Excel & Google Sheets"
date: "YYYY-MM-DD"
updated: "YYYY-MM-DD"                      # optional, only when updating
description: "Master XLOOKUP with practical formula examples..." # 120-160 chars
category: "Formulas & Functions"
tags: ["excel", "google-sheets", "xlookup", "formulas", "tutorial"]
published: true
heroImage: "default-og"
```

### Allowed Categories (Strict):
- `Formulas & Functions`
- `Google Sheets`
- `Productivity`
- `Data Analysis`
- `Formatting & Layout`
- `Comparison`
- `Excel`
- `AI`

---

## 3. Writing & MDX Standards

1. **English-Only**: SheetHub articles are written strictly in English (`en`).
2. **Components**:
   - Callout: `<Callout variant="info" title="Pro Tip">...</Callout>`
   - Interactive Download: `<DownloadButton id="slug-from-data-downloads" />`
   - Image Grid: `<ImageGrid columns={2}>...</ImageGrid>`
   - Keyboard: `<Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>L</Kbd>`
3. **Strict React Syntax**: ALWAYS use `className="..."`, NEVER `class="..."`.
4. **Formula Formatting**: Code blocks for formulas must use explicit language tags (e.g. ````excel ... ````).
