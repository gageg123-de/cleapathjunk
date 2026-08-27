# Clear Path Junk Removal Website

Dependency-free static website for Clear Path Junk Removal in Alexandria and Central Louisiana.

## Build and validate

```powershell
node tools/build-site.js
node tools/validate-site.js
```

The generated HTML, `sitemap.xml`, `robots.txt`, `feed.xml`, and `404.html` are committed for GitHub Pages. See [`READ ME/README.md`](READ%20ME/README.md) for architecture, deployment, image, and indexing documentation.

## Operating references

- [`AGENTS.md`](AGENTS.md) — permanent repository operating standards
- [`audits/README.md`](audits/README.md) — internal audit history and baseline index
- [`audits/METHODOLOGY.md`](audits/METHODOLOGY.md) — reusable major-audit and comparison procedure
- `node tools/validate-site.js` — objective repository and public-site invariants

The `audits/` and `READ ME/` directories are internal documentation and are excluded from the public GitHub Pages deployment.

## Current public site

`https://clearpathjunkla.com/`

GitHub Pages remains the hosting platform, with `CNAME` preserving the custom-domain assignment. Canonical and deployment paths are centralized in `tools/site-config.js`; public indexable routes and maintained `lastmod` dates are centralized in `tools/public-routes.js`.
