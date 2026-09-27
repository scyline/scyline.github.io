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
  const viewer = document.querySelector("[data-viewer]");
  const minimap = document.querySelector("[data-minimap]");
  if (!viewer || !minimap) return;

  const slides = [...viewer.querySelectorAll("[data-viewer-slide]")];
  if (!slides.length) return;

  const dots = slides.map((slide, index) => {
    const img = slide.querySelector("img");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "minimap-dot";
    button.setAttribute("aria-label", `Go to photo ${index + 1}`);
    if (img) {
      const thumb = document.createElement("img");
      thumb.src = img.currentSrc || img.src;
      thumb.alt = "";
      button.appendChild(thumb);
    }
    button.addEventListener("click", () => {
      slide.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    minimap.appendChild(button);
    return button;
  });

  function setActive(index) {
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });
  }

  setActive(0);

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const index = slides.indexOf(visible.target);
      if (index >= 0) setActive(index);
    },
    {
      root: null,
      rootMargin: "-20% 0px -35% 0px",
      threshold: [0.2, 0.45, 0.7],
    }
  );

  slides.forEach((slide) => observer.observe(slide));

  document.addEventListener("keydown", (event) => {
    const current = dots.findIndex((dot) => dot.classList.contains("is-active"));
    if (event.key === "ArrowDown" || event.key === "PageDown") {
      event.preventDefault();
      const next = Math.min(slides.length - 1, current + 1);
      slides[next].scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (event.key === "ArrowUp" || event.key === "PageUp") {
      event.preventDefault();
      const prev = Math.max(0, current - 1);
      slides[prev].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
})();

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
