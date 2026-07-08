import { settoriDaProfessione, conSettoriProfessionali } from '../../src/engine/professioni';
import type { Profilo } from '../../src/engine/types';

test('riconosce i mestieri agricoli', () => {
  expect(settoriDaProfessione('agricoltore')).toEqual(['agricoltura']);
  expect(settoriDaProfessione('contadino')).toEqual(['agricoltura']);
  expect(settoriDaProfessione('allevatrice di bovini')).toEqual(['agricoltura']);
  expect(settoriDaProfessione('viticoltore')).toEqual(['agricoltura']);
});

test('riconosce cacciatori e guardie venatorie, senza cadere sul cacciavite', () => {
  expect(settoriDaProfessione('cacciatore')).toEqual(['caccia']);
  expect(settoriDaProfessione('guardia venatoria')).toEqual(['caccia']);
  // "cacciavite" NON deve attivare il settore caccia (falso positivo classico)
  expect(settoriDaProfessione('vendo cacciaviti')).toEqual(['altro']);
});

test('riconosce sanità, scuola e forze dell\'ordine', () => {
  expect(settoriDaProfessione('infermiera')).toEqual(['sanita']);
  expect(settoriDaProfessione('medico di base')).toEqual(['sanita']);
  expect(settoriDaProfessione('insegnante')).toEqual(['scuola']);
  expect(settoriDaProfessione("maestra d'asilo")).toEqual(['scuola']);
  expect(settoriDaProfessione('carabiniere')).toEqual(['forze-ordine']);
  expect(settoriDaProfessione('vigile del fuoco')).toEqual(['forze-ordine']);
  expect(settoriDaProfessione('poliziotto')).toEqual(['forze-ordine']);
});

test('non confonde il libero professionista con la scuola', () => {
  // "professionista" contiene "profess" ma NON è un professore
  expect(settoriDaProfessione('libero professionista')).toEqual(['altro']);
});

test('è insensibile a maiuscole e accenti', () => {
  expect(settoriDaProfessione('AGRICÓLTORE')).toEqual(['agricoltura']);
  expect(settoriDaProfessione('  Infermière  ')).toEqual(['sanita']);
});

test('mestiere non riconosciuto → ["altro"], testo vuoto/assente → []', () => {
  expect(settoriDaProfessione('sviluppatore di software')).toEqual(['altro']);
  expect(settoriDaProfessione('')).toEqual([]);
  expect(settoriDaProfessione('   ')).toEqual([]);
  expect(settoriDaProfessione(undefined)).toEqual([]);
});

test('un mestiere può toccare più settori insieme', () => {
  expect(settoriDaProfessione('medico militare').sort()).toEqual(['forze-ordine', 'sanita']);
});

test('conSettoriProfessionali deriva il campo dal testo libero', () => {
  const p: Profilo = { schemaVersion: 1, eta: 50, professione: 'agricoltore' };
  expect(conSettoriProfessionali(p).settoriProfessionali).toEqual(['agricoltura']);
});

test('conSettoriProfessionali senza professione dà il settore neutro ["altro"] (mai "dato mancante")', () => {
  const p: Profilo = { schemaVersion: 1, eta: 50 };
  expect(conSettoriProfessionali(p).settoriProfessionali).toEqual(['altro']);
});

test('conSettoriProfessionali ridativa il settore se il mestiere cambia (niente valori stantii)', () => {
  const p: Profilo = { schemaVersion: 1, eta: 50, professione: 'infermiera', settoriProfessionali: ['agricoltura'] };
  expect(conSettoriProfessionali(p).settoriProfessionali).toEqual(['sanita']);
});
