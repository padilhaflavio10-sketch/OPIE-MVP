# SPRINT-CODEX-068 — Operações Centrais

## 1. Estoque

### Saldos

- `fisico = soma(entradas) − soma(saidas)`.
- `reservado = soma(reservas_ativas)`.
- `disponivel = fisico − reservado`.
- Saldos são projeções verificáveis a partir do razão de movimentos, não campos ajustáveis diretamente.

### Movimentos

Tipos: compra recebida, consumo de produção, produto produzido, entrega/retirada, perda, ajuste, inventário, devolução não vendável e reversão autorizada. Todo movimento contém item, quantidade fixa, unidade, ocorrência, registro, origem, operador, justificativa quando aplicável e chave idempotente.

### Custo médio ponderado

Para entrada comprada compatível:

`novo_custo = ((saldo_anterior × custo_anterior) + (quantidade_entrada × custo_unitario_convertido)) / (saldo_anterior + quantidade_entrada)`.

A conversão para unidade de controle ocorre antes do cálculo. Se o saldo anterior for zero, o custo passa a ser o custo da entrada. Saídas não recalculam o custo médio; capturam o custo vigente como fotografia. Ajustes positivos exigem custo explicitamente justificado; ajustes negativos usam custo histórico corrente. Arredondamento usa precisão definida e política uniforme, preservando valor bruto quando necessário à reconciliação.

### Ordem de operação

1. normalizar unidade;
2. validar quantidade e origem;
3. carregar saldo/versão dentro da transação;
4. testar não negatividade e disponibilidade;
5. calcular custo quando entrada valorizada;
6. inserir movimento;
7. atualizar projeção/versionamento;
8. gravar auditoria;
9. commit.

Reserva não muda saldo físico. Liberação reduz reservado. Consumo/baixa de reserva reduz físico e reservado na mesma transação. Índices únicos e chave de origem impedem duplicidade.

## 2. Produção

### Criação e planejamento

A OP captura produto, quantidade planejada, versão exata da receita, necessidades calculadas e pedidos vinculados. Alteração posterior da receita não afeta a OP.

### Início

Calcula necessidades conforme quantidade planejada, verifica disponível por insumo e cria todas as reservas. Falta de qualquer insumo bloqueia o início por inteiro, registra tentativa e gera/atualiza pendência; não há reserva parcial silenciosa.

### Execução e conclusão

O operador informa consumo real, substituições autorizadas, perdas e rendimento real. A conclusão integral:

1. valida estado e entradas;
2. consome reservas e diferenças permitidas;
3. registra substituições e perdas;
4. cria movimentos de saída dos insumos;
5. cria entrada do produto pronto pelo rendimento real;
6. calcula custo direto histórico a partir dos consumos;
7. registra custo indireto separadamente, se informado;
8. reserva produtos para pedidos vinculados conforme prioridade explícita;
9. conclui a OP e audita.

Conclusão parcial encerra a OP com resultado real e gera necessidade de nova OP para o restante. Não mantém uma OP parcialmente aberta. Perda total registra consumo/perda sem produto pronto.

Correção após conclusão usa ajuste, perda adicional ou OP corretiva vinculada; jamais edita consumos históricos.

## 3. Pedidos, vendas e atendimento

### Criação e confirmação

Pedido em elaboração não movimenta estoque. Confirmação valida cliente quando encomenda/entrega, itens, modalidade, preços e descontos; captura snapshots e tenta reservar produtos. Quantidade indisponível cria necessidade de produção e estado correspondente.

Preço negociado e desconto exigem justificativa. Desconto geral é percentual ou valor, nunca ambos. Pedido misto é atômico no atendimento; não há atendimento parcial no MVP.

### Pagamento antecipado

É recebimento e movimento de caixa, mas não venda. O saldo a receber é derivado do total do pedido menos pagamentos líquidos.

### Entrega e retirada

Somente pedido Pronto pode ser atendido. Entrega registra endereço confirmado, taxa cobrada, custo real conhecido ou pendência. Saída para entrega não baixa estoque. Confirmação de entrega/retirada consome reservas, baixa estoque e reconhece venda na mesma transação.

Tentativa frustrada preserva produtos reservados, registra motivo, data e custo aplicável, e retorna o pedido a Pronto quando cabível.

### Cancelamento e devolução

Cancelamento libera reservas e cria as necessidades de estorno/correção, mas não apaga pagamento, produção ou movimento. Devolução não retorna automaticamente ao estoque vendável; registra destino, perda e eventual estorno como operações vinculadas.

## 4. Financeiro

### Separação contábil-gerencial

- **Venda:** reconhecimento comercial na entrega/retirada.
- **Recebimento:** pagamento confirmado, inclusive antecipado.
- **Caixa:** entradas e saídas financeiras efetivas.
- **Resultado:** competência gerencial da venda/despesa/perda.
- **Reserva:** parcela separada do caixa, sem natureza de receita/despesa.

Cada evento possui flags/classificação de efeito (`sale`, `cash`, `result`, `reserve`) e uma origem única.

### Pagamentos e estornos

Pagamento aceita múltiplas formas e alocações, integral ou parcial. Valor superior ao saldo é bloqueado, exceto dinheiro com troco explicitamente calculado. Estorno é novo registro, limitado ao valor líquido do pagamento, com caixa inverso e reversão proporcional da reserva automática.

### Despesas e dívida

Despesa ocorrida afeta resultado na competência; pagamento da despesa afeta caixa. Baixa de inadimplência exige confirmação excepcional, justificativa e efeito único no resultado.

### Reserva financeira

Movimentos manuais exigem motivo. Movimento automático deriva de recebimento confirmado conforme configuração vigente fotografada. Reversão por estorno referencia o movimento automático original. Saldo reservado nunca pode ficar negativo.

- `caixa_total = entradas_confirmadas − saidas_confirmadas`.
- `caixa_disponivel = caixa_total − saldo_reserva`.

### Fórmulas e antiduplificação

- Resultado da venda = vendas líquidas − custo direto histórico + taxa de entrega − custo real da entrega.
- Resultado do período = soma dos resultados das vendas − despesas gerais − custos indiretos − perdas aplicáveis − baixas de inadimplência ± ajustes.

Uma tabela de classificação de origem define exatamente um tratamento: custo direto incorporado à venda não volta como perda; custo indireto não integra simultaneamente custo direto; devolução/estorno altera o componente apropriado sem duplicar a baixa original.

## 5. Fechamento e reconciliação

Fechamento é fotografia imutável, não trava o período. Guarda filtros, totais e referências das linhas formadoras. Ajustes posteriores são exibidos separadamente e vinculados ao fechamento original. Dashboard deve permitir navegar de todo total às origens e reconciliar:

- saldo do razão de estoque com projeções;
- pagamentos líquidos com caixa;
- vendas reconhecidas com atendimentos;
- resultado com vendas, custos, despesas e perdas;
- reserva com seus movimentos.

## 6. Central de Pendências

### Modelo

Campos: `pending_id`, tipo, categoria, severidade, prioridade, origem, registro vinculado, descrição, ação esperada, responsável lógico, estado, datas, resolução, operador e versão.

### Classificações

- **Bloqueante:** impede continuidade segura da operação.
- **Crítica:** risco alto com ação imediata.
- **Atenção:** requer conferência sem bloqueio atual.
- **Informativa:** acompanhamento.

Naturezas distintas:

- pendência operacional: trabalho incompleto;
- inconsistência de integridade: divergência entre invariantes;
- alerta: condição preventiva;
- ação bloqueada: tentativa rejeitada por regra.

Estados: aberta, em análise, aguardando ação, resolvida, fechada e reaberta. Resolver exige evidência e não apaga a origem. Reabertura cria histórico. Duplicatas determinísticas da mesma origem atualizam a pendência existente sem perder ocorrências.

## 7. Falhas locais por operação

Antes do commit, qualquer falha restaura o estado anterior. Depois do commit, resposta perdida é recuperada por idempotência. Mensagens ao operador informam operação, estado preservado e próximo passo, sem detalhes técnicos sensíveis. Falhas repetidas ou invariantes quebradas geram pendência e auditoria.