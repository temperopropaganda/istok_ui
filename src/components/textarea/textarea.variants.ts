import { cva, type VariantProps } from "class-variance-authority";

// Baseado no Textarea do shadcn/ui: cresce com o conteúdo (`field-sizing-content`) a partir da
// altura mínima. Espaçamento interno igual ao do Input no mesmo tamanho.
export const textareaVariants = cva(
  [
    "flex field-sizing-content w-full rounded-md border border-input bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
    "selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground",
    "focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  ],
  {
    variants: {
      size: {
        sm: "min-h-14 px-2.5 py-1.5",
        md: "min-h-16 px-3 py-2",
        lg: "min-h-20 px-3.5 py-2.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type TextareaVariants = VariantProps<typeof textareaVariants>;
