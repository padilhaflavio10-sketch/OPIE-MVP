# Proposta de Stack Técnica — OPIE MVP

**Status:** proposta pendente de auditoria e homologação  
**Caráter:** consultivo; não autoriza implementação, instalação ou criação de artefatos

## 1. Premissas

A proposta considera a baseline funcional e técnica vigente: aplicação desktop Windows, operação local e offline, banco embarcado, rastreabilidade, segurança por padrão, backup e restauração como portão técnico, manutenção por equipe enxuta e ausência de serviços externos obrigatórios no núcleo operacional.

Versões abaixo são faixas recomendadas para homologação. Antes de implementar, devem ser fixadas em lockfiles e confirmadas em uma prova técnica autorizada.

## 2. Alternativa A detalhada na proposta original

| Camada | Tecnologia candidata | Faixa recomendada | Justificativa |
|---|---|---:|---|
| Sistema-alvo | Windows 11 x64 | versão suportada pela Microsoft | reduz matriz de compatibilidade e preserva integração nativa |
| Shell desktop | Tauri | 2.11.x ou 2.x estável homologada | binário compacto, modelo de capacidades e integração com WebView2 |
| Núcleo nativo | Rust | stable, MSRV fixada após prova técnica | segurança de memória, tipos fortes e bom controle de I/O local |
| Interface | React | 19.2.x estável | ecossistema maduro e composição adequada ao UX homologado |
| Linguagem de UI | TypeScript | 6.0.x estável | tipagem estática; exige tratar deprecações antes de futura versão 7 |
| Build da UI | Vite | versão estável compatível e fixada | build local simples; não usar Create React App, já descontinuado |
| Persistência | SQLite | 3.53.x ou patch estável homologado | banco transacional, embarcado, offline e de baixo custo operacional |
| Acesso a dados | rusqlite | versão estável compatível | acesso explícito a SQL, transações e pragmas; evita abstração opaca |
| Serialização | serde | versão estável compatível | contratos tipados no limite Tauri–Rust |
| Erros | thiserror; anyhow somente na borda | versões estáveis compatíveis | erros de domínio/infrastrutura tipados e contexto nas bordas |
| Logs | tracing, tracing-subscriber e tracing-appender | versões estáveis compatíveis | eventos estruturados, correlação e rotação local |
| Senhas | Argon2id por biblioteca RustCrypto auditável | parâmetros a homologar | derivação resistente a ataques; nunca armazenar senha reversível |
| Segredos locais | Windows Credential Manager/DPAPI | API suportada | proteção vinculada ao sistema operacional |
| Testes Rust | cargo test e cargo-nextest | estáveis | testes unitários e de integração reproduzíveis |
| Testes UI | Vitest e Testing Library | estáveis compatíveis | componentes e comportamento observável |
| E2E | Playwright, após prova Tauri | estável compatível | automação de fluxos; viabilidade desktop deve ser validada |
| CI | GitHub Actions em runner Windows | imagem versionada | build, lint, teste, SBOM e empacotamento reproduzíveis |

## 3. Arquitetura de execução proposta

- Um único aplicativo desktop, sem servidor remoto obrigatório.
- UI React/TypeScript confinada à apresentação.
- Comandos Tauri mínimos e explícitos como adaptadores de entrada.
- Casos de uso e políticas no núcleo Rust.
- Portas por traits e adaptadores concretos para SQLite, sistema de arquivos, relógio, identidade e backup.
- Injeção por construtores; não se recomenda contêiner de DI.
- Repositórios com SQL explícito e transações no caso de uso.
- Migrações ordenadas, imutáveis e embarcadas, somente após autorização específica.
- Nenhuma regra funcional em componentes React, handlers Tauri ou triggers de banco.

## 4. Banco de dados e integridade

Proposta para homologação:

- SQLite em modo WAL quando validado para o perfil local;
- foreign_keys habilitado em toda conexão;
- busy_timeout, synchronous e política de checkpoints definidos por teste;
- uma unidade de trabalho por operação transacional;
- índices derivados exclusivamente do modelo lógico aprovado;
- migrations append-only com identificador, checksum e execução atômica;
- validação de integridade após restauração;
- nenhuma alteração de esquema fora de migration autorizada.

## 5. Autenticação e autorização

- Autenticação local, sem depender de internet.
- Hash de senha com Argon2id, salt único e parâmetros versionados.
- Primeiro usuário e recuperação administrativa definidos em Sprint própria; não inferidos.
- Autorização por permissões explícitas avaliadas no núcleo.
- Negação por padrão.
- Sessões locais com expiração e bloqueio de tela, parâmetros pendentes de decisão.
- Eventos sensíveis registrados em trilha auditável, sem dados secretos em logs.

## 6. Logs, erros e observabilidade

- Eventos estruturados com timestamp, nível, componente, correlation_id e código de erro.
- Rotação e retenção parametrizadas; proposta inicial sujeita a teste de volume.
- Separação entre mensagem segura ao usuário e detalhe técnico local.
- Erros tipados e traduzidos uma única vez na borda da UI.
- Redação obrigatória de senha, token, chave, conteúdo financeiro sensível e dados pessoais desnecessários.
- Exportação de diagnóstico somente por ação consciente e auditável do operador.

## 7. Segurança e criptografia

- Princípio do menor privilégio nas capacidades Tauri.
- CSP restritiva e ausência de conteúdo remoto no shell.
- Dependências fixadas e verificadas por auditoria de vulnerabilidade e licença.
- Assinatura de instalador e atualização obrigatória antes de distribuição.
- Chaves fora do banco quando tecnicamente possível, protegidas pelo Windows.
- Criptografia de backup com algoritmo autenticado e formato versionado; algoritmo e gestão de recuperação dependem de ADR específica.
- Atualização automática desabilitada até homologação de canal, assinatura, rollback e política offline.

## 8. Backup e restauração

- Backup consistente pela Online Backup API do SQLite; VACUUM INTO permanece alternativa para cópia compacta.
- Pacote versionado com banco, metadados mínimos, versão de esquema e hash SHA-256.
- Escrita em arquivo temporário, verificação e renomeação atômica.
- Restauração nunca sobrescreve o banco ativo antes de validar assinatura/hash, compatibilidade e integridade.
- Testes obrigatórios de restauração íntegra, arquivo adulterado, espaço insuficiente, interrupção e versão incompatível.
- RPO, RTO, destino externo e política de retenção permanecem parâmetros de governança.

## 9. Empacotamento, distribuição e atualização

- Instalador Windows MSI ou NSIS assinado; escolha final por prova operacional.
- WebView2 Evergreen como padrão, com política de versão mínima documentada.
- Build reproduzível em runner Windows e artefatos com SHA-256, SBOM e proveniência.
- Canal de atualização assinado, opt-in e reversível; sem atualização silenciosa enquanto não homologada.
- Rollback deve respeitar compatibilidade de esquema; downgrade destrutivo é proibido.

## 10. Compatibilidade e suporte

- Matriz inicial recomendada: Windows 11 x64 em versões sob suporte.
- Windows 10 somente se a Sala de Reuniões aceitar o custo e o risco de plataforma fora do suporte geral.
- Política de dependências: patches de segurança prioritários; revisão mensal; atualização planejada trimestral; majors apenas por ADR e regressão completa.
- Uma versão de produção suportada e a imediatamente anterior durante janela de transição.
- Inventário de componentes e licenças mantido a cada release.

## 11. Decisões ainda pendentes

Antes de implementar devem ser homologados:

- stack e versões exatas;
- versão mínima do Windows e do WebView2;
- MSI versus NSIS;
- parâmetros Argon2id e política de sessão;
- formato e criptografia do backup;
- RPO, RTO e retenção;
- política de atualização e rollback;
- estratégia E2E para Tauri;
- requisitos de assinatura de código;
- limites de log, retenção e exportação.

## 12. Fontes oficiais consultadas

- Tauri 2 — pré-requisitos e WebView2: https://v2.tauri.app/start/prerequisites/
- Tauri 2 — instalador Windows: https://v2.tauri.app/distribute/windows-installer/
- React — versões estáveis: https://react.dev/versions
- TypeScript 6.0 — notas oficiais: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html
- SQLite — versão corrente: https://sqlite.org/releaselog/current.html
- SQLite — Online Backup API: https://www.sqlite.org/backup.html
- SQLite — VACUUM INTO: https://www.sqlite.org/lang_vacuum.html

## 13. Parecer propositivo corrigido

A matriz corrigida atribui a maior pontuação à Alternativa B (.NET LTS + WinUI 3 ou WPF + SQLite), com 454 pontos (90,8%), seguida pela Alternativa A (Tauri 2 + Rust + React/TypeScript + SQLite), com 446 pontos (89,2%). Assim, B deve ser submetida como primeira alternativa à deliberação e A permanece como segunda alternativa tecnicamente viável.

O detalhamento anterior da Alternativa A é preservado para rastreabilidade e comparação; ele não prevalece sobre o ranking corrigido. A escolha entre WinUI 3 e WPF, as versões exatas e uma eventual prova técnica continuam pendentes. Este parecer é consultivo, aguarda auditoria e homologação e não aprova tecnologia nem autoriza implementação.
