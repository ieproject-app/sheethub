# AGENTS.md — SheetHub

`sheethub.web.id` — Next.js (App Router) + Tailwind CSS v4. Konten blog MDX English-only di `_posts/*.mdx`, komentar Disqus, contoh file artikel (.xlsx kecil) di-host di repo `public/downloads/templates/` (Google Drive opsional/manual), visual artikel via Cloudinary (skill `sheethub-visual-ops`), deployment Firebase App Hosting.

## Review & Publikasi Artikel
- Draf aktif di branch `drafts/sheethub`; production di `main`. Sebelum kerja: pastikan sync (`git pull --ff-only origin <branch>`) dan working tree bersih.
- Gunakan skill `sheethub-article-reviewer` untuk audit 5-pilar (frontmatter/SEO, tone, MDX, akurasi formula, kebijakan Google Drive).
- **Approve**: bersihkan marker revisi di frontmatter → commit + push ke `drafts/sheethub` DULU → selective publish file ke `main` (`git checkout main && git pull && git checkout drafts/sheethub -- _posts/<slug>.mdx && git push origin main`) → update queue server.
- **Revisi**: set `status: "needs_revision"` + `revision_notes` di frontmatter, push ke `drafts/sheethub`, lalu (opsional) trigger `sheethub_revise.py` via SSH `hermes@100.104.234.102`.

## Sprint Mode & Provider LLM (skill `sheethub-sprint-ops`)
- Kontrol sprint di server: `python3 ~/.hermes/scripts/sheethub_sprint.py {start|stop|status|set-model}`.
- Guardrails: buffer `user_review` ≥ 4 → hold draf baru; maks 2 putaran revisi/hari/artikel; DeepSeek hold otomatis jam peak (08–11 & 13–17 WIB).
- Hierarki provider: `command-code` (utama) → `kiro` (bonus s.d. 1 Sep 2026) → `deepseek` (fallback, wajib peak guard).

## Standar Konten & Engineering
- `sheethub-content-generator`: standar MDX & frontmatter SEO (English-only, canonical). Setiap artikel baru WAJIB 1 contoh file `.xlsx` repo-hosted + `<DownloadButton>` (G25).
- `sheethub-blog-tone`: gaya spreadsheet expert untuk artikel Excel/Google Sheets.
- `sheethub-adsense`, `sheethub-tool-standard`, `sheethub-rules`: kepatuhan AdSense, pola tool interaktif, dan aturan engineering.
- `sheethub-visual-ops`: loop visual harian (marker screenshot → user capture → webp 4:3 → Cloudinary cloud `snipgeek` folder `sheethub/images/`) — [[ADR-034]] di Second Brain. Proses SATU artikel per ronde dengan handoff card.
- Catat keputusan arsitektur ke Second Brain (`D:\SecondBrain`) via skill `obsidian-second-brain`.

## Perintah
- `npm run dev` — dev server (port 3000)
- `npm run build` / `npm start` — production
- `npm run check` — typecheck (`tsc --noEmit`) + lint (ESLint 9)
