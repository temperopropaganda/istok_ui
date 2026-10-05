import { use, type ComponentProps } from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { cn } from "../../lib/cn.ts";
import { FieldContext, useFieldControl } from "../field/field-context.ts";
import { radioGroupVariants, type RadioGroupVariants } from "./radio-group.variants.ts";

export interface RadioGroupProps extends Omit<
  ComponentProps<typeof RadioGroupPrimitive.Root>,
  "orientation"
> {
  /**
   * Disposição das opções: uma por linha ou lado a lado (quebrando linha se faltar espaço).
   * As setas funcionam nas duas direções em qualquer orientação.
   * @default "vertical"
   */
  orientation?: RadioGroupVariants["orientation"];
}

/**
 * Grupo de opções exclusivas (Radix). Tab entra e sai do grupo; as setas trocam a opção marcada.
 * Dentro de um `<form>`, envia `name` com o `value` marcado.
 *
 * Num `Field`, o `FieldLabel` vira o nome do grupo (`aria-labelledby`) e a descrição, o erro,
 * `required` e `disabled` vão para o grupo. Cada opção vai num `Field orientation="horizontal"`
 * próprio, com `RadioGroupItem` e `FieldLabel`.
 */
export function RadioGroup({ className, orientation, children, ...props }: RadioGroupProps) {
  const field = use(FieldContext);
  const fieldProps = useFieldControl(props);
  const labelledBy = props["aria-label"] ? undefined : field?.labelId;

  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      aria-labelledby={labelledBy}
      className={cn(radioGroupVariants({ orientation }), className)}
      {...fieldProps}
    >
      {/* As opções não herdam o Field do grupo (cada uma tem o seu, ou nenhum). */}
      <FieldContext value={null}>{children}</FieldContext>
    </RadioGroupPrimitive.Root>
  );
}

export type RadioGroupItemProps = ComponentProps<typeof RadioGroupPrimitive.Item>;

/** Opção do `RadioGroup`. Precisa de `value` e de um rótulo (`FieldLabel` ou `Label`). */
export function RadioGroupItem({ className, ...props }: RadioGroupItemProps) {
  const fieldProps = useFieldControl(props);
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "aspect-square size-4 shrink-0 rounded-full border border-input shadow-xs transition-[color,box-shadow] outline-none",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-primary",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...fieldProps}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center"
      >
        <span className="size-2 rounded-full bg-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}
