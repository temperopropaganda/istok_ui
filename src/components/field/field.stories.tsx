import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { expect } from "storybook/test";
import { Button } from "../button/button.tsx";
import { Checkbox } from "../checkbox/checkbox.tsx";
import { Input } from "../input/input.tsx";
import { RadioGroup, RadioGroupItem } from "../radio-group/radio-group.tsx";
import { Switch } from "../switch/switch.tsx";
import { Textarea } from "../textarea/textarea.tsx";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "./field.tsx";
import { useFieldControl } from "./field-context.ts";

const meta = {
  title: "Componentes/Field",
  component: Field,
  subcomponents: {
    FieldLabel,
    FieldDescription,
    FieldError,
    FieldContent,
    FieldSet,
    FieldLegend,
  },
  args: { invalid: undefined, required: false, disabled: false },
  argTypes: {
    // O padrão fica no cva, onde o Storybook não enxerga: declarado aqui para a tabela.
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
      table: { defaultValue: { summary: "vertical" } },
    },
    invalid: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Rótulo, campo e descrição ligados sozinhos (`htmlFor`/`id` e `aria-describedby`). Use os
 * controles para testar `invalid`, `required` e `disabled`.
 */
export const Padrao: Story = {
  name: "Padrão",
  render: (args) => (
    <Field {...args}>
      <FieldLabel>E-mail</FieldLabel>
      <Input type="email" placeholder="voce@empresa.com" />
      <FieldDescription>Usado só para recuperar a senha.</FieldDescription>
    </Field>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "E-mail" })).toHaveAccessibleDescription(
      "Usado só para recuperar a senha.",
    );
  },
};

/** Com `FieldError`: o campo fica inválido sozinho e o erro entra na descrição. */
export const ComErro: Story = {
  name: "Com erro",
  render: (args) => (
    <Field {...args}>
      <FieldLabel>E-mail</FieldLabel>
      <Input type="email" defaultValue="ana@" />
      <FieldError>Informe um e-mail válido, como ana@empresa.com.</FieldError>
    </Field>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "E-mail" });
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(input).toHaveAccessibleDescription(
      "Informe um e-mail válido, como ana@empresa.com.",
    );
  },
};

/** Obrigatório: `required` no campo e `*` visual no rótulo (fora do nome acessível). */
export const Obrigatorio: Story = {
  name: "Obrigatório",
  args: { required: true },
  render: (args) => (
    <Field {...args}>
      <FieldLabel>Nome completo</FieldLabel>
      <Input />
    </Field>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "Nome completo" })).toBeRequired();
  },
};

/** Estados no tema escuro. */
export const EstadosEscuro: Story = {
  name: "Estados (escuro)",
  globals: { theme: "escuro" },
  render: () => (
    <div className="grid gap-6">
      <Field required>
        <FieldLabel>Nome</FieldLabel>
        <Input placeholder="Ana Souza" />
        <FieldDescription>Como aparece no seu perfil.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>E-mail</FieldLabel>
        <Input defaultValue="ana@" />
        <FieldError>Informe um e-mail válido.</FieldError>
      </Field>
      <Field disabled>
        <FieldLabel>Empresa</FieldLabel>
        <Input defaultValue="Tempero" />
      </Field>
    </div>
  ),
};

/** Horizontal: controle e rótulo lado a lado, com descrição em `FieldContent`. */
export const Horizontal: Story = {
  render: () => (
    <div className="grid gap-4">
      <Field orientation="horizontal">
        <Checkbox />
        <FieldContent>
          <FieldLabel>Aceito os termos de uso</FieldLabel>
          <FieldDescription>Leia os termos antes de continuar.</FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <Switch />
        <FieldLabel>Notificações por e-mail</FieldLabel>
      </Field>
    </div>
  ),
};

/** `FieldSet` agrupa vários campos com `FieldLegend`; descrição e erro vão para o grupo. */
export const Grupo: Story = {
  render: () => (
    <FieldSet>
      <FieldLegend>Notificações</FieldLegend>
      <FieldDescription>Escolha como quer ser avisado.</FieldDescription>
      <Field orientation="horizontal">
        <Checkbox />
        <FieldLabel>Por e-mail</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Checkbox />
        <FieldLabel>Por SMS</FieldLabel>
      </Field>
      <FieldError>Escolha pelo menos uma opção.</FieldError>
    </FieldSet>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("group", { name: "Notificações" })).toHaveAccessibleDescription(
      "Escolha como quer ser avisado. Escolha pelo menos uma opção.",
    );
  },
};

/** RadioGroup num `Field`: o rótulo de fora nomeia o grupo; o erro e o `required` também vão. */
export const ComRadioGroup: Story = {
  name: "Com RadioGroup",
  args: { required: true },
  render: (args) => (
    <Field {...args}>
      <FieldLabel>Plano</FieldLabel>
      <RadioGroup>
        <Field orientation="horizontal">
          <RadioGroupItem value="mensal" />
          <FieldLabel>Mensal</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="anual" />
          <FieldLabel>Anual</FieldLabel>
        </Field>
      </RadioGroup>
      <FieldError>Escolha um plano.</FieldError>
    </Field>
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole("radiogroup", { name: "Plano" });
    await expect(group).toHaveAttribute("aria-required", "true");
    await expect(group).toHaveAccessibleDescription("Escolha um plano.");
  },
};

/** Ligação manual: `htmlFor` e `id` informados vencem o automático. */
export const LigacaoManual: Story = {
  name: "Ligação manual",
  render: () => (
    <Field>
      <FieldLabel htmlFor="cupom">Cupom de desconto</FieldLabel>
      <Input id="cupom" aria-describedby="cupom-regras" />
      <p id="cupom-regras" className="text-sm text-muted-foreground">
        Um cupom por pedido.
      </p>
    </Field>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Cupom de desconto" });
    await expect(input).toHaveAttribute("id", "cupom");
    await expect(input).toHaveAccessibleDescription("Um cupom por pedido.");
  },
};

/** Um `<select>` nativo ligado ao `Field` com o hook `useFieldControl`. */
function NativeSelect(props: ComponentProps<"select">) {
  const fieldProps = useFieldControl(props);
  return (
    <select
      className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      {...fieldProps}
    />
  );
}

/** Controle próprio (ou de outra biblioteca) ligado com `useFieldControl`. */
export const ControleProprio: Story = {
  name: "Controle próprio (useFieldControl)",
  render: () => (
    <Field>
      <FieldLabel>Estado</FieldLabel>
      <NativeSelect defaultValue="SP">
        <option value="SP">São Paulo</option>
        <option value="RJ">Rio de Janeiro</option>
      </NativeSelect>
      <FieldDescription>Onde fica a sede da empresa.</FieldDescription>
    </Field>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("combobox", { name: "Estado" })).toHaveAccessibleDescription(
      "Onde fica a sede da empresa.",
    );
  },
};

/** Formulário completo com todos os controles. */
export const Formulario: Story = {
  name: "Formulário",
  render: () => (
    <form
      className="grid gap-6"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Field required>
        <FieldLabel>Nome</FieldLabel>
        <Input name="nome" />
      </Field>
      <Field>
        <FieldLabel>Mensagem</FieldLabel>
        <Textarea name="mensagem" />
        <FieldDescription>Opcional.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>Plano</FieldLabel>
        <RadioGroup name="plano" defaultValue="mensal" orientation="horizontal">
          <Field orientation="horizontal">
            <RadioGroupItem value="mensal" />
            <FieldLabel>Mensal</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="anual" />
            <FieldLabel>Anual</FieldLabel>
          </Field>
        </RadioGroup>
      </Field>
      <Field orientation="horizontal">
        <Switch name="novidades" />
        <FieldLabel>Receber novidades</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Checkbox name="termos" />
        <FieldLabel>Aceito os termos</FieldLabel>
      </Field>
      <Button type="submit" className="justify-self-start">
        Enviar
      </Button>
    </form>
  ),
};

/** O formulário no tema escuro. */
export const FormularioEscuro: Story = {
  ...Formulario,
  name: "Formulário (escuro)",
  globals: { theme: "escuro" },
};
