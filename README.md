# Shawn Wu — Photography portfolio

Static site for [scyline.github.io](https://scyline.github.io).

## Pages

- Home — `index.html`
- Photography — `photography/index.html`
- Work: **In between** — `photography/in-between/`
- About — `about.html`
- Contact — `contact.html` (email + Instagram [@lazy_mdlr](https://www.instagram.com/lazy_mdlr/))

## How to add a photo to *In between*

1. Export a web-sized JPG (longest side about 1600–2000px, quality ~75–85%). Avoid spaces in the filename, e.g. `in-between-01.jpg`.
2. Put the file in `images/in-between/`.
3. Open `photography/in-between/index.html`.
4. Copy an existing `<figure class="viewer-slide">` block inside `<main class="viewer" data-viewer>` and update it:

```html
<figure class="viewer-slide" id="photo-1" data-viewer-slide>
  <img src="../../images/in-between/in-between-01.jpg" alt="Short description of the photo">
</figure>
```

Use the next `photo-N` id in sequence. The left minimap builds automatically from these slides.

Replace `images/covers/in-between.svg` (and optionally `images/home/hero.svg`) when you have a cover/hero image.

## Publish changes

Commit and push to `main`. GitHub Pages will update `https://scyline.github.io` within a minute or two.
