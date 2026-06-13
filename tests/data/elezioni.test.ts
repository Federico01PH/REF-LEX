import { leggeElettorale } from '../../src/data/laws/legge-elettorale-2026';
import { premierato } from '../../src/data/laws/premierato-2026';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

test('legge elettorale e premierato rispettano lo schema', () => {
  for (const legge of [leggeElettorale, premierato]) {
    const esito = SchemaLegge.safeParse(legge);
    if (!esito.success) throw new Error(`${legge.id}: ${esito.error.message}`);
  }
});

test('sono proposte: stato discussione e tutto a orizzonte incerto', () => {
  for (const legge of [leggeElettorale, premierato]) {
    expect(legge.stato).toBe('discussione');
    expect(legge.regole.every((r) => r.confidenza === 'dipende')).toBe(true);
    expect(legge.regole.every((r) => Object.values(r.timeline).every((v) => v === 'incerto'))).toBe(true);
  }
});

test('maggiorenne: vede entrambe le regole su voto e premio; il minorenne no', () => {
  const adulto: Profilo = { schemaVersion: 1, eta: 40 };
  const minore: Profilo = { schemaVersion: 1, eta: 16 };
  expect(simula(adulto, leggeElettorale).effetti.map((e) => e.id)).toEqual(
    ['elettorale-come-voti', 'elettorale-premio-governabilita']
  );
  expect(simula(minore, leggeElettorale).effetti).toHaveLength(0);
});

test('legge elettorale: effetto indiretto sul premio ancorato all\'art. 48 (eguaglianza del voto), sensibile', () => {
  const p: Profilo = { schemaVersion: 1, eta: 30 };
  const premio = simula(p, leggeElettorale).effetti.find((e) => e.id === 'elettorale-premio-governabilita');
  expect(premio?.effetto.indiretto).toBe(true);
  expect(premio?.effetto.dirittoToccato?.articolo).toBe('art. 48');
  expect(premio?.effetto.dirittoToccato?.intensita).toBe('sensibile');
});

test('premierato: elezione diretta + effetto indiretto su equilibrio dei poteri (art. 1)', () => {
  const p: Profilo = { schemaVersion: 1, eta: 50 };
  const eff = simula(p, premierato).effetti;
  expect(eff.map((e) => e.id)).toContain('premierato-elezione-diretta');
  const poteri = eff.find((e) => e.id === 'premierato-equilibrio-poteri');
  expect(poteri?.effetto.indiretto).toBe(true);
  expect(poteri?.effetto.dirittoToccato?.articolo).toBe('art. 1');
});
