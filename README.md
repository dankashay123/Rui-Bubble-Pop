# 🫧 Rui's Reef

A toddler-proof underwater play-and-learn app built for iPhone. Pop bubbles in the
open reef, or drop into short guided games for colors, shapes, and counting.

## Modes

- **Free Play** — tap to pop bubbles, swipe to spawn words along the path, watch
  creatures swim through
- **Colors** — pick the orb that matches the spoken/shown color
- **Shapes** — same, for shapes
- **Counting** — count the objects on screen and tap the answer

## Features

- Multi-touch bubble spawning — four fingers, four bubbles
- Animated water canvas with kelp, light shafts, and drifting swimmers
- Hand-drawn SVG icon set — no emoji anywhere in the app
- Mute toggle on every screen, remembered per device
- Milestone and celebration moments between rounds
- Pop counter and per-game score
- Full toddler-proofing: no zoom, no scroll, no context menus, no text selection
- Works offline via service worker

## Artwork

All icons are drawn in code by the `ART` module near the top of the game script.
Each one renders into a 100x100 box from a single base colour and has to work two
ways: tinted with a soft radial body fill for the counting bubbles and the reef
creatures, and as a flat white silhouette on the coloured orbs in Colors. Internal
detail (turtle plates, shell ridges, a flower's centre) goes through `D()`, which
returns a shade of the body when tinted and a translucent ink when flat — without
that, white-on-white detail disappears.

The confetti that flies out of a popped bubble is drawn from the same set.
`POP_BITS`, `TREASURE_BITS` and `WATER_BITS` each pair an icon key with the colour
it flies in; those shapes stay bold and simple so they still read at 30px in
motion. Milestone badges, the level-up toast, the pearl bubble's star and the RUI
crown come from the set too.

Adding an icon means adding one entry to `S` in that module and listing its key
wherever it should appear: `COLOR_ICONS`, `COUNTABLES`, `CREATURES`, `POP_BITS`,
`TREASURE_BITS`, `WATER_BITS` or `MS_ICON`.

## App icon

`icon-192.png` and `icon-512.png` are generated from a single square source. The
source artwork arrived with its rounded corners baked in as opaque black, which
would have shown as black wedges under the squircle mask iOS applies to home
screen icons. Both files are cropped 85px in from each edge of the 1254px
original, which clears the mask entirely and leaves the artwork full-bleed. If
you replace the icon, check the four corners are artwork and not black.

## Hosting

The app is served from GitHub Pages at:

```
https://dankashay123.github.io/Rui-Bubble-Pop/
```

Source: **Settings → Pages → Deploy from a branch → `main` / `/ (root)`**

Because the site lives in a subdirectory, `manifest.json` uses
`"start_url": "/Rui-Bubble-Pop/index.html"` and `sw.js` prefixes every entry in
`ASSETS` with `/Rui-Bubble-Pop/`. Keep both in sync if the repo is ever renamed.

## Add to iPhone Home Screen

1. Open the URL in **Safari** (must be Safari, not Chrome)
2. Tap the **Share** button
3. Tap **"Add to Home Screen"** → **Add**

Launches fullscreen with no browser UI.

## Performance notes

Free play holds 60fps with ~200 particles alive. Two things measured as
load-bearing, so be careful changing them:

- **No CSS `filter` on `.pcl`.** A `drop-shadow` there halved the frame rate
  (median 16.7ms to 33.3ms, p99 50ms to 100ms) because ~100 simultaneously
  animating elements repaint every frame. The same filter on 16 swimmers or one
  whale costs nothing measurable — it is the volume, not the filter, so the
  creatures keep their shadows.
- The water canvas repaints at 30Hz on purpose (`PAINT_MS`), and the whole
  rAF loop idles to ~30Hz when nothing is moving.

## Landscape

A phone held sideways hits `@media (orientation:landscape) and (max-height:560px)`,
which compresses the header and lays the quiz orbs out in a single row. Orb width
is `min(<percentage>, <vh>)` rather than a percentage with a `max-height`, because
`max-height` overrides `aspect-ratio` and renders the orbs as ellipses whenever
height is the tighter axis.

## Shipping an update

Bump `CACHE` in `sw.js` (currently `ruis-reef-v10`) whenever `index.html` changes.
The service worker is network-first, but the version bump is what clears stale
caches for anyone who already installed the app.
