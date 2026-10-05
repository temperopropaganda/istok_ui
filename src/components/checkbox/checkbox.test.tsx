import { createRef, type CSSProperties } from "react";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { Checkbox } from "./checkbox.tsx";

describe("Checkbox", () => {
  it("alterna com clique e com Espaço, chamando onCheckedChange", async () => {
    const onCheckedChange = vi.fn();
    const screen = await render(
      <Checkbox aria-label="Aceito os termos" onCheckedChange={onCheckedChange} />,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Aceito os termos" });

    await expect.element(checkbox).not.toBeChecked();
    await checkbox.click();
    await expect.element(checkbox).toBeChecked();
    // Clicar nem sempre foca o botão (Safari e WebKit): foca antes de usar o teclado.
    (checkbox.element() as HTMLButtonElement).focus();
    await userEvent.keyboard(" ");
    await expect.element(checkbox).not.toBeChecked();
    expect(onCheckedChange.mock.calls).toEqual([[true], [false]]);
  });

  it("estado indeterminado é aria-checked=mixed e mostra o traço", async () => {
    const screen = await render(<Checkbox aria-label="Todos" checked="indeterminate" />);
    const checkbox = screen.getByRole("checkbox");

    await expect.element(checkbox).toHaveAttribute("aria-checked", "mixed");
    const [check, dash] = checkbox.element().querySelectorAll("svg");
    expect(check && getComputedStyle(check).display).toBe("none");
    expect(dash && getComputedStyle(dash).display).toBe("block");
  });

  it("marcado mostra o visto e usa as cores primary", async () => {
    const screen = await render(<Checkbox aria-label="Marcado" defaultChecked />);
    const checkbox = screen.getByRole("checkbox");

    await expect.element(checkbox).toHaveClass("data-[state=checked]:bg-primary");
    const [check, dash] = checkbox.element().querySelectorAll("svg");
    expect(check && getComputedStyle(check).display).toBe("block");
    expect(dash && getComputedStyle(dash).display).toBe("none");
  });

  it("raio de 4px, que acompanha uma marca de cantos retos", async () => {
    const screen = await render(
      <>
        <Checkbox aria-label="Padrão" />
        <div style={{ "--radius": "0px" } as CSSProperties}>
          <Checkbox aria-label="Reto" />
        </div>
      </>,
    );
    const radius = (name: string) =>
      getComputedStyle(screen.getByRole("checkbox", { name }).element()).borderTopLeftRadius;

    expect(radius("Padrão")).toBe("4px");
    expect(radius("Reto")).toBe("0px");
  });

  it("não alterna quando disabled", async () => {
    const onCheckedChange = vi.fn();
    const screen = await render(
      <Checkbox aria-label="Bloqueado" disabled onCheckedChange={onCheckedChange} />,
    );
    const checkbox = screen.getByRole("checkbox");

    await expect.element(checkbox).toBeDisabled();
    await checkbox.click({ force: true });
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("dentro de um <form>, envia name e value quando marcado", async () => {
    const screen = await render(
      <form aria-label="Formulário">
        <Checkbox aria-label="Novidades" name="novidades" value="sim" />
      </form>,
    );
    const form = screen.getByRole("form").element() as HTMLFormElement;

    expect(new FormData(form).get("novidades")).toBeNull();
    await screen.getByRole("checkbox").click();
    expect(new FormData(form).get("novidades")).toBe("sim");
  });

  it("mescla o className do usuário, que vence conflitos", async () => {
    const screen = await render(<Checkbox aria-label="Grande" className="size-6 rounded-full" />);
    const checkbox = screen.getByRole("checkbox");

    await expect.element(checkbox).toHaveClass("size-6", "rounded-full");
    await expect.element(checkbox).not.toHaveClass("size-4");
  });

  it("repassa o ref para o elemento DOM", async () => {
    const ref = createRef<HTMLButtonElement>();
    await render(<Checkbox ref={ref} aria-label="Termos" />);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
