import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect } from "storybook/test";
import { Field, FieldContent, FieldDescription, FieldLabel } from "../field/field.tsx";
import { Checkbox } from "./checkbox.tsx";

const meta = {
  title: "Componentes/Checkbox",
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Num `Field` horizontal, com `FieldLabel` ao lado: clicar no texto também marca. */
export const Padrao: Story = {
  name: "Padrão",
  render: (args) => (
    <Field orientation="horizontal">
      <Checkbox {...args} />
      <FieldLabel>Aceito os termos de uso</FieldLabel>
    </Field>
  ),
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "Aceito os termos de uso" });
    await userEvent.click(canvas.getByText("Aceito os termos de uso"));
    await expect(checkbox).toBeChecked();
  },
};

/** Com descrição abaixo do rótulo (`FieldContent`). */
export const ComDescricao: Story = {
  name: "Com descrição",
  render: (args) => (
    <Field orientation="horizontal" className="max-w-sm">
      <Checkbox {...args} defaultChecked />
      <FieldContent>
        <FieldLabel>Receber novidades</FieldLabel>
        <FieldDescription>No máximo um e-mail por semana. Cancele quando quiser.</FieldDescription>
      </FieldContent>
    </Field>
  ),
};

const states = [
  { label: "Desmarcado", props: {} },
  { label: "Marcado", props: { defaultChecked: true } },
  { label: "Indeterminado", props: { checked: "indeterminate" as const } },
  { label: "Desabilitado", props: { disabled: true } },
  { label: "Desabilitado e marcado", props: { disabled: true, defaultChecked: true } },
  { label: "Inválido", props: { "aria-invalid": true } },
];

/** Todos os estados. */
export const Estados: Story = {
  render: () => (
    <div className="grid gap-3">
      {states.map(({ label, props }) => (
        <Field key={label} orientation="horizontal">
          <Checkbox {...props} />
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

const fruits = ["Maçã", "Banana", "Uva"];

/** "Selecionar todos" fica indeterminado quando só parte da lista está marcada. */
export const SelecionarTodos: Story = {
  name: "Selecionar todos",
  render: function SelecionarTodos() {
    const [selected, setSelected] = useState<string[]>(["Maçã"]);
    const all =
      selected.length === fruits.length ? true : selected.length > 0 ? "indeterminate" : false;
    return (
      <div className="grid gap-3">
        <Field orientation="horizontal">
          <Checkbox
            checked={all}
            onCheckedChange={(checked) => {
              setSelected(checked === true ? fruits : []);
            }}
          />
          <FieldLabel>Selecionar todas</FieldLabel>
        </Field>
        {fruits.map((fruit) => (
          <Field key={fruit} orientation="horizontal" className="pl-6">
            <Checkbox
              checked={selected.includes(fruit)}
              onCheckedChange={(checked) => {
                setSelected((current) =>
                  checked === true ? [...current, fruit] : current.filter((item) => item !== fruit),
                );
              }}
            />
            <FieldLabel>{fruit}</FieldLabel>
          </Field>
        ))}
      </div>
    );
  },
  play: async ({ canvas, userEvent }) => {
    const all = canvas.getByRole("checkbox", { name: "Selecionar todas" });
    await expect(all).toHaveAttribute("aria-checked", "mixed");
    await userEvent.click(all);
    await expect(canvas.getByRole("checkbox", { name: "Uva" })).toBeChecked();
    await expect(all).toHaveAttribute("aria-checked", "true");
  },
};
