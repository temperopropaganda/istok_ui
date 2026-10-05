import { Spinner, type SpinnerProps } from "../../src/index.ts";
import { Example } from "../section.tsx";

const sizes: NonNullable<SpinnerProps["size"]>[] = ["sm", "md", "lg"];

export function SpinnerSection() {
  return (
    <>
      <Example label="Tamanhos">
        {sizes.map((size) => (
          <Spinner key={size} size={size} label={`Carregando (${size})`} />
        ))}
      </Example>
      <Example label="Cores">
        <Spinner label="Carregando (foreground)" />
        <Spinner className="text-muted-foreground" label="Carregando (muted)" />
        <Spinner className="text-primary" label="Carregando (primary)" />
        <Spinner className="text-destructive" label="Carregando (destructive)" />
      </Example>
      <Example label="Com texto">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner size="sm" label="Carregando pedidos" />
          <span aria-hidden="true">Carregando pedidos…</span>
        </p>
      </Example>
    </>
  );
}
