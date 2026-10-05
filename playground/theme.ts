import { useEffect, useState } from "react";

// Mesma chave do script em index.html, que aplica o tema antes da primeira pintura.
const storageKey = "istok-ui:tema";

/** Tema escuro (padrão) ou claro, pela classe `dark` no `<html>`; a escolha fica salva. */
export function useDarkTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem(storageKey, dark ? "escuro" : "claro");
    } catch {
      // Sem armazenamento (ex.: janela privada): o tema só não fica salvo.
    }
  }, [dark]);

  return [dark, setDark] as const;
}
