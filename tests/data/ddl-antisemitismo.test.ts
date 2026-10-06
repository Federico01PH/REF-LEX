import { ddlAntisemitismo } from '../../src/data/laws/ddl-antisemitismo';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

const ids = (p: Profilo) => simula(p, ddlAntisemitismo).effetti.map((e) => e.id);
const effetto = (p: Profilo, id: string) => simula(p, ddlAntisemitismo).effetti.find((e) => e.id === id);

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(ddlAntisemitismo);
  if (!esito.success) throw new Error(esito.error.message);
});

// Al 6/10/2026: approvata dal Senato il 4/3/2026 (S. 1004, che ha assorbito il ddl Gasparri
// S. 1627), alla Camera è l'A.C. 2830, Commissione chiusa senza modifiche il 30/9/2026,
// discussione in Aula dal 2/10. Manca il voto finale: non è ancora legge.
test('modella il testo approvato dal Senato (A.C. 2830), non ancora legge', () => {
  expect(ddlAntisemitismo.stato).toBe('discussione');
  expect(ddlAntisemitismo.meseAnno).toBeUndefined();
  expect(ddlAntisemitismo.titoloUfficiale).toContain('A.C. 2830');
  expect(ddlAntisemitismo.riassunto).toContain('4 marzo 2026');
  expect(ddlAntisemitismo.regole.every((r) => r.confidenza !== 'certa')).toBe(true);
  expect(ddlAntisemitismo.regole.every((r) => !!r.effetto.breve)).toBe(true);
});

// Il nuovo reato dell'art. 604-bis c.p. e le sanzioni disciplinari erano nel testo Gasparri:
// nel testo approvato dal Senato NON ci sono. La scheda non deve più prometterli.
test('nessun nuovo reato e nessuna sanzione: il 604-bis e le sanzioni disciplinari sono spariti', () => {
  for (const r of ddlAntisemitismo.regole) {
    expect(r.effetto.descrizione).not.toMatch(/nuovo reato|604-bis|sanzioni disciplinari/i);
    expect(r.fonteRegola.url).not.toContain('regio.decreto:1930-10-19;1398');
  }
  expect(ids({ schemaVersion: 1, eta: 47, condizioneLavorativa: ['dipendente-pubblico'] }))
    .not.toContain('ddl-anti-personale-pubblico');
});

// Senza reato l'effetto sulla libertà di parola resta, ma passa da "sensibile" a "lieve":
// la definizione IHRA (con i suoi esempi su Israele) guida monitoraggio e misure online.
test('chiunque dai 14 anni ha l\'effetto indiretto sulla libertà di espressione (art. 21), lieve', () => {
  const lib = effetto({ schemaVersion: 1, eta: 40 }, 'ddl-anti-liberta-espressione');
  expect(lib).toBeDefined();
  expect(lib!.effetto.indiretto).toBe(true);
  expect(lib!.effetto.direzione).toBe('misto');
  expect(lib!.effetto.dirittoToccato?.articolo).toBe('art. 21');
  expect(lib!.effetto.dirittoToccato?.intensita).toBe('lieve');
  expect(lib!.effetto.descrizione).toContain('critica politica');
  expect(ids({ schemaVersion: 1, eta: 13 })).not.toContain('ddl-anti-liberta-espressione');
});

test('chi è di religione ebraica vede l\'effetto-tutela positivo; chi non lo dichiara no', () => {
  const tutela = effetto({ schemaVersion: 1, eta: 34, religione: 'ebraica' }, 'ddl-anti-tutela-ebrei');
  expect(tutela?.effetto.direzione).toBe('positivo');
  expect(tutela?.effetto.descrizione).toContain('Strategia nazionale');
  expect(ids({ schemaVersion: 1, eta: 34, religione: 'cattolica' })).not.toContain('ddl-anti-tutela-ebrei');
});

test('lo studente ha le attività a scuola e le misure delle università', () => {
  const r = effetto({ schemaVersion: 1, eta: 17, condizioneLavorativa: ['studente'] }, 'ddl-anti-studenti');
  expect(r?.effetto.tipo).toBe('servizio');
  expect(r?.effetto.descrizione).toContain('Giorno della Memoria');
});

// Formazione per Forze armate, Forze dell'ordine, prefetti e magistrati (art. 3, lett. e)
test('chi lavora nelle forze dell\'ordine o armate vede la formazione, marcata "dipende"', () => {
  const r = effetto({ schemaVersion: 1, eta: 35, settoriProfessionali: ['forze-ordine'] }, 'ddl-anti-forze-ordine');
  expect(r?.confidenza).toBe('dipende');
  expect(r?.effetto.tipo).toBe('dovere');
});

// Formazione per i docenti e comunicazione delle azioni delle scuole (art. 3, lett. c)
test('chi insegna vede la formazione e il compito di comunicare le azioni della scuola', () => {
  const r = effetto({ schemaVersion: 1, eta: 47, settoriProfessionali: ['scuola'] }, 'ddl-anti-docenti');
  expect(r?.confidenza).toBe('dipende');
  expect(r?.effetto.descrizione).toContain('Coordinatore nazionale');
});

// Nessun importo economico: la legge ha la clausola di invarianza finanziaria (art. 5)
test('non produce importi economici', () => {
  const p: Profilo = { schemaVersion: 1, eta: 40, religione: 'ebraica', settoriProfessionali: ['scuola'] };
  const r = simula(p, ddlAntisemitismo);
  expect(r.totaleMese.anno1).toEqual({ min: 0, max: 0 });
  expect(r.totaleMese.anno10).toEqual({ min: 0, max: 0 });
});
