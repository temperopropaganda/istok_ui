import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Input } from "../input/input.tsx";
import { Label } from "./label.tsx";

const meta = {
  title: "Componentes/Label",
  component: Label,
  args: { children: "Nome completo" },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Ligado ao campo pelo `htmlFor`. Dentro de um `Field`, use `FieldLabel` (liga sozinho). */
export const Padrao: Story = {
  name: "Padrão",
  render: (args) => (
    <div className="grid max-w-sm gap-2">
      <Label {...args} htmlFor="label-nome" />
      <Input id="label-nome" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "Nome completo" })).toBeVisible();
  },
};

/** No tema escuro. */
export const PadraoEscuro: Story = {
  ...Padrao,
  name: "Padrão (escuro)",
  globals: { theme: "escuro" },
};

/** Com o controle desabilitado logo antes (classe `peer`), o rótulo fica na cor de apoio. */
export const Desabilitado: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <input id="label-desabilitado" type="checkbox" disabled className="peer" />
      <Label {...args} htmlFor="label-desabilitado">
        Opção indisponível
      </Label>
    </div>
  ),
};
