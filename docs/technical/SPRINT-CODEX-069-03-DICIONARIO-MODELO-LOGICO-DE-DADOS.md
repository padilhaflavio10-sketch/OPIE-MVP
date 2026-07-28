# SPRINT-CODEX-069 — Dicionário do Modelo Lógico de Dados

## 1. Convenções

Modelo documental, sem SQL executável. Tipos lógicos:

- `id`: identificador opaco UTF-8, PK;
- `text(n)`: texto com limite;
- `bool`; `int`; `money`: inteiro em centavos;
- `qty(p,s)`: decimal fixo, padrão `qty(18,6)`;
- `utc`: instante UTC; `date`: data operacional local;
- `json`: estrutura versionada e validada;
- `enum(X)`: vocabulário controlado.

Todos os registros mutáveis incluem `created_at utc NN`, `created_by id NN FK operators`, `updated_at utc NN`, `updated_by id NN`, `row_version int NN`. Inativáveis incluem `inactive_at utc NULL`, `inactive_by id NULL`. Registros append-only não possuem atualização funcional.

`NN` = não nulo; `UQ` = único; `FK` = chave estrangeira; `CHK` = restrição.

## 2. Identidade

| Tabela | Campos específicos | Chaves e restrições |
|---|---|---|
| `operators` | `operator_id id`, `display_name text(120) NN`, `login_name text(80) NN`, `status enum(active,inactive,locked) NN` | PK `operator_id`; UQ login normalizado |
| `operator_credentials` | `credential_id id`, `operator_id id NN`, `scheme text(40) NN`, `parameters json NN`, `secret_hash text(512) NN`, `changed_at utc NN`, `revoked_at utc NULL` | PK; FK operador RESTRICT; no máximo uma ativa |
| `sessions` | `session_id id`, `operator_id id NN`, `started_at utc NN`, `last_activity_monotonic_ref text NN`, `locked_at utc NULL`, `ended_at utc NULL` | PK; FK operador; sessão encerrada não reabre |

## 3. Cadastros e receitas

| Tabela | Campos específicos | Chaves e restrições |
|---|---|---|
| `customers` | `customer_id id`, `name text(160) NN`, `phone text(40) NULL`, `notes text(1000) NULL`, auditoria/inativação | PK; índice nome/telefone normalizados |
| `customer_addresses` | `address_id id`, `customer_id id NN`, `label text(60)`, `street text(160) NN`, `number text(30)`, `complement text(120)`, `district text(100)`, `city text(100)`, `postal_code text(20)` | PK; FK cliente RESTRICT |
| `categories` | `category_id id`, `name text(100) NN`, `kind enum(product,expense) NN` | PK; UQ `(kind,name_normalized)` |
| `sizes` | `size_id id`, `name text(80) NN`, `sort_order int NN` | PK; UQ nome normalizado |
| `products` | `product_id id`, `sku text(60) NULL`, `name text(160) NN`, `category_id id`, `size_id id NULL`, `control_unit text(20) NN`, `sale_price money NN` | PK; UQ SKU quando presente; FKs; preço ≥0; unidade imutável após movimento |
| `supplies` | `supply_id id`, `code text(60) NULL`, `name text(160) NN`, `kind enum(ingredient,packaging) NN`, `control_unit text(20) NN`, `minimum_qty qty NULL` | PK; UQ código; mínimo ≥0; unidade imutável após movimento |
| `suppliers` | `supplier_id id`, `name text(160) NN`, `phone text(40) NULL`, `notes text(1000) NULL` | PK; índice nome normalizado |
| `recipes` | `recipe_id id`, `product_id id NN`, `name text(160) NN` | PK; FK produto; UQ nome por produto |
| `recipe_versions` | `recipe_version_id id`, `recipe_id id NN`, `version_no int NN`, `yield_qty qty NN`, `published_at utc NULL`, `used_at utc NULL`, `notes text(1000)` | PK; FK receita; UQ `(recipe_id,version_no)`; rendimento >0; publicada/usada imutável |
| `recipe_version_items` | `recipe_item_id id`, `recipe_version_id id NN`, `supply_id id NN`, `required_qty qty NN`, `loss_allowance qty NULL` | PK; FKs; UQ versão/insumo; quantidades ≥0 |

## 4. Compras e estoque

| Tabela | Campos específicos | Chaves e restrições |
|---|---|---|
| `purchases` | `purchase_id id`, `supplier_id id NULL`, `status enum(draft,received,corrected) NN`, `occurred_on date NN`, `received_at utc NULL`, snapshots de fornecedor | PK; FK fornecedor RESTRICT; recebida imutável |
| `purchase_items` | `purchase_item_id id`, `purchase_id id NN`, `supply_id id NN`, `purchase_qty qty NN`, `purchase_unit text NN`, `conversion_factor qty NN`, `control_qty qty NN`, `total_cost money NN`, snapshots | PK; FKs; fatores/quantidades >0; custo ≥0 |
| `stock_movements` | `movement_id id`, `item_type enum(supply,product) NN`, `item_id id NN`, `direction enum(in,out) NN`, `qty qty NN`, `unit_cost money NULL`, `occurred_at utc NN`, `recorded_at utc NN`, `origin_type text NN`, `origin_id id NN`, `idempotency_key text NN`, `reason text NULL` | PK; UQ `(origin_type,origin_id,direction,item_id)` e `(scope,idempotency_key)`; qty>0; append-only |
| `stock_reservations` | `reservation_id id`, `item_type`, `item_id`, `qty qty NN`, `origin_type`, `origin_id`, `status enum(active,consumed,released) NN`, `activated_at utc`, `closed_at utc NULL` | PK; UQ origem/item ativa; qty>0; fechamento único |
| `inventories` | `inventory_id id`, `status enum(draft,review,completed)`, `occurred_on date`, `completed_at utc NULL`, `reason text` | PK; concluído imutável |
| `inventory_counts` | `count_id id`, `inventory_id id NN`, `item_type`, `item_id`, `system_qty qty NN`, `counted_qty qty NN`, `difference_qty qty NN`, `adjustment_movement_id id NULL` | PK; FKs; UQ inventário/item; diferença calculada |

## 5. Pedidos e atendimento

| Tabela | Campos específicos | Chaves e restrições |
|---|---|---|
| `orders` | `order_id id`, `customer_id id NULL`, `customer_snapshot json NN`, `mode enum(immediate,order,mixed) NN`, `fulfillment enum(delivery,pickup) NN`, `commercial_status enum(...) NN`, `financial_status enum(...) NN`, `subtotal money`, `discount money`, `total money`, `discount_reason text NULL`, `confirmed_at utc NULL`, `version int` | PK; FK cliente; valores ≥0; Consumidor Avulso apenas pronta-entrega; terminal imutável |
| `order_items` | `order_item_id id`, `order_id id NN`, `product_id id NN`, `product_snapshot json NN`, `qty qty NN`, `unit_price money NN`, `discount money NN`, `line_total money NN` | PK; FKs; qty>0; valores ≥0 |
| `order_product_reservations` | `link_id id`, `order_item_id id NN`, `reservation_id id NN`, `qty qty NN` | PK; FKs; UQ reserva; qty>0 |
| `order_status_history` | `history_id id`, `order_id id NN`, `from_status text`, `to_status text NN`, `occurred_at utc`, `operator_id id`, `reason text NULL`, `event_id id` | PK; FKs; append-only |
| `deliveries` | `delivery_id id`, `order_id id NN`, `address_snapshot json NN`, `fee_charged money NN`, `actual_cost money NULL`, `status enum(planned,out,delivered,failed)`, `left_at utc NULL`, `confirmed_at utc NULL`, `idempotency_key text` | PK; UQ pedido e chave; custos ≥0 |
| `delivery_attempts` | `attempt_id id`, `delivery_id id NN`, `occurred_at utc`, `result enum(success,failed)`, `reason text`, `cost money NULL` | PK; FK; append-only |
| `pickups` | `pickup_id id`, `order_id id NN`, `confirmed_at utc NN`, `operator_id id NN`, `idempotency_key text NN` | PK; UQ pedido/chave |

## 6. Produção

| Tabela | Campos específicos | Chaves e restrições |
|---|---|---|
| `production_orders` | `production_order_id id`, `product_id id NN`, `recipe_version_id id NN`, `planned_qty qty NN`, `actual_qty qty NULL`, `status enum(planned,in_progress,interrupted,completed,partially_completed,cancelled)`, `started_at`, `completed_at`, `direct_cost money NULL`, `indirect_cost money NULL`, `reason text NULL` | PK; FKs; qty>0; uma conclusão; versão capturada |
| `production_order_links` | `link_id id`, `production_order_id id`, `order_item_id id`, `needed_qty qty` | PK; FKs; UQ OP/item |
| `production_planned_items` | `planned_item_id id`, `production_order_id id`, `supply_id id`, `planned_qty qty` | PK; FKs; UQ OP/insumo |
| `production_consumptions` | `consumption_id id`, `production_order_id id`, `supply_id id`, `actual_qty qty`, `stock_movement_id id`, `substitution_reason text NULL` | PK; FKs; qty>0; append-only |
| `production_outputs` | `output_id id`, `production_order_id id`, `product_id id`, `actual_qty qty`, `stock_movement_id id` | PK; UQ OP/saída; qty>0 |
| `losses` | `loss_id id`, `origin_type`, `origin_id`, `item_type`, `item_id`, `qty qty`, `result_effect enum(direct_cost,period_loss,none)`, `reason text` | PK; qty>0; classificação única |

## 7. Financeiro, fechamento e reserva

| Tabela | Campos específicos | Chaves e restrições |
|---|---|---|
| `payments` | `payment_id id`, `order_id id`, `amount money NN`, `occurred_at utc`, `status enum(confirmed,partially_refunded,refunded)`, `idempotency_key text`, `method_snapshot json` | PK; FKs; UQ chave; amount>0 |
| `payment_allocations` | `allocation_id id`, `payment_id id`, `method_code text`, `amount money`, `details_snapshot json` | PK; FK; soma = pagamento |
| `refunds` | `refund_id id`, `payment_id id`, `amount money`, `occurred_at utc`, `reason text`, `idempotency_key text` | PK; UQ chave; soma por pagamento ≤ valor |
| `expenses` | `expense_id id`, `category_id id`, `description text`, `occurred_on date`, `amount money`, `paid_at utc NULL`, `status enum(pending,paid,reversed)` | PK; FK; amount>0 |
| `cash_movements` | `cash_movement_id id`, `direction enum(in,out)`, `amount money`, `occurred_at utc`, `origin_type`, `origin_id`, `idempotency_key` | PK; UQ origem/direção e chave; append-only |
| `financial_reserve_movements` | `reserve_movement_id id`, `direction enum(in,out)`, `amount money`, `mode enum(auto,manual,reversal)`, `origin_type`, `origin_id`, `policy_snapshot json`, `reason text NULL` | PK; UQ origem/modo/direção; append-only |
| `closings` | `closing_id id`, `period_start utc`, `period_end utc`, `status enum(draft,completed)`, `totals_snapshot json`, `completed_at utc` | PK; UQ período/versão; concluído imutável |
| `closing_lines` | `line_id id`, `closing_id id`, `metric text`, `origin_type`, `origin_id`, `amount money` | PK; FKs; UQ fechamento/métrica/origem |
| `subsequent_adjustments` | `adjustment_id id`, `closing_id id`, `origin_type`, `origin_id`, `effect money`, `reason text`, `occurred_at utc` | PK; FKs; append-only |

## 8. Integridade, auditoria e infraestrutura

| Tabela | Campos específicos | Chaves e restrições |
|---|---|---|
| `pending_items` | `pending_id id`, `kind enum(operational,integrity,alert,blocked_action)`, `severity enum(blocking,critical,attention,informational)`, `status enum(open,analysis,waiting,resolved,closed,reopened)`, `origin_type`, `origin_id`, `summary text`, `expected_action text`, `opened_at`, `resolved_at NULL` | PK; UQ ocorrência ativa determinística |
| `pending_item_history` | `history_id id`, `pending_id id`, `from_status`, `to_status`, `occurred_at`, `operator_id`, `reason` | PK; FK; append-only |
| `audit_events` | `event_id id`, `occurred_at utc`, `recorded_at utc`, `operator_id id NULL`, `session_id id NULL`, `action text`, `module text`, `record_type`, `record_id`, `origin_type`, `origin_id`, `result enum(allowed,completed,blocked,failed)`, `before_data json NULL`, `after_data json NULL`, `reason text NULL`, `original_event_id id NULL`, `idempotency_key text NULL`, `integrity_link text NULL` | PK; FKs; append-only; original não referencia a si |
| `idempotency_records` | `record_id id`, `scope text`, `key text`, `request_fingerprint text`, `status enum(processing,completed,failed)`, `result_type text NULL`, `result_id id NULL`, `created_at`, `completed_at NULL` | PK; UQ `(scope,key)`; fingerprint divergente bloqueia |
| `backup_catalog` | `backup_id id`, `file_name text`, `created_at utc`, `schema_version int`, `size_bytes int`, `sha256 text(64)`, `location_kind enum(local,external)`, `validated_at utc NULL`, `restore_tested_at utc NULL`, `status enum(valid,incomplete,invalid)` | PK; UQ hash/nome; tamanho≥0 |
| `schema_versions` | `version int`, `applied_at utc`, `application_version text`, `checksum text` | PK versão; append-only |

## 9. Integridade transversal

- FKs históricas usam `RESTRICT`; exclusão física não é exposta.
- Operações terminais, movimentos, versões usadas, fechamentos e auditoria são imutáveis.
- Campos snapshot usam schema versionado e validado, mantendo legibilidade histórica.
- Saldos são projeções dos razões; divergência gera pendência e bloqueio.
- Dinheiro nunca usa ponto flutuante.
- Datas de ocorrência e registro são distintas.
- Toda correção referencia origem e cria efeito compensatório.

## 10. Cardinalidades essenciais

Cliente 1:N endereços/pedidos; produto 1:N receitas/itens; receita 1:N versões 1:N componentes; compra 1:N itens; pedido 1:N itens/pagamentos/atendimentos; item 1:N reservas; OP N:1 versão e 1:N consumos/perdas/saídas; pagamento 1:N alocações/estornos; fechamento 1:N linhas/ajustes; pendência 1:N históricos; evento 0:N correções.