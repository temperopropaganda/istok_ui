import { useState } from "react";
import { Button, ProductCard } from "../../src/index.ts";
import { productImage } from "../images.ts";
import { Example } from "../section.tsx";

export function ProductCardSection() {
  const [cart, setCart] = useState(0);
  const add = () => {
    setCart((count) => count + 1);
  };

  return (
    <>
      <Example label="Vitrine">
        <div className="w-full space-y-4">
          <p className="text-sm">
            Itens no carrinho: <output data-testid="product-cart">{cart}</output>
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ProductCard
              name="Suco de laranja integral"
              href="#/product-card/suco"
              image={productImage("#fde68a", "#f59e0b")}
              price={9.9}
              originalPrice={12.9}
              badge="-23%"
              badgeVariant="destructive"
              options={["300 ml", "1 L", "1,5 L"]}
              optionsLabel="Tamanhos"
              rating={4.5}
              reviewCount={128}
              action={
                <Button size="sm" className="w-full" onClick={add}>
                  Adicionar
                </Button>
              }
            />
            <ProductCard
              name="Café torrado em grãos"
              href="#/product-card/cafe"
              image={productImage("#e7e5e4", "#78350f")}
              price={34.5}
              badge="Novo"
              options={["250 g", "500 g"]}
              optionsLabel="Pesos"
              rating={5}
              reviewCount={1}
              action={
                <Button size="sm" variant="outline" className="w-full" onClick={add}>
                  Adicionar
                </Button>
              }
            />
            <ProductCard
              name="Chá gelado de pêssego"
              href="#/product-card/cha"
              image={productImage("#fecdd3", "#fb7185")}
              price={7.25}
              badge="Esgotado"
              badgeVariant="secondary"
              rating={3}
              action={
                <Button size="sm" className="w-full" disabled>
                  Indisponível
                </Button>
              }
            />
          </div>
        </div>
      </Example>
      <Example label="Mínimo (só nome e preço)">
        <div className="w-full max-w-56">
          <ProductCard name="Água mineral sem gás" price={2.5} />
        </div>
      </Example>
    </>
  );
}
