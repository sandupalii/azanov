import requests
from bs4 import BeautifulSoup
import json
import re
import os

URLS = [
    "https://thai-charters.com/category/speedboat/",
    "https://thai-charters.com/category/fishing_boats/",
    "https://thai-charters.com/category/engine_yachts/",
    "https://thai-charters.com/category/sailing_yachts/",
    "https://thai-charters.com/category/engine_catamarans/",
    "https://thai-charters.com/category/sailing_catamarans/"
]

JSON_PATH = "scripts/thai_charters_prices_speeds.json"

def clean_price(price_str):
    digits = re.sub(r'[^\d]', '', price_str)
    if not digits:
        return 0
    return int(digits)

def clean_title(title_str):
    m = re.search(r'«(.*?)»', title_str)
    if m:
        return m.group(1).strip()
    return title_str.strip()

def scrape():
    if os.path.exists(JSON_PATH):
        with open(JSON_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
    else:
        data = {}

    for url in URLS:
        print(f"Scraping {url}...")
        res = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(res.text, "html.parser")
        
        items = soup.select("li.product, div.product, li.type-boat, article.boat, .boat-item, .post")
        if not items:
            continue

        for item in items:
            title_el = item.select_one(".product-title, .woocommerce-loop-product__title, h2, h3, .title")
            price_el_wrapper = item.select_one(".price, .amount, .boat-price")
            
            if title_el and price_el_wrapper:
                raw_title = title_el.text.strip()
                name = clean_title(raw_title)
                
                # IMPORTANT FIX: if there's <ins>, take its text. Otherwise take <bdi> or whole text.
                ins_el = price_el_wrapper.select_one("ins bdi") or price_el_wrapper.select_one("ins .amount") or price_el_wrapper.select_one("ins")
                if ins_el:
                    raw_price = ins_el.text.strip()
                else:
                    bdi_el = price_el_wrapper.select_one("bdi") or price_el_wrapper.select_one(".amount")
                    raw_price = bdi_el.text.strip() if bdi_el else price_el_wrapper.text.strip()
                
                price_val = clean_price(raw_price)
                
                if name and price_val > 0:
                    price_format = f"{price_val:,}".replace(",", " ")
                    label = f"от {price_format} ฿"
                    
                    if name not in data:
                        data[name] = {}
                    data[name]["price"] = price_val
                    data[name]["priceLabel"] = label
                    print(f"  [{name}] -> {price_val} ({label})")

    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"Saved {len(data)} ships to {JSON_PATH}")

if __name__ == "__main__":
    scrape()
