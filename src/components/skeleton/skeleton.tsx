import type { ComponentProps } from "react";
import { cn } from "../../lib/cn.ts";

/**
 * Bloco de carregamento no formato do conteúdo que vai aparecer. Defina o tamanho com classes
 * (ex.: `className="h-4 w-32"`).
 *
 * É decorativo (`aria-hidden`). Para leitores de tela, marque o contêiner com `aria-busy="true"` e
 * inclua um texto escondido: `<span className="sr-only">Carregando…</span>`. A animação só roda
 * para quem não pediu redução de movimento no sistema.
 */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("rounded-md bg-muted motion-safe:animate-pulse", className)}
      {...props}
    />
  );
}
