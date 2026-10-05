import { describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { Button } from "../button/button.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip.tsx";

function Bold(props: { delayDuration?: number; side?: "top" | "right" | "bottom" | "left" }) {
  return (
    <Tooltip delayDuration={props.delayDuration}>
      <TooltipTrigger asChild>
        <Button size="icon" aria-label="Negrito">
          B
        </Button>
      </TooltipTrigger>
      <TooltipContent side={props.side}>Negrito (Ctrl+B)</TooltipContent>
    </Tooltip>
  );
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("Tooltip", () => {
  it("abre com o ponteiro e vira a descrição do gatilho (o nome continua o aria-label)", async () => {
    const screen = await render(<Bold delayDuration={0} />);
    const trigger = screen.getByRole("button", { name: "Negrito" });

    expect(page.getByRole("tooltip").query()).toBeNull();
    await trigger.hover();

    await expect.element(page.getByRole("tooltip")).toHaveTextContent("Negrito (Ctrl+B)");
    await expect.element(trigger).toHaveAccessibleDescription("Negrito (Ctrl+B)");
    await expect.element(trigger).toHaveAccessibleName("Negrito");
  });

  it("abre com o foco do teclado e fecha com Esc", async () => {
    await render(
      <>
        <button type="button">antes</button>
        <Bold delayDuration={0} />
      </>,
    );

    await page.getByRole("button", { name: "antes" }).click();
    await userEvent.tab();
    await expect.element(page.getByRole("tooltip")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await expect.element(page.getByRole("tooltip")).not.toBeInTheDocument();
    await expect.element(page.getByRole("button", { name: "Negrito" })).toHaveFocus();
  });

  it("espera 300ms por padrão antes de abrir", async () => {
    const screen = await render(<Bold />);

    await screen.getByRole("button", { name: "Negrito" }).hover();
    await wait(100);
    expect(page.getByRole("tooltip").query()).toBeNull();
    await expect.element(page.getByRole("tooltip")).toBeInTheDocument();
  });

  it("dentro de um TooltipProvider, usa o atraso do Provider (não cria outro)", async () => {
    const screen = await render(
      <TooltipProvider delayDuration={0}>
        <Bold />
      </TooltipProvider>,
    );

    await screen.getByRole("button", { name: "Negrito" }).hover();
    await wait(100);
    expect(page.getByRole("tooltip").query()).not.toBeNull();
  });

  it("respeita o side informado", async () => {
    const screen = await render(<Bold delayDuration={0} side="bottom" />);
    await screen.getByRole("button", { name: "Negrito" }).hover();

    const content = document.querySelector('[data-slot="tooltip-content"]');
    await expect.element(page.getByRole("tooltip")).toBeInTheDocument();
    expect(content?.getAttribute("data-side")).toBe("bottom");
  });

  it("mescla o className do usuário", async () => {
    const screen = await render(
      <Tooltip delayDuration={0}>
        <TooltipTrigger>Ajuda</TooltipTrigger>
        <TooltipContent className="max-w-sm text-sm">Texto de ajuda</TooltipContent>
      </Tooltip>,
    );
    await screen.getByRole("button", { name: "Ajuda" }).hover();
    await expect.element(page.getByRole("tooltip")).toBeInTheDocument();

    const content = document.querySelector('[data-slot="tooltip-content"]');
    expect(content?.className).toContain("max-w-sm");
    expect(content?.className).not.toContain("max-w-xs");
    expect(content?.className).not.toContain("text-xs");
  });
});
