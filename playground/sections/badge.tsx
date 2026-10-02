import { Badge, type BadgeProps } from "../../src/index.ts";
import { Example, Section } from "../section.tsx";

const variants: NonNullable<BadgeProps["variant"]>[] = [
  "default",
  "secondary",
  "outline",
  "destructive",
  "success",
  "warning",
];

export function BadgeSection() {
  return (
    <Section
      id="badge"
      title="Badge"
      description="Rótulo curto para status, categoria ou contagem."
    >
      <Example label="Variantes">
        {variants.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
      </Example>
      <Example label="Como link (asChild)">
        <Badge asChild variant="outline">
          <a href="#badge">#design</a>
        </Badge>
        <Badge asChild variant="secondary">
          <a href="#badge">#react</a>
        </Badge>
      </Example>
      <Example label="Em contexto">
        <p className="flex items-center gap-2 text-sm">
          Pedido #4821 <Badge variant="success">Entregue</Badge>
        </p>
        <p className="flex items-center gap-2 text-sm">
          Fatura de outubro <Badge variant="warning">Pendente</Badge>
        </p>
      </Example>
    </Section>
  );
}
