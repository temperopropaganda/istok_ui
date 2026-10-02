# Roadmap da istok_ui

Plano vivo: atualize este arquivo no mesmo PR quando uma fase terminar ou uma decisão mudar.

## Decisões

| Tema                 | Decisão                                                                               | Motivo                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Stack                | React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 4                                     | Mesma stack dos projetos que vão consumir a lib                                         |
| TypeScript           | 6.0 (não 7)                                                                           | O `typescript-eslint` ainda só suporta até a 6.0. Testado e compatível com a 7.0        |
| Lint                 | ESLint 10 (`strictTypeChecked`, react-hooks, `eslint-plugin-jsx-a11y-x`)              | O `eslint-plugin-jsx-a11y` original não suporta ESLint 10; o fork é do es-tooling       |
| Formatação           | Prettier com o padrão dele + ordenação de classes do Tailwind                         | Padrão do time                                                                          |
| React                | `peerDependencies: ^19`, sem `forwardRef`                                             | Projetos sempre no latest; no 19 o `ref` chega como prop                                |
| Base dos componentes | Radix UI (comportamento/a11y) + código do shadcn/ui como ponto de partida             | O shadcn já é Radix + Tailwind + cva; partimos de código testado e com API conhecida    |
| Estilos              | `theme.css` com tokens + `@source` embutido; sem CSS pré-compilado                    | Projetos já têm Tailwind; um único `@import` resolve tokens e classes da lib            |
| Tokens               | Nomes do shadcn/ui + `success`/`warning`; pares `*-foreground` com contraste WCAG AA  | Temas do shadcn funcionam direto; acessível por padrão                                  |
| Build                | Só ESM, `preserveModules`, sem minificação; `.d.ts` via `tsc` (`tsconfig.build.json`) | Tree-shaking real e código legível nos projetos                                         |
| Imports internos     | Sempre com extensão `.ts`/`.tsx`                                                      | Necessário para os `.d.ts` funcionarem em resolução `nodenext`; o build falha se faltar |
| Registry             | GitHub Packages, `@temperopropaganda/istok-ui`                                        | Gratuito, privado, uso interno                                                          |
| Docs e testes        | Storybook                                                                             | Ambiente de desenvolvimento + documentação viva + stories como testes                   |
| Design               | Sem Figma; tokens neutros                                                             | Os wireframes serão montados consumindo a própria lib                                   |

## Fases

### ✅ Fase 1 — Ambiente

Vite, TypeScript strict, Tailwind 4, ESLint, Prettier, EditorConfig, `.nvmrc`. Playground em `playground/` para testes rápidos.

### ✅ Fase 2 — Build da biblioteca

Pacote `@temperopropaganda/istok-ui`, build ESM com `preserveModules`, `.d.ts`, `exports`, `peerDependencies`, `cn()`, validação com publint + arethetypeswrong.

### ✅ Fase 3 — Tokens e tema

`theme.css` com cores, raio, dark mode (classe `dark`) e `@source` embutido. Página de tokens no playground.

### ✅ Ajuste — Ambiente do editor

`.vscode/` com TypeScript do projeto, Prettier como formatador único e CSS em modo Tailwind. Lint falha com qualquer warning. Script `npm run check` roda todas as verificações.

### Fase 4 — Storybook, testes e CI

- Storybook 10 (`@storybook/react-vite`) com addons de docs, a11y, themes (alternar claro/escuro) e Vitest.
- Página de tokens migra do playground para o Storybook (`docs/tokens.mdx`).
- Vitest em **browser mode** (Chromium via Playwright) para tudo: testes de componente e stories rodam num navegador real, sem polyfills de jsdom que os componentes Radix exigiriam.
- Testing Library + user-event; checagem de a11y (axe) em todas as stories.
- **Teste de consumo automatizado** (antes era da Fase 7): `examples/consumer-app` instala o tarball e builda. Fizemos isso manualmente nas Fases 2 e 3; vira script e roda no CI.
- **CI no GitHub Actions** em todo PR: `npm run check` + testes + teste de consumo.
- Pronto quando: um componente de exemplo tem story + teste, e o CI roda verde no PR.

### Fase 5 — Button (componente de referência)

- Dependências: `radix-ui` e `class-variance-authority`.
- Parte do Button do shadcn e adapta: variantes (`default`, `secondary`, `outline`, `ghost`, `link`, `destructive`), tamanhos (`sm`, `md`, `lg`, `icon`), `asChild`.
- Segue o checklist abaixo à risca e vira o molde dos próximos. Revisão conjunta do padrão antes de escalar.

### Fase 6 — Componentes da v0.1

Um PR por grupo, todos partindo do shadcn quando existir equivalente:

| Grupo      | Componentes                                                  |
| ---------- | ------------------------------------------------------------ |
| Formulário | Input, Textarea, Label, Field, Checkbox, RadioGroup, Switch  |
| Feedback   | Alert, Badge, Spinner, Skeleton                              |
| Exibição   | Card, Avatar, Separator                                      |
| Overlay    | Dialog, Tooltip                                              |
| Ações      | IconButton (se não for coberto pelo `size="icon"` do Button) |

### Fase 7 — Testes finais

- Cobertura mínima de 80%.
- Cross-browser: adicionar Firefox e WebKit ao Vitest browser mode.
- Limite de tamanho por componente com `size-limit`.
- Auditoria manual de teclado e leitor de tela (Orca) nos overlays.
- (Opcional) regressão visual com screenshots.

### Fase 8 — Release

- Changesets para versão e CHANGELOG.
- Workflow de release publicando no GitHub Packages (`GITHUB_TOKEN` com `packages: write`).
- **Guia de uso para agentes** dentro do pacote (lista de componentes, props e exemplos), para montar wireframes lendo direto do `node_modules`.
- Hospedagem do Storybook: GitHub Pages em repositório privado exige plano pago da org. Alternativas: Chromatic (plano gratuito com acesso restrito) ou Storybook rodando local.
- Publicar `v0.1.0` e usar num projeto real.

## Checklist de componente pronto

- [ ] Parte do componente do shadcn quando existir; adaptado aos nossos tokens
- [ ] Props estendem as do elemento nativo; `className` mesclado com `cn()`
- [ ] Variantes com `cva` e valores padrão
- [ ] Classes do Tailwind sempre literais (nada de `bg-${cor}`)
- [ ] Imports internos com extensão `.ts`/`.tsx`
- [ ] `ref` funcionando
- [ ] Teclado e ARIA seguindo o WAI-ARIA APG
- [ ] Estados: hover, `focus-visible`, disabled (e invalid/loading quando fizer sentido)
- [ ] Funciona em claro e escuro
- [ ] JSDoc nas props (aparece no editor, no Storybook e no guia para agentes)
- [ ] Story com todas as variantes + autodocs
- [ ] Testes de comportamento e a11y passando
- [ ] Exportado em `src/index.ts`
