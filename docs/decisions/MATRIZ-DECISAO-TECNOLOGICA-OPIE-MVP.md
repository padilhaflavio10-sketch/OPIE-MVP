# Matriz de Decisão Tecnológica — OPIE MVP

**Status:** proposta pendente de auditoria e homologação  
**Efeito decisório:** nenhum até deliberação formal

## 1. Método

Escala de 1 (desfavorável) a 5 (muito favorável). A pontuação ponderada é peso × nota. Os pesos refletem o contexto offline e Windows da baseline; qualquer alteração de premissa exige recalcular a matriz.

| Critério | Peso |
|---|---:|
| Operação offline e banco embarcado | 18 |
| Segurança e superfície de ataque | 16 |
| Integração e distribuição Windows | 14 |
| Desempenho e consumo de recursos | 12 |
| Manutenibilidade e tipagem | 12 |
| Testabilidade e automação | 10 |
| Maturidade do ecossistema | 8 |
| Curva de aprendizagem | 6 |
| Portabilidade futura | 4 |
| **Total** | **100** |

## 2. Alternativas

A. Tauri 2 + Rust + React/TypeScript + SQLite  
B. .NET LTS + WinUI 3 ou WPF + SQLite  
C. Electron + React/TypeScript + SQLite  
D. Flutter Desktop + Dart + SQLite

## 3. Pontuação

| Critério | Peso | A | B | C | D |
|---|---:|---:|---:|---:|---:|
| Offline e banco embarcado | 18 | 5 | 5 | 4 | 4 |
| Segurança | 16 | 5 | 4 | 3 | 4 |
| Windows | 14 | 4 | 5 | 4 | 3 |
| Recursos | 12 | 5 | 4 | 2 | 4 |
| Manutenibilidade | 12 | 5 | 5 | 4 | 4 |
| Testabilidade | 10 | 4 | 5 | 5 | 4 |
| Ecossistema | 8 | 4 | 5 | 5 | 4 |
| Aprendizagem | 6 | 2 | 4 | 5 | 3 |
| Portabilidade | 4 | 4 | 2 | 5 | 5 |
| **Total ponderado / 500** | **100** | **446** | **454** | **388** | **384** |
| **Percentual** |  | **89,2%** | **90,8%** | **77,6%** | **76,8%** |

## 4. Demonstração dos cálculos

Cada parcela corresponde a peso × nota, sem alteração de pesos ou notas:

- A = (18×5) + (16×5) + (14×4) + (12×5) + (12×5) + (10×4) + (8×4) + (6×2) + (4×4) = 90 + 80 + 56 + 60 + 60 + 40 + 32 + 12 + 16 = **446**; 446 ÷ 500 × 100 = **89,2%**.
- B = (18×5) + (16×4) + (14×5) + (12×4) + (12×5) + (10×5) + (8×5) + (6×4) + (4×2) = 90 + 64 + 70 + 48 + 60 + 50 + 40 + 24 + 8 = **454**; 454 ÷ 500 × 100 = **90,8%**.
- C = (18×4) + (16×3) + (14×4) + (12×2) + (12×4) + (10×5) + (8×5) + (6×5) + (4×5) = 72 + 48 + 56 + 24 + 48 + 50 + 40 + 30 + 20 = **388**; 388 ÷ 500 × 100 = **77,6%**.
- D = (18×4) + (16×4) + (14×3) + (12×4) + (12×4) + (10×4) + (8×4) + (6×3) + (4×5) = 72 + 64 + 42 + 48 + 48 + 40 + 32 + 18 + 20 = **384**; 384 ÷ 500 × 100 = **76,8%**.

A soma dos pesos é 100 e a pontuação máxima é 500.

## 5. Ranking final

1. Alternativa B — **454 pontos (90,8%)**
2. Alternativa A — **446 pontos (89,2%)**
3. Alternativa C — **388 pontos (77,6%)**
4. Alternativa D — **384 pontos (76,8%)**

B supera A por **8 pontos**. Não há empate.

## 6. Análise qualitativa

### A. Tauri 2 + Rust + React/TypeScript + SQLite

Vantagens: baixo consumo, separação forte entre UI e núcleo, segurança de memória, capacidades explícitas e boa aderência ao offline. Riscos: curva de Rust, automação E2E desktop a validar e dependência de WebView2. É a candidata preferencial pelo equilíbrio arquitetural e pela capacidade de manter regras críticas fora da UI.

### B. .NET LTS + WinUI 3/WPF + SQLite

Vantagens: integração Windows superior, ferramentas maduras, testes sólidos e equipe potencialmente mais fácil de formar. Riscos: menor portabilidade e decisão adicional entre WinUI 3 e WPF. Obtém a maior pontuação quantitativa e deve ser a primeira alternativa submetida à deliberação, sem que isso constitua homologação.

### C. Electron + React/TypeScript + SQLite

Vantagens: ampla maturidade, contratação mais simples, automação e ecossistema fortes. Riscos: maior memória, distribuição mais pesada, superfície de atualização ampliada e necessidade de endurecimento rigoroso do processo renderer/main.

### D. Flutter Desktop + Dart + SQLite

Vantagens: UI consistente, desempenho adequado e portabilidade. Riscos: menor integração Windows, ecossistema desktop mais estreito para necessidades administrativas locais e adoção de linguagem adicional sem benefício decisivo para o cenário atual.

## 7. Sensibilidade

A diferença de 8 pontos entre B e A é pequena diante da natureza qualitativa das notas. A manutenção de A como alternativa tecnicamente viável depende de:

- comprovar empacotamento, assinatura e atualização no ambiente Windows;
- validar E2E e acessibilidade da UI Tauri;
- demonstrar que a equipe consegue manter Rust;
- comprovar backup/restauração e migrações com SQLite.

Se qualquer condição falhar de forma bloqueante, B permanece a primeira alternativa para aprofundamento antes de considerar C ou D. A matriz não autoriza escolha automática nem homologação.

## 8. Recomendação

Submeter B, por possuir a maior pontuação (454), como primeira alternativa à deliberação, mantendo A como segunda colocada e alternativa técnica comparável. Qualquer prova técnica depende de autorização documental específica. A recomendação é consultiva, permanece pendente de auditoria e homologação e não autoriza implementação. A decisão final pertence à Sala de Reuniões.
