import { fibromialgiaLea } from '../../src/data/laws/fibromialgia-lea';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(fibromialgiaLea);
  if (!esito.success) throw new Error(esito.error.message);
});

// Verified: DPCM non pubblicato a giugno 2026 + esenzione solo forme molto severe (FIQR > 82)
test('condizione non riconosciuta: esenzione possibile ma tutta incerta (decreto non pubblicato)', () => {
  const p: Profilo = { schemaVersion: 1, eta: 40, disabilita: ['condizione-non-riconosciuta'] };
  const r = simula(p, fibromialgiaLea);
  const esenzione = r.effetti.find((e) => e.id === 'fibromialgia-esenzione');
  expect(esenzione).toBeDefined();
  expect(esenzione!.confidenza).toBe('dipende');
  expect(esenzione!.timeline.anno1).toBe('incerto');
  expect(esenzione!.timeline.anno10).toBe('incerto');
});

test('mostra anche il limite onesto per le forme non severe', () => {
  const p: Profilo = { schemaVersion: 1, eta: 40, disabilita: ['condizione-non-riconosciuta'] };
  const r = simula(p, fibromialgiaLea);
  expect(r.effetti.map((e) => e.id)).toContain('fibromialgia-forme-lievi');
});

test('chi non ha condizioni non riconosciute: nessun effetto', () => {
  const p: Profilo = { schemaVersion: 1, eta: 40, disabilita: ['motoria'] };
  const r = simula(p, fibromialgiaLea);
  expect(r.effetti).toHaveLength(0);
});

test('la legge è in discussione: lo stato lo dichiara', () => {
  expect(fibromialgiaLea.stato).toBe('discussione');
});
