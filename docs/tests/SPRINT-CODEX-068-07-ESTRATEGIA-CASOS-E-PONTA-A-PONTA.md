# SPRINT-CODEX-068 — Estratégia de Testes e Validação

## 1. Camadas

- **Unidade/domínio:** fórmulas, invariantes, máquinas de estado, arredondamento e políticas puras.
- **Integração:** banco real temporário, restrições, transações, rollback, idempotência e reconciliação entre módulos.
- **Bancada do Codex:** instalação controlada, fluxos críticos, falhas injetadas, backup e restauração; somente em Sprint futura autorizada.
- **Homologação simulada do Work:** execução independente usando evidências e dados conhecidos.
- **Operacional real:** Sala de Reuniões após as etapas anteriores.

Toda execução registra versão, ambiente, dados, passos, resultado esperado/obtido, evidências e defeitos. Testes não devem depender da ordem entre si.

## 2. Cobertura automatizada mínima futura

- 100% das transições permitidas e bloqueadas descritas;
- invariantes de estoque com testes gerativos;
- custo médio e dinheiro sem ponto flutuante;
- atomicidade com falha em cada fronteira relevante;
- repetição idempotente e conflito de fingerprint;
- separação venda/recebimento/caixa/resultado/reserva;
- eventos obrigatórios e imutabilidade;
- reconciliação de projeções com razões.

## 3. Casos obrigatórios

| ID | Cenário e passos essenciais | Resultado esperado |
|---|---|---|
| CT-01 | Comprar caixa/unidade diferente da unidade de controle; receber | quantidade convertida antes do movimento e custo |
| CT-02 | Duas entradas com quantidades/custos distintos | custo médio pela fórmula, saídas não o recalculam |
| CT-03 | Confirmar pedido sem produto disponível | Aguardando Produção; necessidade criada; sem saldo negativo |
| CT-04 | Pedido misto com parte disponível | reserva disponível e necessidade do restante; atendimento continua integral |
| CT-05 | Pagamento parcial antes do atendimento | caixa aumenta; venda não reconhecida; saldo correto |
| CT-06 | Iniciar OP sem um insumo | bloqueio total; nenhuma reserva parcial; auditoria |
| CT-07 | Concluir OP com consumo real diferente | movimentos reais, custo histórico e justificativa preservados |
| CT-08 | Conclusão parcial | OP encerrada parcialmente; produto real entra; nova necessidade para restante |
| CT-09 | Perda total da produção | consumos/perda registrados; zero produto pronto |
| CT-10 | Cancelar após início | movimentos não apagados; liberação/correções e pendência apropriadas |
| CT-11 | Entregar com saldo financeiro pendente permitido | venda reconhecida; saldo permanece a receber |
| CT-12 | Registrar tentativa frustrada | sem baixa/venda; tentativa e custo preservados; reserva mantida |
| CT-13 | Registrar devolução | não retorna ao vendável; destino, perda e correção vinculados |
| CT-14 | Estorno parcial | caixa e reserva revertidos proporcionalmente; estado financeiro projetado |
| CT-15 | Inventário com divergência | ajustes compensatórios por item; fotografia e motivo |
| CT-16 | Tentar saída maior que disponível | transação bloqueada; saldos intactos; evento |
| CT-17 | Ajustar depois do fechamento | fechamento imutável; ajuste vinculado exibido separadamente |
| CT-18 | Reserva automática seguida de estorno | movimento automático e reversão vinculada; reserva correta |
| CT-19 | Operação emergencial retroativa | nova identificação, justificativa, datas de ocorrência/registro e auditoria |
| CT-20 | Repetir confirmação com mesma chave | um efeito; resposta anterior retornada; fingerprint diferente bloqueado |
| CT-21 | Alterar receita após uso | nova versão; OP histórica conserva versão anterior |
| CT-22 | Gerar backup | pacote consistente, manifesto/hash e catálogo/auditoria |
| CT-23 | Restaurar backup isoladamente | integridade, contagens e reconciliações aprovadas antes da ativação |
| CT-24 | Falhar entre passos de conclusão/entrega/pagamento | rollback total ou recuperação idempotente após commit |
| CT-25 | Comparar dashboard às origens | vendas, caixa, resultado, estoque e reserva reconciliam sem dupla contagem |

## 4. Testes adicionais de segurança e histórico

- timeout exatamente após 30 minutos de inatividade;
- tentativa excepcional sem reidentificação é bloqueada;
- credencial ausente de banco, log e backup em claro;
- inativação mantém referências históricas;
- tentativa de editar movimento/evento terminal é rejeitada;
- cadeia original/correção permanece consultável;
- filtros não alteram totais e são preservados na navegação.

## 5. Cenário ponta a ponta E2E-01

### Preparação

Ambiente vazio e versionado; relógio controlado; diretórios de backup isolados; saldos iniciais zero.

### Execução e oráculos

1. cadastrar Operador Principal e autenticar;
2. cadastrar cliente com endereço;
3. cadastrar ingredientes e embalagem em unidades de controle;
4. cadastrar produto, categoria e tamanho;
5. publicar versão de receita;
6. registrar e receber compra com conversão;
7. conferir razão, físico, disponível e custo médio;
8. criar pedido de entrega sem estoque pronto;
9. confirmar pagamento parcial antecipado e conferir caixa sem venda;
10. criar OP vinculada;
11. iniciar OP e conferir reserva de insumos;
12. registrar consumo real e perda;
13. concluir integralmente e conferir consumo/entrada/custo;
14. conferir reserva automática do produto para o pedido;
15. sair para entrega e confirmar entrega;
16. conferir baixa e reconhecimento da venda uma única vez;
17. receber saldo restante e reconciliar financeiro;
18. registrar despesa ocorrida e paga;
19. conferir movimento automático/manual da reserva conforme configuração;
20. consultar resultado da venda e do período, sem dupla apropriação;
21. realizar fechamento e conferir fotografia;
22. registrar correção posterior e preservar fechamento;
23. consultar cadeia de auditoria e pendências;
24. gerar backup e validar hash/manifesto;
25. restaurar em ambiente isolado;
26. repetir todas as reconciliações e comparar contagens/saldos com a origem.

### Aceite

- todas as invariantes permanecem verdadeiras;
- nenhum efeito duplicado após repetição dos comandos terminais;
- saldo de estoque, caixa e reserva deriva dos respectivos razões;
- venda ocorre somente no passo 15;
- fechamento original não muda no passo 22;
- ambiente restaurado é equivalente ao ambiente de origem nos dados persistidos.

## 6. Injeção de falhas

Para cada transação crítica, falhar antes/depois de cada gravação simulável e antes da resposta. Confirmar rollback quando não há commit e recuperação idempotente quando o commit ocorreu. Interrupção do processo e falta de espaço devem ser incluídas em backup, restauração e atualização.

## 7. Evidências

Cada caso gera relatório, logs sanitizados, estado inicial/final, consultas de reconciliação, hashes de backup quando aplicável e vínculo com requisito. Evidência não pode conter segredo ou dado pessoal desnecessário.

## 8. Responsabilidades de validação

Codex especifica e futuramente executa bancada somente com autorização. Work homologa independentemente. Sala executa teste real e decide portões. Nenhuma aprovação é inferida de resultado automatizado isolado.