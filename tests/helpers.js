import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import postcss from "postcss";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

export function readProjectFile(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

export function loadGalleryPage(bodyHtml, { bodyClass = "is-viewer" } = {}) {
  const dom = new JSDOM(
    `<!DOCTYPE html>
    <html>
      <body class="${bodyClass}">
        ${bodyHtml}
      </body>
    </html>`,
    {
      url: "https://example.test/photography/in-between/",
      pretendToBeVisual: true,
      runScripts: "dangerously",
    }
  );

  const { window } = dom;
  const { document } = window;

  // Provide focus stub used by lightbox open()
  if (!window.HTMLElement.prototype.focus) {
    window.HTMLElement.prototype.focus = function focus() {};
  }

  const script = document.createElement("script");
  script.textContent = readProjectFile("js/gallery.js");
  document.body.appendChild(script);

  return { dom, window, document };
}

export function parseCss() {
  return postcss.parse(readProjectFile("css/styles.css"));
}

/** Collect declarations for selectors that appear inside an optional media query. */
export function declarationsFor(selector, { media } = {}) {
  const root = parseCss();
  const matches = [];

  root.walkRules((rule) => {
    const selectors = rule.selector.split(",").map((part) => part.trim());
    if (!selectors.includes(selector)) return;

    if (media) {
      const at = rule.parent;
      if (!at || at.type !== "atrule" || at.name !== "media") return;
      if (!String(at.params).includes(media)) return;
    } else if (rule.parent && rule.parent.type === "atrule" && rule.parent.name === "media") {
      // Skip media-scoped rules when looking for base styles
      return;
    }

    const decls = {};
    rule.walkDecls((decl) => {
      decls[decl.prop] = decl.value;
    });
    matches.push(decls);
  });

  return matches;
}

export function latestDeclarations(selector, options) {
  const all = declarationsFor(selector, options);
  if (!all.length) {
    throw new Error(
      `No CSS rule found for selector "${selector}"` +
        (options?.media ? ` in @media (${options.media})` : "")
    );
  }
  return Object.assign({}, ...all);
}
