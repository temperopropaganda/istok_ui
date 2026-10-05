import type { Page } from "@playwright/test";
import { expect, openPage, test } from "./fixtures.ts";

const group = (page: Page, name: string) => page.getByRole("group", { name, exact: true });

test.describe("Cards de conteúdo, Accordion e propriedades", () => {
  test("ProductCard: clicar no card abre o produto; a ação não", async ({ page }) => {
    await openPage(page, "product-card");
    const card = page.getByRole("article", { name: "Suco de laranja integral" });

    await card.getByRole("button", { name: "Adicionar" }).click();
    await expect(page.getByTestId("product-cart")).toHaveText("1");
    await expect(page).toHaveURL(/#\/product-card$/);

    // Clique na imagem (fora do link do nome): a camada do link cobre o card.
    await card.click({ position: { x: 30, y: 30 } });
    await expect(page).toHaveURL(/#\/product-card\/suco$/);
    await expect(page.getByRole("heading", { level: 1, name: "ProductCard" })).toBeVisible();
  });

  test("ProductCard: link com o nome e textos para leitores de tela", async ({ page }) => {
    await openPage(page, "product-card");
    const card = page.getByRole("article", { name: "Suco de laranja integral" });

    await expect(card.getByRole("link")).toHaveAccessibleName("Suco de laranja integral");
    await expect(card.getByRole("list", { name: "Tamanhos" }).getByRole("listitem")).toHaveText([
      "300 ml",
      "1 L",
      "1,5 L",
    ]);
    await expect(card.getByText("Avaliação: 4,5 de 5 (128 avaliações)")).toBeAttached();
    await expect(card.getByText("Preço anterior:")).toBeAttached();
    await expect(card.getByText("Preço atual:")).toBeAttached();
  });

  test("ProductCard: com o teclado, o foco no nome destaca o card inteiro", async ({ page }) => {
    await openPage(page, "product-card");
    const card = page.getByRole("article", { name: "Café torrado em grãos" });
    const link = card.getByRole("link", { name: "Café torrado em grãos" });

    await card.getByRole("button", { name: "Adicionar" }).focus();
    await page.keyboard.press("Shift+Tab");
    await expect(link).toBeFocused();
    await expect(card).not.toHaveCSS("box-shadow", "none");

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#\/product-card\/cafe$/);
  });

  test("NewsCard: com capa e só texto; data em <time>; clicar abre a notícia", async ({ page }) => {
    await openPage(page, "news-card");
    const feature = page.getByRole("article", {
      name: "Feira de design reúne 200 expositores no centro da cidade",
    });
    const simple = page.getByRole("article", { name: "Resultado do concurso de fotografia" });

    await expect(feature.locator("img")).toHaveAttribute("alt", "");
    await expect(feature.locator("time")).toHaveAttribute("datetime", "2026-10-05");
    await expect(feature.locator("time")).toHaveText("5 de out. de 2026");
    await expect(simple.locator("img")).toHaveCount(0);

    await feature.click({ position: { x: 30, y: 30 } });
    await expect(page).toHaveURL(/#\/news-card\/feira$/);
  });

  test("Accordion: Enter/Espaço alternam, setas e Home/End andam, single fecha a outra", async ({
    page,
  }) => {
    await openPage(page, "accordion");
    const faq = group(page, "Uma por vez (single, collapsible)");
    const delivery = faq.getByRole("button", { name: "Qual o prazo de entrega?" });
    const returns = faq.getByRole("button", { name: "Posso trocar o produto?" });
    const payment = faq.getByRole("button", { name: "Quais formas de pagamento vocês aceitam?" });

    await expect(delivery).toHaveAttribute("aria-expanded", "true");
    await delivery.focus();
    await page.keyboard.press("ArrowDown");
    await expect(returns).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(returns).toHaveAttribute("aria-expanded", "true");
    await expect(delivery).toHaveAttribute("aria-expanded", "false");
    await page.keyboard.press("Space");
    await expect(returns).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("End");
    await expect(payment).toBeFocused();
    await page.keyboard.press("Home");
    await expect(delivery).toBeFocused();
  });

  test("Accordion: abre sem animação com redução de movimento", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openPage(page, "accordion");
    const faq = group(page, "Uma por vez (single, collapsible)");

    await faq.getByRole("button", { name: "Posso trocar o produto?" }).click();
    const content = faq.locator('[data-slot="accordion-content"][data-state="open"]');
    await expect(content).toHaveCSS("animation-name", "none");
  });

  test("Propriedades: tabela gerada do código em cada página", async ({ page }) => {
    await openPage(page, "button");
    const props = page.getByRole("region", { name: "Propriedades" });
    const table = props.getByRole("table", { name: "Propriedades de Button" });

    await expect(table.getByRole("rowheader")).toHaveText([
      "variant",
      "size",
      "asChild",
      "loading",
    ]);
    await expect(table.getByRole("row", { name: /loading/ })).toContainText("false");

    await openPage(page, "accordion");
    await expect(
      page.getByRole("region", { name: "Propriedades" }).getByRole("heading", { level: 3 }),
    ).toHaveText(["Accordion", "AccordionContent", "AccordionItem", "AccordionTrigger"]);
  });
});
