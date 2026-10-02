# istok_ui

Biblioteca de componentes React + TypeScript, estilizada com Tailwind CSS.

## Usando nos projetos

O pacote é publicado no GitHub Packages como `@temperopropaganda/istok-ui` (uso interno).

1. Gere um token do GitHub com o escopo `read:packages` e exporte como `GITHUB_TOKEN`.
2. Crie um `.npmrc` na raiz do projeto:

   ```
   @temperopropaganda:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```

3. Instale:

   ```bash
   npm install @temperopropaganda/istok-ui
   ```

4. Importe o tema no CSS principal do projeto, logo depois do Tailwind:

   ```css
   @import "tailwindcss";
   @import "@temperopropaganda/istok-ui/theme.css";
   ```

   Só isso: o `theme.css` já faz o Tailwind do projeto gerar as classes usadas pelos componentes.

Requer React 19 e Tailwind CSS 4 no projeto.

### Tema

Os tokens viram utilitários do Tailwind: `bg-primary`, `text-muted-foreground`, `border-border`, `rounded-lg`…

| Token                               | Uso                                        |
| ----------------------------------- | ------------------------------------------ |
| `background` / `foreground`         | Fundo e texto da página                    |
| `card`, `popover`                   | Superfícies (cartões, menus, modais)       |
| `primary`                           | Ação principal                             |
| `secondary`, `accent`, `muted`      | Ações secundárias, hover e textos de apoio |
| `destructive`, `success`, `warning` | Erro, sucesso e alerta                     |
| `border`, `input`, `ring`           | Bordas, campos e anel de foco              |
| `--radius`                          | Raio base (`rounded-sm` … `rounded-xl`)    |

Cada cor de fundo tem um par `*-foreground` para o texto por cima, com contraste WCAG AA garantido.

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
npm run dev
```

O `dev` abre o playground (`playground/`), um app de teste rápido que usa os componentes direto de `src/`.

### VS Code

O repositório já traz as configurações em `.vscode/`. Ao abrir o projeto:

1. Instale as extensões recomendadas (ESLint, Prettier, Tailwind CSS IntelliSense, EditorConfig).
2. Aceite usar a versão do TypeScript do workspace quando o VS Code perguntar (ou `TypeScript: Select TypeScript Version` → `Use Workspace Version`).

### Scripts

| Script                 | O que faz                                                             |
| ---------------------- | --------------------------------------------------------------------- |
| `npm run dev`          | Sobe o playground com hot reload                                      |
| `npm run build`        | Checa os tipos e gera a biblioteca (JS + `.d.ts`) em `dist/`          |
| `npm run typecheck`    | Checa os tipos com o TypeScript                                       |
| `npm run lint`         | Roda o ESLint (`lint:fix` corrige o que for possível)                 |
| `npm run lint:package` | Valida o pacote publicado (publint + arethetypeswrong)                |
| `npm run format`       | Formata o código com o Prettier                                       |
| `npm run format:check` | Verifica a formatação sem alterar arquivos                            |
| `npm run check`        | Roda todas as verificações acima + build (o mesmo que o CI vai rodar) |

### Estrutura

```
src/          código da biblioteca (src/index.ts é a API pública)
src/styles/   theme.css com os tokens (publicado cru em dist/theme.css)
playground/   app de desenvolvimento, não vai pro pacote publicado
docs/         roadmap e decisões do projeto (docs/roadmap.md)
```
