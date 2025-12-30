# Dreamy Esthetics (Luxury UI + Masonry Gallery + Filters + Animations)

## What you get
- Modern luxury spa UI theme
- Big hero background + overlay navbar on Home
- Masonry gallery layout
- Category filters: Brows / Waxing / Facials / Results
- Lightbox (click to open, Esc close, arrow navigation)
- Scroll reveal animations + micro-interactions
- Full Node/Express server scaffold included

---

## Run locally

### Server
```bash
cd server
npm install
npm start
```
Runs on http://localhost:5000

### Client
```bash
cd client
npm install
npm run dev
```
Runs on http://localhost:5173

---

## Add your branding + photos (AUTO LOADING)

### 1) Logo + Hero background
Put these in:
- `client/public/images/brand/logo.png`
- `client/public/images/brand/hero.jpg`

(Those are referenced directly by the UI.)

### 2) Gallery photos (auto-generated list)
Put your gallery images in:
- `client/src/assets/gallery/`

Name them with prefixes so categories work automatically:
- `brows-1.jpg`, `brows-2.png`
- `waxing-1.jpg`
- `facials-1.jpg`
- `results-1.jpg`

No manual edits needed — the gallery list is generated automatically in:
- `client/src/data/galleryAuto.js`

---

## Lightbox controls
- Click an image to open
- Use Left/Right arrow keys to navigate
- Press Esc or click outside to close
