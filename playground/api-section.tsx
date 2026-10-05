import { Fragment, type ReactNode } from "react";
import { api, type BaseApi, type PartApi } from "./api.generated.ts";

// Seção "Propriedades" de cada página, a partir de playground/api.generated.ts (gerado dos tipos e do
// JSDoc de src/ por `npm run guide`): sempre igual ao código.

/** Texto com `código` inline. */
function inline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((piece, index) =>
    piece.startsWith("`") && piece.endsWith("`") ? (
      <code key={index} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">
        {piece.slice(1, -1)}
      </code>
    ) : (
      <Fragment key={index}>{piece}</Fragment>
    ),
  );
}

/** Descrição do JSDoc: parágrafos (linha em branco) e listas ("- "). */
function Description({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="space-y-2">
      {text.split(/\n\s*\n/).map((paragraph, index) => {
        const lines = paragraph.split("\n").map((line) => line.trim());
        const intro = lines.filter((line) => !line.startsWith("- ")).join(" ");
        const items = lines.filter((line) => line.startsWith("- ")).map((line) => line.slice(2));
        return (
          <Fragment key={index}>
            {intro && <p>{inline(intro)}</p>}
            {items.length > 0 && (
              <ul className="list-inside list-disc space-y-0.5">
                {items.map((item) => (
                  <li key={item}>{inline(item)}</li>
                ))}
              </ul>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

function Base({ base }: { base: BaseApi }) {
  const except =
    "except" in base && base.except.length > 0
      ? `, exceto ${base.except.map((name) => `\`${name}\``).join(", ")}`
      : "";
  if (base.kind === "native")
    return <>{inline(`as props nativas de \`<${base.element}>\`${except}`)}</>;
  if (base.kind === "radix") {
    return (
      <>
        as props de{" "}
        <a
          href={base.href}
          className="underline underline-offset-4"
          target="_blank"
          rel="noreferrer"
        >
          {base.primitive}.{base.part}
        </a>{" "}
        do Radix{inline(except)}
      </>
    );
  }
  return <>{inline(`as props de \`${base.name}\``)}</>;
}

function Part({ part }: { part: PartApi }) {
  const id = `api-${part.name}`;
  return (
    // Bloco com título, não região: o nome da peça (ex.: "Button") repetiria o da página.
    <div className="space-y-3">
      <h3 id={id} className="font-mono text-base font-semibold">
        {part.name}
      </h3>
      <div className="space-y-2 text-sm text-muted-foreground">
        <Description text={part.description} />
        {part.bases.length > 0 && (
          <p>
            Aceita{" "}
            {part.bases.map((base, index) => (
              <Fragment key={index}>
                {index > 0 && " e "}
                <Base base={base} />
              </Fragment>
            ))}
            .
          </p>
        )}
      </div>
      {part.props.length > 0 && (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Propriedades de {part.name}</caption>
            <thead className="border-b bg-muted/50 text-muted-foreground">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">
                  Prop
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Tipo
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Padrão
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Descrição
                </th>
              </tr>
            </thead>
            <tbody>
              {part.props.map((prop) => (
                <tr key={prop.name} className="border-b align-top last:border-b-0">
                  <th scope="row" className="px-3 py-2 font-normal whitespace-nowrap">
                    <code className="font-mono font-medium">{prop.name}</code>
                    {prop.required && (
                      <span className="ml-1 text-xs text-muted-foreground">(obrigatória)</span>
                    )}
                  </th>
                  <td className="px-3 py-2">
                    <code className="font-mono text-xs">{prop.type}</code>
                  </td>
                  <td className="px-3 py-2">
                    {prop.defaultValue ? (
                      <code className="font-mono text-xs">{prop.defaultValue}</code>
                    ) : (
                      <span aria-label="sem padrão">—</span>
                    )}
                  </td>
                  <td className="min-w-64 px-3 py-2 text-muted-foreground">
                    <Description text={prop.description} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/** "Propriedades" de um componente: cada peça com descrição, base e tabela de props. */
export function ApiSection({ id }: { id: string }) {
  const component = api[id];
  if (!component) return null;
  return (
    <section aria-labelledby="propriedades" className="space-y-8 border-t pt-10">
      <div className="space-y-1">
        <h2 id="propriedades" className="text-xl font-semibold">
          Propriedades
        </h2>
        <p className="text-sm text-muted-foreground">
          {inline(
            "Geradas dos tipos e do JSDoc do código. Além das listadas, cada peça aceita as props da base indicada (elemento nativo ou Radix), como `className`.",
          )}
        </p>
      </div>
      {component.parts.map((part) => (
        <Part key={part.name} part={part} />
      ))}
    </section>
  );
}
