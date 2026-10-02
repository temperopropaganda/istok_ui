import { cn } from "../src/index.ts";

export function App() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className={cn("text-3xl font-bold text-neutral-900", "text-neutral-950")}>istok_ui</h1>
      <p className="mt-2 text-neutral-600">
        Playground de desenvolvimento. Importe os componentes de <code>../src</code> e teste aqui.
      </p>
    </main>
  );
}
