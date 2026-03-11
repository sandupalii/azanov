#!/usr/bin/env python3
"""
Fetch yacht descriptions from thai-charters.com catalog pages.
Updates scripts/thai_charters_descriptions.json.

Usage:
  python scripts/fetch_ship_descriptions.py

Requires: urllib (stdlib)
"""

import json
import re
import time
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

ROOT = Path(__file__).resolve().parent.parent
URLS_PATH = ROOT / "scripts" / "thai_charters_urls.json"
DESCRIPTIONS_PATH = ROOT / "scripts" / "thai_charters_descriptions.json"
BASE_URL = "https://thai-charters.com/catalog/"


def load_urls() -> dict:
    """Load ship name -> URL slug mapping."""
    if not URLS_PATH.exists():
        return {}
    with open(URLS_PATH, encoding="utf-8") as f:
        return json.load(f)


def load_descriptions() -> dict:
    """Load existing descriptions."""
    if not DESCRIPTIONS_PATH.exists():
        return {}
    with open(DESCRIPTIONS_PATH, encoding="utf-8") as f:
        return json.load(f)


def fetch_page(url: str) -> str | None:
    """Fetch HTML from URL."""
    req = Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; AzanovRetreat/1.0)"})
    try:
        with urlopen(req, timeout=15) as resp:
            return resp.read().decode("utf-8", errors="replace")
    except (URLError, HTTPError, TimeoutError) as e:
        print(f"  Error: {e}")
        return None


def extract_description(html: str) -> str | None:
    """Extract main description from catalog page HTML."""
    # Remove script/style
    html = re.sub(r"<script[^>]*>[\s\S]*?</script>", "", html, flags=re.I)
    html = re.sub(r"<style[^>]*>[\s\S]*?</style>", "", html, flags=re.I)
    # Look for paragraph content between price block and "Если у вас остался вопрос"
    m = re.search(
        r"(?:Забронировать|Подробнее)[\s\S]*?<p[^>]*>([\s\S]*?)</p>",
        html,
        re.I,
    )
    if m:
        text = m.group(1)
        text = re.sub(r"<[^>]+>", " ", text)
        text = re.sub(r"\s+", " ", text).strip()
        if len(text) > 50:
            return text[:500] + ("…" if len(text) > 500 else "")
    # Fallback: first substantial text block
    m = re.search(r">([А-Яа-яЁё][^<]{80,400})<", html)
    if m:
        return m.group(1).strip()[:400]
    return None


def main():
    urls = load_urls()
    descriptions = load_descriptions()
    updated = 0

    for name, slug in urls.items():
        if not slug.startswith("http"):
            url = BASE_URL + slug.rstrip("/") + "/"
        else:
            url = slug
        print(f"Fetching {name}...")
        html = fetch_page(url)
        if html:
            desc = extract_description(html)
            if desc:
                descriptions[name] = desc
                updated += 1
                print(f"  OK: {desc[:60]}…")
        time.sleep(0.5)  # Be nice to the server

    with open(DESCRIPTIONS_PATH, "w", encoding="utf-8") as f:
        json.dump(descriptions, f, ensure_ascii=False, indent=2)
    print(f"\nSaved {len(descriptions)} descriptions ({updated} updated)")


if __name__ == "__main__":
    main()
