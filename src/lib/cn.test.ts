import { describe, expect, it } from "vitest";
import { cn } from "./cn.ts";

describe("cn", () => {
  it("junta classes e ignora valores falsos", () => {
    expect(cn("px-2", false, null, undefined, "py-1")).toBe("px-2 py-1");
  });

  it("aceita objetos e arrays condicionais", () => {
    expect(cn(["font-bold", { italic: true, underline: false }])).toBe("font-bold italic");
  });

  it("resolve conflitos do Tailwind mantendo a última classe", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("resolve conflitos entre cores do tema", () => {
    expect(cn("bg-primary text-primary-foreground", "bg-destructive")).toBe(
      "text-primary-foreground bg-destructive",
    );
  });

  it("não confunde tamanho de texto com cor de texto do tema", () => {
    expect(cn("text-sm text-foreground", "text-primary-foreground")).toBe(
      "text-sm text-primary-foreground",
    );
  });
});
