import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { NewsCard } from "./news-card.tsx";

const image =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'><rect width='16' height='9' fill='%23bae6fd'/></svg>";

describe("NewsCard", () => {
  afterEach(() => {
    window.location.hash = "";
  });

  it("com capa: artigo nomeado pelo título, capa decorativa e título como link", async () => {
    const screen = await render(
      <NewsCard image={image} title="Feira de design" href="#feira" excerpt="Até domingo." />,
    );
    const article = screen.getByRole("article", { name: "Feira de design" });

    await expect.element(article).toHaveAttribute("data-variant", "default");
    expect(article.element().querySelector("img")?.alt).toBe("");
    await expect
      .element(screen.getByRole("link", { name: "Feira de design" }))
      .toHaveAttribute("href", "#feira");
    await expect.element(screen.getByText("Até domingo.")).toBeVisible();
  });

  it("simple: só texto, sem imagem", async () => {
    const screen = await render(<NewsCard variant="simple" title="Novo horário" href="#h" />);
    const article = screen.getByRole("article", { name: "Novo horário" });

    await expect.element(article).toHaveAttribute("data-variant", "simple");
    expect(article.element().querySelector("img")).toBeNull();
  });

  it('data "AAAA-MM-DD" é lida como data local (sem cair no dia anterior)', async () => {
    const screen = await render(
      <NewsCard variant="simple" title="Notícia" href="#n" date="2026-10-05" />,
    );
    const time = screen.container.querySelector("time");

    expect(time?.getAttribute("datetime")).toBe("2026-10-05");
    expect(time?.textContent).toBe("5 de out. de 2026");
  });

  it("aceita Date, formata em outro idioma e ignora data inválida", async () => {
    const screen = await render(
      <>
        <NewsCard
          variant="simple"
          title="Inglês"
          href="#a"
          date={new Date(2026, 8, 28)}
          locale="en-US"
        />
        <NewsCard variant="simple" title="Inválida" href="#b" date="ontem" />
      </>,
    );

    const english = screen.getByRole("article", { name: "Inglês" }).element();
    expect(english.querySelector("time")?.getAttribute("datetime")).toBe("2026-09-28");
    expect(english.querySelector("time")?.textContent).toBe("Sep 28, 2026");
    expect(
      screen.getByRole("article", { name: "Inválida" }).element().querySelector("time"),
    ).toBeNull();
  });

  it("clicar em qualquer parte do card abre a notícia", async () => {
    const screen = await render(<NewsCard image={image} title="Feira" href="#feira" />);

    await screen.getByRole("article").click({ position: { x: 20, y: 20 } });

    expect(window.location.hash).toBe("#feira");
  });

  it("headingLevel, className e ref", async () => {
    const ref = createRef<HTMLElement>();
    const screen = await render(
      <NewsCard
        ref={ref}
        variant="simple"
        title="Notícia"
        href="#n"
        headingLevel={2}
        className="rounded-none"
      />,
    );

    await expect
      .element(screen.getByRole("heading", { level: 2, name: "Notícia" }))
      .toBeInTheDocument();
    expect(ref.current).toBe(screen.getByRole("article").element());
    await expect.element(screen.getByRole("article")).toHaveClass("rounded-none");
    await expect.element(screen.getByRole("article")).not.toHaveClass("rounded-xl");
  });
});
