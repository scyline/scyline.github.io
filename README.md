# Shawn Wu — Photography portfolio

Static site for [scyline.github.io](https://scyline.github.io).

## Pages

- Home — `index.html`
- Works hub — `photography/index.html`
- Work: **In between** — `photography/in-between/`
- Work: **Film** — `photography/film/`
  - Whitstable — `photography/film/whitstable/`
  - Prague — `photography/film/prague/`
- About — `about.html`
- Contact — `contact.html` (email + Instagram [@lazy_mdlr](https://www.instagram.com/lazy_mdlr/))

## How to add a photo

1. Export a web-sized JPG (longest side about 1600–2000px, quality ~75–85%). Avoid spaces in the filename.
2. Put the file in the matching folder:
   - In between → `images/in-between/` (e.g. `in-between-19.jpg`)
   - Film / Whitstable → `images/film/whitstable/` (e.g. `whitstable-01.jpg`)
   - Film / Prague → `images/film/prague/` (e.g. `prague-01.jpg`)
   - Home hero → `images/home/` (replace `hero.jpg`)
   - Covers → `images/covers/`
3. Open that series’ page, e.g. `photography/film/whitstable/index.html`.
4. Copy an existing `<figure class="viewer-slide">` block inside `<main class="viewer" data-viewer>` and update it:

```html
<figure class="viewer-slide" id="photo-1" data-viewer-slide>
  <img src="../../../images/film/whitstable/whitstable-01.jpg" alt="Short description of the photo">
</figure>
```

Use the next `photo-N` id in sequence. Path depth differs by folder:
- `photography/in-between/` → `../../images/...`
- `photography/film/whitstable/` or `prague/` → `../../../images/...`

The left minimap builds automatically from these slides.

## Publish changes

Commit and push to `main`. GitHub Pages will update `https://scyline.github.io` within a minute or two.
