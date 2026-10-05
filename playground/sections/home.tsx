import { Card, CardDescription, CardHeader, CardTitle } from "../../src/index.ts";
import { pages } from "../pages.ts";

const install = `npm install istok-ui`;
const css = `@import "tailwindcss";
@import "istok-ui/theme.css";`;

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-sm">
      <code>{children}</code>
    </pre>
  );
}

/** Página inicial: instalação e a lista de componentes, cada um levando à sua página. */
export function HomeSection() {
  return (
    <>
      <section aria-labelledby="instalacao" className="space-y-3">
        <h2 id="instalacao" className="text-xl font-semibold">
          Instalação
        </h2>
        <Code>{install}</Code>
        <p className="text-sm text-muted-foreground">
          No CSS principal do projeto, logo depois do Tailwind:
        </p>
        <Code>{css}</Code>
      </section>
      <section aria-labelledby="componentes" className="space-y-3">
        <h2 id="componentes" className="text-xl font-semibold">
          Componentes
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pages
            .filter((page) => page.group === "Componentes")
            .map((page) => (
              <li key={page.id} className="flex">
                <Card asChild className="w-full gap-2 py-4 transition-colors hover:bg-accent">
                  <a href={`#/${page.id}`}>
                    <CardHeader className="px-4">
                      <CardTitle>{page.label}</CardTitle>
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
