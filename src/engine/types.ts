export type CondizioneLavorativa =
  | 'dipendente-privato' | 'dipendente-pubblico' | 'autonomo-ordinario'
  | 'forfettario' | 'imprenditore' | 'studente' | 'pensionato'
  | 'disoccupato' | 'caregiver' | 'casalingo' | 'altro';

export type FasciaReddito =
  | 'nessuno' | 'fino9k' | 'da9a15k' | 'da15a20k' | 'da20a28k'
  | 'da28a35k' | 'da35a50k' | 'oltre50k';

export type FasciaIsee =
  | 'fino9360' | 'da9360a15k' | 'da15a25k' | 'da25a40k' | 'oltre40k' | 'nonLoSo';

export type Disabilita =
  | 'nessuna' | 'motoria' | 'visiva' | 'uditiva' | 'intellettiva'
  | 'malattia-cronica' | 'condizione-non-riconosciuta';

// ordinale: ogni titolo include quelli precedenti (chi è laureato ha anche il diploma)
export type TitoloStudio = 'nessuno' | 'medie' | 'diploma' | 'laurea';

export interface Profilo {
  schemaVersion: 1;
  nome?: string; // nome o nickname scelto dall'utente, solo per rivolgersi a lui; resta sul dispositivo
  eta: number;
  genere?: 'donna' | 'uomo' | 'non-binario' | 'preferisco-non-dirlo';
  identitaGenere?: 'cisgender' | 'transgender' | 'preferisco-non-dirlo';
  orientamento?: 'eterosessuale' | 'omosessuale' | 'bisessuale' | 'altro' | 'preferisco-non-dirlo';
  statoCivile?: 'non-sposato' | 'sposato' | 'unione-civile' | 'separato' | 'vedovo';
  regione?: string;
  condizioneLavorativa?: CondizioneLavorativa;
  fasciaReddito?: FasciaReddito;
  fasciaIsee?: FasciaIsee;
  figli?: 0 | 1 | 2 | 3; // 3 = tre o più
  abitazione?: 'proprieta' | 'affitto' | 'comodato' | 'altro';
  numeroProprieta?: 0 | 1 | 2 | 3; // immobili posseduti, 3 = tre o più
  titoloStudio?: TitoloStudio;
  disabilita?: Disabilita[];
  cittadinanza?: 'italiana' | 'ue' | 'extra-ue';
  permessoSoggiorno?: 'si' | 'no' | 'preferisco-non-dirlo'; // chiesto solo con cittadinanza extra-ue
  religione?: 'nessuna' | 'cattolica' | 'altra-cristiana' | 'musulmana' | 'ebraica' | 'altra' | 'preferisco-non-dirlo';
}

export type Operatore = 'eq' | 'in' | 'almeno' | 'alPiu';
export interface Condizione { campo: keyof Profilo; op: Operatore; valore: unknown; }

export type Confidenza = 'certa' | 'probabile' | 'dipende';
export type Orizzonte = 'anno1' | 'anno2' | 'anno5' | 'anno10';
export const ORIZZONTI: Orizzonte[] = ['anno1', 'anno2', 'anno5', 'anno10'];
export type StatoOrizzonte = 'attivo' | 'nullo' | 'incerto';

// quanto una libertà/diritto è compressa, ancorata a una carta dei diritti reale
export type IntensitaDiritto = 'lieve' | 'sensibile' | 'grave';
export interface DirittoToccato {
  carta: string;     // es. 'Costituzione italiana', 'CEDU', 'Carta UE dei diritti fondamentali'
  articolo: string;  // es. 'art. 17'
  diritto: string;   // es. 'libertà di riunione'
  intensita: IntensitaDiritto;
  url?: string;      // link all'articolo o alla carta
}

export interface Effetto {
  tipo: 'economico' | 'diritto' | 'dovere' | 'servizio' | 'qualita-vita';
  importoMese?: { min: number; max: number }; // € al mese, solo tipo economico
  descrizione: string;
  direzione: 'positivo' | 'negativo' | 'neutro' | 'misto';
  indiretto?: boolean; // la legge non parla di te, ma ti tocca di riflesso
  dirittoToccato?: DirittoToccato; // rischio indiretto su un diritto/libertà; richiede indiretto: true
}

export interface Regola {
  id: string;
  condizioni: Condizione[]; // tutte devono valere (AND)
  campiNecessari: (keyof Profilo)[];
  effetto: Effetto;
  timeline: Record<Orizzonte, StatoOrizzonte>;
  confidenza: Confidenza;
  noteConfidenza?: string;
  fonteRegola: { etichetta: string; url: string };
}

export type StatoLegge = 'vigore' | 'approvata' | 'discussione' | 'bozza' | 'referendum';
export type Ambito =
  | 'fisco-lavoro' | 'pensioni-welfare' | 'casa'
  | 'diritti-salute' | 'sicurezza-privacy' | 'doveri'
  | 'scuola-universita-ricerca' | 'politica-voto'
  | 'ambiente' | 'turismo' | 'arte';

export interface Legge {
  id: string;
  titoloDivulgativo: string;
  titoloUfficiale: string;
  meseAnno?: string; // es. "maggio 2023": mostrato di fianco al titolo nella scelta, SOLO per le leggi già in vigore/approvate; le proposte mostrano lo stato
  stato: StatoLegge;
  ambiti: Ambito[]; // una legge può toccare più argomenti (almeno uno)
  origine?: 'italiana' | 'europea'; // assente = italiana
  fonti: { etichetta: string; url: string }[];
  verificataIl: string; // ISO yyyy-mm-dd
  riassunto: string;    // max ~80 parole, linguaggio terza media
  regole: Regola[];
}

export interface EffettoNonCalcolabile { regola: Regola; campiMancanti: (keyof Profilo)[]; }

export interface RisultatoSimulazione {
  leggeId: string;
  effetti: Regola[];                 // regole applicabili al profilo
  nonCalcolabili: EffettoNonCalcolabile[];
  totaleMese: Record<Orizzonte, { min: number; max: number }>; // solo certa+probabile attivi
}

export type Rilevanza = 'alta' | 'media' | 'bassa';
