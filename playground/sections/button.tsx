import { useState } from "react";
import { Button, type ButtonProps } from "../../src/index.ts";
import { Example, Section } from "../section.tsx";

const variants: NonNullable<ButtonProps["variant"]>[] = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "link",
  "destructive",
];
const sizes: NonNullable<ButtonProps["size"]>[] = ["sm", "md", "lg"];

function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function ButtonSection() {
  const [clicks, setClicks] = useState(0);
  const count = () => {
    setClicks((value) => value + 1);
  };

  return (
    <Section
      id="button"
      title="Button"
      description="Ações. Para navegação, use asChild com um link."
    >
      <p className="text-sm">
        Cliques:{" "}
        <output aria-live="polite" data-testid="button-clicks">
          {clicks}
        </output>
      </p>
      <Example label="Variantes">
        {variants.map((variant) => (
          <Button key={variant} variant={variant} onClick={count}>
            {variant}
          </Button>
        ))}
      </Example>
      <Example label="Tamanhos">
        {sizes.map((size) => (
          <Button key={size} size={size} onClick={count}>
            Tamanho {size}
          </Button>
        ))}
      </Example>
      <Example label="Com ícone">
        {sizes.map((size) => (
          <Button key={size} size={size} variant="secondary" onClick={count}>
            <PlusIcon />
            Adicionar
          </Button>
        ))}
        <Button size="icon" variant="outline" aria-label="Adicionar" onClick={count}>
          <PlusIcon />
        </Button>
      </Example>
      <Example label="Desabilitado">
        {variants.map((variant) => (
          <Button key={variant} variant={variant} disabled onClick={count}>
            {variant}
          </Button>
        ))}
      </Example>
      <Example label="Como link (asChild)">
        <Button asChild variant="outline">
          <a href="#tokens">Ir para os tokens</a>
        </Button>
      </Example>
    </Section>
  );
}
