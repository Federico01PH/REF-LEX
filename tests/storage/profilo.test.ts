import { caricaProfilo, caricaTema, salvaProfilo, salvaTema, cancellaTutto, storageDisponibile } from '../../src/storage/profilo';
import type { Profilo } from '../../src/engine/types';

const profilo: Profilo = { schemaVersion: 1, eta: 34, condizioneLavorativa: ['studente'] };

beforeEach(() => localStorage.clear());

test('salva e ricarica il profilo (settoriProfessionali derivato al caricamento)', () => {
  salvaProfilo(profilo);
  expect(caricaProfilo()).toMatchObject(profilo);
});

test('il tema si salva, si ricarica e di default è auto', () => {
  expect(caricaTema()).toBe('auto');
  salvaTema('dark');
  expect(caricaTema()).toBe('dark');
  expect(localStorage.getItem('reflex.tema')).toBe('dark');
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

test('restituisce null e pulisce se eta non è un numero', () => {
  localStorage.setItem('reflex.profilo.v1', JSON.stringify({ schemaVersion: 1, eta: 'trenta' }));
  expect(caricaProfilo()).toBeNull();
  expect(localStorage.getItem('reflex.profilo.v1')).toBeNull();
});

test('restituisce null se un campo enum ha un valore non valido', () => {
  localStorage.setItem('reflex.profilo.v1', JSON.stringify({ schemaVersion: 1, eta: 30, genere: 'extraterrestre' }));
  expect(caricaProfilo()).toBeNull();
});

test('restituisce null se un campo lista contiene un valore non valido', () => {
  localStorage.setItem('reflex.profilo.v1', JSON.stringify({ schemaVersion: 1, eta: 30, disabilita: ['volante'] }));
  expect(caricaProfilo()).toBeNull();
});

test('accetta un profilo completo con campi validi', () => {
  const completo: Profilo = {
    schemaVersion: 1, nome: 'Ada', eta: 41, genere: 'donna', condizioneLavorativa: ['dipendente-privato'],
    fasciaReddito: 'da28a35k', fasciaIsee: 'da15a25k', figli: 2, abitazione: 'affitto',
    numeroProprieta: 0, titoloStudio: 'laurea', disabilita: ['nessuna'], cittadinanza: 'italiana',
    religione: 'nessuna'
  };
  salvaProfilo(completo);
  expect(caricaProfilo()).toMatchObject(completo);
});

test('accetta un profilo con persone a carico e le categorie scelte', () => {
  const p: Profilo = {
    schemaVersion: 1, eta: 38, personeACarico: true,
    tipiACarico: ['figli-minorenni', 'genitori-anziani']
  };
  salvaProfilo(p);
  expect(caricaProfilo()).toMatchObject(p);
});

test('restituisce null se una categoria di persone a carico non è valida', () => {
  localStorage.setItem('reflex.profilo.v1', JSON.stringify({ schemaVersion: 1, eta: 30, tipiACarico: ['gatto'] }));
  expect(caricaProfilo()).toBeNull();
});

test('accetta e ricarica una condizione lavorativa multipla (studente che lavora)', () => {
  const p: Profilo = { schemaVersion: 1, eta: 22, condizioneLavorativa: ['studente', 'dipendente-privato'] };
  salvaProfilo(p);
  expect(caricaProfilo()).toMatchObject(p);
});

test('migra una condizione lavorativa salvata come stringa singola (vecchio formato) in un array', () => {
  localStorage.setItem('reflex.profilo.v1', JSON.stringify({ schemaVersion: 1, eta: 30, condizioneLavorativa: 'studente' }));
  expect(caricaProfilo()?.condizioneLavorativa).toEqual(['studente']);
});

test('restituisce null se la condizione lavorativa contiene una voce non valida', () => {
  localStorage.setItem('reflex.profilo.v1', JSON.stringify({ schemaVersion: 1, eta: 30, condizioneLavorativa: ['studente', 'astronauta'] }));
  expect(caricaProfilo()).toBeNull();
});

test('al caricamento ricava i settori professionali dal mestiere scritto in chiaro', () => {
  localStorage.setItem('reflex.profilo.v1', JSON.stringify({ schemaVersion: 1, eta: 50, professione: 'agricoltore' }));
  const p = caricaProfilo();
  expect(p?.professione).toBe('agricoltore');
  expect(p?.settoriProfessionali).toEqual(['agricoltura']);
});

test('senza mestiere il settore è quello neutro ["altro"] (mai un dato mancante)', () => {
  salvaProfilo({ schemaVersion: 1, eta: 40 });
  expect(caricaProfilo()?.settoriProfessionali).toEqual(['altro']);
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
