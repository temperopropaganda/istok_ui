import type { ComponentProps } from "react";
import { Slot } from "radix-ui";
import { cn } from "../../lib/cn.ts";
import { badgeVariants, type BadgeVariants } from "./badge.variants.ts";

export interface BadgeProps extends ComponentProps<"span"> {
  /**
   * Estilo visual.
   * - `default`: destaque padrão
   * - `secondary`: informação neutra
   * - `outline`: discreto, só com borda
   * - `destructive`: erro ou estado crítico
   * - `success`: concluído, ativo, aprovado
   * - `warning`: atenção, pendente
   * @default "default"
   */
  variant?: BadgeVariants["variant"];
  /**
   * Renderiza o filho único (ex.: `<a>`) com o visual do badge, em vez de um `<span>`.
   * @default false
   */
  asChild?: boolean;
}

/** Rótulo curto para status, categoria ou contagem. */
export function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot.Root : "span";
  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
