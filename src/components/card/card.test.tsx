import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card.tsx";

describe("Card", () => {
  it("renderiza todas as peças com seus data-slot", async () => {
    const screen = await render(
      <Card>
        <CardHeader>
          <CardTitle>Plano Pro</CardTitle>
          <CardDescription>Cobrança mensal</CardDescription>
          <CardAction>ação</CardAction>
        </CardHeader>
        <CardContent>conteúdo</CardContent>
        <CardFooter>rodapé</CardFooter>
      </Card>,
    );

    for (const slot of [
      "card",
      "card-header",
      "card-title",
      "card-description",
      "card-action",
      "card-content",
      "card-footer",
    ]) {
      expect(screen.container.querySelector(`[data-slot="${slot}"]`)).not.toBeNull();
    }
    await expect.element(screen.getByText("Cobrança mensal")).toHaveClass("text-muted-foreground");
  });

  it("CardTitle é um <h3> por padrão", async () => {
    const screen = await render(<CardTitle>Plano Pro</CardTitle>);

    const title = screen.getByRole("heading", { level: 3, name: "Plano Pro" });
    await expect.element(title).toHaveAttribute("data-slot", "card-title");
  });

  it("CardTitle com asChild usa o nível de título informado", async () => {
    const screen = await render(
      <CardTitle asChild>
        <h2>Plano Pro</h2>
      </CardTitle>,
    );

    await expect
      .element(screen.getByRole("heading", { level: 2, name: "Plano Pro" }))
      .toHaveClass("font-semibold");
    expect(screen.container.querySelector("h3")).toBeNull();
  });

  it("Card com asChild renderiza o elemento semântico informado", async () => {
    const screen = await render(
      <Card asChild>
        <article aria-label="Pedido 42">conteúdo</article>
      </Card>,
    );

    await expect
      .element(screen.getByRole("article", { name: "Pedido 42" }))
      .toHaveClass("bg-card", "text-card-foreground");
  });

  it("mescla o className do usuário, que vence conflitos", async () => {
    const screen = await render(<Card className="rounded-none py-2">conteúdo</Card>);
    const card = screen.container.querySelector('[data-slot="card"]');

    expect(card?.className).toContain("rounded-none");
    expect(card?.className).not.toContain("rounded-xl");
    expect(card?.className).not.toContain("py-6");
  });

  it("repassa o ref para o elemento DOM", async () => {
    const ref = createRef<HTMLDivElement>();
    await render(<Card ref={ref}>conteúdo</Card>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
