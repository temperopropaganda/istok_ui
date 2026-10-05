import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Textarea } from "./textarea.tsx";

const sizes = ["sm", "md", "lg"] as const;

const meta = {
  title: "Componentes/Textarea",
  component: Textarea,
  args: { "aria-label": "Mensagem", placeholder: "Escreva sua mensagem…" },
  argTypes: {
    // O padrão fica no cva, onde o Storybook não enxerga: declarado aqui para a tabela.
    size: { control: "select", options: sizes, table: { defaultValue: { summary: "md" } } },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Cresce com o texto a partir da altura mínima. Limite com classes (ex.: `max-h-48`). */
export const Padrao: Story = {
  name: "Padrão",
  play: async ({ canvas, userEvent }) => {
    const textarea = canvas.getByRole("textbox", { name: "Mensagem" });
    const before = textarea.getBoundingClientRect().height;
    await userEvent.type(textarea, "linha 1{enter}linha 2{enter}linha 3{enter}linha 4");
    await expect(textarea.getBoundingClientRect().height).toBeGreaterThan(before);
  },
};

/** Tamanhos `sm`, `md` (padrão) e `lg`. */
export const Tamanhos: Story = {
  render: (args) => (
    <div className="space-y-3">
      {sizes.map((size) => (
        <Textarea key={size} {...args} size={size} aria-label={`Mensagem (${size})`} />
      ))}
    </div>
  ),
};

/** Estados: normal, desabilitado e inválido. */
export const Estados: Story = {
  render: () => (
    <div className="space-y-3">
      <Textarea aria-label="Normal" placeholder="Normal" />
      <Textarea aria-label="Desabilitado" placeholder="Desabilitado" disabled />
      <Textarea aria-label="Inválido" defaultValue="Texto curto" aria-invalid />
    </div>
  ),
};

/** Estados no tema escuro. */
export const EstadosEscuro: Story = {
  ...Estados,
  name: "Estados (escuro)",
  globals: { theme: "escuro" },
};
