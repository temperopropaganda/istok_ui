import { createRef, type SyntheticEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { Button } from "./button.tsx";

describe("Button", () => {
  it("renderiza um <button> com type=button por padrão", async () => {
    const screen = await render(<Button>Salvar</Button>);
    const button = screen.getByRole("button", { name: "Salvar" });

    await expect.element(button).toHaveAttribute("type", "button");
    await expect.element(button).toHaveAttribute("data-slot", "button");
  });

  it("respeita o type informado", async () => {
    const screen = await render(<Button type="submit">Enviar</Button>);

    await expect.element(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("não envia o formulário quando type não é informado", async () => {
    const onSubmit = vi.fn((event: SyntheticEvent) => {
      event.preventDefault();
    });
    const screen = await render(
      <form onSubmit={onSubmit}>
        <Button>Ação</Button>
      </form>,
    );

    await screen.getByRole("button").click();

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("chama onClick ao clicar, com Enter e com Espaço", async () => {
    const onClick = vi.fn();
    const screen = await render(<Button onClick={onClick}>Salvar</Button>);

    await screen.getByRole("button").click();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");

    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("não responde quando disabled", async () => {
    const onClick = vi.fn();
    const screen = await render(
      <Button disabled onClick={onClick}>
        Salvar
      </Button>,
    );
    const button = screen.getByRole("button");

    await expect.element(button).toBeDisabled();
    await button.click({ force: true });
    expect(onClick).not.toHaveBeenCalled();
  });

  it("aplica as classes da variante e do tamanho", async () => {
    const screen = await render(
      <Button variant="destructive" size="lg">
        Excluir
      </Button>,
    );
    const button = screen.getByRole("button");

    await expect
      .element(button)
      .toHaveClass("bg-destructive", "text-destructive-foreground", "h-10");
  });

  it("usa variant=default e size=md quando não informados", async () => {
    const screen = await render(<Button>Salvar</Button>);

    await expect.element(screen.getByRole("button")).toHaveClass("bg-primary", "h-9");
  });

  it("mescla o className do usuário, que vence conflitos", async () => {
    const screen = await render(<Button className="px-10 underline">Salvar</Button>);
    const button = screen.getByRole("button");

    await expect.element(button).toHaveClass("px-10", "underline");
    await expect.element(button).not.toHaveClass("px-4");
  });

  it("repassa o ref para o elemento DOM", async () => {
    const ref = createRef<HTMLButtonElement>();
    await render(<Button ref={ref}>Salvar</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("com asChild renderiza o filho com o visual do botão", async () => {
    const screen = await render(
      <Button asChild variant="outline">
        <a href="#destino">Ir para o destino</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Ir para o destino" });

    await expect.element(link).toHaveAttribute("href", "#destino");
    await expect.element(link).toHaveAttribute("data-slot", "button");
    await expect.element(link).toHaveClass("border-input");
    await expect.element(link).not.toHaveAttribute("type");
    expect(screen.container.querySelector("button")).toBeNull();
  });

  it("botão só com ícone usa o aria-label como nome acessível", async () => {
    const screen = await render(
      <Button size="icon" aria-label="Fechar">
        <svg aria-hidden="true" viewBox="0 0 24 24" />
      </Button>,
    );

    await expect.element(screen.getByRole("button", { name: "Fechar" })).toHaveClass("size-9");
  });
});
