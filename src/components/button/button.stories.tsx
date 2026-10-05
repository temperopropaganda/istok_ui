import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn } from "storybook/test";
import { Button } from "./button.tsx";

function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

const variants = ["default", "secondary", "outline", "ghost", "link", "destructive"] as const;
const sizes = ["sm", "md", "lg"] as const;

const meta = {
  title: "Componentes/Button",
  component: Button,
  args: {
    children: "Salvar",
    onClick: fn(),
  },
  argTypes: {
    // Os padrões ficam no cva, onde o Storybook não enxerga: declarados aqui para a tabela.
    variant: {
      control: "select",
      options: variants,
      table: { defaultValue: { summary: "default" } },
    },
    size: {
      control: "select",
      options: [...sizes, "icon"],
      table: { defaultValue: { summary: "md" } },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Botão padrão. Use os controles para testar variantes, tamanhos e estados. */
export const Padrao: Story = {
  name: "Padrão",
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Salvar" }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

/** Todas as variantes lado a lado. */
export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

/** Todas as variantes no tema escuro (o teste de a11y confere o contraste). */
export const VariantesEscuro: Story = {
  ...Variantes,
  name: "Variantes (escuro)",
  globals: { theme: "escuro" },
};

/** Tamanhos `sm`, `md` (padrão) e `lg`, com e sem ícone. */
export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-3">
      {sizes.map((size) => (
        <div key={size} className="flex items-center gap-3">
          <Button {...args} size={size}>
            Tamanho {size}
          </Button>
          <Button {...args} size={size}>
            <PlusIcon />
            Com ícone
          </Button>
        </div>
      ))}
    </div>
  ),
};

/** Botão só com ícone: `size="icon"` e `aria-label` obrigatório. */
export const SoIcone: Story = {
  name: "Só ícone",
  args: { size: "icon", "aria-label": "Adicionar", children: <PlusIcon /> },
};

/** Desabilitado: não recebe foco nem cliques. */
export const Desabilitado: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button", { name: "Salvar" });
    await expect(button).toBeDisabled();
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

/** Com `asChild`, o visual de botão vai para o filho, aqui um link. */
export const ComoLink: Story = {
  name: "Como link (asChild)",
  args: {
    asChild: true,
    variant: "outline",
    children: <a href="#documentacao">Ver documentação</a>,
  },
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "Ver documentação" });
    await expect(link).toHaveAttribute("href", "#documentacao");
  },
};

/** Carregando: mostra o Spinner, fica focável e ignora cliques (`aria-busy` + `aria-disabled`). */
export const Carregando: Story = {
  args: { loading: true, children: "Salvando…" },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Salvando…" });
    await expect(button).toHaveAttribute("aria-busy", "true");
    await expect(button).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

/** Carregando em todas as variantes, e no lugar do ícone (sem mudar o tamanho). */
export const CarregandoVariantes: Story = {
  name: "Carregando (variantes)",
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant} loading>
          {variant}
        </Button>
      ))}
      <Button {...args} variant="secondary" loading>
        <PlusIcon />
        Adicionar
      </Button>
      <Button {...args} size="icon" variant="outline" aria-label="Adicionar" loading>
        <PlusIcon />
      </Button>
    </div>
  ),
};

/** Carregando no tema escuro. */
export const CarregandoEscuro: Story = {
  ...CarregandoVariantes,
  name: "Carregando (escuro)",
  globals: { theme: "escuro" },
};

/** Clique para simular um envio de 2 segundos: o texto muda junto com o estado. */
export const EnvioSimulado: Story = {
  name: "Envio simulado",
  render: function EnvioSimulado(args) {
    const [loading, setLoading] = useState(false);
    return (
      <Button
        {...args}
        loading={loading}
        onClick={() => {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
          }, 2000);
        }}
      >
        {loading ? "Salvando…" : "Salvar"}
      </Button>
    );
  },
};
