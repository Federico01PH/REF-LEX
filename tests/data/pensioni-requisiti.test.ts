import { pensioniRequisiti } from '../../src/data/laws/pensioni-requisiti';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(pensioniRequisiti);
  if (!esito.success) throw new Error(esito.error.message);
});

// Verified from L. 199/2025: +1 mese dal 2027, +2 dal 2028 → effetto negativo per chi lavora,
// nullo nel 1° anno (il 2026 resta a 67 anni), attivo dal 2° anno in poi
test('dipendente di 34 anni: adeguamento speranza di vita negativo dal 2° anno', () => {
  const p: Profilo = { schemaVersion: 1, eta: 34, condizioneLavorativa: 'dipendente-privato' };
  const r = simula(p, pensioniRequisiti);
  const adeguamento = r.effetti.find((e) => e.id === 'pensioni-adeguamento-speranza-vita');
  expect(adeguamento).toBeDefined();
  expect(adeguamento!.effetto.direzione).toBe('negativo');
  expect(adeguamento!.timeline.anno1).toBe('nullo');
  expect(adeguamento!.timeline.anno2).toBe('attivo');
  expect(adeguamento!.confidenza).toBe('certa');
});

test('pensionato: solo la regola neutra "non ti tocca"', () => {
  const p: Profilo = { schemaVersion: 1, eta: 72, condizioneLavorativa: 'pensionato' };
  const r = simula(p, pensioniRequisiti);
  expect(r.effetti.map((e) => e.id)).toEqual(['pensioni-gia-pensionato']);
  expect(r.effetti[0].effetto.direzione).toBe('neutro');
});

// Verified from L. 199/2025: Ape sociale 63 anni e 5 mesi, prorogata SOLO per il 2026 → anno2+ incerto
test('caregiver di 64 anni: Ape sociale possibile (dipende), proroga incerta dopo il 2026', () => {
  const p: Profilo = { schemaVersion: 1, eta: 64, condizioneLavorativa: 'caregiver' };
  const r = simula(p, pensioniRequisiti);
  const ape = r.effetti.find((e) => e.id === 'pensioni-ape-sociale');
  expect(ape).toBeDefined();
  expect(ape!.confidenza).toBe('dipende');
  expect(ape!.timeline.anno1).toBe('attivo');
  expect(ape!.timeline.anno2).toBe('incerto');
});

test('disoccupato di 60 anni: vecchiaia entro 10 anni, niente Ape (serve 63+)', () => {
  const p: Profilo = { schemaVersion: 1, eta: 60, condizioneLavorativa: 'disoccupato' };
  const r = simula(p, pensioniRequisiti);
  expect(r.effetti.some((e) => e.id === 'pensioni-vecchiaia-57-61')).toBe(true);
  expect(r.effetti.some((e) => e.id === 'pensioni-ape-sociale')).toBe(false);
});

test('studente di 20 anni: nessuna regola applicabile (non lavora ancora)', () => {
  const p: Profilo = { schemaVersion: 1, eta: 20, condizioneLavorativa: 'studente' };
  const r = simula(p, pensioniRequisiti);
  expect(r.effetti).toHaveLength(0);
});

test('nessun effetto economico: i totali mensili restano a zero', () => {
  const p: Profilo = { schemaVersion: 1, eta: 64, condizioneLavorativa: 'caregiver' };
  const r = simula(p, pensioniRequisiti);
  expect(r.totaleMese.anno1).toEqual({ min: 0, max: 0 });
});
