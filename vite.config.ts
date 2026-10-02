import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import pkg from "./package.json" with { type: "json" };

// Tudo que o projeto consumidor instala (dependencies + peerDependencies) fica fora do bundle.
const externalDeps = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)];

// `npm run dev` serve o playground (index.html); `npm run build` gera só a biblioteca.
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
