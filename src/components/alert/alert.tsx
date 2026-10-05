import type { ComponentProps } from "react";
import { cn } from "../../lib/cn.ts";
import { alertVariants, type AlertVariants } from "./alert.variants.ts";

export interface AlertProps extends ComponentProps<"div"> {
  /**
   * Estilo visual e papel para leitores de tela.
   * - `default`: informação neutra (`role="status"`)
   * - `success`: ação concluída (`role="status"`)
   * - `warning`: atenção antes de seguir (`role="alert"`)
   * - `destructive`: erro ou falha (`role="alert"`)
   *
   * `role="alert"` interrompe o leitor de tela; `status` espera ele terminar o que está lendo.
   * Passe `role` para trocar (ex.: `role="note"` para um aviso fixo da página).
   * @default "default"
   */
  variant?: AlertVariants["variant"];
}

/**
 * Mensagem em destaque. Combine com `AlertTitle`, `AlertDescription` e, opcionalmente, um ícone
 * SVG como primeiro filho (ele vai para a coluna da esquerda).
 *
 * @example
 * ```tsx
 * <Alert variant="destructive">
 *   <AlertTitle>Falha no pagamento</AlertTitle>
 *   <AlertDescription>O cartão foi recusado. Confira os dados e tente de novo.</AlertDescription>
 * </Alert>
 * ```
 */
export function Alert({ className, variant, ...props }: AlertProps) {
  const role = variant === "destructive" || variant === "warning" ? "alert" : "status";
  return (
    <div
      data-slot="alert"
      role={role}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

/** Título curto do alerta. */
export function AlertTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 min-h-4 font-medium tracking-tight", className)}
      {...props}
    />
  );
}

/** Detalhes do alerta: texto, parágrafos ou listas. */
export function AlertDescription({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}
