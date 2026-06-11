import { decretoSicurezza } from '../../src/data/laws/decreto-sicurezza';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(decretoSicurezza);
  if (!esito.success) throw new Error(esito.error.message);
});

// Verified: L. 80/2025 in vigore dal 10/6/2025 → tutto certo e attivo
test('proprietario over 65: tutela casa e tutela truffe, tutte certe', () => {
  const p: Profilo = { schemaVersion: 1, eta: 70, abitazione: 'proprieta' };
  const r = simula(p, decretoSicurezza);
  const id = r.effetti.map((e) => e.id);
  expect(id).toContain('sicurezza-occupazione-casa');
  expect(id).toContain('sicurezza-truffe-anziani');
  expect(r.effetti.every((e) => e.confidenza === 'certa')).toBe(true);
});

test('giovane in affitto: niente tutela proprietari né anziani, restano sorveglianza e proteste', () => {
  const p: Profilo = { schemaVersion: 1, eta: 22, abitazione: 'affitto' };
  const r = simula(p, decretoSicurezza);
  const id = r.effetti.map((e) => e.id);
  expect(id).not.toContain('sicurezza-occupazione-casa');
  expect(id).not.toContain('sicurezza-truffe-anziani');
  expect(id).toContain('sicurezza-videosorveglianza');
  expect(id).toContain('sicurezza-proteste');
});

test('le regole su sorveglianza e proteste sono dichiarate "misto", non vendute come solo positive', () => {
  const sorveglianza = decretoSicurezza.regole.find((r) => r.id === 'sicurezza-videosorveglianza')!;
  const proteste = decretoSicurezza.regole.find((r) => r.id === 'sicurezza-proteste')!;
  expect(sorveglianza.effetto.direzione).toBe('misto');
  expect(proteste.effetto.direzione).toBe('misto');
});
