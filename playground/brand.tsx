import brandArtwork from "./assets/istok-brand.png";

/** A arte original é enquadrada pelo SVG, preservando o desenho e a tipografia da marca. */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="235 140 1090 310"
      className={className}
      role="img"
      aria-label="Istok — Tempero Design System"
    >
      <image href={brandArtwork} width="1536" height="1024" />
    </svg>
  );
}

export function BrandWaves() {
  return (
    <svg
      className="brand-waves"
      viewBox="0 0 1000 200"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0 120C180 25 280 200 500 110S820 15 1000 80V200H0Z" />
      <path d="M0 165C220 80 350 210 610 130S880 65 1000 120V200H0Z" />
      <path d="M0 185C180 140 400 205 630 165S880 120 1000 160V200H0Z" />
    </svg>
  );
}
