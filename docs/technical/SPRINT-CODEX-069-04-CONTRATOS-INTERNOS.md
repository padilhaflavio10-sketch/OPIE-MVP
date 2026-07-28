# SPRINT-CODEX-069 — Contratos Internos

## 1. Envelope comum

### Comando

`command_id`, `command_type`, `idempotency_key`, `operator_id`, `session_id`, `occurred_at`, `expected_version`, `payload`, `reason` e `reauth_proof_ref` quando excepcional.

### Resposta

`command_id`, `status` (`completed`, `recovered`, `blocked`, `failed`), `result_type`, `result_id`, `new_version`, `messages[]`, `pending_id` e `audit_event_id`.

### Erro

`code`, `category` (`validation`, `business_block`, `conflict`, `integrity`, `authentication`, `storage`, `unexpected`), `user_message`, `field_errors`, `retryable`, `state_changed`, `reference_id` e `details` sanitizados.

Garantias: comando crítico sempre tem chave; repetição idêntica recupera resposta; fingerprint divergente conflita; erro declara se houve mudança; códigos são estáveis e textos podem evoluir.

## 2. Catálogo de comandos

| Comando | Entrada essencial | Resposta/eventos | Erros principais |
|---|---|---|---|
| `AuthenticateOperator` | login, segredo | sessão; `OperatorAuthenticated` | `AUTH_INVALID`, `AUTH_TEMP_LOCKED` |
| `ConfirmPurchaseReceipt` | compra, itens/conversões, versão | compra recebida; `PurchaseReceived`, `StockEntered` | `PURCHASE_INVALID`, `VERSION_CONFLICT` |
| `ReserveOrderProducts` | pedido, itens/quantidades | reservas/necessidades; `ProductReserved`, `ProductionNeeded` | `STOCK_UNAVAILABLE`, `ORDER_STATE_INVALID` |
| `StartProductionOrder` | OP, versão | OP iniciada/reservas; `ProductionStarted` | `SUPPLY_UNAVAILABLE`, `OP_STATE_INVALID` |
| `CompleteProductionOrder` | OP, consumos, perdas, rendimento | saída/custo/reservas; `ProductionCompleted` | `NEGATIVE_STOCK`, `OP_ALREADY_COMPLETED` |
| `ConfirmOrder` | pedido, snapshots, versão | estado/reservas; `OrderConfirmed` | `CUSTOMER_REQUIRED`, `ORDER_INVALID` |
| `RegisterPayment` | pedido, alocações, valor | pagamento/caixa/reserva; `PaymentConfirmed` | `PAYMENT_EXCEEDS_BALANCE`, `PAYMENT_DUPLICATE` |
| `RegisterRefund` | pagamento, valor, motivo | estorno/reversões; `PaymentRefunded` | `REFUND_EXCEEDS_NET`, `REAUTH_REQUIRED` |
| `DispatchDelivery` | entrega, endereço | saiu; `DeliveryDispatched` | `ORDER_NOT_READY` |
| `RegisterDeliveryAttempt` | entrega, resultado, custo/motivo | tentativa/estado; `DeliveryAttempted` | `DELIVERY_STATE_INVALID` |
| `ConfirmDelivery` | entrega, saldo conhecido, versão | baixa/venda; `DeliveryConfirmed`, `SaleRecognized` | `DELIVERY_ALREADY_CONFIRMED` |
| `ConfirmPickup` | retirada, versão | baixa/venda; `PickupConfirmed`, `SaleRecognized` | `PICKUP_ALREADY_CONFIRMED` |
| `CancelOrder` | pedido, motivo, reauth quando exigida | cancelamento/liberações; `OrderCancelled` | `ORDER_TERMINAL`, `REAUTH_REQUIRED` |
| `ApplyStockAdjustment` | item, quantidade, motivo, reauth | movimento/saldo; `StockAdjusted` | `NEGATIVE_STOCK`, `REAUTH_REQUIRED` |
| `CompleteInventory` | inventário/contagens | ajustes/conclusão; `InventoryCompleted` | `COUNT_MISSING`, `VERSION_CONFLICT` |
| `MoveFinancialReserve` | direção, valor, modo/origem | movimento/saldo; `ReserveMoved` | `RESERVE_INSUFFICIENT`, `DUPLICATE_ORIGIN` |
| `CompleteClosing` | período, linhas esperadas | fotografia; `ClosingCompleted` | `RECONCILIATION_FAILED` |
| `RegisterSubsequentAdjustment` | fechamento, origem, efeito, motivo | ajuste; `SubsequentAdjustmentRegistered` | `CLOSING_NOT_FOUND`, `DUPLICATE_ORIGIN` |
| `ResolvePendingItem` | pendência, evidência, versão | estado; `PendingItemResolved` | `PENDING_STATE_INVALID` |
| `CreateBackup` | destino, modo | catálogo/hash; `BackupCreated`, `BackupFailed` | `BACKUP_DESTINATION`, `BACKUP_INTEGRITY` |
| `ValidateRestore` | pacote/hash | relatório de validação; `RestoreValidated` | `BACKUP_TAMPERED`, `SCHEMA_INCOMPATIBLE` |
| `ActivateRestore` | validação, reauth | ambiente ativado; `RestoreActivated` | `VALIDATION_REQUIRED`, `REAUTH_REQUIRED` |

## 3. Consultas internas

Consultas não alteram estado e recebem filtros/paginação:

- `GetHomeSummary`, `SearchGlobal`, `ListCustomers`, `GetCustomerHistory`;
- `GetStockBalance`, `GetStockLedger`, `ListProductionQueue`;
- `GetOrder`, `ListOrders`, `GetDeliveryAgenda`;
- `GetFinancialPosition`, `GetReserveLedger`, `GetDashboardBreakdown`;
- `GetClosing`, `ListPendingItems`, `GetAuditChain`, `ListBackups`.

Resposta de lista contém `items`, `total`, `cursor/page`, `filters_applied`, `generated_at` e sinalizador `provisional` quando custo pendente.

## 4. Eventos e integração modular

Eventos internos são fatos persistidos na mesma transação do efeito. Consumidores locais atualizam projeções de forma idempotente.

| Evento | Produtor | Consumidores |
|---|---|---|
| `PurchaseReceived` | Compras | Estoque, auditoria, pendências |
| `ProductReserved` | Estoque | Pedidos |
| `ProductionNeeded` | Pedidos | Produção, pendências |
| `ProductionStarted/Completed` | Produção | Estoque, pedidos, custos, auditoria |
| `PaymentConfirmed/Refunded` | Financeiro | Caixa, reserva, pedido, dashboard |
| `DeliveryConfirmed/PickupConfirmed` | Atendimento | Estoque, vendas, financeiro, dashboard |
| `SaleRecognized` | Pedidos/atendimento | Resultado, fechamento |
| `StockAdjusted` | Estoque | Dashboard, pendências |
| `ClosingCompleted` | Fechamento | Relatórios/auditoria |
| `BackupCreated/RestoreActivated` | Infraestrutura | Catálogo/auditoria |

Não existe barramento remoto no MVP. Integração ocorre por serviço de aplicação e registros transacionais locais; evento não autoriza processamento duplicado.

## 5. Códigos de erro e interface

- `VALIDATION_*`: corrigir campo, sem mudança.
- `*_STATE_INVALID`: mostrar estado atual e ação permitida.
- `*_ALREADY_*`: recuperar registro existente quando mesma chave.
- `VERSION_CONFLICT`: comparar/recarregar, jamais sobrescrever.
- `NEGATIVE_STOCK`/`RECONCILIATION_FAILED`: bloquear e gerar pendência.
- `STORAGE_*`: rollback, preservar edição e orientar.
- `AUTH_*`/`REAUTH_REQUIRED`: identificar novamente sem expor segredo.

## 6. Versionamento

Contratos têm versão semântica interna. Campo novo opcional é compatível; remoção, renomeação ou mudança semântica exige nova versão e ADR. Eventos persistidos mantêm leitor para versões históricas. Implementação futura deve gerar testes de contrato para entradas válidas, erros e repetição idempotente.