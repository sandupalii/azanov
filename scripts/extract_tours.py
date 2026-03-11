#!/usr/bin/env python3
"""
Extract tour data (titles, descriptions, prices, images) from partner HTML.
Saves tours/tours.json and downloads images to tours/images/.

Usage:
  python scripts/extract_tours.py --file tours/partner.html
  python scripts/extract_tours.py --url https://tourtourphuket.ru/dzhejms-bond-phi-phi-krabi777/
"""

import argparse
import json
import re
import sys
import time
from pathlib import Path
from urllib.parse import urljoin

PROJECT_ROOT = Path(__file__).resolve().parent.parent
TOURS_DIR = PROJECT_ROOT / "tours"
IMAGES_DIR = TOURS_DIR / "images"


def sanitize_slug(text: str) -> str:
    """Create filesystem-safe slug from title."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[-\s]+", "-", text)
    return text[:80] or "tour"


def fetch_html(url: str) -> str:
    """Fetch HTML from URL."""
    import requests
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    }
    resp = requests.get(url, headers=headers, timeout=30)
    resp.raise_for_status()
    resp.encoding = resp.apparent_encoding or "utf-8"
    return resp.text


def parse_tours(html: str, base_url: str = "") -> list[dict]:
    """Parse Tilda t-store product cards from HTML."""
    from bs4 import BeautifulSoup

    soup = BeautifulSoup(html, "html.parser")

    # Tilda store cards: js-product t-store__card
    cards = soup.select(".js-product.t-store__card, .t-store__card.t-item")
    if not cards:
        # Fallback: any product-like card
        cards = soup.select("[data-product-id], .t-store__card")

    tours = []
    for card in cards:
        tour = {}

        # Link / tour URL
        link = card.find("a", href=True)
        if link:
            href = link.get("href", "")
            tour["tour_url"] = urljoin(base_url, href) if base_url else href
        else:
            tour["tour_url"] = ""

        # Title
        title_el = card.select_one(
            ".js-store-prod-name, .js-product-name, .t-store__card__title, [field^='st_title']"
        )
        tour["title"] = (title_el.get_text(strip=True) if title_el else "") or "Без названия"

        # Description
        desc_el = card.select_one(
            ".js-store-prod-descr, .t-store__card__descr, [field^='st_descr']"
        )
        tour["description"] = desc_el.get_text(strip=True) if desc_el else ""

        # Price
        price_el = card.select_one(
            ".js-product-price, .js-store-prod-price-val, [field^='st_price']:not([field*='old'])"
        )
        price_text = price_el.get_text(strip=True) if price_el else ""
        tour["price"] = re.sub(r"[^\d]", "", price_text) or ""

        # Currency
        curr_el = card.select_one(".t-store__card__price-currency")
        tour["currency"] = (curr_el.get_text(strip=True) if curr_el else "") or "฿"

        # Old price
        old_el = card.select_one("[field*='st_priceold'], .t-store__card__price-old")
        tour["old_price"] = None
        if old_el:
            old_text = old_el.get_text(strip=True)
            old_num = re.sub(r"[^\d]", "", old_text)
            if old_num:
                tour["old_price"] = old_num

        # Images: data-original or style background-image
        image_urls = []
        for img_div in card.select(".js-product-img, .t-store__card__bgimg, [data-original]"):
            url = img_div.get("data-original")
            if not url and img_div.get("style"):
                m = re.search(r"url\(['\"]?([^'\"]+)['\"]?\)", img_div["style"])
                if m:
                    url = m.group(1).strip()
            if url:
                url = urljoin(base_url, url) if base_url else url
                if url not in image_urls:
                    image_urls.append(url)

        # Fallback: img src inside card
        if not image_urls:
            for img in card.select("img[src]"):
                src = img.get("src")
                if src and any(ext in src.lower() for ext in [".jpg", ".jpeg", ".png", ".webp"]):
                    src = urljoin(base_url, src) if base_url else src
                    if src not in image_urls:
                        image_urls.append(src)

        tour["image_urls"] = image_urls
        tour["local_image_paths"] = []

        if tour["title"] and (tour["price"] or tour["image_urls"] or tour["tour_url"]):
            tours.append(tour)

    return tours


def download_images(tours: list[dict]) -> None:
    """Download images for each tour, update local_image_paths."""
    import requests

    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    headers = {"User-Agent": "Mozilla/5.0 (compatible; AzanovRetreat/1.0)"}

    for tour in tours:
        slug = sanitize_slug(tour["title"])
        local_paths = []
        for i, url in enumerate(tour.get("image_urls", [])[:5]):  # max 5 per tour
            ext = ".jpg"
            if ".png" in url.lower():
                ext = ".png"
            elif ".webp" in url.lower():
                ext = ".webp"
            filename = f"{slug}_{i}{ext}"
            local_path = IMAGES_DIR / filename
            try:
                resp = requests.get(url, headers=headers, timeout=15)
                if resp.ok and len(resp.content) > 100:
                    local_path.write_bytes(resp.content)
                    local_paths.append(f"tours/images/{filename}")
            except Exception:
                pass
            time.sleep(0.5)
        tour["local_image_paths"] = local_paths


def main() -> int:
    parser = argparse.ArgumentParser(description="Extract tours from partner HTML")
    parser.add_argument("--file", "-f", help="Path to HTML file")
    parser.add_argument("--url", "-u", help="URL to fetch HTML from")
    parser.add_argument("--no-download", action="store_true", help="Skip image download")
    parser.add_argument("--output", "-o", default=None, help="Output JSON path (default: tours/tours.json)")
    args = parser.parse_args()

    html = ""
    base_url = ""

    if args.file:
        path = Path(args.file)
        if not path.is_absolute():
            path = PROJECT_ROOT / path
        if not path.exists():
            print(f"File not found: {path}", file=sys.stderr)
            return 1
        html = path.read_text(encoding="utf-8", errors="replace")
    elif args.url:
        try:
            html = fetch_html(args.url)
            base_url = args.url.rstrip("/") + "/"
        except Exception as e:
            print(f"Failed to fetch URL: {e}", file=sys.stderr)
            return 1
    else:
        print("Provide --file or --url. See --help.", file=sys.stderr)
        return 1

    tours = parse_tours(html, base_url)
    if not tours:
        print("No tours found in HTML. Check selectors or HTML structure.", file=sys.stderr)
        return 1

    if not args.no_download:
        print(f"Downloading images for {len(tours)} tours...")
        download_images(tours)

    TOURS_DIR.mkdir(parents=True, exist_ok=True)
    out_path = Path(args.output) if args.output else TOURS_DIR / "tours.json"
    if not out_path.is_absolute():
        out_path = PROJECT_ROOT / out_path
    out_path.parent.mkdir(parents=True, exist_ok=True)

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(tours, f, ensure_ascii=False, indent=2)

    print(f"Saved {len(tours)} tours to {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
