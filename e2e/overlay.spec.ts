import type { Page } from "@playwright/test";
import { enableDarkTheme, expect, test } from "./fixtures.ts";

const section = (page: Page, name: string) => page.getByRole("region", { name });
const group = (page: Page, sectionName: string, name: string) =>
  section(page, sectionName).getByRole("group", { name, exact: true });

test.describe("Overlays", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Dialog: abre e salva só com teclado, com o foco preso e devolvido", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Editar perfil" });
    await trigger.focus();
    await page.keyboard.press("Enter");

    const dialog = page.getByRole("dialog", { name: "Editar perfil" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleDescription("As mudanças aparecem para todo o time.");
    const name = dialog.getByRole("textbox", { name: "Nome" });
    await expect(name).toBeFocused();

    // Tab dá a volta dentro do modal: Nome → Cancelar → Salvar → Fechar → Nome.
    for (const next of ["Cancelar", "Salvar", "Fechar"]) {
      await page.keyboard.press("Tab");
      await expect(dialog.getByRole("button", { name: next })).toBeFocused();
    }
    await page.keyboard.press("Tab");
    await expect(name).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(dialog.getByRole("button", { name: "Fechar" })).toBeFocused();

    await name.fill("Bruno Lima");
    await name.press("Enter");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(page.getByTestId("dialog-name")).toHaveText("Bruno Lima");
  });

  test("Dialog: Esc e clique fora fecham, sem salvar", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Editar perfil" });
    const dialog = page.getByRole("dialog");

    await trigger.click();
    await dialog.getByRole("textbox", { name: "Nome" }).fill("Não salvar");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();

    await trigger.click();
    await page.mouse.click(5, 300);
    await expect(dialog).toBeHidden();
    await expect(page.getByTestId("dialog-name")).toHaveText("Ana Souza");
  });

  test("Dialog: trava a rolagem e esconde a página de leitores de tela", async ({ page }) => {
    await page.getByRole("button", { name: "Editar perfil" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(100);
    expect(await page.evaluate(() => window.scrollY)).toBe(before);
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    // Fora do modal, nada fica acessível: nem o cabeçalho, nem as seções.
    await expect(page.getByRole("banner")).toHaveCount(0);
    await expect(page.getByRole("region", { name: "Dialog" })).toHaveCount(0);
  });

  test("Dialog: larguras de 384, 512 e 672px", async ({ page }) => {
    const sizes = group(page, "Dialog", "Tamanhos");

    for (const [size, pixels] of [
      ["sm", 384],
      ["md", 512],
      ["lg", 672],
    ] as const) {
      await sizes.getByRole("button", { name: `Abrir ${size}` }).click();
      const dialog = page.getByRole("dialog", { name: `Tamanho ${size}` });
      expect(await dialog.evaluate((element) => (element as HTMLElement).offsetWidth)).toBe(pixels);
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
    }
  });

  test("Dialog: conteúdo longo rola por dentro, sem passar da tela", async ({ page }) => {
    await page.getByRole("button", { name: "Ler os termos" }).click();
    const dialog = page.getByRole("dialog", { name: "Termos de uso" });

    const box = await dialog.evaluate((element) => ({
      height: element.getBoundingClientRect().height,
      scroll: element.scrollHeight > element.clientHeight,
    }));
    const viewport = page.viewportSize();
    expect(box.scroll).toBe(true);
    expect(box.height).toBeLessThanOrEqual((viewport?.height ?? 0) - 32);

    await dialog.getByRole("button", { name: "Entendi" }).click();
    await expect(dialog).toBeHidden();
  });

  test("Dialog: sem animação com redução de movimento", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.getByRole("button", { name: "Editar perfil" }).click();

    await expect(page.getByRole("dialog")).toHaveCSS("animation-name", "none");
  });

  test("AlertDialog: foco em Cancelar, clique fora não fecha, exclusão com loading", async ({
    page,
  }) => {
    const trigger = page.getByRole("button", { name: "Excluir projeto" });
    await trigger.click();

    const dialog = page.getByRole("alertdialog", { name: "Excluir o projeto?" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Cancelar" })).toBeFocused();

    await page.mouse.click(5, 300);
    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: "Excluir", exact: true }).click();
    const deleting = dialog.getByRole("button", { name: "Excluindo…" });
    await expect(deleting).toHaveAttribute("aria-busy", "true");
    await expect(dialog.getByRole("button", { name: "Cancelar" })).toBeDisabled();

    await expect(dialog).toBeHidden();
    await expect(page.getByTestId("alert-dialog-deleted")).toHaveText("1");
    await expect(trigger).toBeFocused();
  });

  test("AlertDialog: Esc cancela", async ({ page }) => {
    await page.getByRole("button", { name: "Excluir projeto" }).click();
    await page.keyboard.press("Escape");

    await expect(page.getByRole("alertdialog")).toBeHidden();
    await expect(page.getByTestId("alert-dialog-deleted")).toHaveText("0");
  });

  test("Tooltip: abre com o ponteiro depois do atraso, e dá para passar o ponteiro nele", async ({
    page,
  }) => {
    const bold = page.getByRole("toolbar", { name: "Formatação" }).getByRole("button", {
      name: "Negrito",
    });
    await bold.hover();

    const tooltip = page.getByRole("tooltip");
    await expect(tooltip).toHaveText("Negrito (Ctrl+B)");
    await expect(bold).toHaveAccessibleName("Negrito");
    await expect(bold).toHaveAccessibleDescription("Negrito (Ctrl+B)");

    // WCAG 1.4.13: mover o ponteiro até a dica não a fecha.
    const content = page.locator('[data-slot="tooltip-content"]');
    const box = await content.boundingBox();
    await page.mouse.move((box?.x ?? 0) + 10, (box?.y ?? 0) + 5, { steps: 5 });
    await page.waitForTimeout(200);
    await expect(tooltip).toBeAttached();
  });

  test("Tooltip: abre com o teclado e Esc fecha sem tirar o foco", async ({ page }) => {
    const sides = group(page, "Tooltip", "Lados");
    await sides.getByRole("button", { name: "top" }).focus();
    await page.keyboard.press("Tab");

    const right = sides.getByRole("button", { name: "right" });
    await expect(right).toBeFocused();
    // A dica do botão anterior pode estar na animação de saída: filtra pela do botão focado.
    await expect(
      page.getByRole("tooltip").filter({ hasText: "Dica no lado right" }),
    ).toBeAttached();
    await expect(
      page.locator('[data-slot="tooltip-content"]').filter({ hasText: "Dica no lado right" }),
    ).toHaveAttribute("data-side", "right");

    await page.keyboard.press("Escape");
    await expect(page.getByRole("tooltip")).toHaveCount(0);
    await expect(right).toBeFocused();
  });

  test("Tooltip: na barra de ferramentas, cada botão mostra a sua dica com o teclado", async ({
    page,
  }) => {
    const toolbar = page.getByRole("toolbar", { name: "Formatação" });
    await toolbar.getByRole("button", { name: "Negrito" }).focus();

    // O foco abre a dica na hora (o atraso vale só para o ponteiro). A anterior pode estar saindo.
    for (const [name, hint] of [
      ["Negrito", "Negrito (Ctrl+B)"],
      ["Itálico", "Itálico (Ctrl+I)"],
      ["Sublinhado", "Sublinhado (Ctrl+U)"],
    ] as const) {
      await expect(toolbar.getByRole("button", { name })).toBeFocused();
      await expect(page.getByRole("tooltip").filter({ hasText: hint })).toBeAttached();
      await page.keyboard.press("Tab");
    }
  });

  test("sem violações de acessibilidade nos modais abertos, nos dois temas", async ({
    page,
    checkA11y,
  }) => {
    // Só o modal: a página atrás fica inerte (fora da árvore de acessibilidade e sob o fundo
    // escurecido) e já é verificada sem modal no playground.spec.ts. No WebKit, o axe calcula o
    // contraste dos botões de trás através do overlay e reprova o que ninguém consegue usar.
    for (const theme of ["claro", "escuro"]) {
      if (theme === "escuro") await enableDarkTheme(page);
      await page.getByRole("button", { name: "Editar perfil" }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await checkA11y('[role="dialog"]');
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).toBeHidden();

      await page.getByRole("button", { name: "Excluir projeto" }).click();
      await expect(page.getByRole("alertdialog")).toBeVisible();
      await checkA11y('[role="alertdialog"]');
      await page.keyboard.press("Escape");
      await expect(page.getByRole("alertdialog")).toBeHidden();
    }
  });

  test("modal muda de cor no tema escuro", async ({ page }) => {
    await page.getByRole("button", { name: "Editar perfil" }).click();
    const light = await page
      .getByRole("dialog")
      .evaluate((element) => getComputedStyle(element).backgroundColor);
    await page.keyboard.press("Escape");

    await enableDarkTheme(page);
    await page.getByRole("button", { name: "Editar perfil" }).click();
    await expect(page.getByRole("dialog")).not.toHaveCSS("background-color", light);
  });
});
