import { cva, type VariantProps } from "class-variance-authority";

// Baseado no Dialog do shadcn/ui. Compartilhado com o AlertDialog. As animações ficam atrás de
// `motion-safe:`: um `motion-reduce:animate-none` perderia para o `data-[state=…]:` (mais específico).

/** Fundo escurecido atrás do modal. */
export const dialogOverlayClasses =
  "fixed inset-0 z-50 bg-overlay motion-safe:data-[state=closed]:animate-fade-out motion-safe:data-[state=open]:animate-fade-in";

export const dialogContentVariants = cva(
  [
    "fixed top-1/2 left-1/2 z-50 grid max-h-[calc(100%-2rem)] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-lg border bg-popover p-6 text-popover-foreground shadow-lg outline-none",
    "motion-safe:data-[state=closed]:animate-zoom-out motion-safe:data-[state=open]:animate-zoom-in",
  ],
  {
    variants: {
      size: {
        sm: "sm:max-w-sm",
        md: "sm:max-w-lg",
        lg: "sm:max-w-2xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type DialogContentVariants = VariantProps<typeof dialogContentVariants>;
