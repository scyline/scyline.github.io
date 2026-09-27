# Shawn Wu — Photography portfolio

Static site for [scyline.github.io](https://scyline.github.io).

## Pages

- Home — `index.html`
- Photography hub — `photography/index.html`
- Categories (vertical viewer + left minimap) — `photography/street/`, `architecture/`, `travel/`, `film/`
- About — `about.html`
- Contact — `contact.html` (email + Instagram [@lazy_mdlr](https://www.instagram.com/lazy_mdlr/))

## How to add a photo

1. Export a web-sized JPG (longest side about 1600–2000px, quality ~75–85%). Avoid spaces in the filename, e.g. `street-04.jpg`.
2. Put the file in the matching folder:
   - Street → `images/street/`
   - Architecture → `images/architecture/`
   - Travel → `images/travel/`
   - Film → `images/film/`
   - Home hero → `images/home/` (replace `hero.svg`)
   - Category covers → `images/covers/` (replace `street.svg`, etc.)
3. Open that category’s page, e.g. `photography/street/index.html`.
4. Copy an existing `<figure class="viewer-slide">` block inside `<main class="viewer" data-viewer>` and update it:

```html
<figure class="viewer-slide" id="photo-4" data-viewer-slide>
  <img src="../../images/street/street-04.jpg" alt="Short description of the photo">
</figure>
```

Use the next `photo-N` id in sequence. The left minimap builds automatically from these slides.

## Publish changes

Commit and push to `main`. GitHub Pages will update `https://scyline.github.io` within a minute or two.
