import { enableDarkTheme, expect, test } from "./fixtures.ts";

test.describe("Vitrine (playground)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("mostra todas as seções", async ({ page }) => {
    const sections = [
      "Tokens",
      "Alert",
      "AlertDialog",
      "Avatar",
      "Badge",
      "Button",
      "Card",
      "Checkbox",
      "Dialog",
      "Field",
      "Input",
      "Label",
      "RadioGroup",
      "Separator",
      "Skeleton",
      "Spinner",
      "Switch",
      "Textarea",
      "Tooltip",
    ];
    for (const name of sections) {
      await expect(page.getByRole("region", { name, exact: true })).toBeVisible();
    }
  });

  test("navega pelas seções pelo menu", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Seções" });
    await nav.getByRole("link", { name: "Button" }).click();

    await expect(page).toHaveURL(/#button$/);
    await expect(page.getByRole("region", { name: "Button" })).toBeInViewport();
  });

  test("sem violações de acessibilidade no tema claro", async ({ checkA11y }) => {
    await checkA11y();
  });

  test("sem violações de acessibilidade no tema escuro", async ({ page, checkA11y }) => {
    await enableDarkTheme(page);
    await checkA11y();
  });

  test("alterna o tema escuro e volta", async ({ page }) => {
    const toggle = page.getByRole("button", { name: "Tema escuro" });
    const body = page.locator("body");
    const lightBackground = await body.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    );

    await enableDarkTheme(page);
    await expect(body).not.toHaveCSS("background-color", lightBackground);

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
    await expect(body).toHaveCSS("background-color", lightBackground);
  });
});
