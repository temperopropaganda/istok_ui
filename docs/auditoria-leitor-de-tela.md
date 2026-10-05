# Auditoria com leitor de tela (Orca)

Roteiro manual da Fase 7. O axe e os testes automáticos conferem atributos ARIA, foco e contraste, mas não o que
um leitor de tela realmente fala. Aqui uma pessoa usa a vitrine só com teclado e o Orca ligado e anota o resultado.

O texto exato do Orca muda entre versões. Avalie se a **informação** chega (nome, papel, estado, descrição), não as
palavras exatas.

## Preparação

1. Rode a vitrine: `npm run dev` e abra o endereço que o Vite indicar (padrão http://localhost:5173) no
   **Firefox**, o navegador com melhor suporte no Orca.
2. Ligue o Orca: **Super + Alt + S** (ou Configurações → Acessibilidade → Leitor de tela). A mesma tecla desliga.
3. Use só o teclado. `Tab`/`Shift+Tab` andam pelos controles; o Orca alterna entre modo de navegação e modo de
   foco com **Orca + A** (a tecla Orca é `Insert`, ou `Caps Lock` no layout de notebook). Nos testes abaixo, fique
   no modo de foco (só `Tab`, setas, `Espaço`, `Enter`, `Esc`).
4. Para pular até uma seção, use o menu "Seções" no topo da página (`Tab` até o link e `Enter`).

## Como registrar

Preencha a coluna **Resultado** com ✅ (como esperado) ou ❌ (diferente), e no ❌ escreva o que o Orca falou ou o que
aconteceu. Depois, mande a tabela (ou só as linhas com ❌) para corrigirmos.

## Roteiro

### 1. Button com loading e Alert (seção "Alert", exemplo "Depois de uma ação")

| #   | Passos                                | O que esperar                                                                                   | Resultado |
| --- | ------------------------------------- | ----------------------------------------------------------------------------------------------- | --------- |
| 1.1 | `Tab` até "Enviar pedido"             | "Enviar pedido, botão"                                                                          |           |
| 1.2 | `Enter`                               | O foco fica no botão. Logo depois, o Orca anuncia o alerta: "Pedido enviado. Você vai receber…" |           |
| 1.3 | `Tab` até "Enviar com erro" e `Enter` | O Orca interrompe e anuncia na hora: "Não foi possível enviar. Verifique a conexão…"            |           |

### 2. Dialog (seção "Dialog", exemplo "Com formulário")

| #   | Passos                                                                         | O que esperar                                                                                  | Resultado |
| --- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | --------- |
| 2.1 | `Tab` até "Editar perfil" e `Enter`                                            | "Editar perfil, diálogo", a descrição "As mudanças aparecem para todo o time" e o campo "Nome" |           |
| 2.2 | `Tab` várias vezes                                                             | Passa por Nome → Cancelar → Salvar → Fechar e volta para Nome, sem sair do modal               |           |
| 2.3 | Com o Orca, tente ler a página atrás (modo de navegação, **Orca + A** e setas) | Só o conteúdo do modal é lido                                                                  |           |
| 2.4 | `Esc`                                                                          | O modal fecha e o foco volta: "Editar perfil, botão"                                           |           |

### 3. AlertDialog (seção "AlertDialog")

| #   | Passos                                     | O que esperar                                                                                  | Resultado |
| --- | ------------------------------------------ | ---------------------------------------------------------------------------------------------- | --------- |
| 3.1 | `Tab` até "Excluir projeto" e `Enter`      | "Excluir o projeto?, alerta" (ou diálogo de alerta), a descrição e o foco em "Cancelar, botão" |           |
| 3.2 | `Esc`                                      | Fecha sem excluir; o foco volta para "Excluir projeto"                                         |           |
| 3.3 | Abra de novo, `Tab` até "Excluir", `Enter` | O botão vira "Excluindo…"; depois o modal fecha e o foco volta para "Excluir projeto"          |           |

### 4. Tooltip (seção "Tooltip")

| #   | Passos                              | O que esperar                                                            | Resultado |
| --- | ----------------------------------- | ------------------------------------------------------------------------ | --------- |
| 4.1 | `Tab` até o primeiro botão da barra | "Negrito, botão" e, em seguida, a dica "Negrito (Ctrl+B)" como descrição |           |
| 4.2 | `Esc`                               | A dica some e o foco continua em "Negrito"                               |           |
| 4.3 | `Tab` até "Itálico"                 | "Itálico, botão" e a dica "Itálico (Ctrl+I)"                             |           |

### 5. Formulário (seção "Field", exemplo "Formulário de cadastro")

| #   | Passos                                            | O que esperar                                                                                       | Resultado |
| --- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------- |
| 5.1 | `Tab` até "Criar conta" e `Enter`, com tudo vazio | O foco vai para "Nome": "Nome, campo de texto, obrigatório, inválido" e "Informe seu nome."         |           |
| 5.2 | `Tab` até "E-mail"                                | "E-mail, obrigatório, inválido" e "Usado só para enviar a confirmação. Informe seu e-mail."         |           |
| 5.3 | `Tab` até o grupo "Plano"                         | "Plano, obrigatório, inválido", "Mensal, botão de opção, não marcado, 1 de 2" e "Escolha um plano." |           |
| 5.4 | Seta para baixo                                   | "Anual, marcado, 2 de 2"                                                                            |           |
| 5.5 | `Tab` até o switch, `Espaço`                      | "Receber novidades por e-mail, alternância (interruptor), desligado" → "ligado"                     |           |
| 5.6 | `Tab` até o checkbox, `Espaço`                    | "Aceito os termos de uso, caixa de seleção, obrigatório, não marcada" → "marcada"                   |           |

### 6. Checkbox e RadioGroup (seções "Checkbox" e "RadioGroup")

| #   | Passos                                                               | O que esperar                                                                     | Resultado |
| --- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------- |
| 6.1 | Em "Selecionar todos", `Tab` até "Selecionar todas"                  | "Selecionar todas, caixa de seleção, parcialmente marcada"                        |           |
| 6.2 | `Espaço`                                                             | "marcada"; os itens abaixo também ficam marcados                                  |           |
| 6.3 | Em RadioGroup → "Horizontal", `Tab` até "M" e depois **`Shift+Tab`** | O foco **sai** do grupo e vai para "Anual" (grupo "Plano" acima). Não pode travar |           |

O item 6.3 vale também sem o Orca: os testes automáticos não conseguem conferir esse caso no Firefox (veja o
comentário em `e2e/forms.spec.ts`).

### 7. Redução de movimento (sem o Orca)

Ligue Configurações → Acessibilidade → **Reduzir animações** e recarregue a vitrine.

| #   | Passos                      | O que esperar                                       | Resultado |
| --- | --------------------------- | --------------------------------------------------- | --------- |
| 7.1 | Abra e feche um Dialog      | Aparece e some sem animação                         |           |
| 7.2 | Veja o Spinner e o Skeleton | O Spinner gira mais devagar; o Skeleton fica parado |           |

## Resultado da última auditoria

Ainda não executada.
