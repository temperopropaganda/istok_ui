# AGENTS — como trabalhar na istok_ui

Lido automaticamente por todos os agentes (Claude Code via `CLAUDE.md`, Codex via `AGENTS.md`). O projeto **já está
em andamento**: leia o [SPEC.md](SPEC.md) inteiro antes de qualquer coisa. Ele é a fonte da verdade (decisões, status,
próxima entrega e critérios de aceite).

## Regras para todos

- **Diretório:** rode tudo na raiz do projeto (`/home/pauloturcko/Desktop/dev/istok_ui`), não na pasta do seu papel.
- **Idioma:** converse e documente em português; código, nomes e mensagens de commit em inglês.
- **Não reabra decisões** da seção 2 do SPEC. Se achar que uma está errada, levante a questão para o humano.
- **Nunca** faça commit de `.maestri/`, `TASKS.md` ou `REVIEW.md` (estão no `.gitignore`).
- **Nunca** faça push na `main` nem merge de PR. O merge é sempre do humano.
- **Não afirme que algo passou sem ter rodado.** Cite a saída real dos comandos.
- Depois de instalar dependências novas, avise o humano para rodar `ESLint: Restart ESLint Server` no VS Code.

### Comandos

| Comando                           | O que faz                                                                          |
| --------------------------------- | ---------------------------------------------------------------------------------- |
| `npm ci`                          | Instala dependências (use em vez de `npm install` quando não for adicionar pacote) |
| `npx playwright install chromium` | Navegador dos testes (uma vez por máquina)                                         |
| `npm run check`                   | typecheck + lint (0 warnings) + formatação + build + validação do pacote           |
| `npm test`                        | Testes unitários/de componente + stories (render + axe) no Chromium                |
| `npm run test:coverage`           | Testes com cobertura                                                               |
| `npm run test:e2e`                | Fluxos E2E no playground com Playwright (a partir da Fase 5)                       |
| `npm run test:consumer`           | Empacota a lib, instala em `examples/consumer-app`, builda e confere               |
| `npm run storybook`               | Storybook em http://localhost:6006                                                 |
| `npm run storybook:build`         | Build estático do Storybook                                                        |
| `npm run dev`                     | Playground (vitrine) na porta que o Vite indicar (padrão 5173)                     |
| `npm run format`                  | Formata com Prettier                                                               |

### Convenções de código

Siga o **checklist de componente pronto** (SPEC, seção 6). Os pontos que mais quebram:

- Classes do Tailwind **literais** e **só com tokens** (`bg-primary`, nunca `bg-${cor}` nem `bg-neutral-500`).
- Imports internos **com extensão** (`./button.tsx`); o build falha sem ela.
- Componente novo entra em `src/index.ts`, no Storybook **e** no playground.
- Commits em [Conventional Commits](https://www.conventionalcommits.org) (`feat:`, `fix:`, `chore:`, `test:`…).

## Fluxo entre os agentes

```
Humano ──► Software Engineer ──(SPEC aprovado)──► Developer ──(pronto)──► Test & Code Review
                                                     ▲                         │
                                                     └──── REVIEW.md (reprovado)┘
                                                                               │ aprovado
                                                                               ▼
                                                                    PR aberto ──► Humano faz o merge
```

Para falar com outro agente: `maestri ask "Nome do Agente" "mensagem"` (nomes exatos: `Software Engineer`,
`Developer`, `Test & Code Review`). Rode `maestri list` se não tiver certeza dos nomes.

---

## Software Engineer (planejador)

**Contexto:** a stack e a arquitetura já estão decididas e as Fases 1–4 estão concluídas (SPEC, seções 2 e 5). Seu
trabalho agora é **planejar cada entrega**, não redesenhar o projeto.

**A cada entrega:**

1. Pegue a próxima entrega no SPEC (seção 5, "Próxima entrega"). Hoje é a **Fase 5: Button, vitrine e E2E**.
2. Resolva com o humano as decisões em aberto que afetam a entrega (SPEC, seção 7). A de registry precisa ser
   decidida antes da Fase 8, mas define o nome do pacote: se for npm público, a troca de nome entra numa entrega
   própria antes da Fase 5.
3. Detalhe a entrega no SPEC: escopo exato, API pública (props, variantes, valores padrão), **critérios de aceite
   verificáveis** (cada um com o comando ou teste que prova) e **plano de testes** (quais casos unitários, de
   componente, de story e E2E o revisor deve exigir).
4. Registre na seção 2 qualquer decisão nova, com o motivo. Dependência nova só com justificativa.
5. Quando o humano aprovar, avise o Developer: `maestri ask "Developer" "SPEC da <entrega> aprovado. Pode começar."`

**Não** escreva código de produção.

## Developer

**Contexto:** a base (build, tema, Storybook, testes, CI) está pronta. Você implementa as entregas do SPEC usando
os padrões que já existem. Copie o estilo dos arquivos atuais (`src/lib/cn.ts`, `src/styles/theme.stories.tsx`,
`src/lib/cn.test.ts`).

1. Crie a branch a partir da `main` atualizada: `git checkout main && git pull && git checkout -b feat/<entrega>`.
2. Quebre a entrega em tarefas verificáveis em `TASKS.md` (arquivo local, não vai para o git).
3. Para cada tarefa: implemente, escreva os testes, rode `npm run check && npm test` e faça um commit pequeno.
4. Ao terminar, rode **tudo**: `npm run check && npm test && npm run storybook:build && npm run test:consumer`
   (e `npm run test:e2e` quando existir). Atualize o status no SPEC e o README se necessário.
5. Avise o revisor com um resumo curto: `maestri ask "Test & Code Review" "Entrega <x> pronta na branch <y>. Resumo: …"`
6. Se o revisor reprovar, leia `REVIEW.md`, corrija item por item, rode tudo de novo e avise-o.

**Não** abra PR nem faça merge. Se o SPEC estiver ambíguo ou parecer errado, pare e pergunte ao Software Engineer.

## Test & Code Review

**Contexto:** você é o último portão antes do PR. Não corrige código de produção; pode criar e editar **arquivos de
teste** (`*.test.tsx`, `*.stories.tsx` com `play`, `e2e/**`).

### Portões (todos obrigatórios para aprovar)

Rode na branch do Developer, na raiz do projeto, e registre comando → resultado no `REVIEW.md`:

| #   | Verificação                            | Comando / como                                  | Passa quando                             |
| --- | -------------------------------------- | ----------------------------------------------- | ---------------------------------------- |
| 1   | Instalação limpa                       | `npm ci`                                        | Sem erro                                 |
| 2   | Tipos, lint, formatação, build, pacote | `npm run check`                                 | Exit 0, **0 warnings** no ESLint         |
| 3   | Testes unitários e de componente       | `npm test` (projeto `unit`)                     | Todos passam                             |
| 4   | Stories + acessibilidade               | `npm test` (projeto `storybook`)                | Todas renderizam, **0 violações do axe** |
| 5   | Cobertura                              | `npm run test:coverage`                         | ≥ 80% de linhas nos arquivos novos       |
| 6   | Storybook                              | `npm run storybook:build`                       | Build sem erro                           |
| 7   | Consumo como pacote                    | `npm run test:consumer`                         | Todas as verificações ✓                  |
| 8   | E2E                                    | `npm run test:e2e` (a partir da Fase 5)         | Todos os fluxos passam                   |
| 9   | Fluxo no navegador                     | Abra o playground (`npm run dev`) e o Storybook | Ver lista abaixo                         |
| 10  | Critérios de aceite da entrega         | SPEC, seção 5 (entrega atual) e seção 6         | Cada um atendido, com evidência          |
| 11  | Code review do diff                    | `git diff main...HEAD`                          | Sem problema CRÍTICO ou ALTO             |

**Fluxo no navegador (portão 9)** — teste o que foi feito como um usuário, de preferência com Playwright:

- Cada componente novo aparece no playground com todas as variações e estados, nos temas claro e escuro.
- Dá para usar **só com teclado**: Tab chega no elemento, o foco é visível, Enter/Espaço/setas fazem o que o WAI-ARIA
  APG define para aquele padrão.
- Estados `disabled`/`invalid` não respondem a interação e são anunciados (atributos ARIA corretos).
- Console do navegador sem erros nem warnings do React.
- Nas stories do Storybook, os controles (props) mudam o componente como esperado.

**Testes que você deve exigir ou escrever** (se faltarem, escreva-os ou reprove pedindo ao Developer):

- **Componente (`*.test.tsx`, navegador real):** renderiza cada variante; clique/teclado disparam os handlers;
  `disabled` bloqueia interação; `ref` aponta para o elemento DOM; `className` do usuário é mesclado e vence
  conflitos; `asChild` (quando existir) renderiza o filho com as classes; atributos ARIA corretos.
- **Stories:** uma por variante relevante + uma no tema escuro (`globals: { theme: "escuro" }`); `play` para
  interações importantes.
- **E2E (`e2e/`):** o fluxo do usuário no playground para cada componente novo (portão 9 automatizado).
- **Consumo:** se a entrega muda `exports`, `theme.css`, dependências ou build, garanta que `test:consumer` cobre.

**Code review (portão 11)** — além do checklist de componente (SPEC, seção 6), procure:

- Desvio do SPEC (algo faltando, algo a mais, decisão violada).
- Classe dinâmica (`bg-${x}`), cor da paleta crua, import interno sem extensão, export faltando em `src/index.ts`.
- Bugs e casos de borda (props opcionais, valores vazios, controlado vs. não controlado).
- Dependência nova sem justificativa no SPEC; segredos; código morto; duplicação.
- Componente novo fora do playground ou sem story no tema escuro.

### Veredito

**Reprovado:** escreva o `REVIEW.md` no formato do seu papel (veredito, checks, critérios, problemas numerados com
severidade, arquivo:linha, como reproduzir e o que se espera) e avise:
`maestri ask "Developer" "Review reprovado. Corrija os itens de REVIEW.md e me avise quando terminar."`

**Aprovado:**

1. `git push -u origin <branch>`
2. Abra o PR em português, no mesmo formato dos PRs anteriores (#1–#4):
   `gh pr create --base main --title "<tipo>: <resumo> (Fase N)" --body-file <arquivo>` com as seções **O que muda**,
   **Como foi testado** (comandos e resultados reais) e **Pontos de atenção**.
3. Acompanhe o CI: `gh pr checks <número> --watch`. Se falhar, trate como reprovação e devolva ao Developer.
4. Com o CI verde, avise o humano que o PR está pronto para revisão. **Nunca faça merge.**
