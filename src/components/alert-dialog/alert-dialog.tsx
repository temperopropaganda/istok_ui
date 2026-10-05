import type { ComponentProps } from "react";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import { cn } from "../../lib/cn.ts";
import { Button, type ButtonProps } from "../button/button.tsx";
import {
  dialogContentVariants,
  dialogOverlayClasses,
  type DialogContentVariants,
} from "../dialog/dialog.variants.ts";

/**
 * Confirmação que exige resposta (`role="alertdialog"`), para ações destrutivas ou irreversíveis.
 * Diferente do `Dialog`: não fecha com clique fora e, ao abrir, o foco vai para o
 * `AlertDialogCancel` (a opção segura). Esc cancela.
 *
 * @example
 * ```tsx
 * <AlertDialog>
 *   <AlertDialogTrigger asChild>
 *     <Button variant="destructive">Excluir projeto</Button>
 *   </AlertDialogTrigger>
 *   <AlertDialogContent>
 *     <AlertDialogHeader>
 *       <AlertDialogTitle>Excluir o projeto?</AlertDialogTitle>
 *       <AlertDialogDescription>Isso não pode ser desfeito.</AlertDialogDescription>
 *     </AlertDialogHeader>
 *     <AlertDialogFooter>
 *       <AlertDialogCancel>Cancelar</AlertDialogCancel>
 *       <AlertDialogAction variant="destructive" onClick={excluir}>
 *         Excluir
 *       </AlertDialogAction>
 *     </AlertDialogFooter>
 *   </AlertDialogContent>
 * </AlertDialog>
 * ```
 */
export function AlertDialog(props: ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root {...props} />;
}

/** Abre o AlertDialog. Use `asChild` com um `Button`. */
export function AlertDialogTrigger(props: ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}

export interface AlertDialogContentProps extends ComponentProps<
  typeof AlertDialogPrimitive.Content
> {
  /**
   * Largura máxima: `sm` (384px), `md` (512px) ou `lg` (672px).
   * @default "md"
   */
  size?: DialogContentVariants["size"];
}

/** Conteúdo do AlertDialog, num portal no `<body>`. Precisa de título e descrição. */
export function AlertDialogContent({ className, size, ...props }: AlertDialogContentProps) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay
        data-slot="alert-dialog-overlay"
        className={dialogOverlayClasses}
      />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(dialogContentVariants({ size }), className)}
        {...props}
      />
    </AlertDialogPrimitive.Portal>
  );
}

/** Topo do AlertDialog: título e descrição. */
export function AlertDialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

/** Rodapé com as ações. No celular, empilha com a ação principal em cima. */
export function AlertDialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

/** Pergunta do AlertDialog (`<h2>`), que também é o nome do modal. Obrigatório. */
export function AlertDialogTitle({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg leading-tight font-semibold", className)}
      {...props}
    />
  );
}

/** Consequência da ação ("Isso não pode ser desfeito."). Obrigatório. */
export function AlertDialogDescription({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

/**
 * Confirma e fecha. É um `Button` (aceita `variant`, `size`, `loading`…); use
 * `variant="destructive"` para exclusões. Para uma ação assíncrona, chame
 * `event.preventDefault()` no `onClick` (o modal fica aberto), ligue `loading` e feche pelo
 * `open`/`onOpenChange` quando terminar. Com `loading`, novos cliques não fecham o modal.
 */
export function AlertDialogAction(props: ButtonProps) {
  return (
    <AlertDialogPrimitive.Action asChild>
      <Button data-slot="alert-dialog-action" {...props} />
    </AlertDialogPrimitive.Action>
  );
}

/** Cancela e fecha. É um `Button` com `variant="outline"` por padrão; recebe o foco ao abrir. */
export function AlertDialogCancel({ variant = "outline", ...props }: ButtonProps) {
  return (
    <AlertDialogPrimitive.Cancel asChild>
      <Button data-slot="alert-dialog-cancel" variant={variant} {...props} />
    </AlertDialogPrimitive.Cancel>
  );
}
