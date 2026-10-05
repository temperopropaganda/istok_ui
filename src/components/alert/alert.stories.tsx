import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Alert, AlertDescription, AlertTitle } from "./alert.tsx";

function InfoIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
        strokeLinejoin="round"
      />
      <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
    </svg>
  );
}

const examples = [
  {
    variant: "default",
    Icon: InfoIcon,
    title: "Atualização disponível",
    description: "Recarregue a página para ver as novidades.",
  },
  {
    variant: "success",
    Icon: CheckIcon,
    title: "Pedido enviado",
    description: "Você vai receber a confirmação por e-mail.",
  },
  {
    variant: "warning",
    Icon: WarningIcon,
    title: "Assinatura vence em 3 dias",
    description: "Renove para não perder o acesso aos projetos.",
  },
  {
    variant: "destructive",
    Icon: ErrorIcon,
    title: "Falha no pagamento",
    description: "O cartão foi recusado. Confira os dados e tente de novo.",
  },
] as const;

const meta = {
  title: "Componentes/Alert",
  component: Alert,
  subcomponents: { AlertTitle, AlertDescription },
  argTypes: {
    // O padrão fica no cva, onde o Storybook não enxerga: declarado aqui para a tabela.
    variant: {
      control: "select",
      options: examples.map((example) => example.variant),
      table: { defaultValue: { summary: "default" } },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Alerta padrão com ícone, título e descrição. Use os controles para trocar a variante. */
export const Padrao: Story = {
  name: "Padrão",
  render: (args) => (
    <Alert {...args}>
      <InfoIcon />
      <AlertTitle>Atualização disponível</AlertTitle>
      <AlertDescription>Recarregue a página para ver as novidades.</AlertDescription>
    </Alert>
  ),
};

/**
 * Todas as variantes. `default` e `success` são `role="status"`; `warning` e `destructive` são
 * `role="alert"` (interrompem o leitor de tela).
 */
export const Variantes: Story = {
  render: () => (
    <div className="space-y-3">
      {examples.map(({ variant, Icon, title, description }) => (
        <Alert key={variant} variant={variant}>
          <Icon />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </Alert>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("status")).toHaveLength(2);
    await expect(canvas.getAllByRole("alert")).toHaveLength(2);
  },
};

/** Todas as variantes no tema escuro (o teste de a11y confere o contraste). */
export const VariantesEscuro: Story = {
  ...Variantes,
  name: "Variantes (escuro)",
  globals: { theme: "escuro" },
};

/** Sem ícone, o texto ocupa a largura toda. */
export const SemIcone: Story = {
  name: "Sem ícone",
  render: () => (
    <Alert>
      <AlertTitle>Manutenção programada</AlertTitle>
      <AlertDescription>O sistema fica fora do ar no domingo, das 2h às 4h.</AlertDescription>
    </Alert>
  ),
};

/** A descrição aceita parágrafos e listas. */
export const ComLista: Story = {
  name: "Com lista",
  render: () => (
    <Alert variant="destructive">
      <ErrorIcon />
      <AlertTitle>Não foi possível salvar</AlertTitle>
      <AlertDescription>
        <p>Corrija os campos abaixo e tente de novo:</p>
        <ul className="list-inside list-disc">
          <li>E-mail inválido</li>
          <li>Senha com menos de 8 caracteres</li>
        </ul>
      </AlertDescription>
    </Alert>
  ),
};
