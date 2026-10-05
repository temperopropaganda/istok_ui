import AxeBuilder from "@axe-core/playwright";
import { test as base, expect, type Locator, type Page } from "@playwright/test";

/**
 * `test` com duas garantias automáticas em todo teste E2E:
 * - nenhum erro/warning no console nem exceção na página;
 * - `checkA11y()` disponível para rodar o axe na página inteira (ou só no seletor informado, ex.: o
 *   modal aberto, já que o conteúdo atrás dele fica inerte).
 */
export const test = base.extend<{
  consoleProblems: string[];
  checkA11y: (include?: string) => Promise<void>;
}>({
  consoleProblems: [
    async ({ page }, use) => {
      const problems: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error" || message.type() === "warning") {
          problems.push(`${message.type()}: ${message.text()}`);
        }
      });
      page.on("pageerror", (error) => {
        problems.push(`pageerror: ${error.message}`);
      });
      await use(problems);
      expect(problems, "console do navegador sem erros nem warnings").toEqual([]);
    },
    { auto: true },
  ],
  checkA11y: async ({ page }, use) => {
    await use(async (include) => {
      const builder = new AxeBuilder({ page });
      if (include) builder.include(include);
      const results = await builder.analyze();
      // Com a mensagem do axe (ex.: os valores de contraste), para a falha no CI já dizer o motivo.
      const summary = results.violations.flatMap((violation) =>
        violation.nodes.map(
          (node) =>
            `${violation.id}: ${node.target.join(" ")}${node.any[0] ? ` (${node.any[0].message})` : ""}`,
        ),
      );
      expect(summary, "violações de acessibilidade (axe)").toEqual([]);
    });
  },
});

export { expect };

/** Abre a página de um componente na vitrine (rota `#/<id>`; vazio = página inicial). */
export async function openPage(page: Page, id: string) {
  await page.goto(`/#/${id}`);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
}

/** Escolhe o tema pelo botão do cabeçalho (o padrão da vitrine é o escuro). */
export async function setTheme(page: Page, theme: "claro" | "escuro") {
  const toggle = page.getByRole("button", { name: "Tema escuro" });
  const dark = String(theme === "escuro");
  if ((await toggle.getAttribute("aria-pressed")) !== dark) await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", dark);
  if (theme === "escuro") await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  else await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
}

/** Confere que a propriedade CSS do elemento muda entre o tema claro e o escuro. */
export async function expectThemeChange(page: Page, locator: Locator, property: string) {
  await setTheme(page, "claro");
  const light = await locator.evaluate(
    (element, name) => getComputedStyle(element).getPropertyValue(name),
    property,
  );
  await setTheme(page, "escuro");
  await expect(locator).not.toHaveCSS(property, light);
}
