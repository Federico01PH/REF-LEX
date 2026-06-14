import { dataLeggibile, titoloNovitaBreve } from '../../src/ui/formato';

test('converte la data ISO in italiano leggibile', () => {
  expect(dataLeggibile('2026-06-11')).toBe('11 giugno 2026');
});

test('input non riconosciuto: restituito intatto', () => {
  expect(dataLeggibile('boh')).toBe('boh');
});

test('conversione di un decreto-legge: mostra numero del decreto e oggetto, non il boilerplate', () => {
  expect(titoloNovitaBreve('Conversione in legge del decreto-legge 2 marzo 2024, n. 19, recante ulteriori disposizioni urgenti per l\'attuazione del PNRR'))
    .toBe('DL 19/2024: Ulteriori disposizioni urgenti per l\'attuazione del PNRR');
});

test('un numero di legge citato nel testo NON sostituisce il titolo descrittivo', () => {
  const t = 'Modifiche alla legge 4 agosto 1984, n. 464, concernenti l\'obbligo di trasmissione';
  expect(titoloNovitaBreve(t)).toBe(t);
});

test('titolo già descrittivo: restituito intatto (niente tendina)', () => {
  const t = 'Disposizioni in materia di welfare aziendale e asili nido';
  expect(titoloNovitaBreve(t)).toBe(t);
});
