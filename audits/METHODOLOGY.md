# Clear Path Site-Audit Methodology

This is the reusable procedure for major Clear Path website audits. It guides professional judgment; it is not a subjective scoring engine or a reason to manufacture changes.

## Audit principles

1. Audit before modifying production.
2. Establish evidence from the repository and live production, not assumptions.
3. Compare against the latest prior audit instead of starting from zero.
4. Retest old findings before carrying them forward.
5. Implement only objective, high-confidence, low-risk fixes that require no strategic decision.
6. Keep subjective or owner-dependent recommendations open rather than converting them into code or permanent policy.
7. Expand the scope when evidence reveals another material risk to discovery, crawlability, understanding, trust, conversion, accessibility, privacy, performance, or maintainability.

## Required preflight and comparison protocol

Before a major audit:

1. Read `AGENTS.md`.
2. Read this methodology.
3. Read the most recent dated audit report.
4. Read the matching machine-readable findings.
5. Record the current Git commit, branch, production origin, route count, and audit date.
6. Establish **CURRENT STATE vs. PREVIOUS STATE**.

The comparison must identify:

- Findings still unresolved, after retesting
- Findings resolved since the prior audit
- Regressions of previously verified behavior
- New findings and improvements
- Route-count and crawl-depth changes
- Architecture and build/validator changes
- New content clusters, service areas, and project evidence
- Changes in performance, accessibility, conversion instrumentation, and mobile geometry
- Search Console changes when current data is available and the sample supports a conclusion

Historical change is diagnostic evidence, not an automatic defect. A legitimate architecture change may alter a baseline measurement without creating a regression.

## Audit coverage

Use the areas below as the minimum coverage for a major audit. Investigate additional relevant areas whenever warranted.

### Discovery, crawl, and indexing

- **Production inventory:** Reconcile `tools/public-routes.js`, generated files, indexes, navigation, sitemap, RSS, and intended public content.
- **Live crawl:** Request every intended route and follow ordinary crawlable internal links. Record status, redirects, loops, malformed URLs, host variants, and broken fragments where material.
- **Crawlability:** Confirm important content and links do not depend on JavaScript, sitemap-only discovery, or manually entered URLs.
- **Indexability:** Review robots meta, response status, canonical, sitemap membership, duplicate/soft-404 risk, and intended index/noindex state.
- **Sitemap and robots.txt:** Prove route parity, canonical-domain consistency, truthful `lastmod`, rendering-asset access, and exclusion of internal content.
- **Canonicals and domain consistency:** Check self-canonicals, collisions, redirect/404 targets, HTTP/HTTPS, `www`, GitHub Pages, trailing slashes, and legacy origins.
- **404 behavior:** Verify a real 404 response, `noindex`, recovery navigation, and no sitemap/canonical exposure.

### Page meaning and content architecture

- **Metadata and headings:** Review unique titles, descriptions, one H1, logical H2/H3 structure, heading purpose, Open Graph, and Twitter metadata.
- **Search intent:** Assign the primary commercial, informational, or local intent of each important page and test whether the content satisfies it early.
- **Cannibalization:** Compare actual decisions and page purposes, not keyword overlap alone. Classify supporting clusters separately from genuine competing intent.
- **Content sufficiency:** Identify missing value, filler, repetition, thin pages, stale claims, and appropriate next steps without using word count as a quality proxy.
- **Local SEO:** Check business identity, phone, domain, service-area representation, authentic local evidence, and natural Alexandria/Central Louisiana relevance.
- **Service-area quality:** Test actual service relevance, unique local usefulness, differentiated copy, verified claims, links, and doorway/city-swap risk.
- **Service pages:** Review scope, supported examples, service boundaries, process, pricing factors, local context, proof, related content, and CTA.
- **Projects/case studies:** Review authenticity, privacy, scope accuracy, imagery, service/location associations, schema, internal links, and conversion path.
- **Blog architecture:** Review cards, roadmap accuracy, categories, article discovery, clustering, RSS, and service/project connections.
- **Topical clusters and scaling risk:** Map hubs/spokes and evaluate repetitive AI-style content, doorway expansion, close keyword variants, and commercially valuable gaps.
- **Current Google guidance:** For guidance that may have changed, consult current first-party Google Search documentation. Do not substitute SEO folklore or freeze a past interpretation as permanent truth.

### Internal navigation and understanding

- **Internal-link graph:** Calculate or approximate inbound links, outbound links, linking page types, crawl depth, and contextual authority.
- **Orphans and dead ends:** Identify pages with no crawlable inbound path or no sensible onward user journey.
- **Anchor text:** Check clarity, variety, misleading labels, vague labels, and unnatural exact-match repetition.
- **Breadcrumbs:** Compare visible hierarchy, crawlable parent links, labels, paths, and `BreadcrumbList` data.
- **Structured data:** Parse every JSON-LD block and verify type, URLs, dates, identity, breadcrumbs, and consistency with visible truthful content.

### Experience, media, and performance

- **Image SEO:** Check filenames, alt text, intrinsic dimensions, responsive behavior, format, loading priority, broken/duplicate assets, relevance, and privacy.
- **Performance and Core Web Vitals readiness:** Evaluate LCP, CLS, INP readiness, FCP, render blocking, transfer weight, caching, compression, fonts, unused code, and DOM complexity. Distinguish lab observations from field data.
- **Mobile geometry:** Apply the permanent 320/375/390/430 benchmarks in `AGENTS.md`; inspect document width and representative prose bounds plus screenshots.
- **Desktop/tablet regression:** Test 768/1024/1440, line length, grids, header, footer, imagery, and long-form width caps.
- **Accessibility:** Review semantics, landmarks, skip link, headings, keyboard behavior, focus, controls, labels, errors, contrast, targets, alt text, ARIA, tables, menu, and reduced motion.
- **Forms and conversion paths:** Test configuration, validation, success/error behavior without generating unnecessary business data; review SMS, telephone, form, service, and project CTAs.
- **Trust and experience:** Prefer authentic projects, accurate process, consistent identity, real media, and supported claims over badges, guarantees, testimonials, or credentials that cannot be verified.

### Technical and operating integrity

- **External links:** Check status, redirects, relevance, and authoritative sourcing for government/local claims.
- **JavaScript/rendering:** Check source-HTML availability of core content, links, metadata, and CTAs; inspect console errors.
- **CSS architecture:** Check invalid math, shared-container ownership, fixed/viewport widths, shrink behavior, specificity, duplicate/conflicting rules, and known geometry regressions.
- **HTML quality:** Check language, viewport, landmarks, duplicate IDs/meta, malformed structure, heading semantics, and inappropriate nesting.
- **Privacy/public-repository exposure:** Check tracked public material, deployment exclusions, internal directories, obvious secrets, customer data, source exports, and private-path leakage without entering prohibited private areas.
- **Analytics readiness:** Document whether approved analytics measure SMS, telephone, form success, and important service/project CTAs. Do not invent identifiers or add a platform without approval.
- **Search Console alignment:** When current exports are available, compare queries/pages carefully; do not generalize from tiny samples.
- **Build architecture:** Review configuration ownership, route registries, generation, stale/manual paths, old origins, cache keys, duplication, and output determinism.
- **Validator coverage:** Add only durable objective checks for demonstrated invariants. Never create a subjective SEO/content score generator.
- **AGENTS.md consistency:** Reconcile permanent rules with the real architecture. Add only durable lessons and keep temporary findings in audit history.

## Evidence and findings lifecycle

Use the matching JSON record for structured tracking. Findings use:

- Severity: `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `INFORMATIONAL`
- Priority: `FIX NOW`, `FIX SOON`, `MONITOR`, `LEAVE ALONE`
- Lifecycle: `OPEN`, `RESOLVED`, `MONITORING`, `ACCEPTED`, `NOT APPLICABLE`

Keep a finding ID stable when the same underlying issue is retested in a later audit. Create a new ID for a materially different issue. Do not claim resolution without evidence and, when implemented, an implementation commit or equivalent record.

## Audit cadence

Use a lightweight check after meaningful structural or deployment changes when warranted. Run a major site-wide audit periodically, after significant site or service-area expansion, after major architecture changes, or when Search Console/production evidence indicates a systemic issue. Do not impose an unnecessarily frequent fixed schedule.

## Completion and historical preservation

A completed major audit receives a new dated Markdown report and JSON findings file, is added to `audits/README.md`, and is never overwritten. Record the audited commit separately from any post-audit fix commit. Validate, review, commit, push, and verify production when fixes are deployed.

