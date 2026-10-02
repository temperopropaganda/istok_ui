import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar.tsx";

// Imagem embutida (SVG), para as stories não dependerem de rede.
const photo =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' fill='%2394a3b8'/><circle cx='20' cy='16' r='7' fill='%23f1f5f9'/><rect x='8' y='26' width='24' height='14' rx='7' fill='%23f1f5f9'/></svg>";

const sizes = ["sm", "md", "lg"] as const;

const meta = {
  title: "Componentes/Avatar",
  component: Avatar,
  subcomponents: { AvatarImage, AvatarFallback },
  argTypes: {
    // O padrão fica no cva, onde o Storybook não enxerga: declarado aqui para a tabela.
    size: { control: "select", options: sizes, table: { defaultValue: { summary: "md" } } },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Com imagem. O `alt` é o nome da pessoa. */
export const ComImagem: Story = {
  name: "Com imagem",
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src={photo} alt="Ana Souza" />
      <AvatarFallback aria-label="Ana Souza">AS</AvatarFallback>
    </Avatar>
  ),
};

/** Sem imagem (ou quando ela falha): mostra as iniciais. */
export const Fallback: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="/imagem-que-nao-existe.png" alt="Bruno Lima" />
      <AvatarFallback aria-label="Bruno Lima">BL</AvatarFallback>
    </Avatar>
  ),
};

/** Tamanhos `sm`, `md` (padrão) e `lg`. */
export const Tamanhos: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {sizes.map((size) => (
        <Avatar key={size} size={size}>
          <AvatarFallback aria-label={`Ana Souza (${size})`}>AS</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};

/** Fallback no tema escuro (o teste de a11y confere o contraste das iniciais). */
export const FallbackEscuro: Story = {
  ...Fallback,
  name: "Fallback (escuro)",
  globals: { theme: "escuro" },
};
