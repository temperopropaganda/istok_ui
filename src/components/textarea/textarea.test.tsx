import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { Textarea } from "./textarea.tsx";

describe("Textarea", () => {
  it("renderiza um <textarea> que aceita digitação", async () => {
    const screen = await render(<Textarea aria-label="Mensagem" />);
    const textarea = screen.getByRole("textbox", { name: "Mensagem" });

    await textarea.fill("Olá");

    await expect.element(textarea).toHaveValue("Olá");
    await expect.element(textarea).toHaveAttribute("data-slot", "textarea");
  });

  it("tem altura mínima de 56, 64 e 80px nos tamanhos sm, md (padrão) e lg", async () => {
    const screen = await render(
      <>
        <Textarea size="sm" aria-label="sm" />
        <Textarea aria-label="md" />
        <Textarea size="lg" aria-label="lg" />
      </>,
    );

    for (const [name, pixels] of [
      ["sm", 56],
      ["md", 64],
      ["lg", 80],
    ] as const) {
      const element = screen.getByRole("textbox", { name }).element();
      expect(getComputedStyle(element).minHeight).toBe(`${String(pixels)}px`);
    }
  });

  it("cresce com o conteúdo", async () => {
    const screen = await render(<Textarea aria-label="Mensagem" />);
    const textarea = screen.getByRole("textbox");
    const before = textarea.element().getBoundingClientRect().height;

    await textarea.fill("linha 1\nlinha 2\nlinha 3\nlinha 4\nlinha 5\nlinha 6");

    expect(textarea.element().getBoundingClientRect().height).toBeGreaterThan(before);
  });

  it("fica desabilitado com disabled", async () => {
    const screen = await render(<Textarea aria-label="Mensagem" disabled />);

    await expect.element(screen.getByRole("textbox")).toBeDisabled();
  });

  it("mescla o className do usuário, que vence conflitos", async () => {
    const screen = await render(<Textarea aria-label="Mensagem" className="min-h-40 px-6" />);
    const textarea = screen.getByRole("textbox");

    await expect.element(textarea).toHaveClass("min-h-40", "px-6");
    await expect.element(textarea).not.toHaveClass("min-h-16");
    await expect.element(textarea).not.toHaveClass("px-3");
  });

  it("repassa o ref para o elemento DOM", async () => {
    const ref = createRef<HTMLTextAreaElement>();
    await render(<Textarea ref={ref} aria-label="Mensagem" />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
