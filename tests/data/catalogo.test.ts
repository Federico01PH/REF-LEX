import { CATALOGO } from '../../src/data/laws';
import { SchemaLegge } from '../../src/engine/schema';

test('ogni legge del catalogo rispetta lo schema', () => {
  for (const legge of CATALOGO) {
    const esito = SchemaLegge.safeParse(legge);
    if (!esito.success) throw new Error(`Legge ${legge.id} non valida: ${esito.error.message}`);
  }
});

test('gli id sono unici', () => {
  const id = CATALOGO.map((l) => l.id);
  expect(new Set(id).size).toBe(id.length);
});
