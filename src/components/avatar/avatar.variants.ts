import { cva, type VariantProps } from "class-variance-authority";

export const avatarVariants = cva("relative flex shrink-0 overflow-hidden rounded-full", {
  variants: {
    size: {
      sm: "size-6 text-xs",
      md: "size-8 text-sm",
      lg: "size-10 text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type AvatarVariants = VariantProps<typeof avatarVariants>;
