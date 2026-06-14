import { dlMigrazioneAsilo } from '../../src/data/laws/dl-migrazione-asilo-2026';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(dlMigrazioneAsilo);
  if (!esito.success) throw new Error(esito.error.message);
});

// Verified: DL 12 giugno 2026, n. 100 (GU n.134 del 12/6/2026, 26G00119), decreto-legge in
// vigore subito ma da convertire entro ~60 giorni → stato 'vigore', confidenza 'probabile'.
test('è un decreto in vigore, non una semplice proposta', () => {
  expect(dlMigrazioneAsilo.stato).toBe('vigore');
});

test('cittadino extra-UE: riceve le regole su asilo/frontiera ed Eurodac', () => {
  const p: Profilo = { schemaVersion: 1, eta: 30, cittadinanza: 'extra-ue' };
  const r = simula(p, dlMigrazioneAsilo);
  const id = r.effetti.map((e) => e.id);
  expect(id).toContain('dl100-procedura-frontiera');
  expect(id).toContain('dl100-asilo-diritto');
  expect(id).toContain('dl100-eurodac-dati');
  expect(id).not.toContain('dl100-esame-avvocato');
});

test('laureato: riceve la regola sul nuovo esame da avvocato', () => {
  const p: Profilo = { schemaVersion: 1, eta: 27, cittadinanza: 'italiana', titoloStudio: 'laurea' };
  const r = simula(p, dlMigrazioneAsilo);
  const id = r.effetti.map((e) => e.id);
  expect(id).toContain('dl100-esame-avvocato');
  expect(id).not.toContain('dl100-procedura-frontiera');
});

test('cittadino italiano col diploma: nessun effetto (non è extra-UE né laureato)', () => {
  const p: Profilo = { schemaVersion: 1, eta: 40, cittadinanza: 'italiana', titoloStudio: 'diploma' };
  const r = simula(p, dlMigrazioneAsilo);
  expect(r.effetti).toHaveLength(0);
});

test('gli effetti indiretti sui diritti sono ancorati ad articoli reali (asilo art. 10 Cost., dati Carta UE art. 8)', () => {
  const p: Profilo = { schemaVersion: 1, eta: 30, cittadinanza: 'extra-ue' };
  const r = simula(p, dlMigrazioneAsilo);
  const conDiritto = r.effetti.filter((e) => e.effetto.dirittoToccato);
  expect(conDiritto.length).toBeGreaterThanOrEqual(2);
  for (const e of conDiritto) {
    expect(e.effetto.indiretto).toBe(true);
  }
  const articoli = conDiritto.map((e) => e.effetto.dirittoToccato!.articolo);
  expect(articoli).toContain('art. 10');
  expect(articoli).toContain('art. 8');
});
