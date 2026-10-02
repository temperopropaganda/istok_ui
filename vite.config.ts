import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// `npm run dev` serve o playground (index.html); `npm run build` gera só a biblioteca.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
    },
    rolldownOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/],
    },
  },
});
