#!/usr/bin/env python3
"""
Build FLEET array from assets/ships/ structure.
Outputs JS for components.js. Prices and descriptions from thai-charters.com.

Usage:
  python scripts/build_fleet.py
"""

import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SHIPS = ROOT / "assets" / "ships"
CSV_PATH = ROOT / "scripts" / "ships_drive_table.csv"
DESCRIPTIONS_PATH = ROOT / "scripts" / "thai_charters_descriptions.json"
PRICES_SPEEDS_PATH = ROOT / "scripts" / "thai_charters_prices_speeds.json"
GUESTS_PATH = ROOT / "scripts" / "thai_charters_guests.json"
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}

GENERIC_DESCRIPTION = "Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка."

# thai-charters.com prices (name -> price in ฿)
THAI_CHARTERS_PRICES = {
    "Yamela 15": 12000,
    "Yamela": 12990,
    "Srisuwan 37ft": 38000,
    "Marlin": 29000,
    "SeaExplorer": 55000,
    "Sambuca": 55000,
    "Sambuca 53": 55000,
    "Princess 65 Oceana": 110000,
    "Monte Carlo 86ft": 390000,
    "Siam Princess 70": 69000,
    "Bertram 50": 53000,
    "Ameray 1 37ft": 26000,
    "Pina Colada 40ft": 65000,
    "Summer Leopard 47": 55000,
    "Born Free 86ft": 99000,
    "Lady M. Sunseeker 54ft": 129000,
    "Wave": 14000,
    "Wave 29 Pro Datto": 14000,
    "Gambit": 25900,
    "Fortuna": 55500,
    "Lagoon 440": 30000,
    "Lagoon 440 Bluewings": 30000,
    "Lagoon 440 Lemon": 30000,
    "The Origin": 110000,
    "Moon Glider 90": 220000,
    "Olympia": 170000,
    "Demarest": 450000,
    "Lunik Floeth 48ft": 35000,
    "Ferretti 80": 105000,
    "Indigo 53ft": 59000,
    "Azimut 55 Black": 120000,
    "Astondoa 102 GXL": 440000,
    "Beach Club Yona": 2000000,
    "Orange": 80000,
    "Orange Princess 54": 80000,
    "Verona 3 Engines": 45000,
    "Hakuna Matata": 49000,
    "Fountaine Pajot 75ft": 70000,
    "White Marlin": 39000,
    "Aria Blue Riva 70ft": 155000,
    "Ameray 1 37ft": 26000,
    "Amore": 34000,
    "Big Tuna": 26000,
    "Voyage 500 Bon Voyage": 29000,
}

# Superyachts: type = superyacht
SUPERYACHT_NAMES = {
    "Beach Club Yona", "Silentworld 129ft", "Spacecat 118ft", "Xanadu 111",
    "Moon Glider 90", "Demarest", "Monte Carlo 86ft", "Olympia", "Astondoa 102 GXL",
    "Party Catamaran 110ft", "Song of Songs 139ft",
}

# Category -> type (before superyacht check)
CATEGORY_TYPE = {
    "motorboats": "speedboat",
    "fishing-boats": "motorboat",
    "motor-yachts": "yacht",
    "motor-catamarans": "catamaran",
    "sailing-catamarans": "catamaran",
    "sailing-yachts": "yacht",
}

# Category -> vibe label
CATEGORY_VIBE = {
    "motorboats": "Катер",
    "fishing-boats": "Рыбацкая лодка",
    "motor-yachts": "Моторная яхта",
    "motor-catamarans": "Моторный катамаран",
    "sailing-catamarans": "Парусный катамаран",
    "sailing-yachts": "Парусная яхта",
}


def normalize_name(name: str) -> str:
    """Normalize for price matching."""
    return name.strip()


def load_prices_speeds() -> dict:
    """Load parsed prices/speeds from thai-charters.com."""
    if not PRICES_SPEEDS_PATH.exists():
        return {}
    with open(PRICES_SPEEDS_PATH, encoding="utf-8") as f:
        return json.load(f)


def load_guests() -> dict:
    """Load max guest capacity from thai-charters.com (name -> int)."""
    if not GUESTS_PATH.exists():
        return {}
    with open(GUESTS_PATH, encoding="utf-8") as f:
        return json.load(f)


def find_guests(name: str, guests_data: dict) -> int:
    """Return max guests. Uses thai_charters_guests.json; fallback 10."""
    n = normalize_name(name)
    for key, val in guests_data.items():
        if key.lower() in n.lower() or n.lower() in key.lower():
            if isinstance(val, int) and val > 0:
                return val
            break
    return 10


def find_price(name: str, prices_speeds: dict) -> tuple[int, str]:
    """Return (price, priceLabel). Uses parsed JSON first, then THAI_CHARTERS_PRICES fallback."""
    n = normalize_name(name)
    # First: parsed thai_charters_prices_speeds.json (only if price > 0)
    for key, data in prices_speeds.items():
        if key.lower() in n.lower() or n.lower() in key.lower():
            if isinstance(data, dict) and data.get("price", 0) > 0:
                p = data["price"]
                label = data.get("priceLabel", f"от {p:,} ฿".replace(",", " "))
                return p, label
    # Fallback: hardcoded THAI_CHARTERS_PRICES
    for key, val in THAI_CHARTERS_PRICES.items():
        if key.lower() in n.lower() or n.lower() in key.lower():
            return val, f"от {val:,} ฿".replace(",", " ")
    return 0, "по запросу"


def find_speed(name: str, prices_speeds: dict) -> str:
    """Return speed string. Uses parsed JSON; fallback to '—' for unknown."""
    n = normalize_name(name)
    for key, data in prices_speeds.items():
        if key.lower() in n.lower() or n.lower() in key.lower():
            if isinstance(data, dict) and data.get("speed"):
                return data["speed"]
            break
    return "—"


def load_descriptions() -> dict:
    """Load thai-charters descriptions from JSON."""
    if not DESCRIPTIONS_PATH.exists():
        return {}
    with open(DESCRIPTIONS_PATH, encoding="utf-8") as f:
        return json.load(f)


def find_description(name: str, descriptions: dict) -> str:
    """Return description for ship (exact match, then partial)."""
    n = normalize_name(name)
    if n in descriptions:
        return descriptions[n]
    for key, desc in descriptions.items():
        if key.lower() in n.lower() or n.lower() in key.lower():
            return desc
    return GENERIC_DESCRIPTION


def extract_length(name: str) -> str:
    """Extract length from name like '37ft', '47 ft'."""
    m = re.search(r"(\d+)\s*ft", name, re.I)
    if m:
        return f"{m.group(1)} ft"
    return "—"


def load_csv_specs() -> dict:
    """Load yacht names from CSV (category mapping: Катера->motorboats, etc)."""
    csv_cat = {"Катера": "motorboats", "Моторные катамараны": "motor-catamarans",
               "Моторные яхты": "motor-yachts", "Парусные катамараны": "sailing-catamarans",
               "Парусные яхты": "sailing-yachts", "Рыбацкие лодки": "fishing-boats"}
    out = {}
    if not CSV_PATH.exists():
        return out
    with open(CSV_PATH, encoding="utf-8") as f:
        for row in csv.DictReader(f):
            cat = csv_cat.get(row.get("category", ""))
            if cat:
                out[(cat, row["yacht"].strip())] = row
    return out


def slug_id(name: str, category: str) -> str:
    """Generate id like ship_limpopo."""
    s = re.sub(r"[^\w\s-]", "", name)
    s = re.sub(r"\s+", "_", s).lower()
    return f"ship_{s}"


def main():
    csv_specs = load_csv_specs()
    descriptions = load_descriptions()
    prices_speeds = load_prices_speeds()
    guests_data = load_guests()
    fleet = []
    ship_idx = 0

    for category_dir in sorted(SHIPS.iterdir()):
        if not category_dir.is_dir():
            continue
        cat = category_dir.name
        if cat not in CATEGORY_TYPE:
            continue

        for ship_dir in sorted(category_dir.iterdir()):
            if not ship_dir.is_dir():
                continue
            name = ship_dir.name
            images = sorted(
                [f for f in ship_dir.iterdir() if f.is_file() and f.suffix.lower() in IMAGE_EXTS],
                key=lambda p: p.name.lower()
            )
            if not images:
                continue

            ship_idx += 1
            img_paths = [f"assets/ships/{cat}/{name}/{img.name}" for img in images]
            img_paths = [p.replace(".jpeg", ".jpg").replace(".png", ".jpg").replace(".webp", ".jpg") for p in img_paths]
            first_img = img_paths[0]

            ship_type = "superyacht" if name in SUPERYACHT_NAMES else CATEGORY_TYPE[cat]
            vibe = "Суперяхта" if ship_type == "superyacht" else CATEGORY_VIBE[cat]
            price, price_label = find_price(name, prices_speeds)
            length = extract_length(name)
            guests = find_guests(name, guests_data)
            speed = find_speed(name, prices_speeds)
            description = find_description(name, descriptions)

            fleet.append({
                "id": f"f{ship_idx}",
                "name": name,
                "type": ship_type,
                "guests": guests,
                "length": length,
                "speed": speed,
                "price": price,
                "priceLabel": price_label,
                "vibe": vibe,
                "description": description,
                "img": first_img,
                "images": img_paths,
            })

    # Assign f1-f8 to package ships (for PACKAGES yachtIds compatibility)
    pkg_ships = ["Limpopo", "Lucky Star", "Madam Shadow 34ft", "Na-О 29ft", "Nanea 40ft", "Ocean Safari 2", "Ocean Safari 3", "Sabi 375"]
    by_name = {s["name"]: s for s in fleet}
    used_ids = set()
    for i, pname in enumerate(pkg_ships):
        if pname in by_name:
            by_name[pname]["id"] = f"f{i + 1}"
            used_ids.add(f"f{i + 1}")

    # Assign f9+ to remaining ships (those not in pkg_ships)
    idx = 9
    for s in fleet:
        if s["name"] not in pkg_ships:
            s["id"] = f"f{idx}"
            idx += 1

    # Sort: package ships first (f1-f8), then by price desc
    def sort_key(x):
        if x["id"].startswith("f") and x["id"][1:].isdigit():
            n = int(x["id"][1:])
            if n <= 8:
                return (0, n)
        return (1, -x["price"], x["name"])
    fleet.sort(key=sort_key)

    # Output JS
    def escape(s):
        return str(s).replace("\\", "\\\\").replace("'", "\\'")

    lines = []
    for s in fleet:
        img_str = ", ".join(f"'{escape(x)}'" for x in s["images"])
        desc = escape(s["description"])
        lines.append(
            f"  {{ id: '{s['id']}', name: '{escape(s['name'])}', type: '{s['type']}', "
            f"guests: {s['guests']}, length: '{s['length']}', speed: '{s['speed']}', "
            f"price: {s['price']}, priceLabel: '{s['priceLabel']}', vibe: '{s['vibe']}', "
            f"description: '{desc}', img: '{escape(s['img'])}', images: [{img_str}] }},"
        )

    js = "\n".join(lines)
    components_path = ROOT / "js" / "components.js"
    if components_path.exists():
        text = components_path.read_text(encoding="utf-8")
        pattern = r"// \d+ судов с фото[\s\S]*?const FLEET = \[[\s\S]*?\n\];"
        new_block = f"// {len(fleet)} судов с фото из assets/ships/\nconst FLEET = [\n{js}\n];"
        if re.search(pattern, text):
            text = re.sub(pattern, new_block, text, count=1)
            components_path.write_text(text, encoding="utf-8")
            print(f"Updated components.js: FLEET with {len(fleet)} vessels")
        else:
            print("Pattern not found, outputting to stdout:")
            print(js)
    else:
        print(js)
    return fleet


if __name__ == "__main__":
    main()
