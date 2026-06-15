import { riformaDisabilita } from '../../src/data/laws/riforma-disabilita';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(riformaDisabilita);
  if (!esito.success) throw new Error(esito.error.message);
});

// Verified: sperimentazione in 60 province nel 2026, tutta Italia dal 1/1/2027 (gia' rinviata una volta)
test('disabilità certificata: accertamento unico e progetto di vita, incerti nel 2026, attivi dal 2027', () => {
  const p: Profilo = { schemaVersion: 1, eta: 28, disabilita: ['motoria'] };
  const r = simula(p, riformaDisabilita);
  const id = r.effetti.map((e) => e.id);
  expect(id).toContain('disabilita-accertamento-unico');
  expect(id).toContain('disabilita-progetto-di-vita');
  const unico = r.effetti.find((e) => e.id === 'disabilita-accertamento-unico')!;
  expect(unico.timeline.anno1).toBe('incerto');
  expect(unico.timeline.anno2).toBe('attivo');
  expect(unico.confidenza).toBe('probabile');
});

test('condizione non ancora riconosciuta: messaggio onesto, neutro', () => {
  const p: Profilo = { schemaVersion: 1, eta: 40, disabilita: ['condizione-non-riconosciuta'] };
  const r = simula(p, riformaDisabilita);
  expect(r.effetti.map((e) => e.id)).toEqual(['disabilita-condizione-non-riconosciuta']);
  expect(r.effetti[0].effetto.direzione).toBe('neutro');
});

test('caregiver senza disabilità propria: coinvolto dal progetto di vita', () => {
  const p: Profilo = { schemaVersion: 1, eta: 50, condizioneLavorativa: ['caregiver'], disabilita: ['nessuna'] };
  const r = simula(p, riformaDisabilita);
  expect(r.effetti.map((e) => e.id)).toEqual(['disabilita-caregiver']);
});

test('nessuna disabilità e non caregiver: nessun effetto applicabile', () => {
  const p: Profilo = { schemaVersion: 1, eta: 30, condizioneLavorativa: ['studente'], disabilita: ['nessuna'] };
  const r = simula(p, riformaDisabilita);
  expect(r.effetti).toHaveLength(0);
});
