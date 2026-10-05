# Publicação

Como o `istok-ui` chega ao npm e o site (Storybook + playground) ao GitHub Pages. A configuração inicial é feita uma
vez por uma pessoa com acesso ao repositório e à conta do npm; depois, tudo sai pelo CI.

## Como funciona

- **Changesets:** cada PR que muda o pacote traz um arquivo em `.changeset/` (`npx changeset`) dizendo o que
  muda e se é patch ou minor.
- **Workflow `release.yml`** (a cada push na `main`):
  - Com changesets pendentes, abre ou atualiza o PR **"chore: version packages"**, que sobe a versão, escreve o
    `CHANGELOG.md` e regera o guia para agentes.
  - Quando esse PR é mergeado, roda o `npm run check`, empacota e **publica no npm** por _trusted publishing_
    (OIDC: sem token salvo no GitHub), com _provenance_, e cria a tag e a GitHub Release.
- **Workflow `pages.yml`** (a cada push na `main`): publica o Storybook em
  https://temperopropaganda.github.io/istok_ui/ e o playground em
  https://temperopropaganda.github.io/istok_ui/playground/.

**Mergear o PR de versão é o que publica.** Até lá, nada vai para o npm.

## Configuração inicial (uma vez)

### 1. GitHub

Em **Settings** do repositório:

1. **Actions → General → Workflow permissions:** marque _Allow GitHub Actions to create and approve pull requests_
   (para o workflow abrir o PR de versão).
2. **Pages → Build and deployment → Source:** escolha **GitHub Actions**.

### 2. Primeira publicação no npm (manual)

O npm só deixa configurar o trusted publishing num pacote que já existe. Por isso, a primeira versão sai da sua
máquina. Ela também reserva o nome `istok-ui`.

```bash
git switch main && git pull
npm ci
npm run check
npm login --auth-type=web
npm publish --access public
```

Isso publica o que está na `main` com a versão do `package.json` (`0.0.0`, antes do PR de versão). Depois que a
`0.1.0` sair, marque a `0.0.0` como obsoleta:

```bash
npm deprecate istok-ui@0.0.0 "Versão de reserva do nome; use a 0.1.0 ou mais nova."
```

### 3. Trusted publisher no npmjs.com

Em https://www.npmjs.com/package/istok-ui → **Settings → Trusted Publisher → GitHub Actions**:

| Campo                | Valor               |
| -------------------- | ------------------- |
| Organization or user | `temperopropaganda` |
| Repository           | `istok_ui`          |
| Workflow filename    | `release.yml`       |
| Environment name     | `npm`               |

Recomendado, na mesma página: **Publishing access → Require two-factor authentication and disallow tokens**. Assim,
só o workflow (ou alguém com 2FA) publica.

## Publicar a v0.1.0

1. Execute o roteiro do Orca (`docs/auditoria-leitor-de-tela.md`) e corrija o que aparecer.
2. Revise o PR **"chore: version packages"** (versão `0.1.0`, `CHANGELOG.md` e guia).
3. Mergeie. O workflow `release.yml` publica no npm e cria a release `v0.1.0`.
4. Confira: `npm view istok-ui version` e o selo de _provenance_ na página do pacote.

O PR de versão é aberto pelo `GITHUB_TOKEN`, e o GitHub não dispara o CI para PRs abertos assim. Ele só muda
versão, changelog e guia, e o `release.yml` roda o `npm run check` antes de publicar. Para rodar o CI completo nele
mesmo assim, feche e reabra o PR.

## No dia a dia

```bash
npx changeset   # no PR que muda o pacote: escolha patch/minor e descreva a mudança
```

Mudança só de testes, docs ou playground não precisa de changeset.
