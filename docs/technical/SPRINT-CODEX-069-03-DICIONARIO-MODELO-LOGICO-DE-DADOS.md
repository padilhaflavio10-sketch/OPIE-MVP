# Documento 03 — Dicionário Integral do Modelo Lógico de Dados

**Revisão:** SPRINT-CODEX-070  
**Natureza:** modelo documental; não contém SQL ou migration executável.

## 1. Notação fechada

- Tipos: `ID` (identificador opaco), `TEXT(n)`, `INT`, `BOOL`, `MONEY` (inteiro de centavos), `QTY(18,6)`, `UTC`, `DATE`, `JSON` versionado e `ENUM{valores_fechados}`.
- `NN`/`NULL`: nulabilidade; `PK`, `FK`, `UQ`, `CHK`: restrições.
- `D=x`: valor padrão; `D=—`: sem padrão.
- Toda FK usa `ON DELETE RESTRICT`; não há cascata destrutiva.
- `MUT` expande literalmente: `created_at UTC NN D=now`, `created_by ID NN D=— FK operators.operator_id`, `updated_at UTC NN D=now`, `updated_by ID NN D=— FK operators.operator_id`, `row_version INT NN D=1 CHK>0`.
- `INA` adiciona: `inactive_at UTC NULL D=null`, `inactive_by ID NULL D=null FK operators.operator_id`; regra: ambos nulos ou ambos preenchidos.
- `APP` expande: `created_at UTC NN D=now`, `created_by ID NN D=— FK operators.operator_id`; registro append-only.
- Campos listados abaixo são o conjunto integral de cada tabela; não existem “demais campos” implícitos.

## 2. Identificadores polimórficos

### `record_registry` — identidade referencial uniforme de origens

Campos: `record_ref_id ID NN D=— PK`; `entity_type ENUM{purchase,stock_movement,inventory,order,order_item,production_order,loss,delivery,delivery_attempt,pickup,payment,refund,expense,cash_movement,reserve_movement,closing,subsequent_adjustment,pending_item,audit_event,backup} NN D=—`; `entity_id ID NN D=—`; `registered_at UTC NN D=now`; `registered_by ID NN D=— FK operators.operator_id`.

Restrições/índices: UQ `(entity_type,entity_id)`; índice `entity_id`; toda entidade elegível cria exatamente um registro na mesma transação; `entity_type` deve coincidir com a tabela dona; deleção proibida. Referências de origem usam somente `origin_ref_id FK record_registry.record_ref_id`, eliminando pares sem FK.

### `stock_items` — identidade uniforme do item controlado

Campos: `stock_item_id ID NN D=— PK`; `item_kind ENUM{supply,product} NN D=—`; `supply_id ID NULL D=null FK supplies.supply_id`; `product_id ID NULL D=null FK products.product_id`; `control_unit TEXT(20) NN D=—`; `MUT`.

Restrições/índices: CHK `(item_kind=supply AND supply_id NN AND product_id NULL) OR (item_kind=product AND product_id NN AND supply_id NULL)`; UQ `supply_id` quando não nulo; UQ `product_id` quando não nulo; índice `(item_kind,stock_item_id)`. Unidade deve coincidir com a entidade referida e torna-se imutável após o primeiro movimento.

## 3. Identidade e sessão

| Entidade — descrição | Campos integrais | Restrições, índices e relacionamentos |
|---|---|---|
| `operators` — Operador Principal | `operator_id ID NN D=— PK`; `display_name TEXT(120) NN D=—`; `login_name TEXT(80) NN D=—`; `login_normalized TEXT(80) NN D=—`; `status ENUM{active,inactive,locked} NN D=active`; `MUT`; `INA` | UQ `login_normalized`; índice `status`; 1:N credenciais/sessões/eventos; único operador ativo é regra da baseline validada em aplicação |
| `operator_credentials` — credencial versionada | `credential_id ID NN PK D=—`; `operator_id ID NN FK operators D=—`; `scheme ENUM{argon2id} NN D=argon2id`; `parameters JSON NN D=—`; `salt TEXT(256) NN D=—`; `secret_hash TEXT(512) NN D=—`; `changed_at UTC NN D=now`; `revoked_at UTC NULL D=null`; `APP` | índice `(operator_id,revoked_at)`; UQ ativa por operador; segredo/sal nunca em auditoria |
| `sessions` — sessão local | `session_id ID NN PK D=—`; `operator_id ID NN FK operators D=—`; `started_at UTC NN D=now`; `last_activity_at UTC NN D=now`; `locked_at UTC NULL D=—`; `ended_at UTC NULL D=—`; `end_reason ENUM{logout,inactivity,recovery,revocation} NULL D=—`; `APP` | índice `(operator_id,ended_at)`; CHK fim exige motivo; encerrada não reabre |

## 4. Cadastros e receitas

| Entidade — descrição | Campos integrais | Restrições, índices e relacionamentos |
|---|---|---|
| `customers` — cliente | `customer_id ID NN PK D=—`; `name TEXT(160) NN D=—`; `name_normalized TEXT(160) NN D=—`; `phone TEXT(40) NULL D=—`; `phone_normalized TEXT(40) NULL D=—`; `notes TEXT(1000) NULL D=—`; `MUT`; `INA` | índices `name_normalized`, `phone_normalized`; 1:N endereços/pedidos; sem exclusão |
| `customer_addresses` — endereço vivo | `address_id ID NN PK D=—`; `customer_id ID NN FK customers D=—`; `label TEXT(60) NN D=Principal`; `street TEXT(160) NN D=—`; `number TEXT(30) NULL D=—`; `complement TEXT(120) NULL D=—`; `district TEXT(100) NULL D=—`; `city TEXT(100) NN D=—`; `state TEXT(60) NULL D=—`; `postal_code TEXT(20) NULL D=—`; `MUT`; `INA` | UQ `(customer_id,label)` entre ativos; índice `(customer_id,inactive_at)`; 1 cliente:N endereços; pedidos usam snapshot próprio |
| `categories` — categoria de produto/despesa | `category_id ID NN PK D=—`; `kind ENUM{product,expense} NN D=—`; `name TEXT(100) NN D=—`; `name_normalized TEXT(100) NN D=—`; `MUT`; `INA` | UQ `(kind,name_normalized)`; índice `(kind,inactive_at)`; 1:N produtos/despesas |
| `sizes` — tamanho | `size_id ID NN PK D=—`; `name TEXT(80) NN D=—`; `name_normalized TEXT(80) NN D=—`; `sort_order INT NN D=0`; `MUT`; `INA` | UQ `name_normalized`; índice `sort_order`; 1:N produtos |
| `products` — produto vendável | `product_id ID NN PK D=—`; `sku TEXT(60) NULL D=—`; `name TEXT(160) NN D=—`; `name_normalized TEXT(160) NN D=—`; `category_id ID NN FK categories D=—`; `size_id ID NULL FK sizes D=—`; `control_unit TEXT(20) NN D=un`; `sale_price MONEY NN D=0`; `MUT`; `INA` | UQ `sku` quando NN; índice `(category_id,inactive_at)`, `name_normalized`; preço≥0; 1:1 stock_item; 1:N receitas/itens |
| `supplies` — ingrediente ou embalagem | `supply_id ID NN PK D=—`; `code TEXT(60) NULL D=—`; `name TEXT(160) NN D=—`; `name_normalized TEXT(160) NN D=—`; `kind ENUM{ingredient,packaging} NN D=—`; `control_unit TEXT(20) NN D=—`; `minimum_qty QTY NULL D=—`; `MUT`; `INA` | UQ `code` quando NN; índice `(kind,inactive_at)`, `name_normalized`; mínimo≥0; 1:1 stock_item; 1:N componentes/compras |
| `suppliers` — fornecedor | `supplier_id ID NN PK D=—`; `name TEXT(160) NN D=—`; `name_normalized TEXT(160) NN D=—`; `phone TEXT(40) NULL D=—`; `notes TEXT(1000) NULL D=—`; `MUT`; `INA` | índice `name_normalized`; 1:N compras |
| `recipes` — conjunto de versões | `recipe_id ID NN PK D=—`; `product_id ID NN FK products D=—`; `name TEXT(160) NN D=—`; `name_normalized TEXT(160) NN D=—`; `MUT`; `INA` | UQ `(product_id,name_normalized)`; índice `product_id`; 1:N versões |
| `recipe_versions` — fotografia da composição | `recipe_version_id ID NN PK D=—`; `recipe_id ID NN FK recipes D=—`; `version_no INT NN D=—`; `yield_qty QTY NN D=—`; `status ENUM{draft,published,used} NN D=draft`; `published_at UTC NULL D=—`; `used_at UTC NULL D=—`; `notes TEXT(1000) NULL D=—`; `MUT` | UQ `(recipe_id,version_no)`; índice `(recipe_id,status)`; version_no/yield>0; publicada/usada imutável; 1:N componentes e OPs |
| `recipe_version_items` — componente | `recipe_item_id ID NN PK D=—`; `recipe_version_id ID NN FK recipe_versions D=—`; `supply_id ID NN FK supplies D=—`; `required_qty QTY NN D=—`; `loss_allowance QTY NN D=0`; `MUT` | UQ `(recipe_version_id,supply_id)`; índices por ambas FKs; quantidades≥0 |

## 5. Compras, reservas e inventários

| Entidade — descrição | Campos integrais | Restrições, índices e relacionamentos |
|---|---|---|
| `purchases` — compra | `purchase_id ID NN PK D=—`; `supplier_id ID NULL FK suppliers D=—`; `supplier_snapshot JSON NN D=—`; `status ENUM{draft,received,corrected} NN D=draft`; `occurred_on DATE NN D=—`; `received_at UTC NULL D=—`; `correction_of_id ID NULL FK purchases D=—`; `MUT` | índice `(status,occurred_on)`, `supplier_id`; recebida exige `received_at`; corrigida exige origem; 1:N itens; 1:1 registry |
| `purchase_items` — item recebido | `purchase_item_id ID NN PK D=—`; `purchase_id ID NN FK purchases D=—`; `supply_id ID NN FK supplies D=—`; `supply_snapshot JSON NN D=—`; `purchase_qty QTY NN D=—`; `purchase_unit TEXT(20) NN D=—`; `conversion_factor QTY NN D=—`; `control_qty QTY NN D=—`; `total_cost MONEY NN D=—`; `MUT` | UQ `(purchase_id,supply_id,purchase_unit)`; índices FKs; quantidades/fator>0; custo≥0; control_qty=purchase_qty×factor |
| `stock_movements` — razão imutável | `movement_id ID NN PK D=—`; `stock_item_id ID NN FK stock_items D=—`; `direction ENUM{in,out} NN D=—`; `movement_kind ENUM{purchase,production_consumption,production_output,delivery,pickup,loss,adjustment,inventory,return_non_sellable,reversal} NN D=—`; `qty QTY NN D=—`; `unit_cost MONEY NULL D=—`; `occurred_at UTC NN D=—`; `recorded_at UTC NN D=now`; `origin_ref_id ID NN FK record_registry D=—`; `idempotency_key TEXT(120) NN D=—`; `reason TEXT(1000) NULL D=—`; `APP` | UQ `(origin_ref_id,movement_kind,stock_item_id,direction)` e `(movement_kind,idempotency_key)`; índices `(stock_item_id,occurred_at)`, `origin_ref_id`; qty>0, custo≥0; append-only; 1:1 registry |
| `stock_reservations` — reserva de saldo | `reservation_id ID NN PK D=—`; `stock_item_id ID NN FK stock_items D=—`; `qty QTY NN D=—`; `origin_ref_id ID NN FK record_registry D=—`; `status ENUM{active,consumed,released} NN D=active`; `activated_at UTC NN D=now`; `closed_at UTC NULL D=—`; `closing_movement_id ID NULL FK stock_movements D=—`; `release_reason TEXT(1000) NULL D=—`; `APP` | UQ `(origin_ref_id,stock_item_id)`; índices `(stock_item_id,status)`, `origin_ref_id`; qty>0; ativa sem fechamento; consumida exige movimento; liberada exige motivo |
| `inventories` — sessão de contagem | `inventory_id ID NN PK D=—`; `status ENUM{draft,review,completed} NN D=draft`; `scope ENUM{supplies,products,all} NN D=—`; `occurred_on DATE NN D=—`; `reason TEXT(1000) NN D=—`; `completed_at UTC NULL D=—`; `MUT` | índice `(status,occurred_on)`; concluído exige timestamp e torna-se imutável; 1:N contagens; 1:1 registry |
| `inventory_counts` — contagem por item | `count_id ID NN PK D=—`; `inventory_id ID NN FK inventories D=—`; `stock_item_id ID NN FK stock_items D=—`; `system_qty QTY NN D=—`; `counted_qty QTY NN D=—`; `difference_qty QTY NN D=—`; `adjustment_movement_id ID NULL FK stock_movements D=—`; `MUT` | UQ `(inventory_id,stock_item_id)`; índices FKs; difference=counted-system; inventário concluído exige movimento quando diferença≠0 |

## 6. Pedidos, produção e atendimento

| Entidade — descrição | Campos integrais | Restrições, índices e relacionamentos |
|---|---|---|
| `orders` — pedido | `order_id ID NN PK D=—`; `customer_id ID NULL FK customers D=—`; `customer_snapshot JSON NN D=—`; `mode ENUM{immediate,future,mixed} NN D=—`; `fulfillment ENUM{delivery,pickup} NN D=—`; `commercial_status ENUM{draft,confirmed,awaiting_production,in_production,ready,out_for_delivery,delivered,picked_up,cancelled} NN D=draft`; `financial_status ENUM{unpaid,partially_paid,paid,partially_refunded,refunded} NN D=unpaid`; `subtotal MONEY NN D=0`; `discount_kind ENUM{none,percent,amount} NN D=none`; `discount_value QTY NN D=0`; `discount_amount MONEY NN D=0`; `total MONEY NN D=0`; `discount_reason TEXT(1000) NULL D=—`; `confirmed_at UTC NULL D=—`; `cancelled_at UTC NULL D=—`; `MUT` | índices `(commercial_status,created_at)`, `(customer_id,created_at)`, `financial_status`; totais≥0; desconto não combina tipos; cliente obrigatório conforme baseline; 1:N itens/pagamentos/atendimentos; 1:1 registry |
| `order_items` — linha comercial | `order_item_id ID NN PK D=—`; `order_id ID NN FK orders D=—`; `product_id ID NN FK products D=—`; `product_snapshot JSON NN D=—`; `qty QTY NN D=—`; `unit_price MONEY NN D=—`; `discount_amount MONEY NN D=0`; `line_total MONEY NN D=—`; `MUT` | índice `order_id`, `product_id`; qty>0; valores≥0; line_total=qty×price−discount; 1:N vínculos de reserva; 1:1 registry |
| `order_product_reservations` — alocação | `link_id ID NN PK D=—`; `order_item_id ID NN FK order_items D=—`; `reservation_id ID NN FK stock_reservations D=—`; `qty QTY NN D=—`; `MUT` | UQ `reservation_id`; UQ `(order_item_id,reservation_id)`; índices FKs; qty>0 e ≤ reserva |
| `order_status_history` — transição | `history_id ID NN PK D=—`; `order_id ID NN FK orders D=—`; `from_status ENUM{draft,confirmed,awaiting_production,in_production,ready,out_for_delivery,delivered,picked_up,cancelled} NULL D=—`; `to_status ENUM{draft,confirmed,awaiting_production,in_production,ready,out_for_delivery,delivered,picked_up,cancelled} NN D=—`; `occurred_at UTC NN D=—`; `operator_id ID NN FK operators D=—`; `reason TEXT(1000) NULL D=—`; `audit_event_id ID NN FK audit_events D=—`; `APP` | índice `(order_id,occurred_at)`; origem≠destino; append-only |
| `production_orders` — OP | `production_order_id ID NN PK D=—`; `product_id ID NN FK products D=—`; `recipe_version_id ID NN FK recipe_versions D=—`; `planned_qty QTY NN D=—`; `actual_qty QTY NULL D=—`; `status ENUM{planned,in_progress,interrupted,completed,partially_completed,cancelled} NN D=planned`; `started_at UTC NULL D=—`; `completed_at UTC NULL D=—`; `direct_cost MONEY NULL D=—`; `indirect_cost MONEY NN D=0`; `interruption_reason TEXT(1000) NULL D=—`; `completion_reason TEXT(1000) NULL D=—`; `MUT` | índices `(status,created_at)`, `product_id`, `recipe_version_id`; planned>0; estados finais exigem completed_at/actual; uma conclusão; 1:N planejados/consumos/saídas/vínculos; 1:1 registry |
| `production_order_links` — OP/pedido | `link_id ID NN PK D=—`; `production_order_id ID NN FK production_orders D=—`; `order_item_id ID NN FK order_items D=—`; `needed_qty QTY NN D=—`; `MUT` | UQ `(production_order_id,order_item_id)`; índices FKs; needed>0 |
| `production_planned_items` — necessidade | `planned_item_id ID NN PK D=—`; `production_order_id ID NN FK production_orders D=—`; `supply_id ID NN FK supplies D=—`; `planned_qty QTY NN D=—`; `reservation_id ID NULL FK stock_reservations D=—`; `MUT` | UQ `(production_order_id,supply_id)`; planned>0; iniciada exige reserva |
| `production_consumptions` — consumo real | `consumption_id ID NN PK D=—`; `production_order_id ID NN FK production_orders D=—`; `supply_id ID NN FK supplies D=—`; `actual_qty QTY NN D=—`; `stock_movement_id ID NN FK stock_movements D=—`; `substituted_supply_id ID NULL FK supplies D=—`; `substitution_reason TEXT(1000) NULL D=—`; `APP` | UQ `stock_movement_id`; índice OP/insumo; qty>0; substituição e motivo ambos nulos ou preenchidos |
| `production_outputs` — rendimento | `output_id ID NN PK D=—`; `production_order_id ID NN FK production_orders D=—`; `product_id ID NN FK products D=—`; `actual_qty QTY NN D=—`; `stock_movement_id ID NN FK stock_movements D=—`; `APP` | UQ `(production_order_id,product_id)` e movimento; qty>0 |
| `losses` — perda classificada | `loss_id ID NN PK D=—`; `origin_ref_id ID NN FK record_registry D=—`; `stock_item_id ID NN FK stock_items D=—`; `qty QTY NN D=—`; `result_effect ENUM{direct_cost,period_loss,none} NN D=—`; `reason TEXT(1000) NN D=—`; `stock_movement_id ID NULL FK stock_movements D=—`; `occurred_at UTC NN D=—`; `APP` | índices origem/item/data; UQ movimento quando NN; qty>0; classificação única; 1:1 registry |
| `deliveries` — entrega | `delivery_id ID NN PK D=—`; `order_id ID NN FK orders D=—`; `address_snapshot JSON NN D=—`; `fee_charged MONEY NN D=0`; `actual_cost MONEY NULL D=—`; `status ENUM{planned,out,delivered,failed} NN D=planned`; `left_at UTC NULL D=—`; `confirmed_at UTC NULL D=—`; `idempotency_key TEXT(120) NN D=—`; `MUT` | UQ `order_id`, `idempotency_key`; índice status; custos≥0; delivered exige confirmação; 1:N tentativas; 1:1 registry |
| `delivery_attempts` — tentativa | `attempt_id ID NN PK D=—`; `delivery_id ID NN FK deliveries D=—`; `occurred_at UTC NN D=—`; `result ENUM{success,failed} NN D=—`; `reason TEXT(1000) NULL D=—`; `cost MONEY NN D=0`; `APP` | índice `(delivery_id,occurred_at)`; custo≥0; falha exige motivo; 1:1 registry |
| `pickups` — retirada | `pickup_id ID NN PK D=—`; `order_id ID NN FK orders D=—`; `confirmed_at UTC NN D=—`; `operator_id ID NN FK operators D=—`; `idempotency_key TEXT(120) NN D=—`; `APP` | UQ `order_id`, `idempotency_key`; 1:1 registry |

## 7. Financeiro, fechamento e reserva

| Entidade — descrição | Campos integrais | Restrições, índices e relacionamentos |
|---|---|---|
| `payments` — recebimento | `payment_id ID NN PK D=—`; `order_id ID NN FK orders D=—`; `amount MONEY NN D=—`; `occurred_at UTC NN D=—`; `status ENUM{confirmed,partially_refunded,refunded} NN D=confirmed`; `idempotency_key TEXT(120) NN D=—`; `method_snapshot JSON NN D=—`; `APP` | UQ idempotency; índice `(order_id,occurred_at)`; amount>0; 1:N alocações/estornos; 1:1 registry |
| `payment_allocations` — forma/valor | `allocation_id ID NN PK D=—`; `payment_id ID NN FK payments D=—`; `sequence INT NN D=—`; `method_code ENUM{cash,pix,card,transfer,other} NN D=—`; `amount MONEY NN D=—`; `details_snapshot JSON NN D=—`; `APP` | UQ `(payment_id,sequence)`; índice payment; amount>0; soma=pagamento |
| `refunds` — estorno | `refund_id ID NN PK D=—`; `payment_id ID NN FK payments D=—`; `amount MONEY NN D=—`; `occurred_at UTC NN D=—`; `reason TEXT(1000) NN D=—`; `idempotency_key TEXT(120) NN D=—`; `APP` | UQ idempotency; índice `(payment_id,occurred_at)`; amount>0; soma≤pagamento; 1:1 registry |
| `expenses` — despesa | `expense_id ID NN PK D=—`; `category_id ID NN FK categories D=—`; `description TEXT(500) NN D=—`; `occurred_on DATE NN D=—`; `amount MONEY NN D=—`; `status ENUM{pending,paid,reversed} NN D=pending`; `paid_at UTC NULL D=—`; `reversal_reason TEXT(1000) NULL D=—`; `MUT` | índices `(status,occurred_on)`, category; amount>0; paid exige timestamp; reversed exige motivo; 1:1 registry |
| `cash_movements` — razão do caixa | `cash_movement_id ID NN PK D=—`; `direction ENUM{in,out} NN D=—`; `amount MONEY NN D=—`; `occurred_at UTC NN D=—`; `origin_ref_id ID NN FK record_registry D=—`; `idempotency_key TEXT(120) NN D=—`; `APP` | UQ `(origin_ref_id,direction)` e idempotency; índice occurred_at; amount>0; append-only; 1:1 registry |
| `financial_reserve_movements` — razão da reserva | `reserve_movement_id ID NN PK D=—`; `direction ENUM{in,out} NN D=—`; `amount MONEY NN D=—`; `mode ENUM{automatic,manual,reversal} NN D=—`; `origin_ref_id ID NN FK record_registry D=—`; `policy_snapshot JSON NULL D=—`; `reason TEXT(1000) NULL D=—`; `occurred_at UTC NN D=—`; `idempotency_key TEXT(120) NN D=—`; `APP` | UQ `(origin_ref_id,mode,direction)` e idempotency; índice occurred_at; amount>0; manual exige motivo; automatic exige política; 1:1 registry |
| `closings` — fotografia do período | `closing_id ID NN PK D=—`; `period_start UTC NN D=—`; `period_end UTC NN D=—`; `version_no INT NN D=1`; `status ENUM{draft,completed} NN D=draft`; `totals_snapshot JSON NN D=—`; `completed_at UTC NULL D=—`; `MUT` | UQ `(period_start,period_end,version_no)`; índice status/período; fim>início; concluído exige timestamp e é imutável; 1:N linhas/ajustes; 1:1 registry |
| `closing_lines` — origem de métrica | `line_id ID NN PK D=—`; `closing_id ID NN FK closings D=—`; `metric ENUM{gross_sales,discounts,net_sales,direct_cost,delivery_fee,delivery_cost,expense,indirect_cost,loss,bad_debt,adjustment,cash,reserve} NN D=—`; `origin_ref_id ID NN FK record_registry D=—`; `amount MONEY NN D=—`; `APP` | UQ `(closing_id,metric,origin_ref_id)`; índices closing/origin; append-only |
| `subsequent_adjustments` — correção posterior | `adjustment_id ID NN PK D=—`; `closing_id ID NN FK closings D=—`; `origin_ref_id ID NN FK record_registry D=—`; `effect MONEY NN D=—`; `reason TEXT(1000) NN D=—`; `occurred_at UTC NN D=—`; `APP` | UQ `(closing_id,origin_ref_id)`; índices; effect≠0; 1:1 registry |

## 8. Pendências, auditoria e infraestrutura

| Entidade — descrição | Campos integrais | Restrições, índices e relacionamentos |
|---|---|---|
| `pending_items` — pendência/inconsistência | `pending_id ID NN PK D=—`; `kind ENUM{operational,integrity,alert,blocked_action} NN D=—`; `severity ENUM{blocking,critical,attention,informational} NN D=—`; `status ENUM{open,analysis,waiting,resolved,closed,reopened} NN D=open`; `origin_ref_id ID NN FK record_registry D=—`; `deduplication_key TEXT(160) NN D=—`; `summary TEXT(500) NN D=—`; `expected_action TEXT(1000) NN D=—`; `opened_at UTC NN D=now`; `resolved_at UTC NULL D=—`; `resolved_by ID NULL FK operators D=—`; `resolution TEXT(1000) NULL D=—`; `MUT` | UQ `deduplication_key` enquanto ativa; índices `(status,severity)`, origin; resolução exige trio data/operador/texto; 1:N histórico; 1:1 registry |
| `pending_item_history` — mudança de pendência | `history_id ID NN PK D=—`; `pending_id ID NN FK pending_items D=—`; `from_status ENUM{open,analysis,waiting,resolved,closed,reopened} NULL D=—`; `to_status ENUM{open,analysis,waiting,resolved,closed,reopened} NN D=—`; `occurred_at UTC NN D=—`; `operator_id ID NN FK operators D=—`; `reason TEXT(1000) NN D=—`; `APP` | índice `(pending_id,occurred_at)`; origem≠destino; append-only |
| `audit_events` — evidência imutável | `event_id ID NN PK D=—`; `occurred_at UTC NN D=—`; `recorded_at UTC NN D=now`; `operator_id ID NULL FK operators D=—`; `session_id ID NULL FK sessions D=—`; `action TEXT(100) NN D=—`; `module TEXT(80) NN D=—`; `record_ref_id ID NULL FK record_registry D=—`; `origin_ref_id ID NULL FK record_registry D=—`; `result ENUM{allowed,completed,blocked,failed} NN D=—`; `before_data JSON NULL D=—`; `after_data JSON NULL D=—`; `reason TEXT(1000) NULL D=—`; `original_event_id ID NULL FK audit_events D=—`; `idempotency_key TEXT(120) NULL D=—`; `integrity_link TEXT(128) NULL D=—`; `APP` | índices `(occurred_at,module)`, operator, record, origin, original; UQ `(action,idempotency_key)` quando key NN; original≠self; append-only; 1:1 registry |
| `idempotency_records` — deduplicação | `idempotency_record_id ID NN PK D=—`; `scope ENUM{purchase_receipt,order_confirmation,op_start,op_completion,payment,refund,delivery,pickup,cancellation,stock_adjustment,inventory,reserve,closing,correction,backup,restore} NN D=—`; `idempotency_key TEXT(120) NN D=—`; `request_fingerprint TEXT(128) NN D=—`; `status ENUM{processing,completed,failed} NN D=processing`; `result_ref_id ID NULL FK record_registry D=—`; `error_code TEXT(100) NULL D=—`; `started_at UTC NN D=now`; `completed_at UTC NULL D=—`; `operator_id ID NN FK operators D=—` | UQ `(scope,idempotency_key)`; índice fingerprint/status; completed exige resultado, failed exige erro; fingerprint divergente bloqueia |
| `backup_catalog` — catálogo de cópias | `backup_id ID NN PK D=—`; `file_name TEXT(255) NN D=—`; `created_at UTC NN D=—`; `schema_version INT NN D=—`; `application_version TEXT(40) NN D=—`; `size_bytes INT NN D=—`; `sha256 TEXT(64) NN D=—`; `location_kind ENUM{local,external} NN D=—`; `key_version TEXT(80) NULL D=—`; `validated_at UTC NULL D=—`; `restore_tested_at UTC NULL D=—`; `status ENUM{valid,incomplete,invalid} NN D=—`; `failure_reason TEXT(1000) NULL D=—`; `APP` | UQ `sha256`, `file_name`; índices `(status,created_at)`, location; size≥0; valid exige validated; invalid exige motivo; 1:1 registry |
| `schema_versions` — histórico de schema | `version INT NN PK D=—`; `applied_at UTC NN D=—`; `application_version TEXT(40) NN D=—`; `checksum TEXT(128) NN D=—`; `previous_version INT NULL FK schema_versions D=—`; `APP` | UQ checksum; UQ previous_version; versão>0; cadeia sem ciclos; append-only |

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