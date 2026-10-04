import { describe, expect, it, beforeEach } from "vitest";
import { loadGalleryPage } from "./helpers.js";

const viewerFixture = `
  <nav class="site-nav" id="site-nav">
    <div class="nav-panel" data-nav-panel>
      <a href="/">Home</a>
      <div class="nav-item nav-item--photo is-active is-open" data-nav-photo data-keep-open>
        <button type="button" class="nav-trigger" aria-expanded="true" aria-controls="photo-submenu">Works</button>
        <div class="nav-submenu" id="photo-submenu">
          <a href="/in-between/" aria-current="page">In between</a>
          <a href="/travel/">Travel</a>
        </div>
      </div>
    </div>
  </nav>
  <main class="viewer" data-viewer>
    <figure class="viewer-slide" id="photo-1" data-viewer-slide>
      <img src="/images/a.jpg" alt="Photo A">
    </figure>
    <figure class="viewer-slide" id="photo-2" data-viewer-slide>
      <img src="/images/b.jpg" alt="Photo B">
    </figure>
    <figure class="viewer-slide" id="photo-3" data-viewer-slide>
      <img src="/images/c.jpg" alt="Photo C">
    </figure>
  </main>
`;

describe("fullscreen photo lightbox", () => {
  let window;
  let document;

  beforeEach(() => {
    ({ window, document } = loadGalleryPage(viewerFixture));
  });

  it("wires viewer slides as activatable controls", () => {
    const slides = [...document.querySelectorAll("[data-viewer-slide]")];
    expect(slides).toHaveLength(3);
    for (const slide of slides) {
      expect(slide.getAttribute("role")).toBe("button");
      expect(slide.getAttribute("aria-label")).toBe("View photo fullscreen");
      expect(slide.tabIndex).toBe(0);
    }
  });

  it("opens a fullscreen lightbox when a slide is clicked", () => {
    const slide = document.querySelector("#photo-2");
    slide.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));

    const lightbox = document.querySelector(".lightbox");
    expect(lightbox).toBeTruthy();
    expect(lightbox.classList.contains("is-open")).toBe(true);
    expect(lightbox.getAttribute("aria-hidden")).toBe("false");
    expect(lightbox.getAttribute("role")).toBe("dialog");
    expect(lightbox.getAttribute("aria-modal")).toBe("true");

    const img = lightbox.querySelector(".lightbox-figure img");
    expect(img.getAttribute("src")).toContain("/images/b.jpg");
    expect(img.alt).toBe("Photo B");
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("navigates with next/prev controls and arrow keys", () => {
    document.querySelector("#photo-1").dispatchEvent(
      new window.MouseEvent("click", { bubbles: true })
    );
    const lightbox = document.querySelector(".lightbox");
    const img = lightbox.querySelector(".lightbox-figure img");

    lightbox.querySelector(".lightbox-next").dispatchEvent(
      new window.MouseEvent("click", { bubbles: true })
    );
    expect(img.getAttribute("src")).toContain("/images/b.jpg");

    lightbox.querySelector(".lightbox-prev").dispatchEvent(
      new window.MouseEvent("click", { bubbles: true })
    );
    expect(img.getAttribute("src")).toContain("/images/a.jpg");

    document.dispatchEvent(
      new window.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
    );
    expect(img.getAttribute("src")).toContain("/images/b.jpg");

    document.dispatchEvent(
      new window.KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true })
    );
    expect(img.getAttribute("src")).toContain("/images/a.jpg");
  });

  it("closes on Escape, close button, and backdrop click", () => {
    document.querySelector("#photo-1").dispatchEvent(
      new window.MouseEvent("click", { bubbles: true })
    );
    const lightbox = document.querySelector(".lightbox");

    document.dispatchEvent(
      new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true })
    );
    expect(lightbox.classList.contains("is-open")).toBe(false);
    expect(document.body.style.overflow).toBe("");

    document.querySelector("#photo-1").dispatchEvent(
      new window.MouseEvent("click", { bubbles: true })
    );
    expect(lightbox.classList.contains("is-open")).toBe(true);

    lightbox.querySelector(".lightbox-close").dispatchEvent(
      new window.MouseEvent("click", { bubbles: true })
    );
    expect(lightbox.classList.contains("is-open")).toBe(false);

    document.querySelector("#photo-3").dispatchEvent(
      new window.MouseEvent("click", { bubbles: true })
    );
    expect(lightbox.classList.contains("is-open")).toBe(true);
    // Dispatching on the overlay makes event.target === lightbox (backdrop).
    lightbox.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    expect(lightbox.classList.contains("is-open")).toBe(false);
  });

  it("opens from keyboard Enter/Space on a slide", () => {
    const slide = document.querySelector("#photo-3");
    slide.dispatchEvent(
      new window.KeyboardEvent("keydown", { key: "Enter", bubbles: true })
    );
    const lightbox = document.querySelector(".lightbox");
    expect(lightbox.classList.contains("is-open")).toBe(true);
    expect(lightbox.querySelector("img").alt).toBe("Photo C");

    lightbox.querySelector(".lightbox-close").dispatchEvent(
      new window.MouseEvent("click", { bubbles: true })
    );

    slide.dispatchEvent(
      new window.KeyboardEvent("keydown", { key: " ", bubbles: true })
    );
    expect(lightbox.classList.contains("is-open")).toBe(true);
  });
});

describe("fullscreen lightbox CSS", () => {
  it("sizes lightbox images for near-fullscreen viewing", async () => {
    const { latestDeclarations } = await import("./helpers.js");
    const img = latestDeclarations(".lightbox-figure img");
    expect(img["max-height"]).toMatch(/92vh|100dvh/);
    expect(img["object-fit"]).toBe("contain");

    const box = latestDeclarations(".lightbox");
    expect(box.position).toBe("fixed");
    expect(box.inset).toBe("0");
  });
});
