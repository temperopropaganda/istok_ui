import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { Switch } from "./switch.tsx";

describe("Switch", () => {
  it("é role=switch e alterna com clique e com Espaço", async () => {
    const onCheckedChange = vi.fn();
    const screen = await render(
      <Switch aria-label="Modo avião" onCheckedChange={onCheckedChange} />,
    );
    const toggle = screen.getByRole("switch", { name: "Modo avião" });

    await expect.element(toggle).toHaveAttribute("aria-checked", "false");
    await toggle.click();
    await expect.element(toggle).toHaveAttribute("aria-checked", "true");
    // Clicar nem sempre foca o botão (Safari e WebKit): foca antes de usar o teclado.
    (toggle.element() as HTMLButtonElement).focus();
    await userEvent.keyboard(" ");
    await expect.element(toggle).toHaveAttribute("aria-checked", "false");
    expect(onCheckedChange.mock.calls).toEqual([[true], [false]]);
  });

  it("move o botão para a direita quando ligado", async () => {
    const screen = await render(
      <>
        <Switch aria-label="Desligado" />
        <Switch aria-label="Ligado" defaultChecked />
      </>,
    );
    const thumbLeft = (name: string) =>
      screen
        .getByRole("switch", { name })
        .element()
        .querySelector('[data-slot="switch-thumb"]')
        ?.getBoundingClientRect().left ?? 0;
    const trackLeft = (name: string) =>
      screen.getByRole("switch", { name }).element().getBoundingClientRect().left;

    expect(thumbLeft("Ligado") - trackLeft("Ligado")).toBeGreaterThan(
      thumbLeft("Desligado") - trackLeft("Desligado"),
    );
  });

  it("não alterna quando disabled", async () => {
    const onCheckedChange = vi.fn();
    const screen = await render(
      <Switch aria-label="Bloqueado" disabled onCheckedChange={onCheckedChange} />,
    );
    const toggle = screen.getByRole("switch");

    await expect.element(toggle).toBeDisabled();
    await toggle.click({ force: true });
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("dentro de um <form>, envia name quando ligado", async () => {
    const screen = await render(
      <form aria-label="Formulário">
        <Switch aria-label="Notificações" name="notificacoes" />
      </form>,
    );
    const form = screen.getByRole("form").element() as HTMLFormElement;

    expect(new FormData(form).get("notificacoes")).toBeNull();
    await screen.getByRole("switch").click();
    expect(new FormData(form).get("notificacoes")).toBe("on");
  });

  it("mescla o className do usuário, que vence conflitos", async () => {
    const screen = await render(<Switch aria-label="Largo" className="w-12" />);
    const toggle = screen.getByRole("switch");

    await expect.element(toggle).toHaveClass("w-12");
    await expect.element(toggle).not.toHaveClass("w-9");
  });

  it("repassa o ref para o elemento DOM", async () => {
    const ref = createRef<HTMLButtonElement>();
    await render(<Switch ref={ref} aria-label="Wi-Fi" />);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
