import type { ComponentProps } from "react";
import { Slot } from "radix-ui";
import { cn } from "../../lib/cn.ts";
import { buttonVariants, type ButtonVariants } from "./button.variants.ts";

export interface ButtonProps extends ComponentProps<"button"> {
  /**
   * Estilo visual.
   * - `default`: ação principal
   * - `secondary`: ação secundária
   * - `outline`: ação neutra com borda
   * - `ghost`: ação discreta, sem fundo (barras de ferramentas, menus)
   * - `link`: aparência de link
   * - `destructive`: ação perigosa ou irreversível (excluir, cancelar assinatura)
   * @default "default"
   */
  variant?: ButtonVariants["variant"];
  /**
   * Tamanho. Use `icon` para botões só com ícone (exige `aria-label`).
   * @default "md"
   */
  size?: ButtonVariants["size"];
  /**
   * Renderiza o filho único (ex.: `<a>` ou `<Link>` do router) com o visual do botão,
   * em vez de um `<button>`.
   * @default false
   */
  asChild?: boolean;
}

/** Botão para ações. Para navegação, use `asChild` com um `<a>` ou `<Link>`. */
export function Button({ className, variant, size, asChild = false, type, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (asChild) {
    return <Slot.Root data-slot="button" className={classes} {...props} />;
  }

  // `type="button"` por padrão: o padrão do HTML (`submit`) envia formulários sem querer.
  return <button data-slot="button" type={type ?? "button"} className={classes} {...props} />;
}
