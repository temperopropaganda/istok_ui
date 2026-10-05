import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen } from "storybook/test";
import { Button } from "../button/button.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip.tsx";

function Icon({ path }: { path: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

const bold = "M6 12h9a4 4 0 0 1 0 8H6V4h8a4 4 0 0 1 0 8";
const italic = "M19 4h-9M14 20H5M15 4 9 20";
const underline = "M6 4v6a6 6 0 0 0 12 0V4M4 20h16";

const meta = {
  title: "Componentes/Tooltip",
  component: TooltipContent,
  subcomponents: { Tooltip, TooltipTrigger, TooltipProvider },
  args: { side: "top", children: "Negrito (Ctrl+B)" },
  argTypes: {
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
  },
  decorators: [
    (Story) => (
      <div className="flex justify-center p-12">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Negrito">
          <Icon path={bold} />
        </Button>
      </TooltipTrigger>
      <TooltipContent {...args} />
    </Tooltip>
  ),
} satisfies Meta<typeof TooltipContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Abre com o ponteiro ou o foco, depois de 300ms. O botão continua com `aria-label`: a dica é só a
 * descrição.
 */
export const Padrao: Story = {
  name: "Padrão",
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Negrito" });
    await userEvent.hover(trigger);
    await expect(await screen.findByRole("tooltip")).toHaveTextContent("Negrito (Ctrl+B)");
    await expect(trigger).toHaveAccessibleDescription("Negrito (Ctrl+B)");
  },
};

/** Aberto no tema escuro. */
export const PadraoEscuro: Story = {
  ...Padrao,
  name: "Padrão (escuro)",
  globals: { theme: "escuro" },
};

/** Barra de ferramentas com `TooltipProvider`: depois do primeiro, os vizinhos abrem na hora. */
export const BarraDeFerramentas: Story = {
  name: "Barra de ferramentas",
  render: () => (
    <TooltipProvider>
      <div role="toolbar" aria-label="Formatação" className="flex gap-1 rounded-lg border p-1">
        {[
          { label: "Negrito", hint: "Negrito (Ctrl+B)", path: bold },
          { label: "Itálico", hint: "Itálico (Ctrl+I)", path: italic },
          { label: "Sublinhado", hint: "Sublinhado (Ctrl+U)", path: underline },
        ].map(({ label, hint, path }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={label}>
                <Icon path={path} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{hint}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
};
