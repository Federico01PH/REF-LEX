import { aggiungiRichiesta, caricaRichieste, rimuoviRichiesta } from '../../src/storage/richieste';

beforeEach(() => localStorage.clear());

test('senza nulla di salvato la lista è vuota', () => {
  expect(caricaRichieste()).toEqual([]);
});

test('aggiungere una richiesta la salva con titolo, url e data', () => {
  const lista = aggiungiRichiesta('Nuova legge sulla scuola', 'https://www.gazzettaufficiale.it/x');
  expect(lista).toHaveLength(1);
  expect(lista[0].titolo).toBe('Nuova legge sulla scuola');
  expect(lista[0].url).toBe('https://www.gazzettaufficiale.it/x');
  expect(lista[0].creataIl).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(caricaRichieste()).toEqual(lista);
});

test('niente doppioni e niente titoli vuoti', () => {
  aggiungiRichiesta('Nuova legge sulla scuola');
  expect(aggiungiRichiesta('Nuova legge sulla scuola')).toHaveLength(1);
  expect(aggiungiRichiesta('   ')).toHaveLength(1);
});

test('rimuovere una richiesta la toglie dalla lista salvata', () => {
  const [prima] = aggiungiRichiesta('Prima legge');
  aggiungiRichiesta('Seconda legge');
  const dopo = rimuoviRichiesta(prima.id);
  expect(dopo).toHaveLength(1);
  expect(dopo[0].titolo).toBe('Seconda legge');
  expect(caricaRichieste()).toEqual(dopo);
});

test('dati corrotti nel salvataggio non rompono nulla', () => {
  localStorage.setItem('reflex.richieste.v1', '{non-json');
  expect(caricaRichieste()).toEqual([]);
  localStorage.setItem('reflex.richieste.v1', JSON.stringify([{ a: 1 }, { id: 'x', titolo: 'Valida' }]));
  expect(caricaRichieste()).toEqual([{ id: 'x', titolo: 'Valida' }]);
});
