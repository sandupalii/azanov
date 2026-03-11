#!/usr/bin/env python3
"""
Parse prices and speeds from thai-charters.com catalog pages.
Outputs scripts/thai_charters_prices_speeds.json.

Usage:
  python scripts/parse_thai_charters.py

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
OUTPUT_PATH = ROOT / "scripts" / "thai_charters_prices_speeds.json"
BASE_URL = "https://thai-charters.com/catalog/"


def load_urls() -> dict:
    """Load ship name -> URL slug mapping."""
    if not URLS_PATH.exists():
        return {}
    with open(URLS_PATH, encoding="utf-8") as f:
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


def extract_price(html: str) -> tuple[int | None, str | None]:
    """
    Extract price from page. Returns (price_int, price_label).
    Uses schema.org itemprop="price" first (most reliable), then fallbacks.
    """
    # Strategy 1: schema.org meta tag - most reliable (thai-charters uses this)
    m = re.search(r'itemprop="price"\s+content="(\d+)"', html, re.I)
    if m:
        price = int(m.group(1))
        if 1_000 <= price <= 5_000_000:
            return price, f"от {price:,} ฿".replace(",", " ")

    # Strategy 2: data-toggle="bttip" title="N" - table prices, first = base price
    m = re.search(r'data-toggle="bttip"[^>]*title="(\d+)"', html)
    if m:
        price = int(m.group(1))
        if 8_000 <= price <= 2_500_000:
            return price, f"от {price:,} ฿".replace(",", " ")

    # Strategy 3: <ins>12 990 ฿</ins> - sale price in price block
    m = re.search(r"<ins>([\d\s\u00a0]+)\s*฿</ins>", html)
    if m:
        num_str = m.group(1).replace(" ", "").replace("\u00a0", "")
        if num_str.isdigit():
            price = int(num_str)
            if 1_000 <= price <= 5_000_000:
                return price, f"от {price:,} ฿".replace(",", " ")

    # Strategy 4: regex on head - "N ฿" in first 5000 chars, filter valid range
    head = re.sub(r"<script[^>]*>[\s\S]*?</script>", "", html[:6000], flags=re.I)
    matches = re.findall(r"(\d[\d\s\u00a0]*)\s*฿", head)
    prices = []
    for m in matches:
        num_str = m.replace(" ", "").replace("\u00a0", "")
        if num_str.isdigit():
            p = int(num_str)
            if 8_000 <= p <= 2_500_000:
                prices.append(p)
    if prices:
        return prices[0], f"от {prices[0]:,} ฿".replace(",", " ")

    return None, None


def extract_speed(html: str) -> str | None:
    """
    Extract max or cruise speed. Returns "N кн" or None.
    Prefer "Максимальная скорость" over "Крейсерская скорость".
    """
    # Максимальная скорость: 30 узлов
    m = re.search(r"Максимальная скорость:\s*(\d+)\s*узлов?", html, re.I)
    if m:
        return f"{m.group(1)} кн"

    # Крейсерская скорость: 25 узлов
    m = re.search(r"Крейсерская скорость:\s*(\d+)\s*узлов?", html, re.I)
    if m:
        return f"{m.group(1)} кн"

    return None


def main(limit: int | None = None):
    urls = load_urls()
    if not urls:
        print("No URLs in thai_charters_urls.json")
        return

    if limit is not None:
        urls = dict(list(urls.items())[:limit])
        print(f"Limited to {limit} URLs for testing\n")

    result = {}
    for name, slug in urls.items():
        if not slug.startswith("http"):
            url = BASE_URL + slug.rstrip("/") + "/"
        else:
            url = slug

        print(f"Fetching {name}...")
        html = fetch_page(url)
        if not html:
            continue

        price, price_label = extract_price(html)
        speed = extract_speed(html)

        entry = {}
        if price is not None and price > 0:
            entry["price"] = price
            entry["priceLabel"] = price_label or f"от {price:,} ฿".replace(",", " ")
        if speed is not None:
            entry["speed"] = speed

        if entry:
            result[name] = entry
            print(f"  OK: price={price}, speed={speed}")
        else:
            print(f"  No data extracted")

        time.sleep(0.6)  # Be nice to the server

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"\nSaved {len(result)} entries to {OUTPUT_PATH.name}")


if __name__ == "__main__":
    import sys
    limit = None
    if "--limit" in sys.argv:
        i = sys.argv.index("--limit")
        if i + 1 < len(sys.argv):
            limit = int(sys.argv[i + 1])
    main(limit=limit)
