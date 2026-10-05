import type { ComponentProps } from "react";
import { Label as LabelPrimitive } from "radix-ui";
import { cn } from "../../lib/cn.ts";

export type LabelProps = ComponentProps<typeof LabelPrimitive.Root>;

/**
 * Rótulo de um controle (`<label>`). Ligue pelo `htmlFor` com o `id` do controle, ou envolva o
 * controle. Dentro de um `Field`, prefira o `FieldLabel`, que se liga sozinho.
 *
 * Com o controle desabilitado logo antes (classe `peer`), o rótulo fica na cor de apoio.
 *
 * @example
 * ```tsx
 * <Label htmlFor="cupom">Cupom</Label>
 * <Input id="cupom" />
 * ```
 */
export function Label({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-snug font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
