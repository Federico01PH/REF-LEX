import type { Profilo } from '../engine/types';

export interface Opzione { valore: unknown; etichetta: string; }
export interface Domanda {
  campo: keyof Profilo;
  titolo: string;
  perche: string;           // "Perché lo chiediamo"
  tipo: 'numero' | 'scelta' | 'multi';
  obbligatoria?: boolean;   // solo eta
  opzioni?: Opzione[];
}

export const DOMANDE: Domanda[] = [
  { campo: 'eta', titolo: 'Quanti anni hai?', tipo: 'numero', obbligatoria: true,
    perche: 'Molte leggi valgono solo per certe età: pensioni, scuola, patente, agevolazioni giovani.' },
  { campo: 'condizioneLavorativa', titolo: 'Di cosa ti occupi?', tipo: 'scelta',
    perche: 'Tasse, bonus e tutele cambiano molto tra dipendenti, autonomi, studenti e pensionati.',
    opzioni: [
      { valore: 'dipendente-privato', etichetta: 'Dipendente (azienda privata)' },
      { valore: 'dipendente-pubblico', etichetta: 'Dipendente pubblico' },
      { valore: 'autonomo-ordinario', etichetta: 'Partita IVA' },
      { valore: 'forfettario', etichetta: 'Partita IVA forfettaria' },
      { valore: 'imprenditore', etichetta: 'Imprenditore/trice' },
      { valore: 'studente', etichetta: 'Studente/ssa' },
      { valore: 'pensionato', etichetta: 'In pensione' },
      { valore: 'disoccupato', etichetta: 'In cerca di lavoro' },
      { valore: 'caregiver', etichetta: 'Mi prendo cura di un familiare' },
      { valore: 'casalingo', etichetta: 'Mi occupo della casa' },
      { valore: 'altro', etichetta: 'Altro' }] },
  { campo: 'fasciaReddito', titolo: "Quanto guadagni all'anno, più o meno?", tipo: 'scelta',
    perche: 'Serve per calcolare tasse e bonus. Basta la fascia: non chiediamo la cifra esatta.',
    opzioni: [
      { valore: 'nessuno', etichetta: 'Nessun reddito' }, { valore: 'fino9k', etichetta: 'Fino a 9.000 €' },
      { valore: 'da9a15k', etichetta: '9.000 - 15.000 €' }, { valore: 'da15a20k', etichetta: '15.000 - 20.000 €' },
      { valore: 'da20a28k', etichetta: '20.000 - 28.000 €' }, { valore: 'da28a35k', etichetta: '28.000 - 35.000 €' },
      { valore: 'da35a50k', etichetta: '35.000 - 50.000 €' }, { valore: 'oltre50k', etichetta: 'Più di 50.000 €' }] },
  { campo: 'fasciaIsee', titolo: "Conosci il tuo ISEE?", tipo: 'scelta',
    perche: "L'ISEE è il \"termometro\" economico della famiglia: decide bonus, sconti e aiuti.",
    opzioni: [
      { valore: 'fino9360', etichetta: 'Fino a 9.360 €' }, { valore: 'da9360a15k', etichetta: '9.360 - 15.000 €' },
      { valore: 'da15a25k', etichetta: '15.000 - 25.000 €' }, { valore: 'da25a40k', etichetta: '25.000 - 40.000 €' },
      { valore: 'oltre40k', etichetta: 'Più di 40.000 €' }, { valore: 'nonLoSo', etichetta: 'Non lo so' }] },
  { campo: 'figli', titolo: 'Hai figli?', tipo: 'scelta',
    perche: 'Assegni, detrazioni e congedi dipendono dal numero di figli.',
    opzioni: [
      { valore: 0, etichetta: 'No' }, { valore: 1, etichetta: 'Uno' },
      { valore: 2, etichetta: 'Due' }, { valore: 3, etichetta: 'Tre o più' }] },
  { campo: 'statoCivile', titolo: 'Qual è il tuo stato civile?', tipo: 'scelta',
    perche: 'Matrimonio e unione civile cambiano tasse, pensioni di reversibilità ed eredità.',
    opzioni: [
      { valore: 'non-sposato', etichetta: 'Non sposato/a' }, { valore: 'sposato', etichetta: 'Sposato/a' },
      { valore: 'unione-civile', etichetta: 'Unione civile' }, { valore: 'separato', etichetta: 'Separato/a o divorziato/a' },
      { valore: 'vedovo', etichetta: 'Vedovo/a' }] },
  { campo: 'abitazione', titolo: 'Dove vivi?', tipo: 'scelta',
    perche: 'Bonus casa, regole sugli affitti e tasse sulla casa dipendono da questo.',
    opzioni: [
      { valore: 'proprieta', etichetta: 'Casa di proprietà' }, { valore: 'affitto', etichetta: 'In affitto' },
      { valore: 'comodato', etichetta: 'Ospite / comodato (es. dai genitori)' }, { valore: 'altro', etichetta: 'Altro' }] },
  { campo: 'regione', titolo: 'In che regione vivi?', tipo: 'scelta',
    perche: 'Alcune leggi e aiuti valgono solo in certe regioni.',
    opzioni: ['Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna', 'Friuli-Venezia Giulia', 'Lazio',
      'Liguria', 'Lombardia', 'Marche', 'Molise', 'Piemonte', 'Puglia', 'Sardegna', 'Sicilia', 'Toscana',
      'Trentino-Alto Adige', 'Umbria', "Valle d'Aosta", 'Veneto', 'Vivo all\'estero']
      .map((r) => ({ valore: r, etichetta: r })) },
  { campo: 'disabilita', titolo: 'Convivi con una disabilità o una malattia?', tipo: 'multi',
    perche: 'Molte leggi riguardano diritti, aiuti e accessibilità. Contano anche le condizioni non ancora riconosciute ufficialmente in Italia, come la fibromialgia.',
    opzioni: [
      { valore: 'nessuna', etichetta: 'No' }, { valore: 'motoria', etichetta: 'Disabilità motoria' },
      { valore: 'visiva', etichetta: 'Disabilità visiva' }, { valore: 'uditiva', etichetta: 'Disabilità uditiva' },
      { valore: 'intellettiva', etichetta: 'Disabilità intellettiva o psichica' },
      { valore: 'malattia-cronica', etichetta: 'Malattia cronica riconosciuta' },
      { valore: 'condizione-non-riconosciuta', etichetta: 'Condizione non ancora riconosciuta (es. fibromialgia)' }] },
  { campo: 'cittadinanza', titolo: 'Qual è la tua cittadinanza?', tipo: 'scelta',
    perche: 'Permessi, voto e accesso ad alcuni aiuti dipendono dalla cittadinanza.',
    opzioni: [
      { valore: 'italiana', etichetta: 'Italiana' }, { valore: 'ue', etichetta: 'Di un Paese UE' },
      { valore: 'extra-ue', etichetta: "Di un Paese fuori dall'UE" }] },
  { campo: 'genere', titolo: 'In quale genere ti riconosci?', tipo: 'scelta',
    perche: 'Alcune leggi (pensioni, congedi, tutele) trattano diversamente uomini e donne.',
    opzioni: [
      { valore: 'donna', etichetta: 'Donna' }, { valore: 'uomo', etichetta: 'Uomo' },
      { valore: 'non-binario', etichetta: 'Non binario' }, { valore: 'preferisco-non-dirlo', etichetta: 'Preferisco non dirlo' }] },
  { campo: 'identitaGenere', titolo: 'La tua identità di genere corrisponde al sesso assegnato alla nascita?', tipo: 'scelta',
    perche: 'Esistono leggi su documenti, transizione e antidiscriminazione che riguardano le persone trans.',
    opzioni: [
      { valore: 'cisgender', etichetta: 'Sì' }, { valore: 'transgender', etichetta: 'No' },
      { valore: 'preferisco-non-dirlo', etichetta: 'Preferisco non dirlo' }] },
  { campo: 'orientamento', titolo: 'Qual è il tuo orientamento sentimentale?', tipo: 'scelta',
    perche: 'Unioni civili, adozioni e leggi antidiscriminazione hanno effetti diversi a seconda dell\'orientamento.',
    opzioni: [
      { valore: 'eterosessuale', etichetta: 'Eterosessuale' }, { valore: 'omosessuale', etichetta: 'Gay / lesbica' },
      { valore: 'bisessuale', etichetta: 'Bisessuale' }, { valore: 'altro', etichetta: 'Altro' },
      { valore: 'preferisco-non-dirlo', etichetta: 'Preferisco non dirlo' }] },
  { campo: 'religione', titolo: 'Pratichi una religione?', tipo: 'scelta',
    perche: 'Alcune leggi toccano luoghi di culto, festività, simboli religiosi e ore di religione a scuola.',
    opzioni: [
      { valore: 'nessuna', etichetta: 'No' }, { valore: 'cattolica', etichetta: 'Cattolica' },
      { valore: 'altra-cristiana', etichetta: 'Altra cristiana' }, { valore: 'musulmana', etichetta: 'Musulmana' },
      { valore: 'ebraica', etichetta: 'Ebraica' }, { valore: 'altra', etichetta: 'Altra' },
      { valore: 'preferisco-non-dirlo', etichetta: 'Preferisco non dirlo' }] }
];
