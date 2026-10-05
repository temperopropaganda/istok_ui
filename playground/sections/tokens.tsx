import { cn } from "../../src/index.ts";
import { Example } from "../section.tsx";

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

export function TokensSection() {
  return (
    <>
      <Example label="Cores">
        <ul className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {colorPairs.map((pair) => (
            <li
              key={pair.name}
              className={cn("flex h-20 items-end rounded-lg border p-3 text-sm", pair.className)}
            >
              {pair.name}
            </li>
          ))}
        </ul>
      </Example>
      <Example label="Bordas e foco">
        <span className="rounded-md border-2 border-border px-3 py-2 text-sm">border</span>
        <span className="rounded-md border-2 border-input px-3 py-2 text-sm">input</span>
        <span className="rounded-md px-3 py-2 text-sm ring-2 ring-ring">ring</span>
      </Example>
      <Example label="Raio">
        {radii.map((radius) => (
          <span
            key={radius.name}
            className={cn(
              "flex size-16 items-center justify-center border bg-muted text-sm text-muted-foreground",
              radius.className,
            )}
          >
            {radius.name}
          </span>
        ))}
      </Example>
    </>
  );
}
