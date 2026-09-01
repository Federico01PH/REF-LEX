import { digitalOmnibusAi } from '../../src/data/laws/digital-omnibus-ai';
import { aiAct } from '../../src/data/laws/ai-act';
import { CATALOGO } from '../../src/data/laws';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

const idEffetti = (p: Profilo) => simula(p, digitalOmnibusAi).effetti.map((e) => e.id);

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(digitalOmnibusAi);
  if (!esito.success) throw new Error(esito.error.message);
});

test('è nel catalogo', () => {
  expect(CATALOGO.map((l) => l.id)).toContain('reg-ue-2026-1744-omnibus-ia');
});

// Verified: Reg. (UE) 2026/1744 dell'8 luglio 2026, in GUUE il 24/7/2026, in vigore il
// 27/7/2026 (art. 4). È un regolamento: direttamente applicabile, niente legge italiana.
test('è un regolamento europeo già in vigore, non una proposta', () => {
  expect(digitalOmnibusAi.stato).toBe('vigore');
  expect(digitalOmnibusAi.origine).toBe('europea');
  expect(digitalOmnibusAi.meseAnno).toBe('luglio 2026');
  expect(digitalOmnibusAi.regole.every((r) => r.confidenza === 'certa')).toBe(true);
});

test('chiunque riceve i nuovi divieti, la marcatura e l\'effetto sui dati', () => {
  const p: Profilo = { schemaVersion: 1, eta: 70, condizioneLavorativa: ['pensionato'] };
  const ids = idEffetti(p);
  expect(ids).toContain('omnibus-divieto-deepfake-intimi');
  expect(ids).toContain('omnibus-marcatura-contenuti-ia');
  expect(ids).toContain('omnibus-dati-e-tutele-indiretto');
});

// Verified: i divieti dell'art. 5, par. 1, lett. b bis e b ter si applicano dal 2/12/2026.
test('il divieto sui deepfake intimi cita il consenso e la data del 2 dicembre 2026', () => {
  const r = digitalOmnibusAi.regole.find((x) => x.id === 'omnibus-divieto-deepfake-intimi')!;
  expect(r.effetto.direzione).toBe('positivo');
  expect(r.effetto.descrizione).toContain('2 dicembre 2026');
  expect(r.effetto.descrizione).toMatch(/consenso/);
  // il divieto copre anche il materiale pedopornografico generato da IA
  expect(r.effetto.descrizione).toMatch(/pedopornografico/);
  // onestà: non sostituisce i reati già previsti dal codice penale italiano
  expect(r.noteConfidenza).toMatch(/codice penale/);
});

test('lavoratori, disoccupati e studenti vedono il rinvio delle tutele ad alto rischio', () => {
  for (const c of ['dipendente-privato', 'dipendente-pubblico', 'disoccupato', 'studente'] as const) {
    const ids = idEffetti({ schemaVersion: 1, eta: 30, condizioneLavorativa: [c] });
    expect(ids).toContain('omnibus-rinvio-tutele-alto-rischio');
    expect(ids).not.toContain('omnibus-semplificazioni-imprese');
  }
});

// Verified: nuovo art. 113, terzo comma, lett. c): 2/12/2027 per l'allegato III e 2/8/2028
// per l'allegato I. Il vecchio termine era il 2 agosto 2026.
test('il rinvio è raccontato come perdita di tutela, con le date nuove e quella vecchia', () => {
  const r = digitalOmnibusAi.regole.find((x) => x.id === 'omnibus-rinvio-tutele-alto-rischio')!;
  expect(r.effetto.direzione).toBe('negativo');
  expect(r.effetto.descrizione).toContain('2 agosto 2026');
  expect(r.effetto.descrizione).toContain('2 dicembre 2027');
  expect(r.effetto.descrizione).toContain('2 agosto 2028');
  expect(r.effetto.descrizione).toContain('2 agosto 2030');
});

test('chi lavora in proprio vede le semplificazioni, non il rinvio delle tutele da lavoratore', () => {
  for (const c of ['autonomo-ordinario', 'forfettario', 'imprenditore'] as const) {
    const ids = idEffetti({ schemaVersion: 1, eta: 45, condizioneLavorativa: [c] });
    expect(ids).toContain('omnibus-semplificazioni-imprese');
    expect(ids).not.toContain('omnibus-rinvio-tutele-alto-rischio');
  }
});

test('chi è insieme studente e dipendente riceve il rinvio una volta sola', () => {
  const p: Profilo = { schemaVersion: 1, eta: 22, condizioneLavorativa: ['studente', 'dipendente-privato'] };
  const ids = idEffetti(p);
  expect(ids.filter((i) => i === 'omnibus-rinvio-tutele-alto-rischio')).toHaveLength(1);
});

test('l\'effetto indiretto è ancorato agli artt. 7 e 8 della Carta UE, intensità lieve', () => {
  const r = digitalOmnibusAi.regole.find((x) => x.id === 'omnibus-dati-e-tutele-indiretto')!;
  expect(r.effetto.indiretto).toBe(true);
  expect(r.effetto.direzione).toBe('misto');
  expect(r.effetto.dirittoToccato?.carta).toBe('Carta UE dei diritti fondamentali');
  expect(r.effetto.dirittoToccato?.intensita).toBe('lieve');
  // deve dire che il GDPR resta impregiudicato: è la ragione dell'intensità lieve
  expect(r.noteConfidenza).toMatch(/GDPR/);
});

// La scheda dell'AI Act e questa devono raccontare le stesse date: se un domani cambiano,
// il test lo fa notare invece di lasciare due verità diverse nella stessa app.
test('AI Act e Omnibus dicono le stesse date sui sistemi ad alto rischio', () => {
  const omnibus = digitalOmnibusAi.regole.find((r) => r.id === 'omnibus-rinvio-tutele-alto-rischio')!;
  const act = aiAct.regole.find((r) => r.id === 'ai-act-alto-rischio-lavoro')!;
  for (const data of ['2 dicembre 2027', '2 agosto 2028']) {
    expect(omnibus.effetto.descrizione).toContain(data);
    expect(act.effetto.descrizione).toContain(data);
  }
});

test('senza il dato sull\'occupazione il motore lo chiede invece di indovinare', () => {
  const r = simula({ schemaVersion: 1, eta: 40 }, digitalOmnibusAi);
  expect(r.nonCalcolabili.map((x) => x.regola.id).sort()).toEqual([
    'omnibus-rinvio-tutele-alto-rischio',
    'omnibus-semplificazioni-imprese'
  ]);
});

test('non produce importi economici mensili', () => {
  const r = simula({ schemaVersion: 1, eta: 40, condizioneLavorativa: ['dipendente-privato'] }, digitalOmnibusAi);
  expect(r.totaleMese.anno1).toEqual({ min: 0, max: 0 });
});

test('ogni effetto ha una frase breve entro i 120 caratteri', () => {
  for (const regola of digitalOmnibusAi.regole) {
    expect(regola.effetto.breve).toBeDefined();
    expect(regola.effetto.breve!.length).toBeLessThanOrEqual(120);
  }
});

test('le fonti sono ufficiali UE (EUR-Lex)', () => {
  for (const f of digitalOmnibusAi.fonti) expect(f.url).toContain('eur-lex.europa.eu');
});
