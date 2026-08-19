# Clear Path Junk Removal Website

Dependency-free static website for Clear Path Junk Removal in Alexandria and Central Louisiana.

## Build and validate

```powershell
node tools/build-site.js
node tools/validate-site.js
```

The generated HTML, `sitemap.xml`, `robots.txt`, `feed.xml`, and `404.html` are committed for GitHub Pages. See [`READ ME/README.md`](READ%20ME/README.md) for architecture, deployment, image, and indexing documentation.

## Current public site

`https://gageg123-de.github.io/cleapathjunk/`

Canonical and deployment paths are centralized in `tools/site-config.js`. Public indexable routes and maintained `lastmod` dates are centralized in `tools/public-routes.js`.
