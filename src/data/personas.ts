import type { Profilo } from '../engine/types';

export interface Personaggio {
  id: string;
  nome: string;
  descrizione: string;
  profilo: Profilo;
}

const base = { schemaVersion: 1 as const };

export const PERSONAGGI: Personaggio[] = [
  {
    id: 'anna',
    nome: 'Anna, 74 anni',
    descrizione: 'Pensionata con pensione minima, vive sola in affitto',
    profilo: {
      ...base, eta: 74, genere: 'donna',
      condizioneLavorativa: 'pensionato',
      fasciaReddito: 'fino9k', fasciaIsee: 'fino9360',
      abitazione: 'affitto', figli: 2,
      statoCivile: 'vedovo',
      disabilita: ['nessuna'], cittadinanza: 'italiana'
    }
  },
  {
    id: 'luca',
    nome: 'Luca, 22 anni',
    descrizione: 'Studente universitario con lavoro part-time',
    profilo: {
      ...base, eta: 22, genere: 'uomo',
      condizioneLavorativa: 'dipendente-privato',
      fasciaReddito: 'fino9k', fasciaIsee: 'da9360a15k',
      abitazione: 'affitto', figli: 0,
      disabilita: ['nessuna'], cittadinanza: 'italiana'
    }
  },
  {
    id: 'karim',
    nome: 'Karim, 45 anni',
    descrizione: 'Artigiano con partita IVA, due figli, residente in Italia da 20 anni',
    profilo: {
      ...base, eta: 45, genere: 'uomo',
      condizioneLavorativa: 'autonomo-ordinario',
      fasciaReddito: 'da20a28k', fasciaIsee: 'da15a25k',
      abitazione: 'proprieta', figli: 2,
      statoCivile: 'sposato',
      disabilita: ['nessuna'], cittadinanza: 'extra-ue'
    }
  },
  {
    id: 'giulia',
    nome: 'Giulia, 38 anni',
    descrizione: 'Impiegata, famiglia monoreddito con tre figli, casa di proprietà col mutuo',
    profilo: {
      ...base, eta: 38, genere: 'donna',
      condizioneLavorativa: 'dipendente-privato',
      fasciaReddito: 'da28a35k', fasciaIsee: 'da15a25k',
      abitazione: 'proprieta', figli: 3,
      statoCivile: 'sposato',
      disabilita: ['nessuna'], cittadinanza: 'italiana'
    }
  },
  {
    id: 'marco',
    nome: 'Marco, 52 anni',
    descrizione: 'Operaio con disabilità motoria, lavora a tempo pieno',
    profilo: {
      ...base, eta: 52, genere: 'uomo',
      condizioneLavorativa: 'dipendente-privato',
      fasciaReddito: 'da20a28k', fasciaIsee: 'da15a25k',
      abitazione: 'proprieta', figli: 1,
      disabilita: ['motoria'], cittadinanza: 'italiana'
    }
  },
  {
    id: 'sara',
    nome: 'Sara, 29 anni',
    descrizione: 'Neoassunta in città, single, in affitto, convive con la fibromialgia',
    profilo: {
      ...base, eta: 29, genere: 'donna',
      condizioneLavorativa: 'dipendente-privato',
      fasciaReddito: 'da15a20k', fasciaIsee: 'da9360a15k',
      abitazione: 'affitto', figli: 0,
      statoCivile: 'non-sposato',
      disabilita: ['condizione-non-riconosciuta'], cittadinanza: 'italiana'
    }
  },
  {
    id: 'elena',
    nome: 'Elena, 61 anni',
    descrizione: 'Imprenditrice con una piccola azienda di famiglia',
    profilo: {
      ...base, eta: 61, genere: 'donna',
      condizioneLavorativa: 'imprenditore',
      fasciaReddito: 'oltre50k', fasciaIsee: 'oltre40k',
      abitazione: 'proprieta', figli: 2,
      statoCivile: 'sposato',
      disabilita: ['nessuna'], cittadinanza: 'italiana'
    }
  },
  {
    id: 'pavel',
    nome: 'Pavel, 35 anni',
    descrizione: 'Caregiver: assiste la madre non autosufficiente, lavora poco e quando può',
    profilo: {
      ...base, eta: 35, genere: 'uomo',
      condizioneLavorativa: 'caregiver',
      fasciaReddito: 'nessuno', fasciaIsee: 'fino9360',
      abitazione: 'affitto', figli: 0,
      disabilita: ['nessuna'], cittadinanza: 'ue'
    }
  }
];
