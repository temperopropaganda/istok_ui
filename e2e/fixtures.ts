import AxeBuilder from "@axe-core/playwright";
import { test as base, expect, type Page } from "@playwright/test";

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

/** Liga o tema escuro pelo botão do cabeçalho da vitrine. */
export async function enableDarkTheme(page: Page) {
  const toggle = page.getByRole("button", { name: "Tema escuro" });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("html")).toHaveClass(/\bdark\b/);
}
