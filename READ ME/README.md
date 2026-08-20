# Clear Path Junk Removal Website

Dependency-free static website for Clear Path Junk Removal. The generated HTML can be hosted directly on GitHub Pages or any ordinary static host.

## Site architecture

- `/` — homepage, estimate form, pricing, reviews placeholder, before/after slider
- `/services/` — service overview
- `/services/property-cleanouts/`
- `/services/furniture-removal/`
- `/services/estate-cleanouts/`
- `/services/garage-cleanouts/`
- `/services/appliance-removal/`
- `/services/yard-debris-removal/`
- `/service-areas/` — location overview
- `/service-areas/alexandria-la/`
- `/service-areas/pineville-la/`
- `/projects/` — recent work index
- `/projects/alexandria-duplex-cleanout/`
- `/blog/` — article index and editorial roadmap
- `/blog/junk-removal-cost-alexandria-la/`

Shared design and behavior live in `style.css` and `script.js`. `tools/build-site.js` contains the reusable page templates and content data used to generate the static HTML files.

## Rebuild generated pages

Run this command from the website root after changing `tools/build-site.js`:

```powershell
node tools/build-site.js
```

The generated files are committed/deployed as normal static files. Website visitors do not need Node or a build process.

## Production domain and deployment path

Deployment paths are centralized in `tools/site-config.js`. The current defaults are:

- Canonical base: `https://clearpathjunkla.com`
- GitHub Pages deployment origin: `https://clearpathjunkla.com`
- Production base path: `/`

GitHub Pages hosts the repository, while the custom domain serves it from the domain root. The build keeps navigation, stylesheet, script, and image URLs root-relative. Canonicals, Open Graph URLs, schema URLs, sitemap entries, and RSS links use the verified custom domain.

`clearpathjunkremoval.com` currently resolves to an unrelated Kansas City company and must not be used for this Alexandria site's canonicals, sitemap, schema, or verification. Configure a custom domain only after ownership and DNS are confirmed.

The production values are the defaults. Environment variables remain available for a temporary preview or alternate deployment without editing page templates:

```powershell
$env:SITE_BASE_PATH = "/"
$env:SITE_DEPLOYMENT_ORIGIN = "https://preview.example.com"
$env:SITE_CANONICAL_ORIGIN = "https://preview.example.com"
node tools/build-site.js
node tools/validate-site.js
```

Remove those temporary environment variables or open a new shell before rebuilding production. The root-level `CNAME` file must remain `clearpathjunkla.com`; do not replace it for local previews.

## Adding a service page

1. Add a unique service object to the `services` array in `tools/build-site.js`.
2. Write a unique title, meta description, H1, introduction, handled-items list, audience list, pricing factors, FAQs, and related-service slugs.
3. Run the build command.
4. Add the route and an accurate `lastmod` date to `tools/public-routes.js`.
5. Check the page on desktop and mobile and verify all related links.

## Adding a service-area page

1. Add a unique entry to `areaData` in `tools/build-site.js`.
2. Include genuinely useful local information. Do not create a city-name swap or claim unverified jobs.
3. Add the location to the service-area index when appropriate.
4. Add the route to `tools/public-routes.js`, then run the build and validation commands.

## Adding a blog article

1. Create a unique article pathname and body in `tools/build-site.js` using the article layout classes.
2. Include a canonical URL, Open Graph fields, breadcrumbs, `BlogPosting` schema, related services, and a closing estimate CTA.
3. Add a real article card to `/blog/`; do not create an empty indexed page.
4. Add the route to `tools/public-routes.js`, add the published article to RSS generation, and rebuild.

Future content ideas are shown only on the blog index as an editorial roadmap. They are not linked to empty pages.

## Adding a project

1. Confirm all facts and obtain permission to use the images.
2. Keep customer names, addresses, payment details, and sensitive circumstances private.
3. Copy, rather than overwrite, the original images into `assets/images/` with descriptive filenames.
4. Add the project case study, project-index card, related service/location links, schema, and sitemap URL.
5. Use factual alt text and explicit width/height attributes.

## Image requirements

- Keep original photographs untouched.
- Store website-ready copies in `assets/images/`.
- Use lowercase descriptive filenames, for example `alexandria-duplex-living-room-before-after.jpg`.
- Do not substitute generated images for real customer or job photography.
- Add accurate alt text, intrinsic width/height, and `loading="lazy"` below the fold.
- Compress copies when practical without destroying the original.

The hero and before/after slider use optimized WebP delivery copies. Their original PNG files remain preserved in the same folder.

The Alexandria duplex case study currently uses one confirmed real before/after image. Add more only after verifying that they belong to that job.

## Reviews configuration

No unverified testimonials or ratings are published. When the verified Google Business Profile review URL is available, add it to `GOOGLE_REVIEWS_URL` in `script.js`. The “Read Our Google Reviews” link remains hidden until that value is configured.

## SEO checklist

- Unique, useful title and meta description
- One descriptive H1
- Canonical URL on the configured and verified public base
- Open Graph title, description, URL, type, and image
- Logical internal links to services, locations, proof, and estimate flow
- Breadcrumb navigation and `BreadcrumbList` schema on interior pages
- Accurate `Service`, `Article`, or `BlogPosting` schema where relevant
- No fabricated reviews, ratings, addresses, hours, jobs, or pricing
- Descriptive filenames, alt text, width/height, and lazy loading for images
- URL included in `sitemap.xml`
- Navigation, mobile CTA, phone, SMS, email, and Formspree links tested
- Valid heading hierarchy, keyboard focus, and mobile layout

## Contact and integrations

- Phone/SMS: `318-290-8863`
- Email: `clearpathjunkremoval.la@gmail.com`
- Formspree endpoint: `https://formspree.io/f/xgojwqao`
- Public URL: `https://clearpathjunkla.com/`
- Google Analytics ID: `G-B9NEK0F2FQ`

Search `tools/build-site.js`, `index.html`, and `script.js` when updating these values.

## Current real-photo presentation

The homepage is a concise photo-first path: header, real-job hero, before/after result, four service categories, three-step process, recent-work proof, trust and pricing summary, estimate form, and footer.

The Alexandria Property Cleanout uses ten verified Cook Ave job photos stored as optimized, metadata-stripped WebP copies in `assets/images/cook-ave/`. The source JPEGs remain untouched in their original storage location and are not published. Five explicit before/after pairs cover the living room, two kitchen views, an additional room, and the covered porch.

The public project name is intentionally privacy-safe. Keep the existing `/projects/alexandria-duplex-cleanout/` slug for URL continuity, but use “Alexandria Property Cleanout” in visible copy, metadata, and schema.

## SEO and indexing infrastructure

The technical indexing package is generated and validated from shared configuration:

- `tools/site-config.js` separates the deployment origin, deployment base path, and canonical base.
- `tools/public-routes.js` is the authoritative list of public indexable routes and maintained `lastmod` dates.
- `sitemap.xml` contains only those public routes.
- `robots.txt` allows the public site root, references the custom-domain sitemap, and excludes build/documentation paths.
- `404.html` is a useful `noindex, follow` error page and is intentionally excluded from the sitemap.
- `feed.xml` is an RSS 2.0 feed containing published blog articles only.
- `_config.yml` prevents GitHub Pages from publishing build tools and internal repository documentation.
- `tools/validate-site.js` audits crawlability, orphans, local assets, metadata, canonicals, headings, JSON-LD, Open Graph, Twitter cards, sitemap, RSS, robots, and private-file protections.

A sitemap index is intentionally omitted because the site currently has only 16 indexable URLs. A web manifest and Apple touch icon are also omitted until a suitable square brand icon exists; the existing real logo is declared as the favicon.

### Adding a public page

1. Add a unique canonical path.
2. Add a unique title and useful meta description.
3. Add exactly one H1 and a logical heading hierarchy.
4. Link the page from crawlable navigation or relevant page content.
5. Add the route and accurate `lastmod` to `tools/public-routes.js`.
6. Add only schema that matches visible page content.
7. Verify image alt text and intrinsic dimensions.
8. Verify all generated links use the configured production base path.
9. Run `node tools/build-site.js` and `node tools/validate-site.js`.

### Adding a published blog article

Follow the public-page checklist, add `BlogPosting` schema, link the article from `/blog/`, add relevant service/project links, and add the item to RSS generation. Do not generate empty placeholder articles.

### Google Search Console

After deployment:

1. Add the URL-prefix property `https://clearpathjunkla.com/` in Google Search Console.
2. Complete the verification method Google actually provides. If Google supplies an HTML verification file, place that exact file in the repository root. If Google supplies a meta tag, add the exact unchanged tag to the shared `layout()` head in `tools/build-site.js`.
3. Submit `https://clearpathjunkla.com/sitemap.xml` in the Sitemaps report.
4. Inspect the homepage and a representative service, area, project, and blog URL, then request indexing when appropriate.

Do not invent or reuse a verification token. Bing Webmaster Tools verification follows the same rule: preserve the exact supplied file or meta tag and never fabricate one.

The verified custom domain serves `robots.txt`, `sitemap.xml`, and all public assets from `/`. GitHub Pages remains the deployment infrastructure, and `CNAME` preserves the domain assignment.
