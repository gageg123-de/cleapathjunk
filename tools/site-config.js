const normalizeOrigin = (value) => String(value).replace(/\/+$/, "");

const normalizeBasePath = (value) => {
  const clean = String(value || "/").trim().replace(/^\/+|\/+$/g, "");
  return clean ? `/${clean}/` : "/";
};

const canonicalOrigin = normalizeOrigin(
  process.env.SITE_CANONICAL_ORIGIN || "https://clearpathjunkremoval.com",
);
const deploymentOrigin = normalizeOrigin(
  process.env.SITE_DEPLOYMENT_ORIGIN || "https://gageg123-de.github.io",
);
const basePath = normalizeBasePath(
  process.env.SITE_BASE_PATH || "/cleapathjunk/",
);

const canonicalUrl = (pathname = "/") =>
  `${canonicalOrigin}/${String(pathname).replace(/^\/+/, "")}`;

const deploymentUrl = (pathname = "") =>
  `${deploymentOrigin}${basePath}${String(pathname).replace(/^\/+/, "")}`;

const withBasePath = (html) =>
  html.replace(/\b(href|src)="\/(?!\/)/g, `$1="${basePath}`);

module.exports = {
  basePath,
  canonicalOrigin,
  canonicalUrl,
  deploymentOrigin,
  deploymentUrl,
  normalizeBasePath,
  withBasePath,
};
