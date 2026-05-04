#!/bin/bash
# ============================================================
# AZANOV TRAVEL — THUMBNAIL & MEDIUM IMAGE GENERATOR
# Uses macOS sips (built-in, no dependencies needed)
# 
# Usage:
#   ./scripts/generate-thumbs.sh           # Process all images
#   ./scripts/generate-thumbs.sh tours     # Process only tours/
# ============================================================

set -euo pipefail

ASSETS_DIR="$(cd "$(dirname "$0")/../assets" && pwd)"
THUMB_W=400
MEDIUM_W=800
QUALITY=80
PROCESSED=0
SKIPPED=0

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

process_image() {
    local src="$1"
    local rel="${src#$ASSETS_DIR/}"
    
    # Skip if already in thumbs/ or medium/ or svg/
    case "$rel" in
        thumbs/*|medium/*|svg/*) return ;;
    esac
    
    # Output paths (convert .png/.webp to .jpg for smaller files)
    local out_base="${rel%.*}.jpg"
    local thumb_path="$ASSETS_DIR/thumbs/$out_base"
    local medium_path="$ASSETS_DIR/medium/$out_base"
    
    # Skip if both already exist and are newer than source
    if [[ -f "$thumb_path" && -f "$medium_path" && "$thumb_path" -nt "$src" ]]; then
        ((SKIPPED++))
        return
    fi
    
    # Create output directories
    mkdir -p "$(dirname "$thumb_path")"
    mkdir -p "$(dirname "$medium_path")"
    
    # Get source width
    local src_w
    src_w=$(sips -g pixelWidth "$src" 2>/dev/null | awk '/pixelWidth/{print $2}')
    
    if [[ -z "$src_w" || "$src_w" == "0" ]]; then
        echo -e "  ${YELLOW}SKIP${NC} $rel (cannot read dimensions)"
        return
    fi
    
    # Generate thumb (400px wide)
    if [[ ! -f "$thumb_path" || "$src" -nt "$thumb_path" ]]; then
        if (( src_w > THUMB_W )); then
            sips --resampleWidth $THUMB_W -s format jpeg -s formatOptions $QUALITY "$src" --out "$thumb_path" >/dev/null 2>&1
        else
            # Source is already small enough — just convert to jpg
            sips -s format jpeg -s formatOptions $QUALITY "$src" --out "$thumb_path" >/dev/null 2>&1
        fi
    fi
    
    # Generate medium (800px wide)
    if [[ ! -f "$medium_path" || "$src" -nt "$medium_path" ]]; then
        if (( src_w > MEDIUM_W )); then
            sips --resampleWidth $MEDIUM_W -s format jpeg -s formatOptions $QUALITY "$src" --out "$medium_path" >/dev/null 2>&1
        else
            sips -s format jpeg -s formatOptions $QUALITY "$src" --out "$medium_path" >/dev/null 2>&1
        fi
    fi
    
    ((PROCESSED++))
    local thumb_size=$(du -h "$thumb_path" 2>/dev/null | awk '{print $1}')
    echo -e "  ${GREEN}✓${NC} $rel → thumb ${CYAN}${thumb_size}${NC}"
}

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  Azanov Travel — Image Thumbnail Generator${NC}"
echo -e "${CYAN}  Thumb: ${THUMB_W}px  |  Medium: ${MEDIUM_W}px  |  Quality: ${QUALITY}%${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Filter by subdirectory if argument provided
FILTER="${1:-}"
if [[ -n "$FILTER" ]]; then
    SEARCH_DIR="$ASSETS_DIR/$FILTER"
    echo -e "Processing: ${YELLOW}$FILTER/${NC}"
else
    SEARCH_DIR="$ASSETS_DIR"
    echo -e "Processing: ${YELLOW}all images${NC}"
fi

echo ""

# Find and process all images
find "$SEARCH_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) | sort | while read -r img; do
    process_image "$img"
done

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  ${GREEN}Done!${NC} Processed: ${PROCESSED}  Skipped: ${SKIPPED}"

# Show size comparison
ORIG_SIZE=$(du -sh "$ASSETS_DIR" 2>/dev/null | awk '{print $1}')
THUMB_SIZE=$(du -sh "$ASSETS_DIR/thumbs" 2>/dev/null | awk '{print $1}')
MEDIUM_SIZE=$(du -sh "$ASSETS_DIR/medium" 2>/dev/null | awk '{print $1}')
echo -e "  Original: ${ORIG_SIZE}  |  Thumbs: ${THUMB_SIZE}  |  Medium: ${MEDIUM_SIZE}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
