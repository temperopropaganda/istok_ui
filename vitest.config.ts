import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.ts";

// Tudo roda num navegador real (Chromium via Playwright), sem simulação de DOM.
// Função (e não objeto compartilhado) porque o Vitest altera a config de cada projeto.
const browser = () => ({
  enabled: true,
  headless: true,
  provider: playwright(),
  instances: [{ browser: "chromium" as const }],
});

export default mergeConfig(
  viteConfig,
  defineConfig({
    // Dependências pré-otimizadas: sem isso o Vite as descobre no meio da rodada e recarrega os
    // testes (instável no CI, que sempre começa sem cache).
    optimizeDeps: {
      include: [
        "radix-ui",
        "class-variance-authority",
        "clsx",
        "tailwind-merge",
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-dev-runtime",
        "vitest-browser-react",
      ],
    },
    test: {
      coverage: {
        provider: "v8",
        include: ["src/**/*.{ts,tsx}"],
        exclude: ["src/**/*.stories.tsx", "src/**/*.test.{ts,tsx}"],
      },
      projects: [
        {
          extends: true,
          test: {
            name: "unit",
            include: ["src/**/*.test.{ts,tsx}"],
            setupFiles: ["tests/setup.ts"],
            browser: browser(),
          },
        },
        {
          // Cada story vira um teste: renderiza sem erro e passa no axe (acessibilidade).
          extends: true,
          plugins: [storybookTest({ configDir: ".storybook" })],
          test: {
            name: "storybook",
            browser: browser(),
          },
        },
      ],
    },
  }),
);
