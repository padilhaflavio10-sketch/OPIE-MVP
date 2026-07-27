# Parecer do Work — Sprint 1, Bloco 4

## Classificação

**Funcionalmente viável, com decisões objetivas para aprovação.**

As recomendações mantêm consistência com os Blocos 1, 2 e 3 e não alteram decisões anteriores.

## 1. Estrutura funcional

O MVP deverá controlar três estoques:

| Estoque          | Entradas                               | Saídas                                     |
| ---------------- | -------------------------------------- | ------------------------------------------ |
| Ingredientes     | Compras, devoluções internas e ajustes | Produção, perdas e devolução ao fornecedor |
| Embalagens       | Compras e ajustes                      | Produção, perdas e devolução               |
| Produtos prontos | Produção concluída e ajustes           | Venda entregue, perda e descarte           |

O estoque físico e a quantidade reservada deverão permanecer separados:

> **Disponível para venda = saldo físico − quantidade reservada.**

A reserva não representa saída física.

## 2. Momento das movimentações

| Operação                            | Efeito no estoque                                  |
| ----------------------------------- | -------------------------------------------------- |
| Compra em rascunho                  | Nenhum                                             |
| Compra recebida e confirmada        | Entrada dos insumos                                |
| Produção planejada                  | Nenhum                                             |
| Produção iniciada                   | Reserva dos insumos previstos                      |
| Produção concluída                  | Consumo dos insumos e entrada dos produtos prontos |
| Pedido aguardando produção          | Nenhum                                             |
| Produto separado                    | Reserva do produto pronto                          |
| Produto entregue ou retirado        | Baixa do produto pronto                            |
| Pedido cancelado antes da entrega   | Liberação da reserva                               |
| Produção cancelada antes do consumo | Liberação dos insumos                              |
| Produção cancelada com consumo      | Registro dos insumos consumidos e da perda         |
| Ajuste de inventário                | Entrada ou saída justificada                       |

As movimentações da produção concluída devem acontecer integralmente. O sistema não poderá consumir ingredientes e falhar antes de registrar os produtos obtidos.

## 3. Produção e consumo

A receita ativa fornecerá automaticamente o consumo previsto.

Antes da conclusão, o operador poderá informar:

* consumo real diferente;
* substituição de ingrediente;
* embalagem perdida;
* rendimento real;
* unidades perdidas;
* sobras aproveitáveis.

Qualquer diferença deverá exigir uma justificativa.

### Regras recomendadas

* O consumo real prevalece sobre o previsto.
* Substituições devem identificar o insumo utilizado e o motivo.
* Rendimento menor aumenta o custo unitário real.
* Rendimento maior reduz o custo unitário real.
* Sobra aproveitável retorna ao estoque por movimentação vinculada à produção.
* Material inutilizado permanece como consumo e recebe classificação de perda.
* A embalagem será consumida na conclusão da produção.
* Cada produção preservará receita, quantidades e custos daquele momento.

## 4. Produtos prontos e encomendas

Toda produção concluída deverá entrar no estoque de produtos prontos, inclusive quando destinada a uma encomenda.

Quando vinculada a pedido específico:

1. o produto entra no estoque;
2. fica imediatamente reservado para o pedido;
3. sai fisicamente somente na entrega ou retirada.

Isso preserva o histórico completo sem confundir produção com venda.

Produtos prontos deverão ser associados à produção de origem. A venda utilizará preferencialmente os produtos produzidos há mais tempo.

Produto vencido, danificado ou impróprio deverá gerar perda. Produto entregue ao cliente e posteriormente devolvido não deverá voltar ao estoque vendável.

## 5. Compras e custo médio

A compra somente afetará o estoque após confirmação do recebimento.

Cada item deverá preservar:

* quantidade comprada;
* unidade de compra;
* quantidade convertida;
* custo total;
* custo unitário;
* fornecedor cadastrado ou avulso;
* data;
* eventuais bonificações.

### Custo médio

O custo médio será recalculado considerando:

* saldo e custo anteriores;
* quantidade recebida;
* valor efetivamente pago pelo item;
* unidades bonificadas.

Frete e outras despesas gerais da compra serão registrados separadamente no MVP e não serão incorporados automaticamente ao custo médio.

Perdas e consumo reduzem a quantidade, mas não alteram o custo médio restante.

## 6. Unidades e conversões

Cada insumo terá uma unidade de controle:

* massa: grama;
* volume: mililitro;
* itens contáveis: unidade.

Conversões usuais:

* 1 kg = 1.000 g;
* 1 litro = 1.000 ml;
* caixa, pacote ou bandeja = quantidade de unidades informada no recebimento.

O sistema deverá mostrar ao usuário a conversão antes da confirmação:

> “2 pacotes com 50 unidades = entrada de 100 unidades.”

Após a primeira movimentação:

* a unidade de controle não poderá ser alterada;
* o fator utilizado em cada compra ficará preservado;
* correções serão feitas por cancelamento ou ajuste, nunca reescrevendo o histórico.

## 7. Perdas e descartes

Tipos mínimos:

* vencimento;
* quebra ou dano;
* erro de produção;
* contaminação;
* sobra não aproveitável;
* devolução imprópria para revenda;
* embalagem danificada;
* diferença de inventário;
* outro motivo.

Toda perda deverá:

* reduzir o estoque;
* registrar seu custo;
* identificar o motivo;
* exigir justificativa;
* preservar data, operador e origem.

A perda afeta o resultado do período, mas não altera retroativamente o custo de vendas anteriores.

## 8. Ajustes e inventário

Ajustes manuais serão permitidos somente para:

* saldo inicial;
* diferença de contagem;
* correção de lançamento;
* entrada ou saída anteriormente não registrada.

Todo ajuste exigirá motivo e confirmação.

### Data retroativa

Recomendação: **não permitir movimentação retroativa no MVP**.

Uma correção descoberta hoje será registrada hoje, podendo mencionar a operação antiga. Isso evita a alteração silenciosa de saldos e fechamentos anteriores.

### Inventário simplificado

O MVP deverá possuir inventário físico básico:

1. iniciar uma contagem;
2. suspender temporariamente novas movimentações;
3. informar as quantidades encontradas;
4. comparar saldo registrado e saldo físico;
5. revisar diferenças;
6. confirmar;
7. gerar ajustes identificados como “Diferença de inventário”.

Não será necessária uma segunda aprovação no MVP, mas a confirmação final deverá ser explícita.

## 9. Estoque mínimo e alertas

* Todo insumo poderá ter estoque mínimo.
* Produtos de pronta-entrega poderão ter estoque mínimo opcional.
* Operar abaixo do mínimo será permitido.
* O alerta aparecerá na tela inicial e na consulta do estoque.
* O mínimo não representa reserva nem impede movimentação.

A quantidade máxima que pode ser produzida com o estoque atual é útil, mas pode ficar como funcionalidade importante após o núcleo do MVP.

## 10. Política de estoque negativo

Recomendação: **proibir estoque negativo em todas as categorias**.

* Pedido poderá existir sem produto pronto e ficará como **Aguardando Produção**.
* Produção não poderá ser concluída sem os insumos necessários.
* Venda não poderá ser marcada como entregue sem produto disponível.
* Divergência física deverá ser corrigida por ajuste justificado.

Permitir saldo negativo esconderia compras, perdas ou produções não registradas.

## 11. Cancelamentos e reversões

| Situação                            | Tratamento                                                           |
| ----------------------------------- | -------------------------------------------------------------------- |
| Compra ainda não confirmada         | Cancelar sem movimentação                                            |
| Compra recebida                     | Gerar reversão; nunca apagar                                         |
| Devolução ao fornecedor             | Baixar quantidade devolvida e registrar referência                   |
| Produção planejada                  | Cancelar sem movimentação                                            |
| Produção iniciada                   | Liberar reservas; consumo real vira produção parcial ou perda        |
| Produção concluída                  | Não cancelar apagando; registrar reversão, reaproveitamento ou perda |
| Venda não entregue                  | Liberar reserva                                                      |
| Venda entregue                      | Gerar devolução ou perda, além do estorno financeiro                 |
| Pedido cancelado com produto pronto | Liberar para pronta-entrega ou registrar perda                       |
| Produto devolvido pelo cliente      | Registrar perda; não retornar ao estoque vendável                    |

Uma compra recebida não poderá ser integralmente revertida se parte do material já tiver sido consumida. Nesse caso, deverá ser registrada uma correção ou devolução correspondente à quantidade realmente disponível.

## 12. Histórico obrigatório

Cada movimentação deverá preservar:

* data e hora;
* entrada, saída ou reserva;
* tipo da movimentação;
* item;
* quantidade;
* unidade de controle;
* saldo anterior e posterior;
* origem: compra, produção, venda, perda, devolução ou ajuste;
* referência da operação;
* operador;
* custo vigente;
* conversão utilizada, quando aplicável.

A justificativa será obrigatória para:

* perdas;
* ajustes;
* substituições;
* cancelamentos;
* devoluções;
* diferenças entre consumo previsto e real.

## 13. Consultas do MVP

| Consulta                                   | Prioridade  |
| ------------------------------------------ | ----------- |
| Saldo atual                                | Obrigatória |
| Quantidade física, reservada e disponível  | Obrigatória |
| Itens abaixo do mínimo                     | Obrigatória |
| Movimentações por período                  | Obrigatória |
| Perdas                                     | Obrigatória |
| Custo médio dos insumos                    | Obrigatória |
| Produtos prontos disponíveis               | Obrigatória |
| Origem de cada movimentação                | Obrigatória |
| Consumo por produção                       | Importante  |
| Insumos necessários para pedidos pendentes | Importante  |
| Divergências de inventário                 | Importante  |
| Quantidade máxima produzível               | Futura      |

## 14. Riscos principais

| Risco                                           | Nível | Mitigação                                      |
| ----------------------------------------------- | ----: | ---------------------------------------------- |
| Conversão incorreta de unidades                 |  Alto | Pré-visualização e confirmação                 |
| Estoque negativo esconder lançamentos faltantes |  Alto | Bloqueio e ajuste justificado                  |
| Alteração de produção antiga                    |  Alto | Histórico imutável                             |
| Venda duplicada do mesmo produto                |  Alto | Separação entre físico, reservado e disponível |
| Cancelamento apagar movimentações               |  Alto | Reversões vinculadas                           |
| Divergência entre receita e consumo real        | Médio | Ajuste por produção com justificativa          |
| Produto devolvido voltar indevidamente à venda  |  Alto | Classificação automática como perda            |
| Inventário realizado durante movimentações      |  Alto | Suspensão temporária durante a contagem        |

## 15. Decisões recomendadas à Sala

O Work recomenda aprovar:

1. Três estoques: ingredientes, embalagens e produtos prontos.
2. Separação entre saldo físico, reservado e disponível.
3. Movimentação definitiva da produção somente na conclusão.
4. Reserva prévia dos insumos ao iniciar a produção.
5. Possibilidade de ajustar consumo e rendimento com justificativa.
6. Entrada obrigatória de toda produção concluída no estoque de produtos prontos.
7. Baixa do produto somente na entrega ou retirada.
8. Custo médio ponderado para insumos.
9. Despesas adicionais de compra separadas do custo médio no MVP.
10. Estoque negativo proibido.
11. Inventário físico simplificado.
12. Ajustes sem data retroativa.
13. Produto devolvido pelo cliente classificado como perda.
14. Histórico integral de todas as movimentações.
15. Quantidade máxima produzível adiada.

## Parecer final

O Bloco 4 está **aprovável com as quinze recomendações acima**. Não há conflito com as decisões anteriores.

Após a decisão da Sala de Reuniões, o Work deverá aguardar autorização expressa antes do Bloco 5.
