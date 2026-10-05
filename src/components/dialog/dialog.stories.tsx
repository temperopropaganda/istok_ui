import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen } from "storybook/test";
import { Button } from "../button/button.tsx";
import { Field, FieldLabel } from "../field/field.tsx";
import { Input } from "../input/input.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog.tsx";

const sizes = ["sm", "md", "lg"] as const;

const meta = {
  title: "Componentes/Dialog",
  component: DialogContent,
  subcomponents: {
    Dialog,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
  },
  args: { showCloseButton: true, closeLabel: "Fechar" },
  argTypes: {
    // O padrão fica no cva, onde o Storybook não enxerga: declarado aqui para a tabela.
    size: { control: "select", options: sizes, table: { defaultValue: { summary: "md" } } },
  },
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Editar perfil</Button>
      </DialogTrigger>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>As mudanças aparecem para todo o time.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field>
            <FieldLabel>Nome</FieldLabel>
            <Input defaultValue="Ana Souza" />
          </Field>
          <Field>
            <FieldLabel>Usuário</FieldLabel>
            <Input defaultValue="ana.souza" />
          </Field>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Salvar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
} satisfies Meta<typeof DialogContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Modal com formulário. Prende o foco, fecha com Esc, com clique fora ou pelo X, e devolve o foco
 * ao botão que abriu.
 */
export const Padrao: Story = {
  name: "Padrão",
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Editar perfil" }));
    const dialog = await screen.findByRole("dialog", { name: "Editar perfil" });
    await expect(dialog).toHaveAccessibleDescription("As mudanças aparecem para todo o time.");
    await expect(screen.getByRole("textbox", { name: "Nome" })).toHaveFocus();
  },
};

/** Aberto no tema escuro (o teste de a11y confere o contraste do modal). */
export const PadraoEscuro: Story = {
  ...Padrao,
  name: "Padrão (escuro)",
  globals: { theme: "escuro" },
};

/** Larguras `sm` (384px), `md` (512px, padrão) e `lg` (672px). */
export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex gap-3">
      {sizes.map((size) => (
        <Dialog key={size}>
          <DialogTrigger asChild>
            <Button variant="outline">Abrir {size}</Button>
          </DialogTrigger>
          <DialogContent {...args} size={size}>
            <DialogHeader>
              <DialogTitle>Tamanho {size}</DialogTitle>
              <DialogDescription>A largura máxima muda com o `size`.</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
};

/** Sem o X: fecha pelos botões do rodapé, Esc ou clique fora. */
export const SemBotaoFechar: Story = {
  name: "Sem botão de fechar",
  args: { showCloseButton: false },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Editar perfil" }));
    await screen.findByRole("dialog");
    await expect(screen.queryByRole("button", { name: "Fechar" })).toBeNull();
  },
};

/** Conteúdo maior que a tela: o modal rola por dentro. */
export const ConteudoLongo: Story = {
  name: "Conteúdo longo",
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Ler os termos</Button>
      </DialogTrigger>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>Termos de uso</DialogTitle>
          <DialogDescription>Última atualização: outubro de 2026.</DialogDescription>
        </DialogHeader>
        {Array.from({ length: 12 }, (_, index) => (
          <p key={index} className="text-sm">
            {index + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </p>
        ))}
        <DialogFooter>
          <DialogClose asChild>
            <Button>Entendi</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
