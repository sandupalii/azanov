#!/usr/bin/env python3
"""
Generate thumbnails and medium-sized images for Azanov Retreat.
Reduces page load and memory usage — full-size loads only in fullscreen.

IMPORTANT: Originals are NEVER modified or deleted. Script only reads from
originals and writes to assets/thumbs/ and assets/medium/.

Usage:
  python scripts/generate_thumbs.py

Creates:
  assets/thumbs/  — 400px wide, ~50-100KB each
  assets/medium/  — 800px wide, ~150-300KB each
"""

from pathlib import Path
import sys

try:
    from PIL import Image
except ImportError:
    print("Install Pillow: pip install Pillow")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent
THUMB_W = 400
MEDIUM_W = 800
QUALITY = 82
THUMB_QUALITY = 78


def process(src: Path, out_dir: Path, width: int, quality: int) -> bool:
    """Read from src, write to out_dir. Never modifies or deletes src."""
    try:
        out_dir.mkdir(parents=True, exist_ok=True)
        # PNG/WebP -> JPG for smaller size
        out_name = src.stem + ".jpg" if src.suffix.lower() in (".png", ".webp", ".gif") else src.name
        out_path = out_dir / out_name
        with Image.open(src) as im:
            if im.mode in ("RGBA", "P"):
                im = im.convert("RGB")
            ratio = width / im.width if im.width > width else 1
            if ratio < 1:
                new_size = (width, int(im.height * ratio))
                im = im.resize(new_size, Image.Resampling.LANCZOS)
            im.save(out_path, "JPEG", quality=quality, optimize=True)
        return True
    except Exception as e:
        print(f"  Error {src}: {e}")
        return False


def main():
    count = 0

    # Root-level images (5wrAn.jpg, cHn7S.jpg, FCZLI.jpg)
    for name in ["5wrAn.jpg", "cHn7S.jpg", "FCZLI.jpg"]:
        src = ROOT / name
        if src.exists():
            for w, q, sub in [(THUMB_W, THUMB_QUALITY, "thumbs"), (MEDIUM_W, QUALITY, "medium")]:
                out = ROOT / "assets" / sub
                if process(src, out, w, q):
                    count += 1
                    print(f"  {name} -> assets/{sub}/")

    # assets/ships/{category}/{ship_name}/**/* (preserve dir structure)
    ships = ROOT / "assets" / "ships"
    if ships.exists():
        for ext in ("*.jpg", "*.jpeg", "*.png", "*.webp"):
            for src in ships.rglob(ext):
                if src.is_file():
                    rel = src.relative_to(ships)
                    for w, q, sub in [(THUMB_W, THUMB_QUALITY, "thumbs/ships"), (MEDIUM_W, QUALITY, "medium/ships")]:
                        out = ROOT / "assets" / sub / rel.parent
                        if process(src, out, w, q):
                            count += 1
                            print(f"  {src.relative_to(ROOT)} -> assets/{sub}/{rel}")

    # assets/houses/**/* (jpg, jpeg, png, webp)
    houses = ROOT / "assets" / "houses"
    if houses.exists():
        for ext in ("*.jpg", "*.jpeg", "*.png", "*.webp"):
            for src in houses.rglob(ext):
                if src.is_file():
                    rel = src.relative_to(houses)
                    for w, q, sub in [(THUMB_W, THUMB_QUALITY, "thumbs/houses"), (MEDIUM_W, QUALITY, "medium/houses")]:
                        out = ROOT / "assets" / sub / rel.parent
                        if process(src, out, w, q):
                            count += 1
                            print(f"  {src.relative_to(ROOT)} -> assets/{sub}/{rel}")

    print(f"\nDone. {count} images generated.")


if __name__ == "__main__":
    main()
