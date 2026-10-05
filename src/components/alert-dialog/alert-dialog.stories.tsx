import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, screen } from "storybook/test";
import { Button } from "../button/button.tsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog.tsx";

const meta = {
  title: "Componentes/AlertDialog",
  component: AlertDialogContent,
  subcomponents: {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
  },
  argTypes: {
    // O padrão fica no cva, onde o Storybook não enxerga: declarado aqui para a tabela.
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      table: { defaultValue: { summary: "md" } },
    },
  },
  render: (args) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Excluir projeto</Button>
      </AlertDialogTrigger>
      <AlertDialogContent {...args}>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir o projeto?</AlertDialogTitle>
          <AlertDialogDescription>
            O projeto e todos os arquivos dele serão apagados. Isso não pode ser desfeito.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Excluir</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
} satisfies Meta<typeof AlertDialogContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Confirmação destrutiva. `role="alertdialog"`, o foco vai para Cancelar, Esc cancela e o clique
 * fora não fecha.
 */
export const Padrao: Story = {
  name: "Padrão",
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Excluir projeto" }));
    await screen.findByRole("alertdialog", { name: "Excluir o projeto?" });
    await expect(screen.getByRole("button", { name: "Cancelar" })).toHaveFocus();
  },
};

/** Aberto no tema escuro. */
export const PadraoEscuro: Story = {
  ...Padrao,
  name: "Padrão (escuro)",
  globals: { theme: "escuro" },
};

/**
 * Ação assíncrona: `event.preventDefault()` mantém o modal aberto, `loading` mostra o progresso e o
 * modal fecha pelo `open` quando termina.
 */
export const ExclusaoAssincrona: Story = {
  name: "Exclusão assíncrona",
  render: function ExclusaoAssincrona(args) {
    const [open, setOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Excluir projeto</Button>
        </AlertDialogTrigger>
        <AlertDialogContent {...args}>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir o projeto?</AlertDialogTitle>
            <AlertDialogDescription>Isso não pode ser desfeito.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              loading={deleting}
              onClick={(event) => {
                event.preventDefault();
                setDeleting(true);
                setTimeout(() => {
                  setDeleting(false);
                  setOpen(false);
                }, 1500);
              }}
            >
              {deleting ? "Excluindo…" : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
};
