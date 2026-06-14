import { SchemaLegge } from '../../src/engine/schema';

const leggeValida = {
  id: 'x', titoloDivulgativo: 'X', titoloUfficiale: 'X', stato: 'vigore', ambiti: ['casa'],
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

test('rifiuta fonti con url a schema pericoloso (solo http/https)', () => {
  const rotta = { ...leggeValida, fonti: [{ etichetta: 'x', url: 'javascript:alert(1)' }] };
  expect(SchemaLegge.safeParse(rotta).success).toBe(false);
});

test('rifiuta regola economica senza importo coerente (min > max)', () => {
  const rotta = structuredClone(leggeValida);
  rotta.regole[0].effetto = { tipo: 'economico', importoMese: { min: 10, max: 5 }, descrizione: 'd', direzione: 'positivo' } as never;
  expect(SchemaLegge.safeParse(rotta).success).toBe(false);
});

test('rifiuta condizione con campo sconosciuto', () => {
  const rotta = structuredClone(leggeValida);
  rotta.regole[0].condizioni = [{ campo: 'condizioneLavoratva', op: 'eq', valore: 'studente' }] as never;
  expect(SchemaLegge.safeParse(rotta).success).toBe(false);
});

test("rifiuta op 'in' con valore non-array", () => {
  const rotta = structuredClone(leggeValida);
  rotta.regole[0].condizioni = [{ campo: 'condizioneLavorativa', op: 'in', valore: 'studente' }] as never;
  expect(SchemaLegge.safeParse(rotta).success).toBe(false);
});

test("rifiuta 'almeno' su campo non ordinale", () => {
  const rotta = structuredClone(leggeValida);
  rotta.regole[0].condizioni = [{ campo: 'abitazione', op: 'almeno', valore: 'affitto' }] as never;
  expect(SchemaLegge.safeParse(rotta).success).toBe(false);
});

test("rifiuta 'eq' sul campo lista disabilita", () => {
  const rotta = structuredClone(leggeValida);
  rotta.regole[0].condizioni = [{ campo: 'disabilita', op: 'eq', valore: 'motoria' }] as never;
  expect(SchemaLegge.safeParse(rotta).success).toBe(false);
});

test('rifiuta importoMese su effetto non economico', () => {
  const rotta = structuredClone(leggeValida);
  rotta.regole[0].effetto = { tipo: 'diritto', importoMese: { min: 1, max: 2 }, descrizione: 'd', direzione: 'positivo' } as never;
  expect(SchemaLegge.safeParse(rotta).success).toBe(false);
});

test('rifiuta importoMese con direzione mista o neutra', () => {
  const rotta = structuredClone(leggeValida);
  rotta.regole[0].effetto = { tipo: 'economico', importoMese: { min: 1, max: 2 }, descrizione: 'd', direzione: 'misto' } as never;
  expect(SchemaLegge.safeParse(rotta).success).toBe(false);
});

test('accetta condizioni sui nuovi campi (titoloStudio ordinale, permessoSoggiorno, effetto indiretto)', () => {
  const ok = structuredClone(leggeValida);
  ok.regole[0].condizioni = [
    { campo: 'titoloStudio', op: 'almeno', valore: 'diploma' },
    { campo: 'numeroProprieta', op: 'almeno', valore: 2 },
    { campo: 'permessoSoggiorno', op: 'eq', valore: 'no' }
  ] as never;
  ok.regole[0].effetto = { tipo: 'dovere', descrizione: 'd', direzione: 'misto', indiretto: true } as never;
  expect(SchemaLegge.safeParse(ok).success).toBe(true);
});

test('accetta effetto economico senza importo (qualitativo, es. confidenza dipende)', () => {
  const ok = structuredClone(leggeValida);
  ok.regole[0].effetto = { tipo: 'economico', descrizione: 'd', direzione: 'positivo' } as never;
  expect(SchemaLegge.safeParse(ok).success).toBe(true);
});

test('accetta effetto indiretto con dirittoToccato ancorato a una carta', () => {
  const ok = structuredClone(leggeValida);
  ok.regole[0].effetto = {
    tipo: 'diritto', descrizione: 'd', direzione: 'negativo', indiretto: true,
    dirittoToccato: { carta: 'Costituzione italiana', articolo: 'art. 17', diritto: 'libertà di riunione', intensita: 'sensibile', url: 'https://www.normattiva.it' }
  } as never;
  expect(SchemaLegge.safeParse(ok).success).toBe(true);
});

test('rifiuta dirittoToccato su effetto non indiretto (deve stare tra gli effetti indiretti)', () => {
  const rotta = structuredClone(leggeValida);
  rotta.regole[0].effetto = {
    tipo: 'diritto', descrizione: 'd', direzione: 'negativo',
    dirittoToccato: { carta: 'CEDU', articolo: 'art. 8', diritto: 'vita privata', intensita: 'lieve' }
  } as never;
  expect(SchemaLegge.safeParse(rotta).success).toBe(false);
});

test('rifiuta dirittoToccato con intensita fuori scala', () => {
  const rotta = structuredClone(leggeValida);
  rotta.regole[0].effetto = {
    tipo: 'diritto', descrizione: 'd', direzione: 'negativo', indiretto: true,
    dirittoToccato: { carta: 'CEDU', articolo: 'art. 8', diritto: 'vita privata', intensita: 'enorme' }
  } as never;
  expect(SchemaLegge.safeParse(rotta).success).toBe(false);
});
