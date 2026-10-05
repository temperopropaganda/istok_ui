import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Junta classes condicionais e resolve conflitos do Tailwind (a última classe vence).
 *
 * @example
 * ```ts
 * cn("px-2 py-1", ativo && "bg-accent", "px-4"); // "py-1 bg-accent px-4"
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
