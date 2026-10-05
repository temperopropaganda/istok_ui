import { Textarea, type TextareaProps } from "../../src/index.ts";
import { Example, Section } from "../section.tsx";

const sizes: NonNullable<TextareaProps["size"]>[] = ["sm", "md", "lg"];

export function TextareaSection() {
  return (
    <Section
      id="textarea"
      title="Textarea"
      description="Texto com várias linhas. Cresce com o conteúdo a partir da altura mínima."
    >
      <Example label="Tamanhos">
        <div className="grid w-full max-w-md gap-3">
          {sizes.map((size) => (
            <Textarea
              key={size}
              size={size}
              aria-label={`Mensagem (${size})`}
              placeholder={`Mensagem (${size})`}
            />
          ))}
        </div>
      </Example>
      <Example label="Estados">
        <div className="grid w-full max-w-md gap-3">
          <Textarea aria-label="Desabilitado" placeholder="Desabilitado" disabled />
          <Textarea aria-label="Inválido" defaultValue="Texto curto" aria-invalid />
        </div>
      </Example>
    </Section>
  );
}
