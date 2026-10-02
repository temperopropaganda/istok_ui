import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "./separator.tsx";

const meta = {
  title: "Componentes/Separator",
  component: Separator,
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Horizontal entre blocos de conteúdo. */
export const Horizontal: Story = {
  render: (args) => (
    <div className="max-w-sm text-sm">
      <p className="font-medium">istok_ui</p>
      <p className="text-muted-foreground">Biblioteca de componentes.</p>
      <Separator {...args} className="my-4" />
      <p>Documentação · Componentes · Tokens</p>
    </div>
  ),
};

/** Vertical entre itens em linha. */
export const Vertical: Story = {
  render: (args) => (
    <div className="flex h-5 items-center gap-4 text-sm">
      <span>Documentação</span>
      <Separator {...args} orientation="vertical" />
      <span>Componentes</span>
      <Separator {...args} orientation="vertical" />
      <span>Tokens</span>
    </div>
  ),
};

/** Com `decorative={false}`, leitores de tela anunciam a separação (`role="separator"`). */
export const Semantico: Story = {
  name: "Semântico (decorative=false)",
  args: { decorative: false },
  render: Horizontal.render,
};
