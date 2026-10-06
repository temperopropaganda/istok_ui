import { useId, type ComponentProps } from "react";
import { cn } from "../../lib/cn.ts";

interface NewsCardBaseProps extends Omit<ComponentProps<"article">, "children" | "title"> {
  /** Título da notícia. É o link, e o card inteiro fica clicável. */
  title: string;
  /** Endereço da notícia. */
  href: string;
  /** Resumo, até 3 linhas na tela. */
  excerpt?: string;
  /**
   * Data de publicação: `Date` ou texto "AAAA-MM-DD" (lido como data local, sem fuso). Formatada em
   * `locale` dentro de um `<time datetime>`.
   */
  date?: Date | string;
  /**
   * Idioma da data.
   * @default "pt-BR"
   */
  locale?: string;
  /**
   * Nível do título, para seguir a hierarquia da página.
   * @default 3
   */
  headingLevel?: 2 | 3 | 4;
}

interface NewsCardWithCoverProps extends NewsCardBaseProps {
  /**
   * `default`: com imagem de capa (`image` obrigatória). `simple`: só texto.
   * @default "default"
   */
  variant?: "default";
  /** URL da imagem de capa (obrigatória na versão `default`). */
  image: string;
  /**
   * Texto alternativo da capa. Vazio deixa a imagem decorativa (o título já descreve a notícia).
   * @default ""
   */
  imageAlt?: string;
}

interface NewsCardSimpleProps extends NewsCardBaseProps {
  variant: "simple";
  image?: never;
  imageAlt?: never;
}

export type NewsCardProps = NewsCardWithCoverProps | NewsCardSimpleProps;

/** "AAAA-MM-DD" vira data local (`new Date("2026-10-05")` seria UTC e cairia no dia anterior no Brasil). */
function toDate(value: Date | string) {
  if (value instanceof Date) return value;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(value);
}

const isoDate = (date: Date) =>
  [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((part, index) => String(part).padStart(index === 0 ? 4 : 2, "0"))
    .join("-");

/**
 * Card de notícia: data, título e resumo, com imagem de capa (`variant="default"`) ou só texto
 * (`variant="simple"`). O card inteiro é clicável; o link fica no título, então o leitor de tela lê
 * só o título.
 *
 * @example
 * ```tsx
 * <NewsCard
 *   image="/img/feira.jpg"
 *   title="Feira de design reúne 200 expositores"
 *   href="/noticias/feira-de-design"
 *   excerpt="Evento segue até domingo, com entrada gratuita."
 *   date="2026-10-05"
 * />
 * <NewsCard variant="simple" title="Novo horário de atendimento" href="/noticias/horario" />
 * ```
 */
export function NewsCard({
  className,
  title,
  href,
  excerpt,
  date,
  locale = "pt-BR",
  headingLevel = 3,
  variant = "default",
  image,
  imageAlt = "",
  ...props
}: NewsCardProps) {
  const titleId = useId();
  const Heading = `h${String(headingLevel)}` as "h2" | "h3" | "h4";
  const published = date === undefined ? undefined : toDate(date);
  const validDate = published && !Number.isNaN(published.getTime()) ? published : undefined;

  return (
    <article
      data-slot="news-card"
      data-variant={variant}
      aria-labelledby={titleId}
      className={cn(
        "group/news relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm",
        // O foco está no link do título: o anel aparece no card inteiro.
        "has-[[data-slot=news-card-link]:focus-visible]:ring-[3px] has-[[data-slot=news-card-link]:focus-visible]:ring-ring/50",
        className,
      )}
      {...props}
    >
      {variant === "default" && image && (
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            decoding="async"
            className="size-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/news:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {validDate && (
          <time dateTime={isoDate(validDate)} className="text-xs text-muted-foreground">
            {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(validDate)}
          </time>
        )}
        <Heading id={titleId} className="line-clamp-3 leading-snug font-semibold">
          <a
            data-slot="news-card-link"
            href={href}
            className="outline-none group-hover/news:underline after:absolute after:inset-0 after:content-['']"
          >
            {title}
          </a>
        </Heading>
        {excerpt && <p className="line-clamp-3 text-sm text-muted-foreground">{excerpt}</p>}
      </div>
    </article>
  );
}
