import { createContext, use, useLayoutEffect, type AriaAttributes } from "react";

/** Estado de um `Field`, lido pelos controles dentro dele. */
export interface FieldContextValue {
  /** Id do controle (o `htmlFor` do `FieldLabel` aponta para ele). */
  controlId: string;
  /** Id do `FieldLabel`, para controles que não são `<label>`-áveis (ex.: `RadioGroup`). */
  labelId: string | undefined;
  /** Ids da descrição e do erro presentes, para o `aria-describedby`. */
  describedBy: string | undefined;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
}

export const FieldContext = createContext<FieldContextValue | null>(null);

export type FieldPart = "label" | "description" | "error";

/** Registro das peças de texto de um `Field` ou `FieldSet` (só entra no aria o que existe). */
export interface FieldPartsContextValue {
  setPart: (part: FieldPart, id: string | null) => void;
}

export const FieldPartsContext = createContext<FieldPartsContextValue | null>(null);

/** Registra a peça no `Field`/`FieldSet` mais próximo enquanto ela estiver na tela. */
export function useFieldPart(part: FieldPart, id: string, active = true) {
  const setPart = use(FieldPartsContext)?.setPart;
  useLayoutEffect(() => {
    if (!setPart || !active) return;
    setPart(part, id);
    return () => {
      setPart(part, null);
    };
  }, [setPart, part, id, active]);
}

/** Junta listas de ids do `aria-describedby`, ignorando as vazias. */
export function joinIds(...ids: (string | null | undefined)[]) {
  return ids.filter(Boolean).join(" ") || undefined;
}

/** Props que um controle recebe do `Field`. */
export interface FieldControlProps {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: AriaAttributes["aria-invalid"];
  required?: boolean;
  disabled?: boolean;
}

/**
 * Liga um controle ao `Field` em volta: `id` (para o `FieldLabel`), `aria-describedby` (descrição
 * e erro), `aria-invalid`, `required` e `disabled`. O que vier nas props vence o automático; o
 * `aria-describedby` informado é somado ao do `Field`. Fora de um `Field`, devolve as props como
 * vieram.
 *
 * Use para ligar um controle próprio (ou de outra biblioteca) ao `Field`:
 * `const fieldProps = useFieldControl(props); return <MeuSelect {...fieldProps} />;`
 */
export function useFieldControl<P extends FieldControlProps>(props: P): P {
  const field = use(FieldContext);
  if (!field) return props;
  return {
    ...props,
    id: props.id ?? field.controlId,
    "aria-describedby": joinIds(props["aria-describedby"], field.describedBy),
    "aria-invalid": props["aria-invalid"] ?? (field.invalid || undefined),
    required: props.required ?? (field.required || undefined),
    disabled: props.disabled ?? (field.disabled || undefined),
  };
}
