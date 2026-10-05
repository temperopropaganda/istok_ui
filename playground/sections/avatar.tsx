import { Avatar, AvatarFallback, AvatarImage, type AvatarProps } from "../../src/index.ts";
import { Example } from "../section.tsx";

// Imagem embutida (SVG), para a vitrine e o E2E não dependerem de rede.
const photo =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' fill='%2394a3b8'/><circle cx='20' cy='16' r='7' fill='%23f1f5f9'/><rect x='8' y='26' width='24' height='14' rx='7' fill='%23f1f5f9'/></svg>";

const sizes: NonNullable<AvatarProps["size"]>[] = ["sm", "md", "lg"];

export function AvatarSection() {
  return (
    <>
      <Example label="Com imagem">
        {sizes.map((size) => (
          <Avatar key={size} size={size}>
            <AvatarImage src={photo} alt={`Ana Souza (${size})`} />
            <AvatarFallback aria-label={`Ana Souza (${size})`}>AS</AvatarFallback>
          </Avatar>
        ))}
      </Example>
      <Example label="Sem foto (fallback)">
        {sizes.map((size) => (
          <Avatar key={size} size={size}>
            <AvatarFallback aria-label={`Bruno Lima (${size})`}>BL</AvatarFallback>
          </Avatar>
        ))}
      </Example>
    </>
  );
}
