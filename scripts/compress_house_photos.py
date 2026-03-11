#!/usr/bin/env python3
"""
Compress and resize photos in assets/houses/.
- Max 1920px on longest side
- JPEG quality 85
- PNG/WebP -> JPG conversion

Usage:
  python scripts/compress_house_photos.py
"""

from pathlib import Path
import sys

try:
    from PIL import Image
except ImportError:
    print("Install Pillow: pip install Pillow")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent
HOUSES = ROOT / "assets" / "houses"
MAX_SIZE = 1920
QUALITY = 85
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}


def process(path: Path) -> bool:
    try:
        with Image.open(path) as im:
            if im.mode in ("RGBA", "P"):
                im = im.convert("RGB")
            w, h = im.size
            if max(w, h) > MAX_SIZE:
                ratio = MAX_SIZE / max(w, h)
                new_size = (int(w * ratio), int(h * ratio))
                im = im.resize(new_size, Image.Resampling.LANCZOS)
            out_path = path.parent / (path.stem + ".jpg")
            im.save(out_path, "JPEG", quality=QUALITY, optimize=True)
            if path != out_path:
                path.unlink()
        return True
    except Exception as e:
        print(f"  Error {path}: {e}")
        return False


def main():
    if not HOUSES.exists():
        print("assets/houses/ not found")
        return 1

    count = 0
    for src in sorted(HOUSES.rglob("*")):
        if not src.is_file() or src.suffix.lower() not in IMAGE_EXTS:
            continue
        if process(src):
            count += 1
            print(f"  {src.relative_to(ROOT)}")

    print(f"\nDone. {count} images processed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
