import { cva, type VariantProps } from "class-variance-authority";

// Sem equivalente estilizado no shadcn/ui (o dele é só um ícone do lucide); segue o mesmo formato.
export const spinnerVariants = cva("inline-flex shrink-0 items-center justify-center", {
  variants: {
    size: {
      sm: "size-4",
      md: "size-6",
      lg: "size-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type SpinnerVariants = VariantProps<typeof spinnerVariants>;
