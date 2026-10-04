# Shawn Wu — Photography portfolio

Static site for [scyline.github.io](https://scyline.github.io).

## Pages

- Home — `index.html`
- Works hub — `photography/index.html`
- Work: **In between** — `photography/in-between/`
- Work: **Travel** (Whitstable + Prague) — `photography/travel/`
- About — `about.html`
- Contact — `contact.html` (email + Instagram [@lazy_mdlr](https://www.instagram.com/lazy_mdlr/))

## How to add a photo

1. Export a web-sized JPG (longest side about 1600–2000px, quality ~75–85%). Avoid spaces in the filename.
2. Put the file in the matching folder:
   - In between → `images/in-between/` (e.g. `in-between-19.jpg`)
   - Travel / Whitstable → `images/travel/whitstable/` (e.g. `whitstable-08.jpg`)
   - Travel / Prague → `images/travel/prague/` (e.g. `prague-07.jpg`)
   - Home hero → `images/home/` (replace `hero.jpg`)
   - Covers → `images/covers/`
3. Open that series’ page, e.g. `photography/travel/index.html`.
4. Copy an existing `<figure class="viewer-slide">` block (or Prague grid slide) and update paths/ids.

The left minimap builds automatically from `[data-viewer-slide]` elements on vertical viewers.

## Tests

Unit tests cover menu selection-dot positioning (including narrow screens) and the fullscreen photo lightbox.

```bash
npm install
npm test
```

GitHub Actions runs `npm test` on every push and pull request (see `.github/workflows/test.yml`).

## Publish changes

Commit and push to `main`. GitHub Pages will update `https://scyline.github.io` within a minute or two.
