import { pianoCasa } from '../../src/data/laws/piano-casa';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

const idEffetti = (p: Profilo) => simula(p, pianoCasa).effetti.map((e) => e.id);

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(pianoCasa);
  if (!esito.success) throw new Error(esito.error.message);
});

test('è una legge in vigore, con mese/anno', () => {
  expect(pianoCasa.stato).toBe('vigore');
  expect(pianoCasa.meseAnno).toBeDefined();
});

test("l'inquilino di casa popolare (affitto, ISEE basso) ha scudo morosità e riscatto", () => {
  const p: Profilo = { schemaVersion: 1, eta: 45, abitazione: 'affitto', fasciaIsee: 'fino9360' };
  const eff = simula(p, pianoCasa).effetti.find((e) => e.id === 'pc-erp-inquilini');
  expect(eff).toBeDefined();
  expect(eff!.effetto.direzione).toBe('positivo');
});

test('il proprietario di casa non riceve la misura sugli inquilini ERP', () => {
  const p: Profilo = { schemaVersion: 1, eta: 45, abitazione: 'proprieta', fasciaIsee: 'fino9360' };
  expect(idEffetti(p)).not.toContain('pc-erp-inquilini');
});

test("chi ha ISEE alto in affitto non è trattato come inquilino ERP", () => {
  const p: Profilo = { schemaVersion: 1, eta: 45, abitazione: 'affitto', fasciaIsee: 'oltre40k' };
  expect(idEffetti(p)).not.toContain('pc-erp-inquilini');
});

test("lo studente in affitto ha il contributo affitto fuori sede", () => {
  const p: Profilo = { schemaVersion: 1, eta: 21, condizioneLavorativa: ['studente'], abitazione: 'affitto' };
  expect(idEffetti(p)).toContain('pc-studenti-fuorisede');
});

test('chi ha una disabilità grave ha la priorità sul Fondo prima casa', () => {
  const p: Profilo = { schemaVersion: 1, eta: 40, disabilita: ['motoria'] };
  const eff = simula(p, pianoCasa).effetti.find((e) => e.id === 'pc-disabilita-primacasa');
  expect(eff).toBeDefined();
  expect(eff!.effetto.direzione).toBe('positivo');
});

test('chi convive con un familiare disabile ha la stessa priorità sul Fondo prima casa', () => {
  const p: Profilo = { schemaVersion: 1, eta: 40, personeACarico: true, tipiACarico: ['familiare-disabile'] };
  expect(idEffetti(p)).toContain('pc-familiare-disabile-primacasa');
});

test('chi ha detto di NON avere persone a carico non vede la regola come "dato mancante"', () => {
  const p: Profilo = { schemaVersion: 1, eta: 40, personeACarico: false };
  const r = simula(p, pianoCasa);
  expect(r.effetti.map((e) => e.id)).not.toContain('pc-familiare-disabile-primacasa');
  // la regola sul familiare disabile NON deve finire tra i "non calcolabili"
  expect(r.nonCalcolabili.map((n) => n.regola.id)).not.toContain('pc-familiare-disabile-primacasa');
});

test("l'agricoltore (settore noto) non genera effetti «dato mancante» sul mestiere", () => {
  const p: Profilo = { schemaVersion: 1, eta: 55, settoriProfessionali: ['agricoltura'], abitazione: 'affitto', fasciaIsee: 'fino9360' };
  const nc = simula(p, pianoCasa).nonCalcolabili.map((n) => n.regola.id);
  expect(nc).not.toContain('pc-forze-ordine-alloggi');
});

test('il giovane (<=35) ha la casa sociale con riscatto', () => {
  const p: Profilo = { schemaVersion: 1, eta: 30 };
  expect(idEffetti(p)).toContain('pc-giovani-casa');
});

test('il genitore separato più grande ha la casa sociale con riscatto, il giovane no (già coperto)', () => {
  const separatoGrande: Profilo = { schemaVersion: 1, eta: 48, statoCivile: 'separato', figli: 2 };
  expect(idEffetti(separatoGrande)).toContain('pc-separati-casa');
  // un separato under-35 NON deve ricevere il doppione: è già coperto dalla regola "giovani"
  const separatoGiovane: Profilo = { schemaVersion: 1, eta: 30, statoCivile: 'separato', figli: 1 };
  expect(idEffetti(separatoGiovane)).not.toContain('pc-separati-casa');
  expect(idEffetti(separatoGiovane)).toContain('pc-giovani-casa');
});

test("il nucleo con ISEE medio ha l'edilizia integrata a prezzo calmierato", () => {
  const p: Profilo = { schemaVersion: 1, eta: 44, fasciaIsee: 'da25a40k' };
  expect(idEffetti(p)).toContain('pc-isee-medio-integrata');
});

test('chi lavora nelle forze dell\'ordine ha gli alloggi di servizio (dal mestiere in chiaro)', () => {
  const p: Profilo = { schemaVersion: 1, eta: 35, settoriProfessionali: ['forze-ordine'] };
  expect(idEffetti(p)).toContain('pc-forze-ordine-alloggi');
});

test('non inventa importi economici mensili (misure senza cifra certa)', () => {
  const p: Profilo = { schemaVersion: 1, eta: 30, abitazione: 'affitto', fasciaIsee: 'fino9360', disabilita: ['motoria'] };
  const r = simula(p, pianoCasa);
  expect(r.totaleMese.anno1).toEqual({ min: 0, max: 0 });
  expect(r.totaleMese.anno10).toEqual({ min: 0, max: 0 });
});

test('ogni effetto ha una frase breve entro i 120 caratteri', () => {
  for (const regola of pianoCasa.regole) {
    expect(regola.effetto.breve).toBeDefined();
    expect(regola.effetto.breve!.length).toBeLessThanOrEqual(120);
  }
});
