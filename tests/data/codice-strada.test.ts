import { codiceStrada } from '../../src/data/laws/codice-strada';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(codiceStrada);
  if (!esito.success) throw new Error(esito.error.message);
});

// Verified: L. 177/2024 in vigore dal 14/12/2024 → regole generali certe e attive
test('45enne: regole su cellulare e alcol certe, niente regola neopatentati', () => {
  const p: Profilo = { schemaVersion: 1, eta: 45 };
  const r = simula(p, codiceStrada);
  const id = r.effetti.map((e) => e.id);
  expect(id).toContain('strada-cellulare-alcol');
  expect(id).not.toContain('strada-neopatentati');
});

test('20enne: anche la regola neopatentati, ma con confidenza dipende (patente non chiesta)', () => {
  const p: Profilo = { schemaVersion: 1, eta: 20 };
  const r = simula(p, codiceStrada);
  const neo = r.effetti.find((e) => e.id === 'strada-neopatentati');
  expect(neo).toBeDefined();
  expect(neo!.confidenza).toBe('dipende');
});

test('14enne: solo la regola monopattini (non può guidare auto)', () => {
  const p: Profilo = { schemaVersion: 1, eta: 14 };
  const r = simula(p, codiceStrada);
  expect(r.effetti.map((e) => e.id)).toEqual(['strada-monopattini']);
});

test('i doveri diretti sono dichiarati misti: niente finta positività', () => {
  const diretti = codiceStrada.regole.filter((r) => !r.effetto.indiretto);
  expect(diretti.every((r) => r.effetto.direzione === 'misto')).toBe(true);
});

test('include un effetto indiretto sulla libertà personale (positività droghe)', () => {
  const ind = codiceStrada.regole.find((r) => r.id === 'strada-positivita-liberta-personale');
  expect(ind?.effetto.indiretto).toBe(true);
  expect(ind?.effetto.direzione).toBe('negativo');
  expect(ind?.effetto.dirittoToccato?.intensita).toBe('sensibile');
});
