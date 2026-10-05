import { useState, type MouseEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
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

function DeleteProject({ onDelete }: { onDelete?: (event: MouseEvent) => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Excluir projeto</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir o projeto?</AlertDialogTitle>
          <AlertDialogDescription>Isso não pode ser desfeito.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onDelete}>
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const open = async (screen: Awaited<ReturnType<typeof render>>) => {
  await screen.getByRole("button", { name: "Excluir projeto" }).click();
  return page.getByRole("alertdialog", { name: "Excluir o projeto?" });
};

describe("AlertDialog", () => {
  it("é um alertdialog com título e descrição, e o foco vai para Cancelar", async () => {
    const screen = await render(<DeleteProject />);
    const dialog = await open(screen);

    await expect.element(dialog).toBeVisible();
    await expect.element(dialog).toHaveAccessibleDescription("Isso não pode ser desfeito.");
    await expect.element(page.getByRole("button", { name: "Cancelar" })).toHaveFocus();
  });

  it("não fecha com clique fora, mas fecha com Esc e devolve o foco", async () => {
    const screen = await render(<DeleteProject />);
    const dialog = await open(screen);
    const overlay = document.querySelector('[data-slot="alert-dialog-overlay"]');

    await userEvent.click(overlay as Element, { position: { x: 5, y: 5 } });
    await expect.element(dialog).toBeVisible();

    await userEvent.keyboard("{Escape}");
    await expect.element(dialog).not.toBeInTheDocument();
    await expect.element(screen.getByRole("button", { name: "Excluir projeto" })).toHaveFocus();
  });

  it("Excluir chama onClick e fecha; Cancelar fecha sem chamar", async () => {
    const onDelete = vi.fn();
    const screen = await render(<DeleteProject onDelete={onDelete} />);

    await open(screen);
    await page.getByRole("button", { name: "Cancelar" }).click();
    await expect.element(page.getByRole("alertdialog")).not.toBeInTheDocument();
    expect(onDelete).not.toHaveBeenCalled();

    await open(screen);
    await page.getByRole("button", { name: "Excluir", exact: true }).click();
    await expect.element(page.getByRole("alertdialog")).not.toBeInTheDocument();
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("as ações são Buttons: destructive na ação, outline no cancelar", async () => {
    const screen = await render(<DeleteProject />);
    await open(screen);

    await expect
      .element(page.getByRole("button", { name: "Excluir", exact: true }))
      .toHaveClass("bg-destructive");
    await expect
      .element(page.getByRole("button", { name: "Cancelar" }))
      .toHaveClass("border-input");
  });

  it("ação assíncrona: preventDefault mantém aberto e loading bloqueia novos cliques", async () => {
    function AsyncDelete() {
      const [isOpen, setOpen] = useState(false);
      const [deleting, setDeleting] = useState(false);
      return (
        <AlertDialog open={isOpen} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button>Excluir projeto</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Excluir o projeto?</AlertDialogTitle>
            <AlertDialogDescription>Isso não pode ser desfeito.</AlertDialogDescription>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              loading={deleting}
              onClick={(event) => {
                event.preventDefault();
                setDeleting(true);
              }}
            >
              {deleting ? "Excluindo…" : "Excluir"}
            </AlertDialogAction>
            <button
              type="button"
              onClick={() => {
                setDeleting(false);
                setOpen(false);
              }}
            >
              terminar
            </button>
          </AlertDialogContent>
        </AlertDialog>
      );
    }
    const screen = await render(<AsyncDelete />);
    await screen.getByRole("button", { name: "Excluir projeto" }).click();

    await page.getByRole("button", { name: "Excluir", exact: true }).click();
    const deleting = page.getByRole("button", { name: "Excluindo…" });
    await expect.element(deleting).toHaveAttribute("aria-busy", "true");
    await deleting.click({ force: true });
    await expect.element(page.getByRole("alertdialog")).toBeVisible();

    await page.getByRole("button", { name: "terminar" }).click();
    await expect.element(page.getByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("mescla o className do usuário no conteúdo", async () => {
    await render(
      <AlertDialog defaultOpen>
        <AlertDialogContent className="gap-8">
          <AlertDialogTitle>Título</AlertDialogTitle>
          <AlertDialogDescription>Descrição</AlertDialogDescription>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>,
    );

    await expect.element(page.getByRole("alertdialog")).toHaveClass("gap-8");
    await expect.element(page.getByRole("alertdialog")).not.toHaveClass("gap-4");
  });
});
