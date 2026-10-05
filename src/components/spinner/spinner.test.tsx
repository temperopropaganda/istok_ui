import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { Spinner } from "./spinner.tsx";

describe("Spinner", () => {
  it("é uma região de status com o texto padrão para leitores de tela", async () => {
    const screen = await render(<Spinner />);
    const spinner = screen.getByRole("status");

    await expect.element(spinner).toHaveTextContent("Carregando");
    await expect.element(spinner).toHaveAttribute("data-slot", "spinner");
    await expect.element(screen.getByText("Carregando")).toHaveClass("sr-only");
    expect(spinner.element().querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("usa o label informado", async () => {
    const screen = await render(<Spinner label="Enviando arquivo" />);

    await expect.element(screen.getByRole("status")).toHaveTextContent("Enviando arquivo");
  });

  it("tem 16, 24 e 32px nos tamanhos sm, md (padrão) e lg", async () => {
    const screen = await render(
      <>
        <Spinner size="sm" label="sm" />
        <Spinner label="md" />
        <Spinner size="lg" label="lg" />
      </>,
    );

    for (const [label, pixels] of [
      ["sm", 16],
      ["md", 24],
      ["lg", 32],
    ] as const) {
      // `status` não tira o nome do conteúdo: acha pelo texto e sobe até o Spinner.
      const spinner = screen.getByText(label).element().closest('[data-slot="spinner"]');
      const rect = spinner?.getBoundingClientRect();
      expect(rect?.width).toBe(pixels);
      expect(rect?.height).toBe(pixels);
    }
  });

  it("gira, e gira mais devagar com redução de movimento", async () => {
    const screen = await render(<Spinner />);
    const svg = screen.getByRole("status").element().querySelector("svg");

    expect(svg && getComputedStyle(svg).animationName).toBe("spin");
    expect(svg?.getAttribute("class")).toContain("motion-reduce:animate-[spin_2s_linear_infinite]");
  });

  it("mescla o className do usuário, que vence conflitos", async () => {
    const screen = await render(<Spinner size="sm" className="size-12 text-muted-foreground" />);
    const spinner = screen.getByRole("status");

    await expect.element(spinner).toHaveClass("size-12", "text-muted-foreground");
    await expect.element(spinner).not.toHaveClass("size-4");
  });

  it("repassa o ref para o elemento DOM", async () => {
    const ref = createRef<HTMLSpanElement>();
    await render(<Spinner ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
