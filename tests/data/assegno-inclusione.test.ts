import { assegnoInclusione } from '../../src/data/laws/assegno-inclusione';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(assegnoInclusione);
  if (!esito.success) throw new Error(esito.error.message);
});

// Verified from DL 48/2023 agg. 2026: integrazione max 6.500 €/anno (542 €/mese)
// + affitto max 3.640 €/anno (303 €/mese) → tetto base 845 €/mese
test('madre con ISEE basso e 2 figli: assegno possibile fino a 845 €/mese, confidenza dipende', () => {
  const p: Profilo = { schemaVersion: 1, eta: 38, fasciaIsee: 'fino9360', figli: 2 };
  const r = simula(p, assegnoInclusione);
  const figli = r.effetti.find((e) => e.id === 'adi-isee-figli');
  expect(figli).toBeDefined();
  expect(figli!.effetto.importoMese).toEqual({ min: 0, max: 845 });
  expect(figli!.confidenza).toBe('dipende');
});

test('64enne solo con ISEE basso: rientra per età', () => {
  const p: Profilo = { schemaVersion: 1, eta: 64, fasciaIsee: 'fino9360', figli: 0 };
  const r = simula(p, assegnoInclusione);
  expect(r.effetti.map((e) => e.id)).toContain('adi-isee-over60');
  expect(r.effetti.map((e) => e.id)).not.toContain('adi-isee-figli');
});

test('disabilita certificata con ISEE basso: rientra; condizione non riconosciuta: no', () => {
  const certificata: Profilo = { schemaVersion: 1, eta: 30, fasciaIsee: 'fino9360', disabilita: ['motoria'] };
  expect(simula(certificata, assegnoInclusione).effetti.map((e) => e.id)).toContain('adi-isee-disabilita');
  const nonRiconosciuta: Profilo = { schemaVersion: 1, eta: 30, fasciaIsee: 'fino9360', disabilita: ['condizione-non-riconosciuta'] };
  expect(simula(nonRiconosciuta, assegnoInclusione).effetti.map((e) => e.id)).not.toContain('adi-isee-disabilita');
});

test('ISEE sopra la fascia di soglia: nessun effetto', () => {
  const p: Profilo = { schemaVersion: 1, eta: 38, fasciaIsee: 'da15a25k', figli: 2 };
  const r = simula(p, assegnoInclusione);
  expect(r.effetti).toHaveLength(0);
});

test('senza ISEE nel profilo: effetto non calcolabile con il campo mancante', () => {
  const p: Profilo = { schemaVersion: 1, eta: 38, figli: 2 };
  const r = simula(p, assegnoInclusione);
  expect(r.effetti).toHaveLength(0);
  expect(r.nonCalcolabili.some((n) => n.campiMancanti.includes('fasciaIsee'))).toBe(true);
});

test('confidenza dipende: i totali mensili non contano l\'assegno', () => {
  const p: Profilo = { schemaVersion: 1, eta: 38, fasciaIsee: 'fino9360', figli: 2 };
  const r = simula(p, assegnoInclusione);
  expect(r.totaleMese.anno1).toEqual({ min: 0, max: 0 });
});
