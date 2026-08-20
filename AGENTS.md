# Clear Path Junk Removal Website Operating Manual

This file is the permanent repository-level operating manual for Clear Path Junk Removal website work. Read it before every task.

The working hierarchy is:

1. **`AGENTS.md`** — durable standards, safeguards, and regression knowledge.
2. **Current user request** — the objective and task-specific authority. Explicit instructions override normal defaults, subject to privacy, safety, factual accuracy, accessibility, and infrastructure constraints.
3. **Repository implementation** — the source of truth for current code, content, routes, assets, and configuration.

Do not reinvent the brand, architecture, or content strategy for each prompt. Inspect the relevant existing implementation, reuse it, and make the smallest robust change that satisfies the objective.

## Project Quick Reference

| Item | Source of truth |
| --- | --- |
| Business | Clear Path Junk Removal |
| Primary market | Alexandria and Central Louisiana |
| Production domain | `https://clearpathjunkla.com/` |
| Production base path | `/` |
| Hosting | GitHub Pages from the repository root |
| Primary conversion | Estimate request / photo quote |
| Primary design target | Mobile |
| Core public content | Services, Service Areas, Projects, Blog |
| Build command | `node tools/build-site.js` |
| Validation command | `node tools/validate-site.js` |
| Public route registry | `tools/public-routes.js` |
| Domain/base-path configuration | `tools/site-config.js` |
| Private path | `bookkeeping/` — never enter during website work |

Verified public business details currently used by the site:

- Phone/SMS: `318-290-8863`
- Email: `clearpathjunkremoval.la@gmail.com`
- Formspree endpoint: `https://formspree.io/f/xgojwqao`
- Google Analytics ID: `G-B9NEK0F2FQ`
- Published pricing: single-item pickups from `$75`; small jobs from `$150`; larger cleanouts quoted from photos. Do not change or expand these claims without explicit verified direction.

## Non-Negotiables

1. Read this file before every task.
2. Keep `https://clearpathjunkla.com/` as the production and canonical domain.
3. Design and verify mobile-first at 320, 375, 390, and 430 pixels.
4. Preserve intentional mobile gutters; normal prose is not full bleed.
5. Fix width bugs at their source; never use `overflow-x:hidden` as the sole repair.
6. Preserve genuine project evidence and never substitute generated proof for real work.
7. Never fabricate business facts, reviews, pricing, results, credentials, or local claims.
8. Never inspect, read, summarize, modify, stage, commit, or publish `bookkeeping/` during website work.
9. Protect customer identities, exact private addresses, financial data, messages, and circumstances.
10. Preserve technical SEO architecture, indexed URLs, canonicals, schema, sitemap, RSS, robots, and internal linking unless the task specifically requires a safe change.
11. Keep the homepage concise and conversion-focused.
12. Prioritize photo estimates and direct contact as the conversion path.
13. Prefer dependency-free HTML, CSS, and lightweight vanilla JavaScript; avoid unnecessary packages.
14. Validate meaningful changes and test representative shared-component regressions.
15. Do not claim deployment success until the requested live production verification has actually completed.

## Business Purpose and Decision Framework

The website exists to:

1. Generate qualified local junk-removal leads.
2. Establish trust through real project evidence and clear business information.
3. Rank for relevant local commercial and informational search intent.
4. Make estimate requests easy on a phone.
5. Build authority through useful service, location, project, and blog content.
6. Remain fast, professional, credible, and maintainable.
7. Avoid complexity that does not improve the customer experience.

The primary customer path is:

**DISCOVERY → TRUST → ESTIMATE REQUEST**

This is a local owner-operated service website. It is not a national directory, content farm, SaaS product, entertainment property, or corporate-franchise site.

When solutions compete, prioritize:

1. Accuracy
2. Customer trust
3. Conversion usefulness
4. Mobile usability
5. Accessibility
6. SEO value
7. Performance
8. Maintainability
9. Visual polish
10. Novelty

Novelty is intentionally last. Before admitting a feature, require a meaningful improvement to lead generation, trust, usability, SEO, accessibility, performance, or maintainability without materially harming the others.

## Brand Positioning and Voice

Clear Path should feel local, practical, dependable, straightforward, professional, owner-operated, approachable, hardworking, clean, and efficient.

Avoid branding that feels exaggerated, gimmicky, bargain-bin, overly corporate, fake-premium, overly glossy, or generically AI-produced.

Prefer:

- **Real project photo over generic claim**
- **Real case study over marketing hype**
- **Clear process over sales language**
- **Demonstrated experience over unsupported trust badges**

Use plain English with a confident, practical, local, professional tone. Keep paragraphs short. Use headings that reflect customer questions. Avoid filler, fake urgency, keyword stuffing, repeated conclusions, unsupported superlatives, and stock phrases such as “In today’s fast-paced world,” “Whether you’re,” “When it comes to,” “Look no further,” and “At Clear Path, we understand.”

## Repository Architecture and Ownership

The site is a dependency-free static website. Generated files are committed because GitHub Pages serves them directly.

Key ownership rules:

- `tools/site-config.js` owns deployment origin, base path, canonical origin, and URL helpers.
- `tools/public-routes.js` owns indexable route membership and maintainable `lastmod` values.
- `tools/build-site.js` owns shared layout, navigation, footer, service and area data, metadata/schema helpers, blog content, RSS, sitemap, robots, and generated output.
- `tools/homepage-content.js` owns the current homepage body imported by the build.
- `tools/featured-content.js` owns the current project index and Alexandria project presentation. Trace imports before treating any other export as authoritative.
- `style.css` owns shared design and responsive behavior.
- `script.js` owns the mobile menu, progressive reveal, estimate form behavior, before/after control support, and sticky mobile CTA visibility.
- Generated public HTML, `sitemap.xml`, `robots.txt`, `feed.xml`, and `404.html` are build outputs and are committed.
- `_config.yml` prevents tools and repository documentation from being published.
- `CNAME` must remain `clearpathjunkla.com` unless a verified domain migration is explicitly authorized.

When a generated page needs a durable change, edit its source and rebuild. Do not hand-edit one generated HTML page when the next build would erase the change. After source changes, run:

```powershell
node tools/build-site.js
node tools/validate-site.js
```

Centralize site-wide facts where the architecture already supports it. Do not scatter domains, routes, business contacts, service areas, metadata logic, or stylesheet cache keys across generated files.

## Design System

The aesthetic is **modern local contractor + premium service**: restrained, credible, clean, and image-led.

Current design direction:

- White or warm off-white backgrounds
- Dark charcoal text
- Forest and dark green primary colors
- Restrained lighter green and occasional gold accents
- Subtle neutral borders
- Generous but intentional whitespace
- Minimal, soft shadows
- Modest, consistent border radii
- Clean cards with clear hierarchy
- Strong typography
- Genuine project photography

Do not casually add neon colors, excessive gradients, glassmorphism, giant shadows, cartoon aesthetics, glossy 3D graphics, excessive iconography, trendy effects, or generic SaaS styling.

### Existing tokens

Prefer the existing CSS custom properties before adding values:

| Token | Current role/value |
| --- | --- |
| `--green` | Primary action green, `#1f7a3d` |
| `--green-dark` | Darker interactive green, `#125128` |
| `--green-deep` | Deep green surfaces, `#0b2a18` |
| `--charcoal` | Primary dark text/surface, `#1b1b1b` |
| `--gray` | Light neutral background, `#f5f7f5` |
| `--line` | Neutral border, `#e2e7e2` |
| `--muted` | Secondary text, `#667066` |
| `--gold` | Restrained accent, `#d4af37` |
| `--radius` | Shared card radius |
| `--max` | Shared content maximum, `1180px` |
| `--shadow`, `--soft-shadow` | Restrained elevation |

Prefer centralized tokens for colors, surface, border, spacing, radius, content width, article width, and shadows. Do not introduce arbitrary near-duplicate values when an existing token works. Do not rewrite the entire stylesheet merely to pursue an abstract token ideal.

## Mobile-First Policy

Mobile is the primary design target. Build the base experience for 320px, 375px, 390px, and 430px. Then enhance and verify at 768px, 1024px, and 1440px.

Mobile requirements:

- No page-level horizontal scrolling
- No clipped prose, headings, cards, callouts, buttons, related links, or footer content
- No oversized navigation or buttons
- No unusable tables
- No giant stacks of nested horizontal padding
- No tiny tap targets; target roughly 44px or greater for primary interactive controls
- No broken image ratios
- No desktop-first empty space
- One main horizontal gutter system for ordinary content
- Approximately 16px side gutters for normal prose unless a component is intentionally full bleed
- Sticky CTA must respect safe-area insets, avoid forms/footer, and never obscure essential content

Keep the standard viewport declaration:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

Use `env(safe-area-inset-bottom)` only where appropriate for fixed mobile controls. Do not introduce unusual scaling directives.

## Mobile Layout Regression Benchmark

Commit `50e86c7f3d2266f48b1a51e12697e4817d57a51f` is the permanent regression reference for shared article width.

### Historical root cause

Two rules removed the intended article gutters.

First, shared containers used invalid arithmetic:

```css
width: min(100% - 32px, var(--max));
```

Browsers discarded it because the subtraction inside `min()` required `calc()`.

Correct:

```css
width: min(calc(100% - 32px), var(--max));
```

Second, `.article-layout` later declared:

```css
width: 100%;
```

The article layout is itself a shared `.container`, so that later declaration overrode container ownership and forced ordinary prose back to the viewport edges. Removing the override restored the shared gutter system.

### Why `scrollWidth` alone failed

At a 390px viewport before the fix:

- Paragraph left: `0px`
- Paragraph right: `390px`
- Paragraph width: `390px`
- `window.innerWidth`: `390px`
- `document.documentElement.scrollWidth`: `390px`
- `document.body.scrollWidth`: `390px`

There was no document-level overflow, but the intended gutters were gone and text appeared cropped at the physical screen edge. Therefore:

```js
document.documentElement.scrollWidth === window.innerWidth
```

does **not** prove the mobile layout is visually correct.

### Known-good mobile geometry

| Viewport | Normal article prose bounds | Intended gutters |
| ---: | ---: | ---: |
| 320px | about `16px–304px` | about 16px each side |
| 375px | about `16px–359px` | about 16px each side |
| 390px | about `16px–374px` | about 16px each side |
| 430px | about `16px–414px` | about 16px each side |

These are regression references for ordinary prose, not a mandate for intentional full-bleed media or backgrounds.

Validate both document width and representative content geometry:

```js
document.documentElement.scrollWidth <= window.innerWidth + 1;

const rect = paragraph.getBoundingClientRect();
rect.left >= 15;
rect.right <= window.innerWidth - 15;
```

Allow insignificant browser rounding differences.

### Permanent layout safeguards

- Never write `min(100% - 32px, ...)`, `max(100% - 32px, ...)`, or equivalent arithmetic without `calc()`.
- Use valid math such as `min(calc(100% - 32px), ...)` consistently in `min()`, `max()`, `clamp()`, widths, and layout calculations.
- Let shared container systems own page width. Do not add `width:100%` to a page-specific wrapper when the same element already receives the shared container width.
- Preserve `min-width:0` where flex/grid children, article columns, cards, or responsive children need to shrink.
- Preserve global border-box sizing:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

- Do not treat `overflow-x:hidden` as the primary repair. Find invalid math, oversized children, bad width overrides, missing shrink rules, transforms, nowrap, fixed widths, negative margins, or excess padding.
- A defensive overflow rule may exist for an independent reason, but root-cause geometry must still be correct.
- Existing validator guards against invalid percentage arithmetic and `.article-layout { width:100% }` are permanent. Do not remove or weaken them without equivalent protection.

### Cache-busting shared CSS

Mobile Safari retained stale CSS during this incident. For production-critical shared stylesheet changes:

1. Update the centralized stylesheet cache key in the build system.
2. Rebuild every generated page through existing tooling.
3. Confirm production serves the new key before visual verification.

`layout-width-1` records the historical fix; the durable rule is to increment the centralized key for critical shared CSS, never scatter arbitrary query strings through generated files.

### Required shared-layout regression set

For shared CSS or component changes, inspect at 320, 375, 390, 430, 768, 1024, and 1440 pixels. At minimum verify:

- Homepage
- Blog index
- Blog: junk-removal cost guide
- Blog: junk removal vs. dumpster rental
- Property-cleanout service page
- Alexandria property project page

Check document/body width, normal prose bounds, gutters, headings, callouts, CTA buttons, related links, tables, images, footer, sticky CTA, intentional full-bleed elements, and visible overflow offenders.

Long-form article prose should remain comfortably capped at approximately `820px` on desktop. Automated checks are not enough: inspect computed geometry and rendered screenshots because a document can have a valid scroll width and still have broken visual margins.

## Page and Conversion Strategy

### Homepage

Keep the homepage concise. It should quickly answer what Clear Path does, where it operates, why the visitor should trust it, and how to request an estimate.

Preserve the established conversion flow: concise hero and primary CTA, local/trust signal, real project proof, compact core services, simple process, recent work, compact pricing, final contact/estimate area, footer. Do not turn the homepage into a long SEO article or duplicate the depth of service, location, project, and blog pages.

### CTAs

Primary conversion: an estimate request, preferably supported by photos.

Preferred language:

- “Text Photos for a Quote”
- “Get an Estimate”
- “Call Clear Path” or the published phone number

Avoid vague slogans such as “Unlock Your Clean Space,” “Start Your Journey,” or “Learn More Today.” On mobile, keep one dominant action, stack buttons when necessary, and prevent long labels from overflowing. Preserve SMS, telephone, email, and Formspree functionality.

### Navigation, footer, and forms

Keep primary navigation concise: Home, Services, Areas, Recent Work/Projects, Blog, About, and an estimate action. Do not turn navigation or the footer into a keyword sitemap.

Keep the footer compact and useful: brand, key navigation, contact information, social links, service-area context, and copyright/legal information.

Ask only for information necessary to respond: name, contact details, location or job context, description, and photos where supported. Maintain labels, keyboard access, success/error messaging, and the current low-friction photo-first path. Never request sensitive financial or identity data.

## Content Standards

All content must be useful, concise, factual, locally relevant, easy to scan, commercially useful, and written for humans first. Every paragraph must earn its place.

Do not fabricate or imply unverified:

- Prices or discounts
- Ratings, reviews, or testimonials
- Years in business
- Employee or customer counts
- Licenses, certifications, insurance, or credentials
- Street address or hours
- Disposal, donation, or recycling relationships and percentages
- Response-time guarantees
- Project counts, awards, or statistics
- Environmental claims such as “zero landfill,” “100% eco-friendly,” or “we donate everything”
- Urgency such as “only two appointments left”

If a fact is not verified in approved repository information or explicit user direction, omit it or qualify it honestly.

Before creating content, ask:

1. What customer/search intent does it serve?
2. Is it meaningfully different from existing content?
3. Is Clear Path legitimately relevant to the topic?
4. Is it genuinely useful?
5. Which existing pages should link to it?
6. Which pages should it link to?
7. Which CTA fits the intent?
8. Could it cannibalize an existing page?

Search existing content first. Improve a useful page instead of creating a duplicate. Do not mass-produce thin city/service swaps or doorway pages.

## Local SEO and Content Architecture

Primary geographic relevance is Alexandria, Louisiana and Central Louisiana. Use location language naturally; never manufacture local experience.

The four main SEO content types have different jobs:

1. **Service pages** — commercial intent and specific removal scope.
2. **Service-area pages** — genuine local intent and availability context.
3. **Project/case-study pages** — proof, experience, and local relevance.
4. **Blog articles** — informational intent and topical authority.

The local SEO moat is evidence competitors cannot easily fake: real projects, genuine photos, verified Alexandria-area work, actual service details, practical pricing factors, clear process, and useful cleanup information. Do not rely on mass-produced generic articles.

### Blog strategy

Publish only topics that answer real prospective-customer questions. Strong categories include pricing, junk removal versus dumpster rental, property and estate cleanouts, rental turnovers, furniture and appliance removal, garage cleanouts, yard debris, accepted materials, photo estimates, and accurate disposal considerations.

Every article should have:

- One clear search intent
- Unique title and meta description
- One H1 with logical H2/H3 structure
- A useful opening answer within the first screen or two
- Short, scannable sections
- Natural internal links
- A relevant estimate CTA
- Accurate `BlogPosting` schema and breadcrumbs
- Useful imagery only when it materially improves comprehension

Do not target arbitrary word counts. Answer the question fully, then stop. Do not bury the answer behind a generic introduction.

### Internal linking

No important public page may be orphaned. Use crawlable `<a href>` links rather than JavaScript-only navigation.

Typical patterns:

- Blog → relevant service → related article/project → estimate CTA
- Project → service → service area → estimate CTA
- Service area → services → verified projects → estimate CTA
- Service → relevant area, project, guide, and estimate CTA

Use descriptive anchors. Avoid repetitive “click here” links and unnatural exact-match repetition.

## Project and Image Standards

Real completed work is a core trust asset. Project pages should focus on general location, initial condition, verified scope, work performed, result, and clear before/after photography.

The current public project retains `/projects/alexandria-duplex-cleanout/` for indexed URL continuity, while visible copy uses the privacy-safe “Alexandria Property Cleanout.” Do not expose the Cook Ave street number, customer name, private contact information, payment details, messages, or sensitive circumstances.

### Photography

- Prefer genuine Clear Path project photography for projects, proof, before/after, trust, and local credibility.
- Do not replace real job photos with generated substitutes because generated media looks cleaner.
- Keep original photographs untouched; create optimized website-ready copies.
- Use lowercase descriptive filenames.
- Use explicit `width` and `height`, accurate alt text, and responsive sizing.
- Prefer WebP for appropriate raster delivery.
- Use `loading="lazy"` and generally `decoding="async"` below the fold.
- Do not lazy-load an important LCP image without assessing the performance impact.
- Label before/after images clearly and do not crop or manipulate them to exaggerate results.
- Never imply repair, sanitation, or cleaning beyond the removal work actually performed.

Alt text should describe the image without keyword stuffing. Example: “Living room before and after a property cleanout in Alexandria.”

### Generated visuals and infographics

Generated visuals are appropriate only for diagrams, educational graphics, infographics, or conceptual illustrations—not fake employees, trucks, customers, jobs, or property results.

Infographics must be useful, restrained, mobile-readable, brand-consistent, and professional. Prefer off-white backgrounds, charcoal text, forest-green accents, simple line icons, strong hierarchy, generous whitespace, and minimal cards. Avoid tiny text, 3D icons, fake statistics, decorative clutter, and generic AI styling.

If generated text is garbled, misspelled, or inconsistent, do not ship it. Use deterministic SVG, HTML/CSS, or another method with accurate accessible text. Essential information shown visually must also exist in surrounding HTML or an equivalent accessible description.

## Technical SEO and Indexing

Every indexable page needs:

- A unique useful `<title>`
- A unique meta description
- Exactly one canonical URL
- Open Graph and appropriate Twitter metadata
- Correct index/follow behavior
- Exactly one H1 and logical headings
- Breadcrumbs on interior pages
- Appropriate truthful schema
- Crawlable internal links
- Inclusion in the centralized public route/sitemap system

The canonical production origin is `https://clearpathjunkla.com`. Do not point canonicals, sitemap, feed, schema, or social URLs to the old GitHub Pages project URL or to `clearpathjunkremoval.com`.

Valid schema types may include `LocalBusiness`, `WebSite`, `Service`, `Article`, `BlogPosting`, and `BreadcrumbList` when supported by visible content. Never add fabricated `Review`, `AggregateRating`, `openingHours`, address, awards, employee data, or similar properties.

### Sitemap, robots, feed, and 404

- `tools/public-routes.js` is the authoritative indexable route list. Add an accurate maintained `lastmod`; do not use fake freshness dates.
- Generate `sitemap.xml` through the existing system. Exclude `404.html`, tools, documentation, private files, and noindex pages.
- Keep `robots.txt` crawl-friendly, preserve the production sitemap reference, and do not block required CSS, JavaScript, images, services, areas, projects, or blog content.
- Robots directives are not security controls; private data must never enter the public tree.
- Add published blog posts to the existing RSS generator. Feed, canonical, sitemap, and article URLs must agree.
- Keep `404.html` useful, branded, navigable, CTA-enabled, and `noindex, follow` without a canonical or sitemap entry.

Preserve lowercase, hyphenated, trailing-slash route conventions. Do not casually change indexed URLs.

## Performance, JavaScript, and Accessibility

Prefer semantic HTML, existing CSS, optimized media, and lightweight vanilla JavaScript. Avoid frameworks, animation packages, client-side rendering, heavy state management, and dependencies that do not earn their cost.

Use JavaScript only for real functionality. Preserve no-JavaScript crawlability for navigation and important content. Respect `prefers-reduced-motion` and avoid autoplay, heavy carousels, popups, chat widgets, or unnecessary animation.

Maintain:

- Semantic regions and headings
- Skip navigation
- Keyboard-operable menus, controls, and forms
- Visible focus states
- Sufficient contrast
- Meaningful link and button labels
- Form labels and accessible status/error messages
- Accurate image alt text
- Reasonable touch targets
- Accessible tables and responsive equivalents

Do not trade accessibility for visual minimalism.

## Privacy and Repository Boundaries

Never expose customer contact details, invoices, payment information, receipts, private addresses, credentials, API keys, access tokens, environment secrets, verification tokens, or private correspondence.

### `bookkeeping/` hard boundary

`bookkeeping/` is private and outside the public website context. During website work, treat it as nonexistent. Do not list it, search it, open it, read its README, summarize it, modify it, validate it, stage it, commit it, push it, or use it as a source for public content.

The previous `AGENTS.md` contained bookkeeping-edit procedures. Those procedures belong to the private bookkeeping context and do not authorize access from website tasks. Never mix financial workflows or records with public website changes.

Preserve `.gitignore`. Before every commit, run `git status`. If private, sensitive, or unrelated files appear, stop and resolve the scope before staging. Never weaken ignore protections for `bookkeeping/`, credentials, keys, or environment files.

## Development and Validation Workflow

Prefer the smallest robust solution. Reuse existing components, classes, templates, route systems, configuration, content modules, metadata helpers, build tools, and validation. Do not refactor unrelated code or redesign unrelated pages.

For meaningful website changes:

1. Inspect the source of truth, not only generated output.
2. Implement the change in the owning source file.
3. Rebuild when generated files are affected.
4. Run `node tools/validate-site.js`.
5. Fix introduced failures; never weaken validation merely to pass.
6. Review `git diff` and `git status`.
7. Test mobile and shared regressions when layout/components are affected.
8. Stage only relevant public files.

The validator currently protects crawlability, orphaning, metadata, canonicals, robots, Open Graph, Twitter cards, headings, image attributes, JSON-LD, sitemap, RSS, local assets, private-path exclusions, valid percentage arithmetic inside `min()`/`max()`, and shared article-container ownership. The width safeguards added after commit `50e86c7` are permanent unless equivalent tests replace them.

For visual changes, automated validation is necessary but insufficient. Inspect actual rendered pages and screenshots at 320, 375, 390, 430, 768, 1024, and 1440 pixels as appropriate. Check document width, body width, representative prose geometry, headings, CTAs, images, tables, footer, fixed controls, and full-bleed intent.

## Git and Deployment

GitHub Pages is the hosting/deployment mechanism; `https://clearpathjunkla.com/` is the public production site.

Standard workflow:

```powershell
git status
node tools/validate-site.js
git diff
git add <only relevant files>
git commit -m "Descriptive change summary"
git push
```

- Preserve unrelated user changes in a dirty worktree.
- Do not stage broad private or unrelated paths.
- Do not force push, rewrite history, reset hard, change remotes, or replace `CNAME` without explicit authorization.
- After pushing, wait for GitHub Pages deployment before claiming the change is live.
- When live verification is requested, verify the production URL and required assets/behavior directly. A successful push alone is not production verification.

## Scope and Conflict Handling

Respect the requested scope. Adding one article does not authorize a homepage redesign. Fixing one bug does not authorize rewriting service pages. Changing images does not authorize unrelated SEO changes. Reviewing or diagnosing does not authorize implementation unless requested.

Explicit current user instructions override general defaults, but do not blindly implement a request that would expose private data, create deceptive content, seriously damage SEO, break accessibility, weaken security, or contradict verified infrastructure. Explain the conflict and seek direction when required.

## Required Preflight

Before every future task:

1. Read `AGENTS.md` completely.
2. Read the current user request.
3. Run `git status`.
4. Inspect only relevant public files; never enter `bookkeeping/`.
5. Identify the owning source files, generated outputs, affected routes, and shared components.
6. Preserve privacy, factual accuracy, SEO, accessibility, and existing user work.
7. Reuse the existing architecture.
8. Implement the smallest robust solution.
9. Rebuild if needed.
10. Validate.
11. Review the diff and status.
12. Test mobile and shared regressions when applicable.
13. Verify production when requested.
14. Report exactly what changed, what was tested, and any remaining issue.

## Definition of Done

A task is not done merely because code or copy exists. Depending on scope, done means:

- Requested implementation is complete.
- Responsive behavior is verified.
- Accessibility and SEO are preserved.
- Performance impact is considered.
- Validation passes.
- No private or unrelated files were touched.
- Diff and status were reviewed.
- Commit and push completed when requested.
- Live deployment was actually checked when requested.

Never claim a test, push, or live verification that did not occur.

## Maintaining This Manual

Update `AGENTS.md` only for durable changes to brand identity, verified business facts, production domain, deployment architecture, public site structure, design system, conversion strategy, SEO architecture, validation workflow, privacy boundaries, or permanent regression knowledge.

Do not add temporary implementation details or repeat the same rule in multiple sections. When updating this manual:

- Preserve still-valid standards.
- Change only affected sections.
- Reconcile contradictions explicitly.
- Keep headings scannable, bullets concise, and benchmark tables compact.
- Verify the manual against the current repository before treating a new fact as permanent.
