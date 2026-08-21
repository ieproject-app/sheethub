#!/usr/bin/env python3
"""sheethub_featured_rotator.py — Automated Featured / Hero Post Curation Engine.

Menganalisis draf dan artikel terbit di SheetHub (_posts/*.mdx), mendeteksi
artikel featured yang sudah basi / stale (>30 hari), dan merekomendasikan
rotasi 4-6 artikel Hero Homepage dengan komposisi seimbang (50% Excel, 50% GSheets).

Usage:
  python3 sheethub_featured_rotator.py --report     # Tampilkan lineup Hero saat ini & analisis kesegaran
  python3 sheethub_featured_rotator.py --recommend  # Berikan rekomendasi 4 artikel terbaik untuk Hero
  python3 sheethub_featured_rotator.py --apply      # Terapkan rotasi otomatis ke file _posts/*.mdx
"""

import argparse
import datetime
import json
import re
import sys
from pathlib import Path

BASE_DIR = Path.home() / ".hermes" / "agents" / "sheethub"
POSTS_DIR = BASE_DIR / "_posts"

# Fallback ke folder lokal jika dijalankan di laptop
if not POSTS_DIR.exists():
    LOCAL_POSTS = Path(__file__).resolve().parent.parent / "_posts"
    if LOCAL_POSTS.exists():
        POSTS_DIR = LOCAL_POSTS

# Bobot nilai topik untuk Hero Featured
CORNERSTONE_TAGS = {
    "tutorial": 3,
    "advanced-formulas": 3,
    "dynamic-arrays": 3,
    "productivity": 2,
    "data-analysis": 2,
    "interactive": 2,
    "formulas": 1,
    "guide": 1,
}

def parse_frontmatter(file_path: Path):
    content = file_path.read_text(encoding="utf-8")
    if not content.startswith("---"):
        return None, content
    
    parts = content.split("---", 2)
    if len(parts) < 3:
        return None, content
    
    fm_text = parts[1]
    body = parts[2]
    
    fm = {}
    for line in fm_text.strip().split("\n"):
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if ":" in line:
            key, val = line.split(":", 1)
            key = key.strip()
            val = val.strip().strip('"').strip("'")
            if val.lower() == "true":
                val = True
            elif val.lower() == "false":
                val = False
            elif val.startswith("[") and val.endswith("]"):
                items = [x.strip().strip('"').strip("'") for x in val[1:-1].split(",") if x.strip()]
                val = items
            fm[key] = val
            
    return fm, body

def get_post_platform(fm: dict) -> str:
    category = str(fm.get("category", "")).lower()
    tags = [t.lower() for t in fm.get("tags", [])] if isinstance(fm.get("tags"), list) else []
    title = str(fm.get("title", "")).lower()
    
    if "google sheets" in category or "google-sheets" in tags or "google sheets" in title or "sheets" in tags:
        return "Google Sheets"
    return "Excel"

def score_article(fm: dict, slug: str) -> float:
    # 1. Base recency score
    date_str = fm.get("updated") or fm.get("date") or "2026-01-01"
    try:
        dt = datetime.datetime.strptime(str(date_str)[:10], "%Y-%m-%d").date()
    except Exception:
        dt = datetime.date(2026, 1, 1)
    
    today = datetime.date.today()
    age_days = (today - dt).days
    
    # Recency score: 100 max, berkurang 1 poin per 2 hari
    recency_score = max(0.0, 100.0 - (age_days * 0.5))
    
    # 2. Tag depth / Cornerstone value
    tag_score = 0
    tags = fm.get("tags", [])
    if isinstance(tags, list):
        for t in tags:
            tag_score += CORNERSTONE_TAGS.get(t.lower(), 0)
            
    # 3. Bonus for practical tutorial title
    title = str(fm.get("title", "")).lower()
    bonus = 0
    if "guide" in title or "complete" in title or "how to" in title or "vs" in title:
        bonus += 5
    if "spill" in title or "dropdown" in title or "query" in title or "checkbox" in title or "lambda" in title:
        bonus += 10
        
    return recency_score + (tag_score * 2) + bonus

def scan_posts():
    if not POSTS_DIR.exists():
        print(f"Directory {POSTS_DIR} does not exist.")
        return []
    
    posts = []
    for f in POSTS_DIR.glob("*.mdx"):
        fm, body = parse_frontmatter(f)
        if fm and fm.get("published") is True:
            slug = f.stem
            platform = get_post_platform(fm)
            score = score_article(fm, slug)
            date_str = str(fm.get("updated") or fm.get("date") or "2026-01-01")[:10]
            is_featured = bool(fm.get("featured", False))
            posts.append({
                "file": f,
                "slug": slug,
                "title": fm.get("title", slug),
                "category": fm.get("category", "General"),
                "platform": platform,
                "date": date_str,
                "is_featured": is_featured,
                "score": score,
                "fm": fm,
                "body": body
            })
    return posts

def report_status(posts):
    current_featured = [p for p in posts if p["is_featured"]]
    print("=== CURRENT HOMEPAGE HERO / FEATURED POSTS ===")
    print(f"Total Featured: {len(current_featured)} / 4 targets")
    today = datetime.date.today()
    
    for idx, p in enumerate(current_featured, 1):
        dt = datetime.datetime.strptime(p['date'], "%Y-%m-%d").date()
        age = (today - dt).days
        stale_badge = "⚠️ [STALE >30d]" if age > 30 else "✅ [FRESH]"
        print(f"  {idx}. [{p['platform']}] {p['title']} ({p['slug']})")
        print(f"     Date: {p['date']} ({age} hari lalu) {stale_badge} | Score: {p['score']:.1f}")
        
    excel_candidates = sorted([p for p in posts if p["platform"] == "Excel"], key=lambda x: x["score"], reverse=True)
    gsheets_candidates = sorted([p for p in posts if p["platform"] == "Google Sheets"], key=lambda x: x["score"], reverse=True)
    
    print("\n=== TOP RECOMMENDED HERO CANDIDATES ===")
    print("--- Top Excel Candidates ---")
    for p in excel_candidates[:3]:
        print(f"  • {p['title']} (Score: {p['score']:.1f}, Date: {p['date']}, Featured: {p['is_featured']})")
    print("--- Top Google Sheets Candidates ---")
    for p in gsheets_candidates[:3]:
        print(f"  • {p['title']} (Score: {p['score']:.1f}, Date: {p['date']}, Featured: {p['is_featured']})")

def get_best_lineup(posts):
    excel_candidates = sorted([p for p in posts if p["platform"] == "Excel"], key=lambda x: x["score"], reverse=True)
    gsheets_candidates = sorted([p for p in posts if p["platform"] == "Google Sheets"], key=lambda x: x["score"], reverse=True)
    
    top_excel = excel_candidates[:2]
    top_gsheets = gsheets_candidates[:2]
    return top_excel + top_gsheets

def apply_rotation(posts):
    target_lineup = get_best_lineup(posts)
    target_slugs = {p["slug"] for p in target_lineup}
    
    print("Applying recommended Hero lineup (2 Excel + 2 Google Sheets):")
    for p in target_lineup:
        print(f"  ⭐ [{p['platform']}] {p['title']} ({p['slug']})")
        
    updated_count = 0
    for p in posts:
        should_be_featured = p["slug"] in target_slugs
        if p["is_featured"] != should_be_featured:
            fm = p["fm"]
            fm["featured"] = should_be_featured
            # Reconstruct MDX
            f = p["file"]
            lines = []
            lines.append("---")
            for k, v in fm.items():
                if isinstance(v, list):
                    val_str = json.dumps(v)
                    lines.append(f"{k}: {val_str}")
                elif isinstance(v, bool):
                    lines.append(f"{k}: {str(v).lower()}")
                else:
                    lines.append(f'{k}: "{v}"')
            lines.append("---")
            new_content = "\n".join(lines) + "\n" + p["body"].lstrip("\n")
            f.write_text(new_content, encoding="utf-8")
            status_str = "PROMOTED to Featured" if should_be_featured else "DEMOTED from Featured"
            print(f"  -> {p['slug']}: {status_str}")
            updated_count += 1
            
    print(f"\nDone! {updated_count} files updated.")

def main():
    parser = argparse.ArgumentParser(description="SheetHub Featured / Hero Post Rotator")
    parser.add_argument("--report", action="store_true", help="Print current lineup and score report")
    parser.add_argument("--recommend", action="store_true", help="Print recommended 4-card lineup")
    parser.add_argument("--apply", action="store_true", help="Apply featured rotation to MDX files")
    args = parser.parse_args()
    
    posts = scan_posts()
    if not posts:
        print("No published posts found.")
        sys.exit(0)
        
    if args.apply:
        apply_rotation(posts)
    elif args.recommend:
        lineup = get_best_lineup(posts)
        print("=== RECOMMENDED 4-CARD HERO LINEUP ===")
        for idx, p in enumerate(lineup, 1):
            print(f"{idx}. [{p['platform']}] {p['title']} ({p['slug']}) - Score: {p['score']:.1f}")
    else:
        report_status(posts)

if __name__ == "__main__":
    main()
