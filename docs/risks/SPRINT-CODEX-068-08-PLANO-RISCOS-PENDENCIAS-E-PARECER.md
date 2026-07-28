# SPRINT-CODEX-068 — Plano Futuro, Riscos, Pendências e Parecer

## 1. Plano de implementação futura

Nenhuma etapa abaixo está autorizada por esta Sprint.

| Etapa | Objetivo e requisitos | Dependências / testes / evidências | Aceite e rollback |
|---|---|---|---|
| 0. Fundação | estrutura, banco local, unidade de trabalho, IDs, dinheiro/quantidade | decisão de stack; testes de transação e empacotamento | instalação vazia; remoção sem dados reais |
| 1. Identidade/auditoria | operador, sessão, timeout, eventos | fundação; segurança e imutabilidade | ações identificadas; rollback de versão |
| 2. Cadastros/receitas | entidades, inativação, versionamento | identidade; testes históricos | versão usada imutável |
| 3. Compras/estoque | conversão, movimentos, reservas, custo médio | cadastros; CT-01/02/15/16 | razão reconciliado; restauração prévia |
| 4. Pedidos | itens, snapshots, estados e reservas | estoque; CT-03/04/21 | sem venda precoce |
| 5. Produção | OP, consumo, perdas, saída | receitas/estoque/pedidos; CT-06–10 | conclusão atômica |
| 6. Financeiro/reserva | pagamentos, estornos, despesas, caixa | pedidos; CT-05/14/18 | separação das cinco dimensões |
| 7. Atendimento | entrega/retirada, venda, devolução | pedidos/estoque/financeiro; CT-11–13/20 | baixa e venda únicas |
| 8. Pendências/relatórios | inconsistências, dashboard, fechamento | todos os razões; CT-17/25 | totais detalháveis |
| 9. Backup/instalação | cópia, restauração, atualização | schema estável; CT-22–24/E2E | restauração independente comprovada |
| 10. Homologação | E2E, bancada, Work e Sala | etapas anteriores | nenhuma pendência bloqueante |

Cada etapa exige branch própria, revisão, manifesto/evidências, migração apenas quando autorizada, backup prévio para dados existentes e retorno à última versão compatível.

## 2. Organização documental e futura do repositório

Estrutura atual é preservada. Documentos permanecem em `docs/architecture`, `technical`, `functional`, `tests`, `risks`, `decisions`, `audits` e `sprints`.

Para implementação futura, a estrutura concreta dependerá da stack aprovada. Princípios obrigatórios:

- domínio independente de interface e banco;
- módulos pelos limites definidos;
- migrations versionadas e nunca reescritas após publicação;
- testes próximos ao componente e cenários de integração identificáveis;
- vínculo requisito → decisão → código → teste → evidência;
- branch `agent/<sprint>-<escopo>`, commits objetivos, PR auditável e merge somente autorizado;
- artefatos gerados e dados locais fora do versionamento.

## 3. Instalação, atualização e rollback

Instalação cria diretórios protegidos, schema versionado e Operador Principal. Atualização verifica assinatura/compatibilidade, exige backup restaurável, transforma cópia ou transação, executa integridade e ativa atomicamente. Falha retorna aplicação e banco à versão anterior compatível. Downgrade que não compreenda schema novo é bloqueado; restauração usa backup pré-atualização.

## 4. Migração futura — somente princípios

- **Múltiplos usuários:** identidade, autorização granular e concorrência precisam nova baseline.
- **Web/remoto/móvel:** serviço, criptografia em trânsito, disponibilidade e segurança de rede.
- **Sincronização:** IDs globais, log de mudanças, resolução de conflitos e operação offline distribuída.
- **Integrações/fiscal:** contratos versionados, filas, retentativa e conformidade.
- **Múltiplas operações:** isolamento por organização, autorização e migração de dados.
- **Exportações:** minimização, autorização e rastreamento.

Nenhum desses recursos integra o MVP atual.

## 5. Riscos técnicos

| ID | Risco | Nível | Tratamento / condição |
|---|---|---:|---|
| R-01 | backup existe mas não restaura | Crítico | teste isolado obrigatório e periódico; bloqueia portão |
| R-02 | corrupção/perda do dispositivo | Alto | cópia externa, hash, recuperação documentada |
| R-03 | duplicidade após falha de resposta | Alto | idempotência persistida e índices únicos |
| R-04 | saldo negativo ou dupla reserva | Crítico | transação, bloqueio, versão e invariantes no banco/domínio |
| R-05 | dupla contagem financeira | Crítico | classificação exclusiva e reconciliação por origem |
| R-06 | fotografia histórica incompleta | Alto | snapshots obrigatórios e testes de alteração posterior |
| R-07 | custo médio/decimal incorreto | Alto | inteiros/decimal fixo, casos de arredondamento |
| R-08 | evento de auditoria adulterado | Alto | append-only, permissões, transação, backup e verificação |
| R-09 | credencial/PII exposta | Alto | derivação segura, minimização, permissões, logs sanitizados |
| R-10 | atualização incompatível | Alto | schema versionado, backup prévio e rollback testado |
| R-11 | banco local bloqueado/sem espaço | Médio | mensagens, rollback, pendência e teste de falha |
| R-12 | uso em rede/sincronização improvisada | Alto | explicitamente não suportado no MVP |
| R-13 | política jurídica de dados indefinida | Médio | validação antes da comercialização |
| R-14 | stack/empacotamento ainda não homologados | Médio | decisão técnica antes da implementação, sem mudar arquitetura lógica |

## 6. Pendências para decisão futura

Não bloqueiam a completude documental, mas devem ser decididas antes da etapa correspondente:

1. stack concreta de desktop e banco relacional local;
2. sistemas operacionais/versões oficialmente suportados;
3. algoritmo/parâmetros concretos de credencial conforme biblioteca vigente;
4. destino externo e política operacional de criptografia/chaves de backup;
5. valores definitivos de retenção e frequência conforme volume real;
6. precisão decimal por unidade e regra final de arredondamento;
7. política jurídica de retenção e proteção de dados;
8. limiares que definem “grande ajuste” para reidentificação;
9. estratégia de assinatura e distribuição de atualização.

Nenhuma escolha funcional foi feita silenciosamente. Decisões técnicas concretas devem ser ADRs auditáveis.

## 7. Critérios técnicos de aceite consolidados

- arquitetura em camadas e módulos preserva domínio e persistência;
- dados suportam snapshots, inativação, correção e auditoria;
- máquinas de estado bloqueiam transições inválidas;
- todas as transações críticas são atômicas e idempotentes;
- estoque negativo e dupla utilização são impedidos;
- venda, recebimento, caixa, resultado e reserva são separados;
- fórmulas são reconciliáveis e sem duplicidade;
- backup possui integridade, cópia externa e restauração testável;
- falhas deixam estado anterior ou resultado único recuperável;
- 25 casos e E2E cobrem riscos centrais;
- nenhuma implementação ou migration foi produzida.

## 8. Recomendação de portão

**Não abrir o Portão 7 nesta Sprint.** Encaminhar a especificação para auditoria independente da Mona/Work. Após ausência de pendências bloqueantes e aprovação expressa da Sala, poderá ser deliberada a abertura do próximo portão. Antes de qualquer implementação, stack e parâmetros pendentes devem ser registrados, e backup/restauração deverão ser comprovados na fase autorizada.

## 9. Parecer final

**Classificação: APROVÁVEL COM RESSALVAS NÃO BLOQUEANTES.**

A especificação técnica cobre arquitetura, domínio, dados, estados, invariantes, operações, transações, idempotência, segurança, auditoria, backup, restauração, falhas, testes, instalação, evolução e riscos. Não foi identificado conflito funcional. As lacunas remanescentes são parâmetros tecnológicos dependentes de deliberação futura e não impedem auditoria desta especificação.

Backup e restauração estão adequadamente definidos documentalmente, mas permanecem risco bloqueante para implementação pronta até prova prática. Os testes cobrem os riscos críticos. É seguro encaminhar o material para auditoria independente. Não se recomenda abrir o Portão 7 antes dessa auditoria e da decisão expressa da Sala.