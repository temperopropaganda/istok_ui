import { useState } from "react";
import { Button, type ButtonProps } from "../../src/index.ts";
import { PlusIcon } from "../icons.tsx";
import { Example } from "../section.tsx";

const variants: NonNullable<ButtonProps["variant"]>[] = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "link",
  "destructive",
];
const sizes: NonNullable<ButtonProps["size"]>[] = ["sm", "md", "lg"];

export function ButtonSection() {
  const [clicks, setClicks] = useState(0);
  const count = () => {
    setClicks((value) => value + 1);
  };

  return (
    <>
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
      <Example label="Carregando">
        {variants.map((variant) => (
          <Button key={variant} variant={variant} loading onClick={count}>
            {variant}
          </Button>
        ))}
        <Button variant="secondary" loading onClick={count}>
          <PlusIcon />
          Adicionar
        </Button>
        <Button size="icon" variant="outline" aria-label="Adicionar" loading onClick={count}>
          <PlusIcon />
        </Button>
      </Example>
      <Example label="Como link (asChild)">
        <Button asChild variant="outline">
          <a href="#/tokens">Ir para os tokens</a>
        </Button>
      </Example>
    </>
  );
}
