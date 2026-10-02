import AxeBuilder from "@axe-core/playwright";
import { test as base, expect, type Page } from "@playwright/test";

/**
 * `test` com duas garantias automáticas em todo teste E2E:
 * - nenhum erro/warning no console nem exceção na página;
 * - `checkA11y()` disponível para rodar o axe na página inteira.
 */
export const test = base.extend<{ consoleProblems: string[]; checkA11y: () => Promise<void> }>({
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
    await use(async () => {
      const results = await new AxeBuilder({ page }).analyze();
      const summary = results.violations.map(
        (violation) =>
          `${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`,
      );
      expect(summary, "violações de acessibilidade (axe)").toEqual([]);
    });
  },
});

export { expect };

/** Liga o tema escuro pelo botão do cabeçalho da vitrine. */
export async function enableDarkTheme(page: Page) {
  const toggle = page.getByRole("button", { name: "Tema escuro" });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("html")).toHaveClass(/\bdark\b/);
}
