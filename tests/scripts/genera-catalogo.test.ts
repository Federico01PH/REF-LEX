import { costruisciCatalogoRemoto } from '../../scripts/genera-catalogo';
import { SchemaCatalogoRemoto } from '../../src/engine/novita';
import { VERSIONE_CATALOGO } from '../../src/data/laws/versione';

test('il file generato è valido e porta la versione del catalogo', () => {
  const file = costruisciCatalogoRemoto('2026-06-11');
  const esito = SchemaCatalogoRemoto.safeParse(JSON.parse(JSON.stringify(file)));
  if (!esito.success) throw new Error(esito.error.message);
  expect(file.versione).toBe(VERSIONE_CATALOGO);
  expect(file.leggi.length).toBeGreaterThanOrEqual(2);
});
