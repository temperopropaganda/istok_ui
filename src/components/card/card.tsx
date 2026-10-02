import type { ComponentProps } from "react";
import { Slot } from "radix-ui";
import { cn } from "../../lib/cn.ts";

// Baseado no Card do shadcn/ui. Peças combináveis: use só as que precisar.

export interface CardProps extends ComponentProps<"div"> {
  /**
   * Renderiza o filho único (ex.: `<article>` ou `<li>`) com o visual do card, em vez de uma `<div>`.
   * @default false
   */
  asChild?: boolean;
}

/** Superfície que agrupa conteúdo relacionado. */
export function Card({ className, asChild = false, ...props }: CardProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="card"
      className={cn(
        "flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

/** Topo do card: título, descrição e, opcionalmente, uma ação (`CardAction`) à direita. */
export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

export interface CardTitleProps extends ComponentProps<"h3"> {
  /**
   * Renderiza o filho único no lugar do `<h3>`. Use para ajustar o nível do título à hierarquia
   * da página (ex.: `<CardTitle asChild><h2>…</h2></CardTitle>`).
   * @default false
   */
  asChild?: boolean;
}

/** Título do card. É um `<h3>` por padrão, para leitores de tela reconhecerem como título. */
export function CardTitle({ className, asChild = false, ...props }: CardTitleProps) {
  const Comp = asChild ? Slot.Root : "h3";
  return (
    <Comp
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

/** Texto de apoio abaixo do título. */
export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

/** Ação no canto superior direito do cabeçalho (ex.: um `Button` de menu). */
export function CardAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  );
}

/** Corpo do card. */
export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-6", className)} {...props} />;
}

/** Rodapé do card, normalmente com ações. */
export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}
