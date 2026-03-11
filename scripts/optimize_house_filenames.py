#!/usr/bin/env python3
"""
Normalize filenames in assets/houses/ to img_01.jpg, img_02.jpg, etc.
PNG/WebP are converted to .jpg extension (actual conversion done by compress script).

Usage:
  python scripts/optimize_house_filenames.py
"""

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
HOUSES = ROOT / "assets" / "houses"
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}


def main():
    if not HOUSES.exists():
        print("assets/houses/ not found")
        return 1

    count = 0
    for villa_dir in sorted(HOUSES.iterdir()):
        if not villa_dir.is_dir():
            continue
        files = sorted(
            (f for f in villa_dir.iterdir() if f.is_file() and f.suffix.lower() in IMAGE_EXTS),
            key=lambda p: p.name.lower(),
        )
        if not files:
            continue

        # First pass: rename to temp names to avoid overwrites
        temp_moves = []
        for i, f in enumerate(files):
            ext = ".jpg" if f.suffix.lower() in (".png", ".webp", ".gif") else f.suffix.lower()
            if ext == ".jpeg":
                ext = ".jpg"
            temp_name = villa_dir / f".tmp_{i:04d}{ext}"
            if f != temp_name:
                f.rename(temp_name)
                temp_moves.append((temp_name, i + 1, ext))

        # Second pass: rename temp to final
        for temp_path, num, ext in temp_moves:
            final_name = villa_dir / f"img_{num:02d}{ext}"
            temp_path.rename(final_name)
            count += 1
            print(f"  {villa_dir.name}/{final_name.name}")

    print(f"\nDone. {count} files renamed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
