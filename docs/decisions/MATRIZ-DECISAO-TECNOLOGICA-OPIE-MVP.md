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
| **Total ponderado / 500** | **100** | **458** | **458** | **382** | **388** |
| **Percentual** |  | **91,6%** | **91,6%** | **76,4%** | **77,6%** |

## 4. Análise qualitativa

### A. Tauri 2 + Rust + React/TypeScript + SQLite

Vantagens: baixo consumo, separação forte entre UI e núcleo, segurança de memória, capacidades explícitas e boa aderência ao offline. Riscos: curva de Rust, automação E2E desktop a validar e dependência de WebView2. É a candidata preferencial pelo equilíbrio arquitetural e pela capacidade de manter regras críticas fora da UI.

### B. .NET LTS + WinUI 3/WPF + SQLite

Vantagens: integração Windows superior, ferramentas maduras, testes sólidos e equipe potencialmente mais fácil de formar. Riscos: menor portabilidade e decisão adicional entre WinUI 3 e WPF. Empata quantitativamente e é a alternativa de contingência recomendada, especialmente se a prova técnica revelar custo excessivo de Rust/Tauri.

### C. Electron + React/TypeScript + SQLite

Vantagens: ampla maturidade, contratação mais simples, automação e ecossistema fortes. Riscos: maior memória, distribuição mais pesada, superfície de atualização ampliada e necessidade de endurecimento rigoroso do processo renderer/main.

### D. Flutter Desktop + Dart + SQLite

Vantagens: UI consistente, desempenho adequado e portabilidade. Riscos: menor integração Windows, ecossistema desktop mais estreito para necessidades administrativas locais e adoção de linguagem adicional sem benefício decisivo para o cenário atual.

## 5. Sensibilidade

O empate entre A e B é relevante. A preferência por A depende de:

- comprovar empacotamento, assinatura e atualização no ambiente Windows;
- validar E2E e acessibilidade da UI Tauri;
- demonstrar que a equipe consegue manter Rust;
- comprovar backup/restauração e migrações com SQLite.

Se qualquer condição falhar de forma bloqueante, B deve ser reavaliada antes de considerar C ou D. A matriz não autoriza escolha automática.

## 6. Recomendação

Submeter A como candidata principal e B como contingência obrigatória a uma prova técnica curta, documentalmente autorizada. A decisão final pertence à Sala de Reuniões.
