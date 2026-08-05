---
name: article-reviewer
description: Standard instructions for reviewing unpushed/draft SheetHub blog articles (_posts/*.mdx) against SheetHub golden standards and triggering automated revision requests to the Hermes WSL LLM team (Sam, Jordan, Morgan) via sheethub_revise.py.
---

# SheetHub Article Reviewer Skill

Use this skill whenever the user asks to review unpushed, modified, or draft blog articles in `_posts/*.mdx` (e.g. "Review artikel yang belum dipush", "Review artikel <slug>", or "Cek kualitas artikel").

Antigravity acts as the **Chief Quality Inspector**. It audits articles against SheetHub standards and, if revision is needed, delegates the actual editing to the Hermes WSL LLM team (**Sam**, **Jordan**, **Morgan**) via `sheethub_revise.py`.

---

## 1. Step 1: Detect Target Articles

1. Check for unpushed commits or untracked/modified `.mdx` files under `_posts/`:
   ```bash
   git status --short _posts/
   ```
2. Or read unpushed commit diffs:
   ```bash
   git diff @{u}..HEAD -- _posts/
   ```
3. If a specific slug is provided by the user (e.g., `xlookup-complete-guide`), target `_posts/<slug>.mdx` directly.

---

## 2. Step 2: Perform 4-Pillar Quality Audit

Inspect each target `.mdx` file against the following 4 pillars:

### Pillar 1: Frontmatter & SEO (`content-generator`)
- [ ] Required fields present: `title`, `description`, `date`, `updated`, `category`, `tags`, `published`, `heroImage`.
- [ ] Title is catchy, informative, and includes target keyword.
- [ ] Meta `description` is concise (120–160 chars) and optimized for search preview.
- [ ] Category matches standard set (`Formulas & Functions`, `Google Sheets`, `Productivity`, `Data Analysis`, `Formatting & Layout`, `Comparison`, `Excel`, `AI`).
- [ ] `tags` is a valid YAML array of strings.
- [ ] `heroImage` is set to `"default-og"` (SheetHub standard).

### Pillar 3: MDX Syntax & React Attributes (`sheethub_rules`)
- [ ] **STRICT:** Uses `className="..."` everywhere (NEVER `class="..."`).
- [ ] Custom components used appropriately (`<Callout>`, `<Gallery>`, `<ImageGrid>`, `<DownloadButton>`).
- [ ] File path is strictly flat directly inside `_posts/<slug>.mdx` (never inside subfolders).

### Pillar 2: Writing Tone & Style (`sheethub_blog_tone`)
- [ ] Written in English (`en`).
- [ ] Introduction is direct, engaging, and states the spreadsheet problem clearly in the first paragraph.
- [ ] Uses proper Markdown heading hierarchy (`##` for sections, `###` for sub-sections).
- [ ] Authoritative, helpful, spreadsheet-expert voice without AI clichés.

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
Do **NOT** edit the `.mdx` file directly. Instead:
1. Compile clear, structured revision notes outlining:
   - Line numbers / sections with issues.
   - Exact rule violated.
   - Clear instructions for **Sam (Drafter)** on what needs to be fixed.
2. Trigger the Hermes WSL revision script via terminal command:
   ```bash
   wsl python3 /home/snipgeek/.hermes/scripts/sheethub_revise.py --slug <SLUG> --notes "<COMPILED_REVISION_NOTES>"
   ```
3. Report to the user that revision has been triggered for the Hermes LLM Team:
   - State changed: `user_review` -> `in_revision`.
   - Assigned role: **Sam (Drafter - Nemotron 120B)** -> **Jordan (SEO)** -> **Morgan (Humanizer)**.
   - The team will process the revision on the server and return to `user_review` when finished.

### Case B: 100% Passed (No Errors Found)
1. Report to the user that the article passed all 5 pillars of the SheetHub audit.
2. Confirm the article is approved and ready for `git commit` & `git push`.
3. **Post-Push Reconcile:** Immediately after executing `git commit` & `git push`, run:
   ```bash
   wsl python3 /home/snipgeek/.hermes/scripts/sheethub_auto_reconcile.py
   ```
   This automatically updates the server state to `pushed_live`, syncs `article_queue.json` to server AHC, and triggers a Telegram notification: `🚀 Artikel SheetHub Berhasil Publish / Pushed Live!`.

---

## 4. Example Usage Command

```bash
# Example trigger command executed by Antigravity
wsl python3 /home/snipgeek/.hermes/scripts/sheethub_revise.py --slug excel-vlookup-guide --notes "1. Frontmatter: meta description too short (need 120-160 chars). 2. Section ## Syntax: replace class='bg-gray' with className='bg-gray'. 3. Formula block: fix syntax =VLOOKUP(val, table, col, FALSE)."
```
