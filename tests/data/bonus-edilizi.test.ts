import { bonusEdilizi } from '../../src/data/laws/bonus-edilizi';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(bonusEdilizi);
  if (!esito.success) throw new Error(esito.error.message);
});

// Verified: 50% × 96.000 € / 10 anni / 12 mesi = 400 €/mese massimo teorico
test('proprietario: detrazione fino a 400 €/mese, dipende da quanto spende', () => {
  const p: Profilo = { schemaVersion: 1, eta: 45, abitazione: 'proprieta' };
  const r = simula(p, bonusEdilizi);
  expect(r.effetti).toHaveLength(1);
  expect(r.effetti[0].effetto.importoMese).toEqual({ min: 0, max: 400 });
  expect(r.effetti[0].confidenza).toBe('dipende');
});

test('inquilino e comodatario: il bonus vale anche per loro', () => {
  const affitto: Profilo = { schemaVersion: 1, eta: 30, abitazione: 'affitto' };
  expect(simula(affitto, bonusEdilizi).effetti.map((e) => e.id)).toEqual(['bonus-edilizi-inquilino']);
  const comodato: Profilo = { schemaVersion: 1, eta: 30, abitazione: 'comodato' };
  expect(simula(comodato, bonusEdilizi).effetti.map((e) => e.id)).toEqual(['bonus-edilizi-inquilino']);
});

test('orizzonti lunghi incerti: dal 2027 aliquote in discesa salvo proroghe', () => {
  const p: Profilo = { schemaVersion: 1, eta: 45, abitazione: 'proprieta' };
  const r = simula(p, bonusEdilizi);
  expect(r.effetti[0].timeline.anno5).toBe('incerto');
});

test('confidenza dipende: niente importi finti nei totali', () => {
  const p: Profilo = { schemaVersion: 1, eta: 45, abitazione: 'proprieta' };
  const r = simula(p, bonusEdilizi);
  expect(r.totaleMese.anno1).toEqual({ min: 0, max: 0 });
});
