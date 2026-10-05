import { cva, type VariantProps } from "class-variance-authority";

// Baseado no Field do shadcn/ui. `horizontal` é para checkbox, radio e switch com o rótulo ao lado.
export const fieldVariants = cva("group/field flex w-full", {
  variants: {
    orientation: {
      vertical: "flex-col gap-2",
      horizontal: [
        "flex-row items-center gap-3",
        // Com rótulo + descrição (FieldContent), o controle alinha com a primeira linha.
        "has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:*:data-[slot=checkbox]:mt-0.5 has-[>[data-slot=field-content]]:*:data-[slot=radio-group-item]:mt-0.5",
      ],
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

export type FieldVariants = VariantProps<typeof fieldVariants>;
