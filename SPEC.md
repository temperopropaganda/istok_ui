# SPEC — istok_ui

Fonte da verdade do projeto: objetivo, decisões, status e critérios de aceite. Quem altera uma decisão ou conclui
uma entrega atualiza este arquivo **no mesmo PR**. Regras, comandos e definição de pronto estão em [AGENTS.md](AGENTS.md).

## 1. Objetivo e escopo

Biblioteca de componentes React + TypeScript estilizada com Tailwind CSS, compartilhada entre os projetos da Tempero
(todos em React 19 + Vite + Tailwind 4). Também será usada por agentes de IA para montar wireframes, então a API
precisa ser previsível, tipada e bem documentada.

**Faz parte do escopo**

- Componentes de UI acessíveis (WCAG AA), com variantes, tema claro/escuro e tokens trocáveis por projeto.
- Documentação viva (Storybook) e vitrine com todos os componentes (playground).
- Pacote npm público (`istok-ui`), ESM com tipos, publicado por CI.

**Não faz parte do escopo**

- Componentes de negócio ou de uma marca específica (a marca entra só via tokens no projeto consumidor).
- Suporte a React < 19, Tailwind < 4, CommonJS ou CSS pré-compilado para projetos sem Tailwind.
- Gerenciamento de estado global, roteamento, data fetching.
- Design no Figma (os tokens são neutros e cada projeto sobrescreve).

## 2. Stack e decisões

| Tema                    | Decisão                                                                                         | Motivo                                                                                                                              |
| ----------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Stack                   | React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 4                                               | Mesma stack dos projetos consumidores                                                                                               |
| TypeScript              | 6.0 (não 7)                                                                                     | O `typescript-eslint` só suporta até a 6.0. Código testado e compatível com a 7.0                                                   |
| Lint                    | ESLint 10 (`strictTypeChecked`, react-hooks, `eslint-plugin-jsx-a11y-x`, storybook), 0 warnings | O `eslint-plugin-jsx-a11y` original não suporta ESLint 10; o fork é do es-tooling                                                   |
| Formatação              | Prettier padrão + ordenação de classes do Tailwind (também em `cn()`/`cva()`)                   | Padrão do time                                                                                                                      |
| React                   | `peerDependencies: ^19`, sem `forwardRef`                                                       | Projetos sempre no latest; no 19 o `ref` chega como prop                                                                            |
| Base dos componentes    | Radix UI (comportamento/a11y) + código do shadcn/ui como ponto de partida                       | O shadcn já é Radix + Tailwind + cva; partimos de código testado e com API conhecida                                                |
| Estilos                 | `theme.css` com tokens + `@source` embutido; sem CSS pré-compilado                              | Projetos já têm Tailwind; um único `@import` resolve tokens e classes da lib                                                        |
| Tokens                  | Nomes do shadcn/ui + `success`/`warning`; pares `*-foreground` com contraste WCAG AA            | Temas do shadcn funcionam direto; acessível por padrão                                                                              |
| Build                   | Só ESM, `preserveModules`, sem minificação; `.d.ts` via `tsc` (`tsconfig.build.json`)           | Tree-shaking real e código legível nos projetos                                                                                     |
| Imports internos        | Sempre com extensão `.ts`/`.tsx`                                                                | Os `.d.ts` precisam funcionar em resolução `nodenext`; o build falha se faltar                                                      |
| Docs                    | Storybook 10 (um componente por vez) + playground (vitrine com tudo)                            | Storybook para ajustar cada componente; playground para ver a lib inteira de uma vez                                                |
| Testes                  | Vitest 5 em browser mode (Chromium/Playwright); stories viram testes com axe                    | Navegador real, sem simular DOM; acessibilidade checada em todo PR                                                                  |
| E2E                     | Playwright Test + `@axe-core/playwright` contra o playground (`e2e/`)                           | Testa a lib como o usuário usa: teclado, tema, console limpo e axe na página inteira                                                |
| Dependências de runtime | `clsx`, `tailwind-merge`, `radix-ui`, `class-variance-authority`                                | `cn()`; Radix para comportamento/a11y (`sideEffects: false`, tree-shaking verificado no `test:consumer`); variantes tipadas com cva |
| Testes de componente    | Carregam o CSS real (`tests/setup.ts`: Tailwind + tema) e dependências pré-otimizadas no Vitest | Medidas e cores batem com o que o usuário vê; sem recarga no meio da rodada no CI                                                   |
| Scripts de instalação   | `allowScripts: { esbuild: false }`                                                              | O npm 11 exige revisão; o binário do esbuild já vem por dependência opcional, então nenhum script de terceiro roda no `npm install` |
| Card                    | `CardTitle` é `<h3>` (o shadcn usa `<div>`); `asChild` em `Card` e `CardTitle`                  | Título reconhecido por leitores de tela; nível e elemento ajustáveis à página                                                       |
| Badge                   | Variantes do shadcn + `success` e `warning`                                                     | Usa os tokens que a lib já tem                                                                                                      |
| Avatar                  | Tamanhos `sm` (24px), `md` (32px, padrão), `lg` (40px); `alt` obrigatório em `AvatarImage`      | —                                                                                                                                   |
| Skeleton                | `aria-hidden` + `motion-safe:animate-pulse`                                                     | Decorativo; respeita quem pediu redução de movimento                                                                                |
| CI                      | GitHub Actions em todo PR e push na `main`                                                      | Mesmas verificações para todo mundo                                                                                                 |
| Conta GitHub            | `temperopropaganda` é conta de **usuário** (não org); repo **público** desde 2026-10-02         | CI ilimitado e Storybook grátis no GitHub Pages (Fase 8)                                                                            |
| Registry                | **npm público**, pacote `istok-ui` (decidido em 2026-10-02)                                     | Instala sem token nem `.npmrc`; o nome estava livre no npm                                                                          |

## 3. Arquitetura e estrutura

```
src/
  components/<nome>/       um componente por pasta (a partir da Fase 5)
    <nome>.tsx             componente
    <nome>.variants.ts     variantes com cva
    <nome>.test.tsx        testes de comportamento (navegador real)
    <nome>.stories.tsx     stories (docs + teste de a11y)
    index.ts               export do componente
  hooks/                   hooks compartilhados (quando surgirem)
  lib/cn.ts                junta classes e resolve conflitos do Tailwind
  styles/theme.css         tokens, dark mode, @source (publicado cru em dist/theme.css)
  styles/theme.stories.tsx Fundamentos › Tokens (contraste testado nos dois temas)
  index.ts                 API pública: só o que é exportado aqui existe para os projetos
playground/                vitrine: TODOS os componentes e variações numa página só
docs/                      páginas MDX do Storybook (Introdução)
examples/consumer-app/     app Vite + Tailwind usado pelo teste de consumo
scripts/test-consumer.mjs  empacota a lib, instala no app de exemplo e confere o build
.storybook/                configuração do Storybook
.github/workflows/ci.yml   CI
```

**API pública**

- Componentes e `cn()` exportados por `istok-ui` (ESM + `.d.ts`).
- `istok-ui/theme.css`: o projeto consumidor faz `@import "tailwindcss";` e depois `@import "istok-ui/theme.css";`.
- Dark mode pela classe `dark` no `<html>`. Marca trocada sobrescrevendo as variáveis CSS (`--primary`, `--radius`…).

**Fluxo de uma classe CSS:** o componente usa classes literais com tokens (`bg-primary`) → o build publica o JS em
`dist/` → o `theme.css` do pacote tem `@source "./**/*.js"` → o Tailwind do projeto consumidor gera essas classes.

## 4. Requisitos não funcionais

- **Acessibilidade:** WCAG AA. Todo par `x`/`x-foreground` com contraste ≥ 4.5:1 nos dois temas. Teclado e ARIA
  seguindo o WAI-ARIA APG. Zero violações do axe em todas as stories.
- **Tamanho:** só ESM, um arquivo por módulo, sem dependências de runtime além de `clsx`, `tailwind-merge` e (a partir
  da Fase 5) `radix-ui` e `class-variance-authority`. Importar um componente não pode trazer os outros.
- **Compatibilidade:** React 19, Tailwind 4, navegadores evergreen. Tipos válidos em resolução `bundler` e `nodenext`.
- **Qualidade:** `npm run check` com 0 erros e 0 warnings; CI verde em todo PR.
- **Segurança:** nenhum segredo no código; nenhuma dependência nova sem justificativa registrada aqui.

## 5. Status das fases

| Fase | Entrega                                                   | Status                                                 |
| ---- | --------------------------------------------------------- | ------------------------------------------------------ |
| 1    | Ambiente (Vite, TS strict, Tailwind, ESLint, Prettier)    | ✅ Concluída                                           |
| 2    | Build da biblioteca (ESM, `.d.ts`, `exports`, `cn()`)     | ✅ Concluída                                           |
| 3    | Tokens, tema e dark mode (`theme.css`)                    | ✅ Concluída                                           |
| —    | Ambiente do editor (`.vscode/`, `npm run check`)          | ✅ Concluída                                           |
| 4    | Storybook, testes no navegador, teste de consumo, CI      | ✅ Concluída                                           |
| —    | SPEC + AGENTS.md; pacote `istok-ui` no npm público        | ✅ Concluída                                           |
| 5    | Button + playground como vitrine + testes E2E             | ✅ Concluída                                           |
| 6    | Componentes da v0.1                                       | 🔄 Grupo 1 (Exibição) em revisão; grupos 2–4 pendentes |
| 7    | Testes finais (cobertura, cross-browser, tamanho)         | Pendente                                               |
| 8    | Release (publicação, Storybook online, guia para agentes) | Pendente                                               |

### Concluído (resumo)

- **Fase 1:** Vite 8, TypeScript 6 strict, Tailwind 4, ESLint 10, Prettier, EditorConfig, `.nvmrc` (Node 24).
- **Fase 2:** pacote ESM com `preserveModules`, `.d.ts` via `tsc` com `nodenext`, `exports`, `peerDependencies`,
  `cn()`, validação com `publint` + `arethetypeswrong` (`npm run lint:package`).
- **Fase 3:** `theme.css` com tokens semânticos, escala de raio, dark mode e `@source` embutido. Contraste AA
  calculado para todos os pares.
- **Editor:** `.vscode/` (TypeScript do workspace, Prettier único, CSS em modo Tailwind); lint falha com warning.
- **Fase 4:** Storybook 10 (Introdução + Tokens); Vitest 5 browser mode com projetos `unit` e `storybook` (axe);
  `npm run test:consumer`; CI com `check`, `test`, `storybook:build`, `test:consumer`. Descoberta: o axe não avalia
  as cores neutras da paleta crua do Tailwind, só os tokens (daí a regra "só tokens").
- **Docs e registry:** `SPEC.md` como fonte da verdade e `AGENTS.md` com regras e definição de pronto; pacote
  renomeado para `istok-ui` no npm público; repo público.
- **Fase 5:** `Button` (6 variantes, tamanhos `sm`/`md`/`lg`/`icon`, `asChild`, `type="button"` por padrão,
  JSDoc nas props); playground virou a vitrine (cabeçalho com navegação e tema escuro, uma seção por componente);
  Playwright Test com `@axe-core/playwright` (`npm run test:e2e`, no CI); `test:consumer` passou a usar o Button
  e a verificar tree-shaking do Radix.
- **Fase 6, grupo 1 (Exibição):** `Card` (peças combináveis, título `<h3>` + `asChild`), `Badge` (6 variantes,
  `asChild`), `Separator` (Radix, decorativo por padrão), `Avatar` (Radix, 3 tamanhos, fallback) e `Skeleton`
  (`aria-hidden`, respeita redução de movimento). Testes de componente passaram a carregar o CSS real;
  `test:consumer` verifica tree-shaking dos componentes da própria lib.

### ⏭️ Próxima entrega — Fase 6, grupo 2: Feedback

> Rascunho de escopo. Os critérios de aceite detalhados de cada grupo são fechados com o humano antes de começar.
> Grupo 1 (Exibição) entregue; próximo: grupo 2.

Um PR por grupo, do mais simples ao mais complexo, todos partindo do shadcn quando houver equivalente e seguindo o
padrão do Button (`src/components/button/`) e o checklist da seção 6:

| Ordem | Grupo      | Componentes                                                 | Observação                                            |
| ----- | ---------- | ----------------------------------------------------------- | ----------------------------------------------------- |
| ✅ 1  | Exibição   | Card, Badge, Separator, Avatar, Skeleton                    | Sem comportamento: consolida o padrão visual          |
| 2     | Feedback   | Alert, Spinner                                              | Spinner habilita `loading` no Button                  |
| 3     | Formulário | Label, Input, Textarea, Field, Checkbox, RadioGroup, Switch | Estados `invalid`/`disabled`, Field liga label + erro |
| 4     | Overlay    | Dialog, Tooltip                                             | Foco preso, Esc, portal: E2E obrigatório              |

### Pendente

- **Fase 7 — Testes finais:** cobertura mínima global de 80% como threshold no Vitest; Firefox e WebKit no browser
  mode; `size-limit` por componente; auditoria manual de teclado e leitor de tela (Orca) nos overlays; regressão
  visual opcional.
- **Fase 8 — Release:** Changesets (versão + CHANGELOG); workflow de publicação no npm via GitHub Actions
  (trusted publishing, sem token salvo); Storybook online; guia de uso para agentes dentro do pacote (componentes,
  props, exemplos); publicar `v0.1.0` e usar num projeto real.

## 6. Critérios de aceite

### Gerais (toda entrega)

1. `npm ci` instala sem erro.
2. `npm run check` passa: typecheck, lint com 0 warnings, formatação, build e validação do pacote.
3. `npm test` passa: testes unitários/de componente e todas as stories (render + axe).
4. `npm run storybook:build` passa.
5. `npm run test:consumer` passa.
6. `npm run test:e2e` passa (a partir da Fase 5).
7. Código novo coberto por testes (`npm run test:coverage`): ≥ 80% de linhas nos arquivos novos.
8. SPEC.md (status) e README atualizados quando a entrega muda comportamento, scripts ou decisões.
9. Nenhuma dependência nova sem justificativa na seção 2; nada de arquivos locais (`.claude/`, `.maestri/`) no PR.
10. CI verde no PR.

### Checklist de componente pronto

- [ ] Parte do componente do shadcn quando existir; adaptado aos nossos tokens
- [ ] Props estendem as do elemento nativo; `className` mesclado com `cn()`
- [ ] Variantes com `cva` e valores padrão
- [ ] Classes do Tailwind sempre literais (nada de `bg-${cor}`)
- [ ] Cores só dos tokens do tema (`bg-primary`, `text-muted-foreground`…), nunca da paleta crua (`neutral-500`)
- [ ] Imports internos com extensão `.ts`/`.tsx`
- [ ] `ref` funcionando
- [ ] Teclado e ARIA seguindo o WAI-ARIA APG
- [ ] Estados: hover, `focus-visible`, disabled (e invalid/loading quando fizer sentido)
- [ ] Funciona em claro e escuro
- [ ] JSDoc nas props (aparece no editor, no Storybook e no guia para agentes)
- [ ] Story com todas as variantes + autodocs; story no tema escuro (`globals: { theme: "escuro" }`)
- [ ] Testes de comportamento (`*.test.tsx`) e a11y das stories passando
- [ ] Adicionado ao playground com todas as variações e estados
- [ ] Coberto por pelo menos um fluxo E2E
- [ ] Exportado em `src/index.ts`

## 7. Decisões em aberto

Nenhuma decisão em aberto bloqueia a Fase 6.

| Decisão                 | Plano                                                                                       | Quando |
| ----------------------- | ------------------------------------------------------------------------------------------- | ------ |
| Hospedagem do Storybook | GitHub Pages (o repo já é público)                                                          | Fase 8 |
| Publicação no npm       | Workflow no GitHub Actions com trusted publishing (sem token salvo); conta no npm já criada | Fase 8 |

Nada é publicado antes da Fase 8; até lá o nome `istok-ui` não está reservado.
