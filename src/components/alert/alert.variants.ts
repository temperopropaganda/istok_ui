import { cva, type VariantProps } from "class-variance-authority";

// Baseado no Alert do shadcn/ui, com `success` e `warning` dos tokens da istok_ui. As variantes
// coloridas usam fundo tingido e texto `foreground`: texto na cor do token não passa no AA em
// todos os casos (o `warning` claro fica em ~2:1 sobre fundo claro).
export const alertVariants = cva(
  [
    "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm",
    "has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3",
    "[&>svg]:size-4 [&>svg]:translate-y-0.5",
  ],
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "border-destructive bg-destructive/10 text-foreground *:data-[slot=alert-description]:text-foreground [&>svg]:text-destructive",
        success:
          "border-success bg-success/10 text-foreground *:data-[slot=alert-description]:text-foreground [&>svg]:text-success",
        // Ícone sem a cor do token: o `warning` claro não chega a 3:1 sobre fundo claro.
        warning:
          "border-warning bg-warning/10 text-foreground *:data-[slot=alert-description]:text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type AlertVariants = VariantProps<typeof alertVariants>;
