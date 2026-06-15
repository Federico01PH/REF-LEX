import { valutaCondizioni, campiMancanti } from '../../src/engine/conditions';
import type { Profilo, Condizione } from '../../src/engine/types';

const profilo: Profilo = {
  schemaVersion: 1, eta: 34, condizioneLavorativa: ['dipendente-privato'],
  fasciaReddito: 'da15a20k', disabilita: ['nessuna'],
  titoloStudio: 'laurea', numeroProprieta: 2
};

test('eq vale per valore uguale (campo a valore singolo)', () => {
  const c: Condizione[] = [{ campo: 'titoloStudio', op: 'eq', valore: 'laurea' }];
  expect(valutaCondizioni(profilo, c)).toBe(true);
});

test('in vale se il valore è nella lista', () => {
  const c: Condizione[] = [{ campo: 'condizioneLavorativa', op: 'in', valore: ['dipendente-privato', 'dipendente-pubblico'] }];
  expect(valutaCondizioni(profilo, c)).toBe(true);
});

test('condizione lavorativa multipla: in vale se una delle occupazioni è nella lista', () => {
  const studenteLavoratore: Profilo = { schemaVersion: 1, eta: 22, condizioneLavorativa: ['studente', 'dipendente-privato'] };
  // matcha una regola pensata per gli studenti...
  expect(valutaCondizioni(studenteLavoratore, [{ campo: 'condizioneLavorativa', op: 'in', valore: ['studente'] }])).toBe(true);
  // ...e anche una pensata per i dipendenti
  expect(valutaCondizioni(studenteLavoratore, [{ campo: 'condizioneLavorativa', op: 'in', valore: ['dipendente-privato'] }])).toBe(true);
  // ma non una per chi non è fra le sue occupazioni
  expect(valutaCondizioni(studenteLavoratore, [{ campo: 'condizioneLavorativa', op: 'in', valore: ['pensionato'] }])).toBe(false);
});

test('nonContiene: vero se nessuna delle voci è tra i valori del campo', () => {
  const studenteLavoratore: Profilo = { schemaVersion: 1, eta: 20, condizioneLavorativa: ['studente', 'dipendente-privato'] };
  // non è pensionato → la condizione "non contiene pensionato" è vera
  expect(valutaCondizioni(studenteLavoratore, [{ campo: 'condizioneLavorativa', op: 'nonContiene', valore: ['pensionato'] }])).toBe(true);
  const pensionatoCheLavora: Profilo = { schemaVersion: 1, eta: 68, condizioneLavorativa: ['pensionato', 'dipendente-privato'] };
  // è anche pensionato → falsa
  expect(valutaCondizioni(pensionatoCheLavora, [{ campo: 'condizioneLavorativa', op: 'nonContiene', valore: ['pensionato'] }])).toBe(false);
});

test('almeno/alPiu funzionano sui numeri (età)', () => {
  expect(valutaCondizioni(profilo, [{ campo: 'eta', op: 'almeno', valore: 18 }])).toBe(true);
  expect(valutaCondizioni(profilo, [{ campo: 'eta', op: 'alPiu', valore: 30 }])).toBe(false);
});

test('almeno/alPiu funzionano sulle fasce di reddito (ordinali)', () => {
  expect(valutaCondizioni(profilo, [{ campo: 'fasciaReddito', op: 'alPiu', valore: 'da20a28k' }])).toBe(true);
  expect(valutaCondizioni(profilo, [{ campo: 'fasciaReddito', op: 'almeno', valore: 'da28a35k' }])).toBe(false);
});

test('almeno sul titolo di studio: la laurea include i titoli precedenti', () => {
  expect(valutaCondizioni(profilo, [{ campo: 'titoloStudio', op: 'almeno', valore: 'diploma' }])).toBe(true);
  expect(valutaCondizioni({ ...profilo, titoloStudio: 'medie' }, [{ campo: 'titoloStudio', op: 'almeno', valore: 'diploma' }])).toBe(false);
});

test('almeno/alPiu funzionano sul numero di proprietà', () => {
  expect(valutaCondizioni(profilo, [{ campo: 'numeroProprieta', op: 'almeno', valore: 2 }])).toBe(true);
  expect(valutaCondizioni(profilo, [{ campo: 'numeroProprieta', op: 'alPiu', valore: 1 }])).toBe(false);
});

test('in su campo array (disabilita) vale se almeno un elemento coincide', () => {
  expect(valutaCondizioni(profilo, [{ campo: 'disabilita', op: 'in', valore: ['motoria', 'nessuna'] }])).toBe(true);
  expect(valutaCondizioni(profilo, [{ campo: 'disabilita', op: 'in', valore: ['visiva'] }])).toBe(false);
});

test('condizioni multiple sono in AND', () => {
  const c: Condizione[] = [
    { campo: 'eta', op: 'almeno', valore: 18 },
    { campo: 'condizioneLavorativa', op: 'in', valore: ['pensionato'] }
  ];
  expect(valutaCondizioni(profilo, c)).toBe(false);
});

test('campiMancanti elenca i campi necessari non compilati', () => {
  expect(campiMancanti(profilo, ['eta', 'fasciaIsee', 'figli'])).toEqual(['fasciaIsee', 'figli']);
  expect(campiMancanti(profilo, ['eta'])).toEqual([]);
});
