# SPEC — istok_ui

Fonte da verdade do projeto: objetivo, decisões, status e critérios de aceite. Quem altera uma decisão ou conclui
uma entrega atualiza este arquivo **no mesmo PR**. O fluxo de trabalho entre os agentes está em [AGENTS.md](AGENTS.md).

## 1. Objetivo e escopo

Biblioteca de componentes React + TypeScript estilizada com Tailwind CSS, compartilhada entre os projetos da Tempero
(todos em React 19 + Vite + Tailwind 4). Também será usada por agentes de IA para montar wireframes, então a API
precisa ser previsível, tipada e bem documentada.

**Faz parte do escopo**

- Componentes de UI acessíveis (WCAG AA), com variantes, tema claro/escuro e tokens trocáveis por projeto.
- Documentação viva (Storybook) e vitrine com todos os componentes (playground).
- Pacote npm ESM com tipos, publicado por CI.

**Não faz parte do escopo**

- Componentes de negócio ou de uma marca específica (a marca entra só via tokens no projeto consumidor).
- Suporte a React < 19, Tailwind < 4, CommonJS ou CSS pré-compilado para projetos sem Tailwind.
- Gerenciamento de estado global, roteamento, data fetching.
- Design no Figma (os tokens são neutros e cada projeto sobrescreve).

## 2. Stack e decisões

| Tema                 | Decisão                                                                                         | Motivo                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Stack                | React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 4                                               | Mesma stack dos projetos consumidores                                                |
| TypeScript           | 6.0 (não 7)                                                                                     | O `typescript-eslint` só suporta até a 6.0. Código testado e compatível com a 7.0    |
| Lint                 | ESLint 10 (`strictTypeChecked`, react-hooks, `eslint-plugin-jsx-a11y-x`, storybook), 0 warnings | O `eslint-plugin-jsx-a11y` original não suporta ESLint 10; o fork é do es-tooling    |
| Formatação           | Prettier padrão + ordenação de classes do Tailwind (também em `cn()`/`cva()`)                   | Padrão do time                                                                       |
| React                | `peerDependencies: ^19`, sem `forwardRef`                                                       | Projetos sempre no latest; no 19 o `ref` chega como prop                             |
| Base dos componentes | Radix UI (comportamento/a11y) + código do shadcn/ui como ponto de partida                       | O shadcn já é Radix + Tailwind + cva; partimos de código testado e com API conhecida |
| Estilos              | `theme.css` com tokens + `@source` embutido; sem CSS pré-compilado                              | Projetos já têm Tailwind; um único `@import` resolve tokens e classes da lib         |
| Tokens               | Nomes do shadcn/ui + `success`/`warning`; pares `*-foreground` com contraste WCAG AA            | Temas do shadcn funcionam direto; acessível por padrão                               |
| Build                | Só ESM, `preserveModules`, sem minificação; `.d.ts` via `tsc` (`tsconfig.build.json`)           | Tree-shaking real e código legível nos projetos                                      |
| Imports internos     | Sempre com extensão `.ts`/`.tsx`                                                                | Os `.d.ts` precisam funcionar em resolução `nodenext`; o build falha se faltar       |
| Docs                 | Storybook 10 (um componente por vez) + playground (vitrine com tudo)                            | Storybook para ajustar cada componente; playground para ver a lib inteira de uma vez |
| Testes               | Vitest 5 em browser mode (Chromium/Playwright); stories viram testes com axe                    | Navegador real, sem simular DOM; acessibilidade checada em todo PR                   |
| CI                   | GitHub Actions em todo PR e push na `main`                                                      | Mesmas verificações para todo mundo                                                  |
| Conta GitHub         | `temperopropaganda` é conta de **usuário** (não org); repo privado                              | —                                                                                    |
| Registry             | ⚠️ **Em aberto** — ver seção 7                                                                  | —                                                                                    |

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

- Componentes e `cn()` exportados por `@temperopropaganda/istok-ui` (ESM + `.d.ts`).
- `@temperopropaganda/istok-ui/theme.css`: o projeto consumidor faz `@import "tailwindcss";` e depois importa o tema.
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

| Fase | Entrega                                                   | Status         |
| ---- | --------------------------------------------------------- | -------------- |
| 1    | Ambiente (Vite, TS strict, Tailwind, ESLint, Prettier)    | ✅ Concluída   |
| 2    | Build da biblioteca (ESM, `.d.ts`, `exports`, `cn()`)     | ✅ Concluída   |
| 3    | Tokens, tema e dark mode (`theme.css`)                    | ✅ Concluída   |
| —    | Ambiente do editor (`.vscode/`, `npm run check`)          | ✅ Concluída   |
| 4    | Storybook, testes no navegador, teste de consumo, CI      | ✅ Concluída   |
| —    | Fluxo de agentes (este SPEC + AGENTS.md)                  | 🔄 Em revisão  |
| 5    | Button + playground como vitrine + testes E2E             | ⏭️ **Próxima** |
| 6    | Componentes da v0.1                                       | Pendente       |
| 7    | Testes finais (cobertura, cross-browser, tamanho)         | Pendente       |
| 8    | Release (publicação, Storybook online, guia para agentes) | Pendente       |

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

### ⏭️ Próxima entrega — Fase 5: Button, vitrine e E2E

> Rascunho de escopo. O **Software Engineer** detalha os critérios de aceite antes de liberar para o Developer.

1. **Button** (`src/components/button/`), partindo do Button do shadcn:
   - Dependências novas: `radix-ui` (Slot para `asChild`) e `class-variance-authority`.
   - Variantes: `default`, `secondary`, `outline`, `ghost`, `link`, `destructive`.
   - Tamanhos: `sm`, `md` (padrão), `lg`, `icon`.
   - `asChild` para renderizar como `<a>`/`Link` mantendo o visual.
   - Segue o checklist da seção 6 à risca: vira o molde dos próximos componentes.
2. **Playground como vitrine:** reorganizar `playground/` numa página com uma seção por componente mostrando todas as
   variações e estados, com alternância claro/escuro. A página de tokens atual vira a primeira seção.
3. **Testes E2E:** configurar Playwright Test (`e2e/`, `npm run test:e2e`) rodando contra o playground, e adicionar ao
   CI. Primeiro fluxo: Button em todas as variantes, clique, teclado (Tab/Enter/Espaço), `disabled`, tema escuro,
   console sem erros.
4. Atualizar este SPEC (status) e o README.

### Pendente

- **Fase 6 — Componentes da v0.1** (um PR por grupo, partindo do shadcn quando houver equivalente):

  | Grupo      | Componentes                                                  |
  | ---------- | ------------------------------------------------------------ |
  | Formulário | Input, Textarea, Label, Field, Checkbox, RadioGroup, Switch  |
  | Feedback   | Alert, Badge, Spinner, Skeleton                              |
  | Exibição   | Card, Avatar, Separator                                      |
  | Overlay    | Dialog, Tooltip                                              |
  | Ações      | IconButton (se não for coberto pelo `size="icon"` do Button) |

- **Fase 7 — Testes finais:** cobertura mínima global de 80% como threshold no Vitest; Firefox e WebKit no browser
  mode; `size-limit` por componente; auditoria manual de teclado e leitor de tela (Orca) nos overlays; regressão
  visual opcional.
- **Fase 8 — Release:** Changesets (versão + CHANGELOG); workflow de publicação; Storybook online; guia de uso para
  agentes dentro do pacote (componentes, props, exemplos); publicar `v0.1.0` e usar num projeto real.

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
9. Nenhuma dependência nova sem justificativa na seção 2; nada de `.maestri/`, `TASKS.md` ou `REVIEW.md` no PR.
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

| Decisão                 | Opções                                                                                                                                      | Recomendação                                                                                              | Dono   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------ |
| Registry e visibilidade | (a) GitHub Packages `@temperopropaganda/istok-ui`, repo privado, token para instalar; (b) npm público `istok-ui` (nome livre), repo público | **(b)**: instala sem token, Storybook grátis no GitHub Pages, CI ilimitado. O usuário aceitou ser público | Humano |
| Hospedagem do Storybook | GitHub Pages (exige repo público ou GitHub Pro); Vercel/Netlify/Chromatic (grátis, serviço externo)                                         | Depende da decisão acima                                                                                  | Humano |

Enquanto não houver decisão, o pacote continua como `@temperopropaganda/istok-ui` com `publishConfig` no GitHub
Packages. Nada é publicado antes da Fase 8.
