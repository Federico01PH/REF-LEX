import { dataLeggibile } from '../../src/ui/formato';

test('converte la data ISO in italiano leggibile', () => {
  expect(dataLeggibile('2026-06-11')).toBe('11 giugno 2026');
});

test('input non riconosciuto: restituito intatto', () => {
  expect(dataLeggibile('boh')).toBe('boh');
});
