# Parecer do Work — Sprint 1, Bloco 8

## Classificação

**Funcionalmente viável, com ajustes conceituais obrigatórios.**

O principal cuidado é não confundir venda, recebimento, caixa, resultado e reserva. Um número bonito baseado em dados incompletos continua sendo só um palpite de terno.

## 1. Objetivos do dashboard

O dashboard deverá responder:

* quanto foi vendido;
* quanto foi recebido;
* quanto falta receber;
* qual foi o resultado estimado;
* quais produtos e clientes se destacaram;
* onde ocorreram perdas;
* quais estoques exigem atenção;
* quanto está disponível e reservado financeiramente.

A página inicial continuará operacional. O dashboard será uma área gerencial separada.

## 2. Estrutura funcional

Recomendação:

1. **Visão geral**
2. **Comercial e clientes**
3. **Financeiro**
4. **Produção e perdas**
5. **Estoque e compras**
6. **Entregas**

A Visão geral terá poucos indicadores e links para detalhes. O período selecionado será mantido ao navegar entre as seções.

## 3. Períodos

Disponibilizar:

* hoje;
* ontem;
* esta semana;
* semana anterior;
* este mês;
* mês anterior;
* período personalizado.

No MVP, a comparação automática será com o período imediatamente anterior de duração equivalente.

Comparação anual, metas e análises estatísticas ficam para evolução futura.

## 4. Reconhecimento da venda

A venda será reconhecida na data da:

* entrega; ou
* retirada.

A data do pedido servirá para relatórios operacionais. A data do pagamento servirá para caixa e recebimentos.

Pagamento antecipado aparecerá como **recebimento antecipado**, mas não como venda até o atendimento.

Pedidos cancelados antes do atendimento não entram nas vendas.

## 5. Indicadores comerciais

| Indicador                   | Fórmula ou definição                              |
| --------------------------- | ------------------------------------------------- |
| Pedidos criados             | Pedidos registrados no período                    |
| Pedidos concluídos          | Entregues ou retirados no período                 |
| Vendas brutas de produtos   | Quantidade × preço histórico, antes dos descontos |
| Descontos                   | Descontos dos pedidos concluídos                  |
| Vendas líquidas de produtos | Vendas brutas − descontos                         |
| Taxa de entrega cobrada     | Taxas dos pedidos concluídos                      |
| Valor comercial             | Vendas líquidas + taxas de entrega                |
| Ticket médio                | Valor comercial ÷ pedidos concluídos              |
| Itens vendidos              | Quantidade entregue ou retirada                   |
| Cancelamentos               | Pedidos cancelados no período                     |
| Aguardando produção         | Pedidos ainda dependentes de produção             |
| Pedidos atrasados           | Pedidos não concluídos após a data prometida      |

Pedido sem atendimento não compõe faturamento, mesmo que esteja pago.

## 6. Indicadores financeiros

| Indicador           | Definição                                             |
| ------------------- | ----------------------------------------------------- |
| Recebimentos        | Pagamentos confirmados no período                     |
| Estornos            | Valores efetivamente devolvidos                       |
| Recebimento líquido | Recebimentos − estornos                               |
| Saldo a receber     | Valores ainda devidos em pedidos ativos ou concluídos |
| Valores vencidos    | Saldos com vencimento ultrapassado                    |
| Despesas            | Despesas reconhecidas no período                      |
| Despesas pagas      | Saídas financeiras confirmadas                        |
| Saldo da reserva    | Entradas − saídas da reserva                          |
| Caixa total         | Entradas financeiras − saídas financeiras             |
| Caixa disponível    | Caixa total − saldo reservado                         |

Uma despesa pendente afeta o resultado quando registrada como ocorrida, mas somente afeta o caixa quando paga.

## 7. Resultado

A fórmula correta contém **adição** da taxa cobrada:

> **Resultado da venda = vendas líquidas dos produtos − custo direto histórico + taxa de entrega cobrada − custo real da entrega.**

### Resultado do período

> Resultados das vendas
> − despesas gerais
> − custos indiretos de produção
> − perdas não incorporadas aos produtos vendidos
> − dívidas baixadas como perda
> ± ajustes vinculados.

Perdas já incorporadas ao custo do produto não serão descontadas novamente.

### Situação do resultado

* **Provisório:** existem custos de entrega, despesas ou custos pendentes;
* **Parcial:** o período ainda está em andamento;
* **Definitivo gerencial:** período encerrado e sem valores pendentes conhecidos.

“Definitivo” não significa fechamento contábil ou fiscal.

## 8. Margens

### Margem bruta do produto

> (Venda líquida do produto − custo direto histórico) ÷ venda líquida do produto × 100.

### Margem do pedido

> Resultado da venda ÷ valor comercial × 100.

### Margem bruta do período

> (Vendas líquidas − custos diretos vendidos) ÷ vendas líquidas × 100.

Despesas gerais não entram na margem bruta. Elas entram no resultado do período.

Desconto geral será distribuído proporcionalmente entre os itens apenas para calcular resultado por produto.

## 9. Recebimentos e contas a receber

Relatórios obrigatórios:

* pagamentos por período;
* recebimentos por forma;
* sinais e antecipações;
* saldos pendentes;
* valores vencidos;
* estornos;
* inadimplência por cliente.

Um recebimento antecipado será mostrado em:

* caixa;
* recebimentos;
* antecipações de clientes.

Não aparecerá em vendas antes da entrega ou retirada.

## 10. Despesas

Cada despesa deverá preservar:

* data da ocorrência;
* categoria;
* descrição;
* valor;
* situação: pendente ou paga;
* data do pagamento;
* forma de pagamento;
* vínculo com entrega ou produção, quando existir.

Relatórios:

* despesas por período;
* categoria;
* situação;
* despesas pagas;
* despesas pendentes;
* custos indiretos de produção;
* ajustes.

## 11. Reserva financeira

Apresentar:

* saldo reservado;
* entradas e saídas;
* movimentações manuais;
* movimentações automáticas;
* origem;
* percentual utilizado;
* histórico.

### Clarificação recomendada

A reserva automática deverá ser calculada sobre **pagamentos confirmados**, e não sobre vendas ainda não recebidas.

Estorno de pagamento deverá gerar a correspondente correção da reserva automática.

Reserva:

* não reduz resultado;
* não é despesa;
* não cria receita quando liberada;
* reduz apenas o caixa disponível.

## 12. Produtos e clientes

### Produtos

* quantidade vendida;
* vendas líquidas;
* resultado;
* margem;
* descontos;
* cancelamentos;
* reclamações.

Produto, sabor e tamanho serão apresentados separadamente, com opção de agrupamento por categoria.

### Clientes

* valor comercial;
* frequência;
* última compra;
* ticket médio;
* saldo pendente;
* inadimplência;
* cancelamentos;
* reclamações.

**Consumidor Avulso** será apresentado separadamente e não participará da classificação de maiores clientes.

## 13. Produção

### Obrigatório

* produções realizadas;
* quantidades produzidas;
* rendimento previsto e real;
* custo previsto e real;
* perdas;
* custo das perdas;
* produções interrompidas;
* atrasadas;
* parcialmente concluídas.

### Futuro

* produtividade por hora;
* eficiência por operador;
* capacidade produtiva;
* previsão de demanda.

Esses itens futuros exigem controle de tempo ainda não aprovado.

## 14. Estoque

### Obrigatório

* físico;
* reservado;
* disponível;
* itens abaixo do mínimo;
* custo médio;
* perdas e ajustes;
* entradas por compra;
* saídas por produção;
* produtos prontos disponíveis e reservados.

### Importante

* valor atual estimado do estoque;
* itens sem movimentação;
* consumo por período.

### Futuro

* giro de estoque;
* cobertura em dias;
* previsão de ruptura.

O valor estimado deverá ser marcado como provisório quando existirem itens sem custo confiável.

## 15. Compras

Relatórios:

* compras por período;
* fornecedor;
* insumo;
* valor;
* quantidade;
* última compra;
* preço médio;
* variação de preço;
* despesas adicionais separadas.

Avaliação de desempenho de fornecedores fica fora do MVP.

## 16. Entregas

| Indicador                | Prioridade  |
| ------------------------ | ----------- |
| Quantidade de entregas   | Obrigatório |
| Taxas cobradas           | Obrigatório |
| Custos reais             | Obrigatório |
| Resultado das entregas   | Obrigatório |
| Custos pendentes         | Obrigatório |
| Entregas gratuitas       | Importante  |
| Tentativas frustradas    | Importante  |
| Reentregas e perdas      | Importante  |
| Entregas por responsável | Futuro      |

Resultado da entrega:

> Taxa cobrada − custo real.

## 17. Cancelamentos, estornos e devoluções

Relatórios obrigatórios:

* pedidos e itens cancelados;
* motivos;
* valores estornados;
* reservas liberadas;
* perdas;
* devoluções;
* substituições;
* reclamações.

Cancelamento anterior à entrega não reduz vendas porque a venda ainda não foi reconhecida.

Estorno de pagamento reduz recebimentos e caixa. Somente devoluções ou ajustes comerciais de venda concluída afetam o resultado comercial.

## 18. Filtros

### Padrão

* período;
* status;
* produto;
* categoria;
* cliente;
* retirada ou entrega.

### Avançado

* sabor;
* tamanho;
* forma de pagamento;
* fornecedor;
* tipo de movimentação;
* operador.

### Futuro

* combinações salvas;
* filtros comparativos personalizados.

## 19. Detalhamento

Todo indicador deverá permitir abrir os registros que formam o total.

Regras:

* manter período e filtros;
* mostrar itens incluídos e excluídos;
* explicar a fórmula;
* identificar valores pendentes;
* fazer o total detalhado coincidir com o resumo;
* permitir acesso à operação original.

## 20. Gráficos do MVP

Recomendados:

1. vendas líquidas por dia;
2. recebimentos por dia;
3. resultado do período;
4. despesas por categoria;
5. produtos mais vendidos.

Cada gráfico deverá permitir acesso aos registros relacionados.

Evolução da reserva e perdas por período são importantes, mas podem entrar depois do núcleo do dashboard.

## 21. Relatórios operacionais

Obrigatórios:

* agenda de pedidos;
* entregas e retiradas;
* pedidos atrasados;
* pedidos aguardando produção;
* OPs planejadas e em andamento;
* estoque crítico;
* saldos vencidos;
* custos de entrega pendentes;
* compras recentes.

Esses relatórios apoiam ações imediatas; não medem desempenho gerencial.

## 22. Regras históricas

Relatórios antigos deverão preservar:

* nome do produto e do cliente utilizados;
* preços;
* descontos;
* custos;
* receita e versão;
* endereço;
* taxa e custo da entrega;
* categoria histórica;
* movimentações e ajustes.

Correções posteriores aparecerão no período em que foram registradas, vinculadas à operação original. O relatório antigo deverá indicar que houve correção posterior, sem apagar o resultado originalmente registrado.

## 23. Exportação

| Recurso                          | Prioridade  |
| -------------------------------- | ----------- |
| Visualização completa no sistema | Obrigatório |
| Impressão simples                | Importante  |
| Resumo diário e mensal           | Importante  |
| Exportação para PDF              | Importante  |
| Exportação tabular               | Futuro      |
| Compartilhamento automático      | Futuro      |

Exportações deverão identificar período, filtros e situação provisória ou definitiva.

## 24. Fechamento diário

O resumo diário apresentará:

* vendas reconhecidas;
* recebimentos;
* antecipações;
* estornos;
* despesas;
* saldos pendentes;
* perdas;
* reserva;
* entregas;
* custos pendentes;
* resultado provisório.

A confirmação diária cria uma fotografia gerencial, mas não bloqueia lançamentos posteriores.

Correções serão mostradas como **Ajuste posterior ao fechamento**.

## 25. Fechamento mensal

Recomendação: incluir como relatório gerencial, sem bloqueio.

Apresentará:

* vendas;
* recebimentos;
* despesas;
* custos;
* perdas;
* resultado;
* reserva;
* saldos pendentes;
* ajustes posteriores.

Não será um encerramento contábil formal.

## 26. Alertas gerenciais

### MVP

* resultado negativo;
* estoque crítico;
* saldo vencido;
* custo de entrega pendente;
* produção atrasada;
* despesa pendente relevante.

### Futuro

* queda de vendas;
* tendência de aumento de custos;
* aumento estatístico de perdas;
* variações fora do padrão.

Alertas estatísticos exigem histórico suficiente e ficam adiados.

## 27. Metas

Metas de vendas, faturamento, produção e reserva ficam para evolução futura.

O MVP deverá primeiro garantir números confiáveis; não adianta colocar meta num velocímetro que ainda está sendo calibrado.

## 28. Terminologia oficial

| Termo                | Significado                                                         |
| -------------------- | ------------------------------------------------------------------- |
| Vendas brutas        | Produtos antes dos descontos                                        |
| Descontos            | Reduções concedidas                                                 |
| Vendas líquidas      | Vendas brutas menos descontos                                       |
| Taxa de entrega      | Valor cobrado do cliente                                            |
| Valor comercial      | Vendas líquidas mais taxa de entrega                                |
| Recebimentos         | Dinheiro efetivamente recebido                                      |
| Saldo a receber      | Valor ainda devido                                                  |
| Custo direto         | Ingredientes e embalagens históricos                                |
| Resultado da venda   | Valor comercial menos custos diretos e entrega                      |
| Resultado do período | Resultados das vendas menos despesas, indiretos e perdas aplicáveis |
| Margem bruta         | Relação entre vendas líquidas e custos diretos                      |
| Caixa total          | Entradas financeiras menos saídas                                   |
| Caixa disponível     | Caixa total menos reserva                                           |
| Reserva financeira   | Valor separado, sem ser despesa                                     |
| Perda                | Custo sem aproveitamento comercial                                  |
| Despesa              | Gasto geral reconhecido no período                                  |

Evitar o termo “lucro líquido” no MVP. Utilizar **resultado do período**, pois não há apuração contábil formal.

## 29. Priorização

### Obrigatório no MVP

* reconhecimento correto da venda;
* vendas, recebimentos e saldos separados;
* resultado e margens;
* despesas;
* reserva;
* produtos e clientes;
* produção e perdas;
* estoque;
* compras;
* entregas;
* detalhamento;
* relatórios operacionais;
* fechamento diário.

### Importante após o núcleo

* gráficos;
* valor estimado do estoque;
* fechamento mensal;
* impressão e PDF;
* análises ampliadas de perdas.

### Evolução futura

* metas;
* previsões;
* tendências;
* giro e cobertura;
* exportações tabulares;
* análises de produtividade.

## 30. Riscos

| Risco                                           | Nível | Mitigação                             |
| ----------------------------------------------- | ----: | ------------------------------------- |
| Pagamento antecipado aparecer como venda        |  Alto | Reconhecimento na entrega ou retirada |
| Reserva ser tratada como despesa                |  Alto | Separação explícita                   |
| Custo indireto ser descontado duas vezes        |  Alto | Fórmulas distintas                    |
| Resultado parecer definitivo com custo pendente |  Alto | Identificação como provisório         |
| Consumidor Avulso distorcer clientes            | Médio | Exibição separada                     |
| Cancelamento reduzir vendas duas vezes          |  Alto | Separar reconhecimento e caixa        |
| Alteração cadastral modificar o passado         |  Alto | Fotografias históricas                |
| Gráficos esconderem inconsistências             | Médio | Acesso obrigatório ao detalhamento    |
| Indicadores demais confundirem                  | Médio | Visão resumida e seções               |

## 31. Recomendações para aprovação

O Work recomenda aprovar:

1. Venda reconhecida na entrega ou retirada.
2. Pagamento antecipado separado de venda.
3. Fórmulas comerciais e financeiras apresentadas.
4. Correção do sinal da taxa de entrega para **adição**.
5. Resultado provisório quando houver pendências.
6. Despesas por ocorrência e caixa por pagamento.
7. Reserva automática calculada sobre recebimentos confirmados.
8. Margens com nomes e bases distintas.
9. Consumidor Avulso fora do ranking de clientes.
10. Indicadores obrigatórios de produção e estoque.
11. Valor do estoque classificado como estimado.
12. Indicadores de entrega definidos.
13. Cancelamentos e estornos sem duplicidade.
14. Filtros e detalhamento reconciliáveis.
15. Cinco gráficos recomendados.
16. Relatórios operacionais separados do dashboard.
17. Preservação histórica e ajustes posteriores vinculados.
18. Fechamento diário sem bloqueio.
19. Fechamento mensal como relatório.
20. Metas e tendências adiadas.
21. Vocabulário gerencial oficial.
22. Priorização funcional apresentada.

## Parecer final

O Bloco 8 está **aprovável com as vinte e duas recomendações apresentadas**.

Após a deliberação da Sala de Reuniões, o Work deverá aguardar autorização expressa antes do Bloco 9.
