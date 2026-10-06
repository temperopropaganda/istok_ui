import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { Button } from "../button/button.tsx";
import { ProductCard } from "./product-card.tsx";

// Imagem embutida (SVG), para as stories não dependerem de rede.
const bottle =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23fde68a'/><path d='M78 52h44v18c0 8 14 14 14 30v66a12 12 0 0 1-12 12H76a12 12 0 0 1-12-12V100c0-16 14-22 14-30z' fill='%23fafafa'/><path d='M68 112h64v54a8 8 0 0 1-8 8H76a8 8 0 0 1-8-8z' fill='%23f59e0b'/></svg>";

const onAdd = fn();

const meta = {
  title: "Componentes/ProductCard",
  component: ProductCard,
  args: {
    name: "Suco de laranja integral",
    href: "#produto",
    image: bottle,
    price: 9.9,
    originalPrice: 12.9,
    badge: "-23%",
    badgeVariant: "destructive",
    options: ["300 ml", "1 L", "1,5 L"],
    optionsLabel: "Tamanhos",
    rating: 4.5,
    reviewCount: 128,
    action: (
      <Button size="sm" className="w-full" onClick={onAdd}>
        Adicionar
      </Button>
    ),
  },
  argTypes: {
    // Os padrões ficam na desestruturação, onde o Storybook não enxerga: declarados aqui.
    currency: { control: "text", table: { defaultValue: { summary: '"BRL"' } } },
    locale: { control: "text", table: { defaultValue: { summary: '"pt-BR"' } } },
    headingLevel: {
      control: "select",
      options: [2, 3, 4],
      table: { defaultValue: { summary: "3" } },
    },
    action: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="max-w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Completo: selo, variações, avaliação, preço de/por e ação. Use os controles para testar cada parte. */
export const Padrao: Story = {
  name: "Padrão",
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole("article", { name: "Suco de laranja integral" })).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Suco de laranja integral" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Adicionar" }));
    await expect(onAdd).toHaveBeenCalled();
  },
};

/** No tema escuro. */
export const PadraoEscuro: Story = {
  ...Padrao,
  name: "Padrão (escuro)",
  globals: { theme: "escuro" },
};

/** Só o obrigatório: nome e preço (sem imagem, aparece um espaço neutro). */
export const Minimo: Story = {
  name: "Mínimo",
  args: {
    name: "Água mineral sem gás",
    price: 2.5,
    href: undefined,
    image: undefined,
    originalPrice: undefined,
    badge: undefined,
    options: undefined,
    rating: undefined,
    reviewCount: undefined,
    action: undefined,
  },
};
