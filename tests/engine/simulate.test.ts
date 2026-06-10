import { simula, rilevanza } from '../../src/engine/simulate';
import type { Legge, Profilo, Regola } from '../../src/engine/types';

const regolaBase: Omit<Regola, 'id' | 'condizioni' | 'effetto' | 'confidenza'> = {
  campiNecessari: ['condizioneLavorativa', 'fasciaReddito'],
  timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
  fonteRegola: { etichetta: 'test', url: 'https://example.org' }
};

const legge: Legge = {
  id: 'test-legge', titoloDivulgativo: 'Test', titoloUfficiale: 'Test',
  stato: 'vigore', ambito: 'fisco-lavoro',
  fonti: [{ etichetta: 'test', url: 'https://example.org' }],
  verificataIl: '2026-06-10', riassunto: 'Legge di prova.',
  regole: [
    { ...regolaBase, id: 'r-bonus', confidenza: 'certa',
      condizioni: [{ campo: 'condizioneLavorativa', op: 'eq', valore: 'dipendente-privato' }],
      effetto: { tipo: 'economico', importoMese: { min: 60, max: 80 }, descrizione: 'Bonus', direzione: 'positivo' } },
    { ...regolaBase, id: 'r-tassa', confidenza: 'probabile',
      condizioni: [{ campo: 'condizioneLavorativa', op: 'eq', valore: 'dipendente-privato' }],
      effetto: { tipo: 'economico', importoMese: { min: 10, max: 10 }, descrizione: 'Costo', direzione: 'negativo' },
      timeline: { anno1: 'nullo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' } },
    { ...regolaBase, id: 'r-forse', confidenza: 'dipende',
      condizioni: [{ campo: 'condizioneLavorativa', op: 'eq', valore: 'dipendente-privato' }],
      effetto: { tipo: 'economico', importoMese: { min: 100, max: 100 }, descrizione: 'Forse', direzione: 'positivo' } },
    { ...regolaBase, id: 'r-isee', confidenza: 'certa', campiNecessari: ['fasciaIsee'],
      condizioni: [{ campo: 'fasciaIsee', op: 'alPiu', valore: 'da9360a15k' }],
      effetto: { tipo: 'servizio', descrizione: 'Sconto', direzione: 'positivo' } }
  ]
};

const dipendente: Profilo = {
  schemaVersion: 1, eta: 34,
  condizioneLavorativa: 'dipendente-privato', fasciaReddito: 'da15a20k'
};

test('applica le regole con condizioni vere', () => {
  const r = simula(dipendente, legge);
  expect(r.effetti.map((e) => e.id)).toEqual(['r-bonus', 'r-tassa', 'r-forse']);
});

test('segnala le regole non calcolabili con i campi mancanti', () => {
  const r = simula(dipendente, legge);
  expect(r.nonCalcolabili).toHaveLength(1);
  expect(r.nonCalcolabili[0].campiMancanti).toEqual(['fasciaIsee']);
});

test('totale: somma certa+probabile attive, esclude dipende, rispetta direzione e timeline', () => {
  const r = simula(dipendente, legge);
  expect(r.totaleMese.anno1).toEqual({ min: 60, max: 80 });   // tassa nulla anno1, dipende escluso
  expect(r.totaleMese.anno2).toEqual({ min: 50, max: 70 });   // 60-10 / 80-10
});

test('profilo non toccato: nessun effetto', () => {
  const pensionato: Profilo = { schemaVersion: 1, eta: 70, condizioneLavorativa: 'pensionato', fasciaReddito: 'da9a15k', fasciaIsee: 'oltre40k' };
  const r = simula(pensionato, legge);
  expect(r.effetti).toHaveLength(0);
  expect(r.nonCalcolabili).toHaveLength(0);
});

test('rilevanza: alta con effetti certi/probabili, media con soli dipende o non calcolabili, bassa altrimenti', () => {
  expect(rilevanza(dipendente, legge)).toBe('alta');
  const soloIseeMancante: Profilo = { schemaVersion: 1, eta: 50, condizioneLavorativa: 'pensionato', fasciaReddito: 'da9a15k' };
  expect(rilevanza(soloIseeMancante, legge)).toBe('media');
  const fuori: Profilo = { schemaVersion: 1, eta: 70, condizioneLavorativa: 'pensionato', fasciaReddito: 'da9a15k', fasciaIsee: 'oltre40k' };
  expect(rilevanza(fuori, legge)).toBe('bassa');
});

test('effetti misti o neutri con importo non entrano mai nei totali (difesa in profondità)', () => {
  const conMisto: Legge = {
    ...legge,
    regole: [
      { ...regolaBase, id: 'r-misto', confidenza: 'certa',
        condizioni: [{ campo: 'condizioneLavorativa', op: 'eq', valore: 'dipendente-privato' }],
        effetto: { tipo: 'economico', importoMese: { min: 30, max: 50 }, descrizione: 'Misto', direzione: 'misto' } }
    ]
  };
  const r = simula(dipendente, conMisto);
  expect(r.effetti).toHaveLength(1);               // l'effetto si vede
  expect(r.totaleMese.anno1).toEqual({ min: 0, max: 0 }); // ma non somma
});
