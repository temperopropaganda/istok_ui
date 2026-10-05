import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Field, FieldContent, FieldDescription, FieldLabel } from "../field/field.tsx";
import { Switch } from "./switch.tsx";

const meta = {
  title: "Componentes/Switch",
  component: Switch,
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Num `Field` horizontal, com `FieldLabel` ao lado. */
export const Padrao: Story = {
  name: "Padrão",
  render: (args) => (
    <Field orientation="horizontal">
      <Switch {...args} />
      <FieldLabel>Modo avião</FieldLabel>
    </Field>
  ),
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole("switch", { name: "Modo avião" });
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-checked", "true");
  },
};

/** Com descrição, rótulo à esquerda e switch à direita (padrão de tela de configurações). */
export const Configuracao: Story = {
  name: "Configuração",
  render: (args) => (
    <Field orientation="horizontal" className="max-w-sm justify-between rounded-lg border p-4">
      <FieldContent>
        <FieldLabel>E-mails de marketing</FieldLabel>
        <FieldDescription>Receba novidades e ofertas.</FieldDescription>
      </FieldContent>
      <Switch {...args} defaultChecked />
    </Field>
  ),
};

const states = [
  { label: "Desligado", props: {} },
  { label: "Ligado", props: { defaultChecked: true } },
  { label: "Desabilitado", props: { disabled: true } },
  { label: "Desabilitado e ligado", props: { disabled: true, defaultChecked: true } },
];

/** Todos os estados. */
export const Estados: Story = {
  render: () => (
    <div className="grid gap-3">
      {states.map(({ label, props }) => (
        <Field key={label} orientation="horizontal">
          <Switch {...props} />
          <FieldLabel>{label}</FieldLabel>
        </Field>
      ))}
    </div>
  ),
};

/** Todos os estados no tema escuro. */
export const EstadosEscuro: Story = {
  ...Estados,
  name: "Estados (escuro)",
  globals: { theme: "escuro" },
};
