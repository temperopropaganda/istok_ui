import { expect, openPage, setTheme, test } from "./fixtures.ts";

// Páginas na ordem da sidebar (playground/pages.ts); o primeiro teste confere que a lista bate.
const pages = [
  { id: "", label: "Visão geral", title: "istok_ui" },
  { id: "tokens", label: "Tokens" },
  { id: "alert", label: "Alert" },
  { id: "alert-dialog", label: "AlertDialog" },
  { id: "avatar", label: "Avatar" },
  { id: "badge", label: "Badge" },
  { id: "button", label: "Button" },
  { id: "card", label: "Card" },
  { id: "checkbox", label: "Checkbox" },
  { id: "dialog", label: "Dialog" },
  { id: "field", label: "Field" },
  { id: "input", label: "Input" },
  { id: "label", label: "Label" },
  { id: "radio-group", label: "RadioGroup" },
  { id: "separator", label: "Separator" },
  { id: "skeleton", label: "Skeleton" },
  { id: "spinner", label: "Spinner" },
  { id: "switch", label: "Switch" },
  { id: "textarea", label: "Textarea" },
  { id: "tooltip", label: "Tooltip" },
];

test.describe("Vitrine (playground)", () => {
  test("a sidebar lista todas as páginas e cada uma abre com o seu título", async ({ page }) => {
    await openPage(page, "");
    const nav = page.getByRole("navigation", { name: "Navegação" });
    await expect(nav.getByRole("link")).toHaveText(pages.map((item) => item.label));

    for (const item of pages) {
      const link = nav.getByRole("link", { name: item.label, exact: true });
      await link.click();
      await expect(page).toHaveURL(new RegExp(`#/${item.id}$`));
      await expect(
        page.getByRole("heading", { level: 1, name: item.title ?? item.label }),
      ).toBeVisible();
      await expect(link).toHaveAttribute("aria-current", "page");
      await expect(page).toHaveTitle(`${item.label} · istok_ui`);
    }
  });

  test("trocar de página volta ao topo e leva o foco ao título", async ({ page }) => {
    await openPage(page, "button");
    await page.mouse.wheel(0, 2000);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

    await page
      .getByRole("navigation", { name: "Navegação" })
      .getByRole("link", { name: "Card" })
      .click();
    await expect(page.getByRole("heading", { level: 1, name: "Card" })).toBeFocused();
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("anterior e próximo seguem a ordem da sidebar", async ({ page }) => {
    await openPage(page, "badge");
    const neighbors = page.getByRole("navigation", { name: "Páginas vizinhas" });

    await neighbors.getByRole("link", { name: "Button" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Button" })).toBeVisible();
    await neighbors.getByRole("link", { name: "Badge" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Badge" })).toBeVisible();
  });

  test("a página inicial leva a cada componente", async ({ page }) => {
    await openPage(page, "");
    const cards = page.getByRole("region", { name: "Componentes" }).getByRole("link");

    await expect(cards).toHaveCount(pages.length - 2);
    await cards.filter({ hasText: "Tooltip" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Tooltip" })).toBeVisible();
  });

  test("o tema escuro é o padrão e a escolha fica salva", async ({ page }) => {
    await openPage(page, "");
    const toggle = page.getByRole("button", { name: "Tema escuro" });
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    await expect(toggle).toHaveAttribute("aria-pressed", "true");

    await toggle.click();
    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
    await page.reload();
    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
    await expect(page.getByRole("button", { name: "Tema escuro" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  test("o botão de tema tem dica e troca de ícone", async ({ page }) => {
    await openPage(page, "");
    const toggle = page.getByRole("button", { name: "Tema escuro" });

    await toggle.focus();
    await expect(page.getByRole("tooltip")).toHaveText("Mudar para o tema claro");
    const darkIcon = await toggle.innerHTML();
    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(await toggle.innerHTML()).not.toBe(darkIcon);
  });

  test("atalho 'Pular para o conteúdo' leva o foco ao conteúdo", async ({ page }) => {
    await openPage(page, "button");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Pular para o conteúdo" });
    await expect(skip).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page.getByRole("main")).toBeFocused();
    await expect(page).toHaveURL(/#\/button$/);
  });

  test("no celular, a sidebar vira um menu", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await openPage(page, "");
    const nav = page.getByRole("navigation", { name: "Navegação" });
    const menu = page.getByRole("button", { name: "Menu" });
    await expect(nav).toBeHidden();
    await expect(menu).toHaveAttribute("aria-expanded", "false");

    await menu.click();
    await expect(nav).toBeVisible();
    await nav.getByRole("link", { name: "Switch" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Switch" })).toBeVisible();
    await expect(nav).toBeHidden();

    await menu.click();
    await page.keyboard.press("Escape");
    await expect(nav).toBeHidden();
    await expect(menu).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      375,
    );
  });

  // axe em cada página, nos dois temas (antes era a vitrine inteira de uma vez).
  for (const theme of ["claro", "escuro"] as const) {
    for (const item of pages) {
      test(`sem violações de acessibilidade: ${item.label} (${theme})`, async ({
        page,
        checkA11y,
      }) => {
        await openPage(page, item.id);
        await setTheme(page, theme);
        await page.mouse.move(0, 0);
        await checkA11y();
      });
    }
  }
});
