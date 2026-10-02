import { useId, type ReactNode } from "react";

interface SectionProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}

/** Seção da vitrine: um componente (ou fundamento) com todas as variações. */
export function Section({ id, title, description, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="scroll-mt-20 space-y-4">
      <header>
        <h2 id={`${id}-titulo`} className="text-xl font-semibold">
          {title}
        </h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </header>
      {children}
    </section>
  );
}

interface ExampleProps {
  label: string;
  children: ReactNode;
}

/** Linha rotulada dentro de uma seção (ex.: "Tamanhos", "Desabilitado"). */
export function Example({ label, children }: ExampleProps) {
  const labelId = useId();
  return (
    <div role="group" aria-labelledby={labelId} className="space-y-2">
      <h3 id={labelId} className="text-sm font-medium text-muted-foreground">
        {label}
      </h3>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}
