# istok_ui

Biblioteca de componentes React + TypeScript, estilizada com Tailwind CSS.

- **[SPEC.md](SPEC.md):** objetivo, decisões, status das fases e critérios de aceite (fonte da verdade).
- **[AGENTS.md](AGENTS.md):** regras, comandos e convenções para agentes de IA (e pessoas) que trabalham no código.

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
npx playwright install chromium   # navegador usado pelos testes (uma vez por máquina)
npm run storybook
```

O Storybook (http://localhost:6006) é o ambiente principal: documentação, stories de cada componente e alternância entre tema claro e escuro. O `npm run dev` abre o playground (`playground/`), um app livre para testes rápidos.

### VS Code

O repositório já traz as configurações em `.vscode/`. Ao abrir o projeto:

1. Instale as extensões recomendadas (ESLint, Prettier, Tailwind CSS IntelliSense, EditorConfig, Vitest).
2. Aceite usar a versão do TypeScript do workspace quando o VS Code perguntar (ou `TypeScript: Select TypeScript Version` → `Use Workspace Version`).

### Scripts

| Script                    | O que faz                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------ |
| `npm run storybook`       | Sobe o Storybook em http://localhost:6006                                            |
| `npm run storybook:build` | Gera o Storybook estático em `storybook-static/`                                     |
| `npm run dev`             | Sobe o playground com hot reload                                                     |
| `npm run build`           | Checa os tipos e gera a biblioteca (JS + `.d.ts` + `theme.css`) em `dist/`           |
| `npm test`                | Roda os testes unitários e as stories (com checagem de acessibilidade) no Chromium   |
| `npm run test:watch`      | Testes em modo watch                                                                 |
| `npm run test:coverage`   | Testes com relatório de cobertura                                                    |
| `npm run test:consumer`   | Empacota a lib, instala em `examples/consumer-app` e confere o build                 |
| `npm run typecheck`       | Checa os tipos com o TypeScript                                                      |
| `npm run lint`            | Roda o ESLint, falhando com qualquer warning (`lint:fix` corrige o que for possível) |
| `npm run lint:package`    | Valida o pacote publicado (publint + arethetypeswrong)                               |
| `npm run format`          | Formata o código com o Prettier                                                      |
| `npm run format:check`    | Verifica a formatação sem alterar arquivos                                           |
| `npm run check`           | typecheck + lint + format:check + build + lint:package                               |

O CI (`.github/workflows/ci.yml`) roda `check`, `test`, `storybook:build` e `test:consumer` em todo PR.

### Testes

- **Unitários e de componente:** `*.test.ts(x)` ao lado do código, rodando no Chromium real via Vitest browser mode.
- **Stories:** cada story em `*.stories.tsx` vira um teste que renderiza o componente e roda o axe. Qualquer violação de acessibilidade falha o teste, inclusive contraste de cor.
- **Consumo:** `npm run test:consumer` simula um projeto real instalando o pacote.

### Estrutura

```
src/                  código da biblioteca (src/index.ts é a API pública)
src/styles/           theme.css com os tokens (publicado cru em dist/theme.css)
.storybook/           configuração do Storybook
docs/                 páginas MDX do Storybook
examples/consumer-app app de teste de consumo (usado pelo test:consumer)
scripts/              scripts de manutenção
playground/           app de desenvolvimento, não vai pro pacote publicado
```

### Problemas comuns

**O VS Code mostra erros que o `npm run lint` não mostra** (por exemplo, "Unsafe assignment of an error typed value"):
o servidor do ESLint não percebe pacotes instalados depois que ele iniciou. Rode `ESLint: Restart ESLint Server`
(ou `Developer: Reload Window`) depois de um `npm install` com dependências novas.

**Os testes não encontram o navegador:** rode `npx playwright install chromium`.
