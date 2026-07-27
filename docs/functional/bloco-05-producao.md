# Parecer do Work — Sprint 1, Bloco 5

## Classificação

**Funcionalmente viável, com recomendações objetivas para aprovação.**

O fluxo proposto mantém compatibilidade com estoque, custos, encomendas e histórico.

## 1. Estrutura funcional da produção

Toda produção deverá possuir uma **Ordem de Produção — OP**, inclusive produções urgentes ou destinadas à pronta-entrega.

Cada OP deverá representar apenas uma combinação de:

* produto;
* sabor;
* tamanho;
* versão da receita.

Uma OP poderá atender vários pedidos quando todos solicitarem exatamente o mesmo produto.

## 2. Informações da Ordem de Produção

### Planejamento

* identificação da OP;
* finalidade: estoque, encomenda ou mista;
* produto;
* versão da receita;
* quantidade planejada;
* data prevista;
* prioridade;
* pedidos vinculados;
* operador responsável;
* observações.

### Encerramento

* consumo real;
* substituições;
* rendimento obtido;
* unidades aprovadas;
* unidades perdidas;
* embalagens consumidas;
* custo indireto informado;
* data e operador da conclusão.

## 3. Estados

| Estado                 | Significado                                      |
| ---------------------- | ------------------------------------------------ |
| Planejada              | Criada, sem movimentação definitiva              |
| Em produção            | Insumos reservados e trabalho iniciado           |
| Interrompida           | Produção temporariamente suspensa                |
| Concluída              | Quantidade final registrada                      |
| Concluída parcialmente | Parte foi finalizada; o restante exigirá nova OP |
| Cancelada              | Encerrada sem conclusão total                    |

Estados anteriores deverão permanecer registrados no histórico.

## 4. Modalidades

### Para pronta-entrega

* criada manualmente;
* não exige pedido;
* produção concluída entra como disponível.

### Para encomenda

* criada a partir de pedido em **Aguardando Produção**;
* produtos concluídos entram no estoque;
* ficam imediatamente reservados ao pedido.

### Mista

* atende pedidos vinculados;
* quantidade excedente fica disponível para pronta-entrega;
* a distribuição entre os pedidos deve ser definida antes da conclusão.

## 5. Planejamento do MVP

### Obrigatório

* criação manual;
* criação a partir de pedido;
* data prevista;
* prioridade normal ou urgente;
* lista ordenada pela data de entrega;
* identificação de pedidos atrasados;
* visualização dos insumos necessários.

### Importante

* agrupamento manual de pedidos do mesmo produto;
* sugestão de produção para estoque mínimo.

### Futuro

* previsão automática de demanda;
* programação por capacidade;
* otimização de lotes;
* produtividade por tempo;
* calendário avançado.

O sistema poderá sugerir, mas nunca criar uma produção automaticamente.

## 6. Início

Antes do início, verificar:

* produto e receita ativos;
* quantidade planejada válida;
* insumos e embalagens disponíveis;
* pedidos vinculados ainda ativos;
* ausência de outra conclusão para a mesma OP.

Ao iniciar:

1. preservar a versão da receita;
2. calcular o consumo previsto;
3. reservar ingredientes e embalagens;
4. registrar data, hora e operador;
5. alterar o estado para **Em produção**.

Estoque insuficiente deverá bloquear o início e informar exatamente o que falta.

## 7. Execução

O MVP não precisa controlar cada etapa culinária.

Durante a execução, será permitido:

* interromper com motivo;
* retomar;
* registrar observações;
* substituir insumo com justificativa;
* ajustar consumo real;
* registrar perdas;
* informar rendimento real.

Substituições somente serão aceitas se o novo insumo possuir saldo disponível.

## 8. Conclusão

Para concluir, será obrigatório informar:

* quantidade final aproveitável;
* quantidade perdida;
* confirmação ou correção do consumo;
* embalagens utilizadas;
* justificativas para diferenças;
* destinação dos produtos;
* custo indireto, quando houver.

Na confirmação, a operação deverá:

1. consumir definitivamente os insumos;
2. liberar reservas excedentes;
3. registrar perdas;
4. calcular os custos;
5. adicionar produtos prontos;
6. reservá-los aos pedidos vinculados;
7. registrar todo o histórico.

Se qualquer parte falhar, a conclusão inteira deverá permanecer pendente.

## 9. Produção parcial

Quando apenas parte ficar pronta:

* as unidades concluídas entram no estoque;
* as perdas são registradas;
* o consumo real é informado;
* a OP termina como **Concluída parcialmente**;
* a demanda restante continua pendente;
* uma nova OP vinculada poderá ser criada.

A OP original não ficará indefinidamente aberta.

## 10. Perdas e reaproveitamento

Tipos mínimos:

* quebra;
* erro operacional;
* desperdício;
* contaminação;
* rendimento inferior;
* lote descartado;
* embalagem danificada;
* outro.

### Regras

* Toda perda exige quantidade, motivo e justificativa.
* Ingredientes efetivamente consumidos permanecem como custo.
* Insumos reservados e não utilizados retornam ao disponível.
* Sobra de ingrediente não utilizada será tratada como consumo real menor.
* Produto sem condição de venda será descartado.
* Se todo o lote for perdido, todos os custos serão registrados como perda de produção.
* O custo da perda será exibido separadamente, mas não será descontado duas vezes do resultado.

Semipreparados somente poderão retornar ao estoque se estiverem cadastrados como insumo controlável. Caso contrário, o MVP não deverá criar estoques informais de “meia receita”.

## 11. Cancelamentos

| Situação                     | Tratamento                                  |
| ---------------------------- | ------------------------------------------- |
| OP planejada                 | Cancelar sem movimentação                   |
| OP iniciada sem consumo real | Liberar reservas                            |
| OP iniciada com consumo      | Registrar consumo, reaproveitamento e perda |
| Parte concluída              | Encerrar parcialmente                       |
| OP concluída                 | Não pode ser cancelada diretamente          |
| Erro em OP concluída         | Gerar correção ou reversão vinculada        |

Uma produção concluída e já utilizada em venda não poderá ser revertida como se nunca tivesse existido.

## 12. Custos

Cada produção deverá demonstrar:

### Custo direto

* ingredientes efetivamente consumidos;
* embalagens utilizadas;
* materiais perdidos.

### Custo indireto

* valor manual informado para aquela produção.

### Indicadores

* custo direto do lote;
* custo indireto informado;
* custo total estimado;
* custo direto por unidade aproveitável;
* custo total estimado por unidade;
* valor das perdas.

Para o resultado individual da venda, permanece válido o custo direto histórico do produto. O custo indireto compõe o resultado do período, evitando desconto duplicado.

## 13. Rastreabilidade

Cada OP preservará:

* identificação;
* finalidade;
* datas e horários;
* operador;
* produto;
* receita e versão;
* quantidade planejada;
* consumo previsto e real;
* substituições;
* reservas;
* rendimento;
* perdas;
* custos;
* pedidos atendidos;
* produtos gerados;
* interrupções;
* justificativas;
* histórico de estados.

## 14. Consultas

| Consulta                            | Prioridade  |
| ----------------------------------- | ----------- |
| Produções planejadas e em andamento | Obrigatória |
| Produções por período               | Obrigatória |
| Custos por produção                 | Obrigatória |
| Perdas                              | Obrigatória |
| Consumo previsto versus real        | Obrigatória |
| Produtos produzidos                 | Obrigatória |
| Produções vinculadas a pedidos      | Obrigatória |
| Rendimento por produto              | Importante  |
| Produções interrompidas e atrasadas | Importante  |
| Produtividade por tempo             | Futura      |
| Previsão automática de produção     | Futura      |

## 15. Riscos

| Risco                                        | Nível | Mitigação                                |
| -------------------------------------------- | ----: | ---------------------------------------- |
| Produção sem OP perder rastreabilidade       |  Alto | OP obrigatória                           |
| Insumo reservado por duas produções          |  Alto | Considerar disponibilidade após reservas |
| Receita mudar durante a produção             |  Alto | Preservar versão no início               |
| Rendimento diferente distorcer custo         |  Alto | Exigir quantidade real                   |
| OP parcial permanecer aberta indefinidamente | Médio | Encerrar e criar nova OP                 |
| Perda ser contabilizada duas vezes           |  Alto | Separar indicador de perda do resultado  |
| Produção concluída ser apagada               |  Alto | Somente correções vinculadas             |
| Planejamento automático produzir excessos    | Médio | Sugestões sem criação automática         |

## 16. Recomendações para aprovação

O Work recomenda aprovar:

1. OP obrigatória para toda produção.
2. Uma combinação de produto e receita por OP.
3. Modalidades: estoque, encomenda e mista.
4. Criação manual ou originada de pedido.
5. Sugestões automáticas sem criação automática.
6. Estados definidos neste parecer.
7. Reserva de todos os insumos no início.
8. Bloqueio por falta de estoque.
9. Execução simplificada, sem etapas culinárias detalhadas.
10. Ajustes de consumo e substituições com justificativa.
11. Conclusão integral das movimentações.
12. Produção parcial encerrada, com nova OP para o restante.
13. Histórico imutável de receita e custos.
14. Separação entre custo direto e indireto.
15. OP concluída sem cancelamento direto.
16. Consultas obrigatórias indicadas no parecer.

## Parecer final

O Bloco 5 está **aprovável com as dezesseis recomendações apresentadas**.

Após a deliberação da Sala de Reuniões, o Work deverá aguardar autorização expressa antes de qualquer Bloco 6.
