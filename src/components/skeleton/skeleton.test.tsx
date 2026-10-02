import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { Skeleton } from "./skeleton.tsx";

describe("Skeleton", () => {
  it("é decorativo (aria-hidden) e anima só com motion-safe", async () => {
    const screen = await render(<Skeleton className="h-4 w-32" />);
    const skeleton = screen.container.querySelector('[data-slot="skeleton"]');

    expect(skeleton?.getAttribute("aria-hidden")).toBe("true");
    expect(skeleton?.className).toContain("motion-safe:animate-pulse");
    expect(skeleton?.className).not.toMatch(/(^|\s)animate-pulse/);
  });

  it("usa o tamanho informado por classes", async () => {
    const screen = await render(<Skeleton className="h-4 w-32" />);
    const rect = screen.container.querySelector('[data-slot="skeleton"]')?.getBoundingClientRect();

    expect(rect?.height).toBe(16);
    expect(rect?.width).toBe(128);
  });

  it("mescla o className do usuário, que vence conflitos", async () => {
    const screen = await render(<Skeleton className="rounded-full" />);
    const skeleton = screen.container.querySelector('[data-slot="skeleton"]');

    expect(skeleton?.className).toContain("rounded-full");
    expect(skeleton?.className).not.toContain("rounded-md");
  });
});
