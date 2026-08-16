---
name: sheethub-article-reviewer
description: Standard instructions for reviewing SheetHub draft articles via Git branch drafts/sheethub or Server AHC queue, auditing against 5-pillar golden standards, and triggering automated revisions or publishing to main.
---

# SheetHub Article Reviewer Skill

Use this skill whenever the user asks to check, list, or review draft blog articles for SheetHub (e.g. "Review artikel draft", "List artikel yang belum direview", "Review artikel <slug>", or "Cek kualitas artikel").

You act as the **Chief Quality Inspector (EIC)** for SheetHub (`sheethub.web.id`).

---

## 🔄 Standard Multi-IDE & Multi-Agentic Workflow

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: Sync & Detect Draft Articles                                        │
│ • Primary (Git): git checkout drafts/sheethub && git pull origin drafts/sheethub │
│ • Verify Server Queue (Helper Script):                                      │
│   ssh hermes@100.104.234.102 "python3 ~/.hermes/scripts/sheethub_list_queue.py user_review" │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: List Drafts to User                                                 │
│ • List unreviewed articles clearly to the user before auditing              │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 3: Perform 5-Pillar Quality Audit                                      │
│ • Pillar 1: Frontmatter & SEO (Category, tags, 120-160 char description)    │
│ • Pillar 2: Writing Tone & Style (Spreadsheet expert, first paragraph hook) │
│ • Pillar 3: MDX Syntax & React (className everywhere, NEVER class)          │
│ • Pillar 4: Formula & Code Syntax Accuracy (Excel / Google Sheets exact syntax) │
│ • Pillar 5: Templates & Google Drive Policy (Hosted on Google Drive only)   │
└─────────────────────────────────────────────────────────────────────────────┘
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
        [Case A: Needs Revision]               [Case B: 100% Passed]
        • Update frontmatter & git push:       • If revised: commit frontmatter
          git add _posts/<slug>.mdx              cleanup to drafts FIRST
          git commit -m "review: <slug>..."    • SELECTIVE PUBLISH to main:
          git push origin drafts/sheethub        git checkout main && git pull
        • (Optional) Fast-trigger:               git checkout drafts/sheethub -- _posts/<slug>.mdx
          ssh hermes@100.104.234.102             git add _posts/<slug>.mdx
          "python3 ~/.hermes/scripts/            git commit -m "feat(content): publish <slug>"
           sheethub_revise.py                    git push origin main
           --slug <slug> --notes '<notes>'"    • Update server queue to
                                               'pushed_live' (ensure_ascii=False)
```

---

## ⚙️ Environment Prerequisites
- **Git Repository:** Repositori `ieproject-app/sheethub` dengan branch `main` dan `drafts/sheethub`.
- **Server AHC Access (Opsional tapi Direkomendasikan):** Akses SSH ke `hermes@100.104.234.102` (via Tailscale) untuk verifikasi antrean langsung & fast-trigger perbaikan. Jika bekerja di lingkungan offline/tanpa SSH, alur Git murni tetap berfungsi penuh.

---

## 1. Step 1: Sync & Detect Draft Articles

1. **Switch to and pull the dedicated draft branch**:
   ```bash
   git checkout drafts/sheethub
   git pull origin drafts/sheethub
   ```

2. **Detect unreviewed draft files**:
   - Compare draft branch against `main`:
     ```bash
     git diff --name-only main...drafts/sheethub -- _posts/
     ```
   - Check modified or untracked files in `_posts/`:
     ```bash
     git status --short _posts/
     ```

3. **Verify Server Queue State (Single Source of Truth on Server AHC)**:
   - In Server AHC (`100.104.234.102`), articles ready for EIC review have `state: "user_review"`.
   - Inspect queue via the server helper script:
     ```bash
     ssh hermes@100.104.234.102 "python3 ~/.hermes/scripts/sheethub_list_queue.py user_review"
     ```

4. **Direct SCP Fallback (If working in an isolated environment without git remote sync)**:
   ```bash
   scp hermes@100.104.234.102:~/.hermes/agents/sheethub/_posts/<slug>.mdx _posts/
   ```

5. **Present the list of candidate draft articles to the user** before diving into deep review, unless a specific slug is requested directly.

---

## 2. Step 2: Perform 5-Pillar Quality Audit

Inspect each target `.mdx` file against the following 5 pillars:

### Pillar 1: Frontmatter & SEO (`sheethub-content-generator`)
- [ ] Required fields present: `title`, `description`, `date`, `category`, `tags`, `published`, `heroImage`.
- [ ] Title is catchy, informative, and includes target keyword.
- [ ] Meta `description` is concise (120–160 chars) and optimized for search preview.
- [ ] Category matches standard set: `Formulas & Functions`, `Google Sheets`, `Productivity`, `Data Analysis`, `Formatting & Layout`, `Comparison`, `Excel`, `AI`.
- [ ] `tags` is a valid YAML array of lowercase kebab-case strings (no spaces).
- [ ] `heroImage` is set to `"default-og"` (SheetHub standard).

### Pillar 2: Writing Tone & Style (`sheethub-blog-tone`)
- [ ] Written in English (`en`).
- [ ] Introduction is direct, engaging, and states the spreadsheet problem clearly in the first paragraph.
- [ ] Uses proper Markdown heading hierarchy (`##` for sections, `###` for sub-sections).
- [ ] Authoritative, helpful, spreadsheet-expert voice without AI clichés (*"Furthermore"*, *"In conclusion"*).

### Pillar 3: MDX Syntax & React Attributes (`sheethub-rules`)
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
1. Update frontmatter in `_posts/<slug>.mdx` on `drafts/sheethub`:
   ```yaml
   status: "needs_revision"
   revision_notes:
     - "Catatan perbaikan 1..."
     - "Catatan perbaikan 2..."
   ```
2. Stage, commit, and push specific draft to `drafts/sheethub`:
   ```bash
   git add _posts/<slug>.mdx
   git commit -m "review: <slug> needs revision"
   git push origin drafts/sheethub
   ```
3. *Optional / Fast Trigger:* If instant revision is desired without waiting for the 3-hour poller cron on Server AHC:
   ```bash
   ssh hermes@100.104.234.102 "python3 /home/hermes/.hermes/scripts/sheethub_revise.py --slug <SLUG> --notes '<COMPILED_REVISION_NOTES>'"
   ```

---

### Case B: 100% Passed (Approved / Selective Publish to Main)

> [!WARNING]
> **CRITICAL:** NEVER run `git merge drafts/sheethub` into `main`. The `drafts/sheethub` branch contains ALL active in-progress drafts. Always **SELECTIVELY PUBLISH** only the approved article file.

1. Report to user that the article passed all 5 pillars of the SheetHub audit.

2. **Approve-after-revision: clean the frontmatter on `drafts/sheethub` FIRST.** If (and only if) the approved article still carries revision markers:
   - ensure `published: true`
   - remove `status: "needs_revision"` and `revision_notes:`

   If anything changed, commit and push the cleanup to `drafts/sheethub` BEFORE publishing — otherwise the selective checkout in step 3 restores the stale markers, and the server poller may re-trigger a revision on an already-published article:
   ```bash
   git add _posts/<slug>.mdx
   git commit -m "review: <slug> approved (frontmatter cleanup)"
   git push origin drafts/sheethub
   ```
   *Optional instant pickup* (skip the ≤3h poller wait):
   ```bash
   ssh hermes@100.104.234.102 "python3 ~/.hermes/scripts/sheethub_git_revision_poller.py"
   ```

3. Switch to `main` and selectively check out only the approved `.mdx` file:
   ```bash
   git checkout main
   git pull origin main
   git checkout drafts/sheethub -- _posts/<slug>.mdx
   git add _posts/<slug>.mdx
   git commit -m "feat(content): publish <slug>"
   git push origin main
   ```

4. Reconcile Server AHC queue status to `pushed_live`:
   ```bash
   ssh hermes@100.104.234.102 "python3 -c \"import json; p='/home/hermes/.hermes/agents/sheethub/data/article_queue.json'; d=json.load(open(p)); q=d.get('queue',d); [x.update({'state':'pushed_live'}) for x in q if x.get('slug')=='<SLUG>']; json.dump(d,open(p,'w',encoding='utf-8'),indent=2,ensure_ascii=False)\""
   ```

5. Return to `drafts/sheethub` for continuing review work:
   ```bash
   git checkout drafts/sheethub
   ```
