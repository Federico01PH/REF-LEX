import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { analizzaGazzetta } from '../../scripts/fonti/gazzetta';
import { analizzaCamera } from '../../scripts/fonti/camera';
import { analizzaSenato } from '../../scripts/fonti/senato';
import { SchemaNovita } from '../../src/engine/novita';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = (nome: string) =>
  readFileSync(join(__dirname, 'fixtures', nome), 'utf8');

test('gazzetta: estrae voci valide', () => {
  const voci = analizzaGazzetta(fixture('gazzetta.xml'));
  expect(voci.length).toBeGreaterThan(0);
  for (const v of voci) {
    const esito = SchemaNovita.safeParse(v);
    if (!esito.success) throw new Error(esito.error.message);
    expect(v.tipo).toBe('gazzetta');
  }
});

test('camera: estrae voci valide', () => {
  const voci = analizzaCamera(JSON.parse(fixture('camera.json')));
  expect(voci.length).toBeGreaterThan(0);
  for (const v of voci) expect(SchemaNovita.safeParse(v).success).toBe(true);
});

test('senato: estrae voci valide', () => {
  const voci = analizzaSenato(JSON.parse(fixture('senato.json')));
  expect(voci.length).toBeGreaterThan(0);
  for (const v of voci) expect(SchemaNovita.safeParse(v).success).toBe(true);
});

test('input malformato: i parser lanciano (mai dati parziali silenziosi)', () => {
  expect(() => analizzaGazzetta('<html>pagina di errore</html>')).toThrow();
  expect(() => analizzaCamera({ qualcosa: 'altro' })).toThrow();
  expect(() => analizzaSenato({ qualcosa: 'altro' })).toThrow();
});
