import { useId, type ReactNode } from "react";

interface PageViewProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}

/**
 * Tela da vitrine: título (`<h1>`, que recebe o foco ao trocar de página), descrição e exemplos.
 * É uma região nomeada pelo título, para os testes e leitores de tela acharem a página.
 */
export function PageView({ id, title, description, children }: PageViewProps) {
  return (
    <section aria-labelledby={`${id || "inicio"}-titulo`} className="space-y-10">
      <header className="space-y-2">
        <h1
          id={`${id || "inicio"}-titulo`}
          tabIndex={-1}
          className="text-3xl font-bold tracking-tight outline-none"
        >
          {title}
        </h1>
        {description && <p className="text-lg text-muted-foreground">{description}</p>}
      </header>
      {children}
    </section>
  );
}

interface ExampleProps {
  label: string;
  children: ReactNode;
}

/** Exemplo rotulado dentro de uma página (ex.: "Tamanhos", "Desabilitado"), num quadro de prévia. */
export function Example({ label, children }: ExampleProps) {
  const labelId = useId();
  return (
    <div role="group" aria-labelledby={labelId} className="space-y-3">
      <h2 id={labelId} className="text-base font-semibold">
        {label}
      </h2>
      <div className="flex flex-wrap items-center gap-3 rounded-lg border p-6">{children}</div>
    </div>
  );
}
