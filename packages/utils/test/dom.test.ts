import { loadScript, loadStyle } from "../src";

test("loadStyle()", () => {
  const css = `
    .color-red { color: red }
  `;

  loadStyle(css);

  const hasCSS =
    (document.head.firstChild as HTMLStyleElement)?.innerHTML === css;

  expect(hasCSS).toBe(true);
});
