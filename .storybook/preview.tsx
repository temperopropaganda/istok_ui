import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
import "./preview.css";

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: { claro: "", escuro: "dark" },
      defaultTheme: "claro",
    }),
  ],
  parameters: {
    // Violação de acessibilidade (axe) falha o teste da story.
    a11y: { test: "error" },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
  },
  tags: ["autodocs"],
};

export default preview;
