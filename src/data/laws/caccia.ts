import type { Legge } from '../../engine/types';

// Verificato da: DISEGNO DI LEGGE S. 1552 (XIX Legislatura), "Modifiche alla legge 11
// febbraio 1992, n. 157, recante norme per la protezione della fauna selvatica omeoterma
// e per il prelievo venatorio", d'iniziativa del sen. Lucio Malan (FdI) e altri.
// Scheda iter: https://www.senato.it/leggi-e-documenti/disegni-di-legge/scheda-ddl?did=59294
// Data verifica: 2026-07-08
//
// STATO REALE (non è legge): il DDL 1552 è stato APPROVATO dal Senato il 23 giugno 2026
// (80 favorevoli, 56 contrari) e trasmesso alla Camera dei deputati, dove è ancora in
// esame. Lo modelliamo come PROPOSTA IN DISCUSSIONE: il testo può ancora cambiare.
//
// Contenuti principali (dal testo e dagli atti dell'iter):
// - riscrive la finalità della legge 157/1992: l'esercizio venatorio "concorre alla
//   tutela della biodiversità e dell'ecosistema" (i cacciatori come "bioregolatori");
// - amplia specie e aree cacciabili (inserisce fra i siti venabili demani forestali e
//   valichi montani; conteggia i parchi e le aree protette esistenti nella quota di
//   territorio protetto) ed estende i calendari (cade il limite della prima decade di
//   febbraio, toccando la migrazione prenuziale);
// - ridimensiona il ruolo dell'ISPRA: le Regioni possono discostarsi dai pareri
//   scientifici sui calendari venatori con adeguata motivazione;
// - toglie il lupo dalle specie "particolarmente protette", in linea con la Direttiva
//   (UE) 2025/1237 che lo ha spostato all'allegato V della Direttiva Habitat;
// - supera l'obbligo di scelta di un'unica forma di caccia; ammette strumenti ottici e
//   optoelettronici per la caccia di selezione agli ungulati; riconosce le licenze di
//   altri Paesi UE/SEE; consente scopo di lucro alle aziende faunistico-venatorie.
//
// CONTROLLO ONESTO: l'ISPRA (ente tecnico-scientifico, non di parte) nella nota di
// audizione riconosce come opportune alcune modifiche (ungulati in aumento, strumenti
// ottici per il tiro), ma segnala criticità su calendari e specie migratrici, richiami
// vivi, e sul controllo della fauna concentrato sui soli cacciatori (esclusi i
// professionisti del pest control usati da molte amministrazioni). Per questo gli
// effetti su ambiente e fauna sono modellati come reali ma "misti" e non "certi".

const FONTE_DDL = {
  etichetta: 'Disegno di legge S. 1552 (Senato della Repubblica)',
  url: 'https://www.senato.it/leggi-e-documenti/disegni-di-legge/scheda-ddl?did=59294'
};
const FONTE_ISPRA = {
  etichetta: 'Nota tecnica ISPRA sul DDL S. 1552 (audizione, parlamento.it)',
  url: 'https://www.parlamento.it/application/xmanager/projects/leg19/attachments/documento_evento_procedura_commissione/files/000/433/935/Contributo_ISPRA.pdf'
};
const FONTE_UCCELLI = {
  etichetta: 'Direttiva 2009/147/CE «Uccelli» (EUR-Lex)',
  url: 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:32009L0147'
};
const FONTE_157 = {
  etichetta: 'Legge 11 febbraio 1992, n. 157 (Normattiva)',
  url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1992-02-11;157'
};

export const caccia: Legge = {
  id: 'ddl-caccia-1552',
  titoloDivulgativo: 'Riforma della caccia: più specie, aree e periodi, meno peso all\'ISPRA',
  titoloUfficiale: 'DDL S. 1552 (XIX Leg.) — Modifiche alla legge 11 febbraio 1992, n. 157 sulla protezione della fauna selvatica e sul prelievo venatorio',
  stato: 'discussione',
  ambiti: ['ambiente', 'doveri'],
  fonti: [FONTE_DDL, FONTE_ISPRA, FONTE_UCCELLI, FONTE_157],
  verificataIl: '2026-07-08',
  riassunto: 'Una proposta (DDL S.1552) che riscrive la legge sulla caccia del 1992. È stata approvata dal Senato a giugno 2026 ed è ora all\'esame della Camera: non è ancora legge. Amplia le specie, le aree e i periodi in cui si può cacciare, definisce la caccia utile alla biodiversità e dà più poteri alle Regioni, riducendo il peso dell\'ISPRA. Tocca l\'ambiente e la sicurezza di tutti, e in modo diverso gli agricoltori e i cacciatori.',
  regole: [
    {
      // effetto collettivo su ambiente e animali: la riforma abbassa la tutela della
      // fauna selvatica (patrimonio indisponibile dello Stato) e amplia il prelievo.
      // Universale e indiretto, ancorato all'art. 9 Cost. (tutela ambiente/biodiversità).
      id: 'caccia-ambiente-animali',
      campiNecessari: [],
      condizioni: [],
      effetto: {
        tipo: 'diritto',
        descrizione: 'La riforma riscrive la legge del 1992 e definisce la caccia un\'attività che "concorre alla tutela della biodiversità e dell\'ecosistema", trasformando i cacciatori in "bioregolatori". In concreto amplia le specie cacciabili (tra cui il piccione di città e l\'oca selvatica; il lupo esce dalle specie particolarmente protette, in linea con la Direttiva UE 2025/1237), estende le aree (demani forestali e valichi montani, con i parchi già esistenti conteggiati nella quota di territorio protetto) e allunga i calendari, arrivando a toccare la migrazione degli uccelli. Riduce inoltre il peso dei pareri scientifici dell\'ISPRA, che le Regioni possono superare. La proposta la presenta come gestione della fauna e dei danni (cinghiali e ungulati in aumento); l\'ISPRA e le associazioni ambientaliste avvertono che abbassa la tutela di fauna ed ecosistemi. Riguarda l\'ambiente di tutti, anche di chi non caccia.',
        breve: 'Riforma caccia: più specie, aree e periodi di prelievo e meno peso all\'ISPRA. Tocca l\'ambiente di tutti.',
        direzione: 'misto',
        indiretto: true,
        dirittoToccato: {
          carta: 'Costituzione italiana',
          articolo: 'art. 9',
          diritto: 'tutela dell\'ambiente, della biodiversità e degli ecosistemi, anche nell\'interesse delle future generazioni',
          intensita: 'sensibile',
          url: 'https://www.senato.it/istituzione/la-costituzione/principi-fondamentali/articolo-9'
        }
      },
      timeline: { anno1: 'incerto', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'probabile',
      noteConfidenza: 'Effetto valido SE la proposta diventa legge con questo testo (approvata dal Senato, ora alla Camera). L\'intensità è "sensibile" e non "grave" perché resta un impianto di tutela e i vincoli europei (Direttiva Uccelli) continuano ad applicarsi; ma l\'ISPRA ha segnalato criticità su calendari, specie migratrici e riduzione del proprio ruolo tecnico.',
      fonteRegola: FONTE_UCCELLI
    },
    {
      // effetto collettivo sulla sicurezza/qualità della vita di chi frequenta la natura:
      // più aree e più periodi aperti alla caccia = meno spazi e tempi sicuri per gli altri.
      id: 'caccia-sicurezza',
      campiNecessari: [],
      condizioni: [],
      effetto: {
        tipo: 'qualita-vita',
        descrizione: 'Con più aree aperte alla caccia (compresi demani forestali e valichi montani, e i parchi conteggiati nella quota protetta) e con calendari più lunghi, che tolgono il limite della prima decade di febbraio e ammettono la braccata sulla neve, aumentano le zone e i mesi in cui si spara. La proposta consente anche di cacciare in Italia a chi ha una licenza di un altro Paese UE, senza formazione sul territorio locale. Per chi va per boschi e sentieri, va a funghi, corre o porta a spasso il cane, questo significa meno spazi e meno periodi sicuri; per chi caccia, invece, è più libertà di movimento.',
        breve: 'Più aree e mesi aperti alla caccia: per chi va per boschi e sentieri, meno spazi e tempi sicuri.',
        direzione: 'misto',
        indiretto: true
      },
      timeline: { anno1: 'incerto', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'probabile',
      noteConfidenza: 'Effetto valido SE la proposta diventa legge con questo testo. La caccia resta regolata (giorni, orari, distanze di sicurezza), ma l\'ampliamento di aree e periodi riduce gli spazi naturali fruibili in sicurezza dai cittadini.',
      fonteRegola: FONTE_DDL
    },
    {
      // agricoltori (dal mestiere in chiaro): la riforma nasce anche per i danni della
      // fauna, ma ISPRA segnala che il controllo è affidato ai soli cacciatori.
      id: 'caccia-agricoltori',
      campiNecessari: ['settoriProfessionali'],
      condizioni: [{ campo: 'settoriProfessionali', op: 'in', valore: ['agricoltura'] }],
      effetto: {
        tipo: 'servizio',
        descrizione: 'Se lavori in agricoltura, i danni della fauna selvatica (cinghiali e ungulati che devastano i campi) sono un problema concreto, e la riforma nasce anche per rispondervi: più prelievo e cacciatori come "bioregolatori" dovrebbero contenere le popolazioni vicino ai coltivi. C\'è però un rovescio segnalato dall\'ISPRA: il controllo della fauna viene concentrato sui soli cacciatori, escludendo le ditte professionali di pest control a cui molte amministrazioni si affidano per cinghiali, piccioni o nutrie; e la riforma non aggiunge strumenti strutturali di prevenzione dei danni o di indennizzo rapido. L\'effetto reale dipenderà molto da come le Regioni la applicheranno.',
        breve: 'Da agricoltore: punta a contenere i danni della fauna, ma affida il controllo ai soli cacciatori.',
        direzione: 'misto',
        indiretto: true
      },
      timeline: { anno1: 'incerto', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'dipende',
      noteConfidenza: 'L\'effetto dipende dal territorio e dall\'attuazione regionale. L\'ISPRA segnala che escludere i professionisti del controllo faunistico può ridurre l\'efficacia degli interventi; la proposta non introduce nuovi strumenti di prevenzione o indennizzo dei danni.',
      fonteRegola: FONTE_ISPRA
    },
    {
      // cacciatori (dal mestiere/attività in chiaro): la riforma amplia nettamente ciò
      // che possono fare. Effetto positivo per la loro attività.
      id: 'caccia-cacciatori',
      campiNecessari: ['settoriProfessionali'],
      condizioni: [{ campo: 'settoriProfessionali', op: 'in', valore: ['caccia'] }],
      effetto: {
        tipo: 'servizio',
        descrizione: 'Se pratichi la caccia, la riforma allarga molto ciò che puoi fare: più specie cacciabili, più aree (demani forestali, valichi montani), calendari più lunghi, e la possibilità di usare strumenti ottici e optoelettronici per la caccia di selezione agli ungulati. Cade l\'obbligo di scegliere un\'unica forma di caccia, vengono riconosciute le licenze rilasciate da altri Paesi UE e le aziende faunistico-venatorie possono operare con scopo di lucro. Restano alcuni limiti (per esempio un tetto ai richiami vivi, dieci per specie e quaranta in tutto). È comunque una proposta ancora all\'esame della Camera: il testo può cambiare.',
        breve: 'Da cacciatore: più specie, aree, periodi e strumenti (mirini ottici per gli ungulati): più opportunità.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'incerto', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'probabile',
      noteConfidenza: 'Effetto valido SE la proposta diventa legge con questo testo. Alcune facoltà (aree, calendari, specie) restano soggette alle scelte delle Regioni e ai vincoli europei; permangono limiti come il tetto ai richiami vivi.',
      fonteRegola: FONTE_DDL
    }
  ]
};
