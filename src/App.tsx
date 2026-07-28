import { useRef, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import {
  beginCoreCheck,
  coreCheckFailed,
  coreCheckSucceeded,
  initialCoreStatus,
  isSectionActive,
  selectSection,
  type Section,
} from './appModel';

const sections: Array<{ id: Section; label: string }> = [
  { id: 'inicio', label: 'Início' },
  { id: 'exploracao', label: 'Exploração' },
  { id: 'sobre', label: 'Sobre' },
];

export default function App() {
  const [section, setSection] = useState<Section>('inicio');
  const [coreStatus, setCoreStatus] = useState(initialCoreStatus);
  const checkInProgress = useRef(false);

  async function verificarNucleo() {
    if (checkInProgress.current) {
      return;
    }

    checkInProgress.current = true;
    setCoreStatus((current) => beginCoreCheck(current));

    try {
      const response = await invoke<string>('health_check');
      setCoreStatus(coreCheckSucceeded(response));
    } catch {
      setCoreStatus(coreCheckFailed());
    } finally {
      checkInProgress.current = false;
    }
  }

  function navegar(nextSection: Section) {
    setSection((current) => selectSection(current, nextSection));
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" onClick={() => navegar('inicio')}>
          <span className="brand-mark" aria-hidden="true">O</span>
          <span>
            <strong>OPIE</strong>
            <small>Ambiente de Exploração</small>
          </span>
        </a>

        <nav aria-label="Navegação principal">
          {sections.map((item) => (
            <button
              className="nav-item"
              type="button"
              key={item.id}
              aria-current={isSectionActive(section, item.id) ? 'page' : undefined}
              onClick={() => navegar(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <span className="version-chip">v{__APP_VERSION__}</span>
      </header>

      <main id="conteudo" className="content" tabIndex={-1}>
        {section === 'inicio' && (
          <section aria-labelledby="inicio-title">
            <div className="hero">
              <div>
                <span className="eyebrow">BASELINE {__APP_VERSION__} · EXPLORAÇÃO</span>
                <h1 id="inicio-title">Uma base aberta para observar antes de decidir.</h1>
                <p className="lead">
                  Esta versão estabelece a fundação técnica da OPIE. Os próximos
                  fluxos serão definidos a partir do uso e das necessidades observadas.
                </p>
              </div>
              <div className="ambient-orbit" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="dashboard-grid">
              <article className="status-card">
                <div className="card-heading">
                  <div>
                    <span className="card-kicker">NÚCLEO</span>
                    <h2>Estado da plataforma</h2>
                  </div>
                  <span className={`status-badge status-${coreStatus.kind}`}>
                    {coreStatus.label}
                  </span>
                </div>
                <p aria-live="polite" aria-atomic="true">{coreStatus.message}</p>
                <button
                  className="primary-action"
                  type="button"
                  disabled={coreStatus.kind === 'checking'}
                  onClick={verificarNucleo}
                >
                  {coreStatus.kind === 'checking' ? 'Verificando…' : 'Verificar núcleo'}
                </button>
              </article>

              <article className="info-card">
                <span className="card-kicker">AGORA</span>
                <h2>Explorar com intenção</h2>
                <p>
                  Use a plataforma, observe o que se repete e registre suas percepções
                  fora do aplicativo. Nenhuma direção funcional foi presumida.
                </p>
                <button
                  className="text-action"
                  type="button"
                  onClick={() => navegar('exploracao')}
                >
                  Ver orientações <span aria-hidden="true">→</span>
                </button>
              </article>
            </div>
          </section>
        )}

        {section === 'exploracao' && (
          <section className="page" aria-labelledby="exploracao-title">
            <span className="eyebrow">EXPLORAÇÃO</span>
            <h1 id="exploracao-title">Observe o trabalho como ele realmente acontece.</h1>
            <p className="lead">
              Esta etapa serve para reconhecer necessidades antes de transformar
              suposições em funcionalidades.
            </p>
            <ol className="observation-list">
              <li><strong>Utilize.</strong><span>Percorra a base e reconheça o ambiente.</span></li>
              <li><strong>Observe.</strong><span>Perceba tarefas repetitivas e pontos de atrito.</span></li>
              <li><strong>Registre.</strong><span>Anote dificuldades fora do produto, sem dados operacionais aqui.</span></li>
              <li><strong>Identifique.</strong><span>Liste informações que precisam ser consultadas com frequência.</span></li>
            </ol>
            <aside className="note">
              Esta versão não coleta informações nem guarda registros. O aprendizado
              desta fase acontece pela observação consciente do uso.
            </aside>
          </section>
        )}

        {section === 'sobre' && (
          <section className="page" aria-labelledby="sobre-title">
            <span className="eyebrow">SOBRE</span>
            <h1 id="sobre-title">OPIE, versão {__APP_VERSION__}</h1>
            <p className="lead">
              Uma versão experimental destinada a validar a fundação técnica e
              orientar os próximos passos a partir de evidências reais.
            </p>
            <div className="about-grid">
              <article>
                <span className="card-kicker">BASELINE</span>
                <strong>{__APP_VERSION__} · Exploration</strong>
                <p>React, TypeScript, Tauri e Rust em uma aplicação local para Windows.</p>
              </article>
              <article>
                <span className="card-kicker">PRIVACIDADE</span>
                <strong>Sem coleta de dados</strong>
                <p>Não há telemetria, persistência, integração remota ou arquivos locais.</p>
              </article>
            </div>
            <details className="technical-note">
              <summary>Nota para avaliação técnica</summary>
              <p>
                O comando do núcleo possui teste unitário e o pacote possui smoke test.
                Ainda não existe automação causal do fluxo completo entre UI, IPC Tauri
                e Rust no aplicativo distribuído.
              </p>
            </details>
          </section>
        )}
      </main>

      <footer>
        <span>OPIE · Ambiente de Exploração</span>
        <span>Baseline {__APP_VERSION__}</span>
      </footer>
    </div>
  );
}
