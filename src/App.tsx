import { useEffect, useRef, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

type HealthCheckResponse = {
  message: string;
  e2e: boolean;
};

export default function App() {
  const [status, setStatus] = useState('Pronto para iniciar.');
  const [loading, setLoading] = useState(false);
  const healthCheckStarted = useRef(false);

  async function verificarCore() {
    setLoading(true);
    try {
      const resposta = await invoke<HealthCheckResponse>('health_check');
      setStatus(resposta.message);

      if (resposta.e2e) {
        window.setTimeout(() => {
          void invoke('confirm_health_check_e2e', {
            response: resposta.message,
          });
        }, 5000);
      }
    } catch {
      setStatus('Não foi possível comunicar com o Core.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (healthCheckStarted.current) {
      return;
    }

    healthCheckStarted.current = true;
    void verificarCore();
  }, []);

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
