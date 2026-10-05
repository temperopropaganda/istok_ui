import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
  };
}

/**
 * Rota atual pelo hash: `#/button` → "button"; vazia na página inicial. Hash funciona em qualquer
 * hospedagem estática (ex.: GitHub Pages) sem configurar o servidor.
 */
export function useRoute() {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash);
  return hash.startsWith("#/") ? decodeURIComponent(hash.slice(2)) : "";
}
