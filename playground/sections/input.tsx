import { Button, Input, type InputProps } from "../../src/index.ts";
import { Example } from "../section.tsx";

const sizes: NonNullable<InputProps["size"]>[] = ["sm", "md", "lg"];

export function InputSection() {
  return (
    <>
      <Example label="Tamanhos">
        <div className="grid w-full max-w-md gap-3">
          {sizes.map((size) => (
            <div key={size} className="flex gap-2">
              <Input size={size} aria-label={`Busca (${size})`} placeholder={`Buscar… (${size})`} />
              <Button size={size} variant="outline">
                Buscar
              </Button>
            </div>
          ))}
        </div>
      </Example>
      <Example label="Estados">
        <div className="grid w-full max-w-md gap-3">
          <Input aria-label="Normal" placeholder="Normal" />
          <Input aria-label="Preenchido" defaultValue="Preenchido" />
          <Input aria-label="Desabilitado" placeholder="Desabilitado" disabled />
          <Input aria-label="Somente leitura" defaultValue="Somente leitura" readOnly />
          <Input aria-label="Inválido" defaultValue="email@" aria-invalid />
        </div>
      </Example>
      <Example label="Tipos">
        <div className="grid w-full max-w-md gap-3">
          <Input type="email" aria-label="E-mail" placeholder="voce@empresa.com" />
          <Input type="password" aria-label="Senha" placeholder="Senha" />
          <Input type="number" aria-label="Quantidade" placeholder="0" />
          <Input type="file" aria-label="Arquivo" />
        </div>
      </Example>
    </>
  );
}
