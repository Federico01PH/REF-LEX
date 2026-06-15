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
