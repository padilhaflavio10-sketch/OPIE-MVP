# Parecer do Work — Sprint 1, Bloco 3

## Classificação

**Funcionalmente viável, com decisões pendentes da Sala de Reuniões.**

A estrutura recomendada mantém o MVP simples, preserva histórico e permite crescimento sem transformar o cadastro num interrogatório policial.

## 1. Cadastros recomendados

| Cadastro               | Situação no MVP           | Finalidade                                             |
| ---------------------- | ------------------------- | ------------------------------------------------------ |
| Clientes               | Obrigatório               | Identificar compradores, entregas e histórico          |
| Produtos               | Obrigatório               | Representar cada item efetivamente vendido             |
| Categorias             | Obrigatório e simples     | Separar inicialmente empadões e pudins                 |
| Insumos                | Obrigatório               | Controlar ingredientes e embalagens                    |
| Receitas               | Obrigatório               | Definir consumo, rendimento e custo                    |
| Fornecedores           | Obrigatório, mas flexível | Apoiar compras e histórico de preços                   |
| Tamanhos/Formas        | Obrigatório               | Diferenciar apresentações e consumo                    |
| Formas de pagamento    | Obrigatório               | Registrar pagamentos integrais, parciais e antecipados |
| Categorias de despesas | Obrigatório               | Organizar despesas e resultados                        |
| Usuários               | Adiar cadastro completo   | Um operador principal é suficiente inicialmente        |
| Configurações gerais   | Obrigatório e reduzido    | Guardar parâmetros realmente necessários               |

## 2. Estrutura funcional

### Clientes

**Obrigatórios:**

* nome;
* situação: ativo ou inativo.

**Opcionais:**

* telefone;
* endereço;
* referência para entrega;
* observações.

CPF, e-mail e data de nascimento ficam fora do MVP.

O cliente pode ser alterado, mas pedidos anteriores devem preservar o nome, endereço e contato utilizados naquela operação.

Recomendação: permitir venda de pronta-entrega para **Consumidor avulso**, sem cadastro. Cliente identificado será obrigatório para encomenda ou entrega.

### Produtos

Cada combinação efetivamente vendida deverá ser cadastrada separadamente, por exemplo:

* Empadão de frango — pequeno;
* Empadão de frango — grande;
* Pudim tradicional — médio.

**Obrigatórios:**

* nome;
* categoria;
* sabor ou descrição;
* tamanho/apresentação;
* preço de venda;
* receita ativa;
* embalagem utilizada;
* situação.

**Opcionais:**

* observações;
* peso aproximado.

Fotos, códigos comerciais e descrições promocionais ficam para versões futuras.

Alterações de preço devem gerar histórico. Produtos já movimentados nunca serão excluídos, apenas inativados.

### Categorias

Cadastro simples, iniciado com:

* Empadões;
* Pudins.

Campos:

* nome;
* situação.

As categorias poderão ser ampliadas futuramente. Categorias utilizadas não poderão ser excluídas.

### Insumos

Recomendação: ingredientes e embalagens devem aparecer em um único cadastro chamado **Insumos**, diferenciados pelo tipo:

* ingrediente;
* embalagem.

**Obrigatórios:**

* nome;
* tipo;
* unidade de controle;
* quantidade mínima;
* situação.

**Opcionais:**

* apresentação habitual de compra;
* fator de conversão;
* observações.

O custo médio e o saldo serão calculados pelas movimentações, não digitados diretamente.

A unidade de controle não poderá ser alterada depois da primeira movimentação. Se estiver errada, o insumo deverá ser inativado e substituído.

### Receitas e fichas técnicas

Cada produto vendável terá uma receita ativa própria. Isso evita cálculos obscuros entre sabores, tamanhos e formas.

**Obrigatórios:**

* produto;
* versão;
* rendimento;
* ingredientes;
* quantidade de cada ingrediente;
* embalagem;
* situação da versão.

**Opcionais:**

* perda prevista;
* instruções resumidas;
* observações.

Uma receita utilizada em produção ficará imutável. Qualquer alteração criará uma nova versão. Produções anteriores conservarão a receita e os custos utilizados na época.

### Fornecedores

**Obrigatórios:**

* nome;
* situação.

**Opcionais:**

* telefone;
* documento;
* endereço;
* observações.

Uma compra poderá ser registrada com fornecedor avulso, sem exigir cadastro completo, mas o nome informado ficará preservado.

Não haverá tabela de preços por fornecedor no MVP. O histórico de compras já permitirá consultar onde e por quanto cada insumo foi adquirido.

### Tamanhos e formas

O cadastro representará a apresentação comercial e a forma usada como referência.

**Obrigatórios:**

* nome do tamanho;
* descrição da forma ou capacidade;
* situação.

**Opcionais:**

* dimensões;
* peso aproximado;
* observações.

Não será controlada a quantidade física de formas reutilizáveis no MVP. Cada produto por tamanho terá sua própria receita.

### Formas de pagamento

Cadastro inicial recomendado:

* dinheiro;
* Pix;
* cartão;
* outro.

Deverá permitir ativação e inativação. Uma forma já utilizada continuará aparecendo no histórico.

### Categorias de despesas

Cadastro inicial simples para classificar despesas como:

* insumos;
* entrega;
* gás;
* energia;
* água;
* mão de obra;
* taxas;
* manutenção;
* outras.

A categoria organiza o resultado financeiro, mas não altera operações anteriores quando seu nome for modificado.

### Usuários

O cadastro completo de usuários não é necessário para o MVP se apenas uma pessoa operar o sistema.

Recomendação: configurar um **operador principal**. Controle de acesso, senhas e múltiplos usuários ficam para evolução futura.

### Configurações gerais

Manter somente:

* nome do negócio;
* nome do operador principal;
* percentual-padrão da reserva;
* comportamento da reserva: manual, automático ou ambos;
* dados básicos exibidos nos relatórios.

Saldo inicial deverá ser registrado como movimentação financeira, não como configuração editável.

## 3. Relacionamentos funcionais

* Um cliente poderá possuir vários pedidos.
* Um produto pertence a uma categoria e a um tamanho.
* Um produto possui uma receita ativa e poderá ter versões anteriores.
* Uma receita utiliza vários insumos.
* Um produto utiliza uma embalagem.
* Um fornecedor poderá aparecer em várias compras.
* Um insumo poderá ser comprado de fornecedores diferentes.
* Uma produção utiliza uma versão específica da receita.
* Uma venda preserva produto, preço, desconto e custo daquele momento.
* Um pagamento utiliza uma forma de pagamento.
* Uma despesa utiliza uma categoria.

## 4. Regras gerais de alteração e histórico

* Nenhum cadastro utilizado em operações poderá ser excluído definitivamente.
* Registros sem uso criados por engano também deverão ser inativados, mantendo rastreabilidade.
* Alterações de preço, receita, custo, percentual de reserva e unidades relevantes devem manter histórico.
* Clientes e fornecedores podem ter seus dados atuais corrigidos, sem modificar operações antigas.
* Produto, insumo, categoria ou forma de pagamento inativos não poderão ser utilizados em novas operações.
* Uma receita utilizada não poderá ser reescrita; deverá receber nova versão.
* Preço, custo, endereço de entrega e demais informações operacionais deverão ser preservados em cada venda, compra ou produção.
* O sistema deverá alertar sobre possíveis duplicidades de clientes, produtos e insumos antes de concluir um novo cadastro.

## 5. Itens adiados

* fotografias de produtos;
* fidelidade e aniversário de clientes;
* tabela de preços por fornecedor;
* controle patrimonial das formas;
* múltiplos usuários e permissões;
* códigos de barras;
* variações avançadas de produtos;
* documentos fiscais;
* cadastro de transportadoras;
* integração externa.

## 6. Principais riscos

| Risco                                            | Nível | Mitigação                                               |
| ------------------------------------------------ | ----: | ------------------------------------------------------- |
| Unidade incorreta gerar estoque e custos errados |  Alto | Bloquear alteração após a primeira movimentação         |
| Receita antiga ser sobrescrita                   |  Alto | Versionamento obrigatório                               |
| Duplicidade de produtos ou insumos               | Médio | Alerta antes do cadastro                                |
| Endereço atual alterar entrega antiga            |  Alto | Preservar os dados utilizados no pedido                 |
| Excesso de campos dificultar o uso               | Médio | Manter somente campos essenciais                        |
| Produto, tamanho e receita serem confundidos     |  Alto | Cada combinação vendida terá produto e receita próprios |
| Falta de identificação do responsável            | Médio | Operador principal obrigatório                          |

## 7. Decisões solicitadas à Sala de Reuniões

O Work recomenda aprovação das seguintes opções:

1. Permitir **Consumidor avulso** em vendas de pronta-entrega.
2. Exigir cliente identificado para encomendas e entregas.
3. Cadastrar separadamente cada combinação de produto, sabor e tamanho.
4. Manter categorias editáveis, começando por Empadões e Pudins.
5. Unificar ingredientes e embalagens no cadastro funcional de **Insumos**, diferenciados por tipo.
6. Permitir compras com fornecedor avulso.
7. Criar uma receita própria e versionada para cada produto/tamanho.
8. Não controlar a quantidade física das formas reutilizáveis no MVP.
9. Adiar o cadastro completo de usuários e utilizar um operador principal.
10. Proibir exclusão definitiva, utilizando inativação e histórico.

## Parecer final

O Bloco 3 está **aprovável com as dez decisões recomendadas**. Nenhuma recomendação conflita com os Blocos 1 e 2.

Após a decisão da Sala de Reuniões, o Work deverá aguardar. O próximo bloco não está automaticamente autorizado.
