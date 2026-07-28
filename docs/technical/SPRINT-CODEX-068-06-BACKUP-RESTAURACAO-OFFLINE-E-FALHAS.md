# SPRINT-CODEX-068 — Backup, Restauração, Offline e Falhas

## 1. Objetivos de proteção

Backup cobre banco relacional, metadados de versão, configurações indispensáveis e anexos autorizados. Arquivos temporários, cache, logs sensíveis e credenciais em claro são excluídos.

Metas iniciais para validação futura:

- cópia automática diária após encerramento seguro ou primeira oportunidade;
- cópia manual sob demanda;
- retenção sugerida: 7 diárias, 4 semanais e 12 mensais, sujeita à capacidade local;
- ao menos uma cópia externa ao dispositivo principal;
- toda cópia identificada por versão, data, instalação, tamanho e hash;
- restauração só é concluída após verificação estrutural e funcional.

Essas metas são parâmetros técnicos propostos; a implementação futura deverá permitir configuração sem enfraquecer a exigência de cópia externa e teste periódico.

## 2. Criação consistente

1. impedir nova escrita ou obter snapshot transacional consistente;
2. finalizar/rollback de transações abertas;
3. executar verificação de integridade do banco;
4. copiar para arquivo temporário no destino;
5. sincronizar e fechar;
6. calcular SHA-256 do pacote;
7. gravar manifesto com schema, versão, timestamps e contagens críticas;
8. renomear atomicamente para nome definitivo;
9. registrar no catálogo e auditoria;
10. aplicar retenção somente depois de existir cópia válida.

Falha deixa o último backup válido intacto, remove/ignora pacote incompleto, informa o operador e abre pendência crítica quando não houver cópia recente.

## 3. Localização e proteção

- Diretório local separado do banco ativo.
- Cópia externa em mídia ou diretório sincronizado escolhido conscientemente pelo operador, sem dependência dessa sincronização para operação.
- Permissões restritas ao usuário.
- Nome sem dados pessoais: `opie-mvp_<installation>_<utc>_<schema>.backup`.
- Criptografia do pacote é requisito antes de usar destino não confiável; chave não deve estar somente no dispositivo perdido.

## 4. Procedimento completo de restauração

### Preparação

1. fechar a aplicação e preservar o ambiente atual como cópia de segurança;
2. selecionar pacote e ler manifesto;
3. verificar tamanho, SHA-256, versão e compatibilidade;
4. recusar arquivo incompleto, alterado ou de schema futuro não suportado;
5. restaurar primeiro em diretório temporário isolado.

### Validação técnica

6. abrir somente a cópia temporária;
7. executar integridade estrutural, chaves estrangeiras e versão de schema;
8. contar entidades e comparar com manifesto;
9. reconciliar razões de estoque, caixa e reserva com projeções;
10. validar vínculos de pedidos, OPs, pagamentos, estornos e auditoria;
11. executar consultas de sanidade sem escrita de negócio.

### Ativação

12. manter banco anterior renomeado e recuperável;
13. substituir atomicamente o banco ativo pela cópia validada;
14. iniciar aplicação em modo de verificação;
15. autenticar operador e conferir amostra operacional;
16. registrar evento de restauração e origem do pacote;
17. liberar operação somente após aceite explícito;
18. se qualquer passo falhar, retornar ao banco anterior.

## 5. Teste periódico de restauração

No mínimo trimestralmente e antes de atualização relevante:

- criar backup conhecido;
- restaurar em ambiente isolado;
- executar integridade e reconciliações;
- percorrer cenário de leitura: cliente → pedido → OP → estoque → pagamento → venda → fechamento → auditoria;
- comparar contagens e saldos com a origem;
- registrar duração, versão, pacote, hash, resultados e responsável;
- classificar discrepância como bloqueante;
- nunca testar substituindo diretamente o ambiente operacional.

Evidência exigida para futuro Portão 7: backup criado, hash verificado, restauração isolada concluída, reconciliação sem divergência e retorno controlado demonstrado.

## 6. Perda, corrupção e troca de computador

- **Perda do dispositivo:** instalar versão compatível, obter chave/credencial de recuperação, restaurar cópia externa e revalidar.
- **Corrupção:** preservar arquivo corrompido para diagnóstico, impedir novas escritas, restaurar último pacote válido e registrar intervalo potencialmente perdido.
- **Troca:** backup manual verificado, cópia externa, instalação limpa, restauração e aceite; desativação segura do computador antigo somente depois.

## 7. Funcionamento offline

Cadastros, compras, estoque, produção, pedidos, pagamentos, entregas, relatórios, auditoria e backup local funcionam sem internet. Nenhum comando diário depende de serviço remoto.

Conectividade poderá ser usada apenas para obtenção de atualização ou cópia externa escolhida. Perda de conexão não reverte operação local nem bloqueia o MVP. Sincronização entre instalações é evolução futura e não existe no escopo atual.

## 8. Matriz de falhas

| Operação | Ponto de falha | Estado esperado | Repetição / mensagem / pendência |
|---|---|---|---|
| Compra | após validação, antes do commit | compra não recebida; sem entrada | repetir mesma chave; “recebimento não concluído” |
| Reserva | durante múltiplos itens | nenhuma reserva parcial | repetir; pendência se saldo divergir |
| Início de OP | após primeira verificação | OP Planejada; sem reservas parciais | repetir após corrigir falta |
| Conclusão de OP | entre consumo e entrada | OP anterior; nenhum movimento | repetir mesma chave; bloqueante se reconciliação falhar |
| Pagamento | após commit, resposta perdida | pagamento confirmado uma vez | repetição retorna comprovante existente |
| Estorno | durante caixa/reserva | nenhum efeito parcial | repetir; informar saldo preservado |
| Entrega/retirada | entre baixa e venda | rollback completo | repetir; confirmação duplicada retorna resultado |
| Cancelamento | durante liberação | estado anterior | repetir; pendência se efeito externo existir |
| Fechamento | durante cálculo/gravação | nenhuma fotografia parcial | repetir mesma versão |
| Backup | escrita interrompida | pacote temporário inválido; anterior intacto | nova tentativa; pendência crítica por atraso |
| Restauração | validação falha | banco ativo anterior preservado | não ativar; mensagem com etapa e suporte |
| Atualização | migração futura falha | versão e dados anteriores recuperáveis | rollback de instalação e restauração prévia |

## 9. Instalação e atualização

Instalação futura deve verificar requisitos, criar diretórios com permissões, inicializar schema versionado e conduzir criação do Operador Principal. Dados ficam em diretório de aplicação do usuário, separado do executável.

Atualização exige:

1. versão compatível e assinatura do pacote;
2. backup validado prévio;
3. bloqueio de novas operações;
4. aplicação de transformação versionada em cópia/transação;
5. testes de integridade;
6. ativação atômica;
7. registro de versão;
8. retorno à versão anterior e restauração se falhar.

Nenhuma migration executável é produzida nesta Sprint.

## 10. Critério de portão

Backup e restauração permanecem portão técnico bloqueante até prova prática independente. Documento completo não equivale a restauração comprovada.