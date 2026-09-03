# Analytics and Privacy Follow-up — September 2, 2026

This is a lightweight follow-up to the [August 26, 2026 site-wide baseline](site-audit-2026-08-26.md). It is not a new major audit and does not alter the historical report or findings JSON.

## Change reviewed

- Implementation commit: `6198630e996b5dacd7c047e770d2bf3b2e230303`
- Production domain: `https://clearpathjunkla.com/`
- Public route count after deployment: 27
- Analytics providers: Google Analytics and Microsoft Clarity
- Microsoft Clarity project ID: `ycblmnmumf`

The implementation added shared Google Consent Mode and Microsoft Clarity Consent V2 handling, a visitor-facing analytics choice, a public privacy notice, explicit masking for the estimate form, and validator guards for the shared integration.

## Finding updates

### AUD-002 — Missing privacy notice

- Previous status: `OPEN`
- Current status: `RESOLVED`
- Evidence: `/privacy/` is live, linked from the shared footer and estimate form, and explains Formspree, Google Analytics, Microsoft Clarity session replay, consent choices, masking, data categories, and contact information.
- Regression test: `tools/validate-site.js` requires the route, shared privacy link, key disclosures, consent controls, and explicit estimate-form masking.
- Implementation commit: `6198630e996b5dacd7c047e770d2bf3b2e230303`

The notice accurately describes the current technical setup without claiming universal legal compliance. Owner or qualified legal review remains appropriate if business practices, providers, jurisdictional obligations, or retention choices change.

### AUD-004 — Conversion events not instrumented

- Previous status: `OPEN`
- Current status: `OPEN`
- Evidence: Microsoft Clarity now supplies behavior analytics, heatmaps, and session replay under the shared consent choice, but the site does not emit an approved custom event taxonomy for SMS quote clicks, phone clicks, or successful estimate-form submissions.
- Recommendation: define and approve a privacy-safe conversion-event specification before implementation. Never include form contents, phone numbers, email addresses, exact addresses, SMS contents, or other personally identifiable information in analytics event data.

## Verification

- `node tools/validate-site.js`: passed for 27 indexable routes plus `404.html`.
- Live sitemap: 27 routes; every listed route returned HTTP 200.
- Live Clarity loader: exactly one configured project loader on the homepage; representative pages initialized `window.clarity` without console errors.
- Consent default: Google analytics storage and all advertising-related consent denied; Clarity analytics and advertising storage denied.
- Decline: no Google Analytics or Clarity cookies were created in a fresh browser state.
- Allow: analytics cookies were created and the choice persisted across navigation.
- Withdrawal: Clarity cookies were removed; both providers received denied analytics-storage updates.
- Masking: the estimate form carries `data-clarity-mask="true"`; no Clarity unmasking is present.
- Geometry: privacy content retained established 16px mobile gutters at 320, 375, 390, and 430 pixels; no overflow occurred at those widths or at 768, 1024, and 1440 pixels.
- Protected paths: `audits/`, `content-deployment/`, `READ ME/`, and `tools/` continued to return HTTP 404 on production.

## Remaining limitations

- Clarity dashboard population and provider-side retention/project settings were not verified because this task did not use an authenticated Clarity account.
- No custom conversion events were added.
- No claim is made that this technical implementation alone satisfies every privacy law or jurisdiction.
