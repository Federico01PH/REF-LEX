import { valutaCondizioni, campiMancanti } from '../../src/engine/conditions';
import type { Profilo, Condizione } from '../../src/engine/types';

const profilo: Profilo = {
  schemaVersion: 1, eta: 34, condizioneLavorativa: 'dipendente-privato',
  fasciaReddito: 'da15a20k', disabilita: ['nessuna']
};

test('eq vale per valore uguale', () => {
  const c: Condizione[] = [{ campo: 'condizioneLavorativa', op: 'eq', valore: 'dipendente-privato' }];
  expect(valutaCondizioni(profilo, c)).toBe(true);
});

test('in vale se il valore è nella lista', () => {
  const c: Condizione[] = [{ campo: 'condizioneLavorativa', op: 'in', valore: ['dipendente-privato', 'dipendente-pubblico'] }];
  expect(valutaCondizioni(profilo, c)).toBe(true);
});

test('almeno/alPiu funzionano sui numeri (età)', () => {
  expect(valutaCondizioni(profilo, [{ campo: 'eta', op: 'almeno', valore: 18 }])).toBe(true);
  expect(valutaCondizioni(profilo, [{ campo: 'eta', op: 'alPiu', valore: 30 }])).toBe(false);
});

test('almeno/alPiu funzionano sulle fasce di reddito (ordinali)', () => {
  expect(valutaCondizioni(profilo, [{ campo: 'fasciaReddito', op: 'alPiu', valore: 'da20a28k' }])).toBe(true);
  expect(valutaCondizioni(profilo, [{ campo: 'fasciaReddito', op: 'almeno', valore: 'da28a35k' }])).toBe(false);
});

test('in su campo array (disabilita) vale se almeno un elemento coincide', () => {
  expect(valutaCondizioni(profilo, [{ campo: 'disabilita', op: 'in', valore: ['motoria', 'nessuna'] }])).toBe(true);
  expect(valutaCondizioni(profilo, [{ campo: 'disabilita', op: 'in', valore: ['visiva'] }])).toBe(false);
});

test('condizioni multiple sono in AND', () => {
  const c: Condizione[] = [
    { campo: 'eta', op: 'almeno', valore: 18 },
    { campo: 'condizioneLavorativa', op: 'eq', valore: 'pensionato' }
  ];
  expect(valutaCondizioni(profilo, c)).toBe(false);
});

test('campiMancanti elenca i campi necessari non compilati', () => {
  expect(campiMancanti(profilo, ['eta', 'fasciaIsee', 'figli'])).toEqual(['fasciaIsee', 'figli']);
  expect(campiMancanti(profilo, ['eta'])).toEqual([]);
});
