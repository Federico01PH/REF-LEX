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

// Verified: obblighi alto rischio dal 2/8/2026 ma possibile rinvio (digital omnibus) → probabile
test('studente: tutele alto rischio (scuola/lavoro) probabili, non certe', () => {
  const p: Profilo = { schemaVersion: 1, eta: 16, condizioneLavorativa: ['studente'] };
  const r = simula(p, aiAct);
  const altoRischio = r.effetti.find((e) => e.id === 'ai-act-alto-rischio-lavoro');
  expect(altoRischio).toBeDefined();
  expect(altoRischio!.confidenza).toBe('probabile');
});

test('autonomo: niente regola alto rischio lavoro, restano i diritti generali', () => {
  const p: Profilo = { schemaVersion: 1, eta: 45, condizioneLavorativa: ['autonomo-ordinario'] };
  const r = simula(p, aiAct);
  expect(r.effetti.map((e) => e.id)).not.toContain('ai-act-alto-rischio-lavoro');
  expect(r.effetti.map((e) => e.id)).toContain('ai-act-divieti');
});
