import { decretoSicurezza } from '../../src/data/laws/decreto-sicurezza';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(decretoSicurezza);
  if (!esito.success) throw new Error(esito.error.message);
});

// Verified: L. 80/2025 in vigore dal 10/6/2025 → tutto certo e attivo
test('proprietario over 65: tutela casa e tutela truffe, tutte certe', () => {
  const p: Profilo = { schemaVersion: 1, eta: 70, abitazione: 'proprieta' };
  const r = simula(p, decretoSicurezza);
  const id = r.effetti.map((e) => e.id);
  expect(id).toContain('sicurezza-occupazione-casa');
  expect(id).toContain('sicurezza-truffe-anziani');
  expect(r.effetti.every((e) => e.confidenza === 'certa')).toBe(true);
});

test('giovane in affitto: niente tutela proprietari né anziani, restano sorveglianza e proteste', () => {
  const p: Profilo = { schemaVersion: 1, eta: 22, abitazione: 'affitto' };
  const r = simula(p, decretoSicurezza);
  const id = r.effetti.map((e) => e.id);
  expect(id).not.toContain('sicurezza-occupazione-casa');
  expect(id).not.toContain('sicurezza-truffe-anziani');
  expect(id).toContain('sicurezza-videosorveglianza');
  expect(id).toContain('sicurezza-proteste');
});

// Verified: art. 32 L. 80/2025 — serve un documento valido, NON il permesso di soggiorno
// (il permesso era solo nella proposta iniziale del ddl). Verificato il 12/06/2026.
test('cittadino extra-UE: regola indiretta sulla SIM, certa; non vale per italiani o UE', () => {
  const extraUe: Profilo = { schemaVersion: 1, eta: 28, cittadinanza: 'extra-ue' };
  const r = simula(extraUe, decretoSicurezza);
  const sim = r.effetti.find((e) => e.id === 'sicurezza-sim-documento');
  expect(sim).toBeDefined();
  expect(sim!.confidenza).toBe('certa');
  expect(sim!.effetto.indiretto).toBe(true);
  expect(sim!.effetto.descrizione).toMatch(/permesso di soggiorno NON è richiesto/);

  const italiano: Profilo = { schemaVersion: 1, eta: 28, cittadinanza: 'italiana' };
  expect(simula(italiano, decretoSicurezza).effetti.map((e) => e.id)).not.toContain('sicurezza-sim-documento');
});

test('le regole su sorveglianza e proteste sono dichiarate "misto", non vendute come solo positive', () => {
  const sorveglianza = decretoSicurezza.regole.find((r) => r.id === 'sicurezza-videosorveglianza')!;
  const proteste = decretoSicurezza.regole.find((r) => r.id === 'sicurezza-proteste')!;
  expect(sorveglianza.effetto.direzione).toBe('misto');
  expect(proteste.effetto.direzione).toBe('misto');
});

test('effetto indiretto sulla libertà di manifestazione, ancorato all\'art. 17 Cost.', () => {
  const p: Profilo = { schemaVersion: 1, eta: 30 };
  const r = simula(p, decretoSicurezza);
  const lib = r.effetti.find((e) => e.id === 'sicurezza-liberta-manifestazione');
  expect(lib).toBeDefined();
  expect(lib!.effetto.indiretto).toBe(true);
  expect(lib!.effetto.direzione).toBe('negativo');
  expect(lib!.effetto.dirittoToccato?.articolo).toBe('art. 17');
  expect(lib!.effetto.dirittoToccato?.intensita).toBe('sensibile');
});
