import type { Page } from "@playwright/test";
import { enableDarkTheme, expect, test } from "./fixtures.ts";

const section = (page: Page, name: string) => page.getByRole("region", { name });
const group = (page: Page, sectionName: string, name: string) =>
  section(page, sectionName).getByRole("group", { name, exact: true });

// O Radix move o foco num setTimeout e só marca a opção se a seta ainda estiver pressionada, como
// num teclado real. `keyboard.press` solta na mesma hora; aqui a tecla fica pressionada um instante.
async function holdKey(page: Page, key: string) {
  await page.keyboard.down(key);
  await page.waitForTimeout(50);
  await page.keyboard.up(key);
}

test.describe("Componentes de formulário", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("cadastro: envio vazio mostra os erros e leva o foco ao primeiro campo", async ({
    page,
  }) => {
    const form = page.getByRole("form", { name: "Cadastro" });
    await form.getByRole("button", { name: "Criar conta" }).click();

    const name = form.getByRole("textbox", { name: "Nome" });
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toHaveAccessibleDescription("Informe seu nome.");
    await expect(form.getByRole("textbox", { name: "E-mail" })).toHaveAccessibleDescription(
      "Usado só para enviar a confirmação. Informe seu e-mail.",
    );
    await expect(form.getByRole("radiogroup", { name: "Plano" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(form.getByRole("checkbox", { name: "Aceito os termos de uso" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );

    // Corrigir o campo tira o erro na hora.
    await name.fill("Ana Souza");
    await expect(name).not.toHaveAttribute("aria-invalid");
    await expect(form.getByText("Informe seu nome.")).toHaveCount(0);
  });

  test("cadastro: preenchido e enviado só com teclado", async ({ page }) => {
    const form = page.getByRole("form", { name: "Cadastro" });

    await form.getByRole("textbox", { name: "Nome" }).focus();
    await page.keyboard.type("Ana Souza");
    await page.keyboard.press("Tab");
    await page.keyboard.type("ana@tempero.com.br");
    await page.keyboard.press("Tab");
    await expect(form.getByRole("textbox", { name: "Mensagem" })).toBeFocused();
    await page.keyboard.type("Olá!");

    // Sem opção marcada, o Tab entra pela primeira; a seta marca a próxima.
    await page.keyboard.press("Tab");
    await expect(form.getByRole("radio", { name: "Mensal" })).toBeFocused();
    await holdKey(page, "ArrowRight");
    await expect(form.getByRole("radio", { name: "Anual" })).toBeChecked();

    await page.keyboard.press("Tab");
    await expect(form.getByRole("switch", { name: "Receber novidades por e-mail" })).toBeFocused();
    await page.keyboard.press("Space");
    await page.keyboard.press("Tab");
    await expect(form.getByRole("checkbox", { name: "Aceito os termos de uso" })).toBeFocused();
    await page.keyboard.press("Space");

    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    const sending = form.getByRole("button", { name: "Enviando…" });
    await expect(sending).toHaveAttribute("aria-busy", "true");
    await expect(sending).toBeFocused();

    const output = page.getByTestId("form-data");
    await expect(output).toBeVisible();
    expect(JSON.parse((await output.textContent()) ?? "")).toEqual({
      nome: "Ana Souza",
      email: "ana@tempero.com.br",
      mensagem: "Olá!",
      plano: "anual",
      novidades: "on",
      termos: "on",
    });
    await expect(form.locator('[aria-invalid="true"]')).toHaveCount(0);
  });

  test("Field: rótulo, descrição, obrigatório e desabilitado", async ({ page }) => {
    const fields = group(page, "Field", "Vertical");

    await expect(
      fields.getByRole("textbox", { name: "Nome de usuário" }),
    ).toHaveAccessibleDescription("Aparece no seu perfil público.");
    await expect(fields.getByRole("textbox", { name: "Empresa" })).toHaveAttribute("required");
    await expect(fields.getByRole("textbox", { name: "Site" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    const disabled = fields.getByRole("textbox", { name: "CNPJ" });
    await expect(disabled).toBeDisabled();

    // O Tab pula o campo desabilitado.
    await fields.getByRole("textbox", { name: "Site" }).focus();
    await page.keyboard.press("Tab");
    await expect(disabled).not.toBeFocused();
  });

  test("FieldSet: grupo nomeado pela legenda, com descrição", async ({ page }) => {
    const fieldset = group(page, "Field", "Grupo (FieldSet)").getByRole("group", {
      name: "Notificações",
    });

    await expect(fieldset).toHaveAccessibleDescription("Escolha como quer ser avisado.");
    await expect(fieldset.getByRole("checkbox")).toHaveCount(2);
  });

  test("Checkbox: Espaço alterna e 'selecionar todas' fica indeterminado", async ({ page }) => {
    const list = group(page, "Checkbox", "Selecionar todos");
    const all = list.getByRole("checkbox", { name: "Selecionar todas" });

    await expect(all).toHaveAttribute("aria-checked", "mixed");
    await list.getByRole("checkbox", { name: "Banana" }).focus();
    await page.keyboard.press("Space");
    await list.getByRole("checkbox", { name: "Uva" }).focus();
    await page.keyboard.press("Space");
    await expect(all).toHaveAttribute("aria-checked", "true");

    await all.focus();
    await page.keyboard.press("Space");
    await expect(list.getByRole("checkbox", { checked: true })).toHaveCount(0);
  });

  test("RadioGroup: setas trocam a opção e Tab entra no próximo grupo pela marcada", async ({
    page,
  }) => {
    const plans = group(page, "RadioGroup", "Vertical, com descrição");
    const yearly = plans.getByRole("radio", { name: "Anual" });

    await yearly.focus();
    await expect(yearly).toHaveAccessibleDescription("R$ 490 por ano");
    await holdKey(page, "ArrowDown");
    await expect(plans.getByRole("radio", { name: "Vitalício" })).toBeChecked();
    await holdKey(page, "ArrowDown");
    await expect(plans.getByRole("radio", { name: "Mensal" })).toBeChecked();

    // Tab sai do grupo e entra no seguinte pela opção marcada ("M"), não pela primeira.
    await page.keyboard.press("Tab");
    await expect(
      group(page, "RadioGroup", "Horizontal").getByRole("radio", { name: "M" }),
    ).toBeFocused();

    // Opção desabilitada fica fora das setas.
    const delivery = group(page, "RadioGroup", "Desabilitado");
    await delivery.getByRole("radio", { name: "Normal" }).focus();
    await holdKey(page, "ArrowDown");
    await expect(delivery.getByRole("radio", { name: "Normal" })).toBeChecked();
    await expect(delivery.getByRole("radio", { name: "Expressa (indisponível)" })).toBeDisabled();
  });

  test("RadioGroup: Shift+Tab sai do grupo (sem armadilha de teclado)", async ({
    page,
    browserName,
  }) => {
    // O Radix tira o grupo da ordem de Tab num estado do React, aplicado numa microtask. O Firefox
    // do Playwright despacha a tecla de dentro de JavaScript e só roda a microtask depois de mover o
    // foco, então aqui o foco "volta" para o grupo. Com teclado de verdade a microtask roda antes
    // (especificação HTML); o roteiro manual (docs/auditoria-leitor-de-tela.md) confere no Firefox.
    test.skip(
      browserName === "firefox",
      "artefato da automação do Firefox; conferido no roteiro manual",
    );

    await group(page, "RadioGroup", "Horizontal").getByRole("radio", { name: "M" }).focus();
    await page.keyboard.press("Shift+Tab");

    await expect(
      group(page, "RadioGroup", "Vertical, com descrição").getByRole("radio", { name: "Anual" }),
    ).toBeFocused();
  });

  test("Switch: Espaço liga e desliga", async ({ page }) => {
    const toggle = group(page, "Switch", "Estados").getByRole("switch", { name: "Desligado" });

    await toggle.focus();
    await page.keyboard.press("Space");
    await expect(toggle).toHaveAttribute("aria-checked", "true");
    await page.keyboard.press("Space");
    await expect(toggle).toHaveAttribute("aria-checked", "false");
    await expect(
      group(page, "Switch", "Estados").getByRole("switch", { name: "Desabilitado", exact: true }),
    ).toBeDisabled();
  });

  test("Input: alturas iguais às do Button no mesmo tamanho", async ({ page }) => {
    const sizes = group(page, "Input", "Tamanhos");

    for (const [size, pixels] of [
      ["sm", 32],
      ["md", 36],
      ["lg", 40],
    ] as const) {
      const input = await sizes.getByRole("textbox", { name: `Busca (${size})` }).boundingBox();
      expect(input?.height).toBe(pixels);
    }
    const buttons = sizes.getByRole("button", { name: "Buscar" });
    expect((await buttons.nth(1).boundingBox())?.height).toBe(36);
  });

  test("Label: clicar no rótulo foca o campo", async ({ page }) => {
    const example = group(page, "Label", "Com campo");

    await example.getByText("Nome completo").click();
    await expect(example.getByRole("textbox", { name: "Nome completo" })).toBeFocused();
  });

  test("controles mudam de cor no tema escuro", async ({ page }) => {
    const input = group(page, "Input", "Estados").getByRole("textbox", { name: "Normal" });
    const checkbox = group(page, "Checkbox", "Estados").getByRole("checkbox", {
      name: "Marcado",
      exact: true,
    });
    const before = await Promise.all([
      input.evaluate((element) => getComputedStyle(element).borderTopColor),
      checkbox.evaluate((element) => getComputedStyle(element).backgroundColor),
    ]);

    await enableDarkTheme(page);
    await expect(input).not.toHaveCSS("border-top-color", before[0]);
    await expect(checkbox).not.toHaveCSS("background-color", before[1]);
  });
});
