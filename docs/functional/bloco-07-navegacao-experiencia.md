# Parecer do Work — Sprint 1, Bloco 7

## Classificação

**Funcionalmente viável, com recomendações objetivas para aprovação.**

A experiência proposta mantém coerência com os Blocos 1 a 6 e prioriza as atividades diárias, sem transformar a página inicial num painel de avião.

## 1. Perfil do usuário

O MVP considera:

* um operador principal;
* uso diário e frequente;
* pouca familiaridade com sistemas;
* necessidade de registrar operações enquanto trabalha;
* preferência por poucos campos e linguagem simples.

Ao abrir o sistema, o usuário precisa identificar rapidamente:

1. o que deve entregar hoje;
2. o que precisa produzir;
3. o que está atrasado;
4. o que falta no estoque;
5. quem ainda precisa pagar.

## 2. Menu principal

Ordem recomendada:

1. **Início**
2. **Pedidos**
3. **Produção**
4. **Estoque**
5. **Compras**
6. **Financeiro**
7. **Cadastros**
8. **Relatórios**
9. **Configurações**

### Cadastros

* Clientes;
* Produtos e Receitas;
* Insumos;
* Fornecedores;
* Tamanhos e Formas;
* Formas de Pagamento;
* Categorias de Despesas.

Configurações ficará visualmente separada por ser pouco utilizada. O menu não deverá possuir mais de dois níveis.

## 3. Página inicial

A página inicial será operacional, não um relatório completo.

### Informações essenciais

* pedidos e entregas de hoje;
* pedidos atrasados;
* pedidos aguardando produção;
* produções em andamento ou interrompidas;
* itens abaixo do estoque mínimo;
* pagamentos vencidos;
* custos de entrega pendentes.

### Resumo reduzido

* vendas do dia;
* valores recebidos;
* saldo pendente.

Indicadores analíticos detalhados pertencem ao Bloco 8.

## 4. Ações rápidas

| Ação                | Prioridade |
| ------------------- | ---------- |
| Novo pedido         | Essencial  |
| Venda rápida        | Essencial  |
| Registrar pagamento | Essencial  |
| Criar OP            | Essencial  |
| Registrar compra    | Essencial  |
| Confirmar entrega   | Essencial  |
| Confirmar retirada  | Essencial  |
| Consultar cliente   | Importante |
| Ajustar estoque     | Secundária |
| Registrar perda     | Secundária |

Ações críticas como ajuste e perda não devem ocupar o mesmo destaque de uma venda.

## 5. Criação de pedidos

### Venda rápida

1. selecionar **Venda rápida**;
2. escolher produtos e quantidades;
3. confirmar preços;
4. aplicar desconto, se houver;
5. informar pagamento;
6. confirmar retirada;
7. apresentar resumo.

Consumidor Avulso será preenchido automaticamente.

### Encomenda

1. selecionar ou cadastrar cliente;
2. incluir produtos;
3. definir retirada ou entrega;
4. informar data e horário;
5. confirmar endereço, quando necessário;
6. registrar sinal ou pagamento opcional;
7. revisar resumo;
8. confirmar.

Se faltar produto, o pedido ficará automaticamente em **Aguardando produção**.

### Pedido misto

O sistema exibirá claramente:

* quantidade disponível;
* quantidade reservada;
* quantidade que precisa ser produzida.

O pedido somente ficará Pronto quando todos os itens estiverem reservados.

## 6. Tela do pedido

### Visível imediatamente

* número;
* cliente;
* data prometida;
* retirada ou entrega;
* status comercial;
* status financeiro;
* itens;
* total;
* valor pago;
* saldo;
* principal próxima ação.

### Seções secundárias

* pagamentos e estornos;
* produção vinculada;
* reservas;
* endereço e entrega;
* alterações;
* histórico completo.

Alertas como atraso, falta de produção ou saldo pendente deverão aparecer próximos da ação relacionada.

## 7. Listas operacionais

| Lista      | Informações principais                                 |
| ---------- | ------------------------------------------------------ |
| Pedidos    | Número, cliente, data, modalidade, total e dois status |
| Produções  | OP, produto, quantidade, previsão, prioridade e estado |
| Estoque    | Item, físico, reservado, disponível, mínimo e situação |
| Compras    | Data, fornecedor, total e situação                     |
| Clientes   | Nome, telefone, última compra e situação               |
| Produtos   | Produto, tamanho, preço e situação                     |
| Pagamentos | Data, pedido, cliente, valor, forma e situação         |
| Entregas   | Horário, pedido, cliente, endereço, saldo e estado     |

Cada linha terá apenas uma ação principal: **Abrir**. Ações críticas acontecerão na tela de detalhe.

Urgências serão destacadas por texto, ícone e cor.

## 8. Busca global

Recomendação: incluir no MVP uma busca sempre acessível.

Pesquisar por:

* número de pedido;
* cliente;
* telefone;
* produto;
* número da OP.

Resultados deverão ser agrupados por tipo. Correspondência exata de pedido ou OP terá prioridade.

Busca por datas e estados será realizada pelos filtros das listas.

## 9. Filtros

### Padrão

* período;
* status;
* entrega ou retirada;
* atraso;
* urgência;
* estoque crítico;
* saldo pendente.

### Avançado

* cliente;
* produto;
* forma de pagamento;
* fornecedor;
* operador;
* categoria.

### Futuro

* filtros personalizados;
* combinações salvas;
* filtros compartilhados.

Ao retornar de um detalhe, a lista deverá manter filtros e posição anteriores.

## 10. Formulários

Princípios:

* ordem igual à rotina real;
* campos obrigatórios claramente indicados;
* dados opcionais agrupados em “Mais informações”;
* valores padrão seguros;
* cálculos automáticos;
* validação próxima ao campo;
* resumo antes de operações críticas;
* aviso antes de sair com alterações não salvas.

### Utilização

* **Formulário completo:** pedidos, produtos, receitas e produções;
* **Janela rápida:** pagamento, confirmação de retirada e entrega;
* **Ação direta:** filtros e consultas;
* **Etapas:** somente quando o processo não couber de forma clara em uma tela.

Rótulos deverão permanecer visíveis mesmo após o preenchimento.

## 11. Estados e cores

Todo estado deverá apresentar:

* texto;
* ícone;
* cor;
* explicação ao posicionar ou selecionar.

Padrão recomendado:

| Uso                            | Cor funcional |
| ------------------------------ | ------------- |
| Em andamento ou informativo    | Azul          |
| Atenção ou pendência           | Amarelo       |
| Concluído ou disponível        | Verde         |
| Erro, perda ou bloqueio        | Vermelho      |
| Rascunho, cancelado ou inativo | Cinza         |

A cor nunca será a única forma de identificação.

## 12. Alertas

### Críticos

* inconsistência de dados;
* tentativa de estoque negativo;
* conclusão incompleta de operação;
* pagamento incompatível.

Não podem ser dispensados sem resolução.

### Urgentes

* pedido atrasado;
* produção atrasada ou interrompida;
* pagamento vencido.

### Atenção

* estoque mínimo;
* entrega próxima;
* custo de entrega pendente;
* saldo pendente ainda não vencido.

### Informativos

* operação concluída;
* registro atualizado;
* reserva realizada.

Cada alerta deverá oferecer a ação relacionada, como **Abrir pedido** ou **Ver insumo**.

## 13. Confirmações críticas

| Ação               | Resumo obrigatório antes de confirmar          |
| ------------------ | ---------------------------------------------- |
| Confirmar pedido   | Cliente, itens, total, data e modalidade       |
| Iniciar produção   | Produto, receita, quantidade e reservas        |
| Concluir produção  | Consumo, rendimento, perdas e custos           |
| Cancelar pedido    | Estoque, produção, pagamentos e estornos       |
| Estornar pagamento | Pagamento original, valor e saldo resultante   |
| Ajustar estoque    | Saldo anterior, novo saldo, diferença e motivo |
| Registrar perda    | Item, quantidade, custo e motivo               |
| Confirmar entrega  | Pedido, itens, endereço e saldo                |
| Confirmar retirada | Pedido, itens, cliente e saldo                 |
| Baixar dívida      | Cliente, pedido, valor e impacto financeiro    |

Ações simples e reversíveis não deverão pedir confirmação repetitiva.

## 14. Prevenção de erros

### Bloqueios

* estoque negativo;
* entrega sem endereço;
* encomenda sem cliente;
* conclusão de produção sem rendimento;
* pagamento acima do saldo;
* operação crítica sem justificativa;
* utilização de cadastro inativo;
* duplicação da mesma confirmação.

### Alertas

* desconto com resultado negativo;
* cliente inadimplente;
* entrega com saldo;
* estoque abaixo do mínimo;
* endereço alterado;
* preço diferente do cadastrado.

### Orientações

* sugestões de próximo passo;
* explicações breves;
* exemplos de preenchimento;
* destaque de campos opcionais.

## 15. Mensagens

Exemplos oficiais:

* **Estoque insuficiente:** “Faltam 500 g de farinha para iniciar esta produção. Registre uma compra ou ajuste o estoque.”
* **Pedido sem cliente:** “Informe o cliente para confirmar uma encomenda.”
* **Entrega sem endereço:** “Confirme o endereço antes de finalizar o pedido para entrega.”
* **Pagamento acima do saldo:** “O valor informado é R$ 10,00 maior que o saldo do pedido.”
* **Produção sem insumos:** “Esta produção não pode começar porque existem insumos indisponíveis.”
* **Pedido confirmado:** “Pedido confirmado. Os produtos disponíveis foram reservados.”
* **Alteração salva:** “Alterações salvas com sucesso.”
* **Cancelamento:** “Cancelamento registrado. Reservas e valores foram tratados conforme o resumo apresentado.”

Mensagens técnicas internas nunca deverão aparecer ao operador.

## 16. Estados vazios

| Situação             | Orientação                                                                  |
| -------------------- | --------------------------------------------------------------------------- |
| Nenhum pedido        | “Ainda não há pedidos. Criar novo pedido.”                                  |
| Nenhum cliente       | “Cadastre o primeiro cliente ou use Consumidor Avulso em uma venda rápida.” |
| Nenhum produto       | “Cadastre um produto antes de registrar vendas.”                            |
| Nenhuma produção     | “Crie uma OP para produção ou consulte pedidos pendentes.”                  |
| Nenhuma compra       | “Registre uma compra para iniciar o estoque.”                               |
| Nenhuma movimentação | “Este item ainda não possui movimentações.”                                 |
| Busca sem resultado  | “Nenhum resultado encontrado. Revise os termos ou limpe os filtros.”        |

## 17. Navegação contextual

Relacionamentos deverão ser acessíveis diretamente:

* pedido → cliente;
* pedido → pagamentos;
* pedido → OP;
* produção → pedidos;
* produto → receita;
* insumo → movimentações;
* compra → fornecedor;
* cliente → pedidos;
* venda → entrega.

A tela deverá oferecer retorno ao ponto anterior, preservando filtros. Informações críticas não deverão ficar escondidas exclusivamente em abas.

## 18. Histórico visual

O histórico aparecerá como linha do tempo, em linguagem humana:

> “25/07/2026, 14:30 — Operador principal confirmou o pedido.”

Quando houver alteração relevante:

> “Taxa de entrega alterada de R$ 8,00 para R$ 10,00. Motivo: mudança de endereço.”

Cada evento mostrará:

* data e hora;
* responsável;
* ação;
* valores anteriores e novos, quando aplicável;
* justificativa;
* ligação com a operação relacionada.

## 19. Acessibilidade básica

Obrigatório no MVP:

* texto legível;
* contraste adequado;
* botões com área confortável;
* navegação por teclado;
* foco visível;
* ícones acompanhados de texto;
* rótulos persistentes;
* mensagens próximas ao problema;
* linguagem direta.

## 20. Tamanhos de tela

Prioridade:

1. computador;
2. notebook;
3. tablet;
4. celular.

O MVP deverá funcionar integralmente em computador e notebook.

Tablet é importante para consultas e confirmações rápidas. Uso completo em celular fica para evolução futura, sem impedir que a estrutura seja adaptada posteriormente.

## 21. Produtividade

| Recurso                                | Prioridade  |
| -------------------------------------- | ----------- |
| Navegação básica por teclado           | Obrigatório |
| Preenchimento pelo cliente selecionado | Obrigatório |
| Produtos recentes ou mais usados       | Importante  |
| Duplicar pedido como novo rascunho     | Importante  |
| Repetir última venda                   | Importante  |
| Impressão rápida                       | Importante  |
| Filtros salvos                         | Futuro      |
| Ações em lote                          | Futuro      |
| Atalhos personalizados                 | Futuro      |

Duplicações sempre gerarão novo número e estado **Em elaboração**.

## 22. Vocabulário oficial

| Termo              | Significado                                         |
| ------------------ | --------------------------------------------------- |
| Pedido             | Registro comercial desde a elaboração               |
| Venda              | Pedido concluído por entrega ou retirada            |
| Encomenda          | Pedido confirmado para atendimento futuro           |
| OP                 | Ordem que autoriza e registra uma produção          |
| Insumo             | Ingrediente ou embalagem controlada                 |
| Produto pronto     | Produto concluído e disponível ou reservado         |
| Reserva            | Quantidade separada sem saída física                |
| Disponível         | Saldo físico menos reservas                         |
| Retirada           | Entrega direta ao cliente no local                  |
| Entrega            | Envio ao endereço informado                         |
| Pagamento          | Valor efetivamente recebido                         |
| Saldo              | Valor ainda devido                                  |
| Estorno            | Devolução vinculada a pagamento                     |
| Perda              | Item sem aproveitamento comercial                   |
| Ajuste             | Correção justificada de estoque                     |
| Reserva financeira | Valor separado do caixa disponível, sem ser despesa |

## 23. Jornadas essenciais

### Venda rápida

Início → Venda rápida → produtos → pagamento → resumo → confirmar retirada.

### Encomenda

Novo pedido → cliente → produtos → data → modalidade → valores → confirmação → produção, se necessária.

### Produzir para pedido

Pedido aguardando produção → criar OP → iniciar → concluir → produtos reservados → pedido Pronto.

### Confirmar retirada

Pedidos prontos → abrir pedido → receber saldo ou autorizar pendência → confirmar retirada → gerar comprovante.

### Confirmar entrega

Entregas de hoje → abrir pedido → confirmar endereço → sair para entrega → confirmar entrega → registrar custo.

### Registrar compra

Compras → nova compra → fornecedor → itens e conversões → revisar → confirmar recebimento.

### Ajustar estoque

Estoque → item → ajustar → informar quantidade e motivo → revisar diferença → confirmar.

### Pagamento posterior

Pedido com saldo → registrar pagamento → forma e valor → confirmar → atualizar situação financeira.

### Cancelar pedido

Pedido → cancelar → informar motivo → revisar efeitos → confirmar estornos, reservas e destino dos produtos.

### Histórico do cliente

Busca global → cliente → pedidos → selecionar operação → consultar histórico.

## 24. Priorização

### Obrigatório no MVP

* menu principal;
* página inicial operacional;
* ações rápidas essenciais;
* listas enxutas;
* busca global;
* filtros básicos;
* formulários padronizados;
* status textuais;
* alertas críticos;
* confirmações;
* mensagens claras;
* estados vazios;
* histórico visual;
* acessibilidade básica.

### Importante após o núcleo do MVP

* produtos mais utilizados;
* duplicação de pedidos;
* impressão rápida;
* uso otimizado em tablet;
* filtros avançados.

### Evolução futura

* experiência completa em celular;
* filtros salvos;
* ações em lote;
* atalhos personalizados;
* personalização visual.

## 25. Riscos

| Risco                                   | Nível | Mitigação                                 |
| --------------------------------------- | ----: | ----------------------------------------- |
| Página inicial excessivamente carregada | Médio | Mostrar tarefas, não relatórios completos |
| Estados confundirem o usuário           |  Alto | Texto, ícone e vocabulário único          |
| Confirmações em excesso                 | Médio | Reservá-las para ações críticas           |
| Ações críticas ficarem fáceis demais    |  Alto | Resumo de impacto antes da confirmação    |
| Menu crescer sem controle               | Médio | Priorizar operação e agrupar cadastros    |
| Histórico apresentar linguagem técnica  | Médio | Linha do tempo em linguagem humana        |
| Celular ampliar prematuramente o escopo |  Alto | Priorizar computador e notebook           |
| Duplicação gerar pedidos reais          |  Alto | Sempre criar rascunho com novo número     |

## 26. Recomendações para aprovação

O Work recomenda aprovar:

1. Menu principal e agrupamentos propostos.
2. Página inicial focada em tarefas.
3. Nove ações rápidas classificadas.
4. Fluxos de venda rápida e encomenda.
5. Busca global no MVP.
6. Listas com poucas colunas e uma ação principal.
7. Filtros básicos preservados ao retornar.
8. Formulários com validação durante o preenchimento.
9. Status sempre com texto, ícone e cor.
10. Quatro níveis de alertas.
11. Confirmações somente para ações críticas.
12. Bloqueios e alertas definidos neste parecer.
13. Mensagens em linguagem humana.
14. Estados vazios orientativos.
15. Navegação contextual entre operações.
16. Histórico em linha do tempo.
17. Acessibilidade básica obrigatória.
18. Prioridade para computador e notebook.
19. Tablet como importante e celular como futuro.
20. Vocabulário funcional oficial.
21. Jornadas essenciais descritas.
22. Priorização funcional apresentada.

## Parecer final

O Bloco 7 está **aprovável com as vinte e duas recomendações apresentadas**.

Após a deliberação da Sala de Reuniões, o Work deverá aguardar autorização expressa antes do Bloco 8.
