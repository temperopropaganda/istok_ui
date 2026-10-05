import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Button } from "../button/button.tsx";
import { Input } from "./input.tsx";

const sizes = ["sm", "md", "lg"] as const;

const meta = {
  title: "Componentes/Input",
  component: Input,
  args: { "aria-label": "Nome", placeholder: "Ana Souza" },
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
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Campo padrão. Num formulário, use dentro de um `Field` com `FieldLabel`. */
export const Padrao: Story = {
  name: "Padrão",
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole("textbox", { name: "Nome" });
    await userEvent.type(input, "Ana");
    await expect(input).toHaveValue("Ana");
  },
};

/** Alturas iguais às do Button no mesmo tamanho, para alinhar campo e botão. */
export const Tamanhos: Story = {
  render: (args) => (
    <div className="space-y-3">
      {sizes.map((size) => (
        <div key={size} className="flex gap-2">
          <Input {...args} size={size} aria-label={`Busca (${size})`} placeholder="Buscar…" />
          <Button size={size} variant="outline">
            Buscar
          </Button>
        </div>
      ))}
    </div>
  ),
};

/** Estados: normal, preenchido, desabilitado, somente leitura e inválido. */
export const Estados: Story = {
  render: () => (
    <div className="space-y-3">
      <Input aria-label="Normal" placeholder="Normal" />
      <Input aria-label="Preenchido" defaultValue="Preenchido" />
      <Input aria-label="Desabilitado" placeholder="Desabilitado" disabled />
      <Input aria-label="Somente leitura" defaultValue="Somente leitura" readOnly />
      <Input aria-label="Inválido" defaultValue="email@" aria-invalid />
    </div>
  ),
};

/** Estados no tema escuro (o teste de a11y confere o contraste). */
export const EstadosEscuro: Story = {
  ...Estados,
  name: "Estados (escuro)",
  globals: { theme: "escuro" },
};

/** Tipos nativos: o teclado do celular e a validação do navegador acompanham o `type`. */
export const Tipos: Story = {
  render: () => (
    <div className="space-y-3">
      <Input type="email" aria-label="E-mail" placeholder="voce@empresa.com" />
      <Input type="password" aria-label="Senha" placeholder="Senha" />
      <Input type="number" aria-label="Quantidade" placeholder="0" />
      <Input type="search" aria-label="Busca" placeholder="Buscar…" />
      <Input type="file" aria-label="Arquivo" />
    </div>
  ),
};
