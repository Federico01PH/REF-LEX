import { ddlAntisemitismo } from '../../src/data/laws/ddl-antisemitismo';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(ddlAntisemitismo);
  if (!esito.success) throw new Error(esito.error.message);
});

// È una PROPOSTA assorbita nel testo unificato S.1004: non deve mai apparire come legge in vigore
test('è modellata come proposta in discussione, non come legge in vigore', () => {
  expect(ddlAntisemitismo.stato).toBe('discussione');
  expect(ddlAntisemitismo.meseAnno).toBeUndefined();
  expect(ddlAntisemitismo.regole.every((r) => r.confidenza !== 'certa')).toBe(true);
});

// Effetto universale: il nuovo reato (art. 4 → 604-bis) tocca la libertà di espressione di tutti i maggiori di 14
test('chiunque (>=14) ha l\'effetto indiretto sulla libertà di espressione, ancorato all\'art. 21 Cost.', () => {
  const p: Profilo = { schemaVersion: 1, eta: 40 };
  const lib = simula(p, ddlAntisemitismo).effetti.find((e) => e.id === 'ddl-anti-liberta-espressione');
  expect(lib).toBeDefined();
  expect(lib!.effetto.indiretto).toBe(true);
  expect(lib!.effetto.direzione).toBe('misto');
  expect(lib!.effetto.dirittoToccato?.articolo).toBe('art. 21');
  expect(lib!.effetto.dirittoToccato?.intensita).toBe('sensibile');
  // sotto la soglia di imputabilità penale (14 anni) non scatta
  expect(simula({ schemaVersion: 1, eta: 13 }, ddlAntisemitismo).effetti.map((e) => e.id))
    .not.toContain('ddl-anti-liberta-espressione');
});

// Beneficiario diretto: chi è di religione ebraica
test('chi è di religione ebraica vede l\'effetto-tutela positivo; chi non lo dichiara no', () => {
  const ebrea: Profilo = { schemaVersion: 1, eta: 34, religione: 'ebraica' };
  const tutela = simula(ebrea, ddlAntisemitismo).effetti.find((e) => e.id === 'ddl-anti-tutela-ebrei');
  expect(tutela).toBeDefined();
  expect(tutela!.effetto.direzione).toBe('positivo');

  const cattolica: Profilo = { schemaVersion: 1, eta: 34, religione: 'cattolica' };
  expect(simula(cattolica, ddlAntisemitismo).effetti.map((e) => e.id)).not.toContain('ddl-anti-tutela-ebrei');
});

test('lo studente ha l\'effetto sui corsi scolastici', () => {
  const p: Profilo = { schemaVersion: 1, eta: 17, condizioneLavorativa: ['studente'] };
  expect(simula(p, ddlAntisemitismo).effetti.map((e) => e.id)).toContain('ddl-anti-studenti');
});

// Il personale pubblico coinvolto: effetto "dipende" (vale solo per alcuni ruoli)
test('il dipendente pubblico ha l\'effetto sui doveri/formazione, marcato "dipende"', () => {
  const p: Profilo = { schemaVersion: 1, eta: 47, condizioneLavorativa: ['dipendente-pubblico'] };
  const eff = simula(p, ddlAntisemitismo).effetti.find((e) => e.id === 'ddl-anti-personale-pubblico');
  expect(eff).toBeDefined();
  expect(eff!.confidenza).toBe('dipende');
  expect(eff!.effetto.direzione).toBe('misto');
});

// Nessun importo economico: questa legge non sposta soldi, non deve inventarne
test('non produce importi economici', () => {
  const p: Profilo = { schemaVersion: 1, eta: 40, religione: 'ebraica', condizioneLavorativa: ['dipendente-pubblico'] };
  const r = simula(p, ddlAntisemitismo);
  expect(r.totaleMese.anno1).toEqual({ min: 0, max: 0 });
  expect(r.totaleMese.anno10).toEqual({ min: 0, max: 0 });
});
