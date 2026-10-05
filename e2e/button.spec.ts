import type { Page } from "@playwright/test";
import { expect, expectThemeChange, openPage, test } from "./fixtures.ts";

const variants = ["default", "secondary", "outline", "ghost", "link", "destructive"];

test.describe("Button", () => {
  const section = (page: Page) => page.getByRole("region", { name: "Button" });
  const group = (page: Page, name: string) =>
    section(page).getByRole("group", { name, exact: true });
  const clicks = (page: Page) => page.getByTestId("button-clicks");

  test("mostra todas as variantes, habilitadas e desabilitadas", async ({ page }) => {
    await openPage(page, "button");
    for (const name of variants) {
      await expect(
        group(page, "Variantes").getByRole("button", { name, exact: true }),
      ).toBeEnabled();
      await expect(
        group(page, "Desabilitado").getByRole("button", { name, exact: true }),
      ).toBeDisabled();
    }
  });

  test("clique dispara a ação", async ({ page }) => {
    await openPage(page, "button");
    await group(page, "Variantes").getByRole("button", { name: "default" }).click();
    await group(page, "Tamanhos").getByRole("button", { name: "Tamanho lg" }).click();

    await expect(clicks(page)).toHaveText("2");
  });

  test("funciona só com teclado: Tab, foco visível, Espaço e Enter", async ({ page }) => {
    await openPage(page, "button");
    // Clicar no título define o ponto de partida da navegação por Tab.
    await group(page, "Variantes").getByRole("heading", { name: "Variantes" }).click();
    await page.keyboard.press("Tab");

    const first = group(page, "Variantes").getByRole("button", { name: "default" });
    await expect(first).toBeFocused();
    expect(await first.evaluate((element) => element.matches(":focus-visible"))).toBe(true);
    await expect(first).not.toHaveCSS("box-shadow", "none");

    // Espaço antes do Enter: no Firefox, um Espaço sintético logo depois de um Enter não clica.
    await page.keyboard.press("Space");
    await page.keyboard.press("Enter");
    await expect(clicks(page)).toHaveText("2");

    await page.keyboard.press("Tab");
    await expect(group(page, "Variantes").getByRole("button", { name: "secondary" })).toBeFocused();
  });

  test("botões desabilitados ficam fora do Tab e não disparam a ação", async ({ page }) => {
    await openPage(page, "button");
    // Do último botão habilitado antes dos desabilitados, o Tab pula direto para os botões em
    // loading (que continuam focáveis).
    await group(page, "Com ícone").getByRole("button", { name: "Adicionar" }).last().focus();
    await page.keyboard.press("Tab");
    await expect(group(page, "Carregando").getByRole("button", { name: "default" })).toBeFocused();

    await group(page, "Desabilitado")
      .getByRole("button", { name: "default" })
      .click({ force: true });
    await expect(clicks(page)).toHaveText("0");
  });

  test("botão só com ícone tem nome acessível", async ({ page }) => {
    await openPage(page, "button");
    const iconButton = group(page, "Com ícone").getByRole("button", { name: "Adicionar" }).last();
    await expect(iconButton).toHaveAttribute("aria-label", "Adicionar");
    await expect(iconButton).toHaveText("");
  });

  test("asChild renderiza um link funcional com visual de botão", async ({ page }) => {
    await openPage(page, "button");
    const link = group(page, "Como link (asChild)").getByRole("link", {
      name: "Ir para os tokens",
    });
    await expect(link).toHaveAttribute("data-slot", "button");

    await link.click();
    await expect(page).toHaveURL(/#\/tokens$/);
    await expect(page.getByRole("heading", { level: 1, name: "Tokens" })).toBeVisible();
  });

  test("cores mudam entre o tema claro e o escuro", async ({ page }) => {
    await openPage(page, "button");
    const button = group(page, "Variantes").getByRole("button", { name: "default" });

    await expectThemeChange(page, button, "background-color");
  });
});
