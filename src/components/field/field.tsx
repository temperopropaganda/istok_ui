import {
  use,
  useCallback,
  useId,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn.ts";
import { Label } from "../label/label.tsx";
import {
  FieldContext,
  FieldPartsContext,
  joinIds,
  useFieldPart,
  type FieldPart,
} from "./field-context.ts";
import { fieldVariants, type FieldVariants } from "./field.variants.ts";

type Parts = Record<FieldPart, string | null>;

/** Estado das peças de texto (rótulo, descrição, erro) registradas dentro de um Field/FieldSet. */
function useParts() {
  const [parts, setParts] = useState<Parts>({ label: null, description: null, error: null });
  const setPart = useCallback((part: FieldPart, id: string | null) => {
    setParts((current) => (current[part] === id ? current : { ...current, [part]: id }));
  }, []);
  const partsContext = useMemo(() => ({ setPart }), [setPart]);
  return { parts, partsContext };
}

export interface FieldProps extends ComponentProps<"div"> {
  /**
   * `vertical`: rótulo em cima do controle (campos de texto, RadioGroup).
   * `horizontal`: controle e rótulo lado a lado (Checkbox, Switch, item de RadioGroup).
   * @default "vertical"
   */
  orientation?: FieldVariants["orientation"];
  /**
   * Marca o controle como inválido (`aria-invalid`) e o rótulo na cor de erro. Sem a prop, fica
   * inválido sozinho quando há um `FieldError` com conteúdo.
   */
  invalid?: boolean;
  /** Repassa `required` ao controle e mostra `*` no `FieldLabel`. @default false */
  required?: boolean;
  /** Repassa `disabled` ao controle. @default false */
  disabled?: boolean;
}

/**
 * Agrupa um controle com `FieldLabel`, `FieldDescription` e `FieldError` e liga tudo sozinho:
 * `htmlFor`/`id`, `aria-describedby`, `aria-invalid`, `required` e `disabled`.
 *
 * Para ligar na mão, passe `htmlFor` no `FieldLabel` e `id` no controle (o que for passado vence
 * o automático). Para um controle próprio, use o hook `useFieldControl`.
 *
 * @example
 * ```tsx
 * <Field required>
 *   <FieldLabel>E-mail</FieldLabel>
 *   <Input type="email" name="email" />
 *   <FieldDescription>Usado só para recuperar a senha.</FieldDescription>
 *   <FieldError>{erros.email}</FieldError>
 * </Field>
 * ```
 */
export function Field({
  className,
  orientation,
  invalid,
  required = false,
  disabled = false,
  ...props
}: FieldProps) {
  const controlId = useId();
  const { parts, partsContext } = useParts();
  const isInvalid = invalid ?? parts.error !== null;
  const describedBy = joinIds(parts.description, parts.error);
  const field = useMemo(
    () => ({
      controlId,
      labelId: parts.label ?? undefined,
      describedBy,
      invalid: isInvalid,
      required,
      disabled,
    }),
    [controlId, parts.label, describedBy, isInvalid, required, disabled],
  );

  return (
    <FieldContext value={field}>
      <FieldPartsContext value={partsContext}>
        <div
          data-slot="field"
          data-orientation={orientation ?? "vertical"}
          data-invalid={isInvalid || undefined}
          data-disabled={disabled || undefined}
          className={cn(fieldVariants({ orientation }), className)}
          {...props}
        />
      </FieldPartsContext>
    </FieldContext>
  );
}

/** Rótulo do `Field`: aponta para o controle sozinho e mostra `*` quando o `Field` é `required`. */
export function FieldLabel({
  className,
  id,
  htmlFor,
  children,
  ...props
}: ComponentProps<typeof Label>) {
  const field = use(FieldContext);
  const autoId = useId();
  const labelId = id ?? autoId;
  useFieldPart("label", labelId);

  return (
    <Label
      data-slot="field-label"
      id={labelId}
      htmlFor={htmlFor ?? field?.controlId}
      className={cn(
        "gap-1",
        // Estado do Field mais próximo (pelo contexto): um seletor `group-data-*` pegaria também
        // o Field de fora, e as opções de um RadioGroup inválido ficariam vermelhas.
        field?.invalid && "text-destructive",
        // Desabilitado: cor de apoio em vez de opacidade, para o rótulo continuar legível (AA).
        field?.disabled && "cursor-not-allowed text-muted-foreground",
        "group-has-[>:disabled]/field:cursor-not-allowed group-has-[>:disabled]/field:text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
      {/* O controle já é anunciado como obrigatório (`required`); o `*` é só visual. */}
      {field?.required && (
        <span aria-hidden="true" className="text-destructive">
          *
        </span>
      )}
    </Label>
  );
}

/** Texto de apoio do `Field` (ou do `FieldSet`), lido junto com o controle (`aria-describedby`). */
export function FieldDescription({ className, id, ...props }: ComponentProps<"p">) {
  const autoId = useId();
  const descriptionId = id ?? autoId;
  useFieldPart("description", descriptionId);

  return (
    <p
      data-slot="field-description"
      id={descriptionId}
      className={cn("text-sm leading-normal font-normal text-muted-foreground", className)}
      {...props}
    />
  );
}

export interface FieldErrorProps extends ComponentProps<"div"> {
  /**
   * Erros no formato do react-hook-form/zod (`{ message?: string }`). Mensagens repetidas são
   * juntadas; com mais de uma, vira lista. `children`, se houver, vence.
   */
  errors?: ({ message?: string } | undefined)[];
}

/**
 * Mensagem de erro do `Field` (ou do `FieldSet`). Só aparece com conteúdo; quando aparece, marca o
 * `Field` como inválido e é lida junto com o controle (`aria-describedby`).
 *
 * Não é `role="alert"`: num envio com vários erros, anunciar todos de uma vez vira ruído. No envio,
 * leve o foco ao primeiro campo inválido. Para validar enquanto a pessoa digita, passe `role="alert"`.
 */
export function FieldError({ className, id, errors, children, ...props }: FieldErrorProps) {
  const autoId = useId();
  const errorId = id ?? autoId;
  const messages = [
    ...new Set(
      errors?.map((error) => error?.message).filter((message): message is string => !!message),
    ),
  ];

  let content: ReactNode = children;
  if (!content && messages.length === 1) content = messages[0];
  if (!content && messages.length > 1) {
    content = (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    );
  }

  const active = Boolean(content);
  useFieldPart("error", errorId, active);
  if (!active) return null;

  return (
    <div
      data-slot="field-error"
      id={errorId}
      className={cn("text-sm font-normal text-destructive", className)}
      {...props}
    >
      {content}
    </div>
  );
}

/** Coluna com rótulo e descrição ao lado do controle, num `Field` horizontal. */
export function FieldContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn("flex flex-1 flex-col gap-1.5 leading-snug", className)}
      {...props}
    />
  );
}

export interface FieldSetProps extends ComponentProps<"fieldset"> {
  /**
   * Marca a legenda na cor de erro. Sem a prop, fica inválido sozinho quando há um `FieldError`
   * com conteúdo direto no `FieldSet`.
   */
  invalid?: boolean;
}

/**
 * Agrupa vários `Field` relacionados (ex.: as opções de notificação) num `<fieldset>`, com
 * `FieldLegend` como nome do grupo. `FieldDescription` e `FieldError` diretos no `FieldSet` são
 * ligados ao grupo (`aria-describedby`). `disabled` desabilita todos os controles de dentro.
 */
export function FieldSet({
  className,
  invalid,
  "aria-describedby": ariaDescribedBy,
  ...props
}: FieldSetProps) {
  const { parts, partsContext } = useParts();
  const isInvalid = invalid ?? parts.error !== null;

  return (
    // Controles diretos no FieldSet não herdam um Field de fora.
    <FieldContext value={null}>
      <FieldPartsContext value={partsContext}>
        <fieldset
          data-slot="field-set"
          data-invalid={isInvalid || undefined}
          aria-describedby={joinIds(ariaDescribedBy, parts.description, parts.error)}
          className={cn("group/field-set flex min-w-0 flex-col gap-4", className)}
          {...props}
        />
      </FieldPartsContext>
    </FieldContext>
  );
}

/** Nome do `FieldSet` (`<legend>`). */
export function FieldLegend({ className, ...props }: ComponentProps<"legend">) {
  return (
    <legend
      data-slot="field-legend"
      className={cn(
        "mb-3 text-sm font-medium group-data-[invalid=true]/field-set:text-destructive",
        className,
      )}
      {...props}
    />
  );
}
