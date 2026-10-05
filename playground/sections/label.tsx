import { Input, Label } from "../../src/index.ts";
import { Example } from "../section.tsx";

export function LabelSection() {
  return (
    <>
      <Example label="Com campo">
        <div className="grid w-full max-w-md gap-2">
          <Label htmlFor="label-demo-nome">Nome completo</Label>
          <Input id="label-demo-nome" />
        </div>
      </Example>
      <Example label="Controle desabilitado (peer)">
        <div className="flex items-center gap-2">
          <input id="label-demo-desabilitado" type="checkbox" disabled className="peer" />
          <Label htmlFor="label-demo-desabilitado">Opção indisponível</Label>
        </div>
      </Example>
    </>
  );
}
