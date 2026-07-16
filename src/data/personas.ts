import type { Profilo } from '../engine/types';

export interface Personaggio {
  id: string;
  nome: string;
  descrizione: string;
  // la categoria sociale in poche parole, con l'articolo, minuscola: serve a comporre frasi
  // come "Stesso effetto anche per uno studente e un agricoltore" in "E per gli altri?",
  // dove il nome proprio non direbbe a chi legge quale pezzo di società la legge tratta uguale.
  categoria: string;
  profilo: Profilo;
}

const base = { schemaVersion: 1 as const };

export const PERSONAGGI: Personaggio[] = [
  {
    id: 'anna',
    nome: 'Anna, 74 anni',
    descrizione: 'Pensionata con pensione minima, vive sola in affitto',
    categoria: 'una pensionata con la pensione minima',
    profilo: {
      ...base, eta: 74, genere: 'donna',
      condizioneLavorativa: ['pensionato'],
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
    categoria: 'uno studente che lavora part-time',
    profilo: {
      ...base, eta: 22, genere: 'uomo',
      condizioneLavorativa: ['studente', 'dipendente-privato'],
      fasciaReddito: 'fino9k', fasciaIsee: 'da9360a15k',
      abitazione: 'affitto', figli: 0,
      disabilita: ['nessuna'], cittadinanza: 'italiana'
    }
  },
  {
    id: 'karim',
    nome: 'Karim, 45 anni',
    descrizione: 'Artigiano con partita IVA e permesso di soggiorno, due figli, in Italia da 20 anni',
    categoria: 'un artigiano con permesso di soggiorno',
    profilo: {
      ...base, eta: 45, genere: 'uomo',
      condizioneLavorativa: ['autonomo-ordinario'],
      fasciaReddito: 'da20a28k', fasciaIsee: 'da15a25k',
      abitazione: 'proprieta', figli: 2,
      statoCivile: 'sposato',
      disabilita: ['nessuna'], cittadinanza: 'extra-ue', permessoSoggiorno: 'si'
    }
  },
  {
    id: 'giulia',
    nome: 'Giulia, 38 anni',
    descrizione: 'Impiegata, famiglia monoreddito con tre figli, casa di proprietà col mutuo',
    categoria: 'una madre di tre figli con un solo stipendio in casa',
    profilo: {
      ...base, eta: 38, genere: 'donna',
      condizioneLavorativa: ['dipendente-privato'],
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
    categoria: 'un operaio con disabilità',
    profilo: {
      ...base, eta: 52, genere: 'uomo',
      condizioneLavorativa: ['dipendente-privato'],
      fasciaReddito: 'da20a28k', fasciaIsee: 'da15a25k',
      abitazione: 'proprieta', figli: 1,
      disabilita: ['motoria'], cittadinanza: 'italiana'
    }
  },
  {
    id: 'sara',
    nome: 'Sara, 29 anni',
    descrizione: 'Neoassunta in città, single, in affitto, convive con una condizione cronica non ancora riconosciuta',
    categoria: 'una lavoratrice con una condizione non riconosciuta',
    profilo: {
      ...base, eta: 29, genere: 'donna',
      condizioneLavorativa: ['dipendente-privato'],
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
    categoria: 'un\'imprenditrice',
    profilo: {
      ...base, eta: 61, genere: 'donna',
      condizioneLavorativa: ['imprenditore'],
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
    categoria: 'un caregiver',
    profilo: {
      ...base, eta: 35, genere: 'uomo',
      condizioneLavorativa: ['caregiver'],
      fasciaReddito: 'nessuno', fasciaIsee: 'fino9360',
      abitazione: 'affitto', figli: 0,
      disabilita: ['nessuna'], cittadinanza: 'ue'
    }
  },
  {
    id: 'omar',
    nome: 'Omar, 28 anni',
    descrizione: 'Arrivato da poco, senza permesso di soggiorno, lavora saltuariamente e vive in alloggi di fortuna',
    categoria: 'uno straniero senza permesso di soggiorno',
    profilo: {
      ...base, eta: 28, genere: 'uomo',
      condizioneLavorativa: ['altro'],
      fasciaReddito: 'fino9k', fasciaIsee: 'fino9360',
      abitazione: 'altro', figli: 0,
      statoCivile: 'non-sposato',
      disabilita: ['nessuna'], cittadinanza: 'extra-ue', permessoSoggiorno: 'no'
    }
  },
  {
    id: 'daniela',
    nome: 'Daniela, 47 anni',
    descrizione: 'Insegnante di ruolo nella scuola pubblica, sposata con un figlio',
    categoria: 'un\'insegnante',
    profilo: {
      ...base, eta: 47, genere: 'donna',
      condizioneLavorativa: ['dipendente-pubblico'],
      fasciaReddito: 'da28a35k', fasciaIsee: 'da15a25k',
      abitazione: 'proprieta', figli: 1,
      statoCivile: 'sposato', titoloStudio: 'laurea',
      disabilita: ['nessuna'], cittadinanza: 'italiana'
    }
  },
  {
    id: 'alex',
    nome: 'Alex, 26 anni',
    descrizione: 'Persona transgender, giovane, lavora come dipendente e vive in affitto in città',
    categoria: 'una persona transgender',
    profilo: {
      ...base, eta: 26, genere: 'donna', identitaGenere: 'transgender',
      condizioneLavorativa: ['dipendente-privato'],
      fasciaReddito: 'da15a20k', fasciaIsee: 'da9360a15k',
      abitazione: 'affitto', figli: 0,
      statoCivile: 'non-sposato',
      disabilita: ['nessuna'], cittadinanza: 'italiana'
    }
  },
  {
    id: 'davide',
    nome: 'Davide, 41 anni',
    descrizione: 'In unione civile con il compagno, impiegato, casa di proprietà col mutuo',
    categoria: 'un uomo in unione civile',
    profilo: {
      ...base, eta: 41, genere: 'uomo', orientamento: 'omosessuale',
      condizioneLavorativa: ['dipendente-privato'],
      fasciaReddito: 'da35a50k', fasciaIsee: 'da25a40k',
      abitazione: 'proprieta', figli: 0,
      statoCivile: 'unione-civile',
      disabilita: ['nessuna'], cittadinanza: 'italiana'
    }
  },
  {
    id: 'martina',
    nome: 'Martina, 25 anni',
    descrizione: 'Giovane libera professionista con partita IVA forfettaria, lavora da freelance in affitto',
    categoria: 'una libera professionista',
    profilo: {
      ...base, eta: 25, genere: 'donna',
      condizioneLavorativa: ['forfettario'],
      fasciaReddito: 'da15a20k', fasciaIsee: 'da9360a15k',
      abitazione: 'affitto', figli: 0,
      statoCivile: 'non-sposato', titoloStudio: 'laurea',
      disabilita: ['nessuna'], cittadinanza: 'italiana'
    }
  },
  {
    id: 'nadia',
    nome: 'Nadia, 53 anni',
    descrizione: 'Convive con una malattia rara riconosciuta che le rende difficile lavorare a tempo pieno',
    categoria: 'una lavoratrice con una malattia cronica',
    profilo: {
      ...base, eta: 53, genere: 'donna',
      condizioneLavorativa: ['dipendente-privato'],
      fasciaReddito: 'da15a20k', fasciaIsee: 'da9360a15k',
      abitazione: 'affitto', figli: 1,
      statoCivile: 'separato',
      disabilita: ['malattia-cronica'], cittadinanza: 'italiana'
    }
  },
  {
    id: 'miriam',
    nome: 'Miriam, 34 anni',
    descrizione: 'Impiegata, italiana di religione ebraica, frequenta la sinagoga della sua città',
    categoria: 'un\'impiegata di religione ebraica',
    profilo: {
      ...base, eta: 34, genere: 'donna',
      condizioneLavorativa: ['dipendente-privato'],
      fasciaReddito: 'da28a35k', fasciaIsee: 'da15a25k',
      abitazione: 'affitto', figli: 0,
      statoCivile: 'non-sposato',
      disabilita: ['nessuna'], cittadinanza: 'italiana', religione: 'ebraica'
    }
  },
  {
    id: 'bruno',
    nome: 'Bruno, 58 anni',
    descrizione: 'Agricoltore e allevatore, azienda di famiglia in collina, danni della fauna sui campi',
    categoria: 'un agricoltore',
    profilo: {
      ...base, eta: 58, genere: 'uomo',
      condizioneLavorativa: ['autonomo-ordinario'],
      professione: 'agricoltore e allevatore', settoriProfessionali: ['agricoltura'],
      fasciaReddito: 'da20a28k', fasciaIsee: 'da15a25k',
      abitazione: 'proprieta', numeroProprieta: 2, figli: 2,
      statoCivile: 'sposato',
      disabilita: ['nessuna'], cittadinanza: 'italiana'
    }
  },
  {
    id: 'gianni',
    nome: 'Gianni, 62 anni',
    descrizione: 'Cacciatore da una vita, vive in un piccolo paese di collina',
    categoria: 'un cacciatore in pensione',
    profilo: {
      ...base, eta: 62, genere: 'uomo',
      condizioneLavorativa: ['pensionato'],
      professione: 'cacciatore', settoriProfessionali: ['caccia'],
      fasciaReddito: 'da15a20k', fasciaIsee: 'da9360a15k',
      abitazione: 'proprieta', numeroProprieta: 1, figli: 2,
      statoCivile: 'sposato',
      disabilita: ['nessuna'], cittadinanza: 'italiana'
    }
  }
];
