---
name: sheethub-article-revision
description: Pemicu revisi artikel SheetHub. Mengarahkan instruksi perbaikan dari user ke Sam (Drafter / Nemotron 120B via DeepInfra), Jordan (SEO / DeepSeek Official API), dan Morgan (Humanizer / Gemma 4 26B via DeepInfra), serta memperbarui state antrean artikel melalui Git branch drafts/sheethub atau script poller di server AHC.
target: antigravity
---

# Skill Revisi Artikel SheetHub (`sheethub-article-revision`)

Skill ini digunakan untuk mengelola alur review dan permintaan revisi/perbaikan pada artikel SheetHub antara Laptop (Antigravity IDE / Editor) dan Server AHC (24/7 Node).

---

## 🔄 Alur Kerja Siklus Review & Revisi (Git-Based Workflow)

```text
[Server AHC: Sam/Jordan/Morgan]
       │
       ▼ Generate Artikel Baru
[Commit & Push ke branch 'drafts/sheethub']
       │
       ▼ Notifikasi Telegram (@cana_hermes_bot)
[User Pull di Laptop]: git checkout drafts/sheethub && git pull origin drafts/sheethub
       │
       ├─────────────────────────────────────────────────┐
       ▼ (Jika Sesuai / Approved)                         ▼ (Jika Butuh Revisi)
[Merge ke Main]:                                  [Edit Frontmatter .mdx]:
git checkout main                                 status: "needs_revision"
git merge drafts/sheethub                         revision_notes:
git push origin main                                - "Catatan perbaikan 1..."
                                                  git commit -am "review: minta revisi"
                                                  git push origin drafts/sheethub
                                                         │
                                                         ▼
                                                  [Server AHC: Poller Tiap 3 Jam]
                                                  (sheethub_git_revision_poller.py)
                                                         │
                                                         ▼
                                                  Tim Sam, Jordan, Morgan merevisi
                                                  dan push draf baru ke drafts/sheethub
```

---

## 🛠️ Cara Meminta Revisi Artikel

Ada 2 cara untuk meminta revisi:

### Cara 1: Melalui Editor di Laptop (Direkomendasikan)
1. Buka file artikel `.mdx` di folder `_posts/` (branch `drafts/sheethub`).
2. Di bagian atas (YAML Frontmatter), ubah status dan tambahkan catatan revisi:
   ```yaml
   ---
   title: "Panduan Lengkap Rumus Excel 2026"
   status: "needs_revision"
   revision_notes:
     - "Perjelas contoh formula XLOOKUP vs VLOOKUP dengan studi kasus nyata."
     - "Tambahkan tabel perbandingan kelebihan dan kekurangan."
     - "Periksa kembali heading H2 dan H3 agar lebih mengalir secara naratif."
   ---
   ```
3. Commit dan push ke branch drafts:
   ```bash
   git commit -am "review: minta revisi formula dan tabel"
   git push origin drafts/sheethub
   ```
4. **Selesai!** Script `sheethub_git_revision_poller.py` di server AHC yang berjalan setiap 3 jam akan otomatis mendeteksi perubahan ini dan menugaskan kembali tim agen.

---

### Cara 2: Manual Trigger via SSH Command
Jika ingin langsung memicu revisi secara instan tanpa menunggu jadwal cron:
```bash
ssh hermes@100.104.234.102 "python3 /home/hermes/.hermes/scripts/sheethub_revise.py --slug <SLUG> --notes '<CATATAN_REVISI>'"
```

---

## 👥 Alur Eksekusi Tim Agen di Server AHC

Ketika status `needs_revision` terdeteksi:
1. **Queue State Update**: Status slug diubah menjadi `in_revision` dan catatan disimpan di `data/revisions/<SLUG>_revision_notes.md`.
2. **Tahap 1 (Sam - Drafter / Nemotron 120B)**: Membaca catatan revisi dan memperbarui struktur konten `.mdx` di `_posts/<SLUG>.mdx`.
3. **Tahap 2 (Jordan - SEO Reviewer / DeepSeek V4)**: Mengaudit ulang SEO, heading struktur, keyword density, dan meta tags.
4. **Tahap 3 (Morgan - Humanizer / Gemma 4 26B & Sanitizer)**: Memoles gaya bahasa (*burstiness & narrative tone*) serta membersihkan em-dash/frasa klise AI.
5. **Kirim Ulang Draf**: Draf yang sudah direvisi otomatis di-commit ke `drafts/sheethub` dan bot Telegram `@cana_hermes_bot` mengirim notifikasi baru ke user.
