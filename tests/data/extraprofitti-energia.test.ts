import { CATALOGO } from '../../src/data/laws';
import { extraprofittiEnergia } from '../../src/data/laws/extraprofitti-energia';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

const ids = (p: Profilo) => simula(p, extraprofittiEnergia).effetti.map((e) => e.id);
const effetto = (p: Profilo, id: string) => simula(p, extraprofittiEnergia).effetti.find((e) => e.id === id);

test('rispetta lo schema ed è nel catalogo', () => {
  const esito = SchemaLegge.safeParse(extraprofittiEnergia);
  if (!esito.success) throw new Error(esito.error.message);
  expect(CATALOGO.some((l) => l.id === extraprofittiEnergia.id)).toBe(true);
});

// Legge 25 settembre 2026, n. 166 (GU n. 223 del 25/9/2026): converte il DL 133/2026 e
// assorbe i DL 139 e 153, dove era nato l'anticipo chiesto ai grandi gruppi energetici.
test('è legge in vigore: legge 166/2026, art. 2-bis del DL 133/2026', () => {
  expect(extraprofittiEnergia.stato).toBe('vigore');
  expect(extraprofittiEnergia.meseAnno).toBe('settembre 2026');
  expect(extraprofittiEnergia.titoloUfficiale).toContain('n. 166');
  expect(extraprofittiEnergia.titoloUfficiale).toContain('2-bis');
  // si trova cercando la parola che usano tutti, anche se nel testo non c'è
  expect(extraprofittiEnergia.titoloDivulgativo.toLowerCase()).toContain('extraprofitti');
});

// Il punto onesto: non è una tassa sugli extraprofitti. È un anticipo del 39% delle ritenute
// sui dividendi che le società recuperano per intero come credito d'imposta (commi 4, 7, 9, 14).
test('per chiunque: non è una tassa nuova e non la paghi tu (effetto neutro, sicuro)', () => {
  const r = effetto({ schemaVersion: 1, eta: 30 }, 'extraprofitti-chi-paga');
  expect(r).toBeDefined();
  expect(r!.effetto.direzione).toBe('neutro');
  expect(r!.confidenza).toBe('certa');
  expect(r!.effetto.importoMese).toBeUndefined();
  expect(r!.effetto.descrizione).toContain('39%');
  expect(r!.effetto.descrizione).toContain('20 miliardi');
  expect(r!.effetto.breve).toMatch(/non è una tassa/i);
});

// L'anticipo copre 130,3 milioni del 2026 (art. 3, c. 2, lett. f): va detto a cosa è servito
test('il riassunto dice quanto porta l\'anticipo e a cosa è servito', () => {
  expect(extraprofittiEnergia.riassunto).toContain('130,3 milioni');
  expect(extraprofittiEnergia.riassunto).toContain('gasolio');
});

// Credito d'imposta all'autotrasporto, mesi da marzo ad agosto 2026 (art. 1, c. 4): va
// all'IMPRESA, non al camionista dipendente
test('l\'impresa di autotrasporto vede il credito sul gasolio; il dipendente no', () => {
  const impresa: Profilo = { schemaVersion: 1, eta: 51, condizioneLavorativa: ['autonomo-ordinario'], settoriProfessionali: ['trasporti'] };
  const r = effetto(impresa, 'extraprofitti-autotrasporto');
  expect(r?.effetto.direzione).toBe('positivo');
  expect(r?.confidenza).toBe('dipende');
  expect(r?.timeline.anno1).toBe('attivo');
  expect(r?.timeline.anno2).toBe('nullo');

  const dipendente: Profilo = { schemaVersion: 1, eta: 40, condizioneLavorativa: ['dipendente-privato'], settoriProfessionali: ['trasporti'] };
  expect(ids(dipendente)).not.toContain('extraprofitti-autotrasporto');
  const altroMestiere: Profilo = { schemaVersion: 1, eta: 40, condizioneLavorativa: ['imprenditore'], settoriProfessionali: ['altro'] };
  expect(ids(altroMestiere)).not.toContain('extraprofitti-autotrasporto');
});

// Nessuna cifra in euro per la persona: l'anticipo non tocca le tasche delle famiglie
test('non produce importi in euro', () => {
  const p: Profilo = { schemaVersion: 1, eta: 51, condizioneLavorativa: ['imprenditore'], settoriProfessionali: ['trasporti'] };
  const r = simula(p, extraprofittiEnergia);
  expect(r.totaleMese.anno1).toEqual({ min: 0, max: 0 });
  expect(r.totaleMese.anno10).toEqual({ min: 0, max: 0 });
});
