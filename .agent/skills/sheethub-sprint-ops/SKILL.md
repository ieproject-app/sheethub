---
name: sheethub-sprint-ops
description: Panduan operasional mode sprint SheetHub, event-driven auto-chaining pipeline (Sam -> Jordan -> Quinn -> Morgan), kontrol dinamis ganti model/provider LLM (Command-Code, Kiro, DeepSeek, Cline), dan guardrails circuit breaker peak-hour.
target: hybrid
---

# Skill Operasional Sprint SheetHub (`sheethub-sprint-ops`)

Gunakan skill ini sebagai referensi utama saat mengaktifkan **Mode Sprint**, memantau alur produksi *event-driven auto-chaining*, atau mengganti provider model LLM tim secara dinamis di Server AHC.

---

## 📍 ARSITEKTUR & SKEMA LOKASI

| Komponen | Lokasi / Mesin | Path / File Utama |
| :--- | :--- | :--- |
| **Sprint Controller CLI** | Server AHC (`100.104.234.102`) | `/home/hermes/.hermes/scripts/sheethub_sprint.py` |
| **Sprint Sweeper (mesin eksekusi)** | Server AHC | `/home/hermes/.hermes/scripts/sheethub_sprint_sweeper.py` (cron tiap 20 menit; log `ops-log/sprint_sweeper.log`) |
| **Sprint Config & State** | Server AHC | `/home/hermes/.hermes/agents/sheethub/data/sprint_config.json` & `sprint_state.json` |
| **Sweep State (anti-ping-pong)** | Server AHC | `/home/hermes/.hermes/agents/sheethub/data/sweep_state.json` |
| **Article Queue** | Server AHC | `/home/hermes/.hermes/agents/sheethub/data/article_queue.json` |
| **Router & Peak Guard** | Server AHC | `/home/hermes/.hermes/scripts/peak_hour_router.py` |
| **Central Skill Mirror** | Server AHC & Windows | `/home/hermes/skills-hub/skills/sheethub-sprint-ops/` & `C:\Users\Iwan Efendi\.gemini\config\skills\sheethub-sprint-ops\` |

---

## ⚙️ CARA KERJA SWEeper (AUTO-CHAINING ENGINE)

Sweeper berjalan via cron tiap 20 menit dan **memicu job tahap berikutnya begitu ada pekerjaan menunggu dan tidak ada eksekusi yang sedang berjalan** (`max_parallel_jobs: 1`) — tidak menunggu jadwal reguler. Pemetaan state → job:

| Kondisi Antrean | Job yang Dipicu |
| :--- | :--- |
| `in_revision` > 0 | `sheethub-sam-drafter-day` (revisi — selalu boleh) |
| `briefed` > 0 & `drafting` = 0 & buffer OK | `sheethub-sam-drafter-day` (draf baru) |
| `draft_ready` / `seo_review` > 0 | `sheethub-jordan-seo-day` |
| `creative_review` > 0 | `sheethub-quinn-creative-day` |
| `humanize` / `seo_pass` > 0 | `sheethub-morgan-humanize-day` |
| `briefed` < 2 | `sheethub-eic-brief-builder` (generator topik) |

**Aturan aman per dispatch:** satu job per sweep; cooldown 45 menit (brief 6 jam); kuota ekstra 5/job/hari (brief 2/hari; global 24/hari); **anti-ping-pong** — job hanya dipicu ulang jika jumlah item di state masukannya BERUBAH sejak dispatch terakhir. Perintah manual: `--dry-run` (lihat keputusan) dan `--report` (telemetri eksekusi 24 jam per provider).

---

## 🏛️ HIRARKI RESMI MODEL & PROVIDER TIM

Sesuai keputusan arsitektur (ADR-008 & ADR-009):

1. **TIER 1 — Utama & Tulang Punggung Bulanan (24/7 Unlimited)**:
   - **`command-code`** (via 9Router `custom` / `command-code` atau `cx/gpt-5.6-luna`):
     - Berlangganan bulanan aktif. Full agentic capability, tool calling stabil, dan bebas batasan jam peak (jalan 24 jam nonstop).
   - **`kiro`** (via 9Router `custom` / `kr/gpt-5.6-luna-agentic`):
     - Bonus aktif sampai 1 September 2026. Digunakan untuk akselerasi sprint saat ini.
2. **TIER 2 — Cadangan Temporer**:
   - **`cline`** (via `cline` / `cline-pass/deepseek-v4-flash`):
     - Hanya aktif temporer bulan ini (tidak dijadikan acuan jangka panjang).
3. **TIER 3 — Ultimate Fallback Resmi (Safety Net)**:
   - **`deepseek`** (via Direct DeepSeek API / `deepseek-v4-flash`):
     - Jaring pengaman darurat jika 9Router offline.
     - **Wajib Peak-Hour Guard**: Berjalan normal di Jam Lembah (18-23, 02-07, 11:30-12:30 WIB); **OTOMATIS HOLD** di Jam Peak (08-11 & 13-17 WIB).
4. **DIHAPUS TOTAL / BLACKLISTED**:
   - ❌ **`nemotron`** (Nvidia NIM API): Dihapus permanen dari sistem karena sering kena rate limit free-tier dan tidak reliabel untuk agentic.

---

## 🚀 CARA USER MEMINTA PERGANTIAN PROVIDER (SKILL-BASED)

User tidak perlu mengetik atau mengingat perintah terminal. AI secara otomatis membaca skill ini dan mengeksekusi di belakang layar:

| Permintaan User | Tindakan Otomatis AI di Server |
| :--- | :--- |
| *"Ganti provider tim ke Command-Code"* | Menjalankan `python3 ~/.hermes/scripts/sheethub_sprint.py set-model --preset command-code` |
| *"Kembalikan ke Kiro"* | Menjalankan `python3 ~/.hermes/scripts/sheethub_sprint.py set-model --preset kiro` |
| *"Alihkan ke DeepSeek direct"* | Menjalankan `python3 ~/.hermes/scripts/sheethub_sprint.py set-model --preset deepseek` + kunci Peak Guard |
| *"Cek provider apa yang aktif"* | Menjalankan `python3 ~/.hermes/scripts/sheethub_sprint.py status` dan melaporkan ke user |
| *"Mulai sprint 2 hari"* | Menjalankan `python3 ~/.hermes/scripts/sheethub_sprint.py start --days 2 --buffer-max 4` |
| *"Stop sprint"* | Menjalankan `python3 ~/.hermes/scripts/sheethub_sprint.py stop` |

---

## 🛡️ 4 GUARDRAILS OTOMATIS (SAFETY GOVERNORS — DIENFORCE SWEeper)

1. **User Review Buffer Cap (`--buffer-max N`, Default: 4)**:
   - Jika artikel di status `user_review` mencapai $\ge 4$, pembuatan draf baru ditahan sementara (hanya menyelesaikan revisi aktif) agar tidak banjir antrean di meja user. *Dienforce: sweeper menahan dispatch draf baru.*
2. **Ping-Pong Guard**:
   - Maksimal 2 putaran revisi per artikel per hari untuk mencegah loop revisi gagal berulang. *Dienforce: kombinasi cooldown 45 mnt + kuota 5 dispatch/job/hari + anti-stagnasi (dispatch ulang hanya jika jumlah item state masukan berubah).*
3. **DeepSeek Peak Circuit Breaker (ADR-008)**:
   - Jika provider aktif adalah Direct DeepSeek (atau 9Router offline), sistem **OTOMATIS MENAHAN (*HOLD*)** batch pada Jam Peak (`08:00–11:00` & `13:00–17:00` WIB). *Dienforce: sweeper HOLD semua dispatch di jam peak saat provider `deepseek`.*
4. **Timebox Auto-Stop**:
   - Sprint berjalan sesuai durasi hari (`--days N`), kemudian otomatis `STOP`, mengirim rekap ke Telegram (termasuk telemetri eksekusi per provider), dan berpindah ke checkpoint 1 hari fokus review. *Dienforce: sweeper memeriksa `end_time` tiap sweep.*
