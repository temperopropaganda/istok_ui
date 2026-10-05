import { cva, type VariantProps } from "class-variance-authority";

// Baseado no Input do shadcn/ui. Alturas iguais às do Button (sm 32px, md 36px, lg 40px) para
// alinhar campo e botão na mesma linha. `text-base` no celular evita o zoom automático do iOS.
export const inputVariants = cva(
  [
    "flex w-full min-w-0 rounded-md border border-input bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
    "selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground",
    "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
    "focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  ],
  {
    variants: {
      size: {
        sm: "h-8 px-2.5 py-1",
        md: "h-9 px-3 py-1",
        lg: "h-10 px-3.5 py-1.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type InputVariants = VariantProps<typeof inputVariants>;
