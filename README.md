# Shawn Wu — Photography portfolio

Static site for [scyline.github.io](https://scyline.github.io).

## Pages

- Home — `index.html`
- Photography hub — `photography/index.html`
- Categories — `photography/street/`, `architecture/`, `travel/`, `film/`
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
4. Copy an existing `<figure class="gallery-item">...</figure>` block and paste it inside `<div class="gallery" data-gallery>`.
5. Update the paths and optional text:

```html
<figure
  class="gallery-item"
  data-full="../../images/street/street-04.jpg"
  data-title="Optional short title"
  data-caption="Optional one- or two-line description."
>
  <div class="gallery-frame">
    <img src="../../images/street/street-04.jpg" alt="Short description of the photo">
  </div>
  <figcaption class="gallery-meta">
    <span class="gallery-title">Optional short title</span>
    <span class="gallery-caption">Optional one- or two-line description.</span>
  </figcaption>
</figure>
```

### Titles and captions

- **Title only:** set `data-title` and keep the matching `.gallery-title` text; omit `data-caption` and `.gallery-caption`.
- **Title + short text:** set both `data-title` and `data-caption`, and mirror the same words in the `<figcaption>` so they show under the thumbnail and in the lightbox.
- **Photo only (no text):** omit `data-title`, `data-caption`, and the whole `<figcaption>` block (see the third placeholder in Street).

Keep `data-*` attributes and the visible `<figcaption>` text in sync — the lightbox reads from `data-title` / `data-caption`.

### Series intro text

Edit the paragraph under the `<h1>` on each category page (or on About) to change the page description.

## Publish changes

Commit and push to `main`. GitHub Pages will update `https://scyline.github.io` within a minute or two.
