# Parecer do Work — Sprint 1, Bloco 9

## Classificação

**Funcionalmente viável, com controles proporcionais ao porte do negócio.**

A recomendação preserva responsabilidade e histórico sem obrigar o operador a preencher um formulário de cartório para vender um pudim.

## 1. Modelo de usuários

### MVP

* uma conta individual de **Operador Principal**;
* conta compartilhada proibida;
* toda ação registrada em nome desse operador;
* ajudantes e entregadores sem acesso próprio inicialmente.

Quando uma segunda pessoa passar a operar o sistema regularmente, contas individuais serão obrigatórias.

### Evolução futura

| Perfil        | Função                                           |
| ------------- | ------------------------------------------------ |
| Administrador | Configurações, usuários e informações gerenciais |
| Operador      | Pedidos, compras, pagamentos e rotinas           |
| Produção      | OPs, consumo, rendimento e perdas                |
| Entrega       | Entregas atribuídas e confirmações               |
| Consulta      | Visualização sem alterações                      |

## 2. Responsabilidades do Operador Principal

Exclusivas no MVP:

* ajustes de estoque;
* estornos;
* cancelamentos;
* baixa de dívida;
* correções de operações concluídas;
* movimentações manuais da reserva;
* alteração de receitas;
* fechamento;
* inativação e reativação;
* consulta a custos, margens, caixa e reserva;
* tratamento de inconsistências.

## 3. Regras de acesso

* acesso sempre identificado;
* alteração de credencial exige identificação atual;
* recuperação de acesso deverá registrar ocorrência;
* tentativas inválidas repetidas provocarão bloqueio temporário;
* saída manual sempre disponível;
* dispositivo compartilhado exige encerramento ou bloqueio da sessão;
* após 30 minutos de inatividade, o sistema deverá solicitar nova identificação.

Uma ação crítica iniciada depois de longa inatividade deverá exigir nova identificação.

## 4. Classificação das ações

| Classe      | Exemplos                                                       | Controle                                             |
| ----------- | -------------------------------------------------------------- | ---------------------------------------------------- |
| Comum       | Consultar, filtrar, pesquisar                                  | Sem confirmação adicional                            |
| Relevante   | Criar pedido, compra ou despesa                                | Validação e registro                                 |
| Crítica     | Cancelar, estornar, ajustar, registrar perda                   | Resumo, justificativa e confirmação                  |
| Excepcional | Corrigir operação concluída, baixar dívida, alterar fechamento | Exclusiva do Operador Principal e nova identificação |

Não haverá dupla aprovação humana no MVP porque existe apenas um operador.

## 5. Justificativas

Exigir justificativa para:

* cancelamento;
* estorno;
* ajuste;
* perda;
* preço negociado;
* desconto;
* correção de produção;
* correção de entrega;
* baixa de dívida;
* alteração de despesa paga;
* reserva manual;
* ajuste posterior ao fechamento.

A justificativa deverá conter:

* categoria do motivo;
* texto explicativo com pelo menos dez caracteres;
* operador;
* data e hora.

Expressões genéricas como “erro”, “ajuste” ou “outros” sem explicação não serão suficientes.

## 6. Exclusão e inativação

Recomendação: **não permitir exclusão definitiva no MVP**.

* registros incorretos serão inativados;
* duplicidades serão marcadas e vinculadas ao registro correto;
* registros utilizados permanecerão consultáveis;
* reativação exigirá justificativa;
* usuários serão desativados, não apagados;
* operações históricas continuarão mostrando os dados originais.

## 7. Fotografias históricas

Preservar em cada operação:

* cliente, telefone e endereço utilizados;
* produtos e descrições;
* preço e desconto;
* forma de pagamento;
* receita e versão;
* custos;
* taxa e custo da entrega;
* operador;
* datas;
* estados;
* justificativas;
* movimentações relacionadas.

Alterações cadastrais futuras não poderão modificar essas informações.

## 8. Registro de auditoria

Registrar:

* criação e confirmação;
* mudança relevante;
* mudança de estado;
* cancelamento;
* estorno;
* perda;
* ajuste;
* inativação e reativação;
* movimentação financeira;
* correção;
* alteração de acesso;
* tentativa crítica bloqueada.

Cada evento apresentará:

* data e hora;
* operador;
* ação;
* área afetada;
* registro relacionado;
* valor anterior e novo;
* justificativa;
* resultado da tentativa;
* operação de origem.

O histórico será exibido em linguagem humana.

## 9. Operações abertas

| Operação             | Regra                                                  |
| -------------------- | ------------------------------------------------------ |
| Pedido em elaboração | Alteração livre                                        |
| Pedido confirmado    | Alteração registrada e com consequências recalculadas  |
| OP planejada         | Editável                                               |
| OP em andamento      | Alterações restritas e justificadas                    |
| Compra não recebida  | Editável                                               |
| Despesa pendente     | Editável com histórico                                 |
| Entrega não iniciada | Endereço e programação editáveis                       |
| Entrega em andamento | Alterações bloqueadas; usar ocorrência e reagendamento |

## 10. Operações concluídas

Nenhuma operação concluída será reaberta para edição direta.

| Operação         | Correção permitida                                     |
| ---------------- | ------------------------------------------------------ |
| Pedido concluído | Ajuste comercial ou devolução vinculada                |
| Pagamento        | Estorno                                                |
| Produção         | OP corretiva, ajuste de estoque ou correção financeira |
| Compra recebida  | Devolução, reversão ou ajuste                          |
| Estoque          | Movimento compensatório                                |
| Entrega          | Ocorrência e ajuste de custo                           |
| Despesa paga     | Reversão e novo lançamento                             |
| Fechamento       | Ajuste posterior vinculado                             |

## 11. Estornos

Somente o Operador Principal poderá estornar.

O estorno deverá:

* referenciar o pagamento;
* permitir valor total ou parcial;
* nunca superar o valor líquido recebido;
* registrar forma efetiva da devolução;
* informar motivo;
* atualizar caixa e saldo;
* corrigir a reserva automática correspondente;
* preservar o pagamento original.

O estorno financeiro não altera sozinho o resultado da venda. Isso somente ocorrerá quando existir cancelamento, devolução ou ajuste comercial relacionado.

## 12. Cancelamentos

Antes da confirmação, o pedido poderá ser descartado como elaboração cancelada.

Depois da confirmação:

1. apresentar pagamentos, reservas, OPs e produtos;
2. exigir motivo;
3. confirmar estornos;
4. liberar reservas;
5. tratar produções;
6. destinar produtos ao estoque ou perda;
7. registrar o cancelamento.

Pedido entregue ou retirado não será cancelado; deverá seguir o fluxo de devolução ou reclamação.

## 13. Ajustes e perdas

* **Ajuste:** corrige diferença entre o saldo registrado e o saldo real.
* **Perda:** registra algo que existia e deixou de ter aproveitamento.

Ambos deverão preservar:

* item;
* quantidade;
* saldo anterior e posterior;
* custo;
* motivo;
* operador;
* origem.

Um ajuste não poderá ser “desfeito”. Se estiver errado, outro movimento compensatório será criado.

## 14. Produções e receitas

### Produção

* OP aberta: corrigir dentro da própria OP;
* OP parcialmente concluída: encerrar e criar nova OP;
* OP concluída: usar OP corretiva ou movimentos vinculados;
* custo histórico nunca será reescrito.

### Receita

* cada produto terá uma única versão ativa;
* versão utilizada fica imutável;
* alteração cria nova versão;
* erro descoberto posteriormente não modifica produções anteriores;
* versão inativa permanece consultável;
* reativação exige justificativa.

## 15. Controles comerciais

* preço cadastrado alterado mantém histórico;
* preço negociado exige justificativa;
* desconto exige justificativa;
* resultado negativo exige alerta e confirmação crítica;
* pedidos concluídos não aceitam alteração direta;
* mudança posterior gera ajuste comercial.

Não será utilizado limite percentual arbitrário de desconto no MVP.

## 16. Despesas e reserva

### Despesas

* pendente pode ser corrigida com histórico;
* paga não pode ser editada;
* correção de despesa paga ocorre por reversão e novo lançamento;
* possíveis duplicidades geram alerta.

### Reserva

* movimentação automática permanece vinculada ao pagamento;
* movimentação manual é crítica;
* reversão automática acompanha estorno;
* reserva sem origem válida será inconsistência crítica;
* nenhuma movimentação poderá ser apagada.

## 17. Fechamentos

Cada fechamento preservará uma fotografia do que era conhecido naquele momento.

Correções posteriores deverão mostrar:

* fechamento original;
* evento posterior;
* valor anterior;
* novo valor;
* diferença;
* justificativa.

O fechamento não será reescrito nem bloqueará novas ocorrências.

## 18. Tentativas bloqueadas

### Devem gerar auditoria

* tentativa de estoque negativo;
* estorno maior que o recebido;
* confirmação duplicada;
* alteração de operação concluída;
* exclusão de registro referenciado;
* movimentação de reserva sem origem;
* ação sem permissão;
* tentativa de acesso inválida repetida.

### Apenas mensagem operacional

* campo obrigatório vazio;
* formato incorreto;
* endereço ainda não informado durante elaboração;
* erro corrigido antes da confirmação.

## 19. Dados sensíveis

### Operacionais

* nome;
* telefone;
* endereço;
* histórico de pedidos;
* saldo do cliente.

### Gerenciais restritos

* custos;
* margens;
* resultado;
* despesas;
* caixa;
* reserva;
* inadimplência;
* preços negociados.

No MVP, somente o Operador Principal acessará informações gerenciais.

O sistema não deverá registrar senhas bancárias, números completos de cartão ou credenciais de pagamento.

Impressões para clientes não mostrarão custos, margens, reserva ou informações internas.

## 20. Privacidade

Princípios:

* coletar somente dados necessários;
* utilizar dados do cliente apenas na operação;
* permitir atualização;
* ocultar dados desnecessários em relatórios;
* restringir exportações;
* manter histórico mínimo quando necessário à rastreabilidade;
* inativar clientes que não devem mais ser utilizados.

Pedidos de eliminação ou anonimização deverão preservar operações obrigatórias e dependem de validação jurídica antes de eventual comercialização. O MVP não fará exclusão automática de dados pessoais.

## 21. Ajudantes e entregadores

Acesso próprio fica adiado.

Futuramente, entregadores poderão visualizar somente:

* entregas atribuídas;
* nome e contato necessários;
* endereço;
* itens;
* saldo a receber;
* confirmação de saída e entrega.

Não poderão visualizar custos, margens, histórico completo, despesas ou reserva.

## 22. Continuidade operacional

Quando o sistema estiver indisponível:

1. registrar manualmente número provisório;
2. anotar data, cliente, itens, valores e pagamento;
3. preservar comprovantes;
4. lançar posteriormente como **Registro emergencial**;
5. informar data da ocorrência e data do lançamento;
6. verificar duplicidade;
7. identificar o operador.

O impacto em estoque e caixa será registrado no momento do lançamento, mas o histórico indicará quando a operação realmente ocorreu. Fechamentos anteriores mostrarão o lançamento como ajuste posterior.

## 23. Duplicidades

### Bloquear

* segunda confirmação de entrega ou retirada;
* segundo encerramento da mesma OP;
* mesmo pagamento confirmado novamente;
* mesma movimentação automática processada novamente.

### Alertar e permitir com justificativa

* pedidos semelhantes;
* compras de mesmo fornecedor, data e valor;
* despesas semelhantes;
* pagamentos diferentes com mesmo valor;
* OPs semelhantes para os mesmos pedidos.

## 24. Inconsistências

| Nível       | Exemplos                                                  | Tratamento                     |
| ----------- | --------------------------------------------------------- | ------------------------------ |
| Bloqueante  | Estoque negativo, estorno superior ao recebido            | Impedir operação               |
| Crítica     | Venda sem baixa, OP sem entrada, reserva sem origem       | Suspender operação relacionada |
| Atenção     | Custo de entrega pendente, saldo vencido, OP interrompida | Exigir acompanhamento          |
| Informativa | Estoque mínimo, cadastro incompleto não utilizado         | Orientar                       |

Outras inconsistências críticas:

* reserva de produto maior que saldo físico;
* pedido cancelado ainda ativo;
* pagamento sem pedido;
* fechamento com operação incompleta.

## 25. Central de Pendências

Recomendação: incluir no MVP.

A página inicial mostrará apenas quantidades e urgências. A Central reunirá detalhes de:

* inconsistências;
* custos pendentes;
* OPs interrompidas;
* saldos vencidos;
* entregas inacabadas;
* ajustes posteriores;
* cadastros incompletos utilizados;
* registros emergenciais pendentes.

Cada pendência deverá indicar responsável, prioridade e ação necessária.

## 26. Relatórios de auditoria

### Obrigatórios

* ações críticas;
* ajustes;
* perdas;
* cancelamentos;
* estornos;
* movimentações manuais da reserva;
* correções posteriores;
* inconsistências.

### Importantes

* preços negociados;
* descontos;
* tentativas bloqueadas;
* inativações e reativações.

### Futuros

* alterações de permissões;
* análise de padrões;
* comparação entre operadores.

## 27. Consulta e exportação

Filtros do MVP:

* período;
* tipo de ação;
* módulo;
* registro;
* pedido;
* OP;
* operador.

Cliente, valor e justificativa textual serão filtros importantes após o núcleo.

Relatórios sensíveis somente poderão ser emitidos pelo Operador Principal e deverão identificar:

* operador;
* data de emissão;
* período;
* filtros;
* natureza das informações.

A emissão de relatório sensível será registrada. Impressões operacionais comuns não exigirão justificativa.

## 28. Alertas de segurança

### MVP

* tentativas inválidas repetidas;
* operação crítica bloqueada;
* ajuste posterior ao fechamento;
* movimentação manual da reserva;
* resultado negativo confirmado;
* inconsistência crítica.

### Futuro

* valores anormalmente altos;
* padrões incomuns;
* comparação entre operadores;
* alertas estatísticos.

## 29. Revisões periódicas

### Fechamento diário

* inconsistências críticas;
* entregas não finalizadas;
* custos pendentes;
* registros emergenciais;
* pagamentos e estornos;
* caixa e reserva.

### Revisão mensal

* ajustes;
* perdas;
* cancelamentos;
* estornos;
* inadimplência;
* despesas;
* movimentações manuais da reserva;
* correções posteriores.

## 30. Vocabulário oficial

| Termo              | Significado                              |
| ------------------ | ---------------------------------------- |
| Usuário            | Pessoa com conta individual              |
| Operador           | Usuário responsável pela ação            |
| Operador Principal | Responsável máximo no MVP                |
| Permissão          | Ação autorizada para um perfil           |
| Ação crítica       | Operação com impacto relevante           |
| Justificativa      | Explicação obrigatória de uma decisão    |
| Histórico          | Linha do tempo de uma operação           |
| Auditoria          | Consulta estruturada dos eventos         |
| Ajuste             | Correção compensatória                   |
| Correção           | Novo evento que trata um erro anterior   |
| Estorno            | Devolução vinculada a pagamento          |
| Cancelamento       | Encerramento antes da conclusão          |
| Inativação         | Impedimento de novo uso                  |
| Reativação         | Retorno autorizado ao uso                |
| Inconsistência     | Situação incompatível com as regras      |
| Pendência          | Situação que exige ação                  |
| Fechamento         | Fotografia gerencial de um período       |
| Ajuste posterior   | Correção registrada depois do fechamento |

## 31. Priorização

### Obrigatório no MVP

* Operador Principal individual;
* acesso identificado;
* ações críticas;
* justificativas;
* inativação;
* histórico imutável;
* correções vinculadas;
* controles de duplicidade;
* inconsistências;
* Central de Pendências;
* relatórios críticos;
* continuidade emergencial.

### Importante após o núcleo

* operadores adicionais;
* perfis simplificados;
* filtros ampliados de auditoria;
* relatórios sensíveis exportáveis;
* acesso limitado para entregas.

### Evolução futura

* permissões detalhadas;
* dupla aprovação;
* alertas estatísticos;
* comparação entre operadores;
* revisão automatizada de padrões.

## 32. Riscos

| Risco                                         |   Nível | Mitigação                       |
| --------------------------------------------- | ------: | ------------------------------- |
| Conta compartilhada eliminar responsabilidade |    Alto | Conta individual                |
| Operação concluída ser reescrita              | Crítico | Eventos corretivos              |
| Justificativas inúteis                        |   Médio | Categoria e texto mínimo        |
| Dados financeiros expostos                    |    Alto | Acesso restrito                 |
| Correção retroativa alterar fechamento        |    Alto | Ajuste posterior                |
| Emergência gerar duplicidade                  |    Alto | Número provisório e conferência |
| Excesso de controles prejudicar uso           |   Médio | Controles proporcionais         |
| Exclusão apagar histórico                     | Crítico | Apenas inativação               |
| Reserva divergir do caixa                     |    Alto | Origem e reversão vinculadas    |

## 33. Recomendações para aprovação

O Work recomenda aprovar:

1. Uma conta individual de Operador Principal no MVP.
2. Proibição de contas compartilhadas.
3. Perfis adicionais adiados.
4. Bloqueio após 30 minutos de inatividade.
5. Quatro classes de ações.
6. Nova identificação para ações excepcionais.
7. Categoria e texto nas justificativas.
8. Proibição de exclusão definitiva.
9. Fotografias históricas imutáveis.
10. Registro funcional de auditoria.
11. Operações concluídas sem reabertura direta.
12. Estornos exclusivos do Operador Principal.
13. Ajuste e perda como conceitos distintos.
14. Receitas utilizadas imutáveis.
15. Controles comerciais e financeiros propostos.
16. Fechamentos com ajustes posteriores.
17. Auditoria somente das tentativas bloqueadas relevantes.
18. Restrição de informações financeiras.
19. Acesso de ajudantes e entregadores adiado.
20. Procedimento de continuidade operacional.
21. Bloqueios e alertas de duplicidade.
22. Classificação das inconsistências.
23. Central de Pendências no MVP.
24. Relatórios de auditoria priorizados.
25. Vocabulário funcional oficial.

## Parecer final

O Bloco 9 está **aprovável com as vinte e cinco recomendações apresentadas**.

Após a deliberação da Sala de Reuniões, o Work deverá aguardar autorização expressa antes do Bloco 10.
