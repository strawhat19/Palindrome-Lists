import { readFile, writeFile } from 'node:fs/promises';

const config = JSON.parse(await readFile(new URL(`../src/shared/site/config.json`, import.meta.url), `utf8`));
const url = new URL(config.url);
if (url.protocol !== `https:` || url.username || url.password || url.search || url.hash || url.pathname !== `/`) {
  throw new Error(`Site URL Must Be An HTTPS Origin`);
}
const origin = url.origin;
const paths = [`/`, `/about`, `/palindromes`, `/words`, `/names`, `/phrases`, `/api`, `/pricing`, `/contact`, `/terms`, `/privacy`, `/guidelines`];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join(`\n`)}\n</urlset>\n`;
const robots = `User-agent: *\nAllow: /\nDisallow: /_sitemap\n\nSitemap: ${origin}/sitemap.xml\n`;
await writeFile(new URL(`../public/sitemap.xml`, import.meta.url), sitemap);
await writeFile(new URL(`../public/robots.txt`, import.meta.url), robots);
