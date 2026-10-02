# istok_ui

Biblioteca de componentes React + TypeScript, estilizada com Tailwind CSS.

## Requisitos

- Node 24 (veja `.nvmrc`)
- npm 11

## Começando

```bash
npm install
npm run dev
```

O `dev` abre o playground (`playground/`), um app de teste rápido que usa os componentes direto de `src/`.

## Scripts

| Script                 | O que faz                                             |
| ---------------------- | ----------------------------------------------------- |
| `npm run dev`          | Sobe o playground com hot reload                      |
| `npm run build`        | Checa os tipos e gera a biblioteca em `dist/`         |
| `npm run typecheck`    | Checa os tipos com o TypeScript                       |
| `npm run lint`         | Roda o ESLint (`lint:fix` corrige o que for possível) |
| `npm run format`       | Formata o código com o Prettier                       |
| `npm run format:check` | Verifica a formatação sem alterar arquivos            |

## Estrutura

```
src/          código da biblioteca (src/index.ts é a API pública)
playground/   app de desenvolvimento, não vai pro pacote publicado
```
