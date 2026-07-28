import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  failed: boolean;
};

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('Falha inesperada na interface.', error, info);
    }
  }

  private recover = () => {
    this.setState({ failed: false });
  };

  render() {
    if (this.state.failed) {
      return (
        <main className="recovery" role="alert">
          <span className="eyebrow">OPIE</span>
          <h1>Não foi possível exibir esta área.</h1>
          <p>O estado da interface pode ser restaurado com segurança.</p>
          <button className="primary-action" type="button" onClick={this.recover}>
            Retornar ao início
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}
