const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const htmlFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".html")) htmlFiles.push(full);
  }
}

walk(root);
const errors = [];
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
    try { JSON.parse(match[1]); } catch (error) { errors.push(`${relative}: invalid JSON-LD (${error.message})`); }
  }
  for (const match of html.matchAll(/(?:href|src)="(\/[^"]+)"/gi)) {
    const url = match[1].split(/[?#]/)[0];
    if (!url || url === "/") continue;
    let target = path.join(root, url.replace(/^\//, ""));
    if (url.endsWith("/")) target = path.join(target, "index.html");
    if (!fs.existsSync(target)) errors.push(`${relative}: missing internal target ${url}`);
  }
}

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
for (const file of htmlFiles) {
  const relative = path.relative(root, file).replace(/\\/g, "/");
  const route = relative === "index.html" ? "/" : `/${relative.replace(/index\.html$/, "")}`;
  if (!sitemap.includes(`<loc>https://clearpathjunkremoval.com${route}</loc>`)) errors.push(`${relative}: missing from sitemap`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Validated ${htmlFiles.length} HTML pages: unique metadata, one H1/canonical, valid JSON-LD, internal targets, and sitemap coverage.`);
