# HandSolved SEO QA (T27): built `dist/` against `docs/site/SEO.md`

Audited 2026-11-01 by seo-specialist. Read-only: `dist/` was not rebuilt, no server was started, no source was changed.
The running preview at `http://127.0.0.1:4321` was used for GET requests only (status, content type, headers, 131 referenced paths).
Method: the SEO.md section 11A bash checks ran verbatim from inside `dist/`, then an HTML-parser audit repeated and extended them (headings, links, images, JSON-LD, breadcrumbs), then a crawl of every path the HTML, CSS and JS reference. I opened all four `og/*.png` files and read them.
Section 11B (live host) is not run: handsolved.com is not bought yet.

**Result: 24 pass, 4 fail, 1 not run. Critical 0, High 0, Medium 1, Low 4.** No indexing, canonical, robots, sitemap, link or structured-data blocker.

## Pass or fail

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Title: one per page, at most 60 characters, unique | PASS | 56 / 49 / 55 / 20 / 18 for home, review, recorder, privacy, terms. 404 is 27 |
| 2 | Meta description: one per page, at most 155, unique; none on the 404 | PASS | 142 / 144 / 149 / 138 / 137 |
| 3 | Title and description equal COPY.md | PASS | All 6 titles and 5 descriptions match the COPY.md SEO blocks. Only difference: the build prints a typographic apostrophe (Hold’em), COPY.md a straight one. Harmless |
| 4 | Canonical: absolute, `https://handsolved.com`, no trailing slash except `/`, no `.html`, self-referencing, set equals sitemap set | PASS | check 2 prints `canonical=sitemap`; 404 has none |
| 5 | Robots: only `404.html` has `noindex`; no `nosnippet`, `max-snippet`, `hreflang`, `X-Robots-Tag` | PASS | check 3 lists only `404.html`; live headers carry no `x-robots-tag` |
| 6 | Open Graph and Twitter tags | PASS | All 9 required `og:` tags, `twitter:card`, `twitter:image:alt` on 5 pages; `og:title` and `og:description` equal title and description; `og:url` equals canonical; no `twitter:site`; 404 has none |
| 7 | Social images: real files, 1200x630, PNG, at most 300 KB, art matches alt | PASS | home 34.8 KB, review 29.3, recorder 28.0, default 8.4. Viewed all four: right art, "Sample data" chip on each app screen, wordmark and key words inside the central 630 px square, no price, no other brand |
| 8 | Favicon, icons, manifest exist, are valid and load | PASS | ICO holds 16, 32, 48 px PNGs; `icon.svg` well-formed; apple-touch 180x180 opaque; icon-192 and icon-512 opaque; manifest parses, both icons exist, theme colour equals the meta; all served 200 with the right type |
| 9 | One H1 per page, matches COPY.md, carries the primary phrase | PASS | Home kicker holds "live poker session tracker"; review and recorder H1s hold "GTO hand review" and "live poker hand recorder" |
| 10 | Heading order | PASS | No skipped level on any page; dialog headings are H2 only; closing band is the only footer heading; 9 home H2 sections with ids `how engine highlights numbers toolbox data pricing faq start` all present; 404 has the H1 only |
| 11 | H1 reads correctly as plain text | **FAIL** | Finding 2 |
| 12 | JSON-LD parses; types per page; minified on one line | PASS | Home `WebSite` + `Organization`; review and recorder `BreadcrumbList`; privacy, terms, 404 none |
| 13 | Banned markup and words absent | PASS | No `Offer`, `Product`, `SoftwareApplication`, `WebApplication`, `AggregateRating`, `FAQPage`, `Review`, `HowTo`, `sameAs`, `potentialAction`; no price, "free", "download", "sign up" or "solver" in title, description, social tags or schema |
| 14 | Breadcrumb matches `BreadcrumbList` | PASS | `Home / GTO hand review` and `Home / Live poker hand recorder`; current page is a non-link `<span aria-current="page">`; names and item URLs equal the schema |
| 15 | JSON-LD values match visible text | **FAIL** | Finding 1 |
| 16 | `sitemap.xml` | PASS | 5 `<loc>` equal the 5 canonicals byte for byte; each returns 200; `lastmod` only on privacy and terms and equals the visible `<time datetime="2026-11-01">`; no changefreq, priority, 404 or `/guides/` |
| 17 | `robots.txt` | PASS | `User-agent: *`, `Allow: /`, absolute `Sitemap:` line, served `text/plain`; built in production mode |
| 18 | Internal links and anchors resolve | PASS | 0 broken among 44 root-relative targets and 131 crawled paths (pages, CSS, JS, fonts, 84 image variants all 200). Anchors resolve including `/#pricing`, `/#how`, `/#faq` and `/gto-hand-review#worked-example`. No `.html`, trailing-slash, relative or absolute-self hrefs; no `<a>` without `href` |
| 19 | Inbound links (check 9) and header plus footer link | PASS | Each inner page is linked from 6 files; header and footer link every product page on every page |
| 20 | Spec section 6 contextual body links | **FAIL** | Finding 3 |
| 21 | Nothing leaves the site; UX.md "zero `href` starting `http`" conflict | PASS | Check 4 clean: no `src`, `href` or `action` to another origin, no tracker, preconnect or old name (its one literal `find` hit is a script file name, see corrections item 2). Absolute self URLs appear only in canonical, `og:`, JSON-LD, sitemap and robots, so SEO.md check 4 replaces the UX rule as agreed |
| 22 | Images: `alt`, `width`, `height`; sizes true; LCP and lazy rules | PASS | 18 `<img>` (home 9, review 4, recorder 5; none on legal or 404), all with the three attributes. Sampled files are 780x1688 and 2240x1400, equal to the attributes. One `fetchpriority="high"` (home hero, eager); the other 17 are `loading="lazy" decoding="async"`. Inline SVGs are `aria-hidden` except the range chart (`role="img"` with a full description) |
| 23 | Alt text per spec (8 to 20 words, unique per page) | **FAIL** | Finding 4 |
| 24 | 404 page | PASS | Unknown paths return status 404 with the `404.html` body; `<meta name="robots" content="noindex">` only (no description, canonical, social, JSON-LD); root-absolute assets; links to `/`, `/gto-hand-review`, `/live-poker-hand-recorder`; one H1 "This page folded."; same header and footer |
| 25 | All copy in the static HTML with JS off | PASS | Headings, paragraphs, 7 FAQ answers (in `<details>`), tables (home bankroll, review worked example), alts and links are in the served bytes, which equal `dist/` byte for byte. Counters hold final values (14, 3, 100). 40 of 41 labelled COPY.md strings were found verbatim (the one miss is a table-row description, not prose). `html[data-js]` only gates script-only controls; a failed module reverts to the no-script layout |
| 26 | Copy revealed only by motion is still in the HTML | PASS | Hero H1 lines (`.line__in` rise), `[data-reveal]` blocks (CSS scroll-driven animation with an IntersectionObserver fallback), story scenes (`opacity:0` only under `html[data-js]`), counters and the load veil (no text, `aria-hidden` and `inert`): none is `display:none`, `hidden` or injected by script. Only the pop-up sample hands are built by script on first open (UX 9.3); the review page carries a worked example as an HTML table |
| 27 | Important text not only in images | PASS | Every screenshot has alt text and the same facts sit in HTML tiles or tables; charts are inline SVG with a text description; the OG images carry text but each has matching alt, title and description |
| 28 | No dialog open at load; concept note on every page | PASS | Checks 7 and 8 print nothing; all 6 files contain "Concept site" |
| 29 | Section 11B live host | NOT RUN | Blocked until the domain and DNS exist. See finding 5 for what to expect on GitHub Pages |

## Findings

```text
[MEDIUM] Home JSON-LD description is not on the page; FAQ 1 opens differently
Location: src/data/site.ts:9-10 (oneLiner, printed as the description of WebSite and Organization on https://handsolved.com/) against src/components/Faq/home-faq.ts:24 and the FAQ 1 answer in docs/site/COPY.md (view-source of / , section #faq)
Issue: SEO.md section 4 requires every JSON-LD value to match visible text, and section 10.4 requires the one-liner word for word in FAQ 1, WebSite and Organization. The home text contains no "grades each decision in your Texas Hold'em hands against GTO strategy" anywhere. FAQ 1 opens "HandSolved is a live poker session tracker, hand recorder and GTO coach in one web app." So the markup states a sentence readers cannot see, and the answer AI tools quote most (FAQ 1) leaves out the Hold'em scope. Nothing in Google depends on this property, so it is a parity defect, not a penalty risk. The builder already flagged it as open in src/data/site.ts:6-8.
Fix: Ruling: keep the one-liner, change FAQ 1. In COPY.md (FAQ 1) and src/components/Faq/home-faq.ts:24 replace the first sentence with the exact oneLiner string ("HandSolved is a live poker session tracker and hand recorder that grades each decision in your Texas Hold’em hands against GTO strategy."). web-copywriter then trims the rest of the answer so it does not repeat the "graded against GTO" clause. Re-check: grep -o 'grades each decision in your Texas Hold’em hands against GTO strategy' dist/index.html | wc -l prints 3 (two JSON-LD nodes plus FAQ 1).

[LOW] Home H1 words fuse when CSS is ignored
Location: src/sections/home/Hero.astro:44-46, rendered as <h1 class="hero__h1" id="hero-title"> on /
Issue: The three .line spans are printed back to back with no whitespace. With CSS (.line is display:block) it reads "Every hand / you play, / solved." As plain text (textContent, text-only crawlers, reader modes, tag-stripping scrapers and AI fetchers) the H1 is "Live poker session tracker and hand recorder. Every handyou play,solved." The primary phrase in the kicker is intact, so ranking is not affected; only the tagline is garbled in extraction.
Fix: Print a real space between the line spans inside the map, for example after the closing </span> of each line except the last: {index < lines.length - 1 && ' '}. Layout does not change because .line is a block. Re-check: tr -d '\n' < dist/index.html | grep -oE '<h1.*</h1>' | sed 's/<[^>]*>//g' prints "... recorder. Every hand you play, solved."

[LOW] Contextual body links from SEO.md section 6 are missing
Location: https://handsolved.com/ FAQ answers 3, 4 and 7 (src/components/Faq/home-faq.ts answers are plain strings; COPY.md FAQ), and https://handsolved.com/live-poker-hand-recorder (step 3 and related link)
Issue: Section 6 asks for FAQ 3 to link /gto-hand-review, FAQ 4 to link /live-poker-hand-recorder, FAQ 7 to link /privacy and /terms, and for home to link each product page at least twice inside <main> with different anchors. Built: home links the recorder once in <main> ("Record a hand at the table"); /privacy and /terms have no body link from home, only the footer link on every page and each other. The recorder page links /gto-hand-review twice with the same anchor "See how a hand is graded". No page is orphaned (every inner page is linked from 6 files), so impact is small.
Fix: web-copywriter adds the anchors in COPY.md: FAQ 3 "what the coach covers" to /gto-hand-review, FAQ 4 "entering a hand at the table" to /live-poker-hand-recorder, FAQ 7 "privacy notice" to /privacy and "terms of use" to /terms, plus a differently worded step 3 link on the recorder page ("How the coach grades it"). frontend-builder lets the home-faq.ts answers carry root-relative <a href> and renders them. Re-check: grep -c 'href="/privacy"' and 'href="/terms"' inside <main> of dist/index.html each print at least 1.

[LOW] Image alt text is longer than the spec and repeats on a page
Location: src/data/screens.ts (alt strings, from COPY.md screenshot alt table); rendered on /, /gto-hand-review and /live-poker-hand-recorder
Issue: Section 8 asks for 8 to 20 words, unique per page. The 18 alts run 33 to 64 words (the review phone is 64). The same image is used twice on a page with an identical alt: phone-coach-decision on /, phone-coach-score on /gto-hand-review, phone-recorder on /live-poker-hand-recorder. Screen readers read the whole alt each time. Nothing is wrong or missing and the numbers match the screens (checked against the OG art), so this is polish, not a ranking problem.
Fix: web-copywriter shortens each alt to 20 words or fewer (what the screen is, then the one figure that section is about; the rest is already in nearby HTML text) and gives the second use of the same image a different sentence about what that section shows, or alt="" if it is a pure repeat. Edit src/data/screens.ts to match. Re-check: every alt is 8 to 20 words and none repeats within a page.

[LOW] GitHub Pages cannot send the section 7 redirects for .html aliases (go-live note)
Location: host config .github/workflows/deploy-pages.yml, astro.config.mjs:19-21 (trailingSlash 'never', build.format 'file'); seen on the preview: /index.html, /gto-hand-review.html and /404.html return 200, /gto-hand-review/ returns the preview server's own stock 404
Issue: Section 7 asks for one-hop 301s from /x.html and /x/ to /x. GitHub Pages has no redirect rules, so /x.html will stay a 200 duplicate of /x. No page links to those forms (checks 5 and section 6 are clean) and every page has a self-canonical to the clean URL, so Google should consolidate them. The exposure is only third-party links that copy the .html form.
Fix: No code change now. At go-live (11B): set the custom domain to the apex and enable Enforce HTTPS in the Pages settings so http:// and www. redirect once; accept 200 plus canonical for /x.html and record that in SEO.md section 7 ("GitHub Pages: canonical only"). If Search Console later reports "Duplicate, Google chose different canonical" for .html URLs, move to a host with redirect rules.
```

## SEO.md corrections found by running it

These are errors in my own spec, not build defects.

1. Sections 4 and 5 say privacy and terms have "no visible breadcrumb". They do (`nav.breadcrumbs`, "Home / Privacy" and "Home / Terms") and carry no `BreadcrumbList`. Harmless because the markup is optional; amend section 4 to say legal breadcrumbs are deliberately unmarked.
2. Section 11A check 4, `find ... -iname '*screenshot*'`, prints `dist/_astro/Screenshot.astro_astro_type_script_index_0_lang.CjSC1Awz.js`. That is the component name in a script bundle file name, not an image or any indexed text. Limit the `screenshot`, `final` and `IMG_` tests to image extensions or add `! -path './_astro/*.js'`.
3. COPY.md still lists a 404 meta description (115 characters) and a length for it. SEO.md section 3 says the 404 has none and the build follows SEO.md, which is correct. Delete the 404 description from COPY.md so nobody adds it.
4. Section 2's title table still shows my defaults (`HandSolved: ...`, `Privacy Notice | ...`). The shipped titles are COPY.md's (pipe after the brand on home; `Live Poker Hand Recorder, Street by Street`; `Privacy`; `Terms`). Update the table to the shipped strings. Sections 6 and 8 should also take COPY.md's anchor wording, or the copywriter conforms (findings 3 and 4).

## Outside the SEO brief

At least 2.5 MB of PNG originals plus several SVGs in `dist/_astro/` (`desk-home`, `desk-highlights`, `desk-practice`, `phone-*.png`, `art-*.svg`, `bg-chart-hero-*.svg`, `chart-bb-vs-btn-100.svg`, `frame-*.svg`) are referenced by no HTML, CSS or JS file. They are not linked, so there is no crawl effect; they only add deploy size. For performance-optimizer.

## Not verified

Lighthouse and Core Web Vitals (performance-optimizer, T32), Schema Markup Validator and Rich Results Test (external tools, post-domain), a share preview in a real chat app, and the in-page screenshots against their alt text beyond the OG art and one numeric cross-check of the hero and decision alts.
