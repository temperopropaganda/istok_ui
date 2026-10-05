import { createContext, use, type ComponentProps } from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import { cn } from "../../lib/cn.ts";

// Indica se já há um TooltipProvider em volta (o Radix exige um; sem ele, cada Tooltip cria o seu).
const InsideProvider = createContext(false);

/**
 * Opcional: compartilha o atraso entre vários Tooltips (ex.: numa barra de ferramentas). Depois que
 * um abre, os vizinhos abrem na hora enquanto o ponteiro passa por eles.
 */
export function TooltipProvider({
  delayDuration = 300,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <InsideProvider value={true}>
      <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />
    </InsideProvider>
  );
}

/**
 * Dica curta que aparece com o ponteiro **ou o foco** no gatilho, depois de 300ms (`delayDuration`).
 * Esc fecha; dá para mover o ponteiro até a dica sem ela sumir (WCAG 1.4.13).
 *
 * É complemento: vira a descrição do gatilho (`aria-describedby`), não o nome. Botão só com ícone
 * continua precisando de `aria-label`. Não abre em telas de toque; não coloque nela informação que
 * só exista ali.
 *
 * @example
 * ```tsx
 * <Tooltip>
 *   <TooltipTrigger asChild>
 *     <Button size="icon" variant="ghost" aria-label="Negrito">
 *       <BoldIcon />
 *     </Button>
 *   </TooltipTrigger>
 *   <TooltipContent>Negrito (Ctrl+B)</TooltipContent>
 * </Tooltip>
 * ```
 */
export function Tooltip(props: ComponentProps<typeof TooltipPrimitive.Root>) {
  const root = <TooltipPrimitive.Root {...props} />;
  return use(InsideProvider) ? root : <TooltipProvider>{root}</TooltipProvider>;
}

/** Elemento que mostra a dica. Use `asChild` com um elemento focável (ex.: `Button`, `<a>`). */
export function TooltipTrigger(props: ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

/**
 * Conteúdo da dica, num portal no `<body>`. `side` escolhe o lado (`top` por padrão); o Radix troca
 * de lado se faltar espaço.
 */
export function TooltipContent({
  className,
  sideOffset = 4,
  children,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) rounded-md bg-foreground px-3 py-1.5 text-xs text-balance text-background",
          "motion-safe:animate-zoom-in motion-safe:data-[state=closed]:animate-zoom-out",
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}
