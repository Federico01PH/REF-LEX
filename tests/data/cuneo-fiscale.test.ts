import { cuneoFiscale } from '../../src/data/laws/cuneo-fiscale';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(cuneoFiscale);
  if (!esito.success) throw new Error(esito.error.message);
});

// Verified from L. 207/2024, art. 1, comma 4: 4.8% on income 15.001-20.000 €
// min = 4.8% × 15.000 / 12 = 60 €/mese
// max = 4.8% × 20.000 / 12 = 80 €/mese
// (the plan's max of 88 was wrong; 4.8% × 20.000 / 12 = 80)
test('dipendente 15-20k: somma integrativa 4,8% → 60-80 €/mese, certo al 1° anno', () => {
  const p: Profilo = { schemaVersion: 1, eta: 34, condizioneLavorativa: 'dipendente-privato', fasciaReddito: 'da15a20k' };
  const r = simula(p, cuneoFiscale);
  expect(r.effetti).toHaveLength(1);
  expect(r.effetti[0].effetto.importoMese).toEqual({ min: 60, max: 80 });
  expect(r.effetti[0].confidenza).toBe('certa');
  expect(r.totaleMese.anno1).toEqual({ min: 60, max: 80 });
});

// Verified: detrazione fissa 1.000 €/anno per redditi 20.001-32.000 €
// 1.000 / 12 = 83.33 → 83 €/mese (arrotondato al €)
test('dipendente 20-28k: detrazione 1.000 €/anno → 83 €/mese', () => {
  const p: Profilo = { schemaVersion: 1, eta: 40, condizioneLavorativa: 'dipendente-pubblico', fasciaReddito: 'da20a28k' };
  const r = simula(p, cuneoFiscale);
  expect(r.effetti[0].effetto.importoMese).toEqual({ min: 83, max: 83 });
});

test('pensionato: nessun effetto', () => {
  const p: Profilo = { schemaVersion: 1, eta: 70, condizioneLavorativa: 'pensionato', fasciaReddito: 'da9a15k' };
  const r = simula(p, cuneoFiscale);
  expect(r.effetti).toHaveLength(0);
});

test('dipendente senza fascia reddito: effetto non calcolabile', () => {
  const p: Profilo = { schemaVersion: 1, eta: 30, condizioneLavorativa: 'dipendente-privato' };
  const r = simula(p, cuneoFiscale);
  expect(r.effetti).toHaveLength(0);
  expect(r.nonCalcolabili.length).toBeGreaterThan(0);
  expect(r.nonCalcolabili[0].campiMancanti).toContain('fasciaReddito');
});

test('tutte le fasce hanno gli intervalli verificati sulla legge', () => {
  const attese: Record<string, { min: number; max: number }> = {
    'cuneo-fino9k': { min: 0, max: 50 },
    'cuneo-9-15k': { min: 40, max: 66 },
    'cuneo-15-20k': { min: 60, max: 80 },
    'cuneo-20-28k': { min: 83, max: 83 },
    'cuneo-28-35k': { min: 52, max: 83 },
    'cuneo-35-50k': { min: 0, max: 52 }
  };
  for (const regola of cuneoFiscale.regole) {
    expect(regola.effetto.importoMese).toEqual(attese[regola.id]);
  }
  expect(cuneoFiscale.regole).toHaveLength(6);
});
