import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App';
import ErrorBoundary from '../src/ErrorBoundary';

const { invokeMock } = vi.hoisted(() => ({
  invokeMock: vi.fn(),
}));

vi.mock('@tauri-apps/api/core', () => ({
  invoke: invokeMock,
}));

beforeEach(() => {
  invokeMock.mockReset();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('componente App — health check', () => {
  it('parte de Não verificado', () => {
    render(<App />);
    expect(screen.getByText('Não verificado')).toBeTruthy();
  });

  it('bloqueia repetição, chama invoke uma vez e conclui com sucesso', async () => {
    let resolveInvoke!: (value: string) => void;
    invokeMock.mockReturnValue(new Promise<string>((resolve) => {
      resolveInvoke = resolve;
    }));

    render(<App />);
    const button = screen.getByRole('button', { name: 'Verificar núcleo' });

    fireEvent.click(button);
    fireEvent.click(button);

    expect(screen.getByText('Verificando')).toBeTruthy();
    expect(button.hasAttribute('disabled')).toBe(true);
    expect(invokeMock).toHaveBeenCalledTimes(1);
    expect(invokeMock).toHaveBeenCalledWith('health_check');

    resolveInvoke('Core OPIE ativo e pronto.');

    await waitFor(() => {
      expect(screen.getByText('Disponível')).toBeTruthy();
      expect(button.hasAttribute('disabled')).toBe(false);
    });

    invokeMock.mockResolvedValueOnce('Core OPIE ativo e pronto.');
    fireEvent.click(button);
    await waitFor(() => expect(invokeMock).toHaveBeenCalledTimes(2));
  });

  it('apresenta falha segura e libera nova tentativa', async () => {
    invokeMock.mockRejectedValueOnce(new Error('C:\\segredo\\stack-interno'));
    render(<App />);

    const button = screen.getByRole('button', { name: 'Verificar núcleo' });
    fireEvent.click(button);

    await waitFor(() => expect(screen.getByText('Indisponível')).toBeTruthy());
    expect(screen.queryByText(/segredo|stack-interno/i)).toBeNull();
    expect(button.hasAttribute('disabled')).toBe(false);

    invokeMock.mockResolvedValueOnce('Core OPIE ativo e pronto.');
    fireEvent.click(button);
    await waitFor(() => expect(invokeMock).toHaveBeenCalledTimes(2));
  });
});

describe('componente App — navegação', () => {
  it('renderiza as três opções e atualiza conteúdo, aria-current e anúncio', () => {
    render(<App />);

    const inicio = screen.getByRole('button', { name: 'Início' });
    const exploracao = screen.getByRole('button', { name: 'Exploração' });
    const sobre = screen.getByRole('button', { name: 'Sobre' });

    expect(inicio.getAttribute('aria-current')).toBe('page');
    expect(exploracao).toBeTruthy();
    expect(sobre).toBeTruthy();

    fireEvent.click(exploracao);
    expect(screen.getByRole('heading', {
      name: 'Observe o trabalho como ele realmente acontece.',
    })).toBeTruthy();
    expect(exploracao.getAttribute('aria-current')).toBe('page');
    expect(inicio.getAttribute('aria-current')).toBeNull();
    expect(screen.getByText('Seção Exploração selecionada.')).toBeTruthy();

    fireEvent.click(sobre);
    expect(screen.getByRole('heading', { name: /OPIE, versão/ })).toBeTruthy();
    expect(sobre.getAttribute('aria-current')).toBe('page');
  });

  it('a marca é um botão interno funcional, sem hash enganoso', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Exploração' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ir para o início' }));

    expect(screen.getByRole('heading', {
      name: 'Uma base aberta para observar antes de decidir.',
    })).toBeTruthy();
    expect(screen.getByText('Seção Início selecionada.')).toBeTruthy();
  });
});

describe('componente ErrorBoundary', () => {
  it('oculta detalhes técnicos e permite tentar remontar a interface', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    let fail = true;

    function UnstableComponent() {
      if (fail) {
        throw new Error('DETALHE_TECNICO_SECRETO');
      }
      return <p>Interface remontada.</p>;
    }

    render(
      <ErrorBoundary>
        <UnstableComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.queryByText(/DETALHE_TECNICO_SECRETO/)).toBeNull();

    fail = false;
    fireEvent.click(screen.getByRole('button', {
      name: 'Tentar retornar ao início',
    }));

    expect(screen.getByText('Interface remontada.')).toBeTruthy();
    consoleError.mockRestore();
  });
});
