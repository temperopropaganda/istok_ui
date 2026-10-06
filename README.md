# istok_ui

Biblioteca de componentes React + TypeScript, estilizada com Tailwind CSS.

- **[SPEC.md](SPEC.md):** objetivo, decisões, status das fases e critérios de aceite (fonte da verdade).
- **[AGENTS.md](AGENTS.md):** regras, comandos e convenções para agentes de IA (e pessoas) que trabalham no código.
- **[Guia para agentes](docs/guia-para-agentes.md):** API de cada componente (props, padrões, exemplos), gerada do
  código e publicada junto no pacote.
- **Online:** [Storybook](https://temperopropaganda.github.io/istok_ui/) e
  [playground](https://temperopropaganda.github.io/istok_ui/playground/) (GitHub Pages).

## Usando nos projetos

O pacote é publicado no npm como `istok-ui` (a partir da `v0.1.0`).

1. Instale:

   ```bash
   npm install istok-ui
   ```

2. Importe o tema no CSS principal do projeto, logo depois do Tailwind:

   ```css
   @import "tailwindcss";
   @import "istok-ui/theme.css";
   ```

   Só isso: o `theme.css` já faz o Tailwind do projeto gerar as classes usadas pelos componentes.

Requer React 19 e Tailwind CSS 4 no projeto.

### Componentes

```tsx
import { Alert, AlertDescription, AlertTitle, Button } from "istok-ui";

<Button>Salvar</Button>
<Button variant="outline" size="sm">Cancelar</Button>
<Button loading={saving}>{saving ? "Salvando…" : "Salvar"}</Button>
<Button asChild variant="link">
  <a href="/ajuda">Ajuda</a>
</Button>

<Alert variant="success">
  <CheckIcon />
  <AlertTitle>Pedido enviado</AlertTitle>
  <AlertDescription>Você vai receber a confirmação por e-mail.</AlertDescription>
</Alert>
```

**Formulários:** o `Field` liga rótulo, descrição e erro ao controle sozinho (`id`, `aria-describedby`,
`aria-invalid`, `required`, `disabled`). O que for passado nas props vence o automático.

```tsx
import { Checkbox, Field, FieldDescription, FieldError, FieldLabel, Input } from "istok-ui";

<Field required>
  <FieldLabel>E-mail</FieldLabel>
  <Input type="email" name="email" />
  <FieldDescription>Usado só para recuperar a senha.</FieldDescription>
  {/* Com conteúdo, o erro marca o campo como inválido. */}
  <FieldError>{errors.email?.message}</FieldError>
</Field>

<Field orientation="horizontal">
  <Checkbox name="termos" />
  <FieldLabel>Aceito os termos</FieldLabel>
</Field>
```

Para ligar um controle próprio (ou de outra biblioteca) ao `Field`, use o hook `useFieldControl(props)`.

**Overlays:** `Dialog` para modais, `AlertDialog` para confirmar ações destrutivas e `Tooltip` para dicas. Todos
renderizam num portal no `<body>`, prendem ou devolvem o foco e fecham com Esc.

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "istok-ui";

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Excluir projeto</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Excluir o projeto?</AlertDialogTitle>
      <AlertDialogDescription>Isso não pode ser desfeito.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction variant="destructive" onClick={excluir}>
        Excluir
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>;
```

| Componente                                                                                                                                                                                  | Variações                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`                                                                                                                        | `type`: single, multiple · `collapsible` · setas/Home/End entre os títulos                                          |
| `Alert`, `AlertTitle`, `AlertDescription`                                                                                                                                                   | `variant`: default, success, warning, destructive · ícone SVG opcional como primeiro filho                          |
| `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogAction`, `AlertDialogCancel` | `size`: sm, md, lg · ações são `Button` (`variant`, `loading`) · não fecha com clique fora                          |
| `Avatar`, `AvatarImage`, `AvatarFallback`                                                                                                                                                   | `size`: sm, md, lg · fallback com iniciais quando não há foto                                                       |
| `Badge`                                                                                                                                                                                     | `variant`: default, secondary, outline, destructive, success, warning · `asChild`                                   |
| `Button`                                                                                                                                                                                    | `variant`: default, secondary, outline, ghost, link, destructive · `size`: sm, md, lg, icon · `asChild` · `loading` |
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`                                                                                             | Peças combináveis · `CardTitle` é `<h3>` (`asChild` troca o nível) · `Card asChild`                                 |
| `Checkbox`                                                                                                                                                                                  | marcado, desmarcado, `"indeterminate"` · envia `name`/`value` no `<form>`                                           |
| `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose`                                                               | `size`: sm, md, lg · `showCloseButton`, `closeLabel`                                                                |
| `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldContent`, `FieldSet`, `FieldLegend`                                                                                          | `orientation`: vertical, horizontal · `invalid`, `required`, `disabled` · hook `useFieldControl`                    |
| `Input`                                                                                                                                                                                     | `size`: sm, md, lg (alturas do Button) · tipos nativos                                                              |
| `Label`                                                                                                                                                                                     | Rótulo ligado por `htmlFor` (num `Field`, use `FieldLabel`)                                                         |
| `NewsCard`                                                                                                                                                                                  | `variant`: default (com capa), simple (só texto) · `date` em `<time>` · card inteiro clicável                       |
| `ProductCard`                                                                                                                                                                               | preço de/por, `badge`, `options` (ex.: 600 ml, 1 L), `rating`, `action` · card inteiro clicável                     |
| `RadioGroup`, `RadioGroupItem`                                                                                                                                                              | `orientation`: vertical, horizontal · setas trocam a opção                                                          |
| `Separator`                                                                                                                                                                                 | `orientation`: horizontal, vertical · `decorative`                                                                  |
| `Skeleton`                                                                                                                                                                                  | Tamanho por classes · decorativo, respeita redução de movimento                                                     |
| `Spinner`                                                                                                                                                                                   | `size`: sm, md, lg · `label` para leitores de tela · cor do texto em volta                                          |
| `Switch`                                                                                                                                                                                    | Liga/desliga com efeito imediato (`role="switch"`)                                                                  |
| `Textarea`                                                                                                                                                                                  | `size`: sm, md, lg · cresce com o conteúdo                                                                          |
| `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`                                                                                                                            | `side`: top, right, bottom, left · 300ms · Provider opcional                                                        |

A documentação de cada componente (props, exemplos, estados) está no
[Storybook](https://temperopropaganda.github.io/istok_ui/).

**Para agentes de IA:** o pacote traz `docs/guia-para-agentes.md` (em `node_modules/istok-ui/docs/`), com a API de
todos os componentes, exemplos, tokens e regras de uso. Leia antes de montar telas com a lib.

### Tema

Os tokens viram utilitários do Tailwind: `bg-primary`, `text-muted-foreground`, `border-border`, `rounded-lg`…

| Token                               | Uso                                        |
| ----------------------------------- | ------------------------------------------ |
| `background` / `foreground`         | Fundo e texto da página                    |
| `card`, `popover`                   | Superfícies (cartões, menus, modais)       |
| `primary`                           | Ação principal                             |
| `secondary`, `accent`, `muted`      | Ações secundárias, hover e textos de apoio |
| `destructive`, `success`, `warning` | Erro, sucesso e alerta                     |
| `border`, `input`, `ring`           | Bordas, controles (3:1) e anel de foco     |
| `overlay`                           | Fundo escurecido atrás dos modais          |
| `--radius`                          | Raio base (`rounded-sm` … `rounded-xl`)    |

Cada cor de fundo tem um par `*-foreground` para o texto por cima, com contraste WCAG AA garantido. A borda dos
controles (`input`) tem contraste de 3:1 com o fundo (WCAG 1.4.11).

**Trocar a marca:** sobrescreva as variáveis no CSS do projeto. Os nomes seguem o padrão do shadcn/ui, então temas gerados para ele funcionam aqui.

```css
:root {
  --primary: oklch(0.55 0.2 260);
  --radius: 0.5rem;
}
```

**Dark mode:** adicione a classe `dark` no `<html>`. A variante `dark:` do Tailwind segue essa classe.

## Desenvolvimento

### Requisitos

- Node 24 (veja `.nvmrc`)
- npm 11

### Começando

```bash
npm install
npx playwright install chromium   # navegador usado pelos testes (uma vez por máquina)
npx playwright install firefox webkit   # opcional: para o npm run test:browsers
npm run storybook
```

O Storybook (http://localhost:6006) é o ambiente principal: documentação, stories de cada componente e alternância entre tema claro e escuro. O `npm run dev` abre o playground (`playground/`), a vitrine no estilo da documentação do shadcn: sidebar à esquerda, uma página por componente com todas as variações e, no fim, a seção **Propriedades** (gerada do código), e tema
escuro por padrão (botão sol/lua no topo).

A vitrine usa a identidade **Istok — Tempero Design System**: logo original, azul-marinho, azul-claro e ondas
na abertura. O tema de marca fica em `playground/index.css`, com versões clara e escura; os tokens publicados
em `src/styles/theme.css` continuam independentes da marca. A arte em `playground/assets/istok-brand.png` é
enquadrada por `playground/brand.tsx`, preservando o símbolo e a tipografia recebidos.

### VS Code

O repositório já traz as configurações em `.vscode/`. Ao abrir o projeto:

1. Instale as extensões recomendadas (ESLint, Prettier, Tailwind CSS IntelliSense, EditorConfig, Vitest).
2. Aceite usar a versão do TypeScript do workspace quando o VS Code perguntar (ou `TypeScript: Select TypeScript Version` → `Use Workspace Version`).

### Scripts

| Script                     | O que faz                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------ |
| `npm run storybook`        | Sobe o Storybook em http://localhost:6006                                            |
| `npm run storybook:build`  | Gera o Storybook estático em `storybook-static/`                                     |
| `npm run playground:build` | Gera o playground estático em `playground-dist/` (para o GitHub Pages)               |
| `npm run dev`              | Sobe o playground com hot reload                                                     |
| `npm run build`            | Checa os tipos e gera a biblioteca (JS + `.d.ts` + `theme.css`) em `dist/`           |
| `npm test`                 | Roda os testes unitários e as stories (com checagem de acessibilidade) no Chromium   |
| `npm run test:browsers`    | Mesmos testes e os E2E no Firefox e no WebKit (no CI roda em todo PR)                |
| `npm run test:watch`       | Testes em modo watch                                                                 |
| `npm run test:coverage`    | Testes com relatório de cobertura (falha abaixo de 90%)                              |
| `npm run test:e2e`         | Testes E2E (Playwright) no playground: navegação, teclado, tema, console e axe       |
| `npm run size`             | Confere o tamanho de cada componente contra os limites do `.size-limit.json`         |
| `npm run guide`            | Regera o guia para agentes (`docs/guia-para-agentes.md`) a partir de `src/`          |
| `npx changeset`            | Registra a mudança do pacote no PR (versão + CHANGELOG)                              |
| `npm run test:consumer`    | Empacota a lib, instala em `examples/consumer-app` e confere o build                 |
| `npm run typecheck`        | Checa os tipos com o TypeScript                                                      |
| `npm run lint`             | Roda o ESLint, falhando com qualquer warning (`lint:fix` corrige o que for possível) |
| `npm run lint:package`     | Valida o pacote publicado (publint + arethetypeswrong)                               |
| `npm run format`           | Formata o código com o Prettier                                                      |
| `npm run format:check`     | Verifica a formatação sem alterar arquivos                                           |
| `npm run check`            | typecheck + lint + format:check + build + size + lint:package                        |

O CI (`.github/workflows/ci.yml`) roda `check`, `test:coverage`, `test:e2e`, `test:browsers`, `storybook:build` e
`test:consumer` em todo PR, com Chromium, Firefox e WebKit.

### Testes

- **Unitários e de componente:** `*.test.ts(x)` ao lado do código, rodando no Chromium real via Vitest browser mode.
- **Stories:** cada story em `*.stories.tsx` vira um teste que renderiza o componente e roda o axe. Qualquer violação de acessibilidade falha o teste, inclusive contraste de cor.
- **E2E:** `e2e/*.spec.ts` (Playwright) usa a vitrine como um usuário: navegação pela sidebar, clique, teclado, os dois temas, console sem erros e axe em cada página.
- **Consumo:** `npm run test:consumer` simula um projeto real instalando o pacote (inclui tree-shaking).
- **Navegadores:** local, os testes usam o Chromium; o CI roda também Firefox e WebKit (`npm run test:browsers`).
- **Tamanho:** `npm run size` mede cada componente (brotli, com as dependências) e falha acima do limite.
- **Leitor de tela:** roteiro manual com o Orca em [docs/auditoria-leitor-de-tela.md](docs/auditoria-leitor-de-tela.md).

### Publicação

Versões com [Changesets](https://github.com/changesets/changesets): cada PR que muda o pacote traz um changeset
(`npx changeset`). Na `main`, o workflow `release.yml` abre o PR de versão; **mergear esse PR publica no npm**
(trusted publishing, com provenance). O `pages.yml` publica o Storybook e o playground no GitHub Pages. Passo a passo
e configuração inicial em [docs/publicacao.md](docs/publicacao.md).

### Estrutura

```
src/                  código da biblioteca (src/index.ts é a API pública)
src/styles/           theme.css com os tokens (publicado cru em dist/theme.css)
.storybook/           configuração do Storybook
docs/                 páginas MDX do Storybook e roteiro de auditoria com leitor de tela
examples/consumer-app app de teste de consumo (usado pelo test:consumer)
scripts/              scripts de manutenção
playground/           vitrine com sidebar e uma página por componente (não vai pro pacote)
e2e/                  testes E2E com Playwright, rodando contra o playground
tests/                setup dos testes de componente (carrega Tailwind + tema)
```

### Problemas comuns

**O VS Code mostra erros que o `npm run lint` não mostra** (por exemplo, "Unsafe assignment of an error typed value"):
o servidor do ESLint não percebe pacotes instalados depois que ele iniciou. Rode `ESLint: Restart ESLint Server`
(ou `Developer: Reload Window`) depois de um `npm install` com dependências novas.

**Os testes não encontram o navegador:** rode `npx playwright install chromium`.
