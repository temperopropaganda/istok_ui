import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { Separator } from "./separator.tsx";

describe("Separator", () => {
  it("é decorativo e horizontal por padrão (leitores de tela ignoram)", async () => {
    const screen = await render(<Separator />);
    const separator = screen.container.querySelector('[data-slot="separator"]');

    expect(separator?.getAttribute("role")).toBe("none");
    expect(separator?.getAttribute("data-orientation")).toBe("horizontal");
    expect(separator?.getBoundingClientRect().height).toBe(1);
  });

  it("com decorative=false vira role=separator com a orientação anunciada", async () => {
    const screen = await render(
      <div className="flex h-10">
        <Separator decorative={false} orientation="vertical" />
      </div>,
    );
    const separator = screen.getByRole("separator");

    await expect.element(separator).toHaveAttribute("aria-orientation", "vertical");
    expect(separator.element().getBoundingClientRect().width).toBe(1);
  });

  it("mescla o className do usuário", async () => {
    const screen = await render(<Separator className="my-4" />);

    expect(screen.container.querySelector('[data-slot="separator"]')?.className).toContain("my-4");
  });
});
