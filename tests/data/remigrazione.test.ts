import { remigrazione } from '../../src/data/laws/remigrazione';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(remigrazione);
  if (!esito.success) throw new Error(esito.error.message);
});

// Verified: legge di iniziativa popolare che ha superato le 50.000 firme (portale del
// Ministero della Giustizia), NON un referendum e NON ancora legge → stato discussione,
// tutto incerto e dipende.
test('è dichiarata in discussione, non in vigore né come referendum', () => {
  expect(remigrazione.stato).toBe('discussione');
});

test('cittadino extra-UE regolare: riceve le regole che lo riguardano, tutte incerte e "dipende"', () => {
  const p: Profilo = { schemaVersion: 1, eta: 35, cittadinanza: 'extra-ue', permessoSoggiorno: 'si' };
  const r = simula(p, remigrazione);
  const id = r.effetti.map((e) => e.id);
  expect(id).toContain('remigrazione-ingresso-flussi');
  expect(id).toContain('remigrazione-programma-rientro');
  expect(id).toContain('remigrazione-tassa-rimesse');
  expect(id).toContain('remigrazione-asilo-famiglia');
  expect(id).toContain('remigrazione-revoca-cittadinanza');
  expect(id).toContain('remigrazione-uguaglianza');
  expect(r.effetti.every((e) => e.confidenza === 'dipende')).toBe(true);
  expect(r.effetti.every((e) => e.timeline.anno1 === 'incerto' && e.timeline.anno10 === 'incerto')).toBe(true);
});

// il punto chiave: chi è senza permesso (Omar) e chi è regolare da anni (Karim) NON devono
// ricevere gli stessi effetti. Il rientro volontario incentivato è riservato ai regolari;
// chi è irregolare è nella posizione più esposta (rimpatrio, niente vie di regolarizzazione).
test('extra-UE regolare e senza permesso hanno effetti diversi', () => {
  const regolare: Profilo = { schemaVersion: 1, eta: 45, cittadinanza: 'extra-ue', permessoSoggiorno: 'si' };
  const senzaPermesso: Profilo = { schemaVersion: 1, eta: 28, cittadinanza: 'extra-ue', permessoSoggiorno: 'no' };
  const idReg = simula(regolare, remigrazione).effetti.map((e) => e.id);
  const idIrr = simula(senzaPermesso, remigrazione).effetti.map((e) => e.id);
  // il programma di rientro volontario con incentivo è solo per chi è regolare
  expect(idReg).toContain('remigrazione-programma-rientro');
  expect(idIrr).not.toContain('remigrazione-programma-rientro');
  // chi è senza permesso ha invece la regola sulla posizione irregolare
  expect(idIrr).toContain('remigrazione-irregolari');
  expect(idReg).not.toContain('remigrazione-irregolari');
  // i due insiemi di effetti non coincidono
  expect(idReg.sort()).not.toEqual(idIrr.sort());
});

test('cittadino italiano con figli: riceve il fondo natalità, non le regole sugli stranieri', () => {
  const p: Profilo = { schemaVersion: 1, eta: 33, cittadinanza: 'italiana', figli: 2 };
  const r = simula(p, remigrazione);
  const id = r.effetti.map((e) => e.id);
  expect(id).toContain('remigrazione-fondo-natalita');
  expect(id).not.toContain('remigrazione-tassa-rimesse');
  expect(id).not.toContain('remigrazione-asilo-famiglia');
});

test('imprenditore: riceve la regola su sanzioni e incentivi alle imprese', () => {
  const p: Profilo = { schemaVersion: 1, eta: 50, condizioneLavorativa: ['imprenditore'] };
  const r = simula(p, remigrazione);
  expect(r.effetti.map((e) => e.id)).toContain('remigrazione-imprese');
});

test('gli effetti indiretti sui diritti sono ancorati a carte e articoli reali', () => {
  const p: Profilo = { schemaVersion: 1, eta: 35, cittadinanza: 'extra-ue' };
  const r = simula(p, remigrazione);
  const conDiritto = r.effetti.filter((e) => e.effetto.dirittoToccato);
  // ogni effetto con un diritto toccato deve essere marcato come indiretto e ancorato
  expect(conDiritto.length).toBeGreaterThanOrEqual(3);
  for (const e of conDiritto) {
    expect(e.effetto.indiretto).toBe(true);
    expect(e.effetto.dirittoToccato!.carta.length).toBeGreaterThan(0);
    expect(e.effetto.dirittoToccato!.articolo.length).toBeGreaterThan(0);
  }
  const articoli = conDiritto.map((e) => e.effetto.dirittoToccato!.articolo);
  expect(articoli).toContain('art. 3'); // uguaglianza
  expect(articoli).toContain('art. 10'); // diritto d'asilo
  expect(articoli).toContain('art. 22'); // privazione della cittadinanza
});

test('le regole con un giudizio di valore sono dichiarate "misto", non vendute come solo positive', () => {
  const programma = remigrazione.regole.find((r) => r.id === 'remigrazione-programma-rientro')!;
  const imprese = remigrazione.regole.find((r) => r.id === 'remigrazione-imprese')!;
  expect(programma.effetto.direzione).toBe('misto');
  expect(imprese.effetto.direzione).toBe('misto');
});
