// sitemap.xml.ts: builds /sitemap.xml from the page list and the one site-URL setting. lastmod appears only where pages.ts sets it.
import type { APIRoute } from 'astro';
import { absoluteUrl, sitemapPages } from '../data/pages';

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('sitemap.xml: set `site` in astro.config.mjs.');
  const urls = sitemapPages.map((page) => {
    const lastmod = page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : '';
    return `<url><loc>${absoluteUrl(page.path, site)}</loc>${lastmod}</url>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
