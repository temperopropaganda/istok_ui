import type { Page } from "@playwright/test";
import { expect, expectThemeChange, openPage, test } from "./fixtures.ts";

const section = (page: Page, name: string) => page.getByRole("region", { name });
const group = (page: Page, sectionName: string, name: string) =>
  section(page, sectionName).getByRole("group", { name, exact: true });

test.describe("Componentes de feedback", () => {
  test("Alert: default e success são status; warning e destructive são alert", async ({ page }) => {
    await openPage(page, "alert");
    const variants = group(page, "Alert", "Variantes");

    await expect(variants.getByRole("status")).toHaveCount(2);
    await expect(variants.getByRole("alert")).toHaveCount(2);
    await expect(variants.getByRole("status").nth(1)).toContainText("Pedido enviado");
    await expect(variants.getByRole("alert").nth(1)).toContainText("Falha no pagamento");
  });

  test("Alert: ação com loading termina num alerta de sucesso, só com teclado", async ({
    page,
  }) => {
    await openPage(page, "alert");
    const flow = group(page, "Alert", "Depois de uma ação");
    const result = page.getByTestId("alert-result");
    const send = flow.getByRole("button", { name: "Enviar pedido" });

    await send.focus();
    await page.keyboard.press("Enter");

    // Durante o envio: o mesmo botão, focado, ocupado e ignorando novas tentativas.
    const sending = flow.getByRole("button", { name: "Enviando…" });
    await expect(sending).toBeFocused();
    await expect(sending).toHaveAttribute("aria-busy", "true");
    await expect(sending).toHaveAttribute("aria-disabled", "true");
    await expect(sending.locator('[data-slot="spinner"]')).toBeVisible();
    await page.keyboard.press("Enter");

    await expect(result.getByRole("status")).toContainText("Pedido enviado");
    await expect(send).toBeFocused();
    await expect(send).not.toHaveAttribute("aria-busy");
    await expect(result.getByRole("status")).toHaveCount(1);
  });

  test("Alert: falha aparece como role=alert", async ({ page }) => {
    await openPage(page, "alert");
    await group(page, "Alert", "Depois de uma ação")
      .getByRole("button", { name: "Enviar com erro" })
      .click();

    await expect(page.getByTestId("alert-result").getByRole("alert")).toContainText(
      "Não foi possível enviar",
    );
  });

  test("Button loading: focável, mas não dispara a ação", async ({ page }) => {
    await openPage(page, "button");
    const loading = group(page, "Button", "Carregando");
    const first = loading.getByRole("button", { name: "default" });

    await first.focus();
    await expect(first).toBeFocused();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Space");
    await first.click({ force: true });
    await expect(page.getByTestId("button-clicks")).toHaveText("0");

    await expect(loading.getByRole("button")).toHaveCount(8);
    for (const button of await loading.getByRole("button").all()) {
      await expect(button).toHaveAttribute("aria-busy", "true");
      await expect(button).not.toHaveAttribute("disabled");
    }
  });

  test("Button loading: o Spinner substitui o ícone sem mudar o tamanho", async ({ page }) => {
    await openPage(page, "button");
    const normal = group(page, "Button", "Com ícone").getByRole("button", { name: "Adicionar" });
    const loading = group(page, "Button", "Carregando").getByRole("button", { name: "Adicionar" });

    // Ícone + texto (tamanho md) e só ícone, sem e com loading.
    for (const [before, after] of [
      [normal.nth(1), loading.first()],
      [normal.last(), loading.last()],
    ] as const) {
      const [a, b] = await Promise.all([before.boundingBox(), after.boundingBox()]);
      // Tolerância de sub-pixel: o Firefox arredonda o layout em 1/60 px (diferença de 0,00003px).
      expect(b?.width).toBeCloseTo(a?.width ?? 0, 1);
      expect(b?.height).toBeCloseTo(a?.height ?? 0, 1);
      await expect(after.locator('[data-slot="spinner"]')).toBeVisible();
      await expect(after.locator(":scope > svg")).toBeHidden();
    }
  });

  test("Spinner: tamanhos 16/24/32px e texto para leitores de tela", async ({ page }) => {
    await openPage(page, "spinner");
    const sizes = group(page, "Spinner", "Tamanhos").getByRole("status");

    await expect(sizes).toHaveCount(3);
    for (const [index, pixels] of [16, 24, 32].entries()) {
      const box = await sizes.nth(index).boundingBox();
      expect(box?.width).toBe(pixels);
    }
    await expect(sizes.first()).toHaveText("Carregando (sm)");
  });

  test("Spinner: gira, e mais devagar com redução de movimento", async ({ page }) => {
    await openPage(page, "spinner");
    const svg = group(page, "Spinner", "Tamanhos").locator("svg").first();

    await expect(svg).toHaveCSS("animation-name", "spin");
    await expect(svg).toHaveCSS("animation-duration", "1s");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(svg).toHaveCSS("animation-name", "spin");
    await expect(svg).toHaveCSS("animation-duration", "2s");
  });

  test("componentes de feedback mudam de cor entre os temas", async ({ page }) => {
    await openPage(page, "alert");
    await expectThemeChange(
      page,
      group(page, "Alert", "Variantes").getByRole("alert").last(),
      "background-color",
    );

    await openPage(page, "spinner");
    await expectThemeChange(
      page,
      group(page, "Spinner", "Tamanhos").getByRole("status").first(),
      "color",
    );
  });
});
