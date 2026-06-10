import { salarioMinimo } from '../../src/data/laws/salario-minimo';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

// AC 1275 e' diventata legge come L. 144/2025 (legge delega, approvata il 26 settembre 2025).
// Non ha istituito un minimo fisso di 9 euro/ora, ma ha delegato il Governo a individuare
// i CCNL "maggiormente applicati" come soglia minima. I decreti attuativi sono ancora attesi.
// Quindi: stato = 'approvata' (la legge delega e' in vigore), ma l'effetto concreto e' ancora incerto.

test('rispetta lo schema ed e in stato approvata', () => {
  const esito = SchemaLegge.safeParse(salarioMinimo);
  if (!esito.success) throw new Error(esito.error.message);
  expect(salarioMinimo.stato).toBe('approvata');
});

test('dipendente a basso reddito: effetto con confidenza dipende, escluso dal totale', () => {
  const p: Profilo = { schemaVersion: 1, eta: 22, condizioneLavorativa: 'dipendente-privato', fasciaReddito: 'fino9k' };
  const r = simula(p, salarioMinimo);
  expect(r.effetti).toHaveLength(1);
  expect(r.effetti[0].confidenza).toBe('dipende');
  expect(r.totaleMese.anno1).toEqual({ min: 0, max: 0 });
});

test('autonomo: nessun effetto', () => {
  const p: Profilo = { schemaVersion: 1, eta: 45, condizioneLavorativa: 'autonomo-ordinario', fasciaReddito: 'da20a28k' };
  expect(simula(p, salarioMinimo).effetti).toHaveLength(0);
});
