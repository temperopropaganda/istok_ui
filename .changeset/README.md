# Changesets

Cada PR que muda o pacote publicado (componentes, `theme.css`, tipos, `exports`) traz um arquivo aqui dizendo o
que muda e o tipo de versão. Crie com:

```bash
npx changeset
```

- **patch** (0.1.0 → 0.1.1): correção sem mudar a API.
- **minor** (0.1.0 → 0.2.0): componente ou prop nova. Enquanto a lib estiver em 0.x, mudança que quebra também é
  minor (com "Quebra:" no texto).
- **major**: só a partir da 1.0.

Ao entrar na `main`, o workflow `release.yml` abre (ou atualiza) o PR "Version Packages", que junta os changesets,
sobe a versão e escreve o `CHANGELOG.md`. **Mergear esse PR publica no npm.** Veja `docs/publicacao.md`.
