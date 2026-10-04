import { describe, expect, it } from "vitest";
import { latestDeclarations } from "./helpers.js";

describe("menu selection dots", () => {
  it("places a left-side dot with left padding on desktop nav items", () => {
    const item = latestDeclarations(".site-nav a");
    const trigger = latestDeclarations(".site-nav .nav-trigger");
    const dot = latestDeclarations(".site-nav a::before");

    expect(item.padding).toMatch(/0\.95rem\s*$/);
    expect(item.padding).toMatch(/^0\s+0\s+0\s+0\.95rem$/);
    expect(trigger.padding).toBe(item.padding);

    expect(dot.content).toBe('""');
    expect(dot.position).toBe("absolute");
    expect(dot.left).toBe("0.15rem");
    expect(dot.top).toBe("50%");
    expect(dot["border-radius"]).toBe("50%");
    expect(dot.transform).toContain("translateY(-50%)");
  });

  it("shows the dot for the current page and open Works trigger", () => {
    const current = latestDeclarations('.site-nav a[aria-current="page"]::before');
    const worksOpen = latestDeclarations(
      ".site-nav .nav-item--photo.is-open .nav-trigger::before"
    );

    expect(current.opacity).toBe("1");
    expect(current.transform).toContain("translateY(-50%)");
    expect(current.transform).toContain("scale(1)");
    expect(worksOpen.opacity).toBe("1");
  });

  it("keeps left padding for dots on narrow viewer menus", () => {
    const narrowLink = latestDeclarations("body.is-viewer .site-nav a", {
      media: "max-width: 800px",
    });
    const narrowTrigger = latestDeclarations("body.is-viewer .site-nav .nav-trigger", {
      media: "max-width: 800px",
    });
    const narrowSubmenu = latestDeclarations("body.is-viewer .nav-submenu a", {
      media: "max-width: 800px",
    });

    // Regression: previously this was `padding: 0.32rem 0`, which stacked the
    // dot on top of the label instead of before it.
    expect(narrowLink.padding).toBe("0.32rem 0 0.32rem 1rem");
    expect(narrowTrigger.padding).toBe("0.32rem 0 0.32rem 1rem");
    expect(narrowSubmenu.padding).toBe("0.28rem 0 0.28rem 1rem");
    expect(narrowLink.padding.split(/\s+/).length).toBe(4);
    expect(narrowLink.padding.endsWith("0")).toBe(false);
  });
});
