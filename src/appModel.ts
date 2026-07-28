export type Section = 'inicio' | 'exploracao' | 'sobre';
export type CoreStatusKind = 'unchecked' | 'checking' | 'available' | 'unavailable';

export type CoreStatus = {
  kind: CoreStatusKind;
  label: string;
  message: string;
};

export const initialCoreStatus: CoreStatus = {
  kind: 'unchecked',
  label: 'Não verificado',
  message: 'A comunicação com o núcleo ainda não foi verificada.',
};

export function beginCoreCheck(current: CoreStatus): CoreStatus {
  if (current.kind === 'checking') {
    return current;
  }

  return {
    kind: 'checking',
    label: 'Verificando',
    message: 'Estabelecendo comunicação segura com o núcleo…',
  };
}

export function coreCheckSucceeded(response: string): CoreStatus {
  return {
    kind: 'available',
    label: 'Disponível',
    message: response,
  };
}

export function coreCheckFailed(): CoreStatus {
  return {
    kind: 'unavailable',
    label: 'Indisponível',
    message: 'Não foi possível verificar o núcleo. Tente novamente em alguns instantes.',
  };
}

export function selectSection(_current: Section, next: Section): Section {
  return next;
}

export function isSectionActive(current: Section, candidate: Section): boolean {
  return current === candidate;
}
