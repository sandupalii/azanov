#!/usr/bin/env python3
"""
Fetch max guest capacity from thai-charters.com vessel pages.
Parses catalog to get vessel links, then fetches each detail page for "Максимум гостей (день): N чел."
Outputs scripts/thai_charters_guests.json.

Usage:
  python scripts/fetch_thai_charters_guests.py
  python scripts/fetch_thai_charters_guests.py --limit 5   # test with 5 vessels
"""

import json
import re
import sys
import time
from pathlib import Path
from urllib.parse import urljoin

ROOT = Path(__file__).resolve().parent.parent
OUTPUT_PATH = ROOT / "scripts" / "thai_charters_guests.json"
URLS_PATH = ROOT / "scripts" / "thai_charters_urls.json"
CATALOG_URL = "https://thai-charters.com/catalog/"
BASE_URL = "https://thai-charters.com"


def fetch_html(url: str) -> str | None:
    """Fetch HTML from URL."""
    try:
        import requests
        headers = {"User-Agent": "Mozilla/5.0 (compatible; AzanovRetreat/1.0)"}
        resp = requests.get(url, headers=headers, timeout=20)
        resp.raise_for_status()
        resp.encoding = resp.apparent_encoding or "utf-8"
        return resp.text
    except Exception as e:
        print(f"  Fetch error: {e}")
        return None


def extract_vessel_links(html: str) -> list[tuple[str, str]]:
    """
    Parse catalog page for vessel name + slug.
    Returns list of (name, slug) - slug is the path part for detail URL.
    """
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html, "html.parser")

    # WooCommerce product links: /catalog/slug/
    links = soup.find_all("a", href=re.compile(r"/catalog/[^/]+/?$"))
    seen = set()
    result = []

    for a in links:
        href = a.get("href", "")
        if not href or "for-sale" in href.lower() or "prodazha" in href.lower():
            continue

        # Extract slug: /catalog/xxx/ -> xxx
        m = re.search(r"/catalog/([^/]+)/?", href)
        if not m:
            continue
        slug = m.group(1).rstrip("/")
        if slug in seen:
            continue
        seen.add(slug)

        # Try to get vessel name from card - look for «Name» pattern in parent
        name = ""
        parent = a.find_parent(["div", "article", "li"])
        if parent:
            text = parent.get_text(separator=" ", strip=True)
            # «Formula 42ft» or «Beach Club Yona»
            m2 = re.search(r"«([^»]+)»", text)
            if m2:
                name = m2.group(1).strip()

        if not name:
            # Fallback: slug to readable name (formula-42ft -> Formula 42ft)
            name = slug.replace("-", " ").title()
            # Fix common patterns: "42ft" not "42Ft"
            name = re.sub(r"(\d+)\s*ft", r"\1ft", name, flags=re.I)

        result.append((name, slug))

    return result


def extract_guests(html: str) -> int | None:
    """
    Extract max guests from vessel page.
    Pattern: Максимум гостей (день): N чел.
    """
    m = re.search(r"Максимум гостей\s*\(день\):\s*(\d+)\s*чел\.?", html, re.I)
    if m:
        return int(m.group(1))
    return None


def normalize_name_for_match(name: str) -> str:
    """Normalize name for fuzzy matching with our fleet names."""
    n = name.lower().strip()
    n = re.sub(r"\s+", " ", n)
    return n


def load_our_fleet_urls() -> dict:
    """Load name -> slug for vessels we have (from thai_charters_urls.json)."""
    if not URLS_PATH.exists():
        return {}
    with open(URLS_PATH, encoding="utf-8") as f:
        return json.load(f)


def main(limit: int | None = None, fleet_first: bool = True):
    # Start with our fleet vessels (from thai_charters_urls) so we get them first
    our_urls = load_our_fleet_urls()
    vessels = [(name, slug) for name, slug in our_urls.items()]

    if not vessels or not fleet_first:
        print("Fetching catalog...")
        html = fetch_html(CATALOG_URL)
        if not html:
            print("Failed to fetch catalog")
            return
        catalog_vessels = extract_vessel_links(html)
        if not vessels:
            vessels = catalog_vessels
        else:
            # Add catalog vessels we don't have yet
            our_slugs = {s for _, s in vessels}
            for name, slug in catalog_vessels:
                if slug not in our_slugs:
                    vessels.append((name, slug))
                    our_slugs.add(slug)

    print(f"Total {len(vessels)} vessels to fetch")
    if our_urls:
        print(f"  ({len(our_urls)} from our fleet)")

    if limit:
        vessels = vessels[:limit]
        print(f"Limited to {limit} vessels\n")

    result = {}
    for i, (name, slug) in enumerate(vessels):
        url = urljoin(BASE_URL, f"/catalog/{slug}/")
        print(f"[{i+1}/{len(vessels)}] {name}...", end=" ")
        page_html = fetch_html(url)
        if not page_html:
            print("skip (fetch failed)")
            continue

        guests = extract_guests(page_html)
        if guests is not None:
            result[name] = guests
            print(guests)
        else:
            print("— (no guests data)")

        time.sleep(0.5)  # Be nice to server

    # Merge with existing if present (preserve manual overrides)
    if OUTPUT_PATH.exists():
        with open(OUTPUT_PATH, encoding="utf-8") as f:
            existing = json.load(f)
        for k, v in existing.items():
            if k not in result:
                result[k] = v

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"\nSaved {len(result)} entries to {OUTPUT_PATH.name}")


if __name__ == "__main__":
    limit = None
    if "--limit" in sys.argv:
        i = sys.argv.index("--limit")
        if i + 1 < len(sys.argv):
            limit = int(sys.argv[i + 1])
    main(limit=limit)
