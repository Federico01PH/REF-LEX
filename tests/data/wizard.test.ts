import { DOMANDE } from '../../src/data/wizard';

test('"di cosa ti occupi" è una domanda a scelta multipla (si possono avere più occupazioni)', () => {
  const domanda = DOMANDE.find((d) => d.campo === 'condizioneLavorativa');
  expect(domanda).toBeDefined();
  expect(domanda!.tipo).toBe('multi');
});

test('le opzioni di "di cosa ti occupi" restano quelle previste', () => {
  const domanda = DOMANDE.find((d) => d.campo === 'condizioneLavorativa')!;
  const valori = (domanda.opzioni ?? []).map((o) => o.valore);
  expect(valori).toContain('studente');
  expect(valori).toContain('dipendente-privato');
  expect(valori).toContain('autonomo-ordinario');
});

test('"che lavoro fai" è un campo di testo libero subito dopo "di cosa ti occupi"', () => {
  const iOcc = DOMANDE.findIndex((d) => d.campo === 'condizioneLavorativa');
  const iProf = DOMANDE.findIndex((d) => d.campo === 'professione');
  const prof = DOMANDE[iProf];
  expect(prof).toBeDefined();
  expect(prof.tipo).toBe('testo');
  expect(iProf).toBe(iOcc + 1);
  expect(prof.obbligatoria).not.toBe(true); // facoltativo
});

test('"che lavoro fai" compare solo se hai scelto un\'occupazione lavorativa', () => {
  const prof = DOMANDE.find((d) => d.campo === 'professione')!;
  expect(prof.mostraSe).toBeDefined();
  // lavora → compare
  expect(prof.mostraSe!({ condizioneLavorativa: ['dipendente-privato'] })).toBe(true);
  expect(prof.mostraSe!({ condizioneLavorativa: ['autonomo-ordinario'] })).toBe(true);
  expect(prof.mostraSe!({ condizioneLavorativa: ['imprenditore'] })).toBe(true);
  expect(prof.mostraSe!({ condizioneLavorativa: ['altro'] })).toBe(true);
  // non lavora (solo pensionato/studente/disoccupato/casa) → non compare
  expect(prof.mostraSe!({ condizioneLavorativa: ['pensionato'] })).toBe(false);
  expect(prof.mostraSe!({ condizioneLavorativa: ['studente'] })).toBe(false);
  expect(prof.mostraSe!({ condizioneLavorativa: ['disoccupato'] })).toBe(false);
  expect(prof.mostraSe!({})).toBe(false);
  // studente CHE lavora → compare (una voce lavorativa basta)
  expect(prof.mostraSe!({ condizioneLavorativa: ['studente', 'dipendente-privato'] })).toBe(true);
});
