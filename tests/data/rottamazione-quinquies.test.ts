import { rottamazioneQuinquies } from '../../src/data/laws/rottamazione-quinquies';
import { CATALOGO } from '../../src/data/laws';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

const idEffetti = (p: Profilo) => simula(p, rottamazioneQuinquies).effetti.map((e) => e.id);

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(rottamazioneQuinquies);
  if (!esito.success) throw new Error(esito.error.message);
});

test('è nel catalogo', () => {
  expect(CATALOGO.map((l) => l.id)).toContain('rottamazione-quinquies-2026');
});

// Verified: L. 30 dicembre 2025, n. 199, art. 1, commi 82-110, in vigore dal 1/1/2026.
test('è una legge in vigore, non una proposta', () => {
  expect(rottamazioneQuinquies.stato).toBe('vigore');
  expect(rottamazioneQuinquies.meseAnno).toBe('dicembre 2025');
});

test('un maggiorenne qualsiasi vede finestra, rate, tributi locali e rinuncia ai giudizi', () => {
  const p: Profilo = { schemaVersion: 1, eta: 40, condizioneLavorativa: ['dipendente-privato'] };
  const ids = idEffetti(p);
  expect(ids).toContain('rottamazione-finestra-chiusa');
  expect(ids).toContain('rottamazione-rate-e-decadenza');
  expect(ids).toContain('rottamazione-tributi-locali');
  expect(ids).toContain('rottamazione-rinuncia-ai-giudizi');
  expect(ids).not.toContain('rottamazione-lavoro-autonomo');
});

test('il minorenne non riceve nulla: non ha cartelle proprie', () => {
  const p: Profilo = { schemaVersion: 1, eta: 17, condizioneLavorativa: ['studente'] };
  expect(idEffetti(p)).toEqual([]);
});

// Il punto più importante al 1° settembre 2026: la finestra per aderire è CHIUSA dal
// 30 aprile 2026. La scheda deve dirlo, non lasciar credere che si sia in tempo.
test('dice chiaramente che il termine per aderire è passato', () => {
  const r = rottamazioneQuinquies.regole.find((x) => x.id === 'rottamazione-finestra-chiusa')!;
  expect(r.effetto.descrizione).toContain('30 aprile 2026');
  expect(r.effetto.descrizione).toMatch(/non si può più aderire/i);
  expect(r.effetto.breve).toMatch(/passat|scadut|chius/i);
  // e la finestra non torna: dal secondo anno l'effetto è nullo
  expect(r.timeline.anno1).toBe('attivo');
  expect(r.timeline.anno2).toBe('nullo');
});

// Verified: la proroga di tre mesi del DL 25/2026, art. 2, comma 10, vale SOLO per chi al
// 18/1/2026 aveva residenza o sede in immobili sgomberati per inagibilità in Calabria,
// Sicilia e Sardegna. Non è una proroga generale.
test('la proroga del decreto maltempo è citata come eccezione stretta, non come regola', () => {
  const r = rottamazioneQuinquies.regole.find((x) => x.id === 'rottamazione-finestra-chiusa')!;
  expect(r.noteConfidenza).toContain('DL 25/2026');
  expect(r.noteConfidenza).toMatch(/inagibilit/i);
  expect(r.noteConfidenza).toMatch(/Calabria/);
  expect(rottamazioneQuinquies.fonti.some((f) => f.etichetta.includes('DL 27 febbraio 2026'))).toBe(true);
});

// Verified: comma 84 dice TRE per cento annuo. La stampa ha spesso scritto 4%: il testo no.
test('il tasso di interesse è il 3 per cento del testo, non il 4 per cento della stampa', () => {
  const r = rottamazioneQuinquies.regole.find((x) => x.id === 'rottamazione-rate-e-decadenza')!;
  expect(r.effetto.descrizione).toContain('3 per cento');
  expect(r.effetto.descrizione).not.toContain('4 per cento');
  expect(r.noteConfidenza).toContain('3 per cento');
});

// Verified comma 83: prime tre rate 31/7/2026, 30/9/2026, 30/11/2026; ultime tre nel 2035.
test('il calendario cita le prossime scadenze reali e il termine del piano', () => {
  const r = rottamazioneQuinquies.regole.find((x) => x.id === 'rottamazione-rate-e-decadenza')!;
  expect(r.effetto.descrizione).toContain('30 settembre');
  expect(r.effetto.descrizione).toContain('30 novembre 2026');
  expect(r.effetto.descrizione).toContain('2035');
  expect(r.effetto.descrizione).toContain('100 euro');
  // comma 95: saltano due rate anche non consecutive e la definizione è inefficace
  expect(r.effetto.descrizione).toMatch(/due, anche non consecutive|due, anche non di seguito|non consecutive/i);
  // il piano si chiude entro dieci anni
  expect(r.timeline.anno10).toBe('nullo');
});

test('chi lavora in proprio vede contributi INPS, DURC e revoca delle vecchie dilazioni', () => {
  for (const c of ['autonomo-ordinario', 'forfettario', 'imprenditore'] as const) {
    const ids = idEffetti({ schemaVersion: 1, eta: 45, condizioneLavorativa: [c] });
    expect(ids).toContain('rottamazione-lavoro-autonomo');
  }
  const r = rottamazioneQuinquies.regole.find((x) => x.id === 'rottamazione-lavoro-autonomo')!;
  expect(r.effetto.descrizione).toContain('INPS');
  expect(r.effetto.descrizione).toContain('DURC');
  expect(r.effetto.descrizione).toMatch(/revocate/);
  expect(r.effetto.direzione).toBe('misto');
});

// REF-LEX non chiede quanto debito hai: dire una cifra mensile sarebbe inventarla.
test('nessuna regola promette un importo in euro al mese', () => {
  for (const r of rottamazioneQuinquies.regole) expect(r.effetto.importoMese).toBeUndefined();
  const r = simula({ schemaVersion: 1, eta: 45, condizioneLavorativa: ['forfettario'] }, rottamazioneQuinquies);
  expect(r.totaleMese.anno1).toEqual({ min: 0, max: 0 });
  expect(r.totaleMese.anno5).toEqual({ min: 0, max: 0 });
});

test('la parte sui tributi locali è "probabile": la facoltà c\'è, la finestra dipende dal Comune', () => {
  const r = rottamazioneQuinquies.regole.find((x) => x.id === 'rottamazione-tributi-locali')!;
  expect(r.confidenza).toBe('probabile');
  expect(r.effetto.direzione).toBe('positivo');
  expect(r.noteConfidenza).toMatch(/facoltà, non l'obbligo|facoltà/i);
  // è l'unica parte che guarda avanti: resta attiva su tutti gli orizzonti
  expect(r.timeline.anno10).toBe('attivo');
});

// Comma 87: aderendo ci si impegna a rinunciare ai giudizi pendenti e le sentenze di merito
// non passate in giudicato diventano inefficaci.
test('la rinuncia ai giudizi è ancorata all\'art. 24 Cost. con intensità lieve', () => {
  const r = rottamazioneQuinquies.regole.find((x) => x.id === 'rottamazione-rinuncia-ai-giudizi')!;
  expect(r.effetto.indiretto).toBe(true);
  expect(r.effetto.dirittoToccato?.articolo).toBe('art. 24');
  expect(r.effetto.dirittoToccato?.intensita).toBe('lieve');
  // lieve perché aderire era volontario: la nota deve dirlo
  expect(r.noteConfidenza).toMatch(/volontaria/i);
});

test('senza il dato sull\'occupazione il motore lo chiede invece di indovinare', () => {
  const r = simula({ schemaVersion: 1, eta: 40 }, rottamazioneQuinquies);
  expect(r.nonCalcolabili.map((x) => x.regola.id)).toEqual(['rottamazione-lavoro-autonomo']);
});

test('ogni effetto ha una frase breve entro i 120 caratteri', () => {
  for (const regola of rottamazioneQuinquies.regole) {
    expect(regola.effetto.breve).toBeDefined();
    expect(regola.effetto.breve!.length).toBeLessThanOrEqual(120);
  }
});

test('le fonti sono istituzionali (Normattiva, Senato)', () => {
  const ammessi = ['normattiva.it', 'senato.it'];
  for (const f of rottamazioneQuinquies.fonti)
    expect(ammessi.some((d) => f.url.includes(d))).toBe(true);
});
