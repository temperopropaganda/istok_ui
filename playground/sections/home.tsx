import { Card, CardDescription, CardHeader, CardTitle } from "../../src/index.ts";
import { pages } from "../pages.ts";
import { ChevronRightIcon } from "../icons.tsx";

const install = `npm install istok-ui`;
const css = `@import "tailwindcss";
@import "istok-ui/theme.css";`;

function Code({ children }: { children: string }) {
  return (
    <pre className="preview-code overflow-x-auto rounded-xl border bg-muted p-4 text-sm leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

/** Página inicial: instalação e a lista de componentes, cada um levando à sua página. */
export function HomeSection() {
  return (
    <>
      <section aria-labelledby="instalacao" className="space-y-4">
        <p className="text-xs font-medium tracking-[0.16em] text-primary uppercase">
          Comece a criar
        </p>
        <h2 id="instalacao" className="text-xl font-semibold">
          Instalação
        </h2>
        <Code>{install}</Code>
        <p className="text-sm text-muted-foreground">
          No CSS principal do projeto, logo depois do Tailwind:
        </p>
        <Code>{css}</Code>
      </section>
      <section aria-labelledby="componentes" className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <h2 id="componentes" className="text-xl font-semibold">
            Componentes
          </h2>
          <span className="rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
            {pages.filter((page) => page.group === "Componentes").length} componentes
          </span>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pages
            .filter((page) => page.group === "Componentes")
            .map((page) => (
              <li key={page.id} className="flex">
                <Card
                  asChild
                  className="preview-component-card group w-full gap-2 py-5 transition-colors hover:border-primary/50 hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <a href={`#/${page.id}`}>
                    <CardHeader className="px-4">
                      <CardTitle className="flex items-center justify-between gap-2">
                        {page.label}
                        <span className="size-4 text-muted-foreground group-hover:text-primary">
                          <ChevronRightIcon />
                        </span>
                      </CardTitle>
                      <CardDescription>{page.description}</CardDescription>
                    </CardHeader>
                  </a>
                </Card>
              </li>
            ))}
        </ul>
      </section>
    </>
  );
}
