import { dataLeggibile, titoloNovitaBreve } from '../../src/ui/formato';

test('converte la data ISO in italiano leggibile', () => {
  expect(dataLeggibile('2026-06-11')).toBe('11 giugno 2026');
});

test('input non riconosciuto: restituito intatto', () => {
  expect(dataLeggibile('boh')).toBe('boh');
});

test('accorcia un decreto-legge a nome e numero', () => {
  expect(titoloNovitaBreve('Conversione in legge del decreto-legge 2 marzo 2024, n. 19, recante ulteriori disposizioni urgenti')).toBe('DL n. 19/2024');
});

test('tiene l\'identificativo dell\'atto parlamentare in testa', () => {
  expect(titoloNovitaBreve('S. 936. - Conversione in legge del decreto-legge 15 novembre 2023, n. 161')).toBe('S. 936');
  expect(titoloNovitaBreve('A.C. 2822 (Bignami) - Disposizioni in materia di elezione')).toBe('A.C. 2822');
});

test('titolo già corto: restituito intatto (niente tendina)', () => {
  expect(titoloNovitaBreve('Nuova legge sulla scuola')).toBe('Nuova legge sulla scuola');
});
