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
- Hand-drawn SVG icon set (no emoji on any tappable surface)
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

Adding an icon means adding one entry to `S` in that module and listing its key in
`COLOR_ICONS`, `COUNTABLES` or `CREATURES`. Emoji remain only in the decorative
particle bursts and confetti, where they read fine in motion at small size.

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

## Shipping an update

Bump `CACHE` in `sw.js` (currently `ruis-reef-v8`) whenever `index.html` changes.
The service worker is network-first, but the version bump is what clears stale
caches for anyone who already installed the app.
