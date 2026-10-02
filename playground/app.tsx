import { useEffect, useState } from "react";
import { Button } from "../src/index.ts";
import { ButtonSection } from "./sections/button.tsx";
import { TokensSection } from "./sections/tokens.tsx";

// Vitrine: todos os componentes da lib numa página só. Componente novo = seção nova aqui.
const sections = [
  { id: "tokens", label: "Tokens" },
  { id: "button", label: "Button" },
];

export function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-8 py-3">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold">istok_ui</h1>
            <nav aria-label="Seções">
              <ul className="flex gap-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <Button asChild variant="ghost" size="sm">
                      <a href={`#${section.id}`}>{section.label}</a>
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <Button
            variant="outline"
            size="sm"
            aria-pressed={dark}
            onClick={() => {
              setDark((value) => !value);
            }}
          >
            Tema escuro
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl space-y-12 px-8 py-10">
        <TokensSection />
        <ButtonSection />
      </main>
    </>
  );
}
