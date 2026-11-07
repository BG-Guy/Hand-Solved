# HandSolved: technical SEO spec (T13)

For `frontend-builder` (T21, T23) and the T27 reviewer. Inputs: `research/seo-keywords.md` §3 to 8 (read as HandSolved; source links are in its §10), `PROJECT.md`, `UX.md` §1, 2, 4, 5, 9. `ARCHITECTURE.md` did not exist yet, so this assumes static per-page HTML and a build step. Where it names a path or setting it wins on the name; this file wins on the content. Final words belong to the web-copywriter (`COPY.md`); the texts here are recommended defaults and limits.

## 1. Decisions
1. Origin `https://handsolved.com` (apex, https) lives in the one site-URL setting; every absolute URL is built from it (this file shows the default). Paths are lowercase, hyphenated, no extension, no trailing slash except `/`, no query strings. Hashes are section anchors only and never appear in canonical, sitemap or schema.
2. All five pages are indexable with no robots directive. Only the 404 carries `noindex`. No `nosnippet`, `max-snippet` or `X-Robots-Tag` anywhere.
3. Structured data: `WebSite` + `Organization` on `/`, `BreadcrumbList` on the two product pages, nothing else (§4).
4. English only: `<html lang="en">`, no hreflang tag, no sitemap alternates. If a second language ever ships: self-referencing hreflang plus `x-default` directly after the canonical, mirrored in the sitemap.
5. `robots.txt` and `sitemap.xml` are generated at build from the page list and the site-URL setting, never hand-edited.
6. Nothing third-party: no analytics, preconnect, external font, image or script, and no verification tag (verify Search Console by DNS TXT record). No `llms.txt`, no AI-specific markup (§10).

## 2. Per-page values
Limits (UX 9.1): title at most 60 characters, description at most 155, both unique per page. The brand leads on home and trails elsewhere. A price, "free", "download", "sign up" or "solver" never appears in a title, description, social tag or schema. `og:title` equals `<title>`; `og:description` equals the meta description. In this table `\|` is a literal `|`.

| Page | Title (chars) | Description (chars) | Social image and art |
|---|---|---|---|
| `/` | `HandSolved: Live Poker Session Tracker & GTO Hand Coach` (55) | `Log live poker sessions, record every hand at the table, and see each decision graded against GTO. Texas Hold'em, heads-up and 3-way postflop.` (142) | `/og/home.png`: `phone-coach-score` frame with the Sample data chip, wordmark and H1 line, on the SVG table-rail backdrop |
| `/gto-hand-review` | `GTO Hand Review for Live Poker Hands \| HandSolved` (49) | `Record a hand and see how often GTO takes each option, what each is worth, plus pot odds and equity. Texas Hold'em, heads-up and 3-way postflop.` (144) | `/og/gto-hand-review.png`: `phone-coach-decision` (Call vs Fold bars) and the words "GTO hand review" |
| `/live-poker-hand-recorder` | `Live Poker Hand Recorder: Log Every Hand \| HandSolved` (53) | `Rebuild any hand on a poker table: seat the players, set stacks, pick cards, then answer each action street by street. All-ins and side pots handled.` (149) | `/og/live-poker-hand-recorder.png`: `phone-recorder` and the words "Live poker hand recorder" |
| `/privacy` | `Privacy Notice \| HandSolved` (27) | `HandSolved is a concept site. Nothing you type in its pop-ups is sent or stored. Read the plain-words privacy notice.` (117) | `/og/default.png`: wordmark and spade mark on the backdrop, no screenshot |
| `/terms` | `Terms of Use \| HandSolved` (25) | `HandSolved is a concept site. Prices are illustrative, nothing can be bought, and sample data is not real results.` (114) | `/og/default.png` |
| 404 | `Page Not Found \| HandSolved` (27) | none | none |

Social image: 1200x630 PNG (JPEG allowed; no WebP, AVIF or SVG, scraper support varies), at most 300 KB, fixed unhashed URL. Wordmark and key words stay inside the central 630x630 square (chat apps crop square), type at least 40 px, a "Sample data" chip on any app screen, HandSolved only, no price, no other brand. Art is the T17 captures (renamed copy) plus T15's backdrop and wordmark. `og:image:alt` describes the art in at most 125 characters, e.g. `HandSolved coach report on a phone for a sample hand, with its score and grade (sample data)`. The privacy description claims only "nothing you type is sent or stored" (PROJECT.md M5); the legal copy must also name what is kept in the browser (§12).

## 3. Head (every page)
```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, interactive-widget=resizes-content">
<title>{title}</title>
<meta name="description" content="{description}">
<link rel="canonical" href="{SITE}{path}">
<meta name="theme-color" content="{page surface color from tokens.css}">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/icon.svg" type="image/svg+xml" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta property="og:type" content="website">
<meta property="og:site_name" content="HandSolved">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{SITE}{path}">
<meta property="og:image" content="{SITE}/og/{name}.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{og alt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image:alt" content="{og alt}">
```
`{path}` for home is `/`. X falls back to the `og:` title, description and image, so only the card type and image alt repeat; no `twitter:site` or `twitter:creator` (no account exists, PROJECT.md Identity). Keep attribute quotes and this attribute order if the build minifies HTML, or the §11 greps fail. JSON-LD (§4) follows the social tags; preload, stylesheet and script tags follow that and belong to performance-optimizer (§9). The 404 emits only charset, viewport, `<title>`, `<meta name="robots" content="noindex">`, theme-color, the icon lines and the manifest: no description, canonical, social tags or JSON-LD.

## 4. JSON-LD
Each block sits in `<script type="application/ld+json">` in `<head>`, serialized minified on one line (the §11 greps expect `"@type":"WebSite"` with no spaces). Every value matches visible text or a real file. `{ONE_LINER}` is one copy token: `HandSolved is a live poker session tracker and hand recorder that grades each decision in your Texas Hold'em hands against GTO strategy.` (136 chars; the same words open the visible FAQ 1 answer). `/privacy`, `/terms` and the 404 carry no JSON-LD (no visible breadcrumb, so no markup).

Home `/` only:
```json
{"@context":"https://schema.org","@graph":[
{"@type":"WebSite","@id":"https://handsolved.com/#website","url":"https://handsolved.com/","name":"HandSolved","alternateName":"Hand Solved","description":"{ONE_LINER}","inLanguage":"en","publisher":{"@id":"https://handsolved.com/#organization"}},
{"@type":"Organization","@id":"https://handsolved.com/#organization","name":"HandSolved","url":"https://handsolved.com/","logo":{"@type":"ImageObject","url":"https://handsolved.com/icon-512.png","width":512,"height":512},"description":"{ONE_LINER}"}]}
```
`/gto-hand-review` (the visible breadcrumb reads `Home / GTO hand review`, the current page is not a link and has `aria-current="page"`). The recorder page uses name `Live poker hand recorder` and item `https://handsolved.com/live-poker-hand-recorder`:
```json
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
{"@type":"ListItem","position":1,"name":"Home","item":"https://handsolved.com/"},
{"@type":"ListItem","position":2,"name":"GTO hand review","item":"https://handsolved.com/gto-hand-review"}]}
```
- Kept: `WebSite` is the documented input for Google's site name, and `alternateName` covers the "Hand Solved" spelling split. `Organization` carries the logo and `publisher`; low value, no ranking effect claimed, no invented field (no `sameAs`, contact, address or founder), and the footer already names HandSolved as publisher. `BreadcrumbList` states the hierarchy and mirrors the visible trail.
- `FAQPage`: do not emit. Google ended the FAQ rich result on 2026-05-07 and removed its docs on 2026-06-15 (research §7). The visible `<details>` FAQ stays; its answer text in the HTML is what search and AI tools read.
- `WebApplication` / `SoftwareApplication`: do not emit. Google's software-app result needs `offers.price` plus `aggregateRating` or `review`. This site has an illustrative price, no collected reviews and (owner decision) no link to a running app, so the markup would assert an app and an offer that do not exist. Revisit only when a public app URL, a real price and real review data all exist.
- Never: `Product`, `Offer`, any price, `AggregateRating`, `Review`, `HowTo`, `Person`, `SearchAction`, any `potentialAction` (the sign-up is browser-only and sends nothing), `VideoObject`, `sameAs`, contact fields, or markup for content not on the page.

## 5. Heading outlines
One `<h1>` per page, no skipped levels. The H1 shares the primary phrase with the title but is not a copy. Nav, footer link groups and the footer wordmark are not headings; the closing-band H2 is the only footer heading. Headings inside `<dialog>` are `<h2>` or lower, never `<h1>`, and are outside outline checks. The 404 has one H1 (a light poker pun, UX 5.4) and no other heading.

| Page | H1 | H2 in order, H3 |
|---|---|---|
| `/` | One `<h1>`: kicker `Live poker session tracker and hand recorder`, a visually hidden period, then the outcome line (UX 4.1). Plain text contains "live poker session tracker" | 9 H2 with ids `#how #engine #highlights #numbers #toolbox #data #pricing #faq #start`. H3: Log, Coach, Practice; five highlight tiles; three toolbox panels; Import, Export, Use it as an app; one per plan; one per FAQ question. The `#engine` lead states what "solved" covers: 8-handed preflop charts at 14 stack depths, postflop streets heads-up or 3-way, Hold'em only |
| `/gto-hand-review` | Recommended `GTO hand review for the hands you play live` (43); contains "GTO hand review" | `#worked-example` (real spot, options in a `<table>`, same data as demo spot 1); How a decision is graded (H3: solve, compare, grade); What you see for each decision (H3 per tile); Limits; Questions about GTO hand review (4 H3); closing band |
| `/live-poker-hand-recorder` | Recommended `A live poker hand recorder built for the table` (46); contains "live poker hand recorder" | Recording a hand in three steps (H3: Record, Review, Coach); Details that matter at the table (H3 per tile); Your whole session, not just one hand; Questions about recording poker hands (4 H3); closing band |
| `/privacy`, `/terms` | `Privacy notice`, `Terms of use` | One H2 per clause, each with an `id` for the table of contents. "Last updated" is a real `<time datetime="YYYY-MM-DD">` |

## 6. Internal links
Real `<a href>` with root-relative paths, no script-only navigation, no outbound links (UX 0). Anchors are 2 to 6 words, describe the destination, differ by source, and are never "click here" or "learn more". CTA-DEMO is a `<button>`, so it is not a crawl path; the links below are.

| Target | Header and footer (all pages) | Body anchors (source: text) |
|---|---|---|
| `/gto-hand-review` | header `Coach`; footer `GTO hand review` | Home `#how` Coach step `See how a hand is graded`; `#engine` `How a decision is graded`; FAQ 3 `what the coach covers`. Recorder step 3 `How the coach grades it`; related `See how a hand is graded`. 404 `GTO hand review` |
| `/live-poker-hand-recorder` | header `Recorder`; footer `Live poker hand recorder` | Home `#how` Log step `Record a hand at the table`; FAQ 4 `entering a hand at the table`. Review Limits `how a hand is recorded`; related `Record a hand at the table`. 404 `Live poker hand recorder` |
| `/#pricing` | header `Pricing`; footer `Pricing` | Review and recorder related links `See pricing` |
| `/privacy`, `/terms` | footer Legal group | Home FAQ 7 `privacy notice`, `terms of use`; each links to the other; both end with `Back to home` to `/` |

The footer carries the exact phrases because the header labels are short by design (UX 2). Home links each product page at least twice inside `<main>` with different anchors. Every sitemap URL has a header or footer link and a body link (legal: footer plus FAQ 7). `/guides/how-to-review-poker-hands` is reserved: no link, no sitemap entry. If a page is cut for time, remove it in one change from the page list (so the sitemap), header, footer, body anchors, breadcrumbs and OG art; ship no placeholder.

## 7. Crawl files, redirects, 404
`/robots.txt` (generated, `text/plain`). No bot-specific rules: blocking training crawlers is the owner's licensing choice, not SEO, and the default is allow. A non-production build emits `Disallow: /` and no `Sitemap:` line instead, so a staging copy is never crawled; the §11 checks target the production build only.
```text
User-agent: *
Allow: /
Sitemap: https://handsolved.com/sitemap.xml
```
`/sitemap.xml` (generated from the page list). `lastmod` appears only on the two legal URLs, equal to their visible "Last updated" date; no `changefreq`, `priority`, images or alternates. The 404 and `/guides/...` are absent. Each `<loc>` equals that page's canonical byte for byte.
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://handsolved.com/</loc></url>
<url><loc>https://handsolved.com/gto-hand-review</loc></url>
<url><loc>https://handsolved.com/live-poker-hand-recorder</loc></url>
<url><loc>https://handsolved.com/privacy</loc><lastmod>YYYY-MM-DD</lastmod></url>
<url><loc>https://handsolved.com/terms</loc><lastmod>YYYY-MM-DD</lastmod></url>
</urlset>
```
Host config (T23 writes a file for the host ARCHITECTURE.md picks; nothing is deployed). Every redirect is one hop.

| Request | Response |
|---|---|
| `http://` on any host, or `www.` on any scheme | one 301 straight to `https://handsolved.com/<same path>` |
| `/index.html`, `/x.html`, `/x/` | one 301 to `/`, `/x`, `/x` (only if the host also serves those forms) |
| unknown path | the `404.html` body with status 404; never a redirect to `/`, never 200 |

404 page: root-absolute asset and link paths (it is served at any depth, so a relative path breaks its CSS); `noindex`; no canonical; links to `/`, `/gto-hand-review`, `/live-poker-hand-recorder`; same header and footer.

## 8. Images, icons, manifest
- Filenames: lowercase ASCII, hyphens, describe the content (`coach-decision-phone.avif`, `bankroll-chart-desktop.webp`). Never `IMG_`, `screenshot`, `final`, spaces, or the old product name. A content hash goes last. Social images, icons and the manifest keep fixed unhashed URLs.
- Alt: says what the screen shows in 8 to 20 words, no "image of", ends "(sample data)" on any app screen, numbers in the alt equal the numbers pictured (model sentence: UX 9.1 item 9), unique per page, no keyword stuffing. Decorative SVG: `alt=""` or `aria-hidden="true"`.
- Every `<img>` has `alt`, `width` and `height`. Only the LCP image has `fetchpriority="high"`; everything below the first screen has `loading="lazy" decoding="async"`.
- Icons (T15 draws, builder copies to the site root): `/favicon.ico` (16, 32, 48 px in one file), `/icon.svg`, `/apple-touch-icon.png` (180x180, opaque), `/icon-192.png`, `/icon-512.png` (opaque squares; the 512 is also the Organization logo). Google wants a crawlable, stable favicon URL in a multiple of 48 px or SVG; none of these is disallowed.
- `/site.webmanifest` only declares icons and colors. It is deliberately not installable (`display` browser, no service worker): "use it as an app" describes the product, not this site.
```json
{"name":"HandSolved","short_name":"HandSolved","start_url":"/","display":"browser","theme_color":"{surface}","background_color":"{surface}","icons":[{"src":"/icon-192.png","sizes":"192x192","type":"image/png"},{"src":"/icon-512.png","sizes":"512x512","type":"image/png"}]}
```

## 9. Performance that affects ranking
Core Web Vitals are one ranking input and a gate to pass, not a lever to chase (research §8.1). Targets are PROJECT.md's M5 marks at the 75th percentile: LCP 2.5 s, INP 200 ms, CLS 0.1 or better. No field data exists before traffic, so T27 uses Lighthouse mobile as the proxy: LCP at most 2.5 s, TBT at most 200 ms, CLS at most 0.1, SEO category 100 on a served production build (list any failure with its cause).

| Item | Target | Owner |
|---|---|---|
| LCP (H1 text on desktop, phone image on mobile) | measured on a first visit with the page-load veil, not only on repeats | performance-optimizer measures and fixes; animation-expert keeps the veil at 900 ms or less and self-removing |
| Hero image | AVIF or WebP, `<picture>` so phones fetch the phone only, `fetchpriority="high"`, explicit size, never lazy | performance-optimizer; grep in §11 |
| Fonts | self-hosted WOFF2, subset, one preload (the LCP text face), `font-display`, metric-matched fallback | performance-optimizer |
| JS and INP | UX 9.3 budgets (core 25 KB gz, dialogs 40 KB gz); no content depends on it; click handlers under 50 ms; dialog code loads on first intent | performance-optimizer enforces; no-script view-source check in §11 |
| CLS | space reserved for every image, chart, counter and dialog host; transform and opacity animation only | frontend-builder builds, performance-optimizer verifies |
| Compression, cache | Brotli or gzip on text; hashed assets immutable; HTML revalidated | host config (T23) |
| Interstitials | no dialog opens without a user action; none has `open` in the HTML | frontend-builder; grep in §11 |

## 10. AI search citations (research §8.5)
Documented: Google's generative features use the same index and ranking systems and ask for nothing extra; a page must be indexed and snippet-eligible to be cited. OpenAI and Anthropic each run a search bot separate from their training bot; Perplexity's listing bot is PerplexityBot. The rest is judgment, kept because it is cheap.
1. Eligibility: no `noindex`, `nosnippet` or `max-snippet:0` on the five pages; `robots.txt` allows all bots; the host and CDN do not block Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot or PerplexityBot (test in §11B).
2. Text, not pixels: every claim is HTML text; facts sit in real tables (the worked-example options, the 18-point bankroll data table, the grade legend).
3. Scope is worded the same everywhere: Hold'em only; heads-up or 3-way postflop; you enter hands; not an online HUD; preflop charts are 8-handed at 14 stack depths. It appears in the `#engine` lead, the review page Limits, FAQ 3 and FAQ 4, so a machine summary of "solved" stays inside what the product does.
4. Open each section with a plain answer sentence. Use `{ONE_LINER}` word for word in FAQ 1, `WebSite` and `Organization`.
5. A price never travels alone: it sits in `#pricing` beside "illustrative" and "concept site", and is in no title, description, social tag or schema. The footer concept note is real text in `<footer>` on all six pages.
6. Skip: `llms.txt`, AI-only schema, chunking, Markdown mirrors, FAQ markup, fake freshness (`lastmod` or dates without a real change). Independent mentions are the one lever the site cannot build and none is promised. After launch measure with Search Console's generative AI report (impressions only) and quarterly logged-out checks.

## 11. Review checklist (T27)
### 11A. Built files
Severity: Critical = checks 2 to 5 and all of 11B; High = 1, 6, 7; Medium = the rest. Run from the production build output in bash or zsh; `S` is the site-URL setting.
```bash
S=https://handsolved.com; pages(){ find . -name '*.html' ! -name 404.html; }; flat(){ tr '\n' ' ' < "$1"; }
# 1 counts of h1, title, description, canonical: all 1. Then title <= 60 and description <= 155
pages | while read -r f; do echo "$f $(flat "$f"|grep -o '<h1[ >]'|wc -l) $(flat "$f"|grep -o '<title>'|wc -l) $(flat "$f"|grep -o 'name="description"'|wc -l) $(flat "$f"|grep -o 'rel="canonical"'|wc -l)"; done
pages | while read -r f; do t=$(flat "$f"|grep -oE '<title>[^<]*'|sed 's/<title>//;s/&amp;/\&/g'); d=$(flat "$f"|grep -oE 'name="description" content="[^"]*'|sed 's/.*content="//;s/&amp;/\&/g'); echo "${#t} ${#d} $f"; done
# 2 canonical set equals sitemap set: prints canonical=sitemap
diff <(pages | while read -r f; do flat "$f"|grep -oE '<link rel="canonical" href="[^"]+"'|sed -E 's/.*href="//;s/"$//'; done|sort) <(grep -oE '<loc>[^<]+' sitemap.xml|sed 's/<loc>//'|sort) && echo canonical=sitemap
# 3 only ./404.html may match the first; the second prints nothing
grep -rlE 'noindex|nosnippet|max-snippet' --include='*.html' --include='*.xml' --include='*.txt' .; grep -rl 'hreflang' .
# 4 nothing leaves the site, and no old name in content or file names: all print nothing
grep -rhoE '(src|href|action)="https?://[^"]+"' --include='*.html' . | grep -v "=\"$S"; grep -rnE "url\(['\" ]*https?:|@import" --include='*.css' --include='*.html' .
grep -rliE 'gtag|googletagmanager|google-analytics|plausible|fbq\(|hotjar|mixpanel|posthog|sentry|rel="(preconnect|dns-prefetch)"' --include='*.html' --include='*.js' .
grep -rliaE 'poker[-_ ]?wiz|onrender' .; find . \( -iname '*wiz*' -o -iname 'IMG_*' -o -iname '*screenshot*' -o -iname '*final*' -o -name '* *' \)
# 5 every root-relative href and src resolves to a built file: prints nothing
grep -rhoE '(href|src)="/[^"#?]*' --include='*.html' . | sed -E 's/^(href|src)="//' | sort -u | while read -r p; do [ "$p" = / ] || [ -e ".$p" ] || [ -e ".$p.html" ] || [ -e ".$p/index.html" ] || echo "BROKEN $p"; done
# 6 JSON-LD parses; types are home [WebSite, Organization], product pages [BreadcrumbList], legal none. Second grep prints nothing
pages | while read -r f; do echo "== $f"; flat "$f"|grep -oE '<script type="application/ld\+json">[^<]*</script>'|sed -E 's/<[^>]+>//g'|python3 -c 'import sys,json;[print([n["@type"] for n in j.get("@graph",[j])]) for j in map(json.loads,sys.stdin)]'; done
grep -rlE '"@type":"(FAQPage|Question|WebApplication|SoftwareApplication|Product|Offer|HowTo|Person|Review|AggregateRating)"|"(offers|price|aggregateRating|sameAs|contactPoint|email)":' --include='*.html' .
# 7 images lacking alt, width or height, and any dialog open at load: both print nothing
grep -rhoE '<img [^>]*>' --include='*.html' . | awk '!/ alt="/||!/ width="[0-9]+"/||!/ height="[0-9]+"/'; grep -rlE '<dialog[^>]* open' --include='*.html' .
# 8 social images 1200x630 and <= 300 KB; icon sizes; manifest parses; concept note on every page (last grep prints nothing)
file og/*.png | grep -v '1200 x 630'; find og -size +300k; file favicon.ico apple-touch-icon.png icon-192.png icon-512.png; python3 -m json.tool site.webmanifest >/dev/null && echo manifest-ok; grep -rL 'Concept site' --include='*.html' .
# 9 inbound links: each target is linked from at least 5 files
for s in gto-hand-review live-poker-hand-recorder privacy terms; do echo "$s $(grep -rlE "href=\"/$s\"" --include='*.html' . | wc -l)"; done
```
Exact strings. On all five pages: `<html lang="en">`, `<link rel="canonical" href="https://handsolved.com`, `<meta property="og:site_name" content="HandSolved">`, `<meta property="og:image:width" content="1200">`, `<meta property="og:image:height" content="630">`, `<meta name="twitter:card" content="summary_large_image">`, `<link rel="manifest" href="/site.webmanifest">`, `<link rel="icon" href="/favicon.ico" sizes="48x48">`, `interactive-widget=resizes-content`. Home only: `"@type":"WebSite"`, `"alternateName":"Hand Solved"`, `"@type":"Organization"`, exactly one `fetchpriority="high"` on an `<img>` without `loading="lazy"`, and an H1 containing "live poker session tracker" (`flat index.html | grep -oiE '<h1.*</h1>' | grep -ci 'live poker session tracker'` prints 1). Product pages: `"@type":"BreadcrumbList"`, a breadcrumb with `aria-current="page"` whose text equals the schema names, and an H1 containing "GTO hand review" or "live poker hand recorder". 404 only: `<meta name="robots" content="noindex">`. Absent everywhere: `hreflang`, `twitter:site`, `google-site-verification`, `llms`, `FAQPage`, `WebApplication`, `SoftwareApplication`. By eye: with scripts off, view-source shows every heading, paragraph, FAQ answer, link and alt; share previews show the right art and no old name; each hero alt matches its screen.

### 11B. Live host (go-live only; blocked until handsolved.com is bought and DNS is set, PROJECT.md R8)
```bash
for u in http://handsolved.com/ http://www.handsolved.com/ https://www.handsolved.com/ https://handsolved.com/index.html https://handsolved.com/gto-hand-review/; do curl -s -o /dev/null -L -w "%{http_code} hops=%{num_redirects} %{url_effective}\n" "$u"; done  # 200, hops=1, canonical form
curl -s -o /dev/null -w '%{http_code}\n' https://handsolved.com/not-a-page      # 404
curl -sI https://handsolved.com/ | grep -i x-robots-tag                           # nothing
for ua in Googlebot Bingbot OAI-SearchBot Claude-SearchBot PerplexityBot; do curl -s -o /dev/null -A "$ua" -w "$ua %{http_code}\n" https://handsolved.com/; done   # all 200
```
Then: verify a Domain property by DNS TXT, submit `sitemap.xml`, run the URL Inspection live test on `/`, confirm "Search generative AI" is on (the default), validate the home JSON-LD in the Schema Markup Validator and the Rich Results Test, run Lighthouse mobile on `/` and `/gto-hand-review`, and open one share preview in a chat app.

## 12. Conflicts and open items
1. UX 9.3 QA says zero `href` beginning with `http`. Canonical, `og:*`, sitemap and JSON-LD need absolute URLs. Use check 4 above instead: no URL to any origin but the site's own.
2. PROJECT.md "Pages (v1)" lists Home, Features and 404 and drops Privacy; UX.md and this brief use two product pages plus `/privacy` and `/terms`, and this spec follows UX.md. TASKS.md T21 lists static `public/robots.txt` and `public/sitemap.xml`; this spec generates both so the domain lives in one setting (output paths unchanged).
3. UX 4 (veil) uses session storage and the BB/$ choice uses local storage, but UX 5.3's privacy summary names only the BB/$ choice. The legal copy must list both.
4. Owner inputs still open: buying handsolved.com (R8), a contact line or a "none" statement and what the host logs (UX 10; no contact appears in schema), and the training-crawler policy (default allow).
