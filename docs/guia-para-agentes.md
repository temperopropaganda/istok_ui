# istok-ui: guia para agentes

> Gerado de `src/` (tipos e JSDoc) por `npm run guide` na versão 0.0.0. Não edite à mão.

Biblioteca de componentes React 19 + Tailwind CSS 4, acessível (WCAG AA), com tema claro/escuro e tokens
trocáveis por projeto. Use este guia para montar telas com a API certa.

## Instalação

```bash
npm install istok-ui
```

No CSS principal do projeto, logo depois do Tailwind:

```css
@import "tailwindcss";
@import "istok-ui/theme.css";
```

Tema escuro: classe `dark` no `<html>`.

## Regras de uso

- Importe tudo de `istok-ui` (ex.: `import { Button, Field } from "istok-ui"`).
- Estilize só com classes **literais** do Tailwind e **tokens** do tema (`bg-primary`, `text-muted-foreground`).
  Nada de `bg-${cor}` montado em tempo de execução nem de cor da paleta crua (`bg-neutral-500`).
- Ajuste um componente com `className` (é mesclado com `cn()`; a classe passada vence conflitos).
- Formulário: um `Field` por controle, com `FieldLabel`, `FieldDescription` e `FieldError`; ele liga `id`,
  `aria-describedby`, `aria-invalid`, `required` e `disabled` sozinho. Checkbox, Switch e opções de RadioGroup
  vão num `Field orientation="horizontal"`.
- Botão só com ícone: `size="icon"` e `aria-label`. O `Tooltip` é complemento, não substitui o nome.
- `Dialog` e `AlertDialog` precisam de título; sem descrição, passe `aria-describedby={undefined}`. Para
  confirmar ações destrutivas, use `AlertDialog`.
- Navegação com visual de botão: `<Button asChild><a href="…">…</a></Button>`.

## Tokens

Cores (viram `bg-*`, `text-*`, `border-*`, `ring-*`…): `background`, `foreground`, `card`, `card-foreground`, `popover`, `popover-foreground`, `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `muted`, `muted-foreground`, `accent`, `accent-foreground`, `destructive`, `destructive-foreground`, `success`, `success-foreground`, `warning`, `warning-foreground`, `border`, `input`, `ring`, `overlay`.
Cada cor de fundo tem um par `*-foreground` para o texto por cima.

Raio: `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl` (derivados de `--radius`).

Animações (use com `motion-safe:`): `animate-fade-in`, `animate-fade-out`, `animate-zoom-in`, `animate-zoom-out`.

## Componentes

### Alert

Peças: `Alert`, `AlertDescription`, `AlertTitle`.

#### `Alert`

Mensagem em destaque. Combine com `AlertTitle`, `AlertDescription` e, opcionalmente, um ícone
SVG como primeiro filho (ele vai para a coluna da esquerda).

Aceita as props nativas de `<div>`.

| Prop      | Tipo                                                   | Padrão      | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------- | ------------------------------------------------------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant` | `"default" \| "destructive" \| "success" \| "warning"` | `"default"` | Estilo visual e papel para leitores de tela. <br>- `default`: informação neutra (`role="status"`) <br>- `success`: ação concluída (`role="status"`) <br>- `warning`: atenção antes de seguir (`role="alert"`) <br>- `destructive`: erro ou falha (`role="alert"`) `role="alert"` interrompe o leitor de tela; `status` espera ele terminar o que está lendo. Passe `role` para trocar (ex.: `role="note"` para um aviso fixo da página). |

```tsx
<Alert variant="destructive">
  <AlertTitle>Falha no pagamento</AlertTitle>
  <AlertDescription>O cartão foi recusado. Confira os dados e tente de novo.</AlertDescription>
</Alert>
```

#### `AlertDescription`

Detalhes do alerta: texto, parágrafos ou listas.

Aceita as props nativas de `<div>`.

#### `AlertTitle`

Título curto do alerta.

Aceita as props nativas de `<div>`.

### AlertDialog

Peças: `AlertDialog`, `AlertDialogAction`, `AlertDialogCancel`, `AlertDialogContent`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogTrigger`.

#### `AlertDialog`

Confirmação que exige resposta (`role="alertdialog"`), para ações destrutivas ou irreversíveis.
Diferente do `Dialog`: não fecha com clique fora e, ao abrir, o foco vai para o
`AlertDialogCancel` (a opção segura). Esc cancela.

Aceita as props de `AlertDialog.Root` do Radix (https://www.radix-ui.com/primitives/docs/components/alert-dialog).

```tsx
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
</AlertDialog>
```

#### `AlertDialogAction`

Confirma e fecha. É um `Button` (aceita `variant`, `size`, `loading`…); use
`variant="destructive"` para exclusões. Para uma ação assíncrona, chame
`event.preventDefault()` no `onClick` (o modal fica aberto), ligue `loading` e feche pelo
`open`/`onOpenChange` quando terminar. Com `loading`, novos cliques não fecham o modal.

Aceita as props nativas de `<button>`.

| Prop      | Tipo                                                                          | Padrão      | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------- | ----------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant` | `"link" \| "default" \| "destructive" \| "secondary" \| "outline" \| "ghost"` | `"default"` | Estilo visual. <br>- `default`: ação principal <br>- `secondary`: ação secundária <br>- `outline`: ação neutra com borda <br>- `ghost`: ação discreta, sem fundo (barras de ferramentas, menus) <br>- `link`: aparência de link <br>- `destructive`: ação perigosa ou irreversível (excluir, cancelar assinatura)                                                                                                                                        |
| `size`    | `"sm" \| "md" \| "lg" \| "icon"`                                              | `"md"`      | Tamanho. Use `icon` para botões só com ícone (exige `aria-label`).                                                                                                                                                                                                                                                                                                                                                                                       |
| `asChild` | `boolean`                                                                     | `false`     | Renderiza o filho único (ex.: `<a>` ou `<Link>` do router) com o visual do botão, em vez de um `<button>`.                                                                                                                                                                                                                                                                                                                                               |
| `loading` | `boolean`                                                                     | `false`     | Ação em andamento: mostra um `Spinner` no lugar do ícone (ou antes do texto), marca `aria-busy` e ignora cliques, inclusive o envio de formulário. Continua focável (`aria-disabled` em vez de `disabled`), para o foco não se perder quando o carregamento começa. Leitores de tela anunciam o botão como indisponível; para dizer o que está acontecendo, troque o texto junto (ex.: "Salvando…"). Com `asChild`, aplica só o estado, sem o `Spinner`. |

#### `AlertDialogCancel`

Cancela e fecha. É um `Button` com `variant="outline"` por padrão; recebe o foco ao abrir.

Aceita as props nativas de `<button>`.

| Prop      | Tipo                                                                          | Padrão      | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------- | ----------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant` | `"link" \| "default" \| "destructive" \| "secondary" \| "outline" \| "ghost"` | `"default"` | Estilo visual. <br>- `default`: ação principal <br>- `secondary`: ação secundária <br>- `outline`: ação neutra com borda <br>- `ghost`: ação discreta, sem fundo (barras de ferramentas, menus) <br>- `link`: aparência de link <br>- `destructive`: ação perigosa ou irreversível (excluir, cancelar assinatura)                                                                                                                                        |
| `size`    | `"sm" \| "md" \| "lg" \| "icon"`                                              | `"md"`      | Tamanho. Use `icon` para botões só com ícone (exige `aria-label`).                                                                                                                                                                                                                                                                                                                                                                                       |
| `asChild` | `boolean`                                                                     | `false`     | Renderiza o filho único (ex.: `<a>` ou `<Link>` do router) com o visual do botão, em vez de um `<button>`.                                                                                                                                                                                                                                                                                                                                               |
| `loading` | `boolean`                                                                     | `false`     | Ação em andamento: mostra um `Spinner` no lugar do ícone (ou antes do texto), marca `aria-busy` e ignora cliques, inclusive o envio de formulário. Continua focável (`aria-disabled` em vez de `disabled`), para o foco não se perder quando o carregamento começa. Leitores de tela anunciam o botão como indisponível; para dizer o que está acontecendo, troque o texto junto (ex.: "Salvando…"). Com `asChild`, aplica só o estado, sem o `Spinner`. |

#### `AlertDialogContent`

Conteúdo do AlertDialog, num portal no `<body>`. Precisa de título e descrição.

Aceita as props de `AlertDialog.Content` do Radix (https://www.radix-ui.com/primitives/docs/components/alert-dialog).

| Prop   | Tipo                   | Padrão | Descrição                                                   |
| ------ | ---------------------- | ------ | ----------------------------------------------------------- |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Largura máxima: `sm` (384px), `md` (512px) ou `lg` (672px). |

#### `AlertDialogDescription`

Consequência da ação ("Isso não pode ser desfeito."). Obrigatório.

Aceita as props de `AlertDialog.Description` do Radix (https://www.radix-ui.com/primitives/docs/components/alert-dialog).

#### `AlertDialogFooter`

Rodapé com as ações. No celular, empilha com a ação principal em cima.

Aceita as props nativas de `<div>`.

#### `AlertDialogHeader`

Topo do AlertDialog: título e descrição.

Aceita as props nativas de `<div>`.

#### `AlertDialogTitle`

Pergunta do AlertDialog (`<h2>`), que também é o nome do modal. Obrigatório.

Aceita as props de `AlertDialog.Title` do Radix (https://www.radix-ui.com/primitives/docs/components/alert-dialog).

#### `AlertDialogTrigger`

Abre o AlertDialog. Use `asChild` com um `Button`.

Aceita as props de `AlertDialog.Trigger` do Radix (https://www.radix-ui.com/primitives/docs/components/alert-dialog).

### Avatar

Peças: `Avatar`, `AvatarFallback`, `AvatarImage`.

#### `Avatar`

Foto de uma pessoa ou entidade. Combine `AvatarImage` com `AvatarFallback`: o fallback aparece
enquanto a imagem carrega ou se ela falhar.

Aceita as props de `Avatar.Root` do Radix (https://www.radix-ui.com/primitives/docs/components/avatar).

| Prop   | Tipo                   | Padrão | Descrição                                         |
| ------ | ---------------------- | ------ | ------------------------------------------------- |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamanho: `sm` (24px), `md` (32px) ou `lg` (40px). |

```tsx
<Avatar size="lg">
  <AvatarImage src="/fotos/ana.jpg" alt="Ana Souza" />
  <AvatarFallback aria-label="Ana Souza">AS</AvatarFallback>
</Avatar>
```

#### `AvatarFallback`

Conteúdo mostrado sem a imagem, normalmente as iniciais. Para leitores de tela, prefira
`aria-label` com o nome completo (ex.: `<AvatarFallback aria-label="Ana Souza">AS</AvatarFallback>`).

Aceita as props de `Avatar.Fallback` do Radix (https://www.radix-ui.com/primitives/docs/components/avatar).

#### `AvatarImage`

Imagem do avatar. O `alt` é obrigatório (use o nome da pessoa).

Aceita as props de `Avatar.Image` do Radix (https://www.radix-ui.com/primitives/docs/components/avatar).

| Prop                | Tipo     | Padrão | Descrição                                               |
| ------------------- | -------- | ------ | ------------------------------------------------------- |
| `alt` (obrigatória) | `string` | —      | Texto alternativo: o nome da pessoa (ex.: "Ana Souza"). |

### Badge

#### `Badge`

Rótulo curto para status, categoria ou contagem.

Aceita as props nativas de `<span>`.

| Prop      | Tipo                                                                               | Padrão      | Descrição                                                                                                                                                                                                                                               |
| --------- | ---------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant` | `"default" \| "destructive" \| "success" \| "warning" \| "secondary" \| "outline"` | `"default"` | Estilo visual. <br>- `default`: destaque padrão <br>- `secondary`: informação neutra <br>- `outline`: discreto, só com borda <br>- `destructive`: erro ou estado crítico <br>- `success`: concluído, ativo, aprovado <br>- `warning`: atenção, pendente |
| `asChild` | `boolean`                                                                          | `false`     | Renderiza o filho único (ex.: `<a>`) com o visual do badge, em vez de um `<span>`.                                                                                                                                                                      |

```tsx
<Badge variant="success">Ativo</Badge>
<Badge variant="outline">Rascunho</Badge>
```

### Button

#### `Button`

Botão para ações. Para navegação, use `asChild` com um `<a>` ou `<Link>`.

Aceita as props nativas de `<button>`.

| Prop      | Tipo                                                                          | Padrão      | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------- | ----------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant` | `"link" \| "default" \| "destructive" \| "secondary" \| "outline" \| "ghost"` | `"default"` | Estilo visual. <br>- `default`: ação principal <br>- `secondary`: ação secundária <br>- `outline`: ação neutra com borda <br>- `ghost`: ação discreta, sem fundo (barras de ferramentas, menus) <br>- `link`: aparência de link <br>- `destructive`: ação perigosa ou irreversível (excluir, cancelar assinatura)                                                                                                                                        |
| `size`    | `"sm" \| "md" \| "lg" \| "icon"`                                              | `"md"`      | Tamanho. Use `icon` para botões só com ícone (exige `aria-label`).                                                                                                                                                                                                                                                                                                                                                                                       |
| `asChild` | `boolean`                                                                     | `false`     | Renderiza o filho único (ex.: `<a>` ou `<Link>` do router) com o visual do botão, em vez de um `<button>`.                                                                                                                                                                                                                                                                                                                                               |
| `loading` | `boolean`                                                                     | `false`     | Ação em andamento: mostra um `Spinner` no lugar do ícone (ou antes do texto), marca `aria-busy` e ignora cliques, inclusive o envio de formulário. Continua focável (`aria-disabled` em vez de `disabled`), para o foco não se perder quando o carregamento começa. Leitores de tela anunciam o botão como indisponível; para dizer o que está acontecendo, troque o texto junto (ex.: "Salvando…"). Com `asChild`, aplica só o estado, sem o `Spinner`. |

```tsx
<Button>Salvar</Button>
<Button variant="outline" size="sm">Cancelar</Button>
<Button loading={salvando}>{salvando ? "Salvando…" : "Salvar"}</Button>
<Button size="icon" variant="ghost" aria-label="Fechar">
  <XIcon />
</Button>
<Button asChild variant="link">
  <a href="/ajuda">Ajuda</a>
</Button>
```

### Card

Peças: `Card`, `CardAction`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardTitle`.

#### `Card`

Superfície que agrupa conteúdo relacionado.

Aceita as props nativas de `<div>`.

| Prop      | Tipo      | Padrão  | Descrição                                                                                         |
| --------- | --------- | ------- | ------------------------------------------------------------------------------------------------- |
| `asChild` | `boolean` | `false` | Renderiza o filho único (ex.: `<article>` ou `<li>`) com o visual do card, em vez de uma `<div>`. |

```tsx
<Card>
  <CardHeader>
    <CardTitle>Plano Pro</CardTitle>
    <CardDescription>Para times que publicam toda semana.</CardDescription>
    <CardAction>
      <Badge variant="success">Ativo</Badge>
    </CardAction>
  </CardHeader>
  <CardContent>R$ 49/mês por pessoa.</CardContent>
  <CardFooter>
    <Button>Assinar</Button>
  </CardFooter>
</Card>
```

#### `CardAction`

Ação no canto superior direito do cabeçalho (ex.: um `Button` de menu).

Aceita as props nativas de `<div>`.

#### `CardContent`

Corpo do card.

Aceita as props nativas de `<div>`.

#### `CardDescription`

Texto de apoio abaixo do título.

Aceita as props nativas de `<p>`.

#### `CardFooter`

Rodapé do card, normalmente com ações.

Aceita as props nativas de `<div>`.

#### `CardHeader`

Topo do card: título, descrição e, opcionalmente, uma ação (`CardAction`) à direita.

Aceita as props nativas de `<div>`.

#### `CardTitle`

Título do card. É um `<h3>` por padrão, para leitores de tela reconhecerem como título.

Aceita as props nativas de `<h3>`.

| Prop      | Tipo      | Padrão  | Descrição                                                                                                                                                 |
| --------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `asChild` | `boolean` | `false` | Renderiza o filho único no lugar do `<h3>`. Use para ajustar o nível do título à hierarquia da página (ex.: `<CardTitle asChild><h2>…</h2></CardTitle>`). |

### Checkbox

#### `Checkbox`

Caixa de seleção (Radix): marcada, desmarcada ou indeterminada (`checked="indeterminate"`, para
"selecionar todos" parcial). Espaço alterna. Dentro de um `<form>`, envia `name`/`value` como um
checkbox nativo.

Use num `Field orientation="horizontal"` com `FieldLabel` ao lado.

Aceita as props de `Checkbox.Root` do Radix (https://www.radix-ui.com/primitives/docs/components/checkbox).

```tsx
<Field orientation="horizontal">
  <Checkbox name="termos" />
  <FieldLabel>Aceito os termos de uso</FieldLabel>
</Field>
```

### Dialog

Peças: `Dialog`, `DialogClose`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogTitle`, `DialogTrigger`.

#### `Dialog`

Janela modal (Radix). Prende o foco, fecha com Esc ou clique fora e devolve o foco a quem abriu.
Use `open`/`onOpenChange` para controlar, ou deixe o `DialogTrigger` abrir sozinho.

Para confirmar ações destrutivas ("Excluir projeto?"), use o `AlertDialog`.

Aceita as props de `Dialog.Root` do Radix (https://www.radix-ui.com/primitives/docs/components/dialog).

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Editar perfil</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Editar perfil</DialogTitle>
      <DialogDescription>As mudanças aparecem para todo o time.</DialogDescription>
    </DialogHeader>
    <Field>
      <FieldLabel>Nome</FieldLabel>
      <Input name="nome" />
    </Field>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancelar</Button>
      </DialogClose>
      <Button type="submit">Salvar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### `DialogClose`

Fecha o Dialog. Use `asChild` com um `Button` (ex.: "Cancelar" no `DialogFooter`).

Aceita as props de `Dialog.Close` do Radix (https://www.radix-ui.com/primitives/docs/components/dialog).

#### `DialogContent`

Conteúdo do Dialog, num portal no `<body>`, com o fundo escurecido. Precisa de um
`DialogTitle`; sem `DialogDescription`, passe `aria-describedby={undefined}`.

Aceita as props de `Dialog.Content` do Radix (https://www.radix-ui.com/primitives/docs/components/dialog).

| Prop              | Tipo                   | Padrão     | Descrição                                                                                                |
| ----------------- | ---------------------- | ---------- | -------------------------------------------------------------------------------------------------------- |
| `size`            | `"sm" \| "md" \| "lg"` | `"md"`     | Largura máxima: `sm` (384px), `md` (512px) ou `lg` (672px). No celular, ocupa a largura toda com margem. |
| `showCloseButton` | `boolean`              | `true`     | Mostra o botão de fechar (X) no canto. Esc e clique fora continuam fechando sem ele.                     |
| `closeLabel`      | `string`               | `"Fechar"` | Nome do botão de fechar para leitores de tela.                                                           |

#### `DialogDescription`

Texto de apoio, lido junto com o título quando o modal abre.

Aceita as props de `Dialog.Description` do Radix (https://www.radix-ui.com/primitives/docs/components/dialog).

#### `DialogFooter`

Rodapé com as ações. No celular, empilha com a ação principal em cima.

Aceita as props nativas de `<div>`.

#### `DialogHeader`

Topo do Dialog: título e descrição. Deixa espaço à direita para o botão de fechar.

Aceita as props nativas de `<div>`.

#### `DialogTitle`

Título do Dialog (`<h2>`), que também é o nome do modal para leitores de tela. Obrigatório.

Aceita as props de `Dialog.Title` do Radix (https://www.radix-ui.com/primitives/docs/components/dialog).

#### `DialogTrigger`

Abre o Dialog. Use `asChild` com um `Button`: `<DialogTrigger asChild><Button>…</Button></DialogTrigger>`.

Aceita as props de `Dialog.Trigger` do Radix (https://www.radix-ui.com/primitives/docs/components/dialog).

### Field

Peças: `Field`, `FieldContent`, `FieldDescription`, `FieldError`, `FieldLabel`, `FieldLegend`, `FieldSet`, `useFieldControl`.

#### `Field`

Agrupa um controle com `FieldLabel`, `FieldDescription` e `FieldError` e liga tudo sozinho:
`htmlFor`/`id`, `aria-describedby`, `aria-invalid`, `required` e `disabled`.

Para ligar na mão, passe `htmlFor` no `FieldLabel` e `id` no controle (o que for passado vence
o automático). Para um controle próprio, use o hook `useFieldControl`.

Aceita as props nativas de `<div>`.

| Prop          | Tipo                         | Padrão       | Descrição                                                                                                                                                 |
| ------------- | ---------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | `vertical`: rótulo em cima do controle (campos de texto, RadioGroup). `horizontal`: controle e rótulo lado a lado (Checkbox, Switch, item de RadioGroup). |
| `invalid`     | `boolean`                    | —            | Marca o controle como inválido (`aria-invalid`) e o rótulo na cor de erro. Sem a prop, fica inválido sozinho quando há um `FieldError` com conteúdo.      |
| `required`    | `boolean`                    | `false`      | Repassa `required` ao controle e mostra `*` no `FieldLabel`.                                                                                              |
| `disabled`    | `boolean`                    | `false`      | Repassa `disabled` ao controle.                                                                                                                           |

```tsx
<Field required>
  <FieldLabel>E-mail</FieldLabel>
  <Input type="email" name="email" />
  <FieldDescription>Usado só para recuperar a senha.</FieldDescription>
  <FieldError>{erros.email}</FieldError>
</Field>
```

#### `FieldContent`

Coluna com rótulo e descrição ao lado do controle, num `Field` horizontal.

Aceita as props nativas de `<div>`.

#### `FieldDescription`

Texto de apoio do `Field` (ou do `FieldSet`), lido junto com o controle (`aria-describedby`).

Aceita as props nativas de `<p>`.

#### `FieldError`

Mensagem de erro do `Field` (ou do `FieldSet`). Só aparece com conteúdo; quando aparece, marca o
`Field` como inválido e é lida junto com o controle (`aria-describedby`).

Não é `role="alert"`: num envio com vários erros, anunciar todos de uma vez vira ruído. No envio,
leve o foco ao primeiro campo inválido. Para validar enquanto a pessoa digita, passe `role="alert"`.

Aceita as props nativas de `<div>`.

| Prop     | Tipo                                                  | Padrão | Descrição                                                                                                                                                      |
| -------- | ----------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `errors` | `({ message?: string \| undefined; } \| undefined)[]` | —      | Erros no formato do react-hook-form/zod (`{ message?: string }`). Mensagens repetidas são juntadas; com mais de uma, vira lista. `children`, se houver, vence. |

#### `FieldLabel`

Rótulo do `Field`: aponta para o controle sozinho e mostra `*` quando o `Field` é `required`.

Aceita as props de `ComponentProps<typeof Label>`.

#### `FieldLegend`

Nome do `FieldSet` (`<legend>`).

Aceita as props nativas de `<legend>`.

#### `FieldSet`

Agrupa vários `Field` relacionados (ex.: as opções de notificação) num `<fieldset>`, com
`FieldLegend` como nome do grupo. `FieldDescription` e `FieldError` diretos no `FieldSet` são
ligados ao grupo (`aria-describedby`). `disabled` desabilita todos os controles de dentro.

Aceita as props nativas de `<fieldset>`.

| Prop      | Tipo      | Padrão | Descrição                                                                                                                      |
| --------- | --------- | ------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `invalid` | `boolean` | —      | Marca a legenda na cor de erro. Sem a prop, fica inválido sozinho quando há um `FieldError` com conteúdo direto no `FieldSet`. |

#### `useFieldControl`

Liga um controle ao `Field` em volta: `id` (para o `FieldLabel`), `aria-describedby` (descrição
e erro), `aria-invalid`, `required` e `disabled`. O que vier nas props vence o automático; o
`aria-describedby` informado é somado ao do `Field`. Fora de um `Field`, devolve as props como
vieram.

Use para ligar um controle próprio (ou de outra biblioteca) ao `Field`:
`const fieldProps = useFieldControl(props); return <MeuSelect {...fieldProps} />;`

### Input

#### `Input`

Campo de texto (`<input>` nativo: funciona com formulários, `FormData` e react-hook-form).
Dentro de um `Field`, recebe `id`, descrição, erro, `required` e `disabled` sozinho.

Aceita as props nativas de `<input>`, exceto `size`.

| Prop   | Tipo                   | Padrão | Descrição                                                               |
| ------ | ---------------------- | ------ | ----------------------------------------------------------------------- |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Altura: `sm` (32px), `md` (36px) ou `lg` (40px), iguais às do `Button`. |

```tsx
<Field>
  <FieldLabel>Busca</FieldLabel>
  <Input type="search" size="sm" placeholder="Buscar…" />
</Field>
```

### Label

#### `Label`

Rótulo de um controle (`<label>`). Ligue pelo `htmlFor` com o `id` do controle, ou envolva o
controle. Dentro de um `Field`, prefira o `FieldLabel`, que se liga sozinho.

Com o controle desabilitado logo antes (classe `peer`), o rótulo fica na cor de apoio.

Aceita as props de `Label.Root` do Radix (https://www.radix-ui.com/primitives/docs/components/label).

```tsx
<Label htmlFor="cupom">Cupom</Label>
<Input id="cupom" />
```

### RadioGroup

Peças: `RadioGroup`, `RadioGroupItem`.

#### `RadioGroup`

Grupo de opções exclusivas (Radix). Tab entra e sai do grupo; as setas trocam a opção marcada.
Dentro de um `<form>`, envia `name` com o `value` marcado.

Num `Field`, o `FieldLabel` vira o nome do grupo (`aria-labelledby`) e a descrição, o erro,
`required` e `disabled` vão para o grupo. Cada opção vai num `Field orientation="horizontal"`
próprio, com `RadioGroupItem` e `FieldLabel`.

Aceita as props de `RadioGroup.Root` do Radix (https://www.radix-ui.com/primitives/docs/components/radio-group), exceto `orientation`.

| Prop          | Tipo                         | Padrão       | Descrição                                                                                                                                            |
| ------------- | ---------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | Disposição das opções: uma por linha ou lado a lado (quebrando linha se faltar espaço). As setas funcionam nas duas direções em qualquer orientação. |

```tsx
<Field>
  <FieldLabel>Plano</FieldLabel>
  <RadioGroup name="plano" defaultValue="mensal">
    <Field orientation="horizontal">
      <RadioGroupItem value="mensal" />
      <FieldLabel>Mensal</FieldLabel>
    </Field>
    <Field orientation="horizontal">
      <RadioGroupItem value="anual" />
      <FieldLabel>Anual</FieldLabel>
    </Field>
  </RadioGroup>
</Field>
```

#### `RadioGroupItem`

Opção do `RadioGroup`. Precisa de `value` e de um rótulo (`FieldLabel` ou `Label`).

Aceita as props de `RadioGroup.Item` do Radix (https://www.radix-ui.com/primitives/docs/components/radio-group).

### Separator

#### `Separator`

Linha que separa conteúdos. Baseado no Separator do shadcn/ui (Radix).

Aceita as props de `Separator.Root` do Radix (https://www.radix-ui.com/primitives/docs/components/separator).

| Prop          | Tipo                         | Padrão         | Descrição                                                                                                                                |
| ------------- | ---------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `orientation` | `"vertical" \| "horizontal"` | `"horizontal"` | Direção da linha.                                                                                                                        |
| `decorative`  | `boolean`                    | `true`         | Decorativo (padrão): leitores de tela ignoram. Use `false` quando a linha separa seções com significado; aí ela vira `role="separator"`. |

```tsx
<Separator />
<div className="flex h-5 items-center gap-3">
  Docs <Separator orientation="vertical" /> Blog
</div>
```

### Skeleton

#### `Skeleton`

Bloco de carregamento no formato do conteúdo que vai aparecer. Defina o tamanho com classes
(ex.: `className="h-4 w-32"`).

É decorativo (`aria-hidden`). Para leitores de tela, marque o contêiner com `aria-busy="true"` e
inclua um texto escondido: `<span className="sr-only">Carregando…</span>`. A animação só roda
para quem não pediu redução de movimento no sistema.

Aceita as props nativas de `<div>`.

```tsx
<div aria-busy="true" className="space-y-2">
  <span className="sr-only">Carregando…</span>
  <Skeleton className="h-4 w-48" />
  <Skeleton className="h-4 w-32" />
</div>
```

### Spinner

#### `Spinner`

Indicador de carregamento. Usa a cor do texto em volta (`currentColor`); mude com classes
(ex.: `className="text-muted-foreground"`).

É uma região `role="status"`: leitores de tela anunciam o `label`. Com redução de movimento
ligada no sistema, gira mais devagar em vez de parar, para não esconder que algo está acontecendo.

Aceita as props nativas de `<span>`.

| Prop    | Tipo                   | Padrão         | Descrição                                                 |
| ------- | ---------------------- | -------------- | --------------------------------------------------------- |
| `size`  | `"sm" \| "md" \| "lg"` | `"md"`         | Tamanho: `sm` (16px), `md` (24px) ou `lg` (32px).         |
| `label` | `string`               | `"Carregando"` | Texto lido por leitores de tela (fica escondido na tela). |

```tsx
<Spinner size="sm" label="Carregando pedidos" />
```

### Switch

#### `Switch`

Liga/desliga com efeito imediato (`role="switch"`, Espaço alterna). Para uma escolha que só vale
ao enviar o formulário, prefira `Checkbox`. Dentro de um `<form>`, envia `name`/`value` quando
ligado.

Use num `Field orientation="horizontal"` com `FieldLabel` ao lado.

Aceita as props de `Switch.Root` do Radix (https://www.radix-ui.com/primitives/docs/components/switch).

```tsx
<Field orientation="horizontal">
  <Switch name="notificacoes" />
  <FieldLabel>Notificações por e-mail</FieldLabel>
</Field>
```

### Textarea

#### `Textarea`

Campo de texto com várias linhas (`<textarea>` nativo). Cresce com o conteúdo; limite com
classes (ex.: `max-h-48`). Dentro de um `Field`, recebe `id`, descrição, erro, `required` e
`disabled` sozinho.

Aceita as props nativas de `<textarea>`.

| Prop   | Tipo                   | Padrão | Descrição                                                                                   |
| ------ | ---------------------- | ------ | ------------------------------------------------------------------------------------------- |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Altura mínima e espaçamento: `sm`, `md` ou `lg`, combinando com o `Input` do mesmo tamanho. |

```tsx
<Field>
  <FieldLabel>Mensagem</FieldLabel>
  <Textarea name="mensagem" />
</Field>
```

### Tooltip

Peças: `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger`.

#### `Tooltip`

Dica curta que aparece com o ponteiro **ou o foco** no gatilho, depois de 300ms (`delayDuration`).
Esc fecha; dá para mover o ponteiro até a dica sem ela sumir (WCAG 1.4.13).

É complemento: vira a descrição do gatilho (`aria-describedby`), não o nome. Botão só com ícone
continua precisando de `aria-label`. Não abre em telas de toque; não coloque nela informação que
só exista ali.

Aceita as props de `Tooltip.Root` do Radix (https://www.radix-ui.com/primitives/docs/components/tooltip).

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button size="icon" variant="ghost" aria-label="Negrito">
      <BoldIcon />
    </Button>
  </TooltipTrigger>
  <TooltipContent>Negrito (Ctrl+B)</TooltipContent>
</Tooltip>
```

#### `TooltipContent`

Conteúdo da dica, num portal no `<body>`. `side` escolhe o lado (`top` por padrão); o Radix troca
de lado se faltar espaço.

Aceita as props de `Tooltip.Content` do Radix (https://www.radix-ui.com/primitives/docs/components/tooltip).

#### `TooltipProvider`

Opcional: compartilha o atraso entre vários Tooltips (ex.: numa barra de ferramentas). Depois que
um abre, os vizinhos abrem na hora enquanto o ponteiro passa por eles.

Aceita as props de `Tooltip.Provider` do Radix (https://www.radix-ui.com/primitives/docs/components/tooltip).

#### `TooltipTrigger`

Elemento que mostra a dica. Use `asChild` com um elemento focável (ex.: `Button`, `<a>`).

Aceita as props de `Tooltip.Trigger` do Radix (https://www.radix-ui.com/primitives/docs/components/tooltip).

## Utilitários

#### `cn`

Junta classes condicionais e resolve conflitos do Tailwind (a última classe vence).

```ts
cn("px-2 py-1", ativo && "bg-accent", "px-4"); // "py-1 bg-accent px-4"
```
