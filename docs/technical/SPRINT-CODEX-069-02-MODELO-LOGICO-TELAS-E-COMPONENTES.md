# SPRINT-CODEX-069 — Modelo Lógico de Telas e Componentes

## 1. Catálogo de telas

| ID | Tela | Objetivo | Estados principais | Ações |
|---|---|---|---|---|
| UX-001 | Identificação | iniciar/desbloquear sessão | inicial, inválida, bloqueada, recuperação | entrar, recuperar acesso |
| UX-002 | Primeira configuração | criar Operador e parâmetros essenciais | passo 1–6, revisão, concluída | avançar, voltar, confirmar |
| UX-010 | Início | visão operacional e próximos passos | normal, pendências, vazio | novo pedido, nova OP, receber compra |
| UX-020 | Lista de clientes | localizar e manter cadastro | vazia, filtrada, seleção | novo, editar, inativar |
| UX-021 | Cliente | dados e histórico | consulta, edição, inativo | salvar, inativar, abrir pedido |
| UX-030 | Catálogo | produtos/categorias/tamanhos | lista, edição, inativo | criar, alterar, inativar |
| UX-031 | Insumos | ingredientes/embalagens | lista, edição, inativo | criar, alterar, inativar |
| UX-032 | Receitas | versões e composição | rascunho, publicada, usada | nova versão, publicar, comparar |
| UX-033 | Fornecedores | origem de compras | lista, edição, inativo | criar, alterar, inativar |
| UX-040 | Compras | elaborar e receber compra | elaboração, revisão, recebida | adicionar item, confirmar recebimento, corrigir |
| UX-050 | Estoque | saldos e razão | normal, baixo, divergente | filtrar, abrir razão, ajustar, inventariar |
| UX-051 | Inventário | contar e ajustar | elaboração, revisão, concluído | contar, revisar, concluir |
| UX-060 | Pedidos | fila comercial | estados do pedido | novo, abrir, filtrar |
| UX-061 | Pedido | construir e acompanhar | elaboração até terminal | confirmar, pagar, produzir, atender, cancelar |
| UX-070 | Produção | fila de OPs | planejada até terminal | criar, iniciar, interromper, concluir |
| UX-071 | Ordem de Produção | consumo/rendimento/perdas | planejamento, execução, revisão, final | reservar, registrar, concluir |
| UX-080 | Entregas/retiradas | agenda e confirmação | pronto, em rota, tentativa, concluído | sair, registrar tentativa, confirmar |
| UX-090 | Financeiro | recebimentos, despesas, caixa | período, conciliado, pendente | pagar/estornar, despesa, reconciliar |
| UX-091 | Reserva financeira | saldo e movimentos | normal, insuficiente | movimento manual, consultar origem |
| UX-100 | Dashboard | indicadores reconciliáveis | carregado, provisório, divergente | filtrar, detalhar origem |
| UX-101 | Fechamento | fotografia do período | elaboração, revisão, concluído | calcular, reconciliar, concluir, ajustar |
| UX-110 | Pendências | priorizar inconsistências | aberta a reaberta | analisar, resolver, fechar, reabrir |
| UX-120 | Auditoria | consultar eventos e correções | filtros, cadeia, detalhe | filtrar, abrir origem/correção |
| UX-130 | Backup | criar e validar cópia | pronto, processando, sucesso, falha | gerar, validar, abrir catálogo |
| UX-131 | Restauração | validar e ativar pacote | seleção, validação, revisão, ativação, rollback | selecionar, validar, restaurar |
| UX-140 | Configurações | parâmetros locais | consulta, edição autorizada | salvar, testar destino, encerrar sessão |

## 2. Transições de interface

A tela deriva permissões do estado de domínio; não cria transição. Botão invisível não substitui validação: ação não permitida aparece desabilitada com explicação quando sua descoberta for importante.

- confirmação terminal troca imediatamente para estado “processando” e reutiliza a mesma chave idempotente;
- sucesso navega ao registro produzido, não a formulário vazio;
- falha antes do commit restaura edição e informa que nada mudou;
- resposta perdida consulta a chave e mostra o resultado existente;
- alteração não salva exige confirmação ao sair;
- sessão bloqueada interrompe novo comando, mas preserva o conteúdo local seguro até reidentificação.

## 3. Componentes reutilizáveis

| Componente | Contrato lógico |
|---|---|
| `AppShell` | navegação, contexto, sessão e regiões acessíveis |
| `PageHeader` | breadcrumb, título, descrição, estado e ação primária |
| `DataTable` | colunas, ordenação, filtros, seleção, vazio, carregamento |
| `FilterBar` | filtros tipados, limpar, persistir e resumo ativo |
| `StatusBadge` | estado + texto + ícone; cor nunca isolada |
| `MoneyField` | valor monetário local, inteiro internamente, validação |
| `QuantityField` | decimal fixo, unidade visível, precisão configurada |
| `DateTimeField` | ocorrência e registro distintos quando necessário |
| `EntityPicker` | busca, seleção, estado inativo e criação permitida |
| `FormField` | rótulo, ajuda, obrigatório, erro e descrição acessível |
| `StepFlow` | passos, progresso, revisão, retorno seguro |
| `CriticalActionDialog` | impacto, justificativa, reidentificação e confirmação |
| `OperationalMessage` | severidade, causa, solução, referência e ação |
| `PendingPanel` | pendências vinculadas, prioridade e resolução |
| `AuditTimeline` | eventos imutáveis, original e correções |
| `SnapshotView` | fotografia histórica distinta de cadastro atual |
| `ReconciliationPanel` | total, linhas de origem e divergências |
| `EmptyState` | situação, orientação e ação pertinente |
| `ErrorBoundaryView` | falha inesperada, referência, estado preservado e retorno |

## 4. Botões e menus

- Primário: uma ação principal por área; verbo específico.
- Secundário: ações seguras complementares.
- Perigoso/crítico: não usar vermelho sozinho; exige texto e confirmação.
- Desabilitado: motivo disponível por texto/ajuda.
- Menu de overflow: somente ações infrequentes; ações principais nunca escondidas.
- “Salvar” em cadastro; “Confirmar recebimento”, “Concluir produção” e “Confirmar entrega” em operações terminais.
- Clique repetido não gera nova solicitação.

## 5. Formulários

- validação de formato durante edição sem interromper digitação;
- validação de domínio na confirmação;
- obrigatórios identificados por texto;
- valores anteriores em correção e snapshots;
- ordem lógica e agrupamento por tarefa;
- dados informados preservados após falha recuperável;
- normalização explicitada para unidades e dinheiro;
- campos históricos somente leitura após conclusão.

## 6. Fluxos operacionais guiados

### Pedido

Cliente/modalidade → itens → preços/desconto → disponibilidade/reserva → entrega/retirada → revisão → confirmar. Resultado aponta produção necessária, pagamento e próximo passo.

### OP

Produto/quantidade/pedidos → versão capturada → necessidades → revisão → iniciar → consumo/perdas/rendimento → revisão integral → concluir.

### Atendimento

Pedido Pronto → endereço/saldo → saída quando entrega → confirmação ou tentativa frustrada → resultado de estoque/venda/financeiro.

### Backup/restauração

Destino → escopo → criar/validar → resultado e catálogo. Restauração: pacote → hash/compatibilidade → ambiente isolado → reconciliação → confirmação excepcional → ativação/rollback.

## 7. Tratamento de erros

| Classe | Interface |
|---|---|
| validação de campo | junto ao campo + resumo focável |
| regra bloqueante | mensagem com motivo e ação corretiva |
| conflito de versão | recarregar comparação; nunca sobrescrever silenciosamente |
| idempotência recuperada | mostrar resultado existente |
| armazenamento/sem espaço | bloquear confirmação, preservar dados e orientar liberação |
| integridade | bloquear operação, criar pendência e oferecer referência |
| sessão expirada | reidentificar e retomar com segurança |
| inesperado | referência técnica sanitizada e retorno a estado conhecido |

## 8. Requisitos de desempenho percebido

Ação local comum deve responder visualmente em até 100 ms; se processamento exceder 300 ms, mostrar progresso. Busca/lista deve produzir primeira resposta em até 1 s no volume previsto; transação crítica em até 2 s, exceto backup/restauração, que mostra progresso e pode ser cancelável somente antes do ponto de ativação.

## 9. Critérios de aceite

Mapa cobre todos os módulos; cada tela possui objetivo/estado/ação; componentes têm contratos consistentes; fluxos respeitam estados funcionais; erro informa recuperação; nenhuma tela funcional foi implementada.