import type { Page } from "@playwright/test";
import { enableDarkTheme, expect, test } from "./fixtures.ts";

const variants = ["default", "secondary", "outline", "ghost", "link", "destructive"];

test.describe("Button", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  const section = (page: Page) => page.getByRole("region", { name: "Button" });
  const group = (page: Page, name: string) =>
    section(page).getByRole("group", { name, exact: true });
  const clicks = (page: Page) => page.getByTestId("button-clicks");

  test("mostra todas as variantes, habilitadas e desabilitadas", async ({ page }) => {
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
    await group(page, "Variantes").getByRole("button", { name: "default" }).click();
    await group(page, "Tamanhos").getByRole("button", { name: "Tamanho lg" }).click();

    await expect(clicks(page)).toHaveText("2");
  });

  test("funciona só com teclado: Tab, foco visível, Enter e Espaço", async ({ page }) => {
    // Clicar no título define o ponto de partida da navegação por Tab.
    await group(page, "Variantes").getByRole("heading", { name: "Variantes" }).click();
    await page.keyboard.press("Tab");

    const first = group(page, "Variantes").getByRole("button", { name: "default" });
    await expect(first).toBeFocused();
    expect(await first.evaluate((element) => element.matches(":focus-visible"))).toBe(true);
    await expect(first).not.toHaveCSS("box-shadow", "none");

    await page.keyboard.press("Enter");
    await page.keyboard.press("Space");
    await expect(clicks(page)).toHaveText("2");

    await page.keyboard.press("Tab");
    await expect(group(page, "Variantes").getByRole("button", { name: "secondary" })).toBeFocused();
  });

  test("botões desabilitados ficam fora do Tab e não disparam a ação", async ({ page }) => {
    // Do último botão habilitado antes dos desabilitados, o Tab pula direto para o link.
    await group(page, "Com ícone").getByRole("button", { name: "Adicionar" }).last().focus();
    await page.keyboard.press("Tab");
    await expect(
      group(page, "Como link (asChild)").getByRole("link", { name: "Ir para os tokens" }),
    ).toBeFocused();

    await group(page, "Desabilitado")
      .getByRole("button", { name: "default" })
      .click({ force: true });
    await expect(clicks(page)).toHaveText("0");
  });

  test("botão só com ícone tem nome acessível", async ({ page }) => {
    const iconButton = group(page, "Com ícone").getByRole("button", { name: "Adicionar" }).last();
    await expect(iconButton).toHaveAttribute("aria-label", "Adicionar");
    await expect(iconButton).toHaveText("");
  });

  test("asChild renderiza um link funcional com visual de botão", async ({ page }) => {
    const link = group(page, "Como link (asChild)").getByRole("link", {
      name: "Ir para os tokens",
    });
    await expect(link).toHaveAttribute("data-slot", "button");

    await link.click();
    await expect(page).toHaveURL(/#tokens$/);
  });

  test("cores mudam no tema escuro", async ({ page }) => {
    const button = group(page, "Variantes").getByRole("button", { name: "default" });
    const lightBackground = await button.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    );

    await enableDarkTheme(page);
    await expect(button).not.toHaveCSS("background-color", lightBackground);
  });
});
