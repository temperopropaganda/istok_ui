import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./skeleton.tsx";

const meta = {
  title: "Componentes/Skeleton",
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Carregamento de um item de lista. O contêiner usa `aria-busy` e um texto `sr-only` para
 * leitores de tela; os blocos são decorativos.
 */
export const ItemDeLista: Story = {
  name: "Item de lista",
  render: () => (
    <div aria-busy="true" className="flex items-center gap-3">
      <span className="sr-only">Carregando perfil…</span>
      <Skeleton className="size-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  ),
};

/** Carregamento de um card. */
export const Card: Story = {
  render: () => (
    <div aria-busy="true" className="max-w-sm space-y-3">
      <span className="sr-only">Carregando card…</span>
      <Skeleton className="h-36 w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  ),
};

/** No tema escuro. */
export const CardEscuro: Story = {
  ...Card,
  name: "Card (escuro)",
  globals: { theme: "escuro" },
};
