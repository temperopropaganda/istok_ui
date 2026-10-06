import type { ComponentProps } from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { cn } from "../../lib/cn.ts";

/**
 * Seções que abrem e fecham (Radix). `type="single"` abre uma por vez (com `collapsible`, dá para
 * fechar a aberta); `type="multiple"` abre várias. Enter/Espaço alternam; setas, Home e End andam
 * entre os títulos.
 *
 * @example
 * ```tsx
 * <Accordion type="single" collapsible defaultValue="entrega">
 *   <AccordionItem value="entrega">
 *     <AccordionTrigger>Qual o prazo de entrega?</AccordionTrigger>
 *     <AccordionContent>De 3 a 5 dias úteis para capitais.</AccordionContent>
 *   </AccordionItem>
 *   <AccordionItem value="troca">
 *     <AccordionTrigger>Posso trocar o produto?</AccordionTrigger>
 *     <AccordionContent>Sim, em até 30 dias após o recebimento.</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 * ```
 */
export function Accordion(props: ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

/** Uma seção do Accordion. Precisa de um `value` único. */
export function AccordionItem({
  className,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  );
}

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground motion-safe:transition-transform motion-safe:duration-200"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/**
 * Título clicável da seção (um `<button>` dentro de um `<h3>`). `aria-expanded` e `aria-controls`
 * ficam por conta do Radix.
 */
export function AccordionTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium outline-none hover:underline",
          "focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:pointer-events-none disabled:opacity-50",
          "[&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

/** Conteúdo da seção. Anima a altura ao abrir e fechar (só com `motion-safe`). */
export function AccordionContent({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-sm motion-safe:data-[state=closed]:animate-accordion-up motion-safe:data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
