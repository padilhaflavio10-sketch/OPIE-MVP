# SPRINT-CODEX-069 — Parâmetros Técnicos e Requisitos Não Funcionais

## 1. Premissas

Parâmetros dimensionam um MVP desktop local para uma operação pequena, um Operador Principal e uso offline. Não ampliam regra funcional. Valores devem ser medidos na futura bancada e revistos por ADR antes de comercialização.

## 2. Continuidade

| Parâmetro | Valor documental | Critério |
|---|---:|---|
| RPO operacional | máximo 24 horas | backup automático diário válido e oportunidade ao encerrar |
| RPO antes de atualização | 0 operações confirmadas desde o backup prévio | bloquear atualização sem cópia validada imediatamente anterior |
| RTO troca/corrupção | até 4 horas | instalação compatível, restauração, validação e aceite |
| RTO falha de transação | imediato após reabertura, alvo ≤5 min | rollback/idempotência sem reparo manual comum |
| teste de restauração | trimestral e antes de atualização relevante | ambiente isolado, reconciliação integral |

Falha no RPO abre pendência crítica; ausência de backup restaurável bloqueia atualização e Portão 7.

## 3. Retenção

- backups: 7 diários, 4 semanais e 12 mensais;
- último backup válido nunca é removido por rotação;
- eventos operacionais e registros de negócio: durante toda a vida da base no MVP;
- tentativas de autenticação: detalhe minimizado por 180 dias e agregados por 24 meses, salvo política jurídica superveniente;
- logs técnicos sanitizados: 30 dias, com rotação por tamanho;
- política jurídica definitiva deve ser homologada antes da comercialização.

Expurgo, quando futuramente autorizado, é auditável e nunca elimina evidência necessária à integridade financeira/operacional.

## 4. Credenciais

- senha nunca armazenada em claro ou reversível;
- derivação por algoritmo resistente à memória, biblioteca mantida, sal aleatório exclusivo e parâmetros versionados;
- baseline documental: Argon2id, memória mínima 64 MiB, 3 iterações e paralelismo 1; futura bancada deve elevar parâmetros até custo aceitável sem exceder 1 segundo no equipamento mínimo;
- comparação em tempo constante;
- mínimo 12 caracteres, sem truncamento silencioso; permitir gerenciador de senhas;
- atraso progressivo e bloqueio temporário após tentativas inválidas;
- troca/revogação preserva histórico sem hash antigo utilizável;
- recuperação exige código/chave de recuperação emitida uma vez, prova do responsável e auditoria; não revela senha anterior.

## 5. Política de chaves

- chave mestra aleatória por instalação, 256 bits;
- proteção preferencial pelo cofre nativo do sistema operacional, vinculada ao usuário da instalação;
- chave de backup derivada de segredo de recuperação separado ou envelope criptográfico; não permanecer apenas no dispositivo protegido;
- identificador/versão da chave no manifesto, nunca a chave;
- rotação cria nova versão e reempacota somente quando seguro; backups antigos continuam restauráveis com material autorizado;
- segredos não entram em Git, logs, eventos ou suporte;
- perda da chave sem recuperação é declarada irrecuperável, nunca contornada.

Algoritmo concreto de criptografia e integração com cofre dependem da stack e de ADR de segurança antes da implementação.

## 6. Precisão e arredondamento

- dinheiro persistido em inteiro de centavos (`money`);
- quantidades: decimal `18,6` na persistência;
- exibição segue precisão da unidade: unidade inteira 0; kg/l 3; cálculo intermediário até 6;
- conversão e custo médio calculados com precisão decimal, sem ponto flutuante binário;
- arredondamento monetário: meio para o par no fechamento de cada valor monetário persistido;
- soma usa valores persistidos; resíduo de rateio é distribuído deterministicamente à última linha elegível e auditado;
- quantidade nunca é arredondada para permitir saldo negativo ou exceder disponível.

## 7. Desempenho

No equipamento mínimo homologado futuramente:

- feedback visual: ≤100 ms;
- busca/lista inicial: p95 ≤1 s;
- consulta de detalhe/razão comum: p95 ≤1 s;
- comando transacional comum: p95 ≤2 s;
- abertura da aplicação até identificação: ≤5 s;
- dashboard mensal: p95 ≤3 s;
- fechamento anual: ≤30 s com progresso;
- backup de base de 10 GB: progresso contínuo e conclusão alvo ≤30 min;
- restauração: dentro do RTO, com progresso e etapa visível.

Medições usam dados representativos, armazenamento local e ambiente sem tarefas concorrentes artificiais.

## 8. Capacidade prevista

Horizonte de cinco anos por instalação:

- 10.000 clientes;
- 5.000 produtos/insumos combinados;
- 100.000 pedidos;
- 50.000 OPs;
- 500.000 movimentos de estoque;
- 300.000 movimentos financeiros;
- 2.000.000 eventos de auditoria;
- banco e anexos estruturados até 10 GB.

Ultrapassar 80% abre alerta de capacidade e exige medição/planejamento, não exclusão automática.

## 9. Disponibilidade e offline

Operação diária não depende de internet. Atualização e cópia externa podem usar conectividade, mas falha não interrompe dados locais. Meta de disponibilidade é definida pelo dispositivo; recuperação depende de backup externo válido.

## 10. Integridade e observabilidade

- verificações de FK e reconciliação em restauração/fechamento;
- razão como fonte de saldos;
- logs sanitizados com correlação por comando;
- falta de espaço, corrupção ou divergência gera bloqueio e pendência;
- relógio registra UTC e data operacional local; mudança abrupta gera aviso.

## 11. Critérios de aceite

RPO/RTO comprovados por teste; retenção aplicada sem remover última cópia; credencial ausente em claro; chave recuperável fora do dispositivo; precisão comprovada por fixtures; p95 dentro das metas no volume previsto; 10 GB restaurados dentro do RTO.