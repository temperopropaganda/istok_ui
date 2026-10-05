import { afterEach, describe, expect, it } from "vitest";

// Converte qualquer cor CSS (oklch, color-mix…) para sRGB desenhando num canvas de 1px.
function toRgb(color: string) {
  const context = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Canvas 2D indisponível");
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  const [r = 0, g = 0, b = 0] = context.getImageData(0, 0, 1, 1).data;
  return [r, g, b].map((channel) => channel / 255);
}

function luminance(rgb: number[]) {
  const [r = 0, g = 0, b = 0] = rgb.map((c) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [light, dark] = [luminance(toRgb(a)), luminance(toRgb(b))].sort((x, y) => y - x);
  return ((light ?? 0) + 0.05) / ((dark ?? 0) + 0.05);
}

const token = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();

describe("tema: borda dos controles (--input)", () => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  // WCAG 1.4.11: a borda é o que mostra onde está o campo, o checkbox ou o radio.
  for (const theme of ["claro", "escuro"]) {
    it(`tem contraste ≥ 3:1 com background, card e muted no tema ${theme}`, () => {
      document.documentElement.classList.toggle("dark", theme === "escuro");

      for (const surface of ["background", "card", "muted"]) {
        expect(contrast(token("input"), token(surface)), surface).toBeGreaterThanOrEqual(3);
      }
    });
  }
});
