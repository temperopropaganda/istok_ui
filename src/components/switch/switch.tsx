import type { ComponentProps } from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cn } from "../../lib/cn.ts";
import { useFieldControl } from "../field/field-context.ts";

export type SwitchProps = ComponentProps<typeof SwitchPrimitive.Root>;

/**
 * Liga/desliga com efeito imediato (`role="switch"`, Espaço alterna). Para uma escolha que só vale
 * ao enviar o formulário, prefira `Checkbox`. Dentro de um `<form>`, envia `name`/`value` quando
 * ligado.
 *
 * Use num `Field orientation="horizontal"` com `FieldLabel` ao lado.
 *
 * @example
 * ```tsx
 * <Field orientation="horizontal">
 *   <Switch name="notificacoes" />
 *   <FieldLabel>Notificações por e-mail</FieldLabel>
 * </Field>
 * ```
 */
export function Switch({ className, ...props }: SwitchProps) {
  const fieldProps = useFieldControl(props);
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent shadow-xs transition-colors outline-none",
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:ring-[3px] aria-invalid:ring-destructive/40",
        className,
      )}
      {...fieldProps}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-4 rounded-full bg-background shadow-sm transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 motion-reduce:transition-none"
      />
    </SwitchPrimitive.Root>
  );
}
