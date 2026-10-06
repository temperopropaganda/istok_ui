import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { NewsCard } from "./news-card.tsx";

// Capa embutida (SVG), para as stories não dependerem de rede.
const cover =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 180'><rect width='320' height='180' fill='%23bae6fd'/><path d='M0 140 Q80 80 160 130 T320 120V180H0z' fill='%230ea5e9'/></svg>";

// Props em união (com capa ou só texto): tipado pelo componente, e não com `satisfies`, para os
// args de cada story aceitarem uma das duas formas.
const meta: Meta<typeof NewsCard> = {
  title: "Componentes/NewsCard",
  component: NewsCard,
  args: {
    image: cover,
    title: "Feira de design reúne 200 expositores no centro da cidade",
    href: "#noticia",
    excerpt: "Evento segue até domingo, com entrada gratuita e oficinas para crianças.",
    date: "2026-10-05",
  },
  argTypes: {
    // Os padrões ficam na desestruturação, onde o Storybook não enxerga: declarados aqui.
    variant: {
      control: "select",
      options: ["default", "simple"],
      table: { defaultValue: { summary: '"default"' } },
    },
    locale: { control: "text", table: { defaultValue: { summary: '"pt-BR"' } } },
    headingLevel: {
      control: "select",
      options: [2, 3, 4],
      table: { defaultValue: { summary: "3" } },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NewsCard>;

/** Com imagem de capa. O card inteiro é clicável; o link fica no título. */
export const Padrao: Story = {
  name: "Padrão (com capa)",
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", {
      name: "Feira de design reúne 200 expositores no centro da cidade",
    });
    await expect(link).toHaveAttribute("href", "#noticia");
    await expect(canvas.getByText("5 de out. de 2026")).toHaveAttribute("datetime", "2026-10-05");
  },
};

/** No tema escuro. */
export const PadraoEscuro: Story = {
  ...Padrao,
  name: "Padrão (escuro)",
  globals: { theme: "escuro" },
};

/** Só texto (`variant="simple"`). */
export const Simples: Story = {
  args: { variant: "simple", image: undefined },
};
