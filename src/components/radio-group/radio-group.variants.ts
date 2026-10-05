import { cva, type VariantProps } from "class-variance-authority";

// Só o layout: as setas funcionam nas duas direções em qualquer orientação (WAI-ARIA APG).
export const radioGroupVariants = cva("", {
  variants: {
    orientation: {
      vertical: "grid gap-3",
      horizontal: "flex flex-wrap gap-x-6 gap-y-3",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

export type RadioGroupVariants = VariantProps<typeof radioGroupVariants>;
