import { caccia } from '../../src/data/laws/caccia';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

const idEffetti = (p: Profilo) => simula(p, caccia).effetti.map((e) => e.id);

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(caccia);
  if (!esito.success) throw new Error(esito.error.message);
});

test('è modellata come proposta in discussione, non come legge in vigore', () => {
  expect(caccia.stato).toBe('discussione');
  expect(caccia.meseAnno).toBeUndefined();
  expect(caccia.regole.every((r) => r.confidenza !== 'certa')).toBe(true);
});

test("chiunque ha l'effetto indiretto su ambiente e animali, ancorato all'art. 9 Cost.", () => {
  const p: Profilo = { schemaVersion: 1, eta: 40 };
  const eff = simula(p, caccia).effetti.find((e) => e.id === 'caccia-ambiente-animali');
  expect(eff).toBeDefined();
  expect(eff!.effetto.indiretto).toBe(true);
  expect(eff!.effetto.direzione).toBe('misto');
  expect(eff!.effetto.dirittoToccato?.articolo).toBe('art. 9');
  expect(eff!.effetto.dirittoToccato?.intensita).toBe('sensibile');
});

test("chiunque ha l'effetto indiretto sulla sicurezza di chi va per boschi e sentieri", () => {
  const p: Profilo = { schemaVersion: 1, eta: 40 };
  const eff = simula(p, caccia).effetti.find((e) => e.id === 'caccia-sicurezza');
  expect(eff).toBeDefined();
  expect(eff!.effetto.tipo).toBe('qualita-vita');
  expect(eff!.effetto.indiretto).toBe(true);
});

test("l'agricoltore (dal mestiere in chiaro) ha l'effetto misto su danni fauna e controllo", () => {
  const p: Profilo = { schemaVersion: 1, eta: 55, settoriProfessionali: ['agricoltura'] };
  const eff = simula(p, caccia).effetti.find((e) => e.id === 'caccia-agricoltori');
  expect(eff).toBeDefined();
  expect(eff!.effetto.direzione).toBe('misto');
});

test('il cacciatore (dal mestiere in chiaro) vede più opportunità di caccia (positivo)', () => {
  const p: Profilo = { schemaVersion: 1, eta: 50, settoriProfessionali: ['caccia'] };
  const eff = simula(p, caccia).effetti.find((e) => e.id === 'caccia-cacciatori');
  expect(eff).toBeDefined();
  expect(eff!.effetto.direzione).toBe('positivo');
});

test('chi ha un mestiere di altro settore non riceve gli effetti di agricoltori/cacciatori', () => {
  const p: Profilo = { schemaVersion: 1, eta: 40, settoriProfessionali: ['altro'] };
  const ids = idEffetti(p);
  expect(ids).not.toContain('caccia-agricoltori');
  expect(ids).not.toContain('caccia-cacciatori');
  // ma gli effetti collettivi restano
  expect(ids).toContain('caccia-ambiente-animali');
  expect(ids).toContain('caccia-sicurezza');
});

test('non produce importi economici mensili', () => {
  const p: Profilo = { schemaVersion: 1, eta: 55, settoriProfessionali: ['agricoltura'] };
  const r = simula(p, caccia);
  expect(r.totaleMese.anno1).toEqual({ min: 0, max: 0 });
  expect(r.totaleMese.anno10).toEqual({ min: 0, max: 0 });
});

test('ogni effetto ha una frase breve entro i 120 caratteri', () => {
  for (const regola of caccia.regole) {
    expect(regola.effetto.breve).toBeDefined();
    expect(regola.effetto.breve!.length).toBeLessThanOrEqual(120);
  }
});
