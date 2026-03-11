# Scripts

## Villa photos pipeline

Run in order when updating villa photos:

```bash
# 1. Normalize filenames to img_01.jpg, img_02.jpg, etc.
python scripts/optimize_house_filenames.py

# 2. Compress and resize (max 1920px, JPEG quality 85)
.venv/bin/python scripts/compress_house_photos.py

# 3. Generate thumbs (400px) and medium (800px)
.venv/bin/python scripts/generate_thumbs.py
```

## generate_thumbs.py

Generates thumbnails (400px) and medium images (800px) for local assets. Reduces page load and memory — full-size loads only in fullscreen gallery.

```bash
.venv/bin/python scripts/generate_thumbs.py
```

Creates `assets/thumbs/` and `assets/medium/` from:
- Root: `5wrAn.jpg`, `cHn7S.jpg`, `FCZLI.jpg`
- `assets/ships/*.jpg`, `*.png`
- `assets/houses/**/*.jpg`, `*.jpeg`, `*.png`, `*.webp`

**Run after adding new photos** so cards and modals use optimized images.

---

## download_ship_photos.py

Downloads ship photos from Google Drive folders linked in PDFs under `assets/ships/РУС/`.

### Workflow (3 phases)

```bash
# 1. Extract all Drive links from PDFs -> ships_drive_table.csv
python scripts/download_ship_photos.py --scan

# 2. Check accessibility for each link, update table (yes/no)
python scripts/download_ship_photos.py --check

# 3. Download max 5 photos per accessible vessel
python scripts/download_ship_photos.py --download
```

### Options

- `--scan` — Phase 1: extract links, save to `scripts/ships_drive_table.csv`
- `--check` — Phase 2: verify accessibility, update table
- `--download` — Phase 3: download photos (default max 5 per vessel)
- `--max N` — Max photos per vessel (default: 5)
- `--cleanup` — Merge duplicates, remove empty folders

### Output

- Table: `scripts/ships_drive_table.csv` (category, yacht, url, accessible)
- Photos: `assets/ships/РУС_photos/<Category>/<YachtName>/img_1.jpg` … `img_5.jpg`

---

## parse_thai_charters.py

Parses prices and speeds from thai-charters.com catalog pages. Outputs `scripts/thai_charters_prices_speeds.json`.

```bash
python scripts/parse_thai_charters.py
```

- Uses `scripts/thai_charters_urls.json` for URL slugs
- Extracts speed (Максимальная/Крейсерская скорость) and price (от X ฿)
- `--limit N` — process only first N URLs (for testing)

## build_fleet.py

Builds FLEET array in `js/components.js` from `assets/ships/` structure.

```bash
python scripts/build_fleet.py
```

- Prices: from `thai_charters_prices_speeds.json` (parsed) or `THAI_CHARTERS_PRICES` (fallback)
- Speeds: from parsed JSON; "—" if unknown
- Run `parse_thai_charters.py` first to refresh prices/speeds from thai-charters.com
