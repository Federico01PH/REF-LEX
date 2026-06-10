import { caricaProfilo, salvaProfilo, cancellaTutto, storageDisponibile } from '../../src/storage/profilo';
import type { Profilo } from '../../src/engine/types';

const profilo: Profilo = { schemaVersion: 1, eta: 34, condizioneLavorativa: 'studente' };

beforeEach(() => localStorage.clear());

test('salva e ricarica il profilo', () => {
  salvaProfilo(profilo);
  expect(caricaProfilo()).toEqual(profilo);
});

test('restituisce null se non c\'è nulla', () => {
  expect(caricaProfilo()).toBeNull();
});

test('restituisce null e pulisce se i dati sono corrotti', () => {
  localStorage.setItem('reflex.profilo.v1', '{rotto');
  expect(caricaProfilo()).toBeNull();
  expect(localStorage.getItem('reflex.profilo.v1')).toBeNull();
});

test('restituisce null se schemaVersion è sconosciuta', () => {
  localStorage.setItem('reflex.profilo.v1', JSON.stringify({ schemaVersion: 99, eta: 30 }));
  expect(caricaProfilo()).toBeNull();
});

test('cancellaTutto rimuove ogni chiave reflex', () => {
  salvaProfilo(profilo);
  localStorage.setItem('reflex.tema', 'dark');
  cancellaTutto();
  expect(localStorage.getItem('reflex.profilo.v1')).toBeNull();
  expect(localStorage.getItem('reflex.tema')).toBeNull();
});

test('storageDisponibile è true in ambiente di test', () => {
  expect(storageDisponibile()).toBe(true);
});
