import type { ComponentProps, MouseEvent } from "react";
import { Slot } from "radix-ui";
import { cn } from "../../lib/cn.ts";
import { Spinner } from "../spinner/spinner.tsx";
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
  /**
   * Ação em andamento: mostra um `Spinner` no lugar do ícone (ou antes do texto), marca
   * `aria-busy` e ignora cliques, inclusive o envio de formulário. Continua focável
   * (`aria-disabled` em vez de `disabled`), para o foco não se perder quando o carregamento
   * começa. Leitores de tela anunciam o botão como indisponível; para dizer o que está
   * acontecendo, troque o texto junto (ex.: "Salvando…"). Com `asChild`, aplica só o estado,
   * sem o `Spinner`.
   * @default false
   */
  loading?: boolean;
}

function blockClick(event: MouseEvent) {
  event.preventDefault();
}

/** Botão para ações. Para navegação, use `asChild` com um `<a>` ou `<Link>`. */
export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  type,
  onClick,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    buttonVariants({ variant, size }),
    // Durante o carregamento, o Spinner ocupa o lugar dos ícones (mesmo tamanho, sem pular).
    loading && !asChild && "[&>svg]:hidden",
    className,
  );
  const state = loading
    ? ({ "aria-busy": true, "aria-disabled": true, onClick: blockClick } as const)
    : { onClick };

  if (asChild) {
    return (
      <Slot.Root data-slot="button" className={classes} {...props} {...state}>
        {children}
      </Slot.Root>
    );
  }

  // `type="button"` por padrão: o padrão do HTML (`submit`) envia formulários sem querer.
  return (
    <button data-slot="button" type={type ?? "button"} className={classes} {...props} {...state}>
      {/* Decorativo: dentro de um botão, a região de status não é anunciada. */}
      {loading && <Spinner size="sm" aria-hidden="true" />}
      {children}
    </button>
  );
}
