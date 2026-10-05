import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../src/index.ts";
import { BoldIcon, ItalicIcon, UnderlineIcon } from "../icons.tsx";
import { Example } from "../section.tsx";

const tools = [
  { label: "Negrito", hint: "Negrito (Ctrl+B)", Icon: BoldIcon },
  { label: "Itálico", hint: "Itálico (Ctrl+I)", Icon: ItalicIcon },
  { label: "Sublinhado", hint: "Sublinhado (Ctrl+U)", Icon: UnderlineIcon },
];

const sides = ["top", "right", "bottom", "left"] as const;

export function TooltipSection() {
  return (
    <>
      <Example label="Barra de ferramentas">
        <TooltipProvider>
          <div role="toolbar" aria-label="Formatação" className="flex gap-1 rounded-lg border p-1">
            {tools.map(({ label, hint, Icon }) => (
              <Tooltip key={label}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label={label}>
                    <Icon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{hint}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </Example>
      <Example label="Lados">
        {sides.map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger asChild>
              <Button variant="outline">{side}</Button>
            </TooltipTrigger>
            <TooltipContent side={side}>Dica no lado {side}</TooltipContent>
          </Tooltip>
        ))}
      </Example>
    </>
  );
}
