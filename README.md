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

Requer React 19 e Tailwind CSS 4 no projeto.

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

### Scripts

| Script                 | O que faz                                                    |
| ---------------------- | ------------------------------------------------------------ |
| `npm run dev`          | Sobe o playground com hot reload                             |
| `npm run build`        | Checa os tipos e gera a biblioteca (JS + `.d.ts`) em `dist/` |
| `npm run typecheck`    | Checa os tipos com o TypeScript                              |
| `npm run lint`         | Roda o ESLint (`lint:fix` corrige o que for possível)        |
| `npm run lint:package` | Valida o pacote publicado (publint + arethetypeswrong)       |
| `npm run format`       | Formata o código com o Prettier                              |
| `npm run format:check` | Verifica a formatação sem alterar arquivos                   |

### Estrutura

```
src/          código da biblioteca (src/index.ts é a API pública)
playground/   app de desenvolvimento, não vai pro pacote publicado
```
