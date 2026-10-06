import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { ProductCard } from "./product-card.tsx";

// A formatação de moeda usa espaço não separável ("R$\u00a09,90"): compara com espaço comum.
const text = (element: Element | null) => element?.textContent.replace(/\s/g, " ") ?? "";

const image =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'><rect width='10' height='10' fill='%23fde68a'/></svg>";

describe("ProductCard", () => {
  afterEach(() => {
    window.location.hash = "";
  });

  it("é um artigo nomeado pelo produto, com o nome num <h3>", async () => {
    const screen = await render(<ProductCard name="Suco de laranja" price={9.9} />);

    await expect
      .element(screen.getByRole("article", { name: "Suco de laranja" }))
      .toHaveAttribute("data-slot", "product-card");
    await expect
      .element(screen.getByRole("heading", { level: 3, name: "Suco de laranja" }))
      .toBeInTheDocument();
    expect(screen.container.querySelector("a")).toBeNull();
  });

  it("formata o preço em reais por padrão e em outra moeda e idioma", async () => {
    const screen = await render(
      <>
        <ProductCard name="BRL" price={9.9} />
        <ProductCard name="USD" price={9.9} currency="USD" locale="en-US" />
      </>,
    );

    expect(text(screen.getByRole("article", { name: "BRL" }).element())).toContain("R$ 9,90");
    expect(text(screen.getByRole("article", { name: "USD" }).element())).toContain("$9.90");
  });

  it("preço de/por: o anterior riscado e os dois anunciados para leitores de tela", async () => {
    const screen = await render(<ProductCard name="Suco" price={9.9} originalPrice={12.9} />);
    const price = screen.container.querySelector('[data-slot="product-card-price"]');

    expect(text(price?.querySelector("s") ?? null)).toBe("R$ 12,90");
    expect(text(price)).toBe("Preço anterior:R$ 12,90Preço atual:R$ 9,90");
  });

  it("com href, o nome é o link e clicar em qualquer parte do card abre o produto", async () => {
    const screen = await render(
      <ProductCard name="Suco" price={9.9} href="#produto-suco" image={image} />,
    );
    const link = screen.getByRole("link", { name: "Suco" });

    await expect.element(link).toHaveAttribute("href", "#produto-suco");
    await screen.getByRole("article").click({ position: { x: 20, y: 20 } });
    expect(window.location.hash).toBe("#produto-suco");
  });

  it("a ação continua clicável à parte, sem abrir o produto", async () => {
    const onAdd = vi.fn();
    const screen = await render(
      <ProductCard
        name="Suco"
        price={9.9}
        href="#produto-suco"
        action={
          <button type="button" onClick={onAdd}>
            Adicionar
          </button>
        }
      />,
    );

    await screen.getByRole("button", { name: "Adicionar" }).click();

    expect(onAdd).toHaveBeenCalledOnce();
    expect(window.location.hash).toBe("");
  });

  it("selo, variações (lista nomeada) e avaliação com texto para leitores de tela", async () => {
    const screen = await render(
      <ProductCard
        name="Suco"
        price={9.9}
        badge="-23%"
        options={["300 ml", "1 L"]}
        optionsLabel="Tamanhos"
        rating={4.5}
        reviewCount={128}
      />,
    );

    await expect.element(screen.getByText("-23%")).toHaveAttribute("data-slot", "badge");
    const sizes = screen.getByRole("list", { name: "Tamanhos" });
    await expect.element(sizes.getByRole("listitem").first()).toHaveTextContent("300 ml");
    expect(sizes.getByRole("listitem").elements()).toHaveLength(2);
    await expect
      .element(screen.getByText("Avaliação: 4,5 de 5 (128 avaliações)"))
      .toHaveClass("sr-only");
  });

  it("avaliação no singular e limitada a 0–5", async () => {
    const screen = await render(
      <>
        <ProductCard name="Um" price={1} rating={5} reviewCount={1} />
        <ProductCard name="Acima" price={1} rating={7} />
      </>,
    );

    await expect.element(screen.getByText("Avaliação: 5 de 5 (1 avaliação)")).toBeInTheDocument();
    await expect
      .element(screen.getByText("Avaliação: 5 de 5", { exact: true }))
      .toBeInTheDocument();
  });

  it("imagem decorativa por padrão; com imageAlt, descrita", async () => {
    const screen = await render(
      <>
        <ProductCard name="Decorativa" price={1} image={image} />
        <ProductCard name="Descrita" price={1} image={image} imageAlt="Garrafa de 1 litro" />
      </>,
    );

    expect(
      screen.getByRole("article", { name: "Decorativa" }).element().querySelector("img")?.alt,
    ).toBe("");
    await expect
      .element(screen.getByRole("img", { name: "Garrafa de 1 litro" }))
      .toBeInTheDocument();
  });

  it("headingLevel troca o nível do título", async () => {
    const screen = await render(<ProductCard name="Suco" price={1} headingLevel={2} />);

    await expect
      .element(screen.getByRole("heading", { level: 2, name: "Suco" }))
      .toBeInTheDocument();
  });

  it("mescla o className do usuário e repassa o ref", async () => {
    const ref = createRef<HTMLElement>();
    const screen = await render(
      <ProductCard ref={ref} name="Suco" price={1} className="rounded-none shadow-none" />,
    );
    const card = screen.getByRole("article");

    expect(ref.current).toBe(card.element());
    await expect.element(card).toHaveClass("rounded-none", "shadow-none");
    await expect.element(card).not.toHaveClass("rounded-xl");
  });
});
