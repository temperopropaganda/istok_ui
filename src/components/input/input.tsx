import type { ComponentProps } from "react";
import { cn } from "../../lib/cn.ts";
import { useFieldControl } from "../field/field-context.ts";
import { inputVariants, type InputVariants } from "./input.variants.ts";

// O `size` nativo do <input> (largura em caracteres) dá lugar ao tamanho visual; use classes de
// largura (ex.: `w-48`).
export interface InputProps extends Omit<ComponentProps<"input">, "size"> {
  /**
   * Altura: `sm` (32px), `md` (36px) ou `lg` (40px), iguais às do `Button`.
   * @default "md"
   */
  size?: InputVariants["size"];
}

/**
 * Campo de texto (`<input>` nativo: funciona com formulários, `FormData` e react-hook-form).
 * Dentro de um `Field`, recebe `id`, descrição, erro, `required` e `disabled` sozinho.
 */
export function Input({ className, size, ...props }: InputProps) {
  const fieldProps = useFieldControl(props);
  return (
    <input data-slot="input" className={cn(inputVariants({ size }), className)} {...fieldProps} />
  );
}
