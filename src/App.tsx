import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

export default function App() {
  const [status, setStatus] = useState('Pronto para iniciar.');
  const [loading, setLoading] = useState(false);

  async function verificarCore() {
    setLoading(true);
    try {
      const resposta = await invoke<string>('health_check');
      setStatus(resposta);
    } catch {
      setStatus('Não foi possível comunicar com o Core.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <section className="hero">
        <span className="eyebrow">OPIE MVP</span>
        <h1>Controle simples para produção e caixa.</h1>
        <p>
          A base da aplicação está ativa. O próximo incremento será o primeiro
          fluxo operacional de insumos, produção e vendas.
        </p>
        <div className="actions">
          <button type="button" onClick={verificarCore} disabled={loading}>
            {loading ? 'Verificando…' : 'Verificar núcleo'}
          </button>
          <span className="status" role="status">{status}</span>
        </div>
      </section>

      <section className="grid" aria-label="Módulos iniciais">
        <article><strong>Caixa</strong><span>Entradas, saídas e saldo.</span></article>
        <article><strong>Insumos</strong><span>Estoque e consumo por produção.</span></article>
        <article><strong>Produção</strong><span>Empadões, pudins e custos.</span></article>
      </section>
    </main>
  );
}
