// Gerado por scripts/generate-guide.mjs a partir de src/ (tipos e JSDoc). Não edite à mão:
// rode `npm run guide`.

export interface PropApi {
  name: string;
  type: string;
  required: boolean;
  defaultValue: string;
  description: string;
}

export type BaseApi =
  | { kind: "native"; element: string; except: string[] }
  | { kind: "radix"; primitive: string; part: string; href: string; except: string[] }
  | { kind: "type"; name: string };

export interface PartApi {
  name: string;
  description: string;
  bases: BaseApi[];
  props: PropApi[];
}

export interface ComponentApi {
  title: string;
  parts: PartApi[];
}

export const api: Record<string, ComponentApi> = {
  accordion: {
    title: "Accordion",
    parts: [
      {
        name: "Accordion",
        description:
          'Seções que abrem e fecham (Radix). `type="single"` abre uma por vez (com `collapsible`, dá para\nfechar a aberta); `type="multiple"` abre várias. Enter/Espaço alternam; setas, Home e End andam\nentre os títulos.',
        bases: [
          {
            kind: "radix",
            primitive: "Accordion",
            part: "Root",
            href: "https://www.radix-ui.com/primitives/docs/components/accordion",
            except: [],
          },
        ],
        props: [],
      },
      {
        name: "AccordionContent",
        description: "Conteúdo da seção. Anima a altura ao abrir e fechar (só com `motion-safe`).",
        bases: [
          {
            kind: "radix",
            primitive: "Accordion",
            part: "Content",
            href: "https://www.radix-ui.com/primitives/docs/components/accordion",
            except: [],
          },
        ],
        props: [],
      },
      {
        name: "AccordionItem",
        description: "Uma seção do Accordion. Precisa de um `value` único.",
        bases: [
          {
            kind: "radix",
            primitive: "Accordion",
            part: "Item",
            href: "https://www.radix-ui.com/primitives/docs/components/accordion",
            except: [],
          },
        ],
        props: [],
      },
      {
        name: "AccordionTrigger",
        description:
          "Título clicável da seção (um `<button>` dentro de um `<h3>`). `aria-expanded` e `aria-controls`\nficam por conta do Radix.",
        bases: [
          {
            kind: "radix",
            primitive: "Accordion",
            part: "Trigger",
            href: "https://www.radix-ui.com/primitives/docs/components/accordion",
            except: [],
          },
        ],
        props: [],
      },
    ],
  },
  alert: {
    title: "Alert",
    parts: [
      {
        name: "Alert",
        description:
          "Mensagem em destaque. Combine com `AlertTitle`, `AlertDescription` e, opcionalmente, um ícone\nSVG como primeiro filho (ele vai para a coluna da esquerda).",
        bases: [{ kind: "native", element: "div", except: [] }],
        props: [
          {
            name: "variant",
            type: '"default" | "destructive" | "success" | "warning"',
            required: false,
            defaultValue: '"default"',
            description:
              'Estilo visual e papel para leitores de tela.\n- `default`: informação neutra (`role="status"`)\n- `success`: ação concluída (`role="status"`)\n- `warning`: atenção antes de seguir (`role="alert"`)\n- `destructive`: erro ou falha (`role="alert"`)\n\n`role="alert"` interrompe o leitor de tela; `status` espera ele terminar o que está lendo.\nPasse `role` para trocar (ex.: `role="note"` para um aviso fixo da página).',
          },
        ],
      },
      {
        name: "AlertDescription",
        description: "Detalhes do alerta: texto, parágrafos ou listas.",
        bases: [{ kind: "native", element: "div", except: [] }],
        props: [],
      },
      {
        name: "AlertTitle",
        description: "Título curto do alerta.",
        bases: [{ kind: "native", element: "div", except: [] }],
        props: [],
      },
    ],
  },
  "alert-dialog": {
    title: "AlertDialog",
    parts: [
      {
        name: "AlertDialog",
        description:
          'Confirmação que exige resposta (`role="alertdialog"`), para ações destrutivas ou irreversíveis.\nDiferente do `Dialog`: não fecha com clique fora e, ao abrir, o foco vai para o\n`AlertDialogCancel` (a opção segura). Esc cancela.',
        bases: [
          {
            kind: "radix",
            primitive: "AlertDialog",
            part: "Root",
            href: "https://www.radix-ui.com/primitives/docs/components/alert-dialog",
            except: [],
          },
        ],
        props: [],
      },
      {
        name: "AlertDialogAction",
        description:
          'Confirma e fecha. É um `Button` (aceita `variant`, `size`, `loading`…); use\n`variant="destructive"` para exclusões. Para uma ação assíncrona, chame\n`event.preventDefault()` no `onClick` (o modal fica aberto), ligue `loading` e feche pelo\n`open`/`onOpenChange` quando terminar. Com `loading`, novos cliques não fecham o modal.',
        bases: [{ kind: "native", element: "button", except: [] }],
        props: [
          {
            name: "variant",
            type: '"default" | "link" | "destructive" | "secondary" | "outline" | "ghost"',
            required: false,
            defaultValue: '"default"',
            description:
              "Estilo visual.\n- `default`: ação principal\n- `secondary`: ação secundária\n- `outline`: ação neutra com borda\n- `ghost`: ação discreta, sem fundo (barras de ferramentas, menus)\n- `link`: aparência de link\n- `destructive`: ação perigosa ou irreversível (excluir, cancelar assinatura)",
          },
          {
            name: "size",
            type: '"sm" | "md" | "lg" | "icon"',
            required: false,
            defaultValue: '"md"',
            description: "Tamanho. Use `icon` para botões só com ícone (exige `aria-label`).",
          },
          {
            name: "asChild",
            type: "boolean",
            required: false,
            defaultValue: "false",
            description:
              "Renderiza o filho único (ex.: `<a>` ou `<Link>` do router) com o visual do botão,\nem vez de um `<button>`.",
          },
          {
            name: "loading",
            type: "boolean",
            required: false,
            defaultValue: "false",
            description:
              'Ação em andamento: mostra um `Spinner` no lugar do ícone (ou antes do texto), marca\n`aria-busy` e ignora cliques, inclusive o envio de formulário. Continua focável\n(`aria-disabled` em vez de `disabled`), para o foco não se perder quando o carregamento\ncomeça. Leitores de tela anunciam o botão como indisponível; para dizer o que está\nacontecendo, troque o texto junto (ex.: "Salvando…"). Com `asChild`, aplica só o estado,\nsem o `Spinner`.',
          },
        ],
      },
      {
        name: "AlertDialogCancel",
        description:
          'Cancela e fecha. É um `Button` com `variant="outline"` por padrão; recebe o foco ao abrir.',
        bases: [{ kind: "native", element: "button", except: [] }],
        props: [
          {
            name: "variant",
            type: '"default" | "link" | "destructive" | "secondary" | "outline" | "ghost"',
            required: false,
            defaultValue: '"default"',
            description:
              "Estilo visual.\n- `default`: ação principal\n- `secondary`: ação secundária\n- `outline`: ação neutra com borda\n- `ghost`: ação discreta, sem fundo (barras de ferramentas, menus)\n- `link`: aparência de link\n- `destructive`: ação perigosa ou irreversível (excluir, cancelar assinatura)",
          },
          {
            name: "size",
            type: '"sm" | "md" | "lg" | "icon"',
            required: false,
            defaultValue: '"md"',
            description: "Tamanho. Use `icon` para botões só com ícone (exige `aria-label`).",
          },
          {
            name: "asChild",
            type: "boolean",
            required: false,
            defaultValue: "false",
            description:
              "Renderiza o filho único (ex.: `<a>` ou `<Link>` do router) com o visual do botão,\nem vez de um `<button>`.",
          },
          {
            name: "loading",
            type: "boolean",
            required: false,
            defaultValue: "false",
            description:
              'Ação em andamento: mostra um `Spinner` no lugar do ícone (ou antes do texto), marca\n`aria-busy` e ignora cliques, inclusive o envio de formulário. Continua focável\n(`aria-disabled` em vez de `disabled`), para o foco não se perder quando o carregamento\ncomeça. Leitores de tela anunciam o botão como indisponível; para dizer o que está\nacontecendo, troque o texto junto (ex.: "Salvando…"). Com `asChild`, aplica só o estado,\nsem o `Spinner`.',
          },
        ],
      },
      {
        name: "AlertDialogContent",
        description:
          "Conteúdo do AlertDialog, num portal no `<body>`. Precisa de título e descrição.",
        bases: [
          {
            kind: "radix",
            primitive: "AlertDialog",
            part: "Content",
            href: "https://www.radix-ui.com/primitives/docs/components/alert-dialog",
            except: [],
          },
        ],
        props: [
          {
            name: "size",
            type: '"sm" | "md" | "lg"',
            required: false,
            defaultValue: '"md"',
            description: "Largura máxima: `sm` (384px), `md` (512px) ou `lg` (672px).",
          },
        ],
      },
      {
        name: "AlertDialogDescription",
        description: 'Consequência da ação ("Isso não pode ser desfeito."). Obrigatório.',
        bases: [
          {
            kind: "radix",
            primitive: "AlertDialog",
            part: "Description",
            href: "https://www.radix-ui.com/primitives/docs/components/alert-dialog",
            except: [],
          },
        ],
        props: [],
      },
      {
        name: "AlertDialogFooter",
        description: "Rodapé com as ações. No celular, empilha com a ação principal em cima.",
        bases: [{ kind: "native", element: "div", except: [] }],
        props: [],
      },
      {
        name: "AlertDialogHeader",
        description: "Topo do AlertDialog: título e descrição.",
        bases: [{ kind: "native", element: "div", except: [] }],
        props: [],
      },
      {
        name: "AlertDialogTitle",
        description: "Pergunta do AlertDialog (`<h2>`), que também é o nome do modal. Obrigatório.",
        bases: [
          {
            kind: "radix",
            primitive: "AlertDialog",
            part: "Title",
            href: "https://www.radix-ui.com/primitives/docs/components/alert-dialog",
            except: [],
          },
        ],
        props: [],
      },
      {
        name: "AlertDialogTrigger",
        description: "Abre o AlertDialog. Use `asChild` com um `Button`.",
        bases: [
          {
            kind: "radix",
            primitive: "AlertDialog",
            part: "Trigger",
            href: "https://www.radix-ui.com/primitives/docs/components/alert-dialog",
            except: [],
          },
        ],
        props: [],
      },
    ],
  },
  avatar: {
    title: "Avatar",
    parts: [
      {
        name: "Avatar",
        description:
          "Foto de uma pessoa ou entidade. Combine `AvatarImage` com `AvatarFallback`: o fallback aparece\nenquanto a imagem carrega ou se ela falhar.",
        bases: [
          {
            kind: "radix",
            primitive: "Avatar",
            part: "Root",
            href: "https://www.radix-ui.com/primitives/docs/components/avatar",
            except: [],
          },
        ],
        props: [
          {
            name: "size",
            type: '"sm" | "md" | "lg"',
            required: false,
            defaultValue: '"md"',
            description: "Tamanho: `sm` (24px), `md` (32px) ou `lg` (40px).",
          },
        ],
      },
      {
        name: "AvatarFallback",
        description:
          'Conteúdo mostrado sem a imagem, normalmente as iniciais. Para leitores de tela, prefira\n`aria-label` com o nome completo (ex.: `<AvatarFallback aria-label="Ana Souza">AS</AvatarFallback>`).',
        bases: [
          {
            kind: "radix",
            primitive: "Avatar",
            part: "Fallback",
            href: "https://www.radix-ui.com/primitives/docs/components/avatar",
            except: [],
          },
        ],
        props: [],
      },
      {
        name: "AvatarImage",
        description: "Imagem do avatar. O `alt` é obrigatório (use o nome da pessoa).",
        bases: [
          {
            kind: "radix",
            primitive: "Avatar",
            part: "Image",
            href: "https://www.radix-ui.com/primitives/docs/components/avatar",
            except: [],
          },
        ],
        props: [
          {
            name: "alt",
            type: "string",
            required: true,
            defaultValue: "",
            description: 'Texto alternativo: o nome da pessoa (ex.: "Ana Souza").',
          },
        ],
      },
    ],
  },
  badge: {
    title: "Badge",
    parts: [
      {
        name: "Badge",
        description: "Rótulo curto para status, categoria ou contagem.",
        bases: [{ kind: "native", element: "span", except: [] }],
        props: [
          {
            name: "variant",
            type: '"default" | "destructive" | "success" | "warning" | "secondary" | "outline"',
            required: false,
            defaultValue: '"default"',
            description:
              "Estilo visual.\n- `default`: destaque padrão\n- `secondary`: informação neutra\n- `outline`: discreto, só com borda\n- `destructive`: erro ou estado crítico\n- `success`: concluído, ativo, aprovado\n- `warning`: atenção, pendente",
          },
          {
            name: "asChild",
            type: "boolean",
            required: false,
            defaultValue: "false",
            description:
              "Renderiza o filho único (ex.: `<a>`) com o visual do badge, em vez de um `<span>`.",
          },
        ],
      },
    ],
  },
  button: {
    title: "Button",
    parts: [
      {
        name: "Button",
        description: "Botão para ações. Para navegação, use `asChild` com um `<a>` ou `<Link>`.",
        bases: [{ kind: "native", element: "button", except: [] }],
        props: [
          {
            name: "variant",
            type: '"default" | "link" | "destructive" | "secondary" | "outline" | "ghost"',
            required: false,
            defaultValue: '"default"',
            description:
              "Estilo visual.\n- `default`: ação principal\n- `secondary`: ação secundária\n- `outline`: ação neutra com borda\n- `ghost`: ação discreta, sem fundo (barras de ferramentas, menus)\n- `link`: aparência de link\n- `destructive`: ação perigosa ou irreversível (excluir, cancelar assinatura)",
          },
          {
            name: "size",
            type: '"sm" | "md" | "lg" | "icon"',
            required: false,
            defaultValue: '"md"',
            description: "Tamanho. Use `icon` para botões só com ícone (exige `aria-label`).",
          },
          {
            name: "asChild",
            type: "boolean",
            required: false,
            defaultValue: "false",
            description:
              "Renderiza o filho único (ex.: `<a>` ou `<Link>` do router) com o visual do botão,\nem vez de um `<button>`.",
          },
          {
            name: "loading",
            type: "boolean",
            required: false,
            defaultValue: "false",
            description:
              'Ação em andamento: mostra um `Spinner` no lugar do ícone (ou antes do texto), marca\n`aria-busy` e ignora cliques, inclusive o envio de formulário. Continua focável\n(`aria-disabled` em vez de `disabled`), para o foco não se perder quando o carregamento\ncomeça. Leitores de tela anunciam o botão como indisponível; para dizer o que está\nacontecendo, troque o texto junto (ex.: "Salvando…"). Com `asChild`, aplica só o estado,\nsem o `Spinner`.',
          },
        ],
      },
    ],
  },
  card: {
    title: "Card",
    parts: [
      {
        name: "Card",
        description: "Superfície que agrupa conteúdo relacionado.",
        bases: [{ kind: "native", element: "div", except: [] }],
        props: [
          {
            name: "asChild",
            type: "boolean",
            required: false,
            defaultValue: "false",
            description:
              "Renderiza o filho único (ex.: `<article>` ou `<li>`) com o visual do card, em vez de uma `<div>`.",
          },
        ],
      },
      {
        name: "CardAction",
        description: "Ação no canto superior direito do cabeçalho (ex.: um `Button` de menu).",
        bases: [{ kind: "native", element: "div", except: [] }],
        props: [],
      },
      {
        name: "CardContent",
        description: "Corpo do card.",
        bases: [{ kind: "native", element: "div", except: [] }],
        props: [],
      },
      {
        name: "CardDescription",
        description: "Texto de apoio abaixo do título.",
        bases: [{ kind: "native", element: "p", except: [] }],
        props: [],
      },
      {
        name: "CardFooter",
        description: "Rodapé do card, normalmente com ações.",
        bases: [{ kind: "native", element: "div", except: [] }],
        props: [],
      },
      {
        name: "CardHeader",
        description:
          "Topo do card: título, descrição e, opcionalmente, uma ação (`CardAction`) à direita.",
        bases: [{ kind: "native", element: "div", except: [] }],
        props: [],
      },
      {
        name: "CardTitle",
        description:
          "Título do card. É um `<h3>` por padrão, para leitores de tela reconhecerem como título.",
        bases: [{ kind: "native", element: "h3", except: [] }],
        props: [
          {
            name: "asChild",
            type: "boolean",
            required: false,
            defaultValue: "false",
            description:
              "Renderiza o filho único no lugar do `<h3>`. Use para ajustar o nível do título à hierarquia\nda página (ex.: `<CardTitle asChild><h2>…</h2></CardTitle>`).",
          },
        ],
      },
    ],
  },
  checkbox: {
    title: "Checkbox",
    parts: [
      {
        name: "Checkbox",
        description:
          'Caixa de seleção (Radix): marcada, desmarcada ou indeterminada (`checked="indeterminate"`, para\n"selecionar todos" parcial). Espaço alterna. Dentro de um `<form>`, envia `name`/`value` como um\ncheckbox nativo.\n\nUse num `Field orientation="horizontal"` com `FieldLabel` ao lado.',
        bases: [
          {
            kind: "radix",
            primitive: "Checkbox",
            part: "Root",
            href: "https://www.radix-ui.com/primitives/docs/components/checkbox",
            except: [],
          },
        ],
        props: [],
      },
    ],
  },
  dialog: {
    title: "Dialog",
    parts: [
      {
        name: "Dialog",
        description:
          'Janela modal (Radix). Prende o foco, fecha com Esc ou clique fora e devolve o foco a quem abriu.\nUse `open`/`onOpenChange` para controlar, ou deixe o `DialogTrigger` abrir sozinho.\n\nPara confirmar ações destrutivas ("Excluir projeto?"), use o `AlertDialog`.',
        bases: [
          {
            kind: "radix",
            primitive: "Dialog",
            part: "Root",
            href: "https://www.radix-ui.com/primitives/docs/components/dialog",
            except: [],
          },
        ],
        props: [],
      },
      {
        name: "DialogClose",
        description:
          'Fecha o Dialog. Use `asChild` com um `Button` (ex.: "Cancelar" no `DialogFooter`).',
        bases: [
          {
            kind: "radix",
            primitive: "Dialog",
            part: "Close",
            href: "https://www.radix-ui.com/primitives/docs/components/dialog",
            except: [],
          },
        ],
        props: [],
      },
      {
        name: "DialogContent",
        description:
          "Conteúdo do Dialog, num portal no `<body>`, com o fundo escurecido. Precisa de um\n`DialogTitle`; sem `DialogDescription`, passe `aria-describedby={undefined}`.",
        bases: [
          {
            kind: "radix",
            primitive: "Dialog",
            part: "Content",
            href: "https://www.radix-ui.com/primitives/docs/components/dialog",
            except: [],
          },
        ],
        props: [
          {
            name: "size",
            type: '"sm" | "md" | "lg"',
            required: false,
            defaultValue: '"md"',
            description:
              "Largura máxima: `sm` (384px), `md` (512px) ou `lg` (672px). No celular, ocupa a largura toda\ncom margem.",
          },
          {
            name: "showCloseButton",
            type: "boolean",
            required: false,
            defaultValue: "true",
            description:
              "Mostra o botão de fechar (X) no canto. Esc e clique fora continuam fechando sem ele.",
          },
          {
            name: "closeLabel",
            type: "string",
            required: false,
            defaultValue: '"Fechar"',
            description: "Nome do botão de fechar para leitores de tela.",
          },
        ],
      },
      {
        name: "DialogDescription",
        description: "Texto de apoio, lido junto com o título quando o modal abre.",
        bases: [
          {
            kind: "radix",
            primitive: "Dialog",
            part: "Description",
            href: "https://www.radix-ui.com/primitives/docs/components/dialog",
            except: [],
          },
        ],
        props: [],
      },
      {
        name: "DialogFooter",
        description: "Rodapé com as ações. No celular, empilha com a ação principal em cima.",
        bases: [{ kind: "native", element: "div", except: [] }],
        props: [],
      },
      {
        name: "DialogHeader",
        description:
          "Topo do Dialog: título e descrição. Deixa espaço à direita para o botão de fechar.",
        bases: [{ kind: "native", element: "div", except: [] }],
        props: [],
      },
      {
        name: "DialogTitle",
        description:
          "Título do Dialog (`<h2>`), que também é o nome do modal para leitores de tela. Obrigatório.",
        bases: [
          {
            kind: "radix",
            primitive: "Dialog",
            part: "Title",
            href: "https://www.radix-ui.com/primitives/docs/components/dialog",
            except: [],
          },
        ],
        props: [],
      },
      {
        name: "DialogTrigger",
        description:
          "Abre o Dialog. Use `asChild` com um `Button`: `<DialogTrigger asChild><Button>…</Button></DialogTrigger>`.",
        bases: [
          {
            kind: "radix",
            primitive: "Dialog",
            part: "Trigger",
            href: "https://www.radix-ui.com/primitives/docs/components/dialog",
            except: [],
          },
        ],
        props: [],
      },
    ],
  },
  field: {
    title: "Field",
    parts: [
      {
        name: "Field",
        description:
          "Agrupa um controle com `FieldLabel`, `FieldDescription` e `FieldError` e liga tudo sozinho:\n`htmlFor`/`id`, `aria-describedby`, `aria-invalid`, `required` e `disabled`.\n\nPara ligar na mão, passe `htmlFor` no `FieldLabel` e `id` no controle (o que for passado vence\no automático). Para um controle próprio, use o hook `useFieldControl`.",
        bases: [{ kind: "native", element: "div", except: [] }],
        props: [
          {
            name: "orientation",
            type: '"horizontal" | "vertical"',
            required: false,
            defaultValue: '"vertical"',
            description:
              "`vertical`: rótulo em cima do controle (campos de texto, RadioGroup).\n`horizontal`: controle e rótulo lado a lado (Checkbox, Switch, item de RadioGroup).",
          },
          {
            name: "invalid",
            type: "boolean",
            required: false,
            defaultValue: "",
            description:
              "Marca o controle como inválido (`aria-invalid`) e o rótulo na cor de erro. Sem a prop, fica\ninválido sozinho quando há um `FieldError` com conteúdo.",
          },
          {
            name: "required",
            type: "boolean",
            required: false,
            defaultValue: "false",
            description: "Repassa `required` ao controle e mostra `*` no `FieldLabel`.",
          },
          {
            name: "disabled",
            type: "boolean",
            required: false,
            defaultValue: "false",
            description: "Repassa `disabled` ao controle.",
          },
        ],
      },
      {
        name: "FieldContent",
        description: "Coluna com rótulo e descrição ao lado do controle, num `Field` horizontal.",
        bases: [{ kind: "native", element: "div", except: [] }],
        props: [],
      },
      {
        name: "FieldDescription",
        description:
          "Texto de apoio do `Field` (ou do `FieldSet`), lido junto com o controle (`aria-describedby`).",
        bases: [{ kind: "native", element: "p", except: [] }],
        props: [],
      },
      {
        name: "FieldError",
        description:
          'Mensagem de erro do `Field` (ou do `FieldSet`). Só aparece com conteúdo; quando aparece, marca o\n`Field` como inválido e é lida junto com o controle (`aria-describedby`).\n\nNão é `role="alert"`: num envio com vários erros, anunciar todos de uma vez vira ruído. No envio,\nleve o foco ao primeiro campo inválido. Para validar enquanto a pessoa digita, passe `role="alert"`.',
        bases: [{ kind: "native", element: "div", except: [] }],
        props: [
          {
            name: "errors",
            type: "({ message?: string | undefined; } | undefined)[]",
            required: false,
            defaultValue: "",
            description:
              "Erros no formato do react-hook-form/zod (`{ message?: string }`). Mensagens repetidas são\njuntadas; com mais de uma, vira lista. `children`, se houver, vence.",
          },
        ],
      },
      {
        name: "FieldLabel",
        description:
          "Rótulo do `Field`: aponta para o controle sozinho e mostra `*` quando o `Field` é `required`.",
        bases: [{ kind: "type", name: "Label" }],
        props: [],
      },
      {
        name: "FieldLegend",
        description: "Nome do `FieldSet` (`<legend>`).",
        bases: [{ kind: "native", element: "legend", except: [] }],
        props: [],
      },
      {
        name: "FieldSet",
        description:
          "Agrupa vários `Field` relacionados (ex.: as opções de notificação) num `<fieldset>`, com\n`FieldLegend` como nome do grupo. `FieldDescription` e `FieldError` diretos no `FieldSet` são\nligados ao grupo (`aria-describedby`). `disabled` desabilita todos os controles de dentro.",
        bases: [{ kind: "native", element: "fieldset", except: [] }],
        props: [
          {
            name: "invalid",
            type: "boolean",
            required: false,
            defaultValue: "",
            description:
              "Marca a legenda na cor de erro. Sem a prop, fica inválido sozinho quando há um `FieldError`\ncom conteúdo direto no `FieldSet`.",
          },
        ],
      },
      {
        name: "useFieldControl",
        description:
          "Liga um controle ao `Field` em volta: `id` (para o `FieldLabel`), `aria-describedby` (descrição\ne erro), `aria-invalid`, `required` e `disabled`. O que vier nas props vence o automático; o\n`aria-describedby` informado é somado ao do `Field`. Fora de um `Field`, devolve as props como\nvieram.\n\nUse para ligar um controle próprio (ou de outra biblioteca) ao `Field`:\n`const fieldProps = useFieldControl(props); return <MeuSelect {...fieldProps} />;`",
        bases: [],
        props: [],
      },
    ],
  },
  input: {
    title: "Input",
    parts: [
      {
        name: "Input",
        description:
          "Campo de texto (`<input>` nativo: funciona com formulários, `FormData` e react-hook-form).\nDentro de um `Field`, recebe `id`, descrição, erro, `required` e `disabled` sozinho.",
        bases: [{ kind: "native", element: "input", except: ["size"] }],
        props: [
          {
            name: "size",
            type: '"sm" | "md" | "lg"',
            required: false,
            defaultValue: '"md"',
            description: "Altura: `sm` (32px), `md` (36px) ou `lg` (40px), iguais às do `Button`.",
          },
        ],
      },
    ],
  },
  label: {
    title: "Label",
    parts: [
      {
        name: "Label",
        description:
          "Rótulo de um controle (`<label>`). Ligue pelo `htmlFor` com o `id` do controle, ou envolva o\ncontrole. Dentro de um `Field`, prefira o `FieldLabel`, que se liga sozinho.\n\nCom o controle desabilitado logo antes (classe `peer`), o rótulo fica na cor de apoio.",
        bases: [
          {
            kind: "radix",
            primitive: "Label",
            part: "Root",
            href: "https://www.radix-ui.com/primitives/docs/components/label",
            except: [],
          },
        ],
        props: [],
      },
    ],
  },
  "news-card": {
    title: "NewsCard",
    parts: [
      {
        name: "NewsCard",
        description:
          'Card de notícia: data, título e resumo, com imagem de capa (`variant="default"`) ou só texto\n(`variant="simple"`). O card inteiro é clicável; o link fica no título, então o leitor de tela lê\nsó o título.',
        bases: [{ kind: "native", element: "article", except: ["children", "title"] }],
        props: [
          {
            name: "variant",
            type: '"default" | "simple"',
            required: false,
            defaultValue: '"default"',
            description: "`default`: com imagem de capa (`image` obrigatória). `simple`: só texto.",
          },
          {
            name: "image",
            type: "string",
            required: false,
            defaultValue: "",
            description: "URL da imagem de capa (obrigatória na versão `default`).",
          },
          {
            name: "imageAlt",
            type: "string",
            required: false,
            defaultValue: '""',
            description:
              "Texto alternativo da capa. Vazio deixa a imagem decorativa (o título já descreve a notícia).",
          },
          {
            name: "title",
            type: "string",
            required: true,
            defaultValue: "",
            description: "Título da notícia. É o link, e o card inteiro fica clicável.",
          },
          {
            name: "href",
            type: "string",
            required: true,
            defaultValue: "",
            description: "Endereço da notícia.",
          },
          {
            name: "excerpt",
            type: "string",
            required: false,
            defaultValue: "",
            description: "Resumo, até 3 linhas na tela.",
          },
          {
            name: "date",
            type: "string | Date",
            required: false,
            defaultValue: "",
            description:
              'Data de publicação: `Date` ou texto "AAAA-MM-DD" (lido como data local, sem fuso). Formatada em\n`locale` dentro de um `<time datetime>`.',
          },
          {
            name: "locale",
            type: "string",
            required: false,
            defaultValue: '"pt-BR"',
            description: "Idioma da data.",
          },
          {
            name: "headingLevel",
            type: "2 | 3 | 4",
            required: false,
            defaultValue: "3",
            description: "Nível do título, para seguir a hierarquia da página.",
          },
        ],
      },
    ],
  },
  "product-card": {
    title: "ProductCard",
    parts: [
      {
        name: "ProductCard",
        description:
          'Card de produto: imagem, nome, preço (com "de/por" opcional), selo, variações, avaliação e uma\nação. Com `href`, o card inteiro é clicável; o link fica no nome, então o leitor de tela lê só o\nnome do produto. A `action` continua clicável à parte.',
        bases: [{ kind: "native", element: "article", except: ["children"] }],
        props: [
          {
            name: "name",
            type: "string",
            required: true,
            defaultValue: "",
            description: "Nome do produto (título do card e nome do link).",
          },
          {
            name: "price",
            type: "number",
            required: true,
            defaultValue: "",
            description:
              'Preço atual, formatado com `currency` e `locale` (ex.: `47.9` → "R$ 47,90").',
          },
          {
            name: "originalPrice",
            type: "number",
            required: false,
            defaultValue: "",
            description:
              'Preço anterior, riscado ("de R$ 59,90 por R$ 47,90"). Use quando houver desconto.',
          },
          {
            name: "href",
            type: "string",
            required: false,
            defaultValue: "",
            description:
              "Página do produto. Com ela, o card inteiro vira link (o link fica no nome).",
          },
          {
            name: "image",
            type: "string",
            required: false,
            defaultValue: "",
            description: "URL da imagem. Sem ela, aparece um espaço neutro do mesmo tamanho.",
          },
          {
            name: "imageAlt",
            type: "string",
            required: false,
            defaultValue: '""',
            description:
              "Texto alternativo da imagem. Vazio deixa a imagem decorativa (o nome já está no card); descreva\nsó o que a imagem acrescenta.",
          },
          {
            name: "badge",
            type: "string",
            required: false,
            defaultValue: "",
            description: 'Selo sobre a imagem (ex.: "-20%", "Novo", "Esgotado").',
          },
          {
            name: "badgeVariant",
            type: '"default" | "destructive" | "success" | "warning" | "secondary" | "outline"',
            required: false,
            defaultValue: '"default"',
            description: "Estilo do selo (variantes do `Badge`).",
          },
          {
            name: "options",
            type: "string[]",
            required: false,
            defaultValue: "",
            description:
              'Variações do produto, mostradas como selos (ex.: `["600 ml", "1 L", "1,5 L"]`).',
          },
          {
            name: "optionsLabel",
            type: "string",
            required: false,
            defaultValue: '"Opções"',
            description: 'Nome da lista de variações para leitores de tela (ex.: "Tamanhos").',
          },
          {
            name: "rating",
            type: "number",
            required: false,
            defaultValue: "",
            description: "Nota de 0 a 5 (aceita frações, ex.: `4.5`).",
          },
          {
            name: "reviewCount",
            type: "number",
            required: false,
            defaultValue: "",
            description: "Quantidade de avaliações, ao lado da nota.",
          },
          {
            name: "action",
            type: "ReactNode",
            required: false,
            defaultValue: "",
            description:
              'Ação do card, clicável por cima do link (ex.: `<Button size="sm">Adicionar</Button>`).',
          },
          {
            name: "currency",
            type: "string",
            required: false,
            defaultValue: '"BRL"',
            description: "Moeda do preço (código ISO 4217).",
          },
          {
            name: "locale",
            type: "string",
            required: false,
            defaultValue: '"pt-BR"',
            description: "Idioma da formatação de preço, nota e quantidade.",
          },
          {
            name: "headingLevel",
            type: "2 | 3 | 4",
            required: false,
            defaultValue: "3",
            description: "Nível do título, para seguir a hierarquia da página.",
          },
        ],
      },
    ],
  },
  "radio-group": {
    title: "RadioGroup",
    parts: [
      {
        name: "RadioGroup",
        description:
          'Grupo de opções exclusivas (Radix). Tab entra e sai do grupo; as setas trocam a opção marcada.\nDentro de um `<form>`, envia `name` com o `value` marcado.\n\nNum `Field`, o `FieldLabel` vira o nome do grupo (`aria-labelledby`) e a descrição, o erro,\n`required` e `disabled` vão para o grupo. Cada opção vai num `Field orientation="horizontal"`\npróprio, com `RadioGroupItem` e `FieldLabel`.',
        bases: [
          {
            kind: "radix",
            primitive: "RadioGroup",
            part: "Root",
            href: "https://www.radix-ui.com/primitives/docs/components/radio-group",
            except: ["orientation"],
          },
        ],
        props: [
          {
            name: "orientation",
            type: '"horizontal" | "vertical"',
            required: false,
            defaultValue: '"vertical"',
            description:
              "Disposição das opções: uma por linha ou lado a lado (quebrando linha se faltar espaço).\nAs setas funcionam nas duas direções em qualquer orientação.",
          },
        ],
      },
      {
        name: "RadioGroupItem",
        description:
          "Opção do `RadioGroup`. Precisa de `value` e de um rótulo (`FieldLabel` ou `Label`).",
        bases: [
          {
            kind: "radix",
            primitive: "RadioGroup",
            part: "Item",
            href: "https://www.radix-ui.com/primitives/docs/components/radio-group",
            except: [],
          },
        ],
        props: [],
      },
    ],
  },
  separator: {
    title: "Separator",
    parts: [
      {
        name: "Separator",
        description: "Linha que separa conteúdos. Baseado no Separator do shadcn/ui (Radix).",
        bases: [
          {
            kind: "radix",
            primitive: "Separator",
            part: "Root",
            href: "https://www.radix-ui.com/primitives/docs/components/separator",
            except: [],
          },
        ],
        props: [
          {
            name: "orientation",
            type: '"horizontal" | "vertical"',
            required: false,
            defaultValue: '"horizontal"',
            description: "Direção da linha.",
          },
          {
            name: "decorative",
            type: "boolean",
            required: false,
            defaultValue: "true",
            description:
              'Decorativo (padrão): leitores de tela ignoram. Use `false` quando a linha separa seções\ncom significado; aí ela vira `role="separator"`.',
          },
        ],
      },
    ],
  },
  skeleton: {
    title: "Skeleton",
    parts: [
      {
        name: "Skeleton",
        description:
          'Bloco de carregamento no formato do conteúdo que vai aparecer. Defina o tamanho com classes\n(ex.: `className="h-4 w-32"`).\n\nÉ decorativo (`aria-hidden`). Para leitores de tela, marque o contêiner com `aria-busy="true"` e\ninclua um texto escondido: `<span className="sr-only">Carregando…</span>`. A animação só roda\npara quem não pediu redução de movimento no sistema.',
        bases: [{ kind: "native", element: "div", except: [] }],
        props: [],
      },
    ],
  },
  spinner: {
    title: "Spinner",
    parts: [
      {
        name: "Spinner",
        description:
          'Indicador de carregamento. Usa a cor do texto em volta (`currentColor`); mude com classes\n(ex.: `className="text-muted-foreground"`).\n\nÉ uma região `role="status"`: leitores de tela anunciam o `label`. Com redução de movimento\nligada no sistema, gira mais devagar em vez de parar, para não esconder que algo está acontecendo.',
        bases: [{ kind: "native", element: "span", except: [] }],
        props: [
          {
            name: "size",
            type: '"sm" | "md" | "lg"',
            required: false,
            defaultValue: '"md"',
            description: "Tamanho: `sm` (16px), `md` (24px) ou `lg` (32px).",
          },
          {
            name: "label",
            type: "string",
            required: false,
            defaultValue: '"Carregando"',
            description: "Texto lido por leitores de tela (fica escondido na tela).",
          },
        ],
      },
    ],
  },
  switch: {
    title: "Switch",
    parts: [
      {
        name: "Switch",
        description:
          'Liga/desliga com efeito imediato (`role="switch"`, Espaço alterna). Para uma escolha que só vale\nao enviar o formulário, prefira `Checkbox`. Dentro de um `<form>`, envia `name`/`value` quando\nligado.\n\nUse num `Field orientation="horizontal"` com `FieldLabel` ao lado.',
        bases: [
          {
            kind: "radix",
            primitive: "Switch",
            part: "Root",
            href: "https://www.radix-ui.com/primitives/docs/components/switch",
            except: [],
          },
        ],
        props: [],
      },
    ],
  },
  textarea: {
    title: "Textarea",
    parts: [
      {
        name: "Textarea",
        description:
          "Campo de texto com várias linhas (`<textarea>` nativo). Cresce com o conteúdo; limite com\nclasses (ex.: `max-h-48`). Dentro de um `Field`, recebe `id`, descrição, erro, `required` e\n`disabled` sozinho.",
        bases: [{ kind: "native", element: "textarea", except: [] }],
        props: [
          {
            name: "size",
            type: '"sm" | "md" | "lg"',
            required: false,
            defaultValue: '"md"',
            description:
              "Altura mínima e espaçamento: `sm`, `md` ou `lg`, combinando com o `Input` do mesmo tamanho.",
          },
        ],
      },
    ],
  },
  tooltip: {
    title: "Tooltip",
    parts: [
      {
        name: "Tooltip",
        description:
          "Dica curta que aparece com o ponteiro **ou o foco** no gatilho, depois de 300ms (`delayDuration`).\nEsc fecha; dá para mover o ponteiro até a dica sem ela sumir (WCAG 1.4.13).\n\nÉ complemento: vira a descrição do gatilho (`aria-describedby`), não o nome. Botão só com ícone\ncontinua precisando de `aria-label`. Não abre em telas de toque; não coloque nela informação que\nsó exista ali.",
        bases: [
          {
            kind: "radix",
            primitive: "Tooltip",
            part: "Root",
            href: "https://www.radix-ui.com/primitives/docs/components/tooltip",
            except: [],
          },
        ],
        props: [],
      },
      {
        name: "TooltipContent",
        description:
          "Conteúdo da dica, num portal no `<body>`. `side` escolhe o lado (`top` por padrão); o Radix troca\nde lado se faltar espaço.",
        bases: [
          {
            kind: "radix",
            primitive: "Tooltip",
            part: "Content",
            href: "https://www.radix-ui.com/primitives/docs/components/tooltip",
            except: [],
          },
        ],
        props: [],
      },
      {
        name: "TooltipProvider",
        description:
          "Opcional: compartilha o atraso entre vários Tooltips (ex.: numa barra de ferramentas). Depois que\num abre, os vizinhos abrem na hora enquanto o ponteiro passa por eles.",
        bases: [
          {
            kind: "radix",
            primitive: "Tooltip",
            part: "Provider",
            href: "https://www.radix-ui.com/primitives/docs/components/tooltip",
            except: [],
          },
        ],
        props: [],
      },
      {
        name: "TooltipTrigger",
        description:
          "Elemento que mostra a dica. Use `asChild` com um elemento focável (ex.: `Button`, `<a>`).",
        bases: [
          {
            kind: "radix",
            primitive: "Tooltip",
            part: "Trigger",
            href: "https://www.radix-ui.com/primitives/docs/components/tooltip",
            except: [],
          },
        ],
        props: [],
      },
    ],
  },
};
