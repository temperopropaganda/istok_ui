import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Badge } from "../badge/badge.tsx";
import { Button } from "../button/button.tsx";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card.tsx";

const meta = {
  title: "Componentes/Card",
  component: Card,
  subcomponents: { CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

function PlanoCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plano Pro</CardTitle>
        <CardDescription>Para times que publicam toda semana.</CardDescription>
        <CardAction>
          <Badge variant="success">Ativo</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm">R$ 49/mês por pessoa, com projetos e armazenamento ilimitados.</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button>Assinar</Button>
        <Button variant="ghost">Comparar planos</Button>
      </CardFooter>
    </Card>
  );
}

/** Card completo: cabeçalho com ação, conteúdo e rodapé. */
export const Completo: Story = {
  render: () => <PlanoCard />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 3, name: "Plano Pro" })).toBeVisible();
  },
};

/** O mesmo card no tema escuro (o teste de a11y confere o contraste). */
export const CompletoEscuro: Story = {
  name: "Completo (escuro)",
  render: () => <PlanoCard />,
  globals: { theme: "escuro" },
};

/** Só as peças necessárias: título e conteúdo. */
export const Simples: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Notificações</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">Nenhuma notificação nova.</CardContent>
    </Card>
  ),
};

/** `CardTitle asChild` ajusta o nível do título; `Card asChild` troca o elemento (aqui, `<article>`). */
export const Semantica: Story = {
  name: "Semântica (asChild)",
  render: () => (
    <Card asChild>
      <article aria-labelledby="pedido-titulo">
        <CardHeader>
          <CardTitle asChild>
            <h2 id="pedido-titulo">Pedido #4821</h2>
          </CardTitle>
          <CardDescription>Entregue em 2 de outubro.</CardDescription>
        </CardHeader>
      </article>
    </Card>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("article", { name: "Pedido #4821" })).toBeVisible();
    await expect(canvas.getByRole("heading", { level: 2 })).toBeVisible();
  },
};
