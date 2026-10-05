import type { Page } from "@playwright/test";
import { expect, expectThemeChange, openPage, test } from "./fixtures.ts";

const section = (page: Page, name: string) => page.getByRole("region", { name });
const group = (page: Page, sectionName: string, name: string) =>
  section(page, sectionName).getByRole("group", { name, exact: true });

test.describe("Componentes de exibição", () => {
  test("Card: títulos como heading, lista semântica e ações no rodapé", async ({ page }) => {
    await openPage(page, "card");
    const card = section(page, "Card");

    await expect(card.getByRole("heading", { level: 3, name: "Plano Pro" })).toBeVisible();
    await expect(card.getByRole("button", { name: "Assinar" })).toBeEnabled();

    const orders = card.getByRole("list", { name: "Pedidos" }).getByRole("listitem");
    await expect(orders).toHaveCount(2);
    await expect(orders.first().getByRole("heading", { name: "Pedido #4821" })).toBeVisible();
  });

  test("Badge: todas as variantes e badge como link navegável", async ({ page }) => {
    await openPage(page, "badge");
    const variants = group(page, "Badge", "Variantes");
    for (const name of ["default", "secondary", "outline", "destructive", "success", "warning"]) {
      await expect(variants.getByText(name, { exact: true })).toBeVisible();
    }

    const link = group(page, "Badge", "Como link (asChild)").getByRole("link", { name: "#design" });
    await expect(link).toHaveAttribute("href", "#/badge");
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#\/badge$/);
  });

  test("Avatar: imagem com alt, fallback com nome e tamanhos 24/32/40px", async ({ page }) => {
    await openPage(page, "avatar");
    const images = group(page, "Avatar", "Com imagem");
    await expect(images.getByRole("img", { name: "Ana Souza (md)" })).toBeVisible();

    const fallbacks = group(page, "Avatar", "Sem foto (fallback)");
    for (const [size, pixels] of [
      ["sm", 24],
      ["md", 32],
      ["lg", 40],
    ] as const) {
      const initials = fallbacks.getByLabel(`Bruno Lima (${size})`);
      await expect(initials).toHaveText("BL");
      const box = await initials.boundingBox();
      expect(box?.width).toBe(pixels);
    }
  });

  test("Separator: decorativo fica fora da árvore de acessibilidade", async ({ page }) => {
    await openPage(page, "separator");
    const separators = section(page, "Separator").locator('[data-slot="separator"]');

    await expect(separators).toHaveCount(3);
    await expect(section(page, "Separator").getByRole("separator")).toHaveCount(0);
    const vertical = separators.nth(1);
    expect((await vertical.boundingBox())?.width).toBe(1);
  });

  test("Skeleton: alterna entre carregando e conteúdo, com aria-busy", async ({ page }) => {
    await openPage(page, "skeleton");
    const demo = page.getByTestId("skeleton-demo");
    const toggle = section(page, "Skeleton").getByRole("button", { name: "Simular carregamento" });

    await expect(demo).toHaveAttribute("aria-busy", "true");
    await expect(demo.locator('[data-slot="skeleton"]')).toHaveCount(3);
    await expect(demo.locator('[data-slot="skeleton"]').first()).toHaveAttribute(
      "aria-hidden",
      "true",
    );

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(demo).toHaveAttribute("aria-busy", "false");
    await expect(demo.getByText("Ana Souza")).toBeVisible();
    await expect(demo.locator('[data-slot="skeleton"]')).toHaveCount(0);
  });

  test("Skeleton: anima por padrão e para com redução de movimento", async ({ page }) => {
    await openPage(page, "skeleton");
    const block = page.getByTestId("skeleton-demo").locator('[data-slot="skeleton"]').first();
    await expect(block).toHaveCSS("animation-name", "pulse");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(block).toHaveCSS("animation-name", "none");
  });

  test("componentes de exibição mudam de cor entre os temas", async ({ page }) => {
    await openPage(page, "card");
    await expectThemeChange(
      page,
      section(page, "Card").locator('[data-slot="card"]').first(),
      "background-color",
    );

    await openPage(page, "badge");
    await expectThemeChange(
      page,
      group(page, "Badge", "Variantes").getByText("success", { exact: true }),
      "background-color",
    );
  });
});
