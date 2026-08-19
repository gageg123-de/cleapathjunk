const fs = require("fs");
const path = require("path");
const {
  basePath,
  canonicalOrigin,
  deploymentUrl,
} = require("./site-config");

const root = path.resolve(__dirname, "..");
const htmlFiles = [];
const errors = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".html")) htmlFiles.push(full);
  }
}

function localTarget(file, rawUrl) {
  const cleanUrl = rawUrl.split(/[?#]/)[0];
  if (!cleanUrl) return null;

  if (cleanUrl.startsWith("/")) {
    if (!cleanUrl.startsWith(basePath)) {
      errors.push(`${path.relative(root, file)}: path escapes deployment base ${rawUrl}`);
      return null;
    }
    const projectRelative = cleanUrl.slice(basePath.length);
    return path.join(root, projectRelative);
  }

  return path.resolve(path.dirname(file), cleanUrl);
}

function checkTarget(file, rawUrl) {
  if (/^(?:[a-z]+:|\/\/|#)/i.test(rawUrl)) return;
  let target = localTarget(file, rawUrl);
  if (!target) return;
  if (rawUrl.split(/[?#]/)[0].endsWith("/")) target = path.join(target, "index.html");
  if (!fs.existsSync(target)) {
    errors.push(`${path.relative(root, file)}: missing internal target ${rawUrl}`);
  }
}

walk(root);
const titles = new Map();
const descriptions = new Map();

for (const file of htmlFiles) {
  const relative = path.relative(root, file);
  const html = fs.readFileSync(file, "utf8");
  const title = html.match(/<title>(.*?)<\/title>/i)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/gi)];
  const h1s = [...html.matchAll(/<h1(?:\s[^>]*)?>/gi)];

  if (!title) errors.push(`${relative}: missing title`);
  if (!description) errors.push(`${relative}: missing meta description`);
  if (canonicals.length !== 1) errors.push(`${relative}: expected one canonical, found ${canonicals.length}`);
  if (canonicals[0] && !canonicals[0][1].startsWith(`${canonicalOrigin}/`)) {
    errors.push(`${relative}: canonical must use ${canonicalOrigin}`);
  }
  if (h1s.length !== 1) errors.push(`${relative}: expected one H1, found ${h1s.length}`);

  if (title) {
    if (titles.has(title)) errors.push(`${relative}: duplicate title with ${titles.get(title)}`);
    titles.set(title, relative);
  }
  if (description) {
    if (descriptions.has(description)) errors.push(`${relative}: duplicate description with ${descriptions.get(description)}`);
    descriptions.set(description, relative);
  }

  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      errors.push(`${relative}: invalid JSON-LD (${error.message})`);
    }
  }

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/gi)) {
    checkTarget(file, match[1]);
  }
}

const cssFile = path.join(root, "style.css");
const css = fs.readFileSync(cssFile, "utf8");
for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/gi)) {
  checkTarget(cssFile, match[1]);
}

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
for (const file of htmlFiles) {
  const relative = path.relative(root, file).replace(/\\/g, "/");
  const route = relative === "index.html" ? "/" : `/${relative.replace(/index\.html$/, "")}`;
  if (!sitemap.includes(`<loc>${canonicalOrigin}${route}</loc>`)) {
    errors.push(`${relative}: missing canonical URL from sitemap`);
  }
}

const robots = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
if (!robots.includes(`Allow: ${basePath}`)) errors.push("robots.txt: incorrect deployment allow path");
if (!robots.includes(`Sitemap: ${deploymentUrl("sitemap.xml")}`)) {
  errors.push("robots.txt: sitemap does not point to the deployed sitemap");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  `Validated ${htmlFiles.length} HTML pages for base path ${basePath}: metadata, canonicals, JSON-LD, CSS/JS/images, internal links, sitemap, and robots.txt.`,
);
