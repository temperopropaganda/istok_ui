import { createRef, type ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion.tsx";

function Faq(props: ComponentProps<typeof Accordion>) {
  return (
    <Accordion {...props}>
      <AccordionItem value="entrega">
        <AccordionTrigger>Prazo de entrega</AccordionTrigger>
        <AccordionContent>De 3 a 5 dias úteis.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="troca">
        <AccordionTrigger>Trocas</AccordionTrigger>
        <AccordionContent>Em até 30 dias.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="pagamento" disabled>
        <AccordionTrigger>Pagamento</AccordionTrigger>
        <AccordionContent>Pix ou cartão.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe("Accordion", () => {
  it("cada título é um botão dentro de um <h3>, com aria-expanded", async () => {
    const screen = await render(<Faq type="single" collapsible />);
    const trigger = screen.getByRole("button", { name: "Prazo de entrega" });

    await expect.element(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger.element().parentElement?.tagName).toBe("H3");
    await expect
      .element(screen.getByRole("heading", { level: 3, name: "Prazo de entrega" }))
      .toBeInTheDocument();
  });

  it("single: abrir uma fecha a outra; collapsible fecha a aberta", async () => {
    const screen = await render(<Faq type="single" collapsible />);
    const delivery = screen.getByRole("button", { name: "Prazo de entrega" });
    const returns = screen.getByRole("button", { name: "Trocas" });

    await delivery.click();
    await expect.element(delivery).toHaveAttribute("aria-expanded", "true");
    await expect.element(screen.getByText("De 3 a 5 dias úteis.")).toBeVisible();

    await returns.click();
    await expect.element(returns).toHaveAttribute("aria-expanded", "true");
    await expect.element(delivery).toHaveAttribute("aria-expanded", "false");

    await returns.click();
    await expect.element(returns).toHaveAttribute("aria-expanded", "false");
  });

  it("multiple: várias abertas ao mesmo tempo", async () => {
    const screen = await render(<Faq type="multiple" />);

    await screen.getByRole("button", { name: "Prazo de entrega" }).click();
    await screen.getByRole("button", { name: "Trocas" }).click();

    await expect.element(screen.getByText("De 3 a 5 dias úteis.")).toBeVisible();
    await expect.element(screen.getByText("Em até 30 dias.")).toBeVisible();
  });

  it("teclado: Enter e Espaço alternam; setas e Home/End andam entre os títulos", async () => {
    const screen = await render(<Faq type="multiple" />);
    const delivery = screen.getByRole("button", { name: "Prazo de entrega" });
    const returns = screen.getByRole("button", { name: "Trocas" });

    (delivery.element() as HTMLButtonElement).focus();
    await userEvent.keyboard("{Enter}");
    await expect.element(delivery).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard(" ");
    await expect.element(delivery).toHaveAttribute("aria-expanded", "false");

    await userEvent.keyboard("{ArrowDown}");
    await expect.element(returns).toHaveFocus();
    // O desabilitado fica fora: a seta volta ao primeiro.
    await userEvent.keyboard("{ArrowDown}");
    await expect.element(delivery).toHaveFocus();
    await userEvent.keyboard("{End}");
    await expect.element(returns).toHaveFocus();
    await userEvent.keyboard("{Home}");
    await expect.element(delivery).toHaveFocus();
  });

  it("item desabilitado não abre", async () => {
    const screen = await render(<Faq type="single" collapsible />);
    const payment = screen.getByRole("button", { name: "Pagamento" });

    await expect.element(payment).toBeDisabled();
    await payment.click({ force: true });
    await expect.element(payment).toHaveAttribute("aria-expanded", "false");
  });

  it("mescla o className no item e no conteúdo, e repassa o ref do item", async () => {
    const ref = createRef<HTMLDivElement>();
    const screen = await render(
      <Accordion type="single" defaultValue="a">
        <AccordionItem ref={ref} value="a" className="border-b-2">
          <AccordionTrigger className="py-6">Título</AccordionTrigger>
          <AccordionContent className="pb-8">Conteúdo</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.className).toContain("border-b-2");
    await expect.element(screen.getByRole("button", { name: "Título" })).toHaveClass("py-6");
    await expect.element(screen.getByRole("button", { name: "Título" })).not.toHaveClass("py-4");
    await expect.element(screen.getByText("Conteúdo")).toHaveClass("pb-8");
  });
});
