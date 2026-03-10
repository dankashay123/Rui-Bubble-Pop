# 🫧 Bubble Smash

A toddler-proof bubble-popping app built for iPhone. Tap bubbles to pop them, swipe to spawn words, watch animals peek in from the edges.

## Features

- Multi-touch bubble spawning — slap with four fingers, four bubbles appear
- Bubble popping with emoji explosions (animals included)
- Swipe to spawn vocabulary words along the path
- Animated gradient background
- Peeking animals (🦉🐮🐴🐱) from screen edges every 10 seconds
- Pop counter with bounce animation
- Full toddler-proofing: no zoom, no scroll, no context menus, no text selection
- Works offline via service worker

## Deploy to GitHub Pages (free hosting → Add to Home Screen)

### 1. Create the repo

```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. Push to GitHub

```bash
# Create a new repo on github.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/bubble-smash.git
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repo on GitHub
2. **Settings → Pages**
3. Source: **Deploy from a branch**
4. Branch: `main` / `/ (root)`
5. Click **Save**

Your app will be live at:
```
https://YOUR_USERNAME.github.io/bubble-smash/
```

> ⚠️ **Important:** The service worker uses absolute paths (`/sw.js`). If your repo is not at the root (e.g. it's at `/bubble-smash/`), update the `start_url` in `manifest.json` to `/bubble-smash/index.html` and update `ASSETS` in `sw.js` to use `/bubble-smash/` prefixed paths. See note below.

### 4. Add to iPhone Home Screen

1. Open the URL in **Safari** (must be Safari, not Chrome)
2. Tap the **Share** button (box with arrow)
3. Tap **"Add to Home Screen"**
4. Tap **Add**

The app will launch fullscreen with no browser UI — exactly like a native app.

---

## GitHub Pages subdirectory fix

If your site is served from `https://username.github.io/bubble-smash/` (not a custom domain), update two files:

**manifest.json** — change `start_url`:
```json
"start_url": "/bubble-smash/index.html"
```

**sw.js** — change the ASSETS array:
```js
const ASSETS = [
  '/bubble-smash/index.html',
  '/bubble-smash/manifest.json',
  '/bubble-smash/icon-192.png',
  '/bubble-smash/icon-512.png'
];
```

