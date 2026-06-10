import { PERSONAGGI } from '../../src/data/personas';

test('ci sono 8 personaggi con nome, descrizione e profilo completo dei campi chiave', () => {
  expect(PERSONAGGI).toHaveLength(8);
  for (const p of PERSONAGGI) {
    expect(p.nome.length).toBeGreaterThan(0);
    expect(p.descrizione.length).toBeGreaterThan(0);
    expect(p.profilo.eta).toBeGreaterThan(0);
    expect(p.profilo.condizioneLavorativa).toBeDefined();
    expect(p.profilo.fasciaReddito).toBeDefined();
    expect(p.profilo.fasciaIsee).toBeDefined();
  }
});
