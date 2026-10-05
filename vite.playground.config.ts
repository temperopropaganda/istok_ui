import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Build estático do playground (vitrine) para o GitHub Pages, servido em /istok_ui/playground/.
// Caminhos relativos (`./`) e rotas por hash: funciona em qualquer subpasta, sem configurar servidor.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./",
  build: {
    outDir: "playground-dist",
    emptyOutDir: true,
  },
});
