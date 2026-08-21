# Clear Path Content Deployment System

This non-public workspace turns authentic Clear Path Junk Removal job photos into review-ready social assets, platform captions, destination links, and a sequenced deployment queue. It prepares content only; nothing here publishes externally or creates website pages.

## Quick start

Future requests can be as simple as: **Create a content deployment pack from these job photos.**

1. Copy `templates/campaign-template.md` and the template manifest into `campaigns/[job-slug]/`.
2. Put untouched originals in `campaigns/[job-slug]/source/`. Never overwrite or edit these files.
3. Record provenance and approved facts. Do not infer customer type, price, timing, loads, crew size, property circumstances, or address.
4. Inspect every source image individually and complete the inventory, privacy review, and quality scores.
5. Match before/after photos only when visible architecture supports the match.
6. Select the few strongest assets. A source can be accounted for without being published.
7. Generate truthful processed variants with the campaign asset script or equivalent non-generative tooling.
8. Write platform-specific captions, choose the most relevant existing landing page, and populate `manifest.json`.
9. Sequence the campaign in `deployment-plan.md`; do not invent best posting times.
10. Run the campaign validator and obtain human approval before publishing anywhere.

## Directory model

- `source/`: immutable originals plus provenance notes.
- `processed/`: reusable masters and clean standalone derivatives.
- `facebook/`, `instagram/`, `nextdoor/`, `google-business/`, `pinterest/`: platform-ready image files.
- `captions/`: one caption record per manifest item.
- `photo-inventory.md`: per-photo analysis and disposition.
- `pairing-review.md`: architectural evidence for every claimed pair.
- `privacy-review.md`: PII findings, exclusions, and redactions/crops.
- `manifest.json`: machine-readable deployment queue.
- `deployment-plan.md`: human-readable posting order and objectives.

## Selection and processing

Score transformation strength, clarity, authenticity, stopping power, and commercial relevance from 1–10. Scores guide judgment; they do not require every high-scoring photo to be used. Prefer a small content library with distinct reasons to exist.

Allowed edits are crop, resize, rotate/straighten, modest exposure or contrast correction, compression, format conversion, necessary privacy redaction, and restrained labels/branding. Never use generative fill or retouching to add/remove debris, repair the property, or exaggerate the result.

## Captions and destinations

Captions follow `CONTENT-GUIDE.md`. Each item is classified as `conversion`, `trust`, `traffic`, or `engagement`. Links must already exist and must fit the post’s intent: case study for proof, service page for service intent, local page for Alexandria relevance, a relevant article for education, and the homepage only for general brand content.

## Approval and archive

`status: "ready"` means the files passed local checks, not that publication is authorized. Human approval is mandatory before any external post. After a campaign is fully used, set item statuses to `published` or `retired`, add publication notes without deleting history, and move the whole campaign folder to `campaigns/archive/[job-slug]/`. Preserve source files, manifests, and captions.

## Validation

Run from the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File content-deployment/scripts/build-assets.ps1
python content-deployment/scripts/validate_campaign.py content-deployment/campaigns/alexandria-property-cleanout
```

Validation checks local asset and caption paths, valid manifest JSON, allowed statuses/intents/platforms, source accounting, destination allowlisting, and accidental public-site output. It does not replace human visual privacy review or architectural pairing review.
