import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Field, FieldDescription, FieldLabel } from "../field/field.tsx";
import { RadioGroup, RadioGroupItem } from "./radio-group.tsx";

const plans = [
  { value: "mensal", label: "Mensal", description: "R$ 49 por mês" },
  { value: "anual", label: "Anual", description: "R$ 490 por ano (2 meses grátis)" },
  { value: "vitalicio", label: "Vitalício", description: "Pagamento único" },
];

const meta = {
  title: "Componentes/RadioGroup",
  component: RadioGroup,
  subcomponents: { RadioGroupItem },
  args: { defaultValue: "anual" },
  argTypes: {
    // O padrão fica no cva, onde o Storybook não enxerga: declarado aqui para a tabela.
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
      table: { defaultValue: { summary: "vertical" } },
    },
  },
  render: (args) => (
    <Field>
      <FieldLabel>Plano</FieldLabel>
      <RadioGroup {...args}>
        {plans.map((plan) => (
          <Field key={plan.value} orientation="horizontal">
            <RadioGroupItem value={plan.value} />
            <FieldLabel>{plan.label}</FieldLabel>
          </Field>
        ))}
      </RadioGroup>
    </Field>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Num `Field`: o `FieldLabel` de fora nomeia o grupo; cada opção tem seu `Field` horizontal.
 * Tab entra pela opção marcada; as setas trocam.
 */
export const Padrao: Story = {
  name: "Padrão",
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole("radiogroup", { name: "Plano" })).toBeVisible();
    await userEvent.click(canvas.getByText("Mensal"));
    await expect(canvas.getByRole("radio", { name: "Mensal" })).toBeChecked();
  },
};

/** No tema escuro. */
export const PadraoEscuro: Story = {
  ...Padrao,
  name: "Padrão (escuro)",
  globals: { theme: "escuro" },
};

/** Opções lado a lado. */
export const Horizontal: Story = {
  args: { orientation: "horizontal" },
};

/** Com descrição em cada opção. */
export const ComDescricao: Story = {
  name: "Com descrição",
  render: (args) => (
    <Field>
      <FieldLabel>Plano</FieldLabel>
      <RadioGroup {...args}>
        {plans.map((plan) => (
          <Field key={plan.value} orientation="horizontal">
            <RadioGroupItem value={plan.value} />
            <div className="grid gap-1">
              <FieldLabel>{plan.label}</FieldLabel>
              <FieldDescription>{plan.description}</FieldDescription>
            </div>
          </Field>
        ))}
      </RadioGroup>
    </Field>
  ),
};

/** Uma opção desabilitada (o teclado pula) e o grupo inteiro desabilitado. */
export const Desabilitado: Story = {
  render: (args) => (
    <div className="grid gap-6">
      <Field>
        <FieldLabel>Entrega</FieldLabel>
        <RadioGroup {...args} defaultValue="normal">
          <Field orientation="horizontal">
            <RadioGroupItem value="normal" />
            <FieldLabel>Normal</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="expressa" disabled />
            <FieldLabel>Expressa (indisponível)</FieldLabel>
          </Field>
        </RadioGroup>
      </Field>
      <Field disabled>
        <FieldLabel>Plano</FieldLabel>
        <RadioGroup {...args}>
          {plans.map((plan) => (
            <Field key={plan.value} orientation="horizontal">
              <RadioGroupItem value={plan.value} />
              <FieldLabel>{plan.label}</FieldLabel>
            </Field>
          ))}
        </RadioGroup>
      </Field>
    </div>
  ),
};
