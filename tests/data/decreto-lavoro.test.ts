import { decretoLavoro } from '../../src/data/laws/decreto-lavoro-2026';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(decretoLavoro);
  if (!esito.success) throw new Error(esito.error.message);
});

test('giovane disoccupato under 35: bonus assunzione giovani', () => {
  const p: Profilo = { schemaVersion: 1, eta: 28, condizioneLavorativa: ['disoccupato'] };
  const id = simula(p, decretoLavoro).effetti.map((e) => e.id);
  expect(id).toContain('lavoro-bonus-giovani');
  expect(id).not.toContain('lavoro-bonus-donne'); // genere non indicato
});

test('over 35 occupato: niente bonus giovani', () => {
  const p: Profilo = { schemaVersion: 1, eta: 50, condizioneLavorativa: ['dipendente-privato'] };
  expect(simula(p, decretoLavoro).effetti.map((e) => e.id)).not.toContain('lavoro-bonus-giovani');
});

test('donna disoccupata: bonus donne', () => {
  const p: Profilo = { schemaVersion: 1, eta: 40, genere: 'donna', condizioneLavorativa: ['disoccupato'] };
  expect(simula(p, decretoLavoro).effetti.map((e) => e.id)).toContain('lavoro-bonus-donne');
});

test('dipendente privato: salario giusto, strutturale (attivo a 10 anni)', () => {
  const p: Profilo = { schemaVersion: 1, eta: 45, condizioneLavorativa: ['dipendente-privato'] };
  const sg = simula(p, decretoLavoro).effetti.find((e) => e.id === 'lavoro-salario-giusto');
  expect(sg).toBeDefined();
  expect(sg!.timeline.anno10).toBe('attivo');
});

test('lavoratore su piattaforma (autonomo): tutele + effetto indiretto sui dati (art. 8 Carta UE)', () => {
  const p: Profilo = { schemaVersion: 1, eta: 30, condizioneLavorativa: ['autonomo-ordinario'] };
  const eff = simula(p, decretoLavoro).effetti;
  const id = eff.map((e) => e.id);
  expect(id).toContain('lavoro-piattaforme-tutele');
  const dati = eff.find((e) => e.id === 'lavoro-piattaforme-dati');
  expect(dati).toBeDefined();
  expect(dati!.effetto.indiretto).toBe(true);
  expect(dati!.effetto.dirittoToccato?.articolo).toBe('art. 8');
  expect(dati!.effetto.dirittoToccato?.intensita).toBe('lieve');
});

test('i bonus assunzione 2026 si spengono nel lungo periodo (anno5 nullo)', () => {
  const giovani = decretoLavoro.regole.find((r) => r.id === 'lavoro-bonus-giovani')!;
  const donne = decretoLavoro.regole.find((r) => r.id === 'lavoro-bonus-donne')!;
  expect(giovani.timeline.anno5).toBe('nullo');
  expect(donne.timeline.anno5).toBe('nullo');
});
