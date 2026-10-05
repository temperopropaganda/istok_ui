import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { Alert, AlertDescription, AlertTitle } from "./alert.tsx";

describe("Alert", () => {
  it("renderiza título e descrição com seus data-slot", async () => {
    const screen = await render(
      <Alert>
        <AlertTitle>Atualização disponível</AlertTitle>
        <AlertDescription>Recarregue a página para ver as novidades.</AlertDescription>
      </Alert>,
    );

    const alert = screen.getByRole("status");
    await expect.element(alert).toHaveAttribute("data-slot", "alert");
    await expect.element(alert).toHaveClass("bg-card", "text-card-foreground");
    await expect
      .element(screen.getByText("Atualização disponível"))
      .toHaveAttribute("data-slot", "alert-title");
    await expect
      .element(screen.getByText("Recarregue a página para ver as novidades."))
      .toHaveClass("text-muted-foreground");
  });

  it("usa role=status em default e success, e role=alert em destructive e warning", async () => {
    const screen = await render(
      <>
        <Alert aria-label="default">a</Alert>
        <Alert variant="success" aria-label="success">
          b
        </Alert>
        <Alert variant="warning" aria-label="warning">
          c
        </Alert>
        <Alert variant="destructive" aria-label="destructive">
          d
        </Alert>
      </>,
    );

    await expect.element(screen.getByRole("status", { name: "default" })).toBeInTheDocument();
    await expect.element(screen.getByRole("status", { name: "success" })).toBeInTheDocument();
    await expect.element(screen.getByRole("alert", { name: "warning" })).toBeInTheDocument();
    await expect.element(screen.getByRole("alert", { name: "destructive" })).toBeInTheDocument();
  });

  it("respeita o role informado", async () => {
    const screen = await render(
      <Alert variant="destructive" role="note">
        Aviso fixo
      </Alert>,
    );

    await expect.element(screen.getByRole("note")).toHaveTextContent("Aviso fixo");
    expect(screen.container.querySelector('[role="alert"]')).toBeNull();
  });

  it("variantes coloridas têm borda e fundo do token, com texto foreground", async () => {
    const screen = await render(
      <Alert variant="destructive">
        <AlertTitle>Falha no envio</AlertTitle>
        <AlertDescription>Tente de novo.</AlertDescription>
      </Alert>,
    );
    const alert = screen.getByRole("alert");

    await expect
      .element(alert)
      .toHaveClass("border-destructive", "bg-destructive/10", "text-foreground");
    const description = screen.getByText("Tente de novo.").element();
    expect(getComputedStyle(description).color).toBe(getComputedStyle(alert.element()).color);
  });

  it("ícone como primeiro filho ocupa a coluna da esquerda", async () => {
    const screen = await render(
      <Alert>
        <svg aria-hidden="true" viewBox="0 0 24 24" />
        <AlertTitle>Com ícone</AlertTitle>
      </Alert>,
    );
    const svg = screen.container.querySelector("svg");
    const title = screen.getByText("Com ícone").element();

    expect(svg?.getBoundingClientRect().width).toBe(16);
    expect(title.getBoundingClientRect().left).toBeGreaterThan(
      svg?.getBoundingClientRect().right ?? Infinity,
    );
  });

  it("mescla o className do usuário, que vence conflitos", async () => {
    const screen = await render(<Alert className="rounded-none px-8">texto</Alert>);
    const alert = screen.getByRole("status");

    await expect.element(alert).toHaveClass("rounded-none", "px-8");
    await expect.element(alert).not.toHaveClass("rounded-lg");
    await expect.element(alert).not.toHaveClass("px-4");
  });

  it("repassa o ref para o elemento DOM", async () => {
    const ref = createRef<HTMLDivElement>();
    await render(<Alert ref={ref}>texto</Alert>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
