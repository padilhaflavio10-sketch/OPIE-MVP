# Regra de Trava de Governança

**Status:** regra registral submetida à governança  
**Finalidade:** impedir execução por inferência diante de lacunas de autoridade

## Regra permanente

> Ao detectar ausência de autorização, ambiguidade de escopo, conflito documental, decisão arquitetural pendente ou qualquer lacuna de governança, interromper imediatamente a execução. Não inferir, escolher, complementar ou implementar. Relatar o bloqueio e aguardar deliberação formal da Sala de Reuniões.

## Aplicação obrigatória

A trava incide antes de qualquer ação que possa:

- criar ou alterar código, migrations, banco, configuração ou dependência;
- selecionar ou substituir tecnologia;
- alterar arquitetura, regra funcional, contrato ou baseline;
- publicar, integrar ou realizar merge;
- executar prova técnica não autorizada;
- preencher silêncio documental com interpretação própria.

## Procedimento de interrupção

1. cessar imediatamente a ação afetada;
2. preservar o estado encontrado e não desfazer evidência histórica;
3. identificar a autorização ausente, ambiguidade, conflito ou decisão pendente;
4. registrar o que foi e o que não foi executado;
5. indicar impacto, risco e opções sem escolher pela autoridade;
6. aguardar decisão formal da Sala de Reuniões;
7. retomar apenas mediante ordem expressa, rastreável e compatível com o escopo.

## Hierarquia

A execução técnica não cria autoridade. Comentário, proposta, commit, branch, protótipo, resultado de ferramenta ou publicação para auditoria não equivalem a homologação. Em conflito, prevalece a deliberação formal mais recente da Sala de Reuniões, desde que preserve os registros históricos e indique explicitamente o objeto autorizado.

## Efeito sobre a SPRINT-CODEX-072

A tentativa anterior permanece suspensa. A proposta de stack da SPRINT-CODEX-072R é insumo consultivo. Não há autorização para implementação, instalação, bootstrap, migration, banco, dependência ou merge na main.

## Critério de liberação

A trava somente pode ser liberada por deliberação formal que contenha, no mínimo:

- objeto e escopo autorizados;
- documentos e baseline aplicáveis;
- decisão arquitetural homologada quando necessária;
- branch e commit-base;
- restrições;
- entregáveis e critérios de aceite;
- autoridade responsável pela revisão e integração.

Na dúvida, a trava permanece ativa.
