// Páginas da vitrine, na ordem da sidebar (e do "anterior/próximo"). O id é a rota: `#/button`.
export const groups = ["Começando", "Componentes"] as const;

export const pages = [
  {
    id: "",
    label: "Visão geral",
    title: "istok_ui",
    group: "Começando",
    description:
      "Componentes React acessíveis, estilizados com Tailwind CSS e tokens trocáveis por projeto.",
  },
  {
    id: "tokens",
    label: "Tokens",
    group: "Começando",
    description: "Cores do tema (fundo + texto) e escala de raio.",
  },
  {
    id: "alert",
    label: "Alert",
    group: "Componentes",
    description:
      "Mensagem em destaque. default e success são role=status; warning e destructive são role=alert.",
  },
  {
    id: "alert-dialog",
    label: "AlertDialog",
    group: "Componentes",
    description:
      "Confirmação (role=alertdialog): o foco vai para Cancelar, Esc cancela e o clique fora não fecha.",
  },
  {
    id: "avatar",
    label: "Avatar",
    group: "Componentes",
    description: "Foto com fallback (iniciais) enquanto carrega ou se a imagem falhar.",
  },
  {
    id: "badge",
    label: "Badge",
    group: "Componentes",
    description: "Rótulo curto para status, categoria ou contagem.",
  },
  {
    id: "button",
    label: "Button",
    group: "Componentes",
    description: "Ações. Para navegação, use asChild com um link.",
  },
  {
    id: "card",
    label: "Card",
    group: "Componentes",
    description: "Peças combináveis: header (título, descrição, ação), conteúdo e rodapé.",
  },
  {
    id: "checkbox",
    label: "Checkbox",
    group: "Componentes",
    description: "Marcado, desmarcado ou indeterminado. Espaço alterna; clicar no rótulo também.",
  },
  {
    id: "dialog",
    label: "Dialog",
    group: "Componentes",
    description:
      "Modal: prende o foco, fecha com Esc, clique fora ou X, e devolve o foco a quem abriu.",
  },
  {
    id: "field",
    label: "Field",
    group: "Componentes",
    description:
      "Liga rótulo, descrição e erro ao controle sozinho (id, aria-describedby, aria-invalid, required, disabled).",
  },
  {
    id: "input",
    label: "Input",
    group: "Componentes",
    description: "Campo de texto nativo. Alturas iguais às do Button para alinhar na mesma linha.",
  },
  {
    id: "label",
    label: "Label",
    group: "Componentes",
    description: "Rótulo ligado pelo htmlFor. Dentro de um Field, use FieldLabel (liga sozinho).",
  },
  {
    id: "radio-group",
    label: "RadioGroup",
    group: "Componentes",
    description: "Opções exclusivas. Tab entra pela opção marcada; as setas trocam.",
  },
  {
    id: "separator",
    label: "Separator",
    group: "Componentes",
    description: "Linha entre conteúdos.",
  },
  {
    id: "skeleton",
    label: "Skeleton",
    group: "Componentes",
    description:
      "Bloco de carregamento no formato do conteúdo. Decorativo: o contêiner usa aria-busy.",
  },
  {
    id: "spinner",
    label: "Spinner",
    group: "Componentes",
    description: "Indicador de carregamento (role=status). Usa a cor do texto em volta.",
  },
  {
    id: "switch",
    label: "Switch",
    group: "Componentes",
    description: "Liga/desliga com efeito imediato (role=switch). Espaço alterna.",
  },
  {
    id: "textarea",
    label: "Textarea",
    group: "Componentes",
    description: "Texto com várias linhas. Cresce com o conteúdo a partir da altura mínima.",
  },
  {
    id: "tooltip",
    label: "Tooltip",
    group: "Componentes",
    description:
      "Dica com o ponteiro ou o foco (300ms). Esc fecha. Complementa o aria-label, não substitui.",
  },
] as const satisfies readonly {
  id: string;
  label: string;
  title?: string;
  group: (typeof groups)[number];
  description: string;
}[];

export type Page = (typeof pages)[number];
export type PageId = Page["id"];
