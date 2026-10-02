import { cn } from "istok-ui";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// Usa a API como um projeto real usaria: import do pacote + utilitários do tema.
function App() {
  return (
    <main className={cn("bg-background p-8 text-foreground", "dark:bg-card")}>
      <button type="button" className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">
        istok_ui
      </button>
    </main>
  );
}

const root = document.getElementById("root");
if (!root) throw new Error("Elemento #root não encontrado");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
