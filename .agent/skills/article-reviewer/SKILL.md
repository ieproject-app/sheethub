---
name: article-reviewer
description: Standard instructions for synchronizing drafts/sheethub branch, listing unreviewed draft articles, auditing against SheetHub standards, and triggering automated revision requests or merging approved articles to main.
---

# SheetHub Article Reviewer Skill

Use this skill whenever the user asks to check, list, or review draft blog articles in `_posts/*.mdx` (e.g. "Review artikel draft", "List artikel yang belum direview", "Review artikel <slug>", or "Cek kualitas artikel").

Antigravity acts as the **Chief Quality Inspector**.

---

## 🔄 Standard Workflow Overview

```text
1. Sync Draft Branch:
   git checkout drafts/sheethub && git pull origin drafts/sheethub

2. List Unreviewed Draft Articles:
   git diff --name-only main...drafts/sheethub -- _posts/
   (List them to the user first without rushing to review immediately unless asked)

3. Perform 5-Pillar Quality Audit on selected article:
   - Pillar 1: Frontmatter & SEO
   - Pillar 2: Writing Tone & Style
   - Pillar 3: MDX Syntax & React Attributes
   - Pillar 4: Formula & Code Accuracy
   - Pillar 5: Interactive Templates & Google Drive Policy

4. Take Action:
   ├─ Case A (Needs Revision):
   │  Update frontmatter status: "needs_revision" + revision_notes,
   │  git commit & push to origin drafts/sheethub (or trigger via SSH to server AHC).
   │
   └─ Case B (100% Passed / Approved):
      Merge drafts/sheethub into main and push to publish live.
```

---

## 1. Step 1: Sync & Detect Draft Articles

1. **Always switch and pull the latest draft branch first**:
   ```bash
   git checkout drafts/sheethub
   git pull origin drafts/sheethub
   ```

2. **List draft articles waiting for review**:
   - Compare draft branch against `main`:
     ```bash
     git diff --name-only main...drafts/sheethub -- _posts/
     ```
   - Check status of files in `_posts/` (including any uncommitted changes):
     ```bash
     git status --short _posts/
     ```
   - Inspect frontmatter status (e.g., `status: "ready_for_review"` or default new drafts).

3. **Present the list to the user** before proceeding to deep review, unless a specific slug is requested directly.

---

## 2. Step 2: Perform 5-Pillar Quality Audit

Inspect each target `.mdx` file against the following 5 pillars:

### Pillar 1: Frontmatter & SEO (`content-generator`)
- [ ] Required fields present: `title`, `description`, `date`, `updated`, `category`, `tags`, `published`, `heroImage`.
- [ ] Title is catchy, informative, and includes target keyword.
- [ ] Meta `description` is concise (120–160 chars) and optimized for search preview.
- [ ] Category matches standard set (`Formulas & Functions`, `Google Sheets`, `Productivity`, `Data Analysis`, `Formatting & Layout`, `Comparison`, `Excel`, `AI`).
- [ ] `tags` is a valid YAML array of strings.
- [ ] `heroImage` is set to `"default-og"` (SheetHub standard).

### Pillar 2: Writing Tone & Style (`sheethub_blog_tone`)
- [ ] Written in English (`en`).
- [ ] Introduction is direct, engaging, and states the spreadsheet problem clearly in the first paragraph.
- [ ] Uses proper Markdown heading hierarchy (`##` for sections, `###` for sub-sections).
- [ ] Authoritative, helpful, spreadsheet-expert voice without AI clichés.

### Pillar 3: MDX Syntax & React Attributes (`sheethub_rules`)
- [ ] **STRICT:** Uses `className="..."` everywhere (NEVER `class="..."`).
- [ ] Custom components used appropriately (`<Callout>`, `<Gallery>`, `<ImageGrid>`, `<DownloadButton>`).
- [ ] File path is strictly flat directly inside `_posts/<slug>.mdx` (never inside subfolders).

### Pillar 4: Formula & Code Syntax Accuracy
- [ ] Formula syntax is accurate for Excel / Google Sheets (e.g., `=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])`).
- [ ] Formula code blocks use explicit language tags (e.g., ````excel ... ````).

### Pillar 5: Interactive Templates & Reader Engagement
- [ ] For tutorial/guide articles, check if an interactive template is included via `<DownloadButton id="..." />`.
- [ ] Verify that the template `id` is registered in `src/lib/data-downloads.ts`.
- [ ] **Google Drive Hosting Policy:** All template files (Google Sheets links and Excel `.xlsx` files) MUST be hosted on Google Drive (`externalUrl`), NEVER stored inside the git repository, keeping the repo lightweight for code and articles only.
- [ ] Check if the article contains clear user instructions (e.g., "File -> Make a copy" for Google Sheets or Google Drive download link for `.xlsx`).

---

## 3. Step 3: Action Based on Audit Results

### Case A: Errors / Improvements Found (Requires Revision)
1. Edit the article's YAML Frontmatter in `_posts/<slug>.mdx` to include the revision details:
   ```yaml
   ---
   title: "..."
   status: "needs_revision"
   revision_notes:
     - "Frontmatter: Meta description is too short (current 85 chars, needs 120-160 chars)."
     - "Section ## Syntax: Change class='bg-gray' to className='bg-gray'."
     - "Formula block: Fix syntax for =VLOOKUP(...) parameter order."
   ---
   ```
2. Commit and push the revision request to `drafts/sheethub`:
   ```bash
   git commit -am "review: <slug> needs revision"
   git push origin drafts/sheethub
   ```
3. *Optional / Fast Trigger:* If instant revision is desired without waiting for the 3-hour poller cron on Server AHC:
   ```bash
   ssh hermes@100.104.234.102 "python3 /home/hermes/.hermes/scripts/sheethub_revise.py --slug <SLUG> --notes '<COMPILED_REVISION_NOTES>'"
   ```
4. Report to user that revision notes have been submitted to Sam (Drafter), Jordan (SEO), and Morgan (Humanizer).

---

### Case B: 100% Passed (Approved / Ready to Publish)
1. Report to the user that the article passed all 5 pillars of the SheetHub audit.
2. If `status: "needs_revision"` or `revision_notes` exist in frontmatter, clean them up or ensure `published: true`.
3. Merge `drafts/sheethub` into `main` and push to publish live:
   ```bash
   git checkout main
   git pull origin main
   git merge drafts/sheethub
   git push origin main
   ```
4. Switch back to `drafts/sheethub` if continuing review work:
   ```bash
   git checkout drafts/sheethub
   ```
