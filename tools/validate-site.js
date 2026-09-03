const fs = require("fs");
const path = require("path");
const {
  basePath,
  canonicalOrigin,
  canonicalUrl,
  clarityProjectId,
  googleAnalyticsId,
} = require("./site-config");
const { publicRoutes } = require("./public-routes");

const root = path.resolve(__dirname, "..");
const errors = [];
const htmlFiles = [];
const protectedInternalDirectories = [
  "content-deployment",
  "audits",
  "READ ME",
  "tools",
  "bookkeeping",
];
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

for (const { pathname } of publicRoutes) {
  const normalizedRoute = decodeURIComponent(pathname).replace(/^\/+/, "");
  const protectedDirectory = protectedInternalDirectories.find(
    (directory) => normalizedRoute === directory || normalizedRoute.startsWith(`${directory}/`),
  );
  if (protectedDirectory) {
    errors.push(`${pathname}: protected internal directory cannot enter the public route registry`);
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules", ...protectedInternalDirectories].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".html")) htmlFiles.push(full);
  }
}

function relative(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function localTarget(file, rawUrl) {
  let localUrl = rawUrl;
  if (/^(?:[a-z]+:|\/\/)/i.test(rawUrl)) {
    try {
      const parsed = new URL(rawUrl, canonicalOrigin);
      if (parsed.origin !== new URL(canonicalOrigin).origin) return null;
      localUrl = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
      return null;
    }
  }
  const encodedUrl = localUrl.split(/[?#]/)[0];
  let cleanUrl;
  try {
    cleanUrl = decodeURIComponent(encodedUrl);
  } catch {
    errors.push(`${relative(file)}: malformed encoded internal path ${rawUrl}`);
    return null;
  }
  if (!cleanUrl || localUrl.startsWith("#")) return null;

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
  const targetRel = relative(target);
  const protectedDirectory = protectedInternalDirectories.find(
    (directory) => targetRel === directory || targetRel.startsWith(`${directory}/`),
  );
  if (protectedDirectory) {
    errors.push(`${relative(file)}: public reference enters protected internal directory ${rawUrl}`);
    return null;
  }
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
  if (/(?:href|action)="\/index\.html(?:[#?"])/i.test(html)) {
    errors.push(`${rel}: internal links must use the canonical homepage root instead of /index.html`);
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

  const clarityLoaders = [...html.matchAll(/https:\/\/www\.clarity\.ms\/tag\//g)];
  if (clarityLoaders.length !== 1) errors.push(`${rel}: expected one Microsoft Clarity loader, found ${clarityLoaders.length}`);
  const clarityIds = [...html.matchAll(new RegExp(clarityProjectId, "g"))];
  if (clarityIds.length !== 1) errors.push(`${rel}: expected the configured Clarity project ID exactly once`);
  const googleTagLoaders = [...html.matchAll(new RegExp(`https://www\\.googletagmanager\\.com/gtag/js\\?id=${googleAnalyticsId}`, "g"))];
  if (googleTagLoaders.length !== 1) errors.push(`${rel}: expected one configured Google Analytics loader`);
  if (!html.includes('gtag("consent","default"')) errors.push(`${rel}: missing default Google Consent Mode state`);
  if (!html.includes('analytics_storage:choice==="granted"?"granted":"denied"')) errors.push(`${rel}: analytics storage is not tied to the saved visitor choice`);
  if (!html.includes('window.clarity("consentv2"')) errors.push(`${rel}: missing Microsoft Clarity Consent V2 initialization`);
  if (!html.includes('ad_Storage:"denied"')) errors.push(`${rel}: Clarity advertising storage must default to denied`);
  for (const deniedType of ["ad_storage", "ad_user_data", "ad_personalization"]) {
    if (!html.includes(`${deniedType}:"denied"`)) errors.push(`${rel}: ${deniedType} must default to denied`);
  }
  if (!html.includes('id="analyticsConsent"') || !html.includes('data-open-consent')) {
    errors.push(`${rel}: missing analytics consent controls`);
  }
  if (!html.includes('href="/privacy/"')) errors.push(`${rel}: missing crawlable privacy link`);
  if (/data-clarity-unmask/i.test(html)) errors.push(`${rel}: Clarity unmasking is prohibited`);
  const estimateFormTag = html.match(/<form\b[^>]*id="estimateForm"[^>]*>/i)?.[0];
  if (estimateFormTag && !/data-clarity-mask="true"/i.test(estimateFormTag)) {
    errors.push(`${rel}: estimate form must remain explicitly masked for Clarity`);
  }

  if (route === "/privacy/") {
    for (const disclosure of ["Microsoft Clarity", "Google Analytics", "Formspree", "session replay", "Analytics storage is denied by default", "Privacy choices"]) {
      if (!html.includes(disclosure)) errors.push(`${rel}: privacy notice is missing ${disclosure}`);
    }
  }

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
    if (route.startsWith("/blog/") && route !== "/blog/" && !schemaTypes.includes("BlogPosting")) errors.push(`${rel}: missing BlogPosting schema`);
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
if (/\b(?:min|max)\(\s*100%\s*[-+]\s*\d/i.test(css)) {
  errors.push("style.css: percentage arithmetic inside min()/max() must use calc() so browsers do not discard the declaration");
}
if (/\.article-layout\{[^}]*\bwidth:100%/i.test(css)) {
  errors.push("style.css: article-layout must preserve the shared container gutter instead of overriding it with width:100%");
}
for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/gi)) checkTarget(cssFile, match[1]);

const scriptFile = path.join(root, "script.js");
const script = fs.readFileSync(scriptFile, "utf8");
if (!script.includes('gtag?.("consent", "update"')) errors.push("script.js: missing consent update behavior");
if (!script.includes('analytics_storage: analyticsStorage')) errors.push("script.js: analytics consent choice is not passed to Google Consent Mode");
if (!script.includes('clarity?.("consentv2"')) errors.push("script.js: analytics consent choice is not passed to Clarity Consent V2");
if (/clarity\s*\(\s*["'](?:identify|set)["']/i.test(script)) errors.push("script.js: Clarity identifiers or custom properties require a separate privacy review");

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
for (const url of sitemapUrls) {
  const pathname = decodeURIComponent(new URL(url).pathname).replace(/^\/+/, "");
  const protectedDirectory = protectedInternalDirectories.find(
    (directory) => pathname === directory || pathname.startsWith(`${directory}/`),
  );
  if (protectedDirectory) errors.push(`sitemap.xml: protected internal directory published in ${url}`);
}
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
const publishedArticlePaths = publicRoutes
  .map(({ pathname }) => pathname)
  .filter((pathname) => /^\/blog\/.+\/$/.test(pathname));
if (feedItems.length !== publishedArticlePaths.length) {
  errors.push(`feed.xml: expected ${publishedArticlePaths.length} published articles, found ${feedItems.length}`);
}
for (const pathname of publishedArticlePaths) {
  if (!feed.includes(canonicalUrl(pathname))) errors.push(`feed.xml: published article is missing ${pathname}`);
}

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

const jekyllConfig = fs.readFileSync(path.join(root, "_config.yml"), "utf8");
const jekyllExclusions = new Set(
  [...jekyllConfig.matchAll(/^\s*-\s+(.+?)\s*$/gm)].map((match) => match[1]),
);
for (const directory of protectedInternalDirectories) {
  if (!jekyllExclusions.has(directory)) {
    errors.push(`_config.yml: ${directory} must remain excluded from the public GitHub Pages build`);
  }
}

const auditDirectory = path.join(root, "audits");
for (const requiredAuditFile of ["README.md", "METHODOLOGY.md", "findings.schema.json"]) {
  if (!fs.existsSync(path.join(auditDirectory, requiredAuditFile))) {
    errors.push(`audits/${requiredAuditFile}: missing permanent audit-framework file`);
  }
}
try {
  JSON.parse(fs.readFileSync(path.join(auditDirectory, "findings.schema.json"), "utf8"));
} catch (error) {
  errors.push(`audits/findings.schema.json: invalid JSON (${error.message})`);
}

const auditSeverity = new Set(["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFORMATIONAL"]);
const auditPriority = new Set(["FIX NOW", "FIX SOON", "MONITOR", "LEAVE ALONE"]);
const auditStatus = new Set(["OPEN", "RESOLVED", "MONITORING", "ACCEPTED", "NOT APPLICABLE"]);
const auditJsonFiles = fs.existsSync(auditDirectory)
  ? fs.readdirSync(auditDirectory).filter((name) => /^site-audit-\d{4}-\d{2}-\d{2}(?:-[a-z0-9-]+)?\.json$/.test(name))
  : [];
if (!auditJsonFiles.length) errors.push("audits/: expected at least one dated machine-readable audit record");

for (const name of auditJsonFiles) {
  const file = path.join(auditDirectory, name);
  let record;
  try {
    record = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`audits/${name}: invalid JSON (${error.message})`);
    continue;
  }

  const date = name.match(/^site-audit-(\d{4}-\d{2}-\d{2})/)?.[1];
  if (record.schema_version !== 1) errors.push(`audits/${name}: expected schema_version 1`);
  if (record.audit_date !== date) errors.push(`audits/${name}: audit_date must match its filename`);
  if (record.production_origin !== canonicalOrigin) errors.push(`audits/${name}: production_origin must match the canonical origin`);
  if (!/^[0-9a-f]{40}$/.test(record.audited_commit || "")) errors.push(`audits/${name}: invalid audited_commit`);
  if (record.post_audit_commit !== null && !/^[0-9a-f]{40}$/.test(record.post_audit_commit || "")) {
    errors.push(`audits/${name}: invalid post_audit_commit`);
  }
  if (!Number.isInteger(record.public_route_count) || record.public_route_count < 0) {
    errors.push(`audits/${name}: public_route_count must be a non-negative integer`);
  }
  if (!Array.isArray(record.findings)) {
    errors.push(`audits/${name}: findings must be an array`);
    continue;
  }
  const reportName = name.replace(/\.json$/, ".md");
  if (!fs.existsSync(path.join(auditDirectory, reportName))) errors.push(`audits/${name}: missing matching ${reportName}`);

  const findingIds = new Set();
  for (const finding of record.findings) {
    const label = `audits/${name} ${finding?.id || "finding"}`;
    if (!finding?.id || findingIds.has(finding.id)) errors.push(`${label}: missing or duplicate id`);
    findingIds.add(finding?.id);
    if (finding.audit_date !== record.audit_date) errors.push(`${label}: audit_date must match the audit record`);
    if (!finding.category) errors.push(`${label}: missing category`);
    if (!auditSeverity.has(finding.severity)) errors.push(`${label}: invalid severity`);
    if (!auditPriority.has(finding.priority)) errors.push(`${label}: invalid priority`);
    if (!auditStatus.has(finding.status)) errors.push(`${label}: invalid lifecycle status`);
    if (!Array.isArray(finding.affected_pages) || !finding.affected_pages.length) errors.push(`${label}: affected_pages must be a non-empty array`);
    for (const field of ["issue", "evidence", "recommendation"]) if (!finding[field]) errors.push(`${label}: missing ${field}`);
    if (typeof finding.implemented !== "boolean") errors.push(`${label}: implemented must be boolean`);
    if (finding.implementation_commit !== null && !/^[0-9a-f]{40}$/.test(finding.implementation_commit || "")) {
      errors.push(`${label}: invalid implementation_commit`);
    }
    if (finding.implemented && !finding.implementation_commit) errors.push(`${label}: implemented finding must record implementation_commit`);
    if (!("regression_test" in finding)) errors.push(`${label}: missing regression_test field`);
    if (!("notes" in finding)) errors.push(`${label}: missing notes field`);
  }
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
