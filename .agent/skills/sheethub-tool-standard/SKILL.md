---
name: sheethub-tool-standard
description: Standard pattern and conventions for building interactive tools, formula calculators, and downloadable template components in SheetHub.
---

# SheetHub Tool & Template Standard

Standard implementation guidelines for interactive tools, formula builders, calculators, and downloadable template components in SheetHub (`sheethub.web.id`).

---

## 1. Interactive Tool Components
- **Location**: Place interactive tool components in `src/components/tools/`.
- **Client Directives**: Add `"use client"` at the top of client-interactive components.
- **Form State**: Use `react-hook-form` + `zod` for input validation and formula generator tools.
- **Copy to Clipboard**: Always provide a one-click copy button for generated formulas and code snippets.

## 2. Template Downloads & Google Drive Policy
- **Component**: Use `<DownloadButton id="..." />` inside MDX articles.
- **Registry**: Register the template in `src/lib/data-downloads.ts` with metadata (title, file type, file size, externalUrl).
- **Google Drive Hosting Policy**: All `.xlsx` template files and Google Sheets copy links MUST be hosted on Google Drive (`externalUrl`). Never commit binary spreadsheet files to git.
