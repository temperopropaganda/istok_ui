import type { ComponentProps } from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";
import { cn } from "../../lib/cn.ts";
import { avatarVariants, type AvatarVariants } from "./avatar.variants.ts";

// Baseado no Avatar do shadcn/ui (Radix), com tamanhos.

export interface AvatarProps extends ComponentProps<typeof AvatarPrimitive.Root> {
  /**
   * Tamanho: `sm` (24px), `md` (32px) ou `lg` (40px).
   * @default "md"
   */
  size?: AvatarVariants["size"];
}

/**
 * Foto de uma pessoa ou entidade. Combine `AvatarImage` com `AvatarFallback`: o fallback aparece
 * enquanto a imagem carrega ou se ela falhar.
 *
 * @example
 * ```tsx
 * <Avatar size="lg">
 *   <AvatarImage src="/fotos/ana.jpg" alt="Ana Souza" />
 *   <AvatarFallback aria-label="Ana Souza">AS</AvatarFallback>
 * </Avatar>
 * ```
 */
export function Avatar({ className, size, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants({ size }), className)}
      {...props}
    />
  );
}

/** Imagem do avatar. O `alt` é obrigatório (use o nome da pessoa). */
export function AvatarImage({
  className,
  alt,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Image> & {
  /** Texto alternativo: o nome da pessoa (ex.: "Ana Souza"). */
  alt: string;
}) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      alt={alt}
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

/**
 * Conteúdo mostrado sem a imagem, normalmente as iniciais. Para leitores de tela, prefira
 * `aria-label` com o nome completo (ex.: `<AvatarFallback aria-label="Ana Souza">AS</AvatarFallback>`).
 */
export function AvatarFallback({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
