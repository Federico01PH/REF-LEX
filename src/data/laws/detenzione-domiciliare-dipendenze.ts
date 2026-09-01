import type { Legge } from '../../engine/types';

// Verificato da: LEGGE 5 agosto 2026, n. 140, «Disposizioni in materia di detenzione
// domiciliare per il recupero dei detenuti tossicodipendenti o alcoldipendenti» (26G00157),
// pubblicata nella Gazzetta Ufficiale n. 181 del 6 agosto 2026, IN VIGORE DAL 21 AGOSTO 2026.
// Testo integrale letto su Normattiva il 2026-09-01:
// https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2026-08-05;140
//
// È legge dello Stato già in vigore: le regole hanno confidenza "certa", tranne dove la legge
// stessa rinvia a un decreto attuativo ancora da fare.
//
// Contenuti (dal testo ufficiale, sei articoli):
// - art. 1: inserisce nel DPR 309/1990 (testo unico stupefacenti) due articoli nuovi.
//   Art. 94-ter «Detenzione domiciliare in casi particolari»: quando non ci sono i presupposti
//   per l'affidamento in prova dell'art. 94, la persona tossicodipendente o alcoldipendente
//   che deve scontare una pena detentiva, anche residua, NON SUPERIORE A OTTO ANNI (quattro
//   se il titolo esecutivo comprende un reato dell'art. 4-bis della legge 354/1975, ma
//   restano otto per rapina aggravata art. 628 terzo comma ed estorsione aggravata art. 629
//   secondo comma c.p.) può chiedere IN OGNI MOMENTO la detenzione domiciliare presso una
//   struttura, sulla base di un programma terapeutico socio-riabilitativo RESIDENZIALE;
//   oppure, con programma SEMIRESIDENZIALE, in un luogo idoneo diverso, per pene fino a otto
//   anni per reati diversi da quelli dell'art. 4-bis (con le stesse due eccezioni).
//   La domanda va presentata con struttura privata accreditata (art. 117) o struttura
//   pubblica residenziale del SSN specializzata, e a pena di inammissibilità va allegata
//   l'indicazione del nesso tra dipendenza e reato, il programma terapeutico e la valutazione
//   sull'effettiva e attuale condizione di dipendenza e sull'idoneità del programma.
//   Il tribunale accoglie se ritiene che il programma contribuisca al recupero e prevenga il
//   pericolo di nuovi reati. Presso la Presidenza del Consiglio - Dipartimento politiche
//   antidroga è istituita una COMMISSIONE CENTRALE per le linee guida sui metodi di
//   accertamento, con DPCM da adottare entro CENTOVENTI GIORNI (quindi entro circa il
//   19 dicembre 2026), sentita la Conferenza unificata; ai componenti non spetta nessun
//   compenso. Le unità dei servizi pubblici per le dipendenze valutano in composizione
//   integrata da un componente dell'ufficio di esecuzione penale esterna e, ove opportuno,
//   del provveditorato regionale dell'amministrazione penitenziaria.
//   Il responsabile della struttura trasmette al servizio pubblico e all'UEPE una RELAZIONE
//   SEMESTRALE e segnala in ogni momento all'autorità giudiziaria le violazioni; a fine
//   programma l'UEPE trasmette una relazione finale. Se il programma non si conclude
//   positivamente il tribunale di sorveglianza REVOCA la misura (entro cinque giorni dalla
//   segnalazione), salvo che dalla relazione risulti in modo inequivoco che l'esito negativo
//   non è accompagnato da violazioni: in quel caso è possibile, non più di due volte, il
//   trasferimento presso altra struttura. Se il programma si conclude positivamente il
//   magistrato di sorveglianza può disporre affidamento in prova o detenzione domiciliare
//   anche oltre i limiti ordinari, entro i limiti dell'art. 94-ter aumentati della metà (di
//   un quarto per i reati dell'art. 4-bis), con verifiche periodiche sull'uso di sostanze e
//   revoca se sopravviene una nuova dipendenza.
//   Art. 94-quater «Definizione anticipata del processo»: l'imputato tossicodipendente o
//   alcoldipendente può chiedere l'applicazione di una pena non superiore a otto anni (quattro
//   per i reati dell'art. 4-bis, otto per rapina ed estorsione aggravate) da eseguire con le
//   modalità dell'art. 94-ter; il giudice concede SESSANTA GIORNI per produrre i documenti e
//   in quel periodo i termini di custodia cautelare sono sospesi. Non si applica per i reati
//   dell'art. 444, comma 1-bis, c.p.p. né a delinquenti abituali, professionali, per tendenza
//   o recidivi reiterati se la pena supera i due anni.
// - art. 2: gli addetti all'ufficio per il processo supportano la magistratura di sorveglianza.
// - art. 3: modifica l'art. 656, comma 5, c.p.p. — la sospensione dell'ordine di esecuzione
//   sale a OTTO ANNI nei casi dell'art. 94-ter; il magistrato di sorveglianza provvede entro
//   quarantacinque giorni.
// - art. 4: le norme sull'art. 94-quater si applicano ai processi pendenti, esclusi quelli con
//   sentenza di primo grado già pronunciata; su istanza dell'imputato che porti elementi sulla
//   propria dipendenza il dibattimento è sospeso per almeno quarantacinque giorni.
// - art. 5: abroga il comma 6-bis dell'art. 8 del DL 92/2024 (convertito dalla L. 112/2024).
// - art. 6: istituisce presso il Ministero della salute un fondo da 19.436.250 euro annui dal
//   2026, coperto per 5 milioni con le risorse liberate dall'abrogazione e per 14.436.250 con
//   la riduzione del fondo dell'art. 1, comma 200, della legge 190/2014.
//
// NOTA SUI CAMPI DEL PROFILO: REF-LEX non chiede se hai una dipendenza né se hai una condanna,
// e non deve chiederlo. Perciò la misura è raccontata come possibilità che esiste nel Paese e
// che puoi attivare per te o per una persona vicina, senza indovinare chi sei. L'unico gruppo
// che la legge tocca in modo mirato e riconoscibile dal profilo è chi lavora nella sanità.
// TONO NEUTRO: diciamo cosa cambia e a quali condizioni, non se è giusto o sbagliato.

const FONTE = {
  etichetta: 'Legge 5 agosto 2026, n. 140 — testo integrale (Normattiva)',
  url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2026-08-05;140'
};
const FONTE_GU = {
  etichetta: 'Gazzetta Ufficiale n. 181 del 6 agosto 2026 — Legge 140/2026',
  url: 'https://www.gazzettaufficiale.it/eli/id/2026/08/06/26G00157/SG'
};
const FONTE_DPR309 = {
  etichetta: 'DPR 9 ottobre 1990, n. 309 — testo unico stupefacenti, la norma modificata (Normattiva)',
  url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1990-10-09;309'
};
const FONTE_ART27 = {
  etichetta: 'Costituzione italiana, art. 27 — le pene devono tendere alla rieducazione (Senato della Repubblica)',
  url: 'https://www.senato.it/istituzione/la-costituzione/parte-i/titolo-i/articolo-27'
};
const FONTE_ART32 = {
  etichetta: 'Costituzione italiana, art. 32 — diritto alla salute e consenso alle cure (Senato della Repubblica)',
  url: 'https://www.senato.it/istituzione/la-costituzione/parte-i/titolo-ii/articolo-32'
};

export const detenzioneDomiciliareDipendenze: Legge = {
  id: 'legge-140-2026-detenzione-domiciliare',
  titoloDivulgativo: 'Chi ha una dipendenza può scontare fino a otto anni in comunità invece che in carcere',
  titoloUfficiale: 'Legge 5 agosto 2026, n. 140 — Disposizioni in materia di detenzione domiciliare per il recupero dei detenuti tossicodipendenti o alcoldipendenti',
  meseAnno: 'agosto 2026',
  stato: 'vigore',
  ambiti: ['diritti-salute', 'doveri'],
  fonti: [FONTE, FONTE_GU, FONTE_DPR309, FONTE_ART27, FONTE_ART32],
  verificataIl: '2026-09-01',
  riassunto: 'Dal 21 agosto 2026 chi ha una dipendenza da droghe o alcol e deve scontare una condanna fino a otto anni può chiedere, in qualsiasi momento, di scontarla in una comunità terapeutica accreditata o in una struttura pubblica, seguendo un programma di cura, invece che in carcere. Il limite scende a quattro anni per i reati più gravi. Decide il tribunale di sorveglianza, che valuta se il programma serve davvero al recupero e previene nuovi reati. Se il programma non va a buon fine, la misura viene revocata e la pena si sconta in carcere.',
  regole: [
    {
      // la misura esiste per chiunque possa averne bisogno: non chiediamo dipendenze né
      // condanne, quindi la raccontiamo come possibilità attivabile per sé o per un familiare.
      id: 'l140-detenzione-domiciliare-terapeutica',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 18 }],
      effetto: {
        tipo: 'servizio',
        descrizione: 'Dal 21 agosto 2026 esiste una strada nuova che puoi attivare per te o per una persona vicina. Chi ha una dipendenza da sostanze o da alcol e deve scontare una pena, anche residua, fino a otto anni può chiedere in qualsiasi momento di scontarla in detenzione domiciliare, dentro una comunità terapeutica privata accreditata o in una struttura pubblica del Servizio sanitario specializzata, seguendo un programma di cura residenziale; con un programma semiresidenziale si può chiedere anche un luogo idoneo diverso. Il limite scende a quattro anni se la condanna comprende uno dei reati più gravi elencati dall\'articolo 4-bis dell\'ordinamento penitenziario, con l\'eccezione di rapina ed estorsione aggravate, per cui restano otto anni. Alla domanda vanno allegati, pena l\'inammissibilità, il collegamento tra la dipendenza e il reato, il programma terapeutico e la valutazione sulla dipendenza attuale. Decide il tribunale di sorveglianza. Chi è ancora imputato può chiedere già durante il processo di concordare una pena da eseguire in questo modo, con sessanta giorni per procurare i documenti.',
        breve: 'Con una dipendenza si può chiedere di scontare fino a otto anni in comunità invece che in carcere.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa',
      noteConfidenza: 'La legge è in vigore dal 21 agosto 2026 e la misura si può chiedere subito. Manca però un pezzo: entro centoventi giorni dall\'entrata in vigore, quindi entro circa il 19 dicembre 2026, un decreto del Presidente del Consiglio deve istituire la commissione centrale che scriverà le linee guida nazionali su come si accerta la dipendenza e si valuta il programma. Finché quelle linee guida non ci sono, i criteri possono variare da un territorio all\'altro. Non è un diritto automatico: il tribunale accoglie solo se ritiene che il programma serva al recupero e prevenga il pericolo di nuovi reati.',
      fonteRegola: FONTE
    },
    {
      // il rovescio: uscire dal carcere si paga con controlli, relazioni e revoca. Il consenso
      // c'è, ma l'alternativa è il carcere: lo diciamo senza giudicare.
      id: 'l140-controlli-e-revoca',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 18 }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Effetto di riflesso, ed è il prezzo della misura. Chi entra nel programma accetta un flusso costante di informazioni sulla propria salute verso la giustizia: il responsabile della struttura manda ogni sei mesi una relazione al servizio pubblico per le dipendenze e all\'ufficio di esecuzione penale esterna, e segnala in ogni momento all\'autorità giudiziaria qualsiasi violazione delle prescrizioni, anche ai fini della revoca. Alla fine del percorso l\'ufficio di esecuzione penale esterna manda una relazione finale. Se il programma non si conclude positivamente il tribunale di sorveglianza revoca la misura entro cinque giorni e la pena residua si sconta in carcere, senza poter essere sostituita con un\'altra misura; l\'unica via d\'uscita è che dalla relazione finale risulti in modo inequivoco che l\'esito negativo non è accompagnato da violazioni, e in quel caso si può cambiare struttura, non più di due volte. Se invece va bene e si ottiene una misura più ampia, scattano verifiche periodiche sull\'uso di sostanze e alcol, e una nuova dipendenza fa revocare tutto.',
        breve: 'Il prezzo: relazioni semestrali, segnalazioni alla giustizia, controlli e revoca se il programma fallisce.',
        direzione: 'misto',
        indiretto: true,
        dirittoToccato: {
          carta: 'Costituzione italiana',
          articolo: 'art. 32',
          diritto: 'salute e riservatezza sulle proprie cure',
          intensita: 'lieve',
          url: 'https://www.senato.it/istituzione/la-costituzione/parte-i/titolo-ii/articolo-32'
        }
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa',
      noteConfidenza: 'Intensità "lieve" perché nessuno viene obbligato: la misura si chiede, non viene imposta, e chi non la chiede resta al regime ordinario. Va però detto che il consenso si dà avendo come alternativa il carcere, e che gli obblighi di relazione e segnalazione sono scritti nella legge, non lasciati alla struttura. La legge va anche nella direzione opposta rispetto alla compressione: l\'articolo 27 della Costituzione dice che le pene devono tendere alla rieducazione del condannato, e questa misura serve a questo.',
      fonteRegola: FONTE_ART32
    },
    {
      // chi lavora nella sanità: la legge gli attribuisce compiti nuovi e finanzia il sistema.
      id: 'l140-lavoro-nella-sanita',
      campiNecessari: ['settoriProfessionali'],
      condizioni: [{ campo: 'settoriProfessionali', op: 'in', valore: ['sanita'] }],
      effetto: {
        tipo: 'dovere',
        descrizione: 'Lavori nella sanità: questa legge ti riguarda anche come professionista. I servizi pubblici per le dipendenze e le comunità accreditate diventano il perno di una misura penale: devono valutare l\'effettiva e attuale condizione di dipendenza e l\'idoneità del programma, e per farlo le unità competenti lavorano in composizione integrata con un componente dell\'ufficio di esecuzione penale esterna e, dove serve, del provveditorato regionale dell\'amministrazione penitenziaria. Chi dirige una struttura dove si svolge il programma deve mandare una relazione ogni sei mesi e segnalare subito all\'autorità giudiziaria le violazioni. Entro circa il 19 dicembre 2026 una commissione centrale presso la Presidenza del Consiglio, con professionalità dei servizi pubblici e accreditati, dovrà fissare le linee guida nazionali sui metodi di accertamento. Le risorse ci sono: un fondo da 19.436.250 euro all\'anno dal 2026 presso il Ministero della salute, ripartito con decreto e monitorato.',
        breve: 'Nella sanità: valutazioni integrate con la giustizia, relazioni semestrali e un fondo da 19,4 milioni.',
        direzione: 'misto'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa',
      noteConfidenza: 'Il fondo è a importo fisso: 19.436.250 euro annui, con il Ministero della salute che monitora il rispetto del limite di spesa. Fuori da quel fondo la legge dice espressamente che le amministrazioni devono attuarla con le risorse umane e strumentali già disponibili, senza nuovi oneri: il carico organizzativo in più sui servizi non ha una copertura dedicata. La copertura del fondo viene per 5 milioni dall\'abrogazione di una norma del decreto carceri del 2024 e per 14.436.250 dalla riduzione di un fondo della legge di stabilità 2015.',
      fonteRegola: FONTE
    }
  ]
};
