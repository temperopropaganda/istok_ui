import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { userEvent, type Locator } from "vitest/browser";
import { render } from "vitest-browser-react";
import { RadioGroup, RadioGroupItem } from "./radio-group.tsx";

// Clicar nem sempre foca o elemento (Safari e WebKit não focam botões no clique): foca antes de
// usar o teclado.
const focus = (locator: Locator) => {
  (locator.element() as HTMLElement).focus();
};

// O Radix move o foco num setTimeout e só marca a opção se a seta ainda estiver pressionada (como
// num teclado real); soltar a tecla na mesma hora cria uma corrida que não existe para quem digita.
async function pressArrow(key: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight") {
  await userEvent.keyboard(`{${key}>}`);
  await new Promise((resolve) => setTimeout(resolve, 50));
  await userEvent.keyboard(`{/${key}}`);
}

function Plans(props: Parameters<typeof RadioGroup>[0]) {
  return (
    <RadioGroup aria-label="Plano" {...props}>
      <RadioGroupItem value="mensal" aria-label="Mensal" />
      <RadioGroupItem value="anual" aria-label="Anual" />
      <RadioGroupItem value="vitalicio" aria-label="Vitalício" />
    </RadioGroup>
  );
}

describe("RadioGroup", () => {
  it("é um radiogroup com radios, e o clique marca a opção", async () => {
    const onValueChange = vi.fn();
    const screen = await render(<Plans onValueChange={onValueChange} />);

    await expect.element(screen.getByRole("radiogroup", { name: "Plano" })).toBeInTheDocument();
    await screen.getByRole("radio", { name: "Anual" }).click();

    await expect.element(screen.getByRole("radio", { name: "Anual" })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith("anual");
  });

  it("setas movem e marcam nas duas direções, voltando ao início (APG)", async () => {
    const screen = await render(<Plans defaultValue="mensal" />);
    const radio = (name: string) => screen.getByRole("radio", { name });

    await radio("Mensal").click();
    focus(radio("Mensal"));
    await pressArrow("ArrowDown");
    await expect.element(radio("Anual")).toHaveFocus();
    await expect.element(radio("Anual")).toBeChecked();
    await pressArrow("ArrowRight");
    await expect.element(radio("Vitalício")).toBeChecked();
    await pressArrow("ArrowRight");
    await expect.element(radio("Mensal")).toBeChecked();
    await pressArrow("ArrowLeft");
    await expect.element(radio("Vitalício")).toBeChecked();
  });

  it("setas funcionam nas duas direções também na horizontal", async () => {
    const screen = await render(<Plans orientation="horizontal" defaultValue="mensal" />);
    const radio = (name: string) => screen.getByRole("radio", { name });

    await radio("Mensal").click();
    focus(radio("Mensal"));
    await pressArrow("ArrowDown");
    await expect.element(radio("Anual")).toBeChecked();
    await expect.element(screen.getByRole("radiogroup")).toHaveClass("flex", "flex-wrap");
  });

  it("Tab entra no grupo pela opção marcada e sai na próxima", async () => {
    const screen = await render(
      <>
        <button type="button">antes</button>
        <Plans defaultValue="anual" />
        <button type="button">depois</button>
      </>,
    );

    focus(screen.getByRole("button", { name: "antes" }));
    await userEvent.tab();
    await expect.element(screen.getByRole("radio", { name: "Anual" })).toHaveFocus();
    await userEvent.tab();
    await expect.element(screen.getByRole("button", { name: "depois" })).toHaveFocus();
  });

  it("opção desabilitada não é marcada", async () => {
    const screen = await render(
      <RadioGroup aria-label="Entrega">
        <RadioGroupItem value="normal" aria-label="Normal" />
        <RadioGroupItem value="expressa" aria-label="Expressa" disabled />
      </RadioGroup>,
    );
    const express = screen.getByRole("radio", { name: "Expressa" });

    await expect.element(express).toBeDisabled();
    await express.click({ force: true });
    await expect.element(express).not.toBeChecked();
  });

  it("dentro de um <form>, envia name com o valor marcado", async () => {
    const screen = await render(
      <form aria-label="Formulário">
        <Plans name="plano" />
      </form>,
    );
    const form = screen.getByRole("form").element() as HTMLFormElement;

    await screen.getByRole("radio", { name: "Vitalício" }).click();

    expect(new FormData(form).get("plano")).toBe("vitalicio");
  });

  it("mescla o className do usuário, que vence conflitos", async () => {
    const screen = await render(<Plans className="gap-8" />);

    await expect.element(screen.getByRole("radiogroup")).toHaveClass("gap-8");
    await expect.element(screen.getByRole("radiogroup")).not.toHaveClass("gap-3");
  });

  it("repassa o ref para o elemento DOM", async () => {
    const ref = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLButtonElement>();
    await render(
      <RadioGroup ref={ref} aria-label="Plano">
        <RadioGroupItem ref={itemRef} value="mensal" aria-label="Mensal" />
      </RadioGroup>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(itemRef.current).toBeInstanceOf(HTMLButtonElement);
  });
});
