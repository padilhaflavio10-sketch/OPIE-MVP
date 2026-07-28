# SPRINT-CODEX-068 — Segurança, Histórico e Auditoria

## 1. Modelo proporcional de segurança

O MVP opera localmente com um Operador Principal individual. A simplicidade não elimina identificação, proteção de credencial, reautenticação e rastreabilidade.

### Identidade e credenciais

- Identificador individual; conta compartilhada proibida.
- Segredo armazenado apenas por derivação resistente a ataques, com sal exclusivo e parâmetros versionados; nunca texto claro.
- Comparação em tempo constante e segredo removido da memória tão cedo quanto possível.
- Dados financeiros e de clientes disponíveis somente em sessão autenticada.
- Credenciais e material criptográfico não entram em logs ou backups sem proteção definida.

A escolha concreta do algoritmo e parâmetros deverá seguir biblioteca mantida e recomendação vigente na futura implementação, sem algoritmo criptográfico próprio.

### Sessão

- Sessão criada após autenticação e vinculada ao operador.
- Bloqueio após 30 minutos de inatividade medidos por relógio monotônico.
- Atividade relevante renova o prazo; execução em segundo plano não renova.
- Bloqueio de tela preserva transação já confirmada, mas impede novo comando.
- Encerramento manual invalida sessão e limpa dados sensíveis de interface.

### Ações excepcionais

Estorno, baixa de dívida, grandes ajustes, operação emergencial e recuperação de acesso exigem resumo de impacto, justificativa, nova identificação e confirmação. A confirmação tem uso único e curta validade, vinculada à ação/fingerprint.

### Tentativas inválidas

Atraso progressivo e bloqueio temporário local reduzem força bruta sem causar perda definitiva. Tentativas permitidas e bloqueadas são auditadas com minimização de dados. Recuperação exige prova local do responsável, procedimento documentado e evento de auditoria; não revela credencial anterior.

## 2. Proteção de dados

- Coletar somente dados necessários à operação.
- Restringir exportação e exibição financeira.
- Ocultar parcialmente dados pessoais em telas de visão geral quando possível.
- Arquivos de banco e backup recebem permissões locais restritas ao usuário da aplicação.
- Mensagens não expõem stack trace, hash, segredo ou caminho sensível.
- Descarte de dispositivo exige procedimento de remoção segura fora do aplicativo e confirmação de backup restaurável.

## 3. Evento de auditoria

Campos mínimos:

| Campo | Conteúdo |
|---|---|
| `event_id` | identidade global e imutável |
| `occurred_at` / `recorded_at` | ocorrência e persistência em UTC |
| `operator_id` / snapshot | identidade e nome histórico |
| `session_id` | sessão responsável quando aplicável |
| `action` / `module` | verbo controlado e domínio |
| `record_type` / `record_id` | alvo |
| `origin_type` / `origin_id` | comando ou operação geradora |
| `result` | permitido, concluído, bloqueado ou falhou |
| `before` / `after` | representação minimizada ou campos relevantes |
| `reason` | justificativa obrigatória quando aplicável |
| `original_event_id` | vínculo corretivo |
| `idempotency_key` | correlação sem segredo |
| `integrity_link` | encadeamento/hash opcional definido pela implementação |

## 4. Eventos obrigatórios

- autenticação, bloqueio, encerramento, falha e recuperação;
- criação, inativação e alteração sensível de cadastro;
- publicação/uso de versão de receita;
- recebimento e correção de compra;
- reserva, movimento, perda, ajuste e inventário;
- transições de pedido e OP;
- pagamento, estorno, despesa, caixa e reserva;
- entrega, retirada, tentativa frustrada, cancelamento e devolução;
- fechamento e ajuste posterior;
- resolução/reabertura de pendência;
- backup, validação e restauração;
- tentativa crítica bloqueada e conflito de idempotência.

Eventos puramente operacionais de navegação não são obrigatórios, salvo acesso a informação sensível ou requisito de diagnóstico explicitamente aprovado.

## 5. Imutabilidade e correção

Eventos são append-only. Não há comando de edição ou exclusão pela aplicação. Correção cria novo evento ligado ao original. `before/after` não deve duplicar desnecessariamente dados pessoais; para estruturas grandes, usa referências e resumo determinístico.

A integridade mínima depende de transação, chaves, permissões e backup. Encadeamento criptográfico pode aumentar detecção de adulteração, mas não substitui controle de acesso ou cópia externa.

## 6. Retenção e consulta

Registros necessários à rastreabilidade financeira, estoque, produção e segurança acompanham a vida útil da base operacional e seus backups, sujeitos a política jurídica futura antes da comercialização. Não é definida eliminação automática no MVP sem deliberação.

Filtros: período, operador, módulo, ação, resultado, tipo/id do registro, origem, justificativa e evento corretivo. A consulta deve mostrar cadeia original → correções e permitir exportação somente quando essa função vier a ser autorizada.

## 7. Separação histórica

Fotografias de cliente, produto, endereço, preço, desconto, receita, custo, pagamento, operador, categoria e justificativa pertencem às operações históricas. O cadastro vivo pode mudar sem modificar essas fotografias. Toda divergência entre projeção e razão gera inconsistência, não correção silenciosa.

## 8. Critérios técnicos de aceite

- timeout de 30 minutos comprovado;
- credencial nunca persistida ou registrada em claro;
- ação excepcional falha sem reidentificação válida;
- evento de sucesso pertence à mesma transação do efeito;
- tentativa bloqueada deixa evidência sem efeito de negócio;
- evento histórico não é editável pela interface ou camada de aplicação;
- cadeia de correções é navegável e reconciliável;
- backup e restauração preservam eventos integralmente.