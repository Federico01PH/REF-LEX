import type { Legge } from '../../engine/types';

// Verificato da: LEGGE 30 dicembre 2025, n. 199 («Bilancio di previsione dello Stato per
// l'anno finanziario 2026 e bilancio pluriennale per il triennio 2026-2028», 25G00212, GU
// n. 301 del 30 dicembre 2025, Suppl. Ord. n. 42), ARTICOLO 1, COMMI DA 82 A 110 — la
// definizione agevolata dei carichi affidati all'agente della riscossione, chiamata
// "rottamazione-quinquies". Testo letto su Normattiva il 2026-09-01:
// https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2025-12-30;199
// In vigore dal 1° gennaio 2026.
//
// Contenuti (dal testo ufficiale):
// - comma 82: si possono estinguere i debiti dei carichi affidati all'agente della riscossione
//   DAL 1° GENNAIO 2000 AL 31 DICEMBRE 2023 che derivano dall'omesso versamento di imposte
//   risultanti dalle dichiarazioni annuali e dai controlli automatici e formali (artt. 36-bis
//   e 36-ter DPR 600/1973, artt. 54-bis e 54-ter DPR 633/1972) oppure dall'omesso versamento
//   di contributi previdenziali INPS, ESCLUSI quelli richiesti a seguito di accertamento.
//   Si paga solo il capitale più il rimborso delle spese per le procedure esecutive e per la
//   notifica della cartella: niente sanzioni, niente interessi, niente interessi di mora,
//   niente somme aggiuntive, niente aggio.
// - comma 83: pagamento in unica soluzione entro il 31 luglio 2026 oppure in un massimo di
//   CINQUANTAQUATTRO RATE BIMESTRALI di pari importo: prime tre il 31 luglio, il 30 settembre
//   e il 30 novembre 2026; dalla quarta alla cinquantunesima il 31 gennaio, 31 marzo,
//   31 maggio, 31 luglio, 30 settembre e 30 novembre di ogni anno dal 2027; le ultime tre il
//   31 gennaio, il 31 marzo e il 31 maggio 2035.
// - comma 84: sulle rate, dal 1° agosto 2026, interessi al TRE per cento annuo (attenzione:
//   la stampa ha spesso scritto 4%, il testo dice 3%).
// - comma 86: la domanda andava presentata in via esclusivamente telematica ENTRO IL
//   30 APRILE 2026, scegliendo già il numero delle rate. Il termine è SCADUTO.
// - comma 87: nella domanda si dichiarano i giudizi pendenti sui carichi inclusi e ci si
//   impegna a rinunciarvi; il giudice li sospende e poi ne dichiara l'estinzione, che rende
//   inefficaci le sentenze di merito non passate in giudicato.
// - commi 89-90: contano solo i pagamenti già fatti a titolo di capitale e spese; quanto già
//   versato resta acquisito e non è rimborsabile.
// - comma 91: dopo la domanda si sospendono prescrizione e decadenza; si sospendono fino alla
//   prima rata gli obblighi delle dilazioni in corso; non si iscrivono nuovi fermi
//   amministrativi né ipoteche; non si avviano nuove procedure esecutive e non proseguono
//   quelle avviate salvo primo incanto già positivo; non si è inadempienti ai fini degli
//   artt. 28-ter e 48-bis DPR 602/1973; vale l'art. 54 del DL 50/2017 per il rilascio del DURC.
// - comma 92: entro il 30 giugno 2026 l'agente comunica gli importi; la singola rata non può
//   essere inferiore a 100 euro.
// - comma 94: al 31 luglio 2026 le dilazioni sospese sono automaticamente REVOCATE e non se ne
//   possono ottenere di nuove ai sensi dell'art. 19 DPR 602/1973; il pagamento della prima o
//   unica rata estingue le procedure esecutive già avviate.
// - comma 95: la definizione salta se non si paga, si paga poco o si paga in ritardo oltre
//   cinque giorni l'unica rata, oppure se saltano DUE RATE anche non consecutive o l'ultima:
//   riprendono prescrizione e decadenza e quanto versato vale solo come acconto.
// - comma 97: per le sanzioni del codice della strada irrogate da amministrazioni dello Stato
//   lo sconto vale SOLO su interessi e aggio, non sulla multa.
// - commi 99-100: rientrano anche debiti di rottamazioni precedenti decadute (2000-2017 e
//   2000-2022 con inefficacia al 30 settembre 2025), ma NON quelli per cui a quella data
//   risultavano versate tutte le rate scadute.
// - commi 102-109: regioni ed enti locali possono introdurre in autonomia proprie definizioni
//   agevolate sui tributi di loro spettanza (esclusi IRAP, addizionali e compartecipazioni),
//   con un termine non inferiore a sessanta giorni dalla pubblicazione dell'atto sul proprio
//   sito, anche per le entrate patrimoniali.
//
// PROROGA VERIFICATA: il DL 27 febbraio 2026, n. 25 (convertito con modificazioni dalla L. 27
// aprile 2026, n. 59), art. 2, comma 10, secondo periodo, proroga di TRE MESI i termini dei
// commi 83, 84, 86, 88, 92, 94 lett. a) e 101 SOLO per chi al 18 gennaio 2026 aveva residenza
// o sede in immobili sgomberati per inagibilità nei comuni di Calabria, Sicilia e Sardegna
// colpiti dagli eventi meteorologici e coperti dallo stato di emergenza del 26 gennaio 2026.
// Per tutti gli altri il 30 aprile 2026 è rimasto il termine per aderire.
//
// DATA DI RIFERIMENTO: modellata il 1° settembre 2026, quando la finestra per aderire è già
// chiusa e le prossime rate sono quelle del 30 settembre e del 30 novembre 2026. Il testo
// delle regole lo dice apertamente, invece di far credere che si sia ancora in tempo.
// NIENTE IMPORTI IN EURO: il risparmio dipende da quanto è il debito di ciascuno, e REF-LEX
// non lo chiede. Dire una cifra mensile sarebbe inventarla.

const FONTE = {
  etichetta: 'Legge 30 dicembre 2025, n. 199 (bilancio 2026), art. 1, commi 82-110 — testo integrale (Normattiva)',
  url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2025-12-30;199'
};
const FONTE_PROROGA = {
  etichetta: 'DL 27 febbraio 2026, n. 25, art. 2, comma 10 — proroga di tre mesi per le zone colpite dal maltempo (Normattiva)',
  url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legge:2026-02-27;25'
};
const FONTE_DPR602 = {
  etichetta: 'DPR 29 settembre 1973, n. 602 — riscossione delle imposte, le norme richiamate (Normattiva)',
  url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1973-09-29;602'
};
const FONTE_ART24 = {
  etichetta: 'Costituzione italiana, art. 24 — diritto di agire e difendersi in giudizio (Senato della Repubblica)',
  url: 'https://www.senato.it/istituzione/la-costituzione/parte-i/titolo-i/articolo-24'
};

export const rottamazioneQuinquies: Legge = {
  id: 'rottamazione-quinquies-2026',
  titoloDivulgativo: 'Rottamazione-quinquies: cartelle senza sanzioni né interessi, ma il termine per aderire è scaduto',
  titoloUfficiale: 'Legge 30 dicembre 2025, n. 199 (bilancio 2026), art. 1, commi 82-110 — definizione agevolata dei carichi affidati all\'agente della riscossione',
  meseAnno: 'dicembre 2025',
  stato: 'vigore',
  ambiti: ['fisco-lavoro'],
  fonti: [FONTE, FONTE_PROROGA, FONTE_DPR602, FONTE_ART24],
  verificataIl: '2026-09-01',
  riassunto: 'La legge di bilancio 2026 ha aperto la rottamazione-quinquies: chi aveva cartelle affidate alla riscossione tra il 2000 e il 2023 per imposte dichiarate e non versate o contributi INPS non versati poteva chiuderle pagando solo il capitale e le spese, senza sanzioni, interessi di mora e aggio, fino a 54 rate ogni due mesi. Il termine per aderire era il 30 aprile 2026 ed è passato. Chi ha aderito ha le prossime rate il 30 settembre e il 30 novembre 2026: saltarne due, anche non di seguito, fa perdere tutto.',
  regole: [
    {
      // il fatto più importante da sapere oggi: la porta è chiusa. Meglio dirlo subito che
      // lasciar credere di essere ancora in tempo.
      id: 'rottamazione-finestra-chiusa',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 18 }],
      effetto: {
        tipo: 'servizio',
        descrizione: 'La rottamazione-quinquies permetteva di chiudere le cartelle affidate all\'agente della riscossione tra il 1° gennaio 2000 e il 31 dicembre 2023 pagando solo il capitale e il rimborso delle spese per le procedure e per la notifica: niente sanzioni, niente interessi, niente interessi di mora e niente aggio. Riguardava i debiti da imposte dichiarate ma non versate e da controlli automatici e formali, e i contributi INPS non versati, esclusi quelli chiesti dopo un accertamento. Per le multe stradali irrogate da amministrazioni dello Stato lo sconto valeva solo sugli interessi e sull\'aggio, non sull\'importo della multa. La domanda andava presentata solo per via telematica entro il 30 aprile 2026: quel termine è passato e non si può più aderire. Rientravano anche debiti di rottamazioni precedenti già decadute, ma non quelli per cui al 30 settembre 2025 risultavano pagate tutte le rate scadute.',
        breve: 'Cartelle 2000-2023 senza sanzioni né interessi, ma il termine per aderire (30 aprile 2026) è passato.',
        direzione: 'neutro'
      },
      timeline: { anno1: 'attivo', anno2: 'nullo', anno5: 'nullo', anno10: 'nullo' },
      confidenza: 'certa',
      noteConfidenza: 'Un\'unica eccezione al 30 aprile 2026, e riguarda pochissime persone: un decreto sul maltempo (DL 25/2026, convertito dalla legge 59/2026) ha spostato di tre mesi i termini solo per chi al 18 gennaio 2026 aveva la residenza o la sede in immobili sgomberati per inagibilità, nei comuni di Calabria, Sicilia e Sardegna coperti dallo stato di emergenza deliberato il 26 gennaio 2026. Per tutti gli altri il termine è rimasto quello ordinario. Se in futuro il Parlamento riaprisse i termini servirebbe una nuova legge: qui trovi solo quello che è scritto oggi.',
      fonteRegola: FONTE
    },
    {
      // per chi ha aderito: il calendario e le regole che fanno saltare tutto.
      id: 'rottamazione-rate-e-decadenza',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 18 }],
      effetto: {
        tipo: 'dovere',
        descrizione: 'Se hai aderito, quello che conta adesso è il calendario. Le rate sono bimestrali, fino a un massimo di cinquantaquattro: dopo quella del 31 luglio 2026 vengono il 30 settembre e il 30 novembre 2026, poi dal 2027 il 31 gennaio, 31 marzo, 31 maggio, 31 luglio, 30 settembre e 30 novembre di ogni anno, fino alle ultime tre del 31 gennaio, 31 marzo e 31 maggio 2035. Dal 1° agosto 2026 sulle rate corrono interessi al 3 per cento annuo e nessuna rata può essere sotto i 100 euro. La definizione salta se non paghi o paghi meno del dovuto, e per l\'unica rata anche se paghi con più di cinque giorni di ritardo; se sei a rate, salta se ne perdi due, anche non consecutive, oppure l\'ultima. In quel caso tornano a correre prescrizione e decadenza, la riscossione riparte e quanto hai già versato vale solo come acconto sul debito pieno, sanzioni e interessi compresi. Attenzione anche a un effetto già scattato: al 31 luglio 2026 le vecchie dilazioni sui debiti inclusi sono state revocate in automatico e su quelli non se ne possono più ottenere di nuove.',
        breve: 'Prossime rate 30 settembre e 30 novembre 2026: saltarne due, anche non di fila, fa perdere tutto.',
        direzione: 'misto'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'nullo' },
      confidenza: 'certa',
      noteConfidenza: 'Il tasso è del 3 per cento annuo: è quello scritto nel comma 84, anche se in giro si è letto spesso 4 per cento. Il piano più lungo arriva al 31 maggio 2035, quindi entro dieci anni si chiude: per questo l\'ultimo orizzonte è segnato come non più attivo. Le date qui sono quelle ordinarie; chi rientra nella proroga per le zone colpite dal maltempo ha i termini spostati di tre mesi.',
      fonteRegola: FONTE
    },
    {
      // chi lavora in proprio: contributi INPS, DURC, fermi, ipoteche e dilazioni revocate.
      id: 'rottamazione-lavoro-autonomo',
      campiNecessari: ['condizioneLavorativa'],
      condizioni: [{
        campo: 'condizioneLavorativa', op: 'in',
        valore: ['autonomo-ordinario', 'forfettario', 'imprenditore']
      }],
      effetto: {
        tipo: 'economico',
        descrizione: 'Lavori in proprio, quindi questa misura ti tocca su due fronti che per un dipendente non esistono. Il primo: nella rottamazione rientrano anche i contributi previdenziali INPS non versati, esclusi però quelli chiesti dopo un accertamento. Il secondo: finché il piano regge, chi ha presentato la domanda non risulta inadempiente ai fini dei pagamenti della pubblica amministrazione e il documento unico di regolarità contributiva, il DURC, può essere rilasciato — e senza DURC non si lavora con la pubblica amministrazione. Nel frattempo non si iscrivono nuovi fermi amministrativi sui veicoli né nuove ipoteche, non partono nuove procedure esecutive e quelle in corso si fermano, salvo che il primo incanto sia già andato a buon fine; con il pagamento della prima rata si estinguono. Il rovescio è pesante: dal 31 luglio 2026 le dilazioni che avevi sui debiti inclusi sono state revocate in automatico e su quei debiti non puoi più chiedere una rateizzazione ordinaria. Se salti due rate perdi tutto e ti ritrovi il debito pieno senza più il piano di prima.',
        breve: 'Dentro anche i contributi INPS e il DURC resta valido, ma le vecchie dilazioni sono state revocate.',
        direzione: 'misto'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'nullo' },
      confidenza: 'certa',
      noteConfidenza: 'Quanto risparmi dipende solo da quanto pesano sanzioni, interessi e aggio sul tuo debito: REF-LEX non ti chiede l\'importo delle cartelle e non inventa una cifra. Il punto da non sottovalutare è la revoca automatica delle vecchie dilazioni: se il piano della rottamazione salta, quei debiti tornano esigibili per intero e la rateizzazione ordinaria su di essi non è più disponibile.',
      fonteRegola: FONTE
    },
    {
      // il pezzo che vale ancora per il futuro: comuni e regioni possono aprire le proprie.
      id: 'rottamazione-tributi-locali',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 18 }],
      effetto: {
        tipo: 'servizio',
        descrizione: 'C\'è una parte di questa legge che guarda avanti e vale anche se non hai aderito alla rottamazione statale. Regioni ed enti locali possono decidere da soli, con i propri atti, forme di definizione agevolata sui tributi di loro competenza — pensa a IMU, TARI, tributi regionali — escludendo però IRAP, addizionali e compartecipazioni ai tributi dello Stato, e possono farlo anche per le entrate patrimoniali e per i casi già finiti in accertamento o davanti al giudice tributario. Se il tuo Comune o la tua Regione ne apre una, deve darti almeno sessanta giorni di tempo dalla pubblicazione dell\'atto sul proprio sito internet, e il regolamento diventa efficace proprio con quella pubblicazione. Vale la pena controllare ogni tanto il sito del Comune: sono finestre locali, ognuno decide per sé, e non c\'è un annuncio nazionale che ti avvisa.',
        breve: 'Comuni e Regioni possono aprire una loro rottamazione su IMU, TARI e tributi locali: guarda il loro sito.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'probabile',
      noteConfidenza: 'La legge dà la facoltà, non l\'obbligo: dipende dal singolo Comune o dalla singola Regione, che decidono anche in base ai propri conti e alla propria capacità di riscuotere. Per questo è "probabile" e non "certo": la possibilità esiste ovunque, la finestra concreta no. I regolamenti degli enti locali diventano efficaci con la pubblicazione sul sito dell\'ente e vanno trasmessi al Ministero dell\'economia entro sessanta giorni, ma solo a fini statistici.',
      fonteRegola: FONTE
    },
    {
      // effetto indiretto: per aderire ci si impegna a rinunciare ai giudizi pendenti, e le
      // sentenze di merito non definitive diventano inefficaci. Ancorato all'art. 24 Cost.
      id: 'rottamazione-rinuncia-ai-giudizi',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 18 }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Effetto di riflesso sul diritto di farsi giudicare. Chi ha aderito ha dovuto dichiarare nella domanda i giudizi ancora aperti sui debiti inclusi e impegnarsi a rinunciarvi: il giudice li sospende, e quando arriva il pagamento della prima o unica rata ne dichiara l\'estinzione. L\'estinzione rende inefficaci le sentenze di merito e i provvedimenti presi durante il processo che non erano ancora definitivi. In pratica, se stavi contestando una cartella e avevi già vinto un grado di giudizio, aderendo hai rinunciato a quella vittoria in cambio dello sconto su sanzioni e interessi. Nessuno ti ha obbligato a scegliere: è il prezzo scritto della definizione agevolata, ed è utile saperlo prima, non dopo.',
        breve: 'Per aderire si rinuncia ai ricorsi aperti: le sentenze non ancora definitive diventano inefficaci.',
        direzione: 'misto',
        indiretto: true,
        dirittoToccato: {
          carta: 'Costituzione italiana',
          articolo: 'art. 24',
          diritto: 'diritto di agire e difendersi in giudizio',
          intensita: 'lieve',
          url: 'https://www.senato.it/istituzione/la-costituzione/parte-i/titolo-i/articolo-24'
        }
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'nullo' },
      confidenza: 'certa',
      noteConfidenza: 'Intensità "lieve" perché la rinuncia è volontaria: nessuno era tenuto ad aderire e chi non ha aderito ha conservato per intero il proprio ricorso. Va però segnalato che la rinuncia si perfeziona con il pagamento della prima rata e che le somme già versate a qualsiasi titolo restano acquisite e non sono rimborsabili, anche se la definizione poi salta.',
      fonteRegola: FONTE_ART24
    }
  ]
};
