(() => {
  const gallery = document.querySelector("[data-gallery]");
  if (!gallery) return;

  const items = [...gallery.querySelectorAll(".gallery-item")];
  if (!items.length) return;

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.innerHTML = `
    <button type="button" class="lightbox-close" aria-label="Close">&times;</button>
    <button type="button" class="lightbox-nav lightbox-prev" aria-label="Previous photo">&#10094;</button>
    <button type="button" class="lightbox-nav lightbox-next" aria-label="Next photo">&#10095;</button>
    <div class="lightbox-inner">
      <figure class="lightbox-figure">
        <img src="" alt="">
      </figure>
      <div class="lightbox-caption">
        <strong hidden></strong>
        <p hidden></p>
      </div>
    </div>
  `;
  document.body.appendChild(lightbox);

  const img = lightbox.querySelector("img");
  const titleEl = lightbox.querySelector(".lightbox-caption strong");
  const captionEl = lightbox.querySelector(".lightbox-caption p");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  const prevBtn = lightbox.querySelector(".lightbox-prev");
  const nextBtn = lightbox.querySelector(".lightbox-next");

  let index = 0;

  function readItem(item) {
    const picture = item.querySelector("img");
    return {
      src: item.dataset.full || picture.src,
      alt: picture.alt || "",
      title: (item.dataset.title || "").trim(),
      caption: (item.dataset.caption || "").trim(),
    };
  }

  function show(i) {
    index = (i + items.length) % items.length;
    const data = readItem(items[index]);
    img.src = data.src;
    img.alt = data.alt;

    if (data.title) {
      titleEl.hidden = false;
      titleEl.textContent = data.title;
    } else {
      titleEl.hidden = true;
      titleEl.textContent = "";
    }

    if (data.caption) {
      captionEl.hidden = false;
      captionEl.textContent = data.caption;
    } else {
      captionEl.hidden = true;
      captionEl.textContent = "";
    }
  }

  function open(i) {
    show(i);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  items.forEach((item, i) => {
    item.addEventListener("click", () => open(i));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open(i);
      }
    });
    if (!item.hasAttribute("tabindex")) item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", "Open photo");
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => show(index - 1));
  nextBtn.addEventListener("click", () => show(index + 1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") show(index - 1);
    if (event.key === "ArrowRight") show(index + 1);
  });
})();

(() => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
})();
