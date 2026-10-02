import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import pkg from "./package.json" with { type: "json" };

// Tudo que o projeto consumidor instala (dependencies + peerDependencies) fica fora do bundle.
const externalDeps = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)];

// Publica o theme.css cru em dist/: quem compila é o Tailwind do projeto consumidor.
function copyThemeCss(): Plugin {
  const themePath = fileURLToPath(new URL("./src/styles/theme.css", import.meta.url));
  return {
    name: "istok:copy-theme-css",
    // Só no build da lib (o Storybook reaproveita esta config sem o modo biblioteca).
    apply: (config, { command }) => command === "build" && config.build?.lib !== undefined,
    buildStart() {
      this.addWatchFile(themePath);
    },
    async generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "theme.css",
        source: await readFile(themePath, "utf8"),
      });
    },
  };
}

// `npm run dev` serve o playground (index.html); `npm run build` gera só a biblioteca.
export default defineConfig({
  plugins: [react(), tailwindcss(), copyThemeCss()],
  build: {
    // Lib publicada sem minificação: quem minifica é o build do projeto consumidor.
    minify: false,
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
    },
    rolldownOptions: {
      external: (id) => externalDeps.some((dep) => id === dep || id.startsWith(`${dep}/`)),
      output: {
        // Um arquivo por módulo em dist/, espelhando src/: o projeto só carrega o que importar.
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
  },
});
