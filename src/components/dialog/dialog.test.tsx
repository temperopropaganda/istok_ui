import { createRef, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { Button } from "../button/button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  type DialogContentProps,
} from "./dialog.tsx";

function Profile(props: DialogContentProps & { onOpenChange?: (open: boolean) => void }) {
  const { onOpenChange, ...contentProps } = props;
  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Editar perfil</Button>
      </DialogTrigger>
      <DialogContent {...contentProps}>
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>As mudanças aparecem para todo o time.</DialogDescription>
        </DialogHeader>
        <input aria-label="Nome" />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  afterEach(async () => {
    await page.viewport(414, 896);
  });

  it("abre pelo gatilho, com nome e descrição vindos do título e da descrição", async () => {
    const screen = await render(<Profile />);

    expect(document.querySelector('[role="dialog"]')).toBeNull();
    await screen.getByRole("button", { name: "Editar perfil" }).click();

    const dialog = page.getByRole("dialog", { name: "Editar perfil" });
    await expect.element(dialog).toBeVisible();
    await expect
      .element(dialog)
      .toHaveAccessibleDescription("As mudanças aparecem para todo o time.");
    expect(dialog.element().closest("body > *")?.contains(screen.container)).toBe(false);
  });

  it("leva o foco para dentro, Esc fecha e o foco volta ao gatilho", async () => {
    const onOpenChange = vi.fn();
    const screen = await render(<Profile onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole("button", { name: "Editar perfil" });

    await trigger.click();
    await expect.element(page.getByRole("textbox", { name: "Nome" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");

    await expect.element(page.getByRole("dialog")).not.toBeInTheDocument();
    await expect.element(trigger).toHaveFocus();
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
  });

  it("Tab fica preso dentro do modal", async () => {
    const screen = await render(<Profile />);
    await screen.getByRole("button", { name: "Editar perfil" }).click();
    const dialog = page.getByRole("dialog").element();

    for (let i = 0; i < 5; i++) {
      await userEvent.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
    await userEvent.tab({ shift: true });
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("botão Fechar, DialogClose e clique fora fecham", async () => {
    const screen = await render(<Profile />);
    const trigger = screen.getByRole("button", { name: "Editar perfil" });

    await trigger.click();
    await page.getByRole("button", { name: "Fechar" }).click();
    await expect.element(page.getByRole("dialog")).not.toBeInTheDocument();

    await trigger.click();
    await page.getByRole("button", { name: "Cancelar" }).click();
    await expect.element(page.getByRole("dialog")).not.toBeInTheDocument();

    await trigger.click();
    const overlay = document.querySelector('[data-slot="dialog-overlay"]');
    expect(overlay).not.toBeNull();
    await userEvent.click(overlay as Element, { position: { x: 5, y: 5 } });
    await expect.element(page.getByRole("dialog")).not.toBeInTheDocument();
  });

  it("closeLabel troca o nome do botão de fechar; showCloseButton={false} tira o botão", async () => {
    const screen = await render(<Profile closeLabel="Close" />);
    await screen.getByRole("button", { name: "Editar perfil" }).click();
    await expect.element(page.getByRole("button", { name: "Close" })).toBeVisible();
    await userEvent.keyboard("{Escape}");

    await screen.rerender(<Profile showCloseButton={false} />);
    await screen.getByRole("button", { name: "Editar perfil" }).click();
    await expect.element(page.getByRole("dialog")).toBeVisible();
    expect(page.getByRole("button", { name: "Fechar" }).query()).toBeNull();
  });

  it("trava a rolagem e esconde o resto da página de leitores de tela enquanto aberto", async () => {
    const screen = await render(<Profile />);
    await screen.getByRole("button", { name: "Editar perfil" }).click();

    await expect.element(page.getByRole("dialog")).toBeVisible();
    expect(getComputedStyle(document.body).overflow).toBe("hidden");
    expect(screen.container.closest("[aria-hidden='true']")).not.toBeNull();

    await userEvent.keyboard("{Escape}");
    await expect.element(page.getByRole("dialog")).not.toBeInTheDocument();
    expect(getComputedStyle(document.body).overflow).not.toBe("hidden");
  });

  // offsetWidth: largura de layout, sem o `scale` da animação de entrada.
  it("tem 384, 512 e 672px nos tamanhos sm, md (padrão) e lg; no celular, a tela menos 32px", async () => {
    await page.viewport(1024, 768);
    for (const [size, pixels] of [
      ["sm", 384],
      [undefined, 512],
      ["lg", 672],
    ] as const) {
      const screen = await render(<Profile size={size} />);
      await screen.getByRole("button", { name: "Editar perfil" }).click();
      expect((page.getByRole("dialog").element() as HTMLElement).offsetWidth).toBe(pixels);
      await userEvent.keyboard("{Escape}");
      await expect.element(page.getByRole("dialog")).not.toBeInTheDocument();
      await screen.unmount();
    }

    await page.viewport(414, 896);
    const screen = await render(<Profile />);
    await screen.getByRole("button", { name: "Editar perfil" }).click();
    expect((page.getByRole("dialog").element() as HTMLElement).offsetWidth).toBe(414 - 32);
  });

  it("funciona controlado por open/onOpenChange", async () => {
    function Controlled() {
      const [open, setOpen] = useState(true);
      return (
        <>
          <output>{open ? "aberto" : "fechado"}</output>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent aria-describedby={undefined}>
              <DialogTitle>Controlado</DialogTitle>
            </DialogContent>
          </Dialog>
        </>
      );
    }
    const screen = await render(<Controlled />);

    await expect.element(page.getByRole("dialog", { name: "Controlado" })).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await expect.element(screen.getByText("fechado")).toBeInTheDocument();
  });

  it("mescla o className do usuário e repassa o ref do conteúdo", async () => {
    const ref = createRef<HTMLDivElement>();
    await render(
      <Dialog defaultOpen>
        <DialogContent ref={ref} className="p-10" aria-describedby={undefined}>
          <DialogTitle className="text-2xl">Título</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    const dialog = page.getByRole("dialog");
    await expect.element(dialog).toHaveClass("p-10");
    await expect.element(dialog).not.toHaveClass("p-6");
    await expect
      .element(page.getByRole("heading", { level: 2, name: "Título" }))
      .toHaveClass("text-2xl");
    expect(ref.current).toBe(dialog.element());
  });

  it("anima a entrada com zoom-in", async () => {
    await render(
      <Dialog defaultOpen>
        <DialogContent aria-describedby={undefined}>
          <DialogTitle>Animado</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(getComputedStyle(page.getByRole("dialog").element()).animationName).toBe("zoom-in");
  });
});
