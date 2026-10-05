import type { ComponentProps } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "../../lib/cn.ts";
import { Button } from "../button/button.tsx";
import {
  dialogContentVariants,
  dialogOverlayClasses,
  type DialogContentVariants,
} from "./dialog.variants.ts";

/**
 * Janela modal (Radix). Prende o foco, fecha com Esc ou clique fora e devolve o foco a quem abriu.
 * Use `open`/`onOpenChange` para controlar, ou deixe o `DialogTrigger` abrir sozinho.
 *
 * Para confirmar ações destrutivas ("Excluir projeto?"), use o `AlertDialog`.
 *
 * @example
 * ```tsx
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button variant="outline">Editar perfil</Button>
 *   </DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Editar perfil</DialogTitle>
 *       <DialogDescription>As mudanças aparecem para todo o time.</DialogDescription>
 *     </DialogHeader>
 *     <Field>
 *       <FieldLabel>Nome</FieldLabel>
 *       <Input name="nome" />
 *     </Field>
 *     <DialogFooter>
 *       <DialogClose asChild>
 *         <Button variant="outline">Cancelar</Button>
 *       </DialogClose>
 *       <Button type="submit">Salvar</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
export function Dialog(props: ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />;
}

/** Abre o Dialog. Use `asChild` com um `Button`: `<DialogTrigger asChild><Button>…</Button></DialogTrigger>`. */
export function DialogTrigger(props: ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

/** Fecha o Dialog. Use `asChild` com um `Button` (ex.: "Cancelar" no `DialogFooter`). */
export function DialogClose(props: ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export interface DialogContentProps extends ComponentProps<typeof DialogPrimitive.Content> {
  /**
   * Largura máxima: `sm` (384px), `md` (512px) ou `lg` (672px). No celular, ocupa a largura toda
   * com margem.
   * @default "md"
   */
  size?: DialogContentVariants["size"];
  /**
   * Mostra o botão de fechar (X) no canto. Esc e clique fora continuam fechando sem ele.
   * @default true
   */
  showCloseButton?: boolean;
  /**
   * Nome do botão de fechar para leitores de tela.
   * @default "Fechar"
   */
  closeLabel?: string;
}

/**
 * Conteúdo do Dialog, num portal no `<body>`, com o fundo escurecido. Precisa de um
 * `DialogTitle`; sem `DialogDescription`, passe `aria-describedby={undefined}`.
 */
export function DialogContent({
  className,
  size,
  showCloseButton = true,
  closeLabel = "Fechar",
  children,
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay data-slot="dialog-overlay" className={dialogOverlayClasses} />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(dialogContentVariants({ size }), className)}
        {...props}
      >
        {children}
        {/* Por último no DOM: o foco inicial vai para o conteúdo, não para o X. */}
        {showCloseButton && (
          <DialogPrimitive.Close asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={closeLabel}
              className="absolute top-3 right-3 size-8 text-muted-foreground"
            >
              <CloseIcon />
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

/** Topo do Dialog: título e descrição. Deixa espaço à direita para o botão de fechar. */
export function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 pr-8", className)}
      {...props}
    />
  );
}

/** Rodapé com as ações. No celular, empilha com a ação principal em cima. */
export function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

/** Título do Dialog (`<h2>`), que também é o nome do modal para leitores de tela. Obrigatório. */
export function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-tight font-semibold", className)}
      {...props}
    />
  );
}

/** Texto de apoio, lido junto com o título quando o modal abre. */
export function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
