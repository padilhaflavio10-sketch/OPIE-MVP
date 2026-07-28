# ATA CONSOLIDADA DE DELIBERAÇÕES — FASE II

**Projeto:** OPIE MVP  
**Fase:** II — Deliberação das Decisões Técnicas  
**Documento:** ATA-DELIBERACOES-FASE-II  
**Versão:** 1.0  
**Status:** EM ANDAMENTO  
**Autoridade deliberativa:** Sala de Reuniões  
**Aprovador:** Flavio Padilha  
**Data de consolidação:** 28/07/2026  
**Referência normativa:** IDTO-OPIE-001 v1.1  

---

## 1. Finalidade

Esta ata consolida as decisões técnicas formalmente deliberadas e aprovadas na Fase II do OPIE MVP.

O documento constitui o registro oficial de rastreabilidade entre o inventário de decisões técnicas, as deliberações realizadas e as especificações que orientarão as etapas posteriores do projeto.

A implementação permanece condicionada às decisões aprovadas e às regras de governança estabelecidas neste documento.

---

## 2. Princípios de governança aplicáveis

As decisões registradas nesta ata observam os seguintes princípios:

- decisão antes da implementação;
- rastreabilidade entre decisão, justificativa e execução;
- proibição de alterações arquiteturais não documentadas;
- controle formal das mudanças de stack;
- separação de responsabilidades entre os módulos;
- atualização documental sempre que uma decisão aprovada for alterada.

---

## 3. DTT-001 — GOV-001 — Stack Tecnológica Oficial

**Status:** APROVADA  

### Deliberação

Fica aprovada a seguinte família tecnológica oficial para o OPIE MVP:

| Área | Tecnologia |
|---|---|
| Aplicação desktop | Tauri 2 |
| Interface | React |
| Linguagem da interface | TypeScript |
| Núcleo nativo | Rust |
| Banco de dados | SQLite |
| Plataforma-alvo | Windows |
| Motor de renderização | WebView2 |
| Ferramentas de frontend | Node.js e npm |
| Controle de versão | Git |
| Repositório | GitHub |
| Automação | GitHub Actions |

### Efeito

A stack aprovada constitui a base tecnológica obrigatória do projeto. As versões exatas dos componentes são tratadas separadamente por STK-005.

---

## 4. DTT-002 — GOV-002 — Regra de Trava de Governança

**Status:** APROVADA  

### Deliberação

Fica estabelecida a regra de trava de governança:

> **Decisão antes da implementação.**

Consequentemente:

- nenhuma implementação poderá preceder a aprovação da decisão técnica correspondente;
- alterações arquiteturais deverão ser previamente deliberadas;
- decisões deverão ser versionadas e rastreáveis;
- mudanças não documentadas ficam proibidas;
- a implementação deverá respeitar integralmente a baseline documental vigente.

### Efeito

Toda atividade de desenvolvimento fica subordinada às decisões aprovadas na Fase II e aos documentos normativos do projeto.

---

## 5. DTT-003 — GOV-003 — Critério para Futuras Alterações de Stack

**Status:** APROVADA  

### Deliberação

Qualquer alteração futura na stack tecnológica deverá conter, no mínimo:

1. nova deliberação técnica;
2. justificativa objetiva;
3. análise de impacto;
4. aprovação formal;
5. atualização dos documentos afetados.

### Efeito

Nenhum componente estrutural da stack poderá ser substituído, removido ou incorporado informalmente.

---

## 6. DTT-004 — ARC-001 — Arquitetura Oficial do MVP

**Status:** APROVADA  

### Deliberação

Fica aprovada a seguinte arquitetura oficial:

- **Frontend:** React com TypeScript;
- **Contêiner desktop:** Tauri 2;
- **Backend/Core:** Rust;
- **Persistência:** SQLite;
- **Comunicação interna:** comandos e eventos oficiais do Tauri.

### Regras arquiteturais

- arquitetura organizada em camadas;
- baixo acoplamento e alta coesão;
- proibição de acesso direto da interface ao banco de dados;
- acesso ao banco exclusivamente por meio do backend e do módulo de Persistência;
- regras de negócio centralizadas no Core;
- integração entre interface e núcleo exclusivamente por contratos explícitos.

### Efeito

Esta arquitetura torna-se referência obrigatória para as decisões de módulos, persistência, segurança, testes, build e implementação.

---

## 7. DTT-005 — ARC-002 — Organização dos Módulos

**Status:** APROVADA  

### Deliberação

A aplicação será organizada nos seguintes módulos:

### 7.1 Interface — UI

Responsável por:

- renderização;
- navegação;
- interação com o usuário.

A Interface não poderá:

- acessar diretamente o SQLite;
- acessar diretamente o sistema de arquivos;
- executar processos do sistema operacional sem mediação;
- conter regras de negócio.

### 7.2 Core — Rust

Responsável por:

- regras de negócio;
- orquestração da aplicação;
- validações centrais;
- coordenação dos casos de uso.

### 7.3 Persistência

Responsável por:

- acesso ao SQLite;
- migrações;
- transações;
- operações de backup relacionadas ao banco.

É o único módulo autorizado a acessar diretamente o banco de dados.

### 7.4 Infraestrutura

Responsável por:

- sistema de arquivos;
- configuração;
- logs;
- permissões;
- integração com o sistema operacional;
- notificações;
- mecanismos de atualização.

### 7.5 Serviços Compartilhados

Responsáveis por:

- utilitários comuns;
- serialização;
- contratos compartilhados;
- tratamento padronizado de erros;
- componentes reutilizáveis sem regra de negócio específica.

### Dependências permitidas

```text
UI
 ↓
Core
 ↓
Persistência

Core
 ↓
Infraestrutura

Todos os módulos
 ↓
Serviços Compartilhados
```

### Regras obrigatórias

- responsabilidade única por módulo;
- comunicação por contratos públicos;
- ausência de dependências circulares;
- proibição de acesso UI → Persistência;
- proibição de acesso UI → Infraestrutura sem mediação do Core;
- regras de negócio exclusivamente no Core.

---

## 8. DTT-006 — STK-001 — Framework Principal

**Status:** APROVADA  

### Deliberação

Fica aprovado o **Tauri 2** como framework desktop oficial do OPIE MVP.

O Tauri será responsável por:

- ciclo de vida da aplicação;
- gerenciamento de janelas;
- comunicação entre frontend e backend;
- comandos e eventos;
- integração controlada com recursos nativos;
- empacotamento e geração dos executáveis oficiais.

O Tauri não será utilizado para implementar regras de negócio, que permanecem sob responsabilidade do Core.

### Efeito

A substituição do Tauri dependerá de nova deliberação técnica conforme GOV-003.

---

## 9. DTT-007 — STK-002 a STK-005 — Stack Tecnológica Consolidada

**Status:** APROVADA  

### 9.1 STK-002 — Linguagens Oficiais

Ficam aprovadas:

- **TypeScript** para o frontend;
- **Rust** para o backend, Core e componentes nativos.

Nenhuma outra linguagem poderá ser adotada nos componentes principais sem nova deliberação.

### 9.2 STK-003 — Runtimes Oficiais

Ficam definidos:

- **WebView2**, provido pelo ambiente Tauri, para execução da interface;
- **Node.js LTS** para ferramentas de desenvolvimento do frontend;
- **binário nativo Rust**, sem runtime externo, para o Core.

Não ficam autorizados, nesta baseline, Electron, JVM ou .NET como runtime principal da aplicação.

### 9.3 STK-004 — Banco de Dados Oficial

Fica aprovado o **SQLite** como banco de dados oficial do OPIE MVP, com as seguintes características:

- banco embarcado;
- armazenamento local;
- ausência de servidor dedicado;
- acesso exclusivo pelo módulo de Persistência;
- uso de migrações e transações conforme decisões posteriores específicas.

A substituição do banco dependerá de nova deliberação técnica.

### 9.4 STK-005 — Política de Versionamento da Stack

Todas as versões deverão ser explicitamente fixadas antes do início da implementação.

Deverão possuir versão definida, no mínimo:

- Rust;
- Cargo;
- Tauri;
- React;
- TypeScript;
- Node.js;
- npm;
- SQLite;
- versão mínima suportada do WebView2;
- ferramentas de build;
- ações utilizadas no GitHub Actions.

Dependências críticas sem controle de versão ficam proibidas.

Quando aplicável, ações de CI/CD deverão ser fixadas por versão imutável ou SHA de commit.

A aprovação de STK-005 estabelece a política de fixação, mas não substitui o registro posterior dos números exatos de versão na baseline técnica do projeto.

---

## 10. Stack oficial consolidada

| Camada ou função | Tecnologia oficial |
|---|---|
| Framework desktop | Tauri 2 |
| Interface | React |
| Linguagem do frontend | TypeScript |
| Backend/Core | Rust |
| Banco de dados | SQLite |
| Renderização | WebView2 |
| Ferramentas de desenvolvimento | Node.js LTS e npm |
| Controle de versão | Git |
| Repositório | GitHub |
| Automação | GitHub Actions |

---

## 11. Situação consolidada da Fase II

### Governança

- GOV-001 — APROVADA;
- GOV-002 — APROVADA;
- GOV-003 — APROVADA.

**Status do bloco:** CONCLUÍDO.

### Arquitetura

- ARC-001 — APROVADA;
- ARC-002 — APROVADA.

**Status do bloco:** CONCLUÍDO.

### Stack Tecnológica

- STK-001 — APROVADA;
- STK-002 — APROVADA;
- STK-003 — APROVADA;
- STK-004 — APROVADA;
- STK-005 — APROVADA.

**Status do bloco:** CONCLUÍDO.

### Total registrado nesta versão

- 3 decisões de Governança;
- 2 decisões de Arquitetura;
- 5 decisões de Stack Tecnológica;
- **10 decisões técnicas aprovadas.**

---

## 12. Controle de continuidade

A Fase II permanece aberta para deliberação dos demais itens do IDTO-OPIE-001 v1.1.

A próxima atualização desta ata deverá:

- preservar o histórico das decisões já aprovadas;
- acrescentar novas DTTs em ordem sequencial;
- registrar alterações por nova versão do documento;
- identificar decisões substituídas ou revogadas sem apagar o registro histórico.

---

## 13. Aprovação

As decisões consolidadas neste documento foram aprovadas por **Flavio Padilha**, no âmbito da Sala de Reuniões do projeto OPIE MVP.

**Assinatura declaratória:** Flavio Padilha  
**Data:** 28/07/2026
