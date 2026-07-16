import type { Legge } from '../../engine/types';

// Verificato da: DISEGNO DI LEGGE S. 550 (XIX Legislatura), "Misure per la trasparenza dei
// programmi elettorali dei partiti", d'iniziativa dei senatori COTTARELLI, CALENDA, FINA,
// GARAVAGLIA, GIACOBBE, PAITA, PARRINI, SPAGNOLLI, VALENTE e VERDUCCI (firmatari di più
// gruppi: PD, Azione-Italia Viva, Lega, Autonomie).
// Testo integrale: https://www.senato.it/japp/bgt/showdoc/REST/v1/showdoc/get/fragment/19/DDLPRES/0/1375671/all
// Scheda iter: https://www.senato.it/leggi-e-documenti/disegni-di-legge/scheda-ddl?did=56628
// Data verifica: 2026-07-16
//
// STATO REALE (non è legge): comunicato alla Presidenza il 14 febbraio 2023; assegnato il
// 26 maggio 2023 alla 1ª Commissione permanente (Affari Costituzionali) in sede referente,
// con parere della 5ª (Bilancio). Da allora: "assegnato (non ancora iniziato l'esame)".
// Non è mai stato discusso. Lo modelliamo come PROPOSTA IN DISCUSSIONE perché è un Atto
// Senato numerato e assegnato, ma riassunto e note dicono che l'esame non è mai partito.
//
// Contenuti (dal testo ufficiale):
// - art. 1: aggiunge i commi 3-bis, 3-ter e 3-quater all'art. 14-bis del DPR 361/1957. Il
//   partito che presenta candidature in ALMENO METÀ delle circoscrizioni deve allegare al
//   programma: relazione tecnica per ogni misura che aumenta la spesa o riduce le entrate +
//   tabella "Misure espansive"; relazione tecnica per ogni misura che riduce la spesa o
//   aumenta le entrate + tabella "Misure di copertura"; una tabella "quadro di finanza
//   pubblica" con indebitamento netto, avanzo primario e debito per i 5 anni di legislatura;
//   una tabella "quadro macroeconomico" (crescita del PIL reale, deflatore, PIL nominale).
//   Le misure fino a 10 milioni di euro possono essere stimate in blocco, purché il totale
//   aggregato non superi 1 miliardo per tabella. Il deficit è ammesso: va solo dichiarato.
// - comma 3-quater: chi si presenta in MENO di metà delle circoscrizioni è ESONERATO, e può
//   presentare la documentazione per scelta.
// - art. 2: il Ministero dell'interno trasmette tutto all'UPB entro 24 ore dal deposito;
//   l'UPB pubblica sul proprio sito, entro il 21° giorno prima del voto, una valutazione
//   sull'attendibilità delle stime e sulla coerenza con il quadro di finanza pubblica. Può
//   farsi coadiuvare da Corte dei conti, ISTAT e Banca d'Italia, senza nuovi oneri.
// - art. 3: clausola di invarianza finanziaria (nessun costo per lo Stato).
//
// CONTROLLO ONESTO: qui NON esiste un contrappeso istituzionale come la nota ISPRA sulla
// caccia, perché l'esame non è mai iniziato: niente audizioni, niente dossier del Servizio
// Studi, nessun parere UPB sul DDL. La regola 'trasparenza-barriera-partiti-nuovi' è quindi
// una lettura di REF-LEX ancorata a un articolo reale (art. 49 Cost.), e la sua nota lo
// dichiara apertamente. I limiti citati nelle altre note (nessuna sanzione, esonero sotto
// metà delle circoscrizioni, valutazione al 21° giorno) sono invece nel testo.
//
// NOTA sul voto informato: NON usa dirittoToccato. Quel campo nell'app stampa "Compressione
// lieve/sensibile/grave": qui l'art. 48 viene rafforzato, non compresso, e usarlo direbbe
// l'opposto della verità. L'art. 48 resta citato nel testo e tra le fonti.

const FONTE_TESTO = {
  etichetta: 'Disegno di legge S. 550 — testo integrale (Senato della Repubblica)',
  url: 'https://www.senato.it/japp/bgt/showdoc/REST/v1/showdoc/get/fragment/19/DDLPRES/0/1375671/all'
};
const FONTE_ITER = {
  etichetta: 'Atto Senato n. 550 — scheda e iter (Senato della Repubblica)',
  url: 'https://www.senato.it/leggi-e-documenti/disegni-di-legge/scheda-ddl?did=56628'
};
const FONTE_DPR361 = {
  etichetta: 'DPR 30 marzo 1957, n. 361, art. 14-bis — la norma che verrebbe modificata (Normattiva)',
  url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1957-03-30;361'
};
const FONTE_ART48 = {
  etichetta: 'Costituzione italiana, art. 48 — il voto (Senato della Repubblica)',
  url: 'https://www.senato.it/istituzione/la-costituzione/parte-i/titolo-iv/articolo-48'
};
const FONTE_ART49 = {
  etichetta: 'Costituzione italiana, art. 49 — i partiti (Senato della Repubblica)',
  url: 'https://www.senato.it/istituzione/la-costituzione/parte-i/titolo-iv/articolo-49'
};
const FONTE_UPB = {
  etichetta: 'Ufficio parlamentare di bilancio — sito ufficiale',
  url: 'https://www.upbilancio.it/'
};

export const trasparenzaProgrammi: Legge = {
  id: 'ddl-trasparenza-programmi-550',
  titoloDivulgativo: 'Promesse elettorali col prezzo scritto: i partiti devono dire quanto costano e chi paga',
  titoloUfficiale: 'DDL S. 550 (XIX Leg.) — Misure per la trasparenza dei programmi elettorali dei partiti',
  stato: 'discussione',
  ambiti: ['politica-voto'],
  fonti: [FONTE_TESTO, FONTE_ITER, FONTE_DPR361, FONTE_ART48, FONTE_ART49, FONTE_UPB],
  verificataIl: '2026-07-16',
  riassunto: 'Una proposta (DDL S. 550) che obbliga i partiti grandi a scrivere nel programma elettorale quanto costa ogni promessa e con quali soldi la pagano, anche a debito, purché lo dichiarino. L\'Ufficio parlamentare di bilancio controlla se i conti stanno in piedi e pubblica un giudizio 21 giorni prima del voto. Non vieta nessuna promessa e non prevede sanzioni. Presentata nel febbraio 2023 da Cottarelli con senatori di più partiti, è ferma: assegnata alla Commissione Affari costituzionali nel maggio 2023, non è mai stata esaminata.',
  regole: [
    {
      // effetto principale sull'elettore: la legge parla ai partiti, al Viminale e all'UPB,
      // ma il destinatario vero è chi vota. Indiretto, positivo, art. 48 SOLO citato.
      id: 'trasparenza-voto-informato',
      campiNecessari: ['cittadinanza', 'eta'],
      condizioni: [
        { campo: 'cittadinanza', op: 'eq', valore: 'italiana' },
        { campo: 'eta', op: 'almeno', valore: 18 }
      ],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Se la proposta diventa legge, nel programma di ogni partito che si presenta in almeno metà delle circoscrizioni non trovi solo le promesse, ma anche il loro prezzo: una relazione tecnica per ogni misura, una tabella "Misure espansive" con quanto costa ciascuna in milioni di euro, una tabella "Misure di copertura" con dove si prendono i soldi (tagli ad altre spese, più tasse, oppure più debito, che va scritto nero su bianco) e gli obiettivi di debito e avanzo primario per i cinque anni della legislatura, con le stime di crescita del PIL su cui si reggono. L\'Ufficio parlamentare di bilancio, un organo indipendente, verifica se quelle stime sono attendibili e pubblica il suo giudizio sul proprio sito entro il ventunesimo giorno prima del voto. La legge non ti dice per chi votare e non vieta nessuna promessa: obbliga solo a metterci il prezzo, così puoi confrontare i programmi sapendo chi paga.',
        breve: 'Nel programma dei partiti grandi trovi anche il prezzo delle promesse e chi paga, col giudizio dell\'UPB.',
        direzione: 'positivo',
        indiretto: true
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'Proposta ferma: presentata il 14 febbraio 2023 e assegnata alla 1ª Commissione (Affari costituzionali) il 26 maggio 2023, non è mai stata esaminata. Tre limiti restano anche se venisse approvata così com\'è. Primo: non ci sono sanzioni per chi presenta numeri gonfiati o non presenta nulla — l\'unica conseguenza è il giudizio dell\'UPB e quello degli elettori. Secondo: la valutazione dell\'UPB arriva 21 giorni prima del voto, quando le liste sono già depositate. Terzo: l\'obbligo vale solo per chi si presenta in almeno metà delle circoscrizioni, quindi dei partiti più piccoli continueresti a non sapere i costi, a meno che scelgano di dirli.',
      fonteRegola: FONTE_TESTO
    },
    {
      // contrappeso onesto: la trasparenza si paga con un'asticella tecnica più alta per chi
      // vuole correre a livello nazionale. Art. 49 Cost. parla di "tutti i cittadini": nessun
      // filtro d'età, perché associarsi in un partito non richiede la maggiore età.
      id: 'trasparenza-barriera-partiti-nuovi',
      campiNecessari: ['cittadinanza'],
      condizioni: [{ campo: 'cittadinanza', op: 'eq', valore: 'italiana' }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Effetto indiretto sul tuo diritto di fare politica insieme ad altri. Per presentarsi in almeno metà delle circoscrizioni, un partito dovrebbe produrre una relazione tecnica per ogni singola misura, due tabelle di costi e coperture in milioni di euro, gli obiettivi di indebitamento, avanzo primario e debito per cinque anni, e le ipotesi di crescita del PIL reale e del deflatore su cui si basano. Per un partito già strutturato, con i suoi tecnici, è lavoro di routine; per un movimento nuovo, nato dal basso e senza economisti, è un ostacolo in più per correre a livello nazionale. Il testo lo attenua: chi si presenta in meno di metà delle circoscrizioni è esonerato (e può presentare i conti per scelta), e le misure fino a 10 milioni di euro si possono stimare in blocco. È il rovescio della medaglia della trasparenza: alzare l\'asticella tecnica pesa di più su chi ha meno mezzi.',
        breve: 'Rovescio della trasparenza: quelle tabelle sono un ostacolo in più per un partito nuovo senza economisti.',
        direzione: 'misto',
        indiretto: true,
        dirittoToccato: {
          carta: 'Costituzione italiana',
          articolo: 'art. 49',
          diritto: 'diritto di associarsi liberamente in partiti per concorrere a determinare la politica nazionale',
          intensita: 'lieve',
          url: 'https://www.senato.it/istituzione/la-costituzione/parte-i/titolo-iv/articolo-49'
        }
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'Attenzione: questa è una lettura di REF-LEX, non il parere di un ente. Il DDL S. 550 è assegnato alla Commissione Affari costituzionali dal maggio 2023 ma non è mai stato esaminato, quindi non esistono audizioni, dossier del Servizio Studi o pareri ufficiali che lo valutino: nessuna istituzione ha sollevato questo punto, e nessuna lo ha escluso. L\'intensità è "lieve" e non di più perché il testo stesso esonera dall\'obbligo chi si presenta in meno di metà delle circoscrizioni e ammette stime aggregate per le misure fino a 10 milioni di euro.',
      fonteRegola: FONTE_ART49
    },
    {
      // chi non ha la cittadinanza italiana: alle politiche non vota. Unica differenziazione
      // reale di questa legge. NIENTE dirittoToccato: l'esclusione viene dall'art. 48 Cost.,
      // non da questo DDL, e addebitargliela sarebbe scorretto.
      id: 'trasparenza-chi-non-vota',
      campiNecessari: ['cittadinanza'],
      condizioni: [{ campo: 'cittadinanza', op: 'in', valore: ['ue', 'extra-ue'] }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Alle elezioni politiche italiane votano solo i cittadini italiani: lo dice l\'art. 48 della Costituzione, e questa proposta non tocca quella regola, né in meglio né in peggio. Quindi la trasparenza che introduce non arriva al tuo voto: i costi e le coperture dei programmi verrebbero pubblicati e valutati dall\'Ufficio parlamentare di bilancio, ma quella scheda nell\'urna non la metti tu. Restano però due cose vere. La prima: quei conti pubblici sono anche i tuoi, perché vivi qui, paghi le tasse qui, e le scelte su spesa e debito ricadono sui servizi che usi e sulle tasse che pagherai. La seconda: le valutazioni dell\'UPB sono pubbliche, quindi potresti leggerle comunque, anche senza votare. Se in futuro ottieni la cittadinanza italiana, la trasparenza varrebbe anche per il tuo voto.',
        breve: 'Alle politiche non voti, quindi non tocca il tuo voto; ma quei conti pubblici sono anche i tuoi.',
        direzione: 'neutro',
        indiretto: true
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'Proposta mai esaminata dal maggio 2023. L\'esclusione dal voto alle elezioni politiche non dipende da questo DDL: viene dall\'art. 48 della Costituzione, che riserva il voto ai cittadini. I cittadini UE residenti in Italia votano alle comunali e alle europee, ma non alle politiche; il permesso di soggiorno non cambia nulla, perché conta solo la cittadinanza.',
      fonteRegola: FONTE_ART48
    }
  ]
};
