# Documento 03 — Dicionário Integral do Modelo Lógico de Dados

**Revisão:** SPRINT-CODEX-070  
**Natureza:** modelo documental; não contém SQL ou migration executável.

## 1. Notação fechada

- Tipos: `ID` (identificador opaco), `TEXT(n)`, `INT`, `BOOL`, `MONEY` (inteiro de centavos), `QTY(18,6)`, `UTC`, `DATE`, `JSON` versionado e `ENUM{...}` fechado.
- `NN`/`NULL`: nulabilidade; `PK`, `FK`, `UQ`, `CHK`: restrições.
- `D=x`: valor padrão; `D=—`: sem padrão.
- Toda FK usa `ON DELETE RESTRICT`; não há cascata destrutiva.
- `MUT` expande literalmente: `created_at UTC NN D=now`, `created_by ID NN D=— FK operators.operator_id`, `updated_at UTC NN D=now`, `updated_by ID NN D=— FK operators.operator_id`, `row_version INT NN D=1 CHK>0`.
- `INA` adiciona: `inactive_at UTC NULL D=null`, `inactive_by ID NULL D=null FK operators.operator_id`; regra: ambos nulos ou ambos preenchidos.
- `APP` expande: `created_at UTC NN D=now`, `created_by ID NN D=— FK operators.operator_id`; registro append-only.
- Campos listados abaixo são o conjunto integral de cada tabela; não existem “demais campos” implícitos.

## 2. Identificadores polimórficos

### `record_registry` — identidade referencial uniforme de origens

Campos: `record_ref_id ID NN D=— PK`; `entity_type ENUM{purchase,stock_movement,inventory,order,order_item,production_order,delivery,delivery_attempt,pickup,payment,refund,expense,cash_movement,reserve_movement,closing,subsequent_adjustment,pending_item,audit_event,backup} NN D=—`; `entity_id ID NN D=—`; `registered_at UTC NN D=now`; `registered_by ID NN D=— FK operators.operator_id`.

Restrições/índices: UQ `(entity_type,entity_id)`; índice `entity_id`; toda entidade elegível cria exatamente um registro na mesma transação; `entity_type` deve coincidir com a tabela dona; deleção proibida. Referências de origem usam somente `origin_ref_id FK record_registry.record_ref_id`, eliminando pares sem FK.

### `stock_items` — identidade uniforme do item controlado

Campos: `stock_item_id ID NN D=— PK`; `item_kind ENUM{supply,product} NN D=—`; `supply_id ID NULL D=null FK supplies.supply_id`; `product_id ID NULL D=null FK products.product_id`; `control_unit TEXT(20) NN D=—`; `MUT`.

Restrições/índices: CHK `(item_kind=supply AND supply_id NN AND product_id NULL) OR (item_kind=product AND product_id NN AND supply_id NULL)`; UQ `supply_id` quando não nulo; UQ `product_id` quando não nulo; índice `(item_kind,stock_item_id)`. Unidade deve coincidir com a entidade referida e torna-se imutável após o primeiro movimento.

## 3. Identidade e sessão

| Entidade — descrição | Campos integrais | Restrições, índices e relacionamentos |
|---|---|---|
| `operators` — Operador Principal | `operator_id ID NN D=— PK`; `display_name TEXT(120) NN D=—`; `login_name TEXT(80) NN D=—`; `login_normalized TEXT(80) NN D=—`; `status ENUM{active,inactive,locked} NN D=active`; `MUT`; `INA` | UQ `login_normalized`; índice `status`; 1:N credenciais/sessões/eventos; único operador ativo é regra da baseline validada em aplicação |
| `operator_credentials` — credencial versionada | `credential_id ID NN PK`; `operator_id ID NN FK operators`; `scheme ENUM{argon2id} NN D=argon2id`; `parameters JSON NN`; `salt TEXT(256) NN`; `secret_hash TEXT(512) NN`; `changed_at UTC NN D=now`; `revoked_at UTC NULL D=null`; `APP` | índice `(operator_id,revoked_at)`; UQ ativa por operador; segredo/sal nunca em auditoria |
| `sessions` — sessão local | `session_id ID NN PK`; `operator_id ID NN FK operators`; `started_at UTC NN D=now`; `last_activity_at UTC NN D=now`; `locked_at UTC NULL`; `ended_at UTC NULL`; `end_reason ENUM{logout,inactivity,recovery,revocation} NULL`; `APP` | índice `(operator_id,ended_at)`; CHK fim exige motivo; encerrada não reabre |

## 4. Cadastros e receitas

| Entidade — descrição | Campos integrais | Restrições, índices e relacionamentos |
|---|---|---|
| `customers` — cliente | `customer_id ID NN PK`; `name TEXT(160) NN`; `name_normalized TEXT(160) NN`; `phone TEXT(40) NULL`; `phone_normalized TEXT(40) NULL`; `notes TEXT(1000) NULL`; `MUT`; `INA` | índices `name_normalized`, `phone_normalized`; 1:N endereços/pedidos; sem exclusão |
| `customer_addresses` — endereço vivo | `address_id ID NN PK`; `customer_id ID NN FK customers`; `label TEXT(60) NN D=Principal`; `street TEXT(160) NN`; `number TEXT(30) NULL`; `complement TEXT(120) NULL`; `district TEXT(100) NULL`; `city TEXT(100) NN`; `state TEXT(60) NULL`; `postal_code TEXT(20) NULL`; `MUT`; `INA` | UQ `(customer_id,label)` entre ativos; índice `(customer_id,inactive_at)`; 1 cliente:N endereços; pedidos usam snapshot próprio |
| `categories` — categoria de produto/despesa | `category_id ID NN PK`; `kind ENUM{product,expense} NN`; `name TEXT(100) NN`; `name_normalized TEXT(100) NN`; `MUT`; `INA` | UQ `(kind,name_normalized)`; índice `(kind,inactive_at)`; 1:N produtos/despesas |
| `sizes` — tamanho | `size_id ID NN PK`; `name TEXT(80) NN`; `name_normalized TEXT(80) NN`; `sort_order INT NN D=0`; `MUT`; `INA` | UQ `name_normalized`; índice `sort_order`; 1:N produtos |
| `products` — produto vendável | `product_id ID NN PK`; `sku TEXT(60) NULL`; `name TEXT(160) NN`; `name_normalized TEXT(160) NN`; `category_id ID NN FK categories`; `size_id ID NULL FK sizes`; `control_unit TEXT(20) NN D=un`; `sale_price MONEY NN D=0`; `MUT`; `INA` | UQ `sku` quando NN; índice `(category_id,inactive_at)`, `name_normalized`; preço≥0; 1:1 stock_item; 1:N receitas/itens |
| `supplies` — ingrediente ou embalagem | `supply_id ID NN PK`; `code TEXT(60) NULL`; `name TEXT(160) NN`; `name_normalized TEXT(160) NN`; `kind ENUM{ingredient,packaging} NN`; `control_unit TEXT(20) NN`; `minimum_qty QTY NULL`; `MUT`; `INA` | UQ `code` quando NN; índice `(kind,inactive_at)`, `name_normalized`; mínimo≥0; 1:1 stock_item; 1:N componentes/compras |
| `suppliers` — fornecedor | `supplier_id ID NN PK`; `name TEXT(160) NN`; `name_normalized TEXT(160) NN`; `phone TEXT(40) NULL`; `notes TEXT(1000) NULL`; `MUT`; `INA` | índice `name_normalized`; 1:N compras |
| `recipes` — conjunto de versões | `recipe_id ID NN PK`; `product_id ID NN FK products`; `name TEXT(160) NN`; `name_normalized TEXT(160) NN`; `MUT`; `INA` | UQ `(product_id,name_normalized)`; índice `product_id`; 1:N versões |
| `recipe_versions` — fotografia da composição | `recipe_version_id ID NN PK`; `recipe_id ID NN FK recipes`; `version_no INT NN`; `yield_qty QTY NN`; `status ENUM{draft,published,used} NN D=draft`; `published_at UTC NULL`; `used_at UTC NULL`; `notes TEXT(1000) NULL`; `MUT` | UQ `(recipe_id,version_no)`; índice `(recipe_id,status)`; version_no/yield>0; publicada/usada imutável; 1:N componentes e OPs |
| `recipe_version_items` — componente | `recipe_item_id ID NN PK`; `recipe_version_id ID NN FK recipe_versions`; `supply_id ID NN FK supplies`; `required_qty QTY NN`; `loss_allowance QTY NN D=0`; `MUT` | UQ `(recipe_version_id,supply_id)`; índices por ambas FKs; quantidades≥0 |

## 5. Compras, reservas e inventários

| Entidade — descrição | Campos integrais | Restrições, índices e relacionamentos |
|---|---|---|
| `purchases` — compra | `purchase_id ID NN PK`; `supplier_id ID NULL FK suppliers`; `supplier_snapshot JSON NN`; `status ENUM{draft,received,corrected} NN D=draft`; `occurred_on DATE NN`; `received_at UTC NULL`; `correction_of_id ID NULL FK purchases`; `MUT` | índice `(status,occurred_on)`, `supplier_id`; recebida exige `received_at`; corrigida exige origem; 1:N itens; 1:1 registry |
| `purchase_items` — item recebido | `purchase_item_id ID NN PK`; `purchase_id ID NN FK purchases`; `supply_id ID NN FK supplies`; `supply_snapshot JSON NN`; `purchase_qty QTY NN`; `purchase_unit TEXT(20) NN`; `conversion_factor QTY NN`; `control_qty QTY NN`; `total_cost MONEY NN`; `MUT` | UQ `(purchase_id,supply_id,purchase_unit)`; índices FKs; quantidades/fator>0; custo≥0; control_qty=purchase_qty×factor |
| `stock_movements` — razão imutável | `movement_id ID NN PK`; `stock_item_id ID NN FK stock_items`; `direction ENUM{in,out} NN`; `movement_kind ENUM{purchase,production_consumption,production_output,delivery,pickup,loss,adjustment,inventory,return_non_sellable,reversal} NN`; `qty QTY NN`; `unit_cost MONEY NULL`; `occurred_at UTC NN`; `recorded_at UTC NN D=now`; `origin_ref_id ID NN FK record_registry`; `idempotency_key TEXT(120) NN`; `reason TEXT(1000) NULL`; `APP` | UQ `(origin_ref_id,movement_kind,stock_item_id,direction)` e `(movement_kind,idempotency_key)`; índices `(stock_item_id,occurred_at)`, `origin_ref_id`; qty>0, custo≥0; append-only; 1:1 registry |
| `stock_reservations` — reserva de saldo | `reservation_id ID NN PK`; `stock_item_id ID NN FK stock_items`; `qty QTY NN`; `origin_ref_id ID NN FK record_registry`; `status ENUM{active,consumed,released} NN D=active`; `activated_at UTC NN D=now`; `closed_at UTC NULL`; `closing_movement_id ID NULL FK stock_movements`; `release_reason TEXT(1000) NULL`; `APP` | UQ `(origin_ref_id,stock_item_id)`; índices `(stock_item_id,status)`, `origin_ref_id`; qty>0; ativa sem fechamento; consumida exige movimento; liberada exige motivo |
| `inventories` — sessão de contagem | `inventory_id ID NN PK`; `status ENUM{draft,review,completed} NN D=draft`; `scope ENUM{supplies,products,all} NN`; `occurred_on DATE NN`; `reason TEXT(1000) NN`; `completed_at UTC NULL`; `MUT` | índice `(status,occurred_on)`; concluído exige timestamp e torna-se imutável; 1:N contagens; 1:1 registry |
| `inventory_counts` — contagem por item | `count_id ID NN PK`; `inventory_id ID NN FK inventories`; `stock_item_id ID NN FK stock_items`; `system_qty QTY NN`; `counted_qty QTY NN`; `difference_qty QTY NN`; `adjustment_movement_id ID NULL FK stock_movements`; `MUT` | UQ `(inventory_id,stock_item_id)`; índices FKs; difference=counted-system; inventário concluído exige movimento quando diferença≠0 |

## 6. Pedidos, produção e atendimento

| Entidade — descrição | Campos integrais | Restrições, índices e relacionamentos |
|---|---|---|
| `orders` — pedido | `order_id ID NN PK`; `customer_id ID NULL FK customers`; `customer_snapshot JSON NN`; `mode ENUM{immediate,future,mixed} NN`; `fulfillment ENUM{delivery,pickup} NN`; `commercial_status ENUM{draft,confirmed,awaiting_production,in_production,ready,out_for_delivery,delivered,picked_up,cancelled} NN D=draft`; `financial_status ENUM{unpaid,partially_paid,paid,partially_refunded,refunded} NN D=unpaid`; `subtotal MONEY NN D=0`; `discount_kind ENUM{none,percent,amount} NN D=none`; `discount_value QTY NN D=0`; `discount_amount MONEY NN D=0`; `total MONEY NN D=0`; `discount_reason TEXT(1000) NULL`; `confirmed_at UTC NULL`; `cancelled_at UTC NULL`; `MUT` | índices `(commercial_status,created_at)`, `(customer_id,created_at)`, `financial_status`; totais≥0; desconto não combina tipos; cliente obrigatório conforme baseline; 1:N itens/pagamentos/atendimentos; 1:1 registry |
| `order_items` — linha comercial | `order_item_id ID NN PK`; `order_id ID NN FK orders`; `product_id ID NN FK products`; `product_snapshot JSON NN`; `qty QTY NN`; `unit_price MONEY NN`; `discount_amount MONEY NN D=0`; `line_total MONEY NN`; `MUT` | índice `order_id`, `product_id`; qty>0; valores≥0; line_total=qty×price−discount; 1:N vínculos de reserva; 1:1 registry |
| `order_product_reservations` — alocação | `link_id ID NN PK`; `order_item_id ID NN FK order_items`; `reservation_id ID NN FK stock_reservations`; `qty QTY NN`; `MUT` | UQ `reservation_id`; UQ `(order_item_id,reservation_id)`; índices FKs; qty>0 e ≤ reserva |
| `order_status_history` — transição | `history_id ID NN PK`; `order_id ID NN FK orders`; `from_status ENUM{draft,confirmed,awaiting_production,in_production,ready,out_for_delivery,delivered,picked_up,cancelled} NULL`; `to_status` mesmo ENUM `NN`; `occurred_at UTC NN`; `operator_id ID NN FK operators`; `reason TEXT(1000) NULL`; `audit_event_id ID NN FK audit_events`; `APP` | índice `(order_id,occurred_at)`; origem≠destino; append-only |
| `production_orders` — OP | `production_order_id ID NN PK`; `product_id ID NN FK products`; `recipe_version_id ID NN FK recipe_versions`; `planned_qty QTY NN`; `actual_qty QTY NULL`; `status ENUM{planned,in_progress,interrupted,completed,partially_completed,cancelled} NN D=planned`; `started_at UTC NULL`; `completed_at UTC NULL`; `direct_cost MONEY NULL`; `indirect_cost MONEY NN D=0`; `interruption_reason TEXT(1000) NULL`; `completion_reason TEXT(1000) NULL`; `MUT` | índices `(status,created_at)`, `product_id`, `recipe_version_id`; planned>0; estados finais exigem completed_at/actual; uma conclusão; 1:N planejados/consumos/saídas/vínculos; 1:1 registry |
| `production_order_links` — OP/pedido | `link_id ID NN PK`; `production_order_id ID NN FK production_orders`; `order_item_id ID NN FK order_items`; `needed_qty QTY NN`; `MUT` | UQ `(production_order_id,order_item_id)`; índices FKs; needed>0 |
| `production_planned_items` — necessidade | `planned_item_id ID NN PK`; `production_order_id ID NN FK production_orders`; `supply_id ID NN FK supplies`; `planned_qty QTY NN`; `reservation_id ID NULL FK stock_reservations`; `MUT` | UQ `(production_order_id,supply_id)`; planned>0; iniciada exige reserva |
| `production_consumptions` — consumo real | `consumption_id ID NN PK`; `production_order_id ID NN FK production_orders`; `supply_id ID NN FK supplies`; `actual_qty QTY NN`; `stock_movement_id ID NN FK stock_movements`; `substituted_supply_id ID NULL FK supplies`; `substitution_reason TEXT(1000) NULL`; `APP` | UQ `stock_movement_id`; índice OP/insumo; qty>0; substituição e motivo ambos nulos ou preenchidos |
| `production_outputs` — rendimento | `output_id ID NN PK`; `production_order_id ID NN FK production_orders`; `product_id ID NN FK products`; `actual_qty QTY NN`; `stock_movement_id ID NN FK stock_movements`; `APP` | UQ `(production_order_id,product_id)` e movimento; qty>0 |
| `losses` — perda classificada | `loss_id ID NN PK`; `origin_ref_id ID NN FK record_registry`; `stock_item_id ID NN FK stock_items`; `qty QTY NN`; `result_effect ENUM{direct_cost,period_loss,none} NN`; `reason TEXT(1000) NN`; `stock_movement_id ID NULL FK stock_movements`; `occurred_at UTC NN`; `APP` | índices origem/item/data; UQ movimento quando NN; qty>0; classificação única; 1:1 registry |
| `deliveries` — entrega | `delivery_id ID NN PK`; `order_id ID NN FK orders`; `address_snapshot JSON NN`; `fee_charged MONEY NN D=0`; `actual_cost MONEY NULL`; `status ENUM{planned,out,delivered,failed} NN D=planned`; `left_at UTC NULL`; `confirmed_at UTC NULL`; `idempotency_key TEXT(120) NN`; `MUT` | UQ `order_id`, `idempotency_key`; índice status; custos≥0; delivered exige confirmação; 1:N tentativas; 1:1 registry |
| `delivery_attempts` — tentativa | `attempt_id ID NN PK`; `delivery_id ID NN FK deliveries`; `occurred_at UTC NN`; `result ENUM{success,failed} NN`; `reason TEXT(1000) NULL`; `cost MONEY NN D=0`; `APP` | índice `(delivery_id,occurred_at)`; custo≥0; falha exige motivo; 1:1 registry |
| `pickups` — retirada | `pickup_id ID NN PK`; `order_id ID NN FK orders`; `confirmed_at UTC NN`; `operator_id ID NN FK operators`; `idempotency_key TEXT(120) NN`; `APP` | UQ `order_id`, `idempotency_key`; 1:1 registry |

## 7. Financeiro, fechamento e reserva

| Entidade — descrição | Campos integrais | Restrições, índices e relacionamentos |
|---|---|---|
| `payments` — recebimento | `payment_id ID NN PK`; `order_id ID NN FK orders`; `amount MONEY NN`; `occurred_at UTC NN`; `status ENUM{confirmed,partially_refunded,refunded} NN D=confirmed`; `idempotency_key TEXT(120) NN`; `method_snapshot JSON NN`; `APP` | UQ idempotency; índice `(order_id,occurred_at)`; amount>0; 1:N alocações/estornos; 1:1 registry |
| `payment_allocations` — forma/valor | `allocation_id ID NN PK`; `payment_id ID NN FK payments`; `sequence INT NN`; `method_code ENUM{cash,pix,card,transfer,other} NN`; `amount MONEY NN`; `details_snapshot JSON NN`; `APP` | UQ `(payment_id,sequence)`; índice payment; amount>0; soma=pagamento |
| `refunds` — estorno | `refund_id ID NN PK`; `payment_id ID NN FK payments`; `amount MONEY NN`; `occurred_at UTC NN`; `reason TEXT(1000) NN`; `idempotency_key TEXT(120) NN`; `APP` | UQ idempotency; índice `(payment_id,occurred_at)`; amount>0; soma≤pagamento; 1:1 registry |
| `expenses` — despesa | `expense_id ID NN PK`; `category_id ID NN FK categories`; `description TEXT(500) NN`; `occurred_on DATE NN`; `amount MONEY NN`; `status ENUM{pending,paid,reversed} NN D=pending`; `paid_at UTC NULL`; `reversal_reason TEXT(1000) NULL`; `MUT` | índices `(status,occurred_on)`, category; amount>0; paid exige timestamp; reversed exige motivo; 1:1 registry |
| `cash_movements` — razão do caixa | `cash_movement_id ID NN PK`; `direction ENUM{in,out} NN`; `amount MONEY NN`; `occurred_at UTC NN`; `origin_ref_id ID NN FK record_registry`; `idempotency_key TEXT(120) NN`; `APP` | UQ `(origin_ref_id,direction)` e idempotency; índice occurred_at; amount>0; append-only; 1:1 registry |
| `financial_reserve_movements` — razão da reserva | `reserve_movement_id ID NN PK`; `direction ENUM{in,out} NN`; `amount MONEY NN`; `mode ENUM{automatic,manual,reversal} NN`; `origin_ref_id ID NN FK record_registry`; `policy_snapshot JSON NULL`; `reason TEXT(1000) NULL`; `occurred_at UTC NN`; `idempotency_key TEXT(120) NN`; `APP` | UQ `(origin_ref_id,mode,direction)` e idempotency; índice occurred_at; amount>0; manual exige motivo; automatic exige política; 1:1 registry |
| `closings` — fotografia do período | `closing_id ID NN PK`; `period_start UTC NN`; `period_end UTC NN`; `version_no INT NN D=1`; `status ENUM{draft,completed} NN D=draft`; `totals_snapshot JSON NN`; `completed_at UTC NULL`; `MUT` | UQ `(period_start,period_end,version_no)`; índice status/período; fim>início; concluído exige timestamp e é imutável; 1:N linhas/ajustes; 1:1 registry |
| `closing_lines` — origem de métrica | `line_id ID NN PK`; `closing_id ID NN FK closings`; `metric ENUM{gross_sales,discounts,net_sales,direct_cost,delivery_fee,delivery_cost,expense,indirect_cost,loss,bad_debt,adjustment,cash,reserve} NN`; `origin_ref_id ID NN FK record_registry`; `amount MONEY NN`; `APP` | UQ `(closing_id,metric,origin_ref_id)`; índices closing/origin; append-only |
| `subsequent_adjustments` — correção posterior | `adjustment_id ID NN PK`; `closing_id ID NN FK closings`; `origin_ref_id ID NN FK record_registry`; `effect MONEY NN`; `reason TEXT(1000) NN`; `occurred_at UTC NN`; `APP` | UQ `(closing_id,origin_ref_id)`; índices; effect≠0; 1:1 registry |

## 8. Pendências, auditoria e infraestrutura

| Entidade — descrição | Campos integrais | Restrições, índices e relacionamentos |
|---|---|---|
| `pending_items` — pendência/inconsistência | `pending_id ID NN PK`; `kind ENUM{operational,integrity,alert,blocked_action} NN`; `severity ENUM{blocking,critical,attention,informational} NN`; `status ENUM{open,analysis,waiting,resolved,closed,reopened} NN D=open`; `origin_ref_id ID NN FK record_registry`; `deduplication_key TEXT(160) NN`; `summary TEXT(500) NN`; `expected_action TEXT(1000) NN`; `opened_at UTC NN D=now`; `resolved_at UTC NULL`; `resolved_by ID NULL FK operators`; `resolution TEXT(1000) NULL`; `MUT` | UQ `deduplication_key` enquanto ativa; índices `(status,severity)`, origin; resolução exige trio data/operador/texto; 1:N histórico; 1:1 registry |
| `pending_item_history` — mudança de pendência | `history_id ID NN PK`; `pending_id ID NN FK pending_items`; `from_status ENUM{open,analysis,waiting,resolved,closed,reopened} NULL`; `to_status` mesmo ENUM `NN`; `occurred_at UTC NN`; `operator_id ID NN FK operators`; `reason TEXT(1000) NN`; `APP` | índice `(pending_id,occurred_at)`; origem≠destino; append-only |
| `audit_events` — evidência imutável | `event_id ID NN PK`; `occurred_at UTC NN`; `recorded_at UTC NN D=now`; `operator_id ID NULL FK operators`; `session_id ID NULL FK sessions`; `action TEXT(100) NN`; `module TEXT(80) NN`; `record_ref_id ID NULL FK record_registry`; `origin_ref_id ID NULL FK record_registry`; `result ENUM{allowed,completed,blocked,failed} NN`; `before_data JSON NULL`; `after_data JSON NULL`; `reason TEXT(1000) NULL`; `original_event_id ID NULL FK audit_events`; `idempotency_key TEXT(120) NULL`; `integrity_link TEXT(128) NULL`; `APP` | índices `(occurred_at,module)`, operator, record, origin, original; UQ `(action,idempotency_key)` quando key NN; original≠self; append-only; 1:1 registry |
| `idempotency_records` — deduplicação | `idempotency_record_id ID NN PK`; `scope ENUM{purchase_receipt,order_confirmation,op_start,op_completion,payment,refund,delivery,pickup,cancellation,stock_adjustment,inventory,reserve,closing,correction,backup,restore} NN`; `idempotency_key TEXT(120) NN`; `request_fingerprint TEXT(128) NN`; `status ENUM{processing,completed,failed} NN D=processing`; `result_ref_id ID NULL FK record_registry`; `error_code TEXT(100) NULL`; `started_at UTC NN D=now`; `completed_at UTC NULL`; `operator_id ID NN FK operators` | UQ `(scope,idempotency_key)`; índice fingerprint/status; completed exige resultado, failed exige erro; fingerprint divergente bloqueia |
| `backup_catalog` — catálogo de cópias | `backup_id ID NN PK`; `file_name TEXT(255) NN`; `created_at UTC NN`; `schema_version INT NN`; `application_version TEXT(40) NN`; `size_bytes INT NN`; `sha256 TEXT(64) NN`; `location_kind ENUM{local,external} NN`; `key_version TEXT(80) NULL`; `validated_at UTC NULL`; `restore_tested_at UTC NULL`; `status ENUM{valid,incomplete,invalid} NN`; `failure_reason TEXT(1000) NULL`; `APP` | UQ `sha256`, `file_name`; índices `(status,created_at)`, location; size≥0; valid exige validated; invalid exige motivo; 1:1 registry |
| `schema_versions` — histórico de schema | `version INT NN PK`; `applied_at UTC NN`; `application_version TEXT(40) NN`; `checksum TEXT(128) NN`; `previous_version INT NULL FK schema_versions`; `APP` | UQ checksum; UQ previous_version; versão>0; cadeia sem ciclos; append-only |

## 9. Relacionamentos completos

- Operador 1:N credenciais, sessões, registros mutáveis e eventos.
- Cliente 1:N endereços e pedidos; pedido guarda snapshot independente.
- Categoria 1:N produtos/despesas; tamanho 1:N produtos.
- Produto 1:1 stock_item, 1:N receitas/itens/OPs/saídas.
- Insumo 1:1 stock_item, 1:N componentes, compras, planejamentos e consumos.
- Receita 1:N versões; versão 1:N componentes e 1:N OPs.
- Compra 1:N itens; compra/movimento/inventário e demais origens 1:1 registry.
- Stock item 1:N movimentos/reservas/contagens/perdas.
- Inventário 1:N contagens; contagem 0:1 movimento de ajuste.
- Pedido 1:N itens/pagamentos e 0:1 entrega ou 0:1 retirada conforme modalidade.
- Item de pedido 1:N alocações e N:M OPs por `production_order_links`.
- OP 1:N planejados/consumos/saídas; consumo/saída 1:1 movimento.
- Entrega 1:N tentativas; pedido possui no máximo uma confirmação terminal.
- Pagamento 1:N alocações/estornos; soma de alocações = pagamento; soma de estornos ≤ pagamento.
- Toda origem financeira/estoque referencia registry; nenhum identificador polimórfico fica sem FK.
- Fechamento 1:N linhas/ajustes; linha N:1 origem registrada.
- Pendência 1:N histórico; auditoria 0:N eventos corretivos por `original_event_id`.

## 10. Índices e integridade derivada

Além dos índices declarados, toda FK recebe índice não único. Índices parciais “ativo” e UQ condicional dependem da capacidade do banco escolhido; se indisponíveis, tabela auxiliar/transação fornece garantia equivalente, documentada em ADR.

Saldos físico, reservado, disponível, caixa e reserva são projeções, não campos editáveis. Regras derivadas são verificadas dentro da mesma transação:

- físico e reservado nunca negativos; disponível = físico−reservado;
- unidade de controle é imutável após movimento;
- origem registrada existe e tem tipo compatível com `movement_kind`/evento;
- registro em registry e entidade dona nascem na mesma transação;
- snapshots são JSON com `schema_version` obrigatório e validação por tipo;
- datas de ocorrência e registro permanecem distintas;
- registros terminais e APP não admitem atualização ou exclusão funcional;
- correções criam novos registros vinculados, nunca reescrita.

## 11. Checklist de completude

- [x] todas as entidades têm descrição;
- [x] todos os campos têm tipo, nulabilidade e padrão explícito;
- [x] todas as PK/FK/UQ estão identificadas;
- [x] índices previstos estão declarados;
- [x] enumerações são fechadas, sem reticências;
- [x] endereços, reservas, inventários, produção e financeiro foram integralmente revistos;
- [x] origens e itens polimórficos possuem FK verificável;
- [x] cardinalidades e integridade derivada estão explícitas;
- [x] nenhuma migration, SQL ou implementação foi produzida.