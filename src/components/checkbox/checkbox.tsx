import type { ComponentProps } from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { cn } from "../../lib/cn.ts";
import { useFieldControl } from "../field/field-context.ts";

export type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root>;

/**
 * Caixa de seleção (Radix): marcada, desmarcada ou indeterminada (`checked="indeterminate"`, para
 * "selecionar todos" parcial). Espaço alterna. Dentro de um `<form>`, envia `name`/`value` como um
 * checkbox nativo.
 *
 * Use num `Field orientation="horizontal"` com `FieldLabel` ao lado.
 */
export function Checkbox({ className, ...props }: CheckboxProps) {
  const fieldProps = useFieldControl(props);
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      // Raio de até 4px: acompanha marcas de cantos retos (`--radius: 0`) sem virar círculo.
      className={cn(
        "peer size-4 shrink-0 rounded-[min(4px,var(--radius))] border border-input shadow-xs transition-shadow outline-none",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...fieldProps}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="group/indicator flex items-center justify-center text-current"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-3.5 group-data-[state=indeterminate]/indicator:hidden"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="hidden size-3.5 group-data-[state=indeterminate]/indicator:block"
        >
          <path d="M5 12h14" />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
