// Imagens de exemplo embutidas (SVG), para a vitrine não depender de rede.
const svg = (content: string, viewBox: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${content}</svg>`,
  )}`;

/** Garrafa sobre fundo colorido (produtos). */
export const productImage = (background: string, liquid: string) =>
  svg(
    `<rect width="200" height="200" fill="${background}"/>` +
      `<rect x="82" y="30" width="36" height="22" rx="4" fill="#fafafa"/>` +
      `<path d="M78 52h44v18c0 8 14 14 14 30v66a12 12 0 0 1-12 12H76a12 12 0 0 1-12-12V100c0-16 14-22 14-30z" fill="#fafafa"/>` +
      `<path d="M68 112h64v54a8 8 0 0 1-8 8H76a8 8 0 0 1-8-8z" fill="${liquid}"/>`,
    "0 0 200 200",
  );

/** Paisagem simples (capas de notícia). */
export const coverImage = (sky: string, hill: string) =>
  svg(
    `<rect width="320" height="180" fill="${sky}"/>` +
      `<circle cx="250" cy="50" r="22" fill="#fafafa" opacity="0.8"/>` +
      `<path d="M0 140 Q80 80 160 130 T320 120V180H0z" fill="${hill}"/>`,
    "0 0 320 180",
  );
