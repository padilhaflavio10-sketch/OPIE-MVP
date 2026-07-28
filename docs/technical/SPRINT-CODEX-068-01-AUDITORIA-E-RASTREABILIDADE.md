# SPRINT-CODEX-068 — Auditoria Inicial e Matriz de Rastreabilidade

## 1. Identificação

- Repositório: `padilhaflavio10-sketch/OPIE-MVP`
- HEAD de `main` verificado na retomada: `fdb7f40ecc93f3fb9d9a6a48f6b4245a0d1c1e16`
- Branch de continuidade: `agent/sprint-codex-068-continuacao-especificacao-tecnica`
- Base da continuidade: commit final da SPRINT-CODEX-083, `bf9abd522b193aa94a86589a2ead9f07730cb946`
- Registro anterior preservado: branch `agent/sprint-codex-068-especificacao-tecnica`, commit `1fc14233623502653fbcbbc4ae8f7db26531e287`
- Publicação funcional consultada: branch `agent/sprint-codex-067b-publicacao-baseline-funcional`, commit final `84662ea7f694eaabc8d256961508827f07604a8c`
- Portão 7: fechado
- Implementação autorizada: não

## 2. Resultado da auditoria retomada

A suspensão registrada na auditoria inicial foi superada pelos atos das SPRINT-CODEX-082 e 083. Os pareceres originais dos Blocos 1 e 2 permanecem não localizados; a aprovação histórica foi comprovada e a lacuna foi regularizada institucionalmente sem reconstrução retroativa.

Foram usados como fontes:

- Blocos 3 a 9 publicados na branch da 067B;
- Bloco 10, que consolida escopo, fluxo, fórmulas, estados, critérios, backlog, testes e vocabulário;
- registro de fontes ausentes da 067B;
- Ato Institucional e matriz da 082;
- registro de reativação da 083;
- ordem original da SPRINT-CODEX-068.

Não foi identificada divergência funcional que exija nova decisão. Escolhas deste conjunto são decisões técnicas reversíveis e não criam regra de negócio.

## 3. Baseline consolidada auditada

| Tema | Regra funcional preservada | Fonte principal | Especificação técnica |
|---|---|---|---|
| Acesso | Operador Principal individual; 30 min de inatividade; nova identificação em ação excepcional | Blocos 9 e 10 | Documento 05 |
| Cadastros | Inativação, sem exclusão; receitas versionadas; unidade imutável após uso | Blocos 3 e 10 | Documentos 02 e 03 |
| Compras | Estoque só muda no recebimento; conversão e custo médio; correção compensatória | Blocos 4 e 10 | Documento 04 |
| Estoque | físico, reservado e disponível; proibição de saldo negativo; origem obrigatória | Blocos 4 e 10 | Documentos 03 e 04 |
| Pedidos | pronta-entrega, encomenda e misto; reserva; sem atendimento parcial | Blocos 6 e 10 | Documentos 03 e 04 |
| Venda | reconhecida somente na entrega ou retirada | Blocos 6, 8 e 10 | Documentos 03 e 04 |
| Produção | toda produção exige OP; reserva no início; consumo/conclusão integrais | Blocos 5 e 10 | Documentos 03 e 04 |
| Financeiro | pagamento separado de venda; estorno compensatório; caixa separado de resultado | Blocos 6, 8 e 10 | Documentos 03 e 04 |
| Reserva financeira | não é despesa; automática sobre recebimento confirmado; reversão em estorno | Blocos 8 e 10 | Documento 04 |
| Auditoria | operações concluídas imutáveis; correções por novos eventos; justificativa | Blocos 9 e 10 | Documentos 03 e 05 |
| UX | linguagem simples, filtros preservados, computador/notebook, busca global | Blocos 7 e 10 | Documento 07 (critérios) |
| Dashboard | totais detalháveis e reconciliáveis; fechamento não bloqueia o dia | Blocos 8 e 10 | Documentos 04 e 07 |
| Backup | portão técnico obrigatório com restauração comprovada | Bloco 10 | Documento 06 |

## 4. Rastreabilidade dos 30 entregáveis

| # | Entregável | Localização |
|---:|---|---|
| 1 | Relatório de auditoria inicial | Este documento |
| 2 | Matriz funcional-técnica | Este documento |
| 3–7 | Arquitetura, componentes, domínio, dados e entidades | Documento 02 |
| 8–9 | Estados, transições e invariantes | Documento 03 |
| 10–14 | Estoque, produção, pedidos, financeiro e reserva | Documento 04 |
| 15 | Auditoria | Documento 05 |
| 16–17 | Transações críticas e idempotência | Documento 03 |
| 18 | Central de Pendências | Documento 04 |
| 19 | Segurança | Documento 05 |
| 20–22 | Backup, restauração e falhas | Documento 06 |
| 23–25 | Estratégia, casos de teste e cenário ponta a ponta | Documento 07 |
| 26–27 | Implementação futura, instalação e atualização | Documento 08 |
| 28–30 | Riscos, decisões e recomendação de portão | Documento 08 |

## 5. Escopo adiado preservado

Permanecem fora do MVP: atendimento parcial, múltiplos usuários, web, acesso remoto, celular completo, sincronização, documentos fiscais, cálculo automático de entrega, fidelidade, previsões, integrações/API, múltiplas operações, validade automática, crédito futuro e exportações avançadas.

## 6. Fórmulas oficiais preservadas

- Resultado da venda = vendas líquidas − custo direto histórico + taxa de entrega cobrada − custo real da entrega.
- Resultado do período = resultados das vendas − despesas gerais − custos indiretos − perdas aplicáveis − baixas de inadimplência ± ajustes.
- Caixa disponível = caixa total − reserva financeira.

Cada lançamento terá uma classificação de efeito exclusiva para impedir dupla apropriação.

## 7. Conclusão da auditoria

A baseline é tecnicamente especificável, com regularização institucional explícita dos Blocos 1 e 2. Nenhum documento histórico foi alterado, nenhuma regra funcional foi reinterpretada e nenhuma implementação foi iniciada.