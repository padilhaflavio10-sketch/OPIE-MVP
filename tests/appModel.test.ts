import assert from 'node:assert/strict';
import test from 'node:test';
import {
  beginCoreCheck,
  coreCheckFailed,
  coreCheckSucceeded,
  initialCoreStatus,
  isSectionActive,
  selectSection,
} from '../src/appModel.ts';

test('health check inicia como não verificado', () => {
  assert.equal(initialCoreStatus.kind, 'unchecked');
  assert.equal(initialCoreStatus.label, 'Não verificado');
});

test('health check transita para verificando', () => {
  const checking = beginCoreCheck(initialCoreStatus);
  assert.equal(checking.kind, 'checking');
  assert.equal(checking.label, 'Verificando');
});

test('health check registra sucesso sem alterar a resposta do núcleo', () => {
  const available = coreCheckSucceeded('Core OPIE ativo e pronto.');
  assert.equal(available.kind, 'available');
  assert.equal(available.message, 'Core OPIE ativo e pronto.');
});

test('health check apresenta erro seguro', () => {
  const unavailable = coreCheckFailed();
  assert.equal(unavailable.kind, 'unavailable');
  assert.doesNotMatch(unavailable.message, /stack|path|error:/i);
});

test('novo acionamento é bloqueado enquanto a verificação está em andamento', () => {
  const checking = beginCoreCheck(initialCoreStatus);
  assert.equal(beginCoreCheck(checking), checking);
});

test('navegação alterna seções e identifica a seção ativa', () => {
  const selected = selectSection('inicio', 'exploracao');
  assert.equal(selected, 'exploracao');
  assert.equal(isSectionActive(selected, 'exploracao'), true);
  assert.equal(isSectionActive(selected, 'sobre'), false);
});
