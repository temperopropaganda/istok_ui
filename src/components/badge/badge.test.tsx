import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { Badge } from "./badge.tsx";

describe("Badge", () => {
  it("renderiza um <span> com a variante default", async () => {
    const screen = await render(<Badge>Novo</Badge>);
    const badge = screen.getByText("Novo");

    await expect.element(badge).toHaveAttribute("data-slot", "badge");
    await expect.element(badge).toHaveClass("bg-primary", "text-primary-foreground");
    expect(badge.element().tagName).toBe("SPAN");
  });

  it.each([
    ["secondary", "bg-secondary"],
    ["outline", "border-border"],
    ["destructive", "bg-destructive"],
    ["success", "bg-success"],
    ["warning", "bg-warning"],
  ] as const)("aplica a variante %s", async (variant, expectedClass) => {
    const screen = await render(<Badge variant={variant}>{variant}</Badge>);

    await expect.element(screen.getByText(variant)).toHaveClass(expectedClass);
  });

  it("com asChild renderiza um link com o visual do badge", async () => {
    const screen = await render(
      <Badge asChild variant="outline">
        <a href="#filtro">Filtro</a>
      </Badge>,
    );
    const link = screen.getByRole("link", { name: "Filtro" });

    await expect.element(link).toHaveAttribute("href", "#filtro");
    await expect.element(link).toHaveClass("border-border");
  });

  it("mescla o className do usuário, que vence conflitos", async () => {
    const screen = await render(<Badge className="rounded-full px-3">Novo</Badge>);
    const badge = screen.getByText("Novo");

    await expect.element(badge).toHaveClass("rounded-full", "px-3");
    await expect.element(badge).not.toHaveClass("rounded-md");
  });

  it("repassa o ref para o elemento DOM", async () => {
    const ref = createRef<HTMLSpanElement>();
    await render(<Badge ref={ref}>Novo</Badge>);

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
