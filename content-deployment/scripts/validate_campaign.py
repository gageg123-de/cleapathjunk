#!/usr/bin/env python3
"""Validate a non-public Clear Path content deployment campaign."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
from collections import Counter
from pathlib import Path


ALLOWED_PLATFORMS = {"facebook", "instagram", "nextdoor", "google-business", "pinterest"}
ALLOWED_INTENTS = {"conversion", "trust", "traffic", "engagement"}
ALLOWED_STATUSES = {"draft", "ready", "approved", "published", "retired"}
ALLOWED_DESTINATIONS = {
    "https://clearpathjunkla.com/",
    "https://clearpathjunkla.com/services/property-cleanouts/",
    "https://clearpathjunkla.com/service-areas/alexandria-la/",
    "https://clearpathjunkla.com/projects/alexandria-duplex-cleanout/",
}
EXPECTED_DIMENSIONS = {
    "facebook": (1080, 1350),
    "instagram": (1080, 1350),
    "nextdoor": (1200, 900),
    "google-business": (1200, 900),
    "pinterest": (1000, 1500),
}
REQUIRED_DOCS = {
    "campaign.md",
    "photo-inventory.md",
    "pairing-review.md",
    "privacy-review.md",
    "deployment-plan.md",
    "manifest.json",
}


def image_dimensions(path: Path) -> tuple[int, int]:
    ffprobe = shutil.which("ffprobe")
    if not ffprobe:
        raise RuntimeError("ffprobe is required for image-dimension validation")
    result = subprocess.run(
        [
            ffprobe,
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=width,height",
            "-of",
            "json",
            str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    stream = json.loads(result.stdout)["streams"][0]
    return int(stream["width"]), int(stream["height"])


def parse_hashes(path: Path) -> dict[str, str]:
    hashes: dict[str, str] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        digest, filename = re.split(r"\s+", line.strip(), maxsplit=1)
        hashes[filename] = digest.lower()
    return hashes


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("campaign", type=Path)
    args = parser.parse_args()
    campaign = args.campaign.resolve()
    errors: list[str] = []
    notes: list[str] = []

    if campaign.name == "bookkeeping" or "bookkeeping" in {part.lower() for part in campaign.parts}:
        errors.append("Campaign cannot be stored in bookkeeping/")
    for name in sorted(REQUIRED_DOCS):
        if not (campaign / name).is_file():
            errors.append(f"Missing required file: {name}")

    manifest_path = campaign / "manifest.json"
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except Exception as exc:
        errors.append(f"Invalid manifest JSON: {exc}")
        manifest = {}

    if manifest.get("publication_authorized") is not False:
        errors.append("publication_authorized must remain false until human approval")
    if manifest.get("campaign") != campaign.name:
        errors.append("Manifest campaign does not match folder name")

    source_dir = campaign / "source"
    actual_sources = {path.name for path in source_dir.glob("*.webp")}
    inventory = manifest.get("source_inventory", [])
    inventory_names = {entry.get("filename") for entry in inventory}
    if actual_sources != inventory_names:
        errors.append(
            f"Source accounting mismatch: disk={sorted(actual_sources)} manifest={sorted(inventory_names)}"
        )
    if any(entry.get("accounted_for") is not True for entry in inventory):
        errors.append("Every source inventory entry must be accounted_for=true")

    hash_path = source_dir / "source-hashes.sha256"
    if not hash_path.is_file():
        errors.append("Missing source hash record")
    else:
        recorded = parse_hashes(hash_path)
        if set(recorded) != actual_sources:
            errors.append("Source hash record does not cover exactly the source images")
        for filename in actual_sources:
            digest = hashlib.sha256((source_dir / filename).read_bytes()).hexdigest()
            if recorded.get(filename) != digest:
                errors.append(f"Source hash mismatch: {filename}")

    ids: set[str] = set()
    intents: Counter[str] = Counter()
    processed_paths: set[Path] = set()
    for item in manifest.get("content_items", []):
        item_id = item.get("id", "<missing-id>")
        if item_id in ids:
            errors.append(f"Duplicate content item ID: {item_id}")
        ids.add(item_id)
        platform = item.get("platform")
        intent = item.get("intent")
        status = item.get("status")
        intents[intent] += 1
        if platform not in ALLOWED_PLATFORMS:
            errors.append(f"{item_id}: unsupported platform {platform!r}")
        if intent not in ALLOWED_INTENTS:
            errors.append(f"{item_id}: unsupported intent {intent!r}")
        if status not in ALLOWED_STATUSES:
            errors.append(f"{item_id}: unsupported status {status!r}")
        if item.get("campaign") != campaign.name:
            errors.append(f"{item_id}: campaign mismatch")
        if item.get("destination_url") not in ALLOWED_DESTINATIONS:
            errors.append(f"{item_id}: destination is not in the validated existing-page allowlist")
        if not item.get("alt_text", "").strip():
            errors.append(f"{item_id}: missing alt text")

        for source in item.get("source_images", []):
            path = campaign / source
            if not path.is_file():
                errors.append(f"{item_id}: missing source image {source}")
        processed = campaign / item.get("processed_image", "")
        caption = campaign / item.get("caption_file", "")
        if not processed.is_file() or processed.stat().st_size == 0:
            errors.append(f"{item_id}: missing/empty processed image {processed}")
        else:
            processed_paths.add(processed)
            expected = EXPECTED_DIMENSIONS.get(platform)
            try:
                actual = image_dimensions(processed)
                if expected and actual != expected:
                    errors.append(f"{item_id}: expected {expected}, got {actual}")
            except Exception as exc:
                errors.append(f"{item_id}: cannot inspect image: {exc}")
        if not caption.is_file() or caption.stat().st_size == 0:
            errors.append(f"{item_id}: missing/empty caption {caption}")
        else:
            copy = caption.read_text(encoding="utf-8").lower()
            if re.search(r"\b(?:308|310)\b|cook\s+ave", copy):
                errors.append(f"{item_id}: caption may expose an exact address")

    if manifest.get("hero_content_item") not in ids:
        errors.append("hero_content_item does not identify a manifest item")
    if len(manifest.get("content_items", [])) != 11:
        errors.append("Initial campaign should contain the reviewed 11 platform items")
    if set(intents) != ALLOWED_INTENTS:
        errors.append("Campaign must include all four intent classes")

    unexpected_public = list(campaign.rglob("*.html")) + list(campaign.rglob("*.htm"))
    if unexpected_public:
        errors.append(f"Campaign contains unexpected public-page files: {unexpected_public}")

    notes.append(f"Sources accounted for: {len(actual_sources)}")
    notes.append(f"Manifest items: {len(manifest.get('content_items', []))}")
    notes.append(f"Processed assets referenced: {len(processed_paths)}")
    notes.append("Intent counts: " + ", ".join(f"{key}={intents[key]}" for key in sorted(intents)))

    for note in notes:
        print(f"PASS: {note}")
    if errors:
        for error in errors:
            print(f"FAIL: {error}", file=sys.stderr)
        return 1
    print("PASS: Campaign validation completed with no errors")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
