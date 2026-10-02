// API pública da istok_ui: só o que for exportado aqui chega aos projetos.
export { cn } from "./lib/cn.ts";

export {
  Avatar,
  AvatarFallback,
  AvatarImage,
  type AvatarProps,
} from "./components/avatar/index.ts";
export { Badge, type BadgeProps } from "./components/badge/index.ts";
export { Button, type ButtonProps } from "./components/button/index.ts";
export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardProps,
  type CardTitleProps,
} from "./components/card/index.ts";
export { Separator, type SeparatorProps } from "./components/separator/index.ts";
export { Skeleton } from "./components/skeleton/index.ts";
