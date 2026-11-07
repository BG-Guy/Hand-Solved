// json-ld.ts: builds the only JSON-LD blocks SEO.md allows: WebSite + Organization on home, BreadcrumbList on product pages.
// Never add Offer, Product, SoftwareApplication, AggregateRating or FAQPage: prices are illustrative and nothing is for sale.
import { absoluteUrl, type Crumb, type PageEntry } from '../../data/pages';
import { oneLiner, siteName } from '../../data/site';

function homeGraph(site: URL) {
  const home = absoluteUrl('/', site);
  const website = absoluteUrl('/#website', site);
  const organization = absoluteUrl('/#organization', site);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': website,
        url: home,
        name: siteName,
        alternateName: 'Hand Solved',
        description: oneLiner,
        inLanguage: 'en',
        publisher: { '@id': organization },
      },
      {
        '@type': 'Organization',
        '@id': organization,
        name: siteName,
        url: home,
        logo: { '@type': 'ImageObject', url: absoluteUrl('/icon-512.png', site), width: 512, height: 512 },
        description: oneLiner,
      },
    ],
  };
}

function breadcrumbList(trail: readonly Crumb[], site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path, site),
    })),
  };
}

/** Minified on one line, with "<" escaped so the text can never close its script tag. */
function serialize(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** The JSON-LD text for a page, or undefined when the page prints none. */
export function jsonLdFor(page: PageEntry, site: URL): string | undefined {
  if (page.jsonLd === 'home') return serialize(homeGraph(site));
  if (page.jsonLd === 'breadcrumb' && page.breadcrumb) return serialize(breadcrumbList(page.breadcrumb, site));
  return undefined;
}
