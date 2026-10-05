# AGENTS — como trabalhar na istok_ui

Lido automaticamente por agentes de IA (Claude Code via `CLAUDE.md`, Codex e outros via `AGENTS.md`), e útil para
qualquer pessoa no projeto. Leia o [SPEC.md](SPEC.md) antes de mudar algo: ele é a fonte da verdade (decisões,
status das fases, próxima entrega e critérios de aceite).

## Regras

- **Idioma:** converse e documente em português; código, nomes e mensagens de commit em inglês.
- **Não reabra decisões** da seção 2 do SPEC sem falar com o humano antes.
- **Trabalhe em branch** (`feat/…`, `fix/…`, `chore/…`) a partir da `main` atualizada. Nunca faça push na `main` nem
  merge de PR: o merge é sempre do humano.
- **Não afirme que algo passou sem ter rodado.** Cite a saída real dos comandos.
- Depois de instalar dependências novas, lembre o humano de rodar `ESLint: Restart ESLint Server` no VS Code.
- Ao concluir uma entrega ou mudar uma decisão, atualize o SPEC (status/decisões) e o README no mesmo PR.

## Comandos

Rode na raiz do projeto.

| Comando                           | O que faz                                                                              |
| --------------------------------- | -------------------------------------------------------------------------------------- |
| `npm ci`                          | Instala dependências (use em vez de `npm install` quando não for adicionar pacote)     |
| `npx playwright install chromium` | Navegador dos testes (uma vez por máquina); `firefox webkit` para o `test:browsers`    |
| `npm run check`                   | typecheck + lint (0 warnings) + formatação + build + tamanho + validação do pacote     |
| `npm test`                        | Testes unitários/de componente + stories (render + axe) no Chromium                    |
| `npm run test:coverage`           | Testes com cobertura (falha abaixo de 90%)                                             |
| `npm run test:e2e`                | Fluxos E2E no playground com Playwright, no Chromium                                   |
| `npm run test:browsers`           | Testes, stories e E2E no Firefox e no WebKit (roda no CI; o WebKit não abre no Fedora) |
| `npm run guide`                   | Regera `docs/guia-para-agentes.md` a partir de `src/` (tipos, JSDoc e `@example`)      |
| `npx changeset`                   | Registra a mudança do pacote no PR (patch/minor e descrição) para versão e CHANGELOG   |
| `npm run size`                    | Tamanho de cada componente contra o `.size-limit.json` (também no `check`)             |
| `npm run test:consumer`           | Empacota a lib, instala em `examples/consumer-app`, builda e confere                   |
| `npm run storybook`               | Storybook em http://localhost:6006                                                     |
| `npm run storybook:build`         | Build estático do Storybook                                                            |
| `npm run dev`                     | Playground (vitrine) na porta que o Vite indicar (padrão 5173)                         |
| `npm run format`                  | Formata com Prettier                                                                   |

## Convenções de código

Siga o **checklist de componente pronto** (SPEC, seção 6). Os pontos que mais quebram:

- Classes do Tailwind **literais** e **só com tokens** (`bg-primary`, nunca `bg-${cor}` nem `bg-neutral-500`).
- Imports internos **com extensão** (`./button.tsx`); o build falha sem ela.
- Componente novo entra em `src/index.ts`, no Storybook **e** no playground (seção em `playground/sections/`,
  entrada em `playground/pages.ts` e na lista `views` de `playground/app.tsx`).
- Copie o estilo dos arquivos existentes (`src/lib/cn.ts`, `src/lib/cn.test.ts`, `src/styles/theme.stories.tsx`).
- PR que muda o pacote publicado (componentes, `theme.css`, tipos, `exports`) inclui um changeset
  (`npx changeset`). Mudou JSDoc, props ou exports? Rode `npm run guide` e commite o guia (o `check` confere).
- Commits em [Conventional Commits](https://www.conventionalcommits.org) (`feat:`, `fix:`, `chore:`, `test:`…).
- PRs em português, com as seções **O que muda**, **Como foi testado** (comandos e resultados reais) e **Pontos de
  atenção** quando houver.

## Definição de pronto

Uma entrega só vai para PR quando tudo abaixo passa:

| #   | Verificação                                     | Como                                         | Passa quando                             |
| --- | ----------------------------------------------- | -------------------------------------------- | ---------------------------------------- |
| 1   | Tipos, lint, formatação, build, tamanho, pacote | `npm run check`                              | Exit 0, **0 warnings** no ESLint         |
| 2   | Testes unitários e de componente                | `npm test` (projeto `unit`)                  | Todos passam                             |
| 3   | Stories + acessibilidade                        | `npm test` (projeto `storybook`)             | Todas renderizam, **0 violações do axe** |
| 4   | Cobertura                                       | `npm run test:coverage`                      | Exit 0 (mínimo global de 90%)            |
| 5   | Storybook                                       | `npm run storybook:build`                    | Build sem erro                           |
| 6   | Consumo como pacote                             | `npm run test:consumer`                      | Todas as verificações ✓                  |
| 7   | E2E                                             | `npm run test:e2e` (a partir da Fase 5)      | Todos os fluxos passam                   |
| 7b  | Firefox e WebKit                                | `npm run test:browsers` (no CI)              | Testes, stories e E2E passam             |
| 8   | Fluxo no navegador                              | Playground (`npm run dev`) e Storybook       | Ver lista abaixo                         |
| 9   | Critérios de aceite                             | SPEC, seção 5 (entrega atual) e seção 6      | Cada um atendido, com evidência          |
| 10  | CI                                              | `gh pr checks <número>` depois de abrir o PR | Verde                                    |

**Fluxo no navegador** — teste o que foi feito como um usuário:

- Cada componente novo tem sua página no playground (sidebar) com todas as variações e estados, nos temas claro
  e escuro.
- Dá para usar **só com teclado**: Tab chega no elemento, o foco é visível, Enter/Espaço/setas fazem o que o WAI-ARIA
  APG define para aquele padrão.
- Estados `disabled`/`invalid` não respondem a interação e são anunciados (atributos ARIA corretos).
- Console do navegador sem erros nem warnings do React.
- Nas stories do Storybook, os controles (props) mudam o componente como esperado.

**Testes esperados para cada componente:**

- **Componente (`*.test.tsx`, navegador real):** renderiza cada variante; clique/teclado disparam os handlers;
  `disabled` bloqueia interação; `ref` aponta para o elemento DOM; `className` do usuário é mesclado e vence
  conflitos; `asChild` (quando existir) renderiza o filho com as classes; atributos ARIA corretos.
- **Stories:** uma por variante relevante + uma no tema escuro (`globals: { theme: "escuro" }`); `play` para
  interações importantes.
- **E2E (`e2e/`):** o fluxo do usuário no playground.
- **Consumo:** se a entrega muda `exports`, `theme.css`, dependências ou build, garanta que `test:consumer` cobre.

**Code review** — além do checklist de componente, procure: desvio do SPEC; classe dinâmica, cor da paleta crua,
import interno sem extensão, export faltando em `src/index.ts`; bugs e casos de borda (props opcionais, valores
vazios, controlado vs. não controlado); dependência nova sem justificativa no SPEC; segredos; código morto.
