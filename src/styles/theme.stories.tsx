import type { Meta, StoryObj } from "@storybook/react-vite";
import { cn } from "../lib/cn.ts";

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

function ColorTokens() {
  return (
    <div className="space-y-4 bg-background p-4 text-foreground">
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
    </div>
  );
}

function RadiusTokens() {
  return (
    <ul className="flex flex-wrap gap-4 bg-background p-4 text-foreground">
      {radii.map((radius) => (
        <li
          key={radius.name}
          className={cn(
            "flex size-20 items-center justify-center border bg-muted text-sm text-muted-foreground",
            radius.className,
          )}
        >
          {radius.name}
        </li>
      ))}
    </ul>
  );
}

const meta = {
  title: "Fundamentos/Tokens",
  parameters: { layout: "fullscreen" },
  tags: ["!autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Cada fundo com seu par `*-foreground`. O teste de a11y confere o contraste (WCAG AA). */
export const Cores: Story = {
  render: () => <ColorTokens />,
};

/** Mesmas cores no tema escuro (classe `dark` no `<html>`). */
export const CoresEscuro: Story = {
  name: "Cores (escuro)",
  render: () => <ColorTokens />,
  globals: { theme: "escuro" },
};

/** Escala de raio derivada de `--radius`. */
export const Raio: Story = {
  render: () => <RadiusTokens />,
};
