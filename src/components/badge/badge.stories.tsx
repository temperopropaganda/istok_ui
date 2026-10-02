import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge.tsx";

const variants = ["default", "secondary", "outline", "destructive", "success", "warning"] as const;

const meta = {
  title: "Componentes/Badge",
  component: Badge,
  args: { children: "Novo" },
  argTypes: {
    // O padrão fica no cva, onde o Storybook não enxerga: declarado aqui para a tabela.
    variant: {
      control: "select",
      options: variants,
      table: { defaultValue: { summary: "default" } },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Badge padrão. Use os controles para testar as variantes. */
export const Padrao: Story = { name: "Padrão" };

/** Todas as variantes lado a lado. */
export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {variants.map((variant) => (
        <Badge key={variant} {...args} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};

/** Todas as variantes no tema escuro (o teste de a11y confere o contraste). */
export const VariantesEscuro: Story = {
  ...Variantes,
  name: "Variantes (escuro)",
  globals: { theme: "escuro" },
};

/** Com `asChild`, o badge vira um link (ex.: filtro clicável). */
export const ComoLink: Story = {
  name: "Como link (asChild)",
  args: { asChild: true, variant: "outline", children: <a href="#design">#design</a> },
};
