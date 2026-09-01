import { imputabilitaMinori } from '../../src/data/laws/imputabilita-minori';
import { CATALOGO } from '../../src/data/laws';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

const idEffetti = (p: Profilo) => simula(p, imputabilitaMinori).effetti.map((e) => e.id);

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(imputabilitaMinori);
  if (!esito.success) throw new Error(esito.error.message);
});

test('è nel catalogo', () => {
  expect(CATALOGO.map((l) => l.id)).toContain('ddl-imputabilita-minori-3080');
});

// Verified: A.C. 3080 presentato il 5 agosto 2026, fase iter "Da assegnare".
test('è modellata come proposta appena presentata, non come legge in vigore', () => {
  expect(imputabilitaMinori.stato).toBe('discussione');
  // meseAnno si mostra solo per le leggi in vigore: questa non lo è
  expect(imputabilitaMinori.meseAnno).toBeUndefined();
  expect(imputabilitaMinori.regole.every((r) => r.confidenza === 'dipende')).toBe(true);
  for (const r of imputabilitaMinori.regole)
    for (const o of ['anno1', 'anno2', 'anno5', 'anno10'] as const)
      expect(r.timeline[o]).toBe('incerto');
});

test('chi ha tra 14 e 17 anni riceve sia l\'effetto diretto sia quello sulle garanzie', () => {
  for (const eta of [14, 15, 16, 17]) {
    const ids = idEffetti({ schemaVersion: 1, eta });
    expect(ids).toContain('imputabilita-minore-14-17');
    expect(ids).toContain('imputabilita-onere-della-prova');
  }
});

// Verified: la proposta NON abbassa l'età dell'imputabilità, che resta ai 14 anni compiuti
// dell'art. 97 c.p. Chi ha 13 anni non è imputabile in nessun caso.
test('sotto i 14 anni la proposta non tocca nulla: nessun effetto', () => {
  expect(idEffetti({ schemaVersion: 1, eta: 13 })).toEqual([]);
});

test('il maggiorenne senza figli minorenni non riceve nessun effetto', () => {
  const p: Profilo = { schemaVersion: 1, eta: 18, personeACarico: false, tipiACarico: [] };
  expect(idEffetti(p)).toEqual([]);
});

test('l\'effetto sulle garanzie è ancorato all\'art. 27 Cost. con intensità sensibile', () => {
  const r = imputabilitaMinori.regole.find((x) => x.id === 'imputabilita-onere-della-prova')!;
  expect(r.effetto.indiretto).toBe(true);
  expect(r.effetto.dirittoToccato?.carta).toBe('Costituzione italiana');
  expect(r.effetto.dirittoToccato?.articolo).toBe('art. 27');
  expect(r.effetto.dirittoToccato?.intensita).toBe('sensibile');
});

// La relazione del Governo sostiene la tesi opposta (presunzione "relativa", precedente
// francese): la nota deve riportare entrambe le letture, non solo quella di REF-LEX.
test('la nota sull\'onere della prova riporta anche la lettura del Governo', () => {
  const r = imputabilitaMinori.regole.find((x) => x.id === 'imputabilita-onere-della-prova')!;
  expect(r.noteConfidenza).toMatch(/Governo/);
  expect(r.noteConfidenza).toMatch(/relativa/i);
  expect(r.noteConfidenza).toMatch(/REF-LEX/);
});

test('chi ha figli minorenni a carico riceve l\'effetto indiretto sulla famiglia', () => {
  const p: Profilo = { schemaVersion: 1, eta: 45, personeACarico: true, tipiACarico: ['figli-minorenni'] };
  const ids = idEffetti(p);
  expect(ids).toContain('imputabilita-genitori-di-minorenni');
  // il genitore non è lui stesso destinatario diretto della norma
  expect(ids).not.toContain('imputabilita-minore-14-17');
});

// Verified bug storico (Fondo Natalità di Anna, 74 anni): guardare "figli" senza guardarne
// l'età fa scattare regole su figli ormai adulti. Qui usiamo tipiACarico, non figli.
test('chi ha solo figli maggiorenni a carico non riceve l\'effetto sui minorenni', () => {
  const p: Profilo = { schemaVersion: 1, eta: 60, figli: 2, personeACarico: true, tipiACarico: ['figli-maggiorenni'] };
  expect(idEffetti(p)).not.toContain('imputabilita-genitori-di-minorenni');
});

test('senza il dato sulle persone a carico il motore lo chiede invece di indovinare', () => {
  const r = simula({ schemaVersion: 1, eta: 40 }, imputabilitaMinori);
  expect(r.effetti).toEqual([]);
  expect(r.nonCalcolabili.map((x) => x.regola.id)).toEqual(['imputabilita-genitori-di-minorenni']);
});

// chi ha gia' detto di non avere nessuno a carico non deve vedersi chiedere "chi hai a
// carico": il wizard quella domanda non gliela fa piu', quindi resterebbe un dato mancante
// per sempre. Il gancio su personeACarico chiude il caso invece di lasciarlo in sospeso.
test('a chi ha detto di non avere persone a carico non viene chiesto altro', () => {
  const r = simula({ schemaVersion: 1, eta: 40, personeACarico: false }, imputabilitaMinori);
  expect(r.effetti).toEqual([]);
  expect(r.nonCalcolabili).toEqual([]);
});

test('non produce importi economici mensili', () => {
  const r = simula({ schemaVersion: 1, eta: 15 }, imputabilitaMinori);
  expect(r.totaleMese.anno1).toEqual({ min: 0, max: 0 });
  expect(r.totaleMese.anno10).toEqual({ min: 0, max: 0 });
});

test('ogni effetto ha una frase breve entro i 120 caratteri', () => {
  for (const regola of imputabilitaMinori.regole) {
    expect(regola.effetto.breve).toBeDefined();
    expect(regola.effetto.breve!.length).toBeLessThanOrEqual(120);
  }
});

test('le fonti sono istituzionali (Camera, Governo, Normattiva, Senato)', () => {
  const ammessi = ['camera.it', 'governo.it', 'normattiva.it', 'senato.it'];
  for (const f of imputabilitaMinori.fonti)
    expect(ammessi.some((d) => f.url.includes(d))).toBe(true);
});

// Il nome "anti maranza" è di stampa: nel titolo ufficiale non deve comparire, ma il
// riassunto lo cita perché è così che la gente cerca questa proposta.
test('il titolo ufficiale usa il nome vero, il riassunto spiega il soprannome di stampa', () => {
  expect(imputabilitaMinori.titoloUfficiale).toContain('imputabilità del minore');
  expect(imputabilitaMinori.titoloUfficiale.toLowerCase()).not.toContain('maranza');
  expect(imputabilitaMinori.riassunto.toLowerCase()).toContain('maranza');
});
