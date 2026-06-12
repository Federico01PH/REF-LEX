import { caseGreen } from '../../src/data/laws/case-green';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(caseGreen);
  if (!esito.success) throw new Error(esito.error.message);
});

// Verified: stop incentivi caldaie fossili dal 1/1/2025 (gia' operativo) → certa, attivo da subito
test('proprietario: stop bonus caldaie certo da subito, requisiti futuri incerti', () => {
  const p: Profilo = { schemaVersion: 1, eta: 45, abitazione: 'proprieta' };
  const r = simula(p, caseGreen);
  const caldaia = r.effetti.find((e) => e.id === 'epbd-caldaia-incentivi');
  expect(caldaia).toBeDefined();
  expect(caldaia!.confidenza).toBe('certa');
  expect(caldaia!.timeline.anno1).toBe('attivo');
  const requisiti = r.effetti.find((e) => e.id === 'epbd-requisiti-proprietari');
  expect(requisiti).toBeDefined();
  expect(requisiti!.confidenza).toBe('dipende');
  expect(requisiti!.timeline.anno5).toBe('incerto');
});

test('chi è in affitto: solo l\'effetto indiretto, misto e dipende', () => {
  const p: Profilo = { schemaVersion: 1, eta: 30, abitazione: 'affitto' };
  const r = simula(p, caseGreen);
  expect(r.effetti.map((e) => e.id)).toEqual(['epbd-affitto']);
  expect(r.effetti[0].effetto.direzione).toBe('misto');
});

test('chi possiede almeno due immobili: effetto indiretto in più, dipende dal recepimento', () => {
  const p: Profilo = { schemaVersion: 1, eta: 50, abitazione: 'proprieta', numeroProprieta: 2 };
  const r = simula(p, caseGreen);
  const multi = r.effetti.find((e) => e.id === 'epbd-piu-immobili');
  expect(multi).toBeDefined();
  expect(multi!.confidenza).toBe('dipende');
  expect(multi!.effetto.indiretto).toBe(true);
  const unaCasa: Profilo = { schemaVersion: 1, eta: 50, abitazione: 'proprieta', numeroProprieta: 1 };
  expect(simula(unaCasa, caseGreen).effetti.map((e) => e.id)).not.toContain('epbd-piu-immobili');
});

test('senza dato abitazione: effetto non calcolabile', () => {
  const p: Profilo = { schemaVersion: 1, eta: 30 };
  const r = simula(p, caseGreen);
  expect(r.effetti).toHaveLength(0);
  expect(r.nonCalcolabili.some((n) => n.campiMancanti.includes('abitazione'))).toBe(true);
});

test('nessun effetto economico nei totali (direzioni miste o non economiche)', () => {
  const p: Profilo = { schemaVersion: 1, eta: 45, abitazione: 'proprieta' };
  const r = simula(p, caseGreen);
  expect(r.totaleMese.anno1).toEqual({ min: 0, max: 0 });
});
