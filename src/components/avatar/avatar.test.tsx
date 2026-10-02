import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar.tsx";

// Imagem válida embutida (SVG 1x1), para não depender de rede.
const validImage =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1' height='1'><rect width='1' height='1' fill='gray'/></svg>";

describe("Avatar", () => {
  it("mostra a imagem com alt quando ela carrega", async () => {
    const screen = await render(
      <Avatar>
        <AvatarImage src={validImage} alt="Ana Souza" />
        <AvatarFallback>AS</AvatarFallback>
      </Avatar>,
    );

    await expect.element(screen.getByRole("img", { name: "Ana Souza" })).toBeVisible();
    expect(screen.container.textContent).not.toContain("AS");
  });

  it("mostra o fallback quando a imagem falha", async () => {
    const screen = await render(
      <Avatar>
        <AvatarImage src="/imagem-que-nao-existe.png" alt="Ana Souza" />
        <AvatarFallback aria-label="Ana Souza">AS</AvatarFallback>
      </Avatar>,
    );

    await expect.element(screen.getByText("AS")).toBeVisible();
    await expect.element(screen.getByText("AS")).toHaveAttribute("aria-label", "Ana Souza");
    expect(screen.container.querySelector("img")).toBeNull();
  });

  it.each([
    ["sm", 24],
    ["md", 32],
    ["lg", 40],
  ] as const)("tamanho %s tem %dpx", async (size, pixels) => {
    const screen = await render(
      <Avatar size={size}>
        <AvatarFallback>AS</AvatarFallback>
      </Avatar>,
    );
    const avatar = screen.container.querySelector('[data-slot="avatar"]');

    expect(avatar?.getBoundingClientRect().width).toBe(pixels);
    expect(avatar?.getBoundingClientRect().height).toBe(pixels);
  });

  it("usa md por padrão e mescla o className do usuário", async () => {
    const screen = await render(
      <Avatar className="rounded-md">
        <AvatarFallback>AS</AvatarFallback>
      </Avatar>,
    );
    const avatar = screen.container.querySelector('[data-slot="avatar"]');

    expect(avatar?.className).toContain("size-8");
    expect(avatar?.className).toContain("rounded-md");
    expect(avatar?.className).not.toContain("rounded-full");
  });
});
