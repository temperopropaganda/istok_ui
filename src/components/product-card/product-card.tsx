import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "../../lib/cn.ts";
import { Badge, type BadgeProps } from "../badge/badge.tsx";

export interface ProductCardProps extends Omit<ComponentProps<"article">, "children"> {
  /** Nome do produto (título do card e nome do link). */
  name: string;
  /** Preço atual, formatado com `currency` e `locale` (ex.: `47.9` → "R$ 47,90"). */
  price: number;
  /** Preço anterior, riscado ("de R$ 59,90 por R$ 47,90"). Use quando houver desconto. */
  originalPrice?: number;
  /** Página do produto. Com ela, o card inteiro vira link (o link fica no nome). */
  href?: string;
  /** URL da imagem. Sem ela, aparece um espaço neutro do mesmo tamanho. */
  image?: string;
  /**
   * Texto alternativo da imagem. Vazio deixa a imagem decorativa (o nome já está no card); descreva
   * só o que a imagem acrescenta.
   * @default ""
   */
  imageAlt?: string;
  /** Selo sobre a imagem (ex.: "-20%", "Novo", "Esgotado"). */
  badge?: string;
  /**
   * Estilo do selo (variantes do `Badge`).
   * @default "default"
   */
  badgeVariant?: BadgeProps["variant"];
  /** Variações do produto, mostradas como selos (ex.: `["600 ml", "1 L", "1,5 L"]`). */
  options?: string[];
  /**
   * Nome da lista de variações para leitores de tela (ex.: "Tamanhos").
   * @default "Opções"
   */
  optionsLabel?: string;
  /** Nota de 0 a 5 (aceita frações, ex.: `4.5`). */
  rating?: number;
  /** Quantidade de avaliações, ao lado da nota. */
  reviewCount?: number;
  /** Ação do card, clicável por cima do link (ex.: `<Button size="sm">Adicionar</Button>`). */
  action?: ReactNode;
  /**
   * Moeda do preço (código ISO 4217).
   * @default "BRL"
   */
  currency?: string;
  /**
   * Idioma da formatação de preço, nota e quantidade.
   * @default "pt-BR"
   */
  locale?: string;
  /**
   * Nível do título, para seguir a hierarquia da página.
   * @default 3
   */
  headingLevel?: 2 | 3 | 4;
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
    </svg>
  );
}

function Rating({ value, count, locale }: { value: number; count?: number; locale: string }) {
  const rating = Math.min(5, Math.max(0, value));
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  const reviews =
    count === undefined
      ? ""
      : ` (${number.format(count)} ${count === 1 ? "avaliação" : "avaliações"})`;

  return (
    <p data-slot="product-card-rating" className="flex items-center gap-1.5 text-sm">
      <span className="sr-only">{`Avaliação: ${number.format(rating)} de 5${reviews}`}</span>
      <span aria-hidden="true" className="flex">
        {[0, 1, 2, 3, 4].map((index) => (
          // Estrela de fundo + estrela preenchida recortada na fração (meia estrela em 4,5).
          <span key={index} className="relative size-4">
            <StarIcon className="absolute inset-0 size-4 text-muted-foreground/30" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${String(Math.min(1, Math.max(0, rating - index)) * 100)}%` }}
            >
              <StarIcon className="size-4 text-warning" />
            </span>
          </span>
        ))}
      </span>
      <span aria-hidden="true" className="text-muted-foreground">
        {number.format(rating)}
        {count !== undefined && ` (${number.format(count)})`}
      </span>
    </p>
  );
}

/**
 * Card de produto: imagem, nome, preço (com "de/por" opcional), selo, variações, avaliação e uma
 * ação. Com `href`, o card inteiro é clicável; o link fica no nome, então o leitor de tela lê só o
 * nome do produto. A `action` continua clicável à parte.
 *
 * @example
 * ```tsx
 * <ProductCard
 *   name="Suco de laranja integral"
 *   href="/produtos/suco-de-laranja"
 *   image="/img/suco.jpg"
 *   price={9.9}
 *   originalPrice={12.9}
 *   badge="-23%"
 *   badgeVariant="destructive"
 *   options={["300 ml", "1 L", "1,5 L"]}
 *   optionsLabel="Tamanhos"
 *   rating={4.5}
 *   reviewCount={128}
 *   action={<Button size="sm" className="w-full">Adicionar</Button>}
 * />
 * ```
 */
export function ProductCard({
  className,
  name,
  price,
  originalPrice,
  href,
  image,
  imageAlt = "",
  badge,
  badgeVariant,
  options,
  optionsLabel = "Opções",
  rating,
  reviewCount,
  action,
  currency = "BRL",
  locale = "pt-BR",
  headingLevel = 3,
  ...props
}: ProductCardProps) {
  const titleId = useId();
  const money = new Intl.NumberFormat(locale, { style: "currency", currency });
  const Heading = `h${String(headingLevel)}` as "h2" | "h3" | "h4";

  return (
    <article
      data-slot="product-card"
      aria-labelledby={titleId}
      className={cn(
        "group/product relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm",
        // O foco está no link do nome, que é pequeno: o anel aparece no card inteiro.
        "has-[[data-slot=product-card-link]:focus-visible]:ring-[3px] has-[[data-slot=product-card-link]:focus-visible]:ring-ring/50",
        className,
      )}
      {...props}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {image && (
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            decoding="async"
            className="size-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/product:scale-105"
          />
        )}
        {badge && (
          <Badge variant={badgeVariant} className="absolute top-3 left-3">
            {badge}
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Heading id={titleId} className="line-clamp-2 text-sm leading-snug font-medium">
          {href ? (
            <a
              data-slot="product-card-link"
              href={href}
              className="outline-none group-hover/product:underline after:absolute after:inset-0 after:content-['']"
            >
              {name}
            </a>
          ) : (
            name
          )}
        </Heading>
        {options && options.length > 0 && (
          <ul aria-label={optionsLabel} className="flex flex-wrap gap-1.5">
            {options.map((option) => (
              <li key={option}>
                <Badge variant="outline">{option}</Badge>
              </li>
            ))}
          </ul>
        )}
        {rating !== undefined && <Rating value={rating} count={reviewCount} locale={locale} />}
        <p data-slot="product-card-price" className="mt-auto flex flex-wrap items-baseline gap-x-2">
          {originalPrice !== undefined && (
            <>
              <span className="sr-only">Preço anterior:</span>
              <s className="text-sm text-muted-foreground">{money.format(originalPrice)}</s>
              <span className="sr-only">Preço atual:</span>
            </>
          )}
          <span className="text-lg font-semibold">{money.format(price)}</span>
        </p>
        {/* Acima da camada do link, para continuar clicável. */}
        {action && <div className="relative z-10">{action}</div>}
      </div>
    </article>
  );
}
