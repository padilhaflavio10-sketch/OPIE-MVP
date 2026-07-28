# ADR — Proposta de Stack do OPIE MVP

- **Status:** Proposto — pendente de auditoria e homologação
- **Data:** 2026-07-28
- **Decisão vinculante:** não
- **Implementação autorizada:** não

## Contexto

O OPIE MVP precisa de uma stack formal para uma aplicação desktop Windows, local e offline, aderente ao modelo lógico e aos controles homologados. A tentativa anterior da SPRINT-CODEX-072 foi interrompida porque tecnologias candidatas começaram a ser consideradas antes de uma decisão arquitetural formal.

## Direcionadores

- operação sem internet;
- persistência transacional embarcada;
- segurança e auditoria;
- backup e restauração verificáveis;
- footprint controlado;
- separação entre apresentação, casos de uso e infraestrutura;
- distribuição e assinatura no Windows;
- manutenção sustentável.

## Proposta corrigida para deliberação

A matriz corrigida posiciona como primeira colocada a Alternativa B:

- .NET em versão LTS;
- WinUI 3 ou WPF, escolha ainda pendente;
- SQLite;
- ferramentas de build, teste e distribuição Windows a definir após homologação.

A Alternativa B obteve 454 pontos (90,8%), oito pontos acima da Alternativa A. Por isso, B deve ser submetida primeiro à deliberação. Versões exatas, a escolha entre WinUI 3 e WPF e qualquer prova técnica permanecem pendentes. Nenhum elemento desta seção está aprovado enquanto o status continuar “Proposto”.

## Segunda alternativa

Tauri 2 + Rust + React/TypeScript + SQLite permanece como Alternativa A, segunda colocada com 446 pontos (89,2%). Seu detalhamento técnico anterior é preservado como insumo comparativo, não como decisão. A diferença de oito pontos não autoriza escolha automática de qualquer stack.

## Consequências esperadas da Alternativa A anteriormente detalhada

Positivas:

- núcleo fortemente tipado;
- baixo consumo comparado a runtimes web completos;
- banco local simples de operar;
- isolamento de capacidades;
- possibilidade de distribuição compacta.

Negativas:

- curva de Rust;
- duas linguagens e dois ecossistemas;
- dependência do WebView2;
- maior esforço inicial de automação desktop;
- necessidade de disciplina para impedir regras de negócio na UI.

## Restrições arquiteturais anteriormente propostas para a Alternativa A

- UI não acessa banco, filesystem ou segredos diretamente.
- Toda operação privilegiada passa por comando tipado e capacidade mínima.
- Casos de uso não dependem de Tauri, React ou SQLite.
- SQL, migrations e contratos respeitam exclusivamente o modelo homologado.
- Conteúdo remoto é proibido no shell operacional.
- Atualização e backup exigem assinatura/verificação e estratégia de rollback.
- Nenhuma decisão funcional pode ser criada na implementação.

## Critérios de eventual prova técnica futura

A prova, se autorizada e ajustada à alternativa que vier a ser homologada, deverá demonstrar sem implementar negócio:

1. build limpo em Windows;
2. instalador assinado em ambiente de teste;
3. abertura offline;
4. comando tipado UI–núcleo;
5. transação SQLite com rollback;
6. migration reversivelmente ensaiada em cópia descartável;
7. backup consistente e restauração validada;
8. logs sem segredos;
9. teste unitário, integração e E2E mínimo;
10. atualização assinada em canal de laboratório ou justificativa formal para adiamento;
11. acessibilidade básica por teclado e leitor;
12. medição de tamanho, memória e tempo de inicialização.

Os limiares quantitativos deverão ser definidos pela Sala de Reuniões antes da prova.

## Estado da decisão

Pendente. A auditoria poderá recomendar aprovação, revisão ou rejeição. Somente a Sala de Reuniões pode alterar o status para “Aceito” e autorizar a implementação.
