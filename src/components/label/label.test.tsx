import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { Label } from "./label.tsx";

describe("Label", () => {
  it("renderiza um <label> que nomeia o controle pelo htmlFor", async () => {
    const screen = await render(
      <>
        <Label htmlFor="nome">Nome</Label>
        <input id="nome" />
      </>,
    );

    await expect.element(screen.getByRole("textbox", { name: "Nome" })).toBeInTheDocument();
    await expect.element(screen.getByText("Nome")).toHaveAttribute("data-slot", "label");
    expect(screen.getByText("Nome").element().tagName).toBe("LABEL");
  });

  it("clicar no rótulo foca o controle", async () => {
    const screen = await render(
      <>
        <Label htmlFor="email">E-mail</Label>
        <input id="email" />
      </>,
    );

    await screen.getByText("E-mail").click();

    await expect.element(screen.getByRole("textbox")).toHaveFocus();
  });

  it("mescla o className do usuário, que vence conflitos", async () => {
    const screen = await render(<Label className="text-base font-bold">Nome</Label>);
    const label = screen.getByText("Nome");

    await expect.element(label).toHaveClass("text-base", "font-bold");
    await expect.element(label).not.toHaveClass("text-sm");
    await expect.element(label).not.toHaveClass("font-medium");
  });

  it("repassa o ref para o elemento DOM", async () => {
    const ref = createRef<HTMLLabelElement>();
    await render(<Label ref={ref}>Nome</Label>);

    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });
});
