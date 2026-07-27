# Parecer do Work — Sprint 1, Bloco 6

## Classificação

**Funcionalmente viável, com recomendações objetivas para aprovação.**

Não foram identificados conflitos com os Blocos 1 a 5.

## 1. Orçamento, pedido e venda

O MVP não precisa de um módulo separado de orçamento.

O pedido em **Em elaboração** funcionará como simulação:

* não reserva estoque;
* não gera produção;
* não movimenta caixa;
* permite gerar e compartilhar um resumo;
* pode ser alterado livremente.

Ao ser confirmado, torna-se compromisso comercial. Depois da entrega ou retirada, torna-se venda concluída.

Orçamento formal, validade automática e versões comerciais ficam para evolução futura.

## 2. Tipos de venda

### Pronta-entrega imediata

* pode usar Consumidor Avulso;
* exige produto disponível;
* permite registrar pedido, pagamento e retirada em um fluxo curto;
* baixa o estoque na entrega ou retirada.

### Encomenda

* exige cliente identificado;
* exige data e modalidade de atendimento;
* pode ser confirmada sem estoque;
* gera necessidade de produção.

### Pedido misto

* pode conter produtos disponíveis e produtos a produzir;
* reserva imediatamente o que estiver disponível;
* mantém os itens faltantes como necessidade de produção;
* somente fica pronto quando todos os itens estiverem disponíveis.

### Retirada ou entrega

A modalidade deverá ser definida antes da confirmação. Entrega exige endereço e taxa, mesmo quando gratuita.

## 3. Informações do pedido

### Obrigatórias

* itens;
* quantidades;
* preços;
* modalidade: retirada ou entrega;
* cliente, exceto pronta-entrega imediata;
* data e horário prometidos para encomendas;
* endereço utilizado para entrega;
* taxa de entrega;
* status comercial e financeiro.

### Opcionais

* referência do endereço;
* observações;
* custo da entrega, enquanto ainda desconhecido;
* responsável pela entrega.

O pedido deverá preservar uma fotografia histórica de:

* cliente e contato;
* endereço;
* produtos;
* quantidades;
* preços;
* descontos;
* taxa de entrega;
* custo da entrega;
* datas prometidas.

## 4. Estados comerciais

| Estado              | Regra                                 |
| ------------------- | ------------------------------------- |
| Em elaboração       | Sem compromisso ou movimentação       |
| Confirmado          | Compromisso comercial assumido        |
| Aguardando produção | Há quantidade sem estoque             |
| Em produção         | Existe OP iniciada vinculada          |
| Pronto              | Todos os produtos estão reservados    |
| Saiu para entrega   | Produtos estão com o entregador       |
| Entregue            | Entrega confirmada e estoque baixado  |
| Retirado            | Retirada confirmada e estoque baixado |
| Cancelado           | Pedido encerrado por cancelamento     |

**Separado** é desnecessário, pois a reserva já representa essa condição.

**Parcialmente atendido** não é recomendado no MVP.

As alterações automáticas serão:

* Confirmado → Aguardando produção, quando faltar produto;
* Aguardando produção → Em produção, quando a OP começar;
* Em produção → Pronto, quando tudo estiver produzido e reservado.

Entrega, retirada e cancelamento exigem confirmação humana.

## 5. Confirmação

Para confirmar, será obrigatório:

* possuir ao menos um item;
* ter quantidade e preço válidos;
* identificar cliente quando necessário;
* definir retirada ou entrega;
* informar data prometida para encomenda;
* informar endereço para entrega;
* confirmar desconto e justificativa;
* informar taxa de entrega, ainda que seja zero.

Pagamento ou sinal não serão obrigatórios para confirmação.

Falta de estoque não bloqueará o pedido, apenas gerará necessidade de produção.

## 6. Reservas

Na confirmação:

* produtos disponíveis serão reservados;
* quantidades faltantes gerarão necessidade de produção;
* saldo físico não será reduzido;
* saldo disponível considerará as reservas.

Reservas serão liberadas por:

* cancelamento;
* remoção de item;
* redução de quantidade;
* substituição do produto.

Atraso na retirada não liberará a reserva automaticamente. O operador deverá decidir entre reagendar, cancelar ou registrar perda.

## 7. Vínculo com produção

O sistema deverá apresentar a quantidade faltante e permitir:

* criar manualmente uma OP vinculada;
* agrupar pedidos do mesmo produto;
* acompanhar quais OPs atendem cada pedido.

Nenhuma OP será criada automaticamente.

## 8. Preços

* O preço cadastrado será carregado como padrão.
* Antes da confirmação, poderá ser alterado.
* Preço diferente do cadastro exigirá justificativa.
* Promoção no MVP será tratada como preço negociado, sem cadastro próprio.
* Após a confirmação, o preço ficará preservado.
* Mudança posterior exigirá revisão registrada do pedido.
* Alterações cadastrais não afetarão pedidos existentes.
* Após entrega ou retirada, preço não poderá ser editado diretamente.

Correções após a conclusão deverão gerar ajuste comercial vinculado.

## 9. Descontos

Recomendação para o MVP:

* permitir somente desconto geral no pedido;
* aceitar valor fixo ou percentual, nunca os dois simultaneamente;
* exigir justificativa;
* mostrar impacto sobre o resultado;
* alertar quando o desconto tornar o resultado negativo;
* não bloquear automaticamente a decisão do operador.

Desconto por item fica substituído pelo preço negociado do próprio item.

## 10. Pagamentos

O pedido poderá receber vários pagamentos, inclusive com formas diferentes.

Cada pagamento preservará:

* data e hora;
* valor;
* forma;
* operador;
* observação;
* situação.

O pagamento somente movimentará o caixa depois da confirmação de recebimento.

### Regras

* Sinal é o primeiro pagamento parcial.
* Pagamento antecipado não conclui a venda.
* Troco não é receita.
* O sistema calculará automaticamente o saldo.
* Pagamento acima do saldo será bloqueado, exceto dinheiro entregue com troco.
* Pagamento confirmado não poderá ser apagado.
* Estorno será uma nova movimentação vinculada ao pagamento original.

## 11. Situação financeira

| Estado                 | Significado                          |
| ---------------------- | ------------------------------------ |
| Não pago               | Nenhum valor confirmado              |
| Parcialmente pago      | Existe pagamento, mas ainda há saldo |
| Pago                   | Total integral recebido              |
| Parcialmente estornado | Parte do valor foi devolvida         |
| Estornado              | Todo o valor recebido foi devolvido  |

**Saldo pendente** será um valor calculado, não outro estado.

Recomendação: permitir entrega ou retirada com saldo pendente mediante confirmação explícita e definição de vencimento.

## 12. Retirada

Fluxo:

1. pedido fica Pronto;
2. operador identifica o pedido e o cliente;
3. recebe ou confirma eventual saldo;
4. se houver dívida, confirma a liberação;
5. confirma a retirada;
6. estoque é baixado;
7. pedido fica Retirado;
8. comprovante é gerado.

Produto não retirado permanecerá reservado até decisão do operador. Não haverá cancelamento automático.

## 13. Entrega

Antes da saída:

* todos os produtos devem estar reservados;
* endereço e contato devem estar confirmados;
* responsável pela entrega deve ser informado;
* taxa cobrada deve estar definida.

Fluxo:

1. marcar Saiu para entrega;
2. registrar eventual pagamento recebido;
3. confirmar entrega;
4. baixar estoque;
5. registrar custo real da entrega;
6. gerar comprovante.

### Tentativa frustrada

* registrar motivo;
* manter os produtos vinculados ao pedido;
* reagendar ou cancelar;
* registrar nova taxa, quando aplicável;
* classificar como perda se o produto perder condição de uso.

## 14. Taxa e custo da entrega

* **Taxa de entrega:** valor cobrado do cliente.
* **Custo da entrega:** valor pago ou devido ao entregador.

Entrega gratuita terá taxa zero, mas poderá possuir custo.

Se o custo ainda não for conhecido, ficará como **Pendente**, impedindo apenas o fechamento definitivo do resultado da venda.

Correções posteriores gerarão ajuste identificado, preservando o valor anterior.

## 15. Alterações

| Momento                  | Alterações permitidas                                       |
| ------------------------ | ----------------------------------------------------------- |
| Em elaboração            | Todas                                                       |
| Confirmado, sem produção | Itens, quantidades, data, endereço e valores, com histórico |
| Produção iniciada        | Inclusões permitidas; reduções exigem tratar a OP           |
| Produto pronto           | Alterações liberam reserva ou geram nova produção           |
| Com pagamento            | Recalcular saldo ou valor a estornar                        |
| Saiu para entrega        | Somente ocorrência e reagendamento                          |
| Entregue ou retirado     | Nenhuma edição direta                                       |

Mudança de cliente após confirmação exigirá justificativa. Mudança de endereço será bloqueada depois da saída para entrega.

## 16. Atendimento parcial

Recomendação: **não permitir entrega ou retirada parcial no MVP**.

Caso o cliente queira receber parte imediatamente, o pedido deverá ser dividido antes da confirmação em dois pedidos independentes.

Isso evita:

* várias baixas no mesmo pedido;
* divisão confusa de pagamentos;
* múltiplas entregas;
* estados ambíguos;
* cancelamento parcial depois da entrega.

Cancelamento de item será permitido enquanto o pedido ainda não estiver concluído.

## 17. Cancelamentos

| Situação                 | Tratamento                                  |
| ------------------------ | ------------------------------------------- |
| Em elaboração            | Cancelar sem efeitos                        |
| Confirmado, sem produção | Liberar reservas e estornar pagamentos      |
| Produção iniciada        | Tratar a OP e destinar produtos ou perdas   |
| Produto pronto           | Liberar para venda ou registrar perda       |
| Parcialmente pago        | Estornar o recebido                         |
| Pago                     | Estornar integralmente                      |
| Entregue ou retirado     | Utilizar devolução ou reclamação            |
| Item específico          | Recalcular total, reserva, produção e saldo |

O MVP não fará retenção automática de sinal. A recomendação é estorno integral, salvo futura política comercial expressamente aprovada.

Toda decisão exige motivo e histórico.

## 18. Devoluções e reclamações

O MVP deverá permitir registrar:

* pedido e item;
* motivo;
* descrição;
* quantidade;
* solução adotada;
* valor estornado;
* produto substituído;
* perda;
* data e operador.

Soluções do MVP:

* estorno;
* substituição por novo produto;
* encerramento sem compensação, com justificativa.

Crédito para compra futura fica adiado.

Produto devolvido ou recusado não retorna ao estoque vendável. Uma substituição deverá gerar novo item de atendimento vinculado à reclamação.

## 19. Inadimplência

Pedidos entregues com saldo deverão registrar:

* valor pendente;
* vencimento;
* pagamentos posteriores;
* atraso;
* histórico.

Novas vendas para cliente inadimplente gerarão alerta, mas não bloqueio automático.

O MVP não incluirá cobrança automatizada. Baixa de dívida como perda exigirá justificativa e confirmação.

## 20. Comprovantes

| Documento                          | Prioridade  |
| ---------------------------------- | ----------- |
| Resumo do pedido                   | Obrigatório |
| Comprovante de pagamento           | Obrigatório |
| Confirmação de entrega ou retirada | Obrigatório |
| Recibo simples                     | Importante  |
| Impressão                          | Importante  |
| Compartilhamento digital           | Importante  |
| Documento fiscal                   | Futuro      |

## 21. Histórico

Cada pedido preservará:

* cliente e contato utilizados;
* endereço utilizado;
* itens e quantidades;
* preços e descontos;
* taxa e custo da entrega;
* pagamentos e estornos;
* estados e transições;
* reservas;
* OPs vinculadas;
* alterações;
* cancelamentos;
* reclamações;
* operador;
* datas, horários e justificativas.

Após entrega, retirada ou cancelamento, o histórico será imutável. Somente novas ocorrências vinculadas poderão ser acrescentadas.

## 22. Consultas

| Consulta                     | Prioridade  |
| ---------------------------- | ----------- |
| Pedidos por status           | Obrigatória |
| Agenda por data de entrega   | Obrigatória |
| Pedidos atrasados            | Obrigatória |
| Pedidos aguardando produção  | Obrigatória |
| Histórico completo do pedido | Obrigatória |
| Vendas por período           | Obrigatória |
| Pagamentos recebidos         | Obrigatória |
| Saldos pendentes             | Obrigatória |
| Cancelamentos e estornos     | Obrigatória |
| Entregas programadas         | Obrigatória |
| Pedidos por cliente          | Obrigatória |
| Descontos concedidos         | Importante  |
| Custos de entrega            | Importante  |
| Itens mais vendidos          | Importante  |
| Desempenho de entregadores   | Futuro      |

## 23. Riscos

| Risco                                        | Nível | Mitigação                                  |
| -------------------------------------------- | ----: | ------------------------------------------ |
| Produto reservado ser vendido novamente      |  Alto | Separar físico, reservado e disponível     |
| Desconto ser aplicado duas vezes             |  Alto | Um desconto geral por pedido               |
| Pagamento ser confundido com venda concluída |  Alto | Estados comerciais e financeiros separados |
| Entrega baixar estoque antes da confirmação  |  Alto | Baixa somente na entrega ou retirada       |
| Mudança de endereço apagar histórico         |  Alto | Fotografia histórica                       |
| Cancelamento apagar pagamento                |  Alto | Estorno vinculado                          |
| Atendimento parcial gerar inconsistência     |  Alto | Adiar no MVP                               |
| Custo de entrega ausente distorcer resultado | Médio | Marcar resultado como pendente             |
| Retenção automática de sinal gerar conflito  |  Alto | Estorno integral como padrão               |

## 24. Recomendações para aprovação

O Work recomenda aprovar:

1. Pedido em elaboração no lugar de orçamento separado.
2. Estados comerciais definidos neste parecer.
3. Estados financeiros independentes.
4. Consumidor Avulso somente para pronta-entrega.
5. Confirmação sem sinal obrigatório.
6. Reserva automática dos produtos disponíveis.
7. Geração de necessidade de produção sem OP automática.
8. Preço negociado com justificativa.
9. Apenas desconto geral no MVP.
10. Múltiplos pagamentos e formas.
11. Entrega com saldo mediante confirmação e vencimento.
12. Baixa do estoque somente na entrega ou retirada.
13. Atendimento parcial adiado.
14. Estorno integral como padrão de cancelamento.
15. Produto devolvido sem retorno ao estoque vendável.
16. Inadimplência com alerta, sem bloqueio automático.
17. Documentos fiscais adiados.
18. Histórico comercial e financeiro imutável.

## Parecer final

O Bloco 6 está **aprovável com as dezoito recomendações apresentadas**.

Após a decisão da Sala de Reuniões, o Work deverá aguardar autorização expressa antes do Bloco 7.
