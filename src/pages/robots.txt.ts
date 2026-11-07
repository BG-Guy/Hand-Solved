// robots.txt.ts: builds /robots.txt from the one site-URL setting. Any build that is not production blocks all crawlers.
import type { APIRoute } from 'astro';
import { absoluteUrl } from '../data/pages';

const text = (body: string) => new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('robots.txt: set `site` in astro.config.mjs.');
  // `astro build` runs in production mode; the dev server and `--mode staging` builds never invite crawlers.
  if (import.meta.env.MODE !== 'production') return text('User-agent: *\nDisallow: /\n');
  return text(`User-agent: *\nAllow: /\nSitemap: ${absoluteUrl('/sitemap.xml', site)}\n`);
};
