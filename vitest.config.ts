import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.ts";

// Tudo roda num navegador real (via Playwright), sem simulação de DOM. Cada navegador vira um
// projeto ("unit (chromium)", "storybook (firefox)"…); os scripts escolhem pelo nome:
// `npm test` só Chromium, `npm run test:browsers` Firefox e WebKit (no CI, os três). Firefox e
// WebKit rodam um arquivo por vez (`--no-file-parallelism`): páginas paralelas no mesmo navegador
// disputam o foco do teclado e os testes de Espaço/Enter falham aleatoriamente.
// Função (e não objeto compartilhado) porque o Vitest altera a config de cada projeto.
const browser = () => ({
  enabled: true,
  headless: true,
  provider: playwright(),
  instances: [
    { browser: "chromium" as const },
    { browser: "firefox" as const },
    { browser: "webkit" as const },
  ],
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
        // O provider v8 só mede no Chromium (`npm run test:coverage`).
        thresholds: { lines: 90, functions: 90, branches: 90, statements: 90 },
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
