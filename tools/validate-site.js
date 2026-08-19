const fs = require("fs");
const path = require("path");
const {
  basePath,
  canonicalOrigin,
  canonicalUrl,
} = require("./site-config");
const { publicRoutes } = require("./public-routes");

const root = path.resolve(__dirname, "..");
const errors = [];
const htmlFiles = [];
const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Chicago",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const publicRouteSet = new Set(publicRoutes.map(({ pathname }) => pathname));
const expectedFiles = new Map(
  publicRoutes.map(({ pathname }) => [
    pathname === "/" ? "index.html" : `${pathname.slice(1)}index.html`,
    pathname,
  ]),
);

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".html")) htmlFiles.push(full);
  }
}

function relative(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function localTarget(file, rawUrl) {
  const cleanUrl = rawUrl.split(/[?#]/)[0];
  if (!cleanUrl || /^(?:[a-z]+:|\/\/|#)/i.test(rawUrl)) return null;

  let target;
  if (cleanUrl.startsWith("/")) {
    if (!cleanUrl.startsWith(basePath)) {
      errors.push(`${relative(file)}: path escapes deployment base ${rawUrl}`);
      return null;
    }
    target = path.join(root, cleanUrl.slice(basePath.length));
  } else {
    target = path.resolve(path.dirname(file), cleanUrl);
  }

  if (cleanUrl.endsWith("/")) target = path.join(target, "index.html");
  return target;
}

function checkTarget(file, rawUrl) {
  const target = localTarget(file, rawUrl);
  if (!target) return null;
  if (!fs.existsSync(target)) {
    errors.push(`${relative(file)}: missing internal target ${rawUrl}`);
    return null;
  }
  return target;
}

function routeForFile(file) {
  const rel = relative(file);
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return `/${rel.replace(/index\.html$/, "")}`;
  return null;
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`, "i"))?.[1];
}

function metaContent(html, kind, key) {
  const tag = html.match(new RegExp(`<meta[^>]+${kind}="${key}"[^>]*>`, "i"))?.[0];
  return tag ? attribute(tag, "content") : undefined;
}

walk(root);

const titles = new Map();
const descriptions = new Map();
const canonicals = new Map();
const incoming = new Map(publicRoutes.map(({ pathname }) => [pathname, new Set()]));

for (const file of htmlFiles) {
  const rel = relative(file);
  const html = fs.readFileSync(file, "utf8");
  if (html.includes("gageg123-de.github.io") || html.includes("/cleapathjunk/")) {
    errors.push(`${rel}: legacy GitHub Pages production reference`);
  }
  if (/(?:href|src)="\/\/(?!\/)/i.test(html)) {
    errors.push(`${rel}: protocol-relative path found where a root path is expected`);
  }
  const route = expectedFiles.get(rel);
  const is404 = rel === "404.html";

  if (!route && !is404) {
    errors.push(`${rel}: unexpected HTML file; declare it public or mark it deliberately non-indexable`);
    continue;
  }

  if (!/<html\s+lang="en">/i.test(html)) errors.push(`${rel}: missing html lang="en"`);
  if (!/<meta\s+charset="utf-8">/i.test(html)) errors.push(`${rel}: missing UTF-8 charset`);
  if (!/<meta\s+name="viewport"\s+content="width=device-width,\s*initial-scale=1">/i.test(html)) {
    errors.push(`${rel}: missing standard responsive viewport`);
  }

  const title = html.match(/<title>(.*?)<\/title>/i)?.[1];
  const description = metaContent(html, "name", "description");
  const robots = metaContent(html, "name", "robots");
  const canonicalMatches = [...html.matchAll(/<link\s+rel="canonical"\s+href="([^"]+)"/gi)];
  const h1s = [...html.matchAll(/<h1(?:\s[^>]*)?>/gi)];

  if (!title) errors.push(`${rel}: missing title`);
  else {
    if (title.length < 15 || title.length > 70) errors.push(`${rel}: title length ${title.length} is outside 15-70 characters`);
    if (titles.has(title)) errors.push(`${rel}: duplicate title with ${titles.get(title)}`);
    titles.set(title, rel);
  }

  if (!description) errors.push(`${rel}: missing meta description`);
  else {
    if (description.length < 70 || description.length > 180) errors.push(`${rel}: description length ${description.length} is outside 70-180 characters`);
    if (descriptions.has(description)) errors.push(`${rel}: duplicate description with ${descriptions.get(description)}`);
    descriptions.set(description, rel);
  }

  if (h1s.length !== 1) errors.push(`${rel}: expected one H1, found ${h1s.length}`);
  const headingLevels = [...html.matchAll(/<h([1-6])(?:\s[^>]*)?>/gi)].map((match) => Number(match[1]));
  for (let index = 1; index < headingLevels.length; index += 1) {
    if (headingLevels[index] > headingLevels[index - 1] + 1) {
      errors.push(`${rel}: heading level jumps from H${headingLevels[index - 1]} to H${headingLevels[index]}`);
    }
  }

  if (is404) {
    if (!robots?.includes("noindex") || !robots?.includes("follow")) errors.push("404.html: expected noindex, follow");
    if (canonicalMatches.length) errors.push("404.html: must not publish a canonical URL");
  } else {
    if (!robots?.includes("index") || !robots?.includes("follow") || robots.includes("noindex")) {
      errors.push(`${rel}: expected index, follow robots directive`);
    }
    if (canonicalMatches.length !== 1) errors.push(`${rel}: expected one canonical, found ${canonicalMatches.length}`);
    const expectedCanonical = canonicalUrl(route);
    if (canonicalMatches[0]?.[1] !== expectedCanonical) {
      errors.push(`${rel}: canonical should be ${expectedCanonical}`);
    }
    if (canonicals.has(expectedCanonical)) errors.push(`${rel}: duplicate canonical with ${canonicals.get(expectedCanonical)}`);
    canonicals.set(expectedCanonical, rel);
  }

  const socialUrl = is404 ? undefined : canonicalUrl(route);
  for (const property of ["og:title", "og:description", "og:type", "og:url", "og:image", "og:image:alt", "og:site_name"]) {
    if (!metaContent(html, "property", property)) errors.push(`${rel}: missing ${property}`);
  }
  if (!is404 && metaContent(html, "property", "og:url") !== socialUrl) errors.push(`${rel}: og:url conflicts with canonical`);
  for (const name of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]) {
    if (!metaContent(html, "name", name)) errors.push(`${rel}: missing ${name}`);
  }
  if (metaContent(html, "name", "twitter:card") !== "summary_large_image") errors.push(`${rel}: twitter card must be summary_large_image`);

  if (!/<link\s+rel="icon"[^>]+href="[^"]+"/i.test(html)) errors.push(`${rel}: missing favicon declaration`);
  if (!/<link\s+rel="sitemap"[^>]+href="[^"]+"/i.test(html)) errors.push(`${rel}: missing sitemap discovery link`);
  if (!/<link\s+rel="alternate"[^>]+type="application\/rss\+xml"/i.test(html)) errors.push(`${rel}: missing RSS discovery link`);

  const schemaTypes = [];
  for (const match of html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(match[1]);
      schemaTypes.push(data["@type"]);
      if (["Review", "AggregateRating"].includes(data["@type"])) errors.push(`${rel}: prohibited unverified ${data["@type"]} schema`);
    } catch (error) {
      errors.push(`${rel}: invalid JSON-LD (${error.message})`);
    }
  }

  if (!is404) {
    if (!schemaTypes.includes("LocalBusiness")) errors.push(`${rel}: missing LocalBusiness schema`);
    if (route === "/" && !schemaTypes.includes("WebSite")) errors.push(`${rel}: missing WebSite schema`);
    if (route !== "/" && !schemaTypes.includes("BreadcrumbList")) errors.push(`${rel}: missing BreadcrumbList schema`);
    if (route.startsWith("/services/") && route !== "/services/" && !schemaTypes.includes("Service")) errors.push(`${rel}: missing Service schema`);
    if (route === "/blog/junk-removal-cost-alexandria-la/" && !schemaTypes.includes("BlogPosting")) errors.push(`${rel}: missing BlogPosting schema`);
    if (route === "/projects/alexandria-duplex-cleanout/" && !schemaTypes.includes("Article")) errors.push(`${rel}: missing Article schema`);
  }

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    if (!attribute(tag, "src")) errors.push(`${rel}: image missing src`);
    if (attribute(tag, "alt") === undefined) errors.push(`${rel}: image missing alt text`);
    if (!attribute(tag, "width") || !attribute(tag, "height")) errors.push(`${rel}: image missing intrinsic width/height`);
  }

  for (const match of html.matchAll(/(?:href|src|action)="([^"]+)"/gi)) checkTarget(file, match[1]);

  if (route) {
    for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/gi)) {
      const target = checkTarget(file, match[1]);
      if (!target) continue;
      const targetRoute = routeForFile(target);
      if (targetRoute && publicRouteSet.has(targetRoute) && targetRoute !== route) incoming.get(targetRoute).add(route);
    }
  }
}

for (const [rel, route] of expectedFiles) {
  if (!fs.existsSync(path.join(root, rel))) errors.push(`${route}: missing generated public page ${rel}`);
}
if (!fs.existsSync(path.join(root, "404.html"))) errors.push("missing 404.html");

for (const [route, sources] of incoming) {
  if (route !== "/" && sources.size === 0) errors.push(`${route}: orphaned public page with no internal links`);
}

const cssFile = path.join(root, "style.css");
const css = fs.readFileSync(cssFile, "utf8");
for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/gi)) checkTarget(cssFile, match[1]);

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
if (!sitemap.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) errors.push("sitemap.xml: invalid urlset namespace");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const sitemapLastmods = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((match) => match[1]);
if (new Set(sitemapUrls).size !== sitemapUrls.length) errors.push("sitemap.xml: duplicate URL");
if (sitemapUrls.length !== publicRoutes.length) errors.push(`sitemap.xml: expected ${publicRoutes.length} URLs, found ${sitemapUrls.length}`);
for (const { pathname, lastmod } of publicRoutes) {
  const url = canonicalUrl(pathname);
  if (!url.startsWith("https://")) errors.push(`sitemap.xml: non-HTTPS URL ${url}`);
  if (!sitemapUrls.includes(url)) errors.push(`sitemap.xml: missing ${url}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) errors.push(`sitemap.xml: invalid lastmod for ${url}`);
  if (lastmod > today) errors.push(`sitemap.xml: future lastmod for ${url}`);
}
if (sitemapUrls.some((url) => url.includes("404"))) errors.push("sitemap.xml: 404 page must be excluded");
if (sitemapLastmods.length !== publicRoutes.length) errors.push("sitemap.xml: every URL must have a maintainable lastmod");

const robots = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
if (!robots.includes("User-agent: *")) errors.push("robots.txt: missing general user-agent");
if (!robots.includes(`Allow: ${basePath}`)) errors.push("robots.txt: incorrect public allow path");
if (!robots.includes(`Disallow: ${basePath}tools/`)) errors.push("robots.txt: tools directory should be excluded");
if (!robots.includes(`Sitemap: ${canonicalUrl("sitemap.xml")}`)) errors.push("robots.txt: incorrect sitemap reference");
for (const publicPath of ["services/", "service-areas/", "projects/", "blog/", "assets/"]) {
  if (robots.includes(`Disallow: ${basePath}${publicPath}`)) errors.push(`robots.txt: blocks public path ${publicPath}`);
}

const feed = fs.readFileSync(path.join(root, "feed.xml"), "utf8");
if (!feed.includes('<rss version="2.0"')) errors.push("feed.xml: missing RSS 2.0 root");
const feedItems = [...feed.matchAll(/<item>[\s\S]*?<\/item>/g)];
if (feedItems.length !== 1) errors.push(`feed.xml: expected one published article, found ${feedItems.length}`);
if (!feed.includes(canonicalUrl("blog/junk-removal-cost-alexandria-la/"))) errors.push("feed.xml: published article is missing");

for (const [name, content] of [["sitemap.xml", sitemap], ["robots.txt", robots], ["feed.xml", feed]]) {
  if (content.includes("gageg123-de.github.io") || content.includes("/cleapathjunk/")) {
    errors.push(`${name}: legacy GitHub Pages production reference`);
  }
}

const cnamePath = path.join(root, "CNAME");
if (!fs.existsSync(cnamePath)) {
  errors.push("CNAME: missing GitHub Pages custom-domain configuration");
} else if (fs.readFileSync(cnamePath, "utf8").trim() !== "clearpathjunkla.com") {
  errors.push("CNAME: expected clearpathjunkla.com");
}

const gitignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
for (const requiredIgnore of ["bookkeeping/", ".env", ".env.*", "*.pem", "*.key", "*.p12"]) {
  if (!gitignore.split(/\r?\n/).includes(requiredIgnore)) errors.push(`.gitignore: missing private-file rule ${requiredIgnore}`);
}
for (const privatePath of [".env", ".env.local", "customer-records", "transactions.csv"]) {
  if (fs.existsSync(path.join(root, privatePath))) errors.push(`private path present in publish tree: ${privatePath}`);
}

if (canonicalOrigin === "https://clearpathjunkremoval.com") {
  errors.push("canonical configuration points to clearpathjunkremoval.com, which is not this Alexandria business");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${publicRoutes.length} indexable pages plus 404.html for ${basePath}.`);
console.log("Checks passed: crawlable links, orphans, metadata, canonicals, robots directives, Open Graph, Twitter cards, headings, image attributes, JSON-LD, sitemap, RSS, assets, and private-path exclusions.");
