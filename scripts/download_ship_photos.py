#!/usr/bin/env python3
"""
Download ship photos from Google Drive folders linked in PDFs.

Phases:
  1. --scan   Extract all Drive links from PDFs, save to CSV
  2. --check  Verify each link accessibility, build table (accessible / not)
  3. --download  For accessible vessels only: download max 5 photos each (gdown)
  4. --download-playwright  Same as 3, but via Playwright browser session (bypasses gdown limits)
"""

import argparse
import csv
import re
import shutil
import sys
import time
from pathlib import Path

# Project root (parent of scripts/)
PROJECT_ROOT = Path(__file__).resolve().parent.parent
RUS_SHIP_PDFS = PROJECT_ROOT / "assets" / "ships" / "РУС"
OUTPUT_BASE = PROJECT_ROOT / "assets" / "ships" / "РУС_photos"
SCRIPTS_DIR = PROJECT_ROOT / "scripts"
TABLE_CSV = SCRIPTS_DIR / "ships_drive_table.csv"

# Regex for Drive folder ID: /drive/folders/FOLDER_ID
FOLDER_ID_RE = re.compile(rb"drive\.google\.com/drive/folders/([a-zA-Z0-9_-]+)")
SUFFIX_RE = re.compile(r" \(\d+\)$")

# Image extensions for "first 5 photos"
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}

# Google Drive: dynamic limits, "too many downloads" per file; backoff recommended
DELAY_BETWEEN_FILES = 4  # seconds between file downloads
DELAY_AFTER_FOLDER = 8   # seconds after download_folder (heavier, many requests)


def extract_drive_folder_id(pdf_path: Path) -> str | None:
    """Extract Google Drive folder ID from PDF binary."""
    try:
        data = pdf_path.read_bytes()
    except OSError:
        return None
    match = FOLDER_ID_RE.search(data)
    if match:
        return match.group(1).decode("utf-8")
    return None


def sanitize_filename(name: str) -> str:
    return re.sub(r'[/\\:*?"<>|]', "_", name).strip()


def yacht_name_from_pdf(pdf_path: Path) -> str:
    return sanitize_filename(pdf_path.stem)


def cleanup_rus_photos() -> None:
    """Merge (1)/(2) into main folders, remove empty folders."""
    if not OUTPUT_BASE.exists():
        return
    for category_dir in list(OUTPUT_BASE.iterdir()):
        if not category_dir.is_dir():
            continue
        for yacht_dir in list(category_dir.iterdir()):
            if not yacht_dir.is_dir():
                continue
            name = yacht_dir.name
            match = SUFFIX_RE.search(name)
            if match:
                base_name = name[: match.start()].strip()
                main_dir = category_dir / base_name
                n_files = len([f for f in yacht_dir.rglob("*") if f.is_file()])
                if n_files > 0:
                    if main_dir.exists():
                        for f in yacht_dir.rglob("*"):
                            if f.is_file():
                                rel = f.relative_to(yacht_dir)
                                dest = main_dir / rel
                                dest.parent.mkdir(parents=True, exist_ok=True)
                                if not dest.exists() or dest.stat().st_size != f.stat().st_size:
                                    shutil.copy2(f, dest)
                    else:
                        yacht_dir.rename(main_dir)
                        continue
                shutil.rmtree(yacht_dir, ignore_errors=True)
    for category_dir in list(OUTPUT_BASE.iterdir()):
        if not category_dir.is_dir():
            continue
        for yacht_dir in list(category_dir.iterdir()):
            if not yacht_dir.is_dir():
                continue
            if len([f for f in yacht_dir.rglob("*") if f.is_file()]) == 0:
                shutil.rmtree(yacht_dir, ignore_errors=True)


def trim_to_max_photos(max_per_vessel: int = 5) -> None:
    """Keep only first max_per_vessel images per vessel, delete the rest."""
    if not OUTPUT_BASE.exists():
        return
    for category_dir in list(OUTPUT_BASE.iterdir()):
        if not category_dir.is_dir():
            continue
        for yacht_dir in list(category_dir.iterdir()):
            if not yacht_dir.is_dir():
                continue
            files = sorted(
                (f for f in yacht_dir.rglob("*") if f.is_file() and f.suffix.lower() in IMAGE_EXTS),
                key=lambda p: str(p),
            )
            if len(files) <= max_per_vessel:
                continue
            for f in files[max_per_vessel:]:
                f.unlink(missing_ok=True)


def run_report(max_per_vessel: int = 5) -> int:
    """Report: how many vessels have photos, how many missing, problem summary."""
    if not TABLE_CSV.exists():
        print("Run --scan and --check first.")
        return 1

    with open(TABLE_CSV, "r", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    accessible = [r for r in rows if r.get("accessible") == "yes"]
    not_accessible = [r for r in rows if r.get("accessible") != "yes"]

    have_photos = []
    no_photos = []
    partial = []

    for r in accessible:
        yacht = r["yacht"]
        category = r["category"]
        out_dir = OUTPUT_BASE / category / yacht
        if not out_dir.exists():
            no_photos.append((category, yacht))
            continue
        files = [f for f in out_dir.rglob("*") if f.is_file() and f.suffix.lower() in IMAGE_EXTS]
        n = len(files)
        if n >= max_per_vessel:
            have_photos.append((category, yacht, n))
        elif n > 0:
            partial.append((category, yacht, n))
        else:
            no_photos.append((category, yacht))

    print("=== Download Report ===\n")
    print(f"Total in table: {len(rows)}")
    print(f"  Accessible (yes): {len(accessible)}")
    print(f"  Not accessible:   {len(not_accessible)}\n")
    print(f"With photos (≥{max_per_vessel}): {len(have_photos)}")
    print(f"Partial (1–{max_per_vessel - 1}): {len(partial)}")
    print(f"Failed / no photos: {len(no_photos)}\n")

    if partial:
        print("Partial (need retry or manual):")
        for c, y, n in sorted(partial, key=lambda x: (x[0], x[1])):
            print(f"  {c} / {y}: {n} photos")

    if no_photos and len(no_photos) <= 30:
        print("\nFailed (no photos):")
        for c, y in sorted(no_photos, key=lambda x: (x[0], x[1])):
            print(f"  {c} / {y}")
    elif no_photos:
        print(f"\nFailed: {len(no_photos)} vessels (first 15):")
        for c, y in sorted(no_photos, key=lambda x: (x[0], x[1]))[:15]:
            print(f"  {c} / {y}")
        print(f"  ... and {len(no_photos) - 15} more")

    print("\n--- Problem ---")
    print("gdown fails with 'Cannot retrieve the public link' when:")
    print("  • Files lack 'Anyone with the link' permission")
    print("  • Google rate-limits after many downloads")
    print("  • Folder listing works, but file download is blocked")
    print("\nFix: Ask Drive owner to set each file to 'Anyone with the link'.")
    print("Or use Google Drive API + OAuth (requires credentials).")
    return 0


def run_scan() -> int:
    """Phase 1: Extract all Drive links from PDFs, save to CSV."""
    rows = []
    for category_dir in sorted(RUS_SHIP_PDFS.iterdir()):
        if not category_dir.is_dir():
            continue
        category = category_dir.name
        for pdf_path in sorted(category_dir.glob("*.pdf")):
            yacht_name = yacht_name_from_pdf(pdf_path)
            folder_id = extract_drive_folder_id(pdf_path)
            if folder_id:
                url = f"https://drive.google.com/drive/folders/{folder_id}"
                rows.append({
                    "category": category,
                    "yacht": yacht_name,
                    "folder_id": folder_id,
                    "url": url,
                    "accessible": "",  # filled in --check
                })
    SCRIPTS_DIR.mkdir(parents=True, exist_ok=True)
    with open(TABLE_CSV, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["category", "yacht", "folder_id", "url", "accessible"])
        w.writeheader()
        w.writerows(rows)
    print(f"Scan done: {len(rows)} PDFs with Drive links -> {TABLE_CSV}")
    return 0


def run_check() -> int:
    """Phase 2: Check each link accessibility, update table."""
    try:
        import gdown
    except ImportError:
        print("Install gdown: pip install gdown")
        return 1

    with open(TABLE_CSV, "r", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    print(f"Checking {len(rows)} links...")
    for i, row in enumerate(rows):
        url = row["url"]
        yacht = row["yacht"]
        try:
            result = gdown.download_folder(
                url,
                output=None,
                quiet=True,
                skip_download=True,
                use_cookies=False,
                remaining_ok=True,
            )
            row["accessible"] = "yes" if result else "no"
        except Exception as e:
            row["accessible"] = "no"
            err = str(e).split("\n")[0][:80]
            row["error"] = err
        print(f"  [{i+1}/{len(rows)}] {yacht}: {row['accessible']}")

    fieldnames = ["category", "yacht", "folder_id", "url", "accessible"]
    if any("error" in r for r in rows):
        fieldnames.append("error")
    with open(TABLE_CSV, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        w.writeheader()
        w.writerows(rows)

    n_yes = sum(1 for r in rows if r.get("accessible") == "yes")
    print(f"\nTable updated: {n_yes} accessible, {len(rows) - n_yes} not -> {TABLE_CSV}")
    return 0


def run_download(max_per_vessel: int = 5, verbose: bool = False) -> int:
    """Phase 3: Download max N photos per accessible vessel."""
    try:
        import gdown
    except ImportError:
        print("Install gdown: pip install gdown")
        return 1

    with open(TABLE_CSV, "r", encoding="utf-8") as f:
        rows = [r for r in csv.DictReader(f) if r.get("accessible") == "yes"]

    if not rows:
        print("No accessible vessels in table. Run --scan then --check first.")
        return 1

    OUTPUT_BASE.mkdir(parents=True, exist_ok=True)
    success_count = 0

    for idx, row in enumerate(rows):
        category = row["category"]
        yacht = row["yacht"]
        url = row["url"]
        out_dir = OUTPUT_BASE / category / yacht

        if out_dir.exists():
            n = len([f for f in out_dir.rglob("*") if f.is_file()])
            if n >= max_per_vessel:
                print(f"  [{idx+1}/{len(rows)}] [SKIP] {yacht} (already has {n} files)", flush=True)
                success_count += 1
                continue

        try:
            files = gdown.download_folder(
                url,
                output=None,
                quiet=True,
                skip_download=True,
                use_cookies=False,
                remaining_ok=True,
            )
            if not files:
                print(f"  [{idx+1}/{len(rows)}] [SKIP] {yacht} (no files)", flush=True)
                continue

            image_files = []
            for f in files:
                path = getattr(f, "path", None) or getattr(f, "local_path", "") if hasattr(f, "path") else (f[1] if len(f) > 1 else "")
                ext = Path(str(path)).suffix.lower()
                if ext in IMAGE_EXTS:
                    image_files.append(f)

            to_download = image_files[:max_per_vessel]
            if not to_download:
                print(f"  [{idx+1}/{len(rows)}] [SKIP] {yacht} (no images)", flush=True)
                continue

            out_dir.mkdir(parents=True, exist_ok=True)
            downloaded = 0
            for i, f in enumerate(to_download):
                fid = getattr(f, "id", f[0]) if hasattr(f, "id") else f[0]
                fpath = getattr(f, "path", f[1]) if hasattr(f, "path") else f[1]
                ext = Path(str(fpath)).suffix.lower() or ".jpg"
                local = out_dir / f"img_{i+1}{ext}"
                try:
                    gdown.download(
                        url=f"https://drive.google.com/uc?id={fid}",
                        output=str(local),
                        quiet=True,
                        use_cookies=False,
                    )
                    if local.exists():
                        downloaded += 1
                except Exception as e:
                    if verbose:
                        print(f"      file {i+1} id={fid}: {e}", flush=True)
                time.sleep(DELAY_BETWEEN_FILES)

            if downloaded == 0:
                out_dir_keep = out_dir.parent / f"{out_dir.name}_tmp"
                try:
                    gdown.download_folder(
                        url,
                        output=str(out_dir_keep),
                        quiet=True,
                        skip_download=False,
                        use_cookies=False,
                        remaining_ok=True,
                    )
                    collected = sorted(
                        (p for p in out_dir_keep.rglob("*") if p.is_file() and p.suffix.lower() in IMAGE_EXTS),
                        key=lambda p: str(p),
                    )
                    for i, src in enumerate(collected[:max_per_vessel]):
                        ext = src.suffix.lower()
                        dst = out_dir / f"img_{i+1}{ext}"
                        shutil.copy2(src, dst)
                        downloaded += 1
                except Exception as e:
                    if verbose:
                        print(f"      fallback download_folder: {e}", flush=True)
                if out_dir_keep.exists():
                    shutil.rmtree(out_dir_keep, ignore_errors=True)
                time.sleep(DELAY_AFTER_FOLDER)

            if downloaded > 0:
                success_count += 1
                print(f"  [{idx+1}/{len(rows)}] [OK] {yacht} -> {downloaded} photos", flush=True)
            else:
                if out_dir.exists() and len(list(out_dir.rglob("*"))) == 0:
                    shutil.rmtree(out_dir, ignore_errors=True)
                print(f"  [{idx+1}/{len(rows)}] [FAIL] {yacht} (could not download)", flush=True)
        except Exception as e:
            print(f"  [{idx+1}/{len(rows)}] [FAIL] {yacht}: {e}", flush=True)

    print(f"\nDone: {success_count} vessels with photos")
    return 0


# Playwright: auth state path for reuse
DRIVE_AUTH_STATE = SCRIPTS_DIR / "drive_auth.json"
DRIVE_DOWNLOAD_URL = "https://drive.usercontent.google.com/download?id={file_id}&export=download&authuser=0"


def _parse_drive_files(page, max_images: int) -> list[tuple[str, str]]:
    """Parse folder page, return list of (file_id, ext) for first max_images image files."""
    # Primary: [data-target="doc"] with data-id
    items = page.query_selector_all('[data-target="doc"]')
    if not items:
        # Fallback: any element with data-id (file rows)
        items = page.query_selector_all('[data-id]')

    result = []
    name_selectors = [".KL4NAf", ".DNoYtb", ".Q5txwe", "[data-tooltip]"]
    for el in items:
        if len(result) >= max_images:
            break
        data_id = el.get_attribute("data-id")
        if not data_id:
            continue
        # Get file name for extension
        name_el = None
        for sel in name_selectors:
            name_el = el.query_selector(sel)
            if name_el:
                break
        name = name_el.inner_text() if name_el else ""
        ext = Path(name).suffix.lower() if name else ""
        if ext not in IMAGE_EXTS:
            continue
        result.append((data_id, ext or ".jpg"))
    return result


def run_download_playwright(
    max_per_vessel: int = 5,
    headless: bool = False,
    save_auth: bool = True,
    wait_seconds: int = 0,
) -> int:
    """Phase 3 (Playwright): Download max N photos per accessible vessel via browser session."""
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("Install playwright: pip install playwright && playwright install chromium")
        return 1

    with open(TABLE_CSV, "r", encoding="utf-8") as f:
        rows = [r for r in csv.DictReader(f) if r.get("accessible") == "yes"]

    if not rows:
        print("No accessible vessels in table. Run --scan then --check first.")
        return 1

    OUTPUT_BASE.mkdir(parents=True, exist_ok=True)
    success_count = 0

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=headless)
        context_opts = {}
        if DRIVE_AUTH_STATE.exists():
            context_opts["storage_state"] = str(DRIVE_AUTH_STATE)
        context = browser.new_context(**context_opts)
        page = context.new_page()

        # Initial load and login prompt
        page.goto("https://drive.google.com", wait_until="domcontentloaded", timeout=30000)
        if not headless:
            if wait_seconds > 0:
                print(f"\nLog in to Google in the browser. Waiting {wait_seconds}s...")
                time.sleep(wait_seconds)
            else:
                print("\nLog in to Google in the browser (or press Enter if already logged in).")
                input()
            if save_auth:
                context.storage_state(path=str(DRIVE_AUTH_STATE))
                print(f"Auth state saved to {DRIVE_AUTH_STATE}\n")
        else:
            page.wait_for_load_state("networkidle", timeout=10000)

        for idx, row in enumerate(rows):
            category = row["category"]
            yacht = row["yacht"]
            url = row["url"]
            out_dir = OUTPUT_BASE / category / yacht

            if out_dir.exists():
                n = len([f for f in out_dir.rglob("*") if f.is_file() and f.suffix.lower() in IMAGE_EXTS])
                if n >= max_per_vessel:
                    print(f"  [{idx+1}/{len(rows)}] [SKIP] {yacht} (already has {n} files)", flush=True)
                    success_count += 1
                    continue

            try:
                page.goto(url, wait_until="domcontentloaded", timeout=20000)
                try:
                    page.wait_for_selector('[data-target="doc"], [data-id]', timeout=15000)
                except Exception:
                    print(f"  [{idx+1}/{len(rows)}] [SKIP] {yacht} (no files or timeout)", flush=True)
                    time.sleep(3)
                    continue

                files = _parse_drive_files(page, max_per_vessel)
                if not files:
                    print(f"  [{idx+1}/{len(rows)}] [SKIP] {yacht} (no images)", flush=True)
                    time.sleep(3)
                    continue

                out_dir.mkdir(parents=True, exist_ok=True)
                downloaded = 0
                for i, (file_id, ext) in enumerate(files):
                    download_url = DRIVE_DOWNLOAD_URL.format(file_id=file_id)
                    try:
                        resp = page.request.get(download_url, timeout=30000)
                        if resp.ok and resp.body:
                            local = out_dir / f"img_{i+1}{ext}"
                            local.write_bytes(resp.body)
                            downloaded += 1
                    except Exception:
                        pass
                    time.sleep(2)

                if downloaded > 0:
                    success_count += 1
                    print(f"  [{idx+1}/{len(rows)}] [OK] {yacht} -> {downloaded} photos", flush=True)
                else:
                    if out_dir.exists() and len(list(out_dir.rglob("*"))) == 0:
                        shutil.rmtree(out_dir, ignore_errors=True)
                    print(f"  [{idx+1}/{len(rows)}] [FAIL] {yacht} (could not download)", flush=True)
            except Exception as e:
                print(f"  [{idx+1}/{len(rows)}] [FAIL] {yacht}: {e}", flush=True)

            time.sleep(3)

        context.close()
        browser.close()

    print(f"\nDone: {success_count} vessels with photos")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Download ship photos from Google Drive links in PDFs")
    parser.add_argument("--cleanup", action="store_true", help="Only run cleanup")
    parser.add_argument("--scan", action="store_true", help="Phase 1: extract all Drive links from PDFs")
    parser.add_argument("--check", action="store_true", help="Phase 2: check accessibility, build table")
    parser.add_argument("--download", action="store_true", help="Phase 3: download max 5 photos per accessible vessel (gdown)")
    parser.add_argument("--download-playwright", action="store_true", help="Phase 3: download via Playwright (browser session)")
    parser.add_argument("--headless", action="store_true", help="Run Playwright headless (requires saved auth in drive_auth.json)")
    parser.add_argument("--wait", type=int, default=0, metavar="SEC", help="Wait SEC seconds for login (instead of Enter); use when running unattended")
    parser.add_argument("--report", action="store_true", help="Show download status report")
    parser.add_argument("--max", type=int, default=5, help="Max photos per vessel (default: 5)")
    parser.add_argument("--verbose", "-v", action="store_true", help="Print errors when download fails")
    args = parser.parse_args()

    if args.cleanup:
        cleanup_rus_photos()
        trim_to_max_photos(args.max)
        print("Cleanup done.")
        return 0

    if args.report:
        return run_report(max_per_vessel=args.max)

    if args.scan:
        return run_scan()

    if args.check:
        if not TABLE_CSV.exists():
            print("Run --scan first.")
            return 1
        return run_check()

    if args.download:
        if not TABLE_CSV.exists():
            print("Run --scan and --check first.")
            return 1
        return run_download(max_per_vessel=args.max, verbose=args.verbose)

    if args.download_playwright:
        if not TABLE_CSV.exists():
            print("Run --scan and --check first.")
            return 1
        return run_download_playwright(
            max_per_vessel=args.max,
            headless=args.headless,
            save_auth=True,
            wait_seconds=args.wait,
        )

    print("Use --scan, --check, --download, or --download-playwright. See --help.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
