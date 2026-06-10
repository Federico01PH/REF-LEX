import { SchemaLegge } from '../../src/engine/schema';

const leggeValida = {
  id: 'x', titoloDivulgativo: 'X', titoloUfficiale: 'X', stato: 'vigore', ambito: 'casa',
  fonti: [{ etichetta: 'Normattiva', url: 'https://www.normattiva.it' }],
  verificataIl: '2026-06-10', riassunto: 'Breve riassunto di prova.',
  regole: [{
    id: 'r1', condizioni: [{ campo: 'eta', op: 'almeno', valore: 18 }],
    campiNecessari: ['eta'],
    effetto: { tipo: 'diritto', descrizione: 'd', direzione: 'positivo' },
    timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
    confidenza: 'certa', fonteRegola: { etichetta: 'art. 1', url: 'https://www.normattiva.it' }
  }]
};

test('accetta una legge valida', () => {
  expect(SchemaLegge.safeParse(leggeValida).success).toBe(true);
});

test('rifiuta legge senza fonti', () => {
  expect(SchemaLegge.safeParse({ ...leggeValida, fonti: [] }).success).toBe(false);
});

test('rifiuta regola economica senza importo coerente (min > max)', () => {
  const rotta = structuredClone(leggeValida);
  rotta.regole[0].effetto = { tipo: 'economico', importoMese: { min: 10, max: 5 }, descrizione: 'd', direzione: 'positivo' } as never;
  expect(SchemaLegge.safeParse(rotta).success).toBe(false);
});
