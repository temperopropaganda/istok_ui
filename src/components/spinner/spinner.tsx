import type { ComponentProps } from "react";
import { cn } from "../../lib/cn.ts";
import { spinnerVariants, type SpinnerVariants } from "./spinner.variants.ts";

export interface SpinnerProps extends ComponentProps<"span"> {
  /**
   * Tamanho: `sm` (16px), `md` (24px) ou `lg` (32px).
   * @default "md"
   */
  size?: SpinnerVariants["size"];
  /**
   * Texto lido por leitores de tela (fica escondido na tela).
   * @default "Carregando"
   */
  label?: string;
}

/**
 * Indicador de carregamento. Usa a cor do texto em volta (`currentColor`); mude com classes
 * (ex.: `className="text-muted-foreground"`).
 *
 * É uma região `role="status"`: leitores de tela anunciam o `label`. Com redução de movimento
 * ligada no sistema, gira mais devagar em vez de parar, para não esconder que algo está acontecendo.
 *
 * @example
 * ```tsx
 * <Spinner size="sm" label="Carregando pedidos" />
 * ```
 */
export function Spinner({ className, size, label = "Carregando", ...props }: SpinnerProps) {
  return (
    <span
      data-slot="spinner"
      role="status"
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className="size-full animate-spin motion-reduce:animate-[spin_2s_linear_infinite]"
      >
        <circle cx="12" cy="12" r="10" className="opacity-25" />
        <path d="M22 12a10 10 0 0 0-10-10" strokeLinecap="round" />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}
