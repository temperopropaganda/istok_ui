import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
  };
}

/**
 * Rota atual pelo hash: `#/button` → "button"; vazia na página inicial. Subcaminhos
 * (`#/product-card/suco`) ficam na mesma página. Hash funciona em qualquer
 * hospedagem estática (ex.: GitHub Pages) sem configurar o servidor.
 */
export function useRoute() {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash);
  // Só o primeiro segmento é a página: `#/product-card/suco` continua em "product-card".
  return hash.startsWith("#/") ? (decodeURIComponent(hash.slice(2)).split("/")[0] ?? "") : "";
}
