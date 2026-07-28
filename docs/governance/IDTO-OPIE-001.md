# IDTO-OPIE-001 v1.1

Documento consolidado a partir da baseline v1.0 publicada. Todo o conteúdo da v1.0 foi preservado. Ao final do inventário foram adicionadas apenas três novas deliberações em atendimento à RTC-001.

## Baseline v1.0 preservada

# IDTO-OPIE-001

## Inventário de Deliberações Técnicas Obrigatórias

| Campo | Valor |
|---|---|
| Documento | IDTO-OPIE-001 |
| Versão | 1.0 |
| Data | 28/07/2026 |
| Situação | Aprovado e publicado |
| Quantidade consolidada | 105 decisões obrigatórias |

## A.1 Objetivo

Identificar todas as decisões técnicas obrigatórias que deverão ser deliberadas antes do início da implementação do MVP.

## A.2 Natureza

Este inventário não escolhe tecnologias, não define soluções, não toma decisões arquiteturais e não autoriza implementação.

## A.3 Inventário completo

### Governança

| ID | Decisão obrigatória | Obrigatória | Situação |
|---|---|---|---|
| GOV-001 | Stack tecnológica oficial | Sim | Pendente de deliberação |
| GOV-002 | Regra de Trava de Governança | Sim | Pendente de deliberação |
| GOV-003 | Critério para futuras alterações de stack | Sim | Pendente de deliberação |

### Arquitetura

| ID | Decisão obrigatória | Obrigatória | Situação |
|---|---|---|---|
| ARC-001 | Arquitetura oficial do MVP | Sim | Pendente de deliberação |
| ARC-002 | Organização dos módulos | Sim | Pendente de deliberação |

### Stack

| ID | Decisão obrigatória | Obrigatória | Situação |
|---|---|---|---|
| STK-001 | Framework principal | Sim | Pendente de deliberação |
| STK-002 | Linguagem principal | Sim | Pendente de deliberação |
| STK-003 | Runtime | Sim | Pendente de deliberação |
| STK-004 | Banco de dados | Sim | Pendente de deliberação |
| STK-005 | Versões exatas de todos os componentes | Sim | Pendente de deliberação |

### Plataforma

| ID | Decisão obrigatória | Obrigatória | Situação |
|---|---|---|---|
| PLAT-001 | Sistema operacional mínimo | Sim | Pendente de deliberação |
| PLAT-002 | Arquiteturas suportadas | Sim | Pendente de deliberação |
| PLAT-003 | Requisitos mínimos do WebView2, se aplicável | Sim | Pendente de deliberação |
| PLAT-004 | Comportamento sem WebView2 | Sim | Pendente de deliberação |
| PLAT-005 | Edições suportadas do Windows | Sim | Pendente de deliberação |
| PLAT-006 | Escopo da instalação | Sim | Pendente de deliberação |
| PLAT-007 | Privilégios necessários | Sim | Pendente de deliberação |

### Banco de dados

| ID | Decisão obrigatória | Obrigatória | Situação |
|---|---|---|---|
| DB-001 | Localização do banco | Sim | Pendente de deliberação |
| DB-002 | Política de criação | Sim | Pendente de deliberação |
| DB-003 | Política de migração | Sim | Pendente de deliberação |
| DB-004 | Backup e recuperação | Sim | Pendente de deliberação |
| DB-005 | Configuração de integridade | Sim | Pendente de deliberação |
| DB-006 | Nome do banco | Sim | Pendente de deliberação |
| DB-007 | Permissões do banco | Sim | Pendente de deliberação |
| DB-008 | Tratamento de corrupção | Sim | Pendente de deliberação |
| DB-009 | SQLite Journal Mode | Sim | Pendente de deliberação |
| DB-010 | Timeout de bloqueio | Sim | Pendente de deliberação |
| DB-011 | Política de transações | Sim | Pendente de deliberação |
| DB-012 | Controle de migrations | Sim | Pendente de deliberação |

### Logs

| ID | Decisão obrigatória | Obrigatória | Situação |
|---|---|---|---|
| LOG-001 | Localização | Sim | Pendente de deliberação |
| LOG-002 | Rotação | Sim | Pendente de deliberação |
| LOG-003 | Retenção | Sim | Pendente de deliberação |
| LOG-004 | Conteúdo permitido | Sim | Pendente de deliberação |
| LOG-005 | Formato | Sim | Pendente de deliberação |
| LOG-006 | Codificação | Sim | Pendente de deliberação |
| LOG-007 | Níveis | Sim | Pendente de deliberação |
| LOG-008 | Falha de armazenamento | Sim | Pendente de deliberação |
| LOG-009 | Dados pessoais | Sim | Pendente de deliberação |
| LOG-010 | Conteúdo proibido | Sim | Pendente de deliberação |
| LOG-011 | Política de envio externo | Sim | Pendente de deliberação |

### Segurança

| ID | Decisão obrigatória | Obrigatória | Situação |
|---|---|---|---|
| SEC-001 | Política de segurança inicial | Sim | Pendente de deliberação |
| SEC-002 | Permissões do aplicativo | Sim | Pendente de deliberação |
| SEC-003 | Comunicação entre frontend e backend | Sim | Pendente de deliberação |
| SEC-004 | Tratamento de erros | Sim | Pendente de deliberação |
| SEC-005 | Content Security Policy | Sim | Pendente de deliberação |
| SEC-006 | URLs externas | Sim | Pendente de deliberação |
| SEC-007 | Execução de processos externos | Sim | Pendente de deliberação |
| SEC-008 | Armazenamento de segredos | Sim | Pendente de deliberação |

### Configuração

| ID | Decisão obrigatória | Obrigatória | Situação |
|---|---|---|---|
| CFG-001 | Diretórios utilizados | Sim | Pendente de deliberação |
| CFG-002 | Arquivos de configuração | Sim | Pendente de deliberação |
| CFG-003 | Política de configuração | Sim | Pendente de deliberação |
| CFG-004 | Precedência | Sim | Pendente de deliberação |
| CFG-005 | Validação das configurações | Sim | Pendente de deliberação |

### Build

| ID | Decisão obrigatória | Obrigatória | Situação |
|---|---|---|---|
| BLD-001 | Processo oficial de build | Sim | Pendente de deliberação |
| BLD-002 | Empacotamento | Sim | Pendente de deliberação |
| BLD-003 | Distribuição | Sim | Pendente de deliberação |
| BLD-004 | Lockfiles obrigatórios | Sim | Pendente de deliberação |
| BLD-005 | Política de fixação de versões | Sim | Pendente de deliberação |
| BLD-006 | Reprodutibilidade dos builds | Sim | Pendente de deliberação |

### Atualização

| ID | Decisão obrigatória | Obrigatória | Situação |
|---|---|---|---|
| UPD-001 | Política de atualização | Sim | Pendente de deliberação |
| UPD-002 | Rollback | Sim | Pendente de deliberação |
| UPD-003 | Validação de integridade | Sim | Pendente de deliberação |
| UPD-004 | Política de falhas | Sim | Pendente de deliberação |

### Dependências

| ID | Decisão obrigatória | Obrigatória | Situação |
|---|---|---|---|
| DEP-001 | Dependências críticas | Sim | Pendente de deliberação |
| DEP-002 | Política de atualização de dependências | Sim | Pendente de deliberação |
| DEP-003 | SBOM | Sim | Pendente de deliberação |
| DEP-004 | Política de licenciamento | Sim | Pendente de deliberação |
| DEP-005 | Política de vulnerabilidades | Sim | Pendente de deliberação |

### Interface

| ID | Decisão obrigatória | Obrigatória | Situação |
|---|---|---|---|
| UI-001 | Bootstrap mínimo | Sim | Pendente de deliberação |
| UI-002 | Identidade visual mínima | Sim | Pendente de deliberação |
| UI-003 | Acessibilidade técnica mínima | Sim | Pendente de deliberação |

### Testes

| ID | Decisão obrigatória | Obrigatória | Situação |
|---|---|---|---|
| TST-001 | Testes obrigatórios | Sim | Pendente de deliberação |
| TST-002 | Critérios de aceitação técnica | Sim | Pendente de deliberação |
| TST-003 | Evidências obrigatórias | Sim | Pendente de deliberação |
| TST-004 | Tratamento de testes não executáveis | Sim | Pendente de deliberação |

### Operação

| ID | Decisão obrigatória | Obrigatória | Situação |
|---|---|---|---|
| OPS-001 | Inicialização | Sim | Pendente de deliberação |
| OPS-002 | Encerramento seguro | Sim | Pendente de deliberação |

### Ambiente de desenvolvimento

| ID | Decisão obrigatória | Obrigatória | Situação |
|---|---|---|---|
| DEV-001 | Ambiente de desenvolvimento oficial | Sim | Pendente de deliberação |
| DEV-002 | Ferramentas obrigatórias | Sim | Pendente de deliberação |
| DEV-003 | Requisitos mínimos de desenvolvimento | Sim | Pendente de deliberação |
| DEV-004 | Procedimento de preparação do ambiente | Sim | Pendente de deliberação |

### Integração contínua

| ID | Decisão obrigatória | Obrigatória | Situação |
|---|---|---|---|
| CI-001 | Pipeline mínima obrigatória | Sim | Pendente de deliberação |
| CI-002 | Validações automáticas | Sim | Pendente de deliberação |
| CI-003 | Critérios mínimos de aprovação | Sim | Pendente de deliberação |

### Distribuição

| ID | Decisão obrigatória | Obrigatória | Situação |
|---|---|---|---|
| DST-001 | Assinatura de código | Sim | Pendente de deliberação |
| DST-002 | Assinatura do instalador | Sim | Pendente de deliberação |
| DST-003 | Origem oficial dos binários | Sim | Pendente de deliberação |
| DST-004 | Política de publicação | Sim | Pendente de deliberação |

### Instalação

| ID | Decisão obrigatória | Obrigatória | Situação |
|---|---|---|---|
| INS-001 | Instalação | Sim | Pendente de deliberação |
| INS-002 | Desinstalação | Sim | Pendente de deliberação |
| INS-003 | Preservação dos dados | Sim | Pendente de deliberação |

### Permissões

| ID | Decisão obrigatória | Obrigatória | Situação |
|---|---|---|---|
| PRM-001 | Rede | Sim | Pendente de deliberação |
| PRM-002 | Clipboard | Sim | Pendente de deliberação |
| PRM-003 | Notificações | Sim | Pendente de deliberação |
| PRM-004 | Execução em segundo plano | Sim | Pendente de deliberação |
| PRM-005 | Inicialização automática | Sim | Pendente de deliberação |
| PRM-006 | Integração com Shell | Sim | Pendente de deliberação |

### Tratamento de erros

| ID | Decisão obrigatória | Obrigatória | Situação |
|---|---|---|---|
| ERR-001 | Mensagens | Sim | Pendente de deliberação |
| ERR-002 | Códigos | Sim | Pendente de deliberação |
| ERR-003 | Nova tentativa | Sim | Pendente de deliberação |
| ERR-004 | Falhas por camada | Sim | Pendente de deliberação |

### Repositório

| ID | Decisão obrigatória | Obrigatória | Situação |
|---|---|---|---|
| REP-001 | Estrutura inicial | Sim | Pendente de deliberação |
| REP-002 | Convenções do repositório | Sim | Pendente de deliberação |

### Versionamento

| ID | Decisão obrigatória | Obrigatória | Situação |
|---|---|---|---|
| VER-001 | Política de versionamento da aplicação | Sim | Pendente de deliberação |
| VER-002 | Política de versionamento dos artefatos | Sim | Pendente de deliberação |

## A.4 Critério de completude

- Todas as categorias técnicas obrigatórias devem estar cobertas.
- Nenhuma decisão necessária à implementação pode permanecer implícita.
- A RTC deverá identificar somente itens ausentes, sem propor soluções.
- O inventário será considerado completo apenas após parecer RTC APROVADA.

## A.5 Aprovação do IDTO

| Campo | Valor |
|---|---|
| Solicitante | Flávio |
| Coordenação técnica | Mona |
| Autoridade de aprovação | Sala de Reuniões |
| Situação | APROVADO E PUBLICADO |

## Complementações da versão 1.1

| ID | Decisão obrigatória | Obrigatória | Situação |
|---|---|---|---|
| NFR-001 | Requisitos não funcionais da aplicação | Sim | Pendente de deliberação |
| PLAT-008 | Requisitos mínimos de hardware do ambiente operacional | Sim | Pendente de deliberação |
| DB-013 | Política de concorrência, múltiplas instâncias e acesso simultâneo ao banco local | Sim | Pendente de deliberação |

## Histórico de versões

- v1.0: baseline publicada.
- v1.1: preserva integralmente a v1.0 e acrescenta NFR-001, PLAT-008 e DB-013, sem renumerar os identificadores existentes.
