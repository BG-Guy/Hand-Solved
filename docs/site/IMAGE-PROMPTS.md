# HandSolved image prompts

For later. No image is generated in this build and no layout waits on one (`PROJECT.md` "Hooks for later", `DESIGN.md` section 10). The slots are exactly `DESIGN.md`'s IMG-1 to IMG-6, nothing added. IMG-5 is three pictures, so there are 8 prompts. Written 2026-11-01 by `gemini-image-prompter`.

## Read this first: SVG is the better route for every slot

| Slot | Where | Better route | Why |
|---|---|---|---|
| IMG-1 Hall of Fame | `#highlights` tile | SVG from `svg-expert` | Flat shapes in two inks. Ships today as `icon-tile-fame` |
| IMG-2 Wall of Shame | `#highlights` tile | SVG | Same. Bricks are a repeat pattern |
| IMG-3 Tilt Tower | `#highlights` tile | SVG | Same. A card house is plain geometry |
| IMG-4 Monster Pots | `#highlights` tile | SVG | Same |
| IMG-5 crate in, crate out | `#data` Import and Export cards | SVG | `UX.md` 4.7 already asks for an inline-SVG illustration on each card |
| IMG-5 app on a phone | `#data` Use it as an app card | SVG, or a real capture in `PhoneFrame` | Same. `UX.md` 4.7 lists no device screens here today |
| IMG-6 404 | 404 page | SVG, reusing the face-down card `<symbol>` from `DESIGN.md` 7.2 | `UX.md` 5.4 asks for a small inline SVG, and the lattice back is already drawn |

- SVG gives `#12181B` and `#CE1A2C` exactly, in a few KB. A model gives close colours, stray shading and soft edges, so every image needs the clean-up in Checks.
- What Gemini adds is hand-cut print edges. Run these only if the owner wants that look beside the site's crisp SVG.
- Placement is open. `DESIGN.md` 9.3 gives the bento tile no art area (icon, name, description, note, rows). These prompts assume a 4:3 plate at the top of the tile with no text over it. Decide that before anyone runs IMG-1 to IMG-4.
- Not prompted, because `DESIGN.md` makes them SVG or real screens: hero plates, backgrounds, device frames, the mark, the card back, and the three `public/og/` social images (composed from real screens). `[REAL PHOTO NEEDED]`: none, since the site carries no photography.

## Settings

Checked 2026-11-01 against ai.google.dev/gemini-api/docs/image-generation and the model page for 2.1. Both loaded. They were read through a summarising fetch, so recheck before scripting an API call.

- Model for every prompt: Nano Banana 2.1, `gemini-nano-banana-2.1`. Confirmed on the pages: sizes 1K, 2K and 4K (1K default), up to 10 object and 4 character reference images, conversational editing. The pages also list `gemini-3-pro-image` (Nano Banana Pro) and `gemini-3.1-flash-lite-image` (Nano Banana 2 Lite).
- Size 1K: the largest slot is 800 px wide and 1K is the smallest size 2.1 offers. Through the API, `aspect_ratio` and `image_size` go in `response_format`, with an uppercase K ("1K"). The Gemini app has no settings, so the last line of each prompt sets the format. Either way, check the output's pixel size against the slot.
- **Not confirmed:** neither page lists the aspect ratios 2.1 accepts. Examples use 1:1, 5:4 and 16:9, and only the Lite model's list names 4:3. If 4:3 is refused, keep the "4:3 landscape format" line in the prompt and crop to 4:3 afterwards.
- If the look drifts between pictures, finish the set on Nano Banana Pro (`gemini-3-pro-image`) with image 1 attached. The page lists a style-reference allowance (3) for Pro only. Skip Nano Banana 2 Lite: it is 1K only and not for multi-turn edits.
- Save-as paths are proposals. `ARCHITECTURE.md` names no folder for raster art (screens go to `src/assets/screens/`, SVG to `src/assets/svg/`).

## Run order

Run IMG-1 first, because it sets the look. Approve it, then run every other prompt in the same chat, one picture per turn, with this line added at the end:

```text
Image 1 is the approved style reference. Match its inks, flat fills, line weight, and hand-cut edges exactly, and do not copy its subject.
```

## Shared style block

Pasted word for word into every prompt below. Change it in all eight or in none.

```text
A flat two-ink relief print on pale card stock, like a linocut. The paper is an even grey-white,
#F3F4F1, with no grain, border, or signature, and it runs edge to edge. Only two solid, perfectly
flat inks are used: a very dark blue-black, #12181B, and a bold playing-card red, #CE1A2C. Edges
are crisp and slightly hand-cut, with one line weight throughout. There is no shading, gradient,
glow, blur, shadow, gloss, or light direction. Red appears only as small accents, never as a shape
larger than a sixth of the picture's width or height. The mood is dry, exact, and a little witty.
The picture holds no text, letters, numbers, logos, people, faces, hands, casino chips, green, or
teal.
```

## IMG-1 · Hall of Fame tile

- Where: `#highlights`, Hall of Fame tile. Slot 640 x 480. Ships today as `icon-tile-fame`.
- Model: Nano Banana 2.1 · Ratio: 4:3 · Size: 1K · Save as: `src/assets/art/art-tile-fame.png` · Alt: decorative, `alt=""`

**Prompt**
```text
Illustration for the Hall of Fame tile on a poker hand-tracking website, aimed at live poker
players, where it stands for their best-played hands. A fan of five playing cards sits inside a
plain rectangular picture frame. The frame is a solid blue-black moulding with a thin pale inner
border, and it hangs by a short black cord from a single nail at the top. The cards fan out from
one point at the bottom centre, face up, and each shows one large suit symbol in the middle and
nothing else, never a king, queen, or jack: spades and clubs in blue-black, hearts and diamonds in
red. The frame carries no plaque, medal, ribbon, or star. It is centred, fills about two thirds of
the picture, and is seen straight on as a flat front view, with an even margin of bare paper on
all four sides so the tile's rounded corners cut nothing.
A flat two-ink relief print on pale card stock, like a linocut. The paper is an even grey-white,
#F3F4F1, with no grain, border, or signature, and it runs edge to edge. Only two solid, perfectly
flat inks are used: a very dark blue-black, #12181B, and a bold playing-card red, #CE1A2C. Edges
are crisp and slightly hand-cut, with one line weight throughout. There is no shading, gradient,
glow, blur, shadow, gloss, or light direction. Red appears only as small accents, never as a shape
larger than a sixth of the picture's width or height. The mood is dry, exact, and a little witty.
The picture holds no text, letters, numbers, logos, people, faces, hands, casino chips, green, or
teal.
4:3 landscape format.
```

## IMG-2 · Wall of Shame tile

- Where: `#highlights`, Wall of Shame tile. Slot 640 x 480. Ships today as `icon-tile-shame`.
- Model: Nano Banana 2.1 · Ratio: 4:3 · Size: 1K · Save as: `src/assets/art/art-tile-shame.png` · Alt: decorative, `alt=""`

**Prompt**
```text
Illustration for the Wall of Shame tile on a poker hand-tracking website, aimed at live poker
players, where it stands for their lowest-rated hands. Three playing cards are pinned to a plain
brick wall in a loose, slightly staggered row, each tilted a few degrees and held by one round red
pin at its top edge, like notices on a board. The cards are face up, and each shows one large suit
symbol in the middle and nothing else, never a king, queen, or jack, with spades and clubs in
blue-black and hearts and diamonds in red. Each card is filled with plain paper colour, so the
brick lines stop at its edge. The bricks are drawn only as thin blue-black outlines in neat
running-bond rows, never filled, so the wall stays pale and quiet. The group of cards is centred
and fills about two thirds of the width, and the brick pattern runs to every edge of the picture.
Seen straight on as a flat front view.
A flat two-ink relief print on pale card stock, like a linocut. The paper is an even grey-white,
#F3F4F1, with no grain, border, or signature, and it runs edge to edge. Only two solid, perfectly
flat inks are used: a very dark blue-black, #12181B, and a bold playing-card red, #CE1A2C. Edges
are crisp and slightly hand-cut, with one line weight throughout. There is no shading, gradient,
glow, blur, shadow, gloss, or light direction. Red appears only as small accents, never as a shape
larger than a sixth of the picture's width or height. The mood is dry, exact, and a little witty.
The picture holds no text, letters, numbers, logos, people, faces, hands, casino chips, green, or
teal.
4:3 landscape format.
```

## IMG-3 · Tilt Tower tile

- Where: `#highlights`, Tilt Tower tile. Slot 640 x 480. Ships today as `icon-tile-tilt`.
- Model: Nano Banana 2.1 · Ratio: 4:3 · Size: 1K · Save as: `src/assets/art/art-tile-tilt.png` · Alt: decorative, `alt=""`

**Prompt**
```text
Illustration for the Tilt Tower tile on a poker hand-tracking website, aimed at live poker
players, where it stands for the hands they were most tilted in. A house of cards three storeys
high, drawn in elevation as a flat front view: pairs of playing cards lean against each other in
inverted V shapes, with one card laid flat across each storey to carry the next. The ground floor
has three leaning pairs, the middle floor two, and the top floor one. The whole structure leans
about fifteen degrees to the right and looks ready to topple. Every card is shown from the back,
as a plain paper rectangle with rounded corners and a wide-spaced diagonal lattice of thin lines,
drawn in blue-black, except on the top pair, whose lattice lines are red. The house stands on one
short horizontal ground line, fills about four fifths of the picture's height, and leaves empty
paper at both sides.
A flat two-ink relief print on pale card stock, like a linocut. The paper is an even grey-white,
#F3F4F1, with no grain, border, or signature, and it runs edge to edge. Only two solid, perfectly
flat inks are used: a very dark blue-black, #12181B, and a bold playing-card red, #CE1A2C. Edges
are crisp and slightly hand-cut, with one line weight throughout. There is no shading, gradient,
glow, blur, shadow, gloss, or light direction. Red appears only as small accents, never as a shape
larger than a sixth of the picture's width or height. The mood is dry, exact, and a little witty.
The picture holds no text, letters, numbers, logos, people, faces, hands, casino chips, green, or
teal.
4:3 landscape format.
```

**If it comes back wrong.** Reads as a loose pile: `Using the provided image, rebuild the structure as a house of cards, with pairs of cards leaning against each other in inverted V shapes and one flat card across each storey. Keep the inks, line weight, and style exactly the same.`

## IMG-4 · Monster Pots tile

- Where: `#highlights`, Monster Pots tile. Slot 640 x 480. Ships today as `icon-tile-pots`.
- Model: Nano Banana 2.1 · Ratio: 4:3 · Size: 1K · Save as: `src/assets/art/art-tile-pots.png` · Alt: decorative, `alt=""`

**Prompt**
```text
Illustration for the Monster Pots tile on a poker hand-tracking website, aimed at live poker
players, where it stands for the biggest pots they have won. An enormous cooking pot, drawn as a
solid blue-black shape with a plain rim and two round looped handles, is stuffed so full that a
loose bundle of playing cards sticks out of the top like a stew, with three short curls of steam
rising above them. The cards are tiny next to the pot, so the pot looks gigantic, and each card
shows one large suit symbol and nothing else, never a king, queen, or jack: spades and clubs in
blue-black, hearts and diamonds in red. The pot holds playing cards only, never chips or coins. It
sits on one short horizontal ground line, is centred, fills about three quarters of the width, and
leaves a margin of bare paper on all four sides. Seen straight on as a flat front view.
A flat two-ink relief print on pale card stock, like a linocut. The paper is an even grey-white,
#F3F4F1, with no grain, border, or signature, and it runs edge to edge. Only two solid, perfectly
flat inks are used: a very dark blue-black, #12181B, and a bold playing-card red, #CE1A2C. Edges
are crisp and slightly hand-cut, with one line weight throughout. There is no shading, gradient,
glow, blur, shadow, gloss, or light direction. Red appears only as small accents, never as a shape
larger than a sixth of the picture's width or height. The mood is dry, exact, and a little witty.
The picture holds no text, letters, numbers, logos, people, faces, hands, casino chips, green, or
teal.
4:3 landscape format.
```

## IMG-5a · Data card, crate arriving (Import)

- Where: `#data`, Import card. Slot 480 x 480. Ships today as `icon-data-import`.
- Model: Nano Banana 2.1 · Ratio: 1:1 · Size: 1K · Save as: `src/assets/art/art-data-import.png` · Alt: decorative, `alt=""`

**Prompt**
```text
Illustration for the Import card in the Your data section of a poker hand-tracking website, which
explains that past sessions can be brought in from a backup file or a spreadsheet export. A plain
slatted crate, drawn as a front-on rectangle with three horizontal slats, a diagonal brace, and
one small red square on its side, is lowering into a wide, shallow, open-topped tray. The crate
hovers just above the tray's rim, with three short vertical motion lines above it showing that it
is dropping in. The tray is drawn as an outline with a solid blue-black base. The two objects are
centred, fill about two thirds of the picture together, and leave an even margin of bare paper on
all four sides. Nothing holds the crate: no hands, no crane, no person. Seen straight on as a flat
front view.
A flat two-ink relief print on pale card stock, like a linocut. The paper is an even grey-white,
#F3F4F1, with no grain, border, or signature, and it runs edge to edge. Only two solid, perfectly
flat inks are used: a very dark blue-black, #12181B, and a bold playing-card red, #CE1A2C. Edges
are crisp and slightly hand-cut, with one line weight throughout. There is no shading, gradient,
glow, blur, shadow, gloss, or light direction. Red appears only as small accents, never as a shape
larger than a sixth of the picture's width or height. The mood is dry, exact, and a little witty.
The picture holds no text, letters, numbers, logos, people, faces, hands, casino chips, green, or
teal.
Square 1:1 format.
```

## IMG-5b · Data card, crate leaving (Export)

- Where: `#data`, Export card. Slot 480 x 480. Ships today as `icon-data-export`.
- Model: Nano Banana 2.1 · Ratio: 1:1 · Size: 1K · Save as: `src/assets/art/art-data-export.png` · Alt: decorative, `alt=""`

**Prompt**
```text
Illustration for the Export card in the Your data section of a poker hand-tracking website, which
explains that a full backup, or spreadsheets of sessions and hands, can be saved and taken away. A
plain slatted crate, drawn as a front-on rectangle with three horizontal slats, a diagonal brace,
and one small red square on its side, is lifting up and out of a wide, shallow, open-topped tray.
The crate hovers well above the tray's rim, with three short vertical motion lines below it
showing that it is rising. The tray is drawn as an outline with a solid blue-black base. The two
objects are centred, fill about two thirds of the picture together, and leave an even margin of
bare paper on all four sides. Nothing holds the crate: no hands, no crane, no person. Seen
straight on as a flat front view.
A flat two-ink relief print on pale card stock, like a linocut. The paper is an even grey-white,
#F3F4F1, with no grain, border, or signature, and it runs edge to edge. Only two solid, perfectly
flat inks are used: a very dark blue-black, #12181B, and a bold playing-card red, #CE1A2C. Edges
are crisp and slightly hand-cut, with one line weight throughout. There is no shading, gradient,
glow, blur, shadow, gloss, or light direction. Red appears only as small accents, never as a shape
larger than a sixth of the picture's width or height. The mood is dry, exact, and a little witty.
The picture holds no text, letters, numbers, logos, people, faces, hands, casino chips, green, or
teal.
Square 1:1 format.
```

## IMG-5c · Data card, app on a phone (Use it as an app)

- Where: `#data`, Use it as an app card. Slot 480 x 480. Ships today as `icon-data-install`.
- Model: Nano Banana 2.1 · Ratio: 1:1 · Size: 1K · Save as: `src/assets/art/art-data-install.png` · Alt: decorative, `alt=""`
- The app is a plain red square, not a logo, so no second spade mark appears beside the real one (`DESIGN.md` 7.4). An SVG or a real capture would use the real mark.

**Prompt**
```text
Illustration for the Use it as an app card in the Your data section of a poker hand-tracking
website, which explains that the product installs from the browser onto a phone's home screen. A
generic smartphone seen straight on, drawn as a solid blue-black rounded rectangle with a pale
screen, no notch, no buttons, and no brand marks. The screen shows a neat grid of twelve small
rounded squares in four rows of three: eleven are thin blue-black outlines and one, in the second
row, is solid red, like a single red cell in a chart. The screen shows no store badge, button, or
label. The phone is centred and fills about three quarters of the picture's height, with at least
a tenth of the width free at each side. No hand holds it.
A flat two-ink relief print on pale card stock, like a linocut. The paper is an even grey-white,
#F3F4F1, with no grain, border, or signature, and it runs edge to edge. Only two solid, perfectly
flat inks are used: a very dark blue-black, #12181B, and a bold playing-card red, #CE1A2C. Edges
are crisp and slightly hand-cut, with one line weight throughout. There is no shading, gradient,
glow, blur, shadow, gloss, or light direction. Red appears only as small accents, never as a shape
larger than a sixth of the picture's width or height. The mood is dry, exact, and a little witty.
The picture holds no text, letters, numbers, logos, people, faces, hands, casino chips, green, or
teal.
Square 1:1 format.
```

## IMG-6 · 404 page

- Where: 404 page, in place of the three cards (`DESIGN.md` 9.12), which are what ships today. Slot 800 x 600.
- Model: Nano Banana 2.1 · Ratio: 4:3 · Size: 1K · Save as: `src/assets/art/art-404.png` · Alt: decorative, `alt=""`

**Prompt**
```text
Illustration for the page-not-found screen of a poker hand-tracking website, playing on the idea
of a hand that has folded. A single playing card has slipped off a plain four-legged table and
lies face down on the floor beneath it, tilted at a jaunty angle. The card is a plain paper
rectangle with a blue-black outline and a wide-spaced diagonal lattice of thin red lines on its
back. The table is a simple blue-black silhouette: a flat top, a thin apron under the top, and
four straight legs. Nothing stands on it, and it has no cloth, felt, or chips, so it reads as an
ordinary household table and not a poker table. The table fills the upper two thirds of the
picture, the fallen card sits clearly visible between the legs, and one short horizontal floor
line runs beneath them. Everything is centred with an even margin of bare paper on all four sides.
Seen straight on as a flat front view.
A flat two-ink relief print on pale card stock, like a linocut. The paper is an even grey-white,
#F3F4F1, with no grain, border, or signature, and it runs edge to edge. Only two solid, perfectly
flat inks are used: a very dark blue-black, #12181B, and a bold playing-card red, #CE1A2C. Edges
are crisp and slightly hand-cut, with one line weight throughout. There is no shading, gradient,
glow, blur, shadow, gloss, or light direction. Red appears only as small accents, never as a shape
larger than a sixth of the picture's width or height. The mood is dry, exact, and a little witty.
The picture holds no text, letters, numbers, logos, people, faces, hands, casino chips, green, or
teal.
4:3 landscape format.
```

**If it comes back wrong.** Reads as a poker table: `Using the provided image, change the table to a plain household table with a bare top and four straight legs, with no felt, no rail, and nothing on top. Keep the card, the inks, and the style exactly the same.`

## Fixes that apply to any prompt

Edit in the same chat instead of re-rolling. Each line is pasteable as is.

- Shading, gradient, paper texture, or off-palette colour: `Using the provided image, flatten every shape to one solid tone, using only #12181B and #CE1A2C on #F3F4F1. Remove all shading, gradients, shadows, and paper texture. Keep everything else exactly the same, preserving the original style and composition.`
- Stray letters, numbers, or signature: `Using the provided image, remove every letter, number, and text-like mark. Keep everything else exactly the same, preserving the original style and composition.`
- Too much red: `Using the provided image, change every red shape larger than a small pip or pin head to blue-black #12181B, or to a plain outline. Keep everything else exactly the same, preserving the original style and composition.`
- Chips, coins, hands, people, or faces: `Using the provided image, remove any chips, coins, hands, people, and faces, and fill the space with plain paper colour. Keep everything else exactly the same, preserving the original style and composition.`
- Subject too close to an edge: `Using the provided image, scale the whole picture down by 15 percent and centre it, filling the new margin with plain #F3F4F1 paper. Keep everything else exactly the same.`

## Checks before any image ships

A person reviews every image. Look for:

1. **Colour.** Flatten to three colours (paper `#F3F4F1`, ink `#12181B`, red `#CE1A2C`) in an image editor and save as a palette PNG or lossless WebP. Model output is never exactly on the hex, so the paper would show as a faint box on the page or on the Face White tile (`DESIGN.md` 9.3), and JPEG or lossy AVIF add off-palette fringes. If it will not hold three colours, give it to `svg-expert` to redraw.
2. **Banned content** (guards in `DESIGN.md` section 1). Any green or teal (guard 7), gradient or shading (guard 4), a red shape wider or taller than a sixth of the picture (guard 2: `#highlights` and the 404 have no large red thing), letters or numbers on cards, and faces, hands, chips, or king, queen, and jack cards (guard 10).
3. **Pips.** Clean, correct suit shapes, with spades and clubs black and hearts and diamonds red (`DESIGN.md` 7.5).
4. **Physical sense.** The pot's handles attach to it, the table has four legs, the bricks run in rows, the card house stands on pairs of cards.
5. **Tile ground.** Bento tiles are Face White (`#FCFCFA`), so art on `#F3F4F1` reads as a printed plate. Round its corners with `--radius-md`, or re-run the whole set on `#FCFCFA`.
6. **Markup.** Add none until a file exists (`DESIGN.md`: no empty slot markup). Then: `alt=""`, lazy, `aspect-ratio` reserved, never above the fold. All eight pictures are decorative, because the tile or card text already says what they show.
