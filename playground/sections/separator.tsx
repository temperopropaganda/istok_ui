import { Separator } from "../../src/index.ts";
import { Example } from "../section.tsx";

export function SeparatorSection() {
  return (
    <>
      <Example label="Horizontal">
        <div className="w-full max-w-sm text-sm">
          <p className="font-medium">istok_ui</p>
          <p className="text-muted-foreground">Biblioteca de componentes.</p>
          <Separator className="my-4" />
          <p>Documentação · Componentes · Tokens</p>
        </div>
      </Example>
      <Example label="Vertical">
        <div className="flex h-5 items-center gap-4 text-sm">
          <span>Documentação</span>
          <Separator orientation="vertical" />
          <span>Componentes</span>
          <Separator orientation="vertical" />
          <span>Tokens</span>
        </div>
      </Example>
    </>
  );
}
