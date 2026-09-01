import { aiAct } from '../../src/data/laws/ai-act';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(aiAct);
  if (!esito.success) throw new Error(esito.error.message);
});

// Verified: divieti operativi dal 2/2/2025 → certi e attivi per chiunque
test('chiunque: divieti e trasparenza certi e attivi da subito', () => {
  const p: Profilo = { schemaVersion: 1, eta: 70, condizioneLavorativa: ['pensionato'] };
  const r = simula(p, aiAct);
  const id = r.effetti.map((e) => e.id);
  expect(id).toContain('ai-act-divieti');
  expect(id).toContain('ai-act-trasparenza');
  expect(r.effetti.find((e) => e.id === 'ai-act-divieti')!.confidenza).toBe('certa');
});

// Verified 2026-09-01: il rinvio non è più un'ipotesi. Il Regolamento (UE) 2026/1744
// (Omnibus digitale sull'IA, in vigore dal 27/7/2026) ha sostituito l'art. 113, terzo comma,
// lett. c) dell'AI Act: 2 dicembre 2027 per l'allegato III, 2 agosto 2028 per l'allegato I.
// Le tutele restano scritte e arriveranno, quindi la confidenza sale da 'probabile' a 'certa'.
test('studente: tutele alto rischio (scuola/lavoro) ora certe, ma rinviate al 2027', () => {
  const p: Profilo = { schemaVersion: 1, eta: 16, condizioneLavorativa: ['studente'] };
  const r = simula(p, aiAct);
  const altoRischio = r.effetti.find((e) => e.id === 'ai-act-alto-rischio-lavoro');
  expect(altoRischio).toBeDefined();
  expect(altoRischio!.confidenza).toBe('certa');
});

test('la scheda non promette più il 2 agosto 2026: dice le date nuove dell\'Omnibus', () => {
  const altoRischio = aiAct.regole.find((r) => r.id === 'ai-act-alto-rischio-lavoro')!;
  expect(altoRischio.effetto.descrizione).toContain('2 dicembre 2027');
  expect(altoRischio.effetto.descrizione).toContain('2 agosto 2028');
  expect(altoRischio.effetto.breve).not.toContain('2 agosto 2026');
  expect(aiAct.riassunto).toContain('2 dicembre 2027');
});

test('il Regolamento (UE) 2026/1744 è citato tra le fonti della scheda AI Act', () => {
  expect(aiAct.fonti.some((f) => f.etichetta.includes('2026/1744'))).toBe(true);
});

test('autonomo: niente regola alto rischio lavoro, restano i diritti generali', () => {
  const p: Profilo = { schemaVersion: 1, eta: 45, condizioneLavorativa: ['autonomo-ordinario'] };
  const r = simula(p, aiAct);
  expect(r.effetti.map((e) => e.id)).not.toContain('ai-act-alto-rischio-lavoro');
  expect(r.effetti.map((e) => e.id)).toContain('ai-act-divieti');
});
