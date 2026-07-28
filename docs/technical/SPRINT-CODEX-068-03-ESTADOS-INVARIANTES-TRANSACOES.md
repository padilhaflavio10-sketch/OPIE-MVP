# SPRINT-CODEX-068 — Estados, Invariantes, Transações e Idempotência

## 1. Invariantes globais

1. Nenhum saldo físico, reservado ou disponível pode ficar negativo.
2. Disponível = físico − reservado.
3. Toda mudança de saldo deriva de movimento imutável com origem.
4. Venda só existe após entrega ou retirada confirmada.
5. Pagamento não altera o estado comercial por si só.
6. Operação concluída não é editada; correção é compensatória e vinculada.
7. Uma quantidade não pode ser reservada, consumida ou baixada duas vezes.
8. Versão de receita utilizada é imutável.
9. Reserva financeira não é receita nem despesa.
10. Um custo/perda/despesa tem uma única classificação de efeito no resultado.
11. Toda ação crítica identifica operador, justificativa, resultado e operação original.
12. Repetição da mesma chave idempotente retorna o resultado anterior sem novo efeito.

## 2. Estado comercial do pedido

| Origem | Destino | Pré-condições | Efeitos atômicos / bloqueios |
|---|---|---|---|
| Em elaboração | Confirmado | itens válidos, cliente quando exigido, preços definidos | congela snapshots; tenta reservas; audita |
| Confirmado | Aguardando Produção | falta produto reservável | registra necessidade; sem baixa |
| Confirmado | Pronto | tudo reservado | mantém reservas |
| Aguardando Produção | Em Produção | OP vinculada iniciada | vínculo auditado |
| Em Produção | Pronto | produção suficiente concluída e reservada | atualiza cobertura do pedido |
| Pronto | Saiu para entrega | modalidade entrega, endereço confirmado | registra saída; não baixa estoque |
| Pronto | Retirado | confirmação e reidentificação quando excepcional | consome reserva, baixa estoque, reconhece venda |
| Saiu para entrega | Entregue | confirmação única | consome reserva, baixa estoque, reconhece venda |
| Saiu para entrega | Pronto | tentativa frustrada | preserva reserva; registra tentativa |
| estados não finais | Cancelado | política funcional permite; justificativa | libera reservas; efeitos financeiros por estorno separado |

`Entregue`, `Retirado` e `Cancelado` são finais. Atendimento parcial no mesmo pedido é bloqueado.

## 3. Estado financeiro do pedido

| Origem | Destino | Condição |
|---|---|---|
| Não pago | Parcialmente pago | pagamento confirmado menor que saldo |
| Não pago | Pago | pagamento confirmado igual ao saldo |
| Parcialmente pago | Pago | soma confirmada igual ao total |
| Pago | Parcialmente estornado | estorno acumulado entre zero e total pago |
| Parcialmente pago | Parcialmente estornado | qualquer estorno sem zerar recebimento líquido |
| Pago/Parcialmente estornado | Estornado | recebimento líquido igual a zero |

Estado é projeção derivada de pagamentos e estornos, nunca campo editável isoladamente.

## 4. Estado da Ordem de Produção

| Origem | Destino | Pré-condições e efeitos |
|---|---|---|
| Planejada | Em produção | versão capturada; insumos suficientes; reservas criadas integralmente |
| Planejada | Cancelada | nenhum consumo; justificativa; libera vínculo planejado |
| Em produção | Interrompida | incidente registrado; reservas permanecem ou são tratadas explicitamente |
| Interrompida | Em produção | causa resolvida e saldo ainda válido |
| Em produção/Interrompida | Concluída | consumo, perdas, rendimento e produto pronto confirmados numa transação |
| Em produção/Interrompida | Parcialmente concluída | encerra a OP com saída real; cria necessidade de nova OP para restante |

OP concluída ou parcialmente concluída não volta. Correção posterior usa perda, ajuste ou OP corretiva vinculada. Cancelamento após consumo não apaga movimentos.

## 5. Catálogo de transações críticas

| Operação | Passos indivisíveis | Rollback e repetição segura |
|---|---|---|
| Receber compra | validar → converter → criar entrada → atualizar custo médio → marcar recebida → auditar | qualquer falha reverte tudo; chave por compra/recebimento |
| Iniciar OP | validar estado/saldos → reservar insumos → mudar estado → auditar | sem reserva parcial; chave por OP/início |
| Concluir OP | validar → consumir reservas → registrar consumo/perdas → criar saída de insumo e entrada de produto → calcular custo → atualizar pedidos → concluir → auditar | rollback total; chave por OP/conclusão |
| Confirmar entrega | validar estado → consumir reserva → baixar produto → registrar atendimento → reconhecer venda → auditar | rollback total; chave por entrega/confirmação |
| Confirmar retirada | mesmo contrato da entrega, sem trânsito | rollback total; chave por retirada/confirmação |
| Pagamento | validar saldo/forma → registrar pagamento → caixa → reserva automática → estado financeiro → auditar | nenhum lançamento parcial; chave externa ou gerada antes da confirmação |
| Estorno | validar limite → registrar estorno → caixa inverso → reversão proporcional da reserva → projetar estado → auditar | rollback total; chave por solicitação |
| Cancelamento | validar estado → cancelar → liberar reservas → criar pendências financeiras necessárias → auditar | não apaga efeitos existentes |
| Ajuste de estoque | validar contagem/motivo → movimento compensatório → saldo → auditar | movimento único por ajuste |
| Inventário | congelar escopo lógico → registrar contagens → gerar ajustes → concluir → auditar | falha mantém inventário em elaboração, sem ajustes |
| Movimento de reserva financeira | validar origem/saldo → lançar → projetar saldo → auditar | chave por origem e tipo |
| Fechamento | selecionar período → calcular linhas → reconciliar → gravar fotografia → auditar | sem fotografia parcial; chave por período/versão |
| Correção posterior | validar original → criar evento compensatório → recalcular projeções atuais → vincular fechamento → auditar | original intacto; chave por solicitação |

## 6. Controle técnico de atomicidade

- Uma unidade de trabalho por comando crítico.
- Início de transação com bloqueio de escrita compatível com banco local.
- Leitura e validação de versões dentro da mesma transação.
- Restrições verificadas novamente imediatamente antes do commit.
- Evento de auditoria de sucesso gravado na mesma transação do efeito.
- Tentativa bloqueada pode gerar evento separado sem efeito de negócio.
- Falha antes do commit: rollback e nenhuma mudança observável.
- Falha após commit e antes da resposta: repetição pela mesma chave recupera resultado persistido.

## 7. Idempotência

Tabela conceitual `idempotency_records`:

- `scope`, `key`, `request_fingerprint`, `status`, `result_reference`, `created_at`, `completed_at`;
- unicidade em `(scope, key)`;
- mesma chave e mesmo fingerprint: retorna resultado anterior;
- mesma chave e fingerprint diferente: bloqueia como conflito e gera auditoria;
- registro e efeitos pertencem à mesma transação sempre que possível.

Escopos obrigatórios: recebimento de compra, início/conclusão de OP, pagamento, estorno, entrega, retirada, cancelamento, ajuste/inventário, reserva financeira e operação emergencial.

## 8. Concorrência e dupla utilização

Mesmo com um operador, cliques repetidos, reabertura de janela e recuperação após falha criam concorrência lógica. A proteção combina:

- chaves idempotentes geradas antes da ação;
- índices únicos por evento terminal;
- `row_version` para entidades mutáveis;
- verificação de saldo dentro da transação;
- reservas explícitas com estado;
- restrição de uma origem para cada movimento.

## 9. Correção e auditoria

Correções nunca alteram evento terminal. Criam evento corretivo com `original_id`, motivo, operador, antes/depois lógico e efeitos compensatórios. A cadeia completa deve ser consultável e reconciliável.