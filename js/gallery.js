(() => {
  const photoItem = document.querySelector("[data-nav-photo]");
  if (!photoItem) return;

  const trigger = photoItem.querySelector(".nav-trigger");
  const submenu = photoItem.querySelector(".nav-submenu");
  if (!trigger || !submenu) return;

  const keepOpen = photoItem.hasAttribute("data-keep-open");

  function setOpen(open) {
    photoItem.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", open ? "true" : "false");
  }

  if (keepOpen) setOpen(true);

  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(!photoItem.classList.contains("is-open"));
  });

  document.addEventListener("click", (event) => {
    if (keepOpen) return;
    if (!photoItem.contains(event.target)) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (keepOpen) return;
    setOpen(false);
  });
})();

(() => {
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("#site-nav");
  const panel = document.querySelector("[data-nav-panel]");
  if (!toggle || !nav || !panel) return;

  function setMenuOpen(open) {
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    setMenuOpen(!document.body.classList.contains("menu-open"));
  });

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("menu-open")) return;
    if (nav.contains(event.target)) return;
    setMenuOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });
})();

(() => {
  const galleryItems = [...document.querySelectorAll("[data-gallery] .gallery-item")];
  const viewerSlides = [...document.querySelectorAll("[data-viewer] [data-viewer-slide]")];
  const items = galleryItems.length ? galleryItems : viewerSlides;
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
      src: item.dataset.full || (picture && (picture.currentSrc || picture.src)) || "",
      alt: (picture && picture.alt) || "",
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
    item.setAttribute("aria-label", "View photo fullscreen");
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => show(index - 1));
  nextBtn.addEventListener("click", () => show(index + 1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox || event.target === lightbox.querySelector(".lightbox-inner")) {
      close();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") {
      event.stopPropagation();
      close();
    }
    if (event.key === "ArrowLeft") show(index - 1);
    if (event.key === "ArrowRight") show(index + 1);
  });
})();
