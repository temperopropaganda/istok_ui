import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { Input } from "./input.tsx";

describe("Input", () => {
  it("renderiza um <input> com o type informado", async () => {
    const screen = await render(<Input type="email" aria-label="E-mail" />);
    const input = screen.getByRole("textbox", { name: "E-mail" });

    await expect.element(input).toHaveAttribute("type", "email");
    await expect.element(input).toHaveAttribute("data-slot", "input");
  });

  it("aceita digitação e chama onChange", async () => {
    const onChange = vi.fn();
    const screen = await render(<Input aria-label="Nome" onChange={onChange} />);
    const input = screen.getByRole("textbox");

    await input.fill("Ana Souza");

    await expect.element(input).toHaveValue("Ana Souza");
    expect(onChange).toHaveBeenCalled();
  });

  it("tem 32, 36 e 40px de altura nos tamanhos sm, md (padrão) e lg", async () => {
    const screen = await render(
      <>
        <Input size="sm" aria-label="sm" />
        <Input aria-label="md" />
        <Input size="lg" aria-label="lg" />
      </>,
    );

    for (const [name, pixels] of [
      ["sm", 32],
      ["md", 36],
      ["lg", 40],
    ] as const) {
      const rect = screen.getByRole("textbox", { name }).element().getBoundingClientRect();
      expect(rect.height).toBe(pixels);
    }
  });

  it("não aceita digitação quando disabled", async () => {
    const screen = await render(<Input aria-label="Nome" disabled />);
    const input = screen.getByRole("textbox");

    await expect.element(input).toBeDisabled();
    await input.fill("Ana", { force: true }).catch(() => undefined);
    await expect.element(input).toHaveValue("");
  });

  it("aria-invalid deixa a borda na cor de erro", async () => {
    const screen = await render(
      <>
        <Input aria-label="Válido" />
        <Input aria-label="Inválido" aria-invalid />
        <span className="text-destructive">referência</span>
      </>,
    );
    const border = (name: string) =>
      getComputedStyle(screen.getByRole("textbox", { name }).element()).borderTopColor;
    const destructive = getComputedStyle(screen.getByText("referência").element()).color;

    expect(border("Inválido")).toBe(destructive);
    expect(border("Válido")).not.toBe(destructive);
  });

  it("mescla o className do usuário, que vence conflitos", async () => {
    const screen = await render(<Input aria-label="Nome" className="h-12 rounded-none" />);
    const input = screen.getByRole("textbox");

    await expect.element(input).toHaveClass("h-12", "rounded-none");
    await expect.element(input).not.toHaveClass("h-9");
    await expect.element(input).not.toHaveClass("rounded-md");
  });

  it("repassa o ref para o elemento DOM", async () => {
    const ref = createRef<HTMLInputElement>();
    await render(<Input ref={ref} aria-label="Nome" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
