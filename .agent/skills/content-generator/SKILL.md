---
name: content-generator
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
description: "Master XLOOKUP with practical step-by-step examples, formula syntax, and troubleshooting tips."
date: "2026-07-23"
updated: "2026-07-23"
category: "Excel" # Excel, Google Sheets, AI, Formulas, Tutorials
tags: ["XLOOKUP", "Formulas", "Excel"]
published: true
heroImage: "/images/posts/xlookup-guide.webp"
```

---

## 3. Writing & Formatting Rules

1. **English Language Only:** All posts are written in English.
2. **Clear & Direct Intro:** State the spreadsheet problem clearly in the first paragraph.
3. **Formula Code Blocks:** Use explicit code blocks for formula syntax explanations:
   ```excel
   =XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])
   ```
4. **Custom Components:** Use `<Callout>`, `<Gallery>`, `<ImageGrid>`, or `<DownloadButton>` where applicable.
5. **HTML Class Attribute:** Always use `className="..."` inside MDX elements.
