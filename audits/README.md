# Clear Path Audit History

This directory is the internal, versioned record of major Clear Path website audits. It is excluded from GitHub Pages and must never be added to public routes, sitemap entries, feeds, or public HTML links.

## How to use this history

- Treat each dated audit as a historical record, not automatically current truth.
- Never overwrite a completed audit. Create a new dated Markdown report and matching JSON findings file.
- Before a new major audit, read `AGENTS.md`, `METHODOLOGY.md`, the latest report, and its machine-readable findings.
- Compare the current state with the latest verified baseline before forming conclusions.
- Retest every carried-forward finding. Do not copy old findings forward without fresh evidence.
- Record unresolved, resolved, regressed, and new findings separately.
- Keep subjective recommendations in the audit history unless they reveal a genuinely durable operating rule.
- Preserve historical measurements as evidence; do not turn route counts, asset sizes, or lab timings into permanent assumptions.

## Audit history

| Date | Production state | Audit | Findings | Result |
| --- | --- | --- | --- | --- |
| 2026-08-26 | Audited `8039c9cd6b232a37ad66ac892b6c1a99a3cedf91`; fixes committed as `9473adcdeb55fff8a498512e56de4ae1a9d60a44` | [Site-wide baseline](site-audit-2026-08-26.md) | [JSON](site-audit-2026-08-26.json) | Strong overall baseline; internal deployment exposure and duplicate-home fragment links resolved; follow-ups retained |

## Record naming

Use:

- `site-audit-YYYY-MM-DD.md`
- `site-audit-YYYY-MM-DD.json`

If more than one major audit occurs on the same day, append a short stable qualifier rather than replacing the earlier files.

The JSON convention is defined by [`findings.schema.json`](findings.schema.json). The reusable process and comparison protocol are in [`METHODOLOGY.md`](METHODOLOGY.md).

