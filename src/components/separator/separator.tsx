import type { ComponentProps } from "react";
import { Separator as SeparatorPrimitive } from "radix-ui";
import { cn } from "../../lib/cn.ts";

export interface SeparatorProps extends ComponentProps<typeof SeparatorPrimitive.Root> {
  /**
   * Direção da linha.
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";
  /**
   * Decorativo (padrão): leitores de tela ignoram. Use `false` quando a linha separa seções
   * com significado; aí ela vira `role="separator"`.
   * @default true
   */
  decorative?: boolean;
}

/**
 * Linha que separa conteúdos. Baseado no Separator do shadcn/ui (Radix).
 *
 * @example
 * ```tsx
 * <Separator />
 * <div className="flex h-5 items-center gap-3">
 *   Docs <Separator orientation="vertical" /> Blog
 * </div>
 * ```
 */
export function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className,
      )}
      {...props}
    />
  );
}
