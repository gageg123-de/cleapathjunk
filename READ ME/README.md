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

## Deployment base path

Deployment paths are centralized in `tools/site-config.js`. The current defaults are:

- Canonical production origin: `https://clearpathjunkremoval.com`
- GitHub Pages deployment origin: `https://gageg123-de.github.io`
- GitHub Pages base path: `/cleapathjunk/`

The build prefixes generated navigation, stylesheet, script, and image URLs with the deployment base path while leaving canonical URLs and sitemap page URLs on the intended production domain.

To build later for the custom domain at the domain root, set the deployment values without editing page templates:

```powershell
$env:SITE_BASE_PATH = "/"
$env:SITE_DEPLOYMENT_ORIGIN = "https://clearpathjunkremoval.com"
node tools/build-site.js
node tools/validate-site.js
```

Remove those temporary environment variables or open a new shell before rebuilding for GitHub Pages again.

## Adding a service page

1. Add a unique service object to the `services` array in `tools/build-site.js`.
2. Write a unique title, meta description, H1, introduction, handled-items list, audience list, pricing factors, FAQs, and related-service slugs.
3. Run the build command.
4. Add the generated URL to the `urls` sitemap array if the page is not generated from `services`.
5. Check the page on desktop and mobile and verify all related links.

## Adding a service-area page

1. Add a unique entry to `areaData` in `tools/build-site.js`.
2. Include genuinely useful local information. Do not create a city-name swap or claim unverified jobs.
3. Add the location to the service-area index when appropriate.
4. Run the build command and add the URL to the sitemap list.

## Adding a blog article

1. Create a unique article pathname and body in `tools/build-site.js` using the article layout classes.
2. Include a canonical URL, Open Graph fields, breadcrumbs, `BlogPosting` schema, related services, and a closing estimate CTA.
3. Add a real article card to `/blog/`; do not create an empty indexed page.
4. Add the URL to the sitemap and rebuild.

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
- Canonical URL on the final production domain
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
- Production URL: `https://clearpathjunkremoval.com`
- Google Analytics ID: `G-B9NEK0F2FQ`

Search `tools/build-site.js`, `index.html`, and `script.js` when updating these values.

## Current real-photo presentation

The homepage is a concise photo-first path: header, real-job hero, before/after result, four service categories, three-step process, recent-work proof, trust and pricing summary, estimate form, and footer.

The Alexandria Property Cleanout uses ten verified Cook Ave job photos stored as optimized, metadata-stripped WebP copies in `assets/images/cook-ave/`. The source JPEGs remain untouched in their original storage location and are not published. Five explicit before/after pairs cover the living room, two kitchen views, an additional room, and the covered porch.

The public project name is intentionally privacy-safe. Keep the existing `/projects/alexandria-duplex-cleanout/` slug for URL continuity, but use “Alexandria Property Cleanout” in visible copy, metadata, and schema.
