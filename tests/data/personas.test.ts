import { PERSONAGGI } from '../../src/data/personas';

test('ci sono 19 personaggi con nome, descrizione e profilo completo dei campi chiave', () => {
  expect(PERSONAGGI).toHaveLength(19);
  for (const p of PERSONAGGI) {
    expect(p.nome.length).toBeGreaterThan(0);
    expect(p.descrizione.length).toBeGreaterThan(0);
    expect(p.profilo.eta).toBeGreaterThan(0);
    expect(p.profilo.condizioneLavorativa).toBeDefined();
    expect(p.profilo.fasciaReddito).toBeDefined();
    expect(p.profilo.fasciaIsee).toBeDefined();
  }
});

// i protagonisti della riforma caccia: un profilo agricolo e uno di cacciatore, così
// la galleria "E per gli altri?" mostra chi ci guadagna e chi ci perde
test('copre i settori professionali della caccia: un agricoltore e un cacciatore', () => {
  const agricoltore = PERSONAGGI.some((p) => (p.profilo.settoriProfessionali ?? []).includes('agricoltura'));
  const cacciatore = PERSONAGGI.some((p) => (p.profilo.settoriProfessionali ?? []).includes('caccia'));
  expect(agricoltore).toBe(true);
  expect(cacciatore).toBe(true);
});

// la riforma costituzionale su Roma Capitale e' la prima legge che guarda la regione:
// senza regione i profili non direbbero niente su di lei
test('ogni personaggio ha una regione, e almeno uno vive nel Lazio', () => {
  for (const p of PERSONAGGI) expect(p.profilo.regione).toBeDefined();
  expect(PERSONAGGI.some((p) => p.profilo.regione === 'Lazio')).toBe(true);
  expect(PERSONAGGI.some((p) => p.profilo.regione !== 'Lazio')).toBe(true);
});

// le leggi che parlano ai minorenni (imputabilita' del minore) e quelle che danno compiti
// alla sanita' (legge 140/2026) hanno bisogno di qualcuno a cui riferirsi nella galleria
test('copre un minorenne, un genitore di minorenni e chi lavora nella sanita', () => {
  const minorenne = PERSONAGGI.some((p) => p.profilo.eta < 18);
  const genitore = PERSONAGGI.some((p) => (p.profilo.tipiACarico ?? []).includes('figli-minorenni'));
  const sanita = PERSONAGGI.some((p) => (p.profilo.settoriProfessionali ?? []).includes('sanita'));
  expect(minorenne).toBe(true);
  expect(genitore).toBe(true);
  expect(sanita).toBe(true);
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
