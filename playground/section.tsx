import { useId, type ReactNode } from "react";
import { BrandLogo, BrandWaves } from "./brand.tsx";

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
      <header className={id ? "preview-page-heading space-y-3" : "brand-hero"}>
        {!id && <BrandWaves />}
        <p className="relative text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          {id ? "Tempero Design System / Biblioteca" : "Design que conecta"}
        </p>
        <h1
          id={`${id || "inicio"}-titulo`}
          tabIndex={-1}
          aria-label={!id ? title : undefined}
          className="relative text-4xl font-semibold tracking-tight outline-none"
        >
          {id ? title : <BrandLogo className="brand-hero-logo" />}
        </h1>
        {!id && (
          <p className="relative max-w-lg text-2xl leading-tight font-medium tracking-tight sm:text-3xl">
            Uma base comum.
            <br />
            Infinitas possibilidades.
          </p>
        )}
        {description && (
          <p className="relative max-w-2xl text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
        {!id && (
          <div className="relative flex flex-wrap gap-2 pt-1">
            {["React 19", "TypeScript", "Tailwind CSS 4"].map((label) => (
              <span
                key={label}
                className="rounded-full border px-3 py-1 text-xs text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>
        )}
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
      <div className="preview-example flex flex-wrap items-center gap-3 rounded-xl border bg-card p-6">
        {children}
      </div>
    </div>
  );
}
