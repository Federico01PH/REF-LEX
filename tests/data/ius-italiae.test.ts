import { iusItaliae } from '../../src/data/laws/ius-italiae';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(iusItaliae);
  if (!esito.success) throw new Error(esito.error.message);
});

// Verified: proposta non calendarizzata → stato discussione, tutto incerto e dipende
test('genitore extra-UE con figli: effetto possibile ma interamente incerto', () => {
  const p: Profilo = { schemaVersion: 1, eta: 40, cittadinanza: 'extra-ue', figli: 2 };
  const r = simula(p, iusItaliae);
  const figli = r.effetti.find((e) => e.id === 'ius-italiae-figli');
  expect(figli).toBeDefined();
  expect(figli!.confidenza).toBe('dipende');
  expect(figli!.timeline.anno1).toBe('incerto');
  expect(figli!.timeline.anno10).toBe('incerto');
});

test('giovane extra-UE senza figli: si applica la regola per i giovani', () => {
  const p: Profilo = { schemaVersion: 1, eta: 19, cittadinanza: 'extra-ue', figli: 0 };
  const r = simula(p, iusItaliae);
  expect(r.effetti.map((e) => e.id)).toEqual(['ius-italiae-giovani']);
});

test('cittadino italiano: nessun effetto', () => {
  const p: Profilo = { schemaVersion: 1, eta: 40, cittadinanza: 'italiana', figli: 2 };
  const r = simula(p, iusItaliae);
  expect(r.effetti).toHaveLength(0);
});

test('la proposta è dichiarata in discussione, non in vigore', () => {
  expect(iusItaliae.stato).toBe('discussione');
});
