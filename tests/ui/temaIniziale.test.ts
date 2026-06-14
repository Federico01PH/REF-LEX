import { risolviTema } from '../../src/ui/temaIniziale';

test("tema 'dark' resta scuro", () => {
  expect(risolviTema('dark', false)).toBe('dark');
});

test("tema 'light' resta chiaro", () => {
  expect(risolviTema('light', true)).toBe('light');
});

test("tema 'auto' segue il sistema scuro", () => {
  expect(risolviTema('auto', true)).toBe('dark');
});

test("tema 'auto' segue il sistema chiaro", () => {
  expect(risolviTema('auto', false)).toBe('light');
});

test('valore sconosciuto o nullo si comporta come auto', () => {
  expect(risolviTema(null, true)).toBe('dark');
  expect(risolviTema('qualcosa', false)).toBe('light');
});
