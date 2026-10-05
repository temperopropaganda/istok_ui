import type { ComponentProps } from "react";
import { cn } from "../../lib/cn.ts";
import { useFieldControl } from "../field/field-context.ts";
import { textareaVariants, type TextareaVariants } from "./textarea.variants.ts";

export interface TextareaProps extends ComponentProps<"textarea"> {
  /**
   * Altura mínima e espaçamento: `sm`, `md` ou `lg`, combinando com o `Input` do mesmo tamanho.
   * @default "md"
   */
  size?: TextareaVariants["size"];
}

/**
 * Campo de texto com várias linhas (`<textarea>` nativo). Cresce com o conteúdo; limite com
 * classes (ex.: `max-h-48`). Dentro de um `Field`, recebe `id`, descrição, erro, `required` e
 * `disabled` sozinho.
 */
export function Textarea({ className, size, ...props }: TextareaProps) {
  const fieldProps = useFieldControl(props);
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants({ size }), className)}
      {...fieldProps}
    />
  );
}
