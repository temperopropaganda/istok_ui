import { useEffect, useState } from "react";
import { cn } from "../src/index.ts";

// Classes escritas por inteiro para o Tailwind encontrar (nada de `bg-${nome}`).
const colorPairs = [
  { name: "background", className: "bg-background text-foreground" },
  { name: "card", className: "bg-card text-card-foreground" },
  { name: "popover", className: "bg-popover text-popover-foreground" },
  { name: "primary", className: "bg-primary text-primary-foreground" },
  { name: "secondary", className: "bg-secondary text-secondary-foreground" },
  { name: "muted", className: "bg-muted text-muted-foreground" },
  { name: "accent", className: "bg-accent text-accent-foreground" },
  { name: "destructive", className: "bg-destructive text-destructive-foreground" },
  { name: "success", className: "bg-success text-success-foreground" },
  { name: "warning", className: "bg-warning text-warning-foreground" },
];

const radii = [
  { name: "sm", className: "rounded-sm" },
  { name: "md", className: "rounded-md" },
  { name: "lg", className: "rounded-lg" },
  { name: "xl", className: "rounded-xl" },
];

export function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <main className="mx-auto max-w-4xl space-y-10 p-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">istok_ui</h1>
          <p className="mt-1 text-muted-foreground">Tokens do tema</p>
        </div>
        <button
          type="button"
          aria-pressed={dark}
          onClick={() => {
            setDark((value) => !value);
          }}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {dark ? "Tema claro" : "Tema escuro"}
        </button>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Cores</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {colorPairs.map((pair) => (
            <li
              key={pair.name}
              className={cn("flex h-20 items-end rounded-lg border p-3 text-sm", pair.className)}
            >
              {pair.name}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="rounded-md border-2 border-border px-3 py-2">border</span>
          <span className="rounded-md border-2 border-input px-3 py-2">input</span>
          <span className="rounded-md px-3 py-2 ring-2 ring-ring">ring</span>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Raio</h2>
        <ul className="flex flex-wrap gap-4">
          {radii.map((radius) => (
            <li
              key={radius.name}
              className={cn(
                "flex size-20 items-center justify-center border bg-muted text-sm",
                radius.className,
              )}
            >
              {radius.name}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
