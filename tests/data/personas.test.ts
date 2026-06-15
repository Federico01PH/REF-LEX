import { PERSONAGGI } from '../../src/data/personas';

test('ci sono 14 personaggi con nome, descrizione e profilo completo dei campi chiave', () => {
  expect(PERSONAGGI).toHaveLength(14);
  for (const p of PERSONAGGI) {
    expect(p.nome.length).toBeGreaterThan(0);
    expect(p.descrizione.length).toBeGreaterThan(0);
    expect(p.profilo.eta).toBeGreaterThan(0);
    expect(p.profilo.condizioneLavorativa).toBeDefined();
    expect(p.profilo.fasciaReddito).toBeDefined();
    expect(p.profilo.fasciaIsee).toBeDefined();
  }
});

test('gli id dei personaggi sono unici', () => {
  const id = PERSONAGGI.map((p) => p.id);
  expect(new Set(id).size).toBe(id.length);
});

// la galleria deve coprire sia minoranze sia profili "di maggioranza", così chi
// non ha voglia di costruirsi un profilo si riconosce comunque in qualcuno
test('copre le minoranze citate: senza permesso, transgender, omosessuale, malattia rara/non riconosciuta', () => {
  const senzaPermesso = PERSONAGGI.some((p) => p.profilo.cittadinanza === 'extra-ue' && p.profilo.permessoSoggiorno === 'no');
  const conPermesso = PERSONAGGI.some((p) => p.profilo.cittadinanza === 'extra-ue' && p.profilo.permessoSoggiorno === 'si');
  const trans = PERSONAGGI.some((p) => p.profilo.identitaGenere === 'transgender');
  const omosessuale = PERSONAGGI.some((p) => p.profilo.orientamento === 'omosessuale');
  const malattiaRara = PERSONAGGI.some((p) => (p.profilo.disabilita ?? []).includes('malattia-cronica'));
  const nonRiconosciuta = PERSONAGGI.some((p) => (p.profilo.disabilita ?? []).includes('condizione-non-riconosciuta'));
  expect(senzaPermesso).toBe(true);
  expect(conPermesso).toBe(true);
  expect(trans).toBe(true);
  expect(omosessuale).toBe(true);
  expect(malattiaRara).toBe(true);
  expect(nonRiconosciuta).toBe(true);
});

test('copre i profili di maggioranza: dipendente pubblico, partita IVA, pensionato, studente, ricco', () => {
  const occ = (p: typeof PERSONAGGI[number]) => p.profilo.condizioneLavorativa ?? [];
  const pubblico = PERSONAGGI.some((p) => occ(p).includes('dipendente-pubblico'));
  const partitaIva = PERSONAGGI.some((p) => occ(p).includes('autonomo-ordinario') || occ(p).includes('forfettario'));
  const pensionato = PERSONAGGI.some((p) => occ(p).includes('pensionato'));
  const studente = PERSONAGGI.some((p) => occ(p).includes('studente') || occ(p).includes('dipendente-privato'));
  const ricco = PERSONAGGI.some((p) => p.profilo.fasciaReddito === 'oltre50k');
  expect(pubblico).toBe(true);
  expect(partitaIva).toBe(true);
  expect(pensionato).toBe(true);
  expect(studente).toBe(true);
  expect(ricco).toBe(true);
});
