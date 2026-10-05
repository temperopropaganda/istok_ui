import { useState, type ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
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

// Cor de um token resolvida, para comparar com a de um elemento.
function tokenColor(className: string) {
  const probe = document.createElement("span");
  probe.className = className;
  document.body.append(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

const mutedColor = () => tokenColor("text-muted-foreground");
const destructiveColor = () => tokenColor("text-destructive");

const colorOf = (element: Element) => getComputedStyle(element).color;

describe("Field", () => {
  it("liga rótulo, descrição e controle sozinho", async () => {
    const screen = await render(
      <Field>
        <FieldLabel>E-mail</FieldLabel>
        <Input type="email" />
        <FieldDescription>Usado só para recuperar a senha.</FieldDescription>
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "E-mail" });

    await expect.element(input).toHaveAccessibleDescription("Usado só para recuperar a senha.");
    await expect.element(input).not.toHaveAttribute("aria-invalid");
  });

  it("sem descrição nem erro, não coloca aria-describedby", async () => {
    const screen = await render(
      <Field>
        <FieldLabel>Nome</FieldLabel>
        <Input />
      </Field>,
    );

    await expect.element(screen.getByRole("textbox")).not.toHaveAttribute("aria-describedby");
  });

  it("FieldError com conteúdo marca o campo como inválido e entra na descrição", async () => {
    const screen = await render(
      <Field>
        <FieldLabel>E-mail</FieldLabel>
        <Input />
        <FieldDescription>Seu e-mail de trabalho.</FieldDescription>
        <FieldError>Informe um e-mail válido.</FieldError>
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "E-mail" });

    await expect.element(input).toHaveAttribute("aria-invalid", "true");
    await expect
      .element(input)
      .toHaveAccessibleDescription("Seu e-mail de trabalho. Informe um e-mail válido.");
    expect(colorOf(screen.getByText("E-mail").element())).toBe(destructiveColor());
    expect(
      screen.container.querySelector('[data-slot="field"]')?.getAttribute("data-invalid"),
    ).toBe("true");
  });

  it("erro que aparece e some atualiza aria-invalid e a descrição", async () => {
    function Dynamic() {
      const [error, setError] = useState<string>();
      return (
        <>
          <Field>
            <FieldLabel>CPF</FieldLabel>
            <Input />
            <FieldError>{error}</FieldError>
          </Field>
          <button
            type="button"
            onClick={() => {
              setError((value) => (value ? undefined : "CPF inválido."));
            }}
          >
            alternar
          </button>
        </>
      );
    }
    const screen = await render(<Dynamic />);
    const input = screen.getByRole("textbox", { name: "CPF" });
    const toggle = screen.getByRole("button", { name: "alternar" });

    await expect.element(input).not.toHaveAttribute("aria-invalid");
    await toggle.click();
    await expect.element(input).toHaveAttribute("aria-invalid", "true");
    await expect.element(input).toHaveAccessibleDescription("CPF inválido.");
    await toggle.click();
    await expect.element(input).not.toHaveAttribute("aria-invalid");
    await expect.element(input).not.toHaveAttribute("aria-describedby");
  });

  it("invalid explícito vence a detecção automática", async () => {
    const screen = await render(
      <>
        <Field invalid={false}>
          <FieldLabel>Sem marcação</FieldLabel>
          <Input />
          <FieldError>Mensagem só informativa.</FieldError>
        </Field>
        <Field invalid>
          <FieldLabel>Marcado</FieldLabel>
          <Input />
        </Field>
      </>,
    );

    await expect
      .element(screen.getByRole("textbox", { name: "Sem marcação" }))
      .not.toHaveAttribute("aria-invalid");
    await expect
      .element(screen.getByRole("textbox", { name: "Marcado" }))
      .toHaveAttribute("aria-invalid", "true");
  });

  it("required vai para o controle e o * do rótulo fica fora do nome acessível", async () => {
    const screen = await render(
      <Field required>
        <FieldLabel>Nome</FieldLabel>
        <Input />
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Nome" });

    await expect.element(input).toBeRequired();
    const asterisk = screen.getByText("*");
    await expect.element(asterisk).toHaveAttribute("aria-hidden", "true");
  });

  it("disabled vai para o controle e deixa o rótulo na cor de apoio", async () => {
    const screen = await render(
      <Field disabled>
        <FieldLabel>Empresa</FieldLabel>
        <Input />
      </Field>,
    );

    await expect.element(screen.getByRole("textbox", { name: "Empresa" })).toBeDisabled();
    expect(colorOf(screen.getByText("Empresa").element())).toBe(mutedColor());
  });

  it("controle desabilitado por conta própria também muda a cor do rótulo", async () => {
    const screen = await render(
      <Field>
        <FieldLabel>Empresa</FieldLabel>
        <Input disabled />
      </Field>,
    );

    expect(colorOf(screen.getByText("Empresa").element())).toBe(mutedColor());
  });

  it("ligação manual: htmlFor e id informados vencem; aria-describedby é somado", async () => {
    const screen = await render(
      <Field>
        <FieldLabel htmlFor="email-manual">E-mail</FieldLabel>
        <Input id="email-manual" aria-describedby="dica-externa" />
        <FieldDescription id="descricao-manual">Seu melhor e-mail.</FieldDescription>
        <p id="dica-externa">Nunca compartilhamos.</p>
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "E-mail" });

    await expect.element(input).toHaveAttribute("id", "email-manual");
    await expect
      .element(input)
      .toHaveAttribute("aria-describedby", "dica-externa descricao-manual");
  });

  it("cada Field gera ids próprios", async () => {
    const screen = await render(
      <>
        <Field>
          <FieldLabel>Nome</FieldLabel>
          <Input />
        </Field>
        <Field>
          <FieldLabel>Sobrenome</FieldLabel>
          <Input />
        </Field>
      </>,
    );

    const first = screen.getByRole("textbox", { name: "Nome" }).element().id;
    const second = screen.getByRole("textbox", { name: "Sobrenome" }).element().id;
    expect(first).not.toBe("");
    expect(first).not.toBe(second);
  });

  it("funciona com Textarea", async () => {
    const screen = await render(
      <Field>
        <FieldLabel>Mensagem</FieldLabel>
        <Textarea />
        <FieldDescription>Até 500 caracteres.</FieldDescription>
      </Field>,
    );

    await expect
      .element(screen.getByRole("textbox", { name: "Mensagem" }))
      .toHaveAccessibleDescription("Até 500 caracteres.");
  });

  it("horizontal com Checkbox e Switch: clicar no rótulo alterna o controle", async () => {
    const screen = await render(
      <>
        <Field orientation="horizontal">
          <Checkbox />
          <FieldContent>
            <FieldLabel>Aceito os termos</FieldLabel>
            <FieldDescription>Leia antes de aceitar.</FieldDescription>
          </FieldContent>
        </Field>
        <Field orientation="horizontal">
          <Switch />
          <FieldLabel>Notificações</FieldLabel>
        </Field>
      </>,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Aceito os termos" });
    const toggle = screen.getByRole("switch", { name: "Notificações" });

    await expect.element(checkbox).toHaveAccessibleDescription("Leia antes de aceitar.");
    await screen.getByText("Aceito os termos").click();
    await expect.element(checkbox).toBeChecked();
    await screen.getByText("Notificações").click();
    await expect.element(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("RadioGroup num Field: o rótulo nomeia o grupo e cada opção tem seu Field", async () => {
    const screen = await render(
      <Field required>
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
      </Field>,
    );
    const group = screen.getByRole("radiogroup", { name: "Plano" });

    await expect.element(group).toHaveAttribute("aria-required", "true");
    await expect.element(group).toHaveAttribute("aria-invalid", "true");
    await expect.element(group).toHaveAccessibleDescription("Escolha um plano.");
    const monthly = screen.getByRole("radio", { name: "Mensal" });
    const yearly = screen.getByRole("radio", { name: "Anual" });
    expect(monthly.element().id).not.toBe(yearly.element().id);
    await screen.getByText("Anual").click();
    await expect.element(yearly).toBeChecked();
  });

  it("RadioGroup inválido: só o rótulo do grupo fica na cor de erro, não o das opções", async () => {
    const screen = await render(
      <Field invalid>
        <FieldLabel>Plano</FieldLabel>
        <RadioGroup>
          <Field orientation="horizontal">
            <RadioGroupItem value="mensal" />
            <FieldLabel>Mensal</FieldLabel>
          </Field>
        </RadioGroup>
      </Field>,
    );

    expect(colorOf(screen.getByText("Plano").element())).toBe(destructiveColor());
    expect(colorOf(screen.getByText("Mensal").element())).not.toBe(destructiveColor());
  });

  it("opções de RadioGroup sem Field próprio não herdam o id do grupo", async () => {
    const screen = await render(
      <Field>
        <FieldLabel>Tamanho</FieldLabel>
        <RadioGroup>
          <RadioGroupItem value="p" aria-label="P" />
          <RadioGroupItem value="m" aria-label="M" />
        </RadioGroup>
      </Field>,
    );

    await expect.element(screen.getByRole("radio", { name: "P" })).not.toHaveAttribute("id");
    await expect.element(screen.getByRole("radio", { name: "M" })).not.toHaveAttribute("id");
  });

  it("FieldError com errors (react-hook-form/zod): junta repetidos e vira lista", async () => {
    const screen = await render(
      <>
        <Field>
          <FieldLabel>Senha</FieldLabel>
          <Input type="password" />
          <FieldError
            errors={[
              { message: "Mínimo de 8 caracteres." },
              { message: "Mínimo de 8 caracteres." },
            ]}
          />
        </Field>
        <Field>
          <FieldLabel>Usuário</FieldLabel>
          <Input />
          <FieldError
            errors={[{ message: "Obrigatório." }, undefined, { message: "Sem espaços." }]}
          />
        </Field>
        <Field>
          <FieldLabel>Apelido</FieldLabel>
          <Input />
          <FieldError errors={[undefined, {}]} />
        </Field>
      </>,
    );

    expect(screen.getByText("Mínimo de 8 caracteres.").elements()).toHaveLength(1);
    expect(screen.getByRole("listitem").elements()).toHaveLength(2);
    await expect
      .element(screen.getByRole("textbox", { name: "Apelido" }))
      .not.toHaveAttribute("aria-invalid");
    expect(screen.container.querySelectorAll('[data-slot="field-error"]')).toHaveLength(2);
  });

  it("useFieldControl liga um controle próprio ao Field", async () => {
    function ColorPicker(props: ComponentProps<"select">) {
      const fieldProps = useFieldControl(props);
      return (
        <select {...fieldProps}>
          <option>Azul</option>
          <option>Verde</option>
        </select>
      );
    }
    const screen = await render(
      <Field required>
        <FieldLabel>Cor</FieldLabel>
        <ColorPicker />
        <FieldDescription>A cor do tema.</FieldDescription>
      </Field>,
    );
    const select = screen.getByRole("combobox", { name: "Cor" });

    await expect.element(select).toBeRequired();
    await expect.element(select).toHaveAccessibleDescription("A cor do tema.");
  });

  it("fora de um Field, os controles ficam como vieram", async () => {
    const screen = await render(<Input aria-label="Solto" />);
    const input = screen.getByRole("textbox", { name: "Solto" });

    await expect.element(input).not.toHaveAttribute("id");
    await expect.element(input).not.toHaveAttribute("aria-describedby");
  });

  it("mescla o className do usuário e repassa o orientation", async () => {
    const screen = await render(
      <Field orientation="horizontal" className="gap-8">
        <Checkbox aria-label="x" />
      </Field>,
    );
    const field = screen.container.querySelector('[data-slot="field"]');

    expect(field?.getAttribute("data-orientation")).toBe("horizontal");
    expect(field?.className).toContain("gap-8");
    expect(field?.className).not.toContain("gap-3");
  });
});

describe("FieldSet", () => {
  it("é um grupo nomeado pela legenda, com descrição e erro ligados ao grupo", async () => {
    const screen = await render(
      <FieldSet>
        <FieldLegend>Notificações</FieldLegend>
        <FieldDescription>Escolha como quer ser avisado.</FieldDescription>
        <Field orientation="horizontal">
          <Checkbox />
          <FieldLabel>Por e-mail</FieldLabel>
        </Field>
        <FieldError>Escolha pelo menos uma opção.</FieldError>
      </FieldSet>,
    );
    const group = screen.getByRole("group", { name: "Notificações" });

    await expect
      .element(group)
      .toHaveAccessibleDescription("Escolha como quer ser avisado. Escolha pelo menos uma opção.");
    await expect.element(group).toHaveAttribute("data-invalid", "true");
    // A descrição do grupo não vai para o checkbox de dentro.
    await expect
      .element(screen.getByRole("checkbox", { name: "Por e-mail" }))
      .not.toHaveAttribute("aria-describedby");
  });

  it("disabled desabilita todos os controles de dentro", async () => {
    const screen = await render(
      <FieldSet disabled>
        <FieldLegend>Preferências</FieldLegend>
        <Field orientation="horizontal">
          <Checkbox />
          <FieldLabel>Novidades</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Switch />
          <FieldLabel>Modo escuro</FieldLabel>
        </Field>
      </FieldSet>,
    );

    await expect.element(screen.getByRole("checkbox", { name: "Novidades" })).toBeDisabled();
    await expect.element(screen.getByRole("switch", { name: "Modo escuro" })).toBeDisabled();
    expect(colorOf(screen.getByText("Novidades").element())).toBe(mutedColor());
  });

  it("mescla o className do usuário", async () => {
    const screen = await render(
      <FieldSet className="gap-8">
        <FieldLegend className="text-base">Grupo</FieldLegend>
      </FieldSet>,
    );

    await expect.element(screen.getByRole("group")).toHaveClass("gap-8");
    await expect.element(screen.getByRole("group")).not.toHaveClass("gap-4");
    await expect.element(screen.getByText("Grupo")).toHaveClass("text-base");
  });
});

describe("formulário completo", () => {
  it("FormData traz o valor de todos os controles, inclusive os do Radix", async () => {
    const screen = await render(
      <form aria-label="Cadastro">
        <Field>
          <FieldLabel>Nome</FieldLabel>
          <Input name="nome" defaultValue="Ana" />
        </Field>
        <Field>
          <FieldLabel>Mensagem</FieldLabel>
          <Textarea name="mensagem" defaultValue="Olá" />
        </Field>
        <Field>
          <FieldLabel>Plano</FieldLabel>
          <RadioGroup name="plano" defaultValue="anual">
            <RadioGroupItem value="mensal" aria-label="Mensal" />
            <RadioGroupItem value="anual" aria-label="Anual" />
          </RadioGroup>
        </Field>
        <Field orientation="horizontal">
          <Checkbox name="termos" defaultChecked />
          <FieldLabel>Termos</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Switch name="novidades" defaultChecked />
          <FieldLabel>Novidades</FieldLabel>
        </Field>
      </form>,
    );
    const form = screen.getByRole("form").element() as HTMLFormElement;

    expect(Object.fromEntries(new FormData(form))).toEqual({
      nome: "Ana",
      mensagem: "Olá",
      plano: "anual",
      termos: "on",
      novidades: "on",
    });
  });
});
