import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Spinner } from "./spinner.tsx";

const sizes = ["sm", "md", "lg"] as const;

const meta = {
  title: "Componentes/Spinner",
  component: Spinner,
  argTypes: {
    // Os padrões ficam no cva e na desestruturação, onde o Storybook não enxerga.
    size: { control: "select", options: sizes, table: { defaultValue: { summary: "md" } } },
    label: { control: "text", table: { defaultValue: { summary: "Carregando" } } },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Spinner padrão. O `label` não aparece na tela, só para leitores de tela. */
export const Padrao: Story = {
  name: "Padrão",
  play: async ({ args, canvas }) => {
    await expect(canvas.getByRole("status")).toHaveTextContent(args.label ?? "Carregando");
  },
};

/** Tamanhos `sm` (16px), `md` (24px, padrão) e `lg` (32px). */
export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      {sizes.map((size) => (
        <Spinner key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

/** Usa a cor do texto em volta; troque com classes de texto. */
export const Cores: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Spinner {...args} />
      <Spinner {...args} className="text-muted-foreground" />
      <Spinner {...args} className="text-primary" />
      <Spinner {...args} className="text-destructive" />
    </div>
  ),
};

/** No tema escuro. */
export const CoresEscuro: Story = {
  ...Cores,
  name: "Cores (escuro)",
  globals: { theme: "escuro" },
};

/** Com texto visível ao lado: o `label` repete o texto para quem usa leitor de tela. */
export const ComTexto: Story = {
  name: "Com texto",
  render: () => (
    <p className="flex items-center gap-2 text-sm text-muted-foreground">
      <Spinner size="sm" label="Carregando pedidos" />
      <span aria-hidden="true">Carregando pedidos…</span>
    </p>
  ),
};
