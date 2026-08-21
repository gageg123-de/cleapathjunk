# Validation report

Validated on 2026-08-20. External publication remains unauthorized.

## Automated checks

Command:

```powershell
python content-deployment/scripts/validate_campaign.py content-deployment/campaigns/alexandria-property-cleanout
```

Result: PASS

- 10 source images accounted for.
- 10 source SHA-256 hashes matched.
- 11 manifest items parsed from valid JSON.
- 11 referenced processed assets exist and match platform dimensions.
- 11 caption files exist.
- Intent counts: conversion 4, trust 3, traffic 3, engagement 1.
- All statuses, platforms, destinations, alt text, and campaign references passed.
- No HTML/public-page output exists inside the campaign.
- Public-facing captions contain no exact street reference.

## Destination checks

All selected existing destinations returned HTTP 200:

- `https://clearpathjunkla.com/`
- `https://clearpathjunkla.com/services/property-cleanouts/`
- `https://clearpathjunkla.com/service-areas/alexandria-la/`
- `https://clearpathjunkla.com/projects/alexandria-duplex-cleanout/`

The production sitemap was read successfully. No website URL or page was created.

## Human visual checks

- All ten sources were reviewed individually.
- All five pair claims were checked against visible architecture.
- Platform comparisons were reviewed after generation.
- The porch-before person was fully removed from active derivatives by crop only; the original remains unchanged.
- No other PII was found in active assets.
- No generative editing was used.

## Scope checks

- `bookkeeping/` was neither inspected nor modified.
- The public website build was not modified.
- Only `AGENTS.md` and the non-public `content-deployment/` system are in task scope.
