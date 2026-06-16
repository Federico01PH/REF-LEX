import type { Legge } from '../../engine/types';

// Verificato da: DDL S. 1627, XIX Legislatura, "Disposizioni per il contrasto
// all'antisemitismo e per l'adozione della definizione operativa di antisemitismo",
// d'iniziativa del sen. Maurizio Gasparri (FI-BP-PPE), presentato il 6 agosto 2025.
// Scheda iter: https://www.senato.it/leggi-e-documenti/disegni-di-legge/scheda-ddl?did=59493
// Data verifica: 2026-06-16
//
// STATO REALE (non è legge): il 4 marzo 2026 il ddl 1627 è stato "assorbito" nel
// testo unificato S.1004 (Romeo, Pirovano, Bergesio), adottato come testo base dalla
// 1ª Commissione (Affari Costituzionali) insieme ad altri sei ddl (1575, 1722, 1757,
// 1762, 1765) ed esaminato in Assemblea. Il contenuto può ancora cambiare: la
// modelliamo come PROPOSTA IN DISCUSSIONE, sul testo del proponente (4 articoli).
//
// I 4 articoli del testo Gasparri:
// - Art. 1: l'Italia adotta INTEGRALMENTE la definizione operativa di antisemitismo
//   dell'IHRA (Bucarest, 26/5/2016); le istituzioni adottano misure di prevenzione e
//   repressione; la Conferenza unificata si riunisce ogni 2 anni per monitorare.
// - Art. 2: corsi di formazione per militari, magistrati, prefetti, forze di polizia,
//   docenti di scuola e università; "Guida pratica di lotta contro l'antisemitismo"
//   del Min. Interno; corsi annuali per gli studenti nelle scuole. Senza nuovi oneri.
// - Art. 3: regolamento per prevenzione/segnalazione di atti razzisti o antisemiti a
//   scuola e università; sanzioni disciplinari per il personale che viola i doveri
//   (art. 492 del d.lgs. 297/1994 per la scuola; art. 10 della l. 240/2010 per docenti
//   e ricercatori universitari).
// - Art. 4: modifica l'art. 604-bis del codice penale (la ex "legge Mancino"),
//   estendendo il reato di propaganda/istigazione/incitamento all'odio alle condotte
//   fondate sull'ostilità contro gli ebrei, sulla negazione della Shoah o del diritto
//   all'esistenza dello Stato di Israele; aggravante fino a metà pena se si usano
//   simboli; si applica la giustizia riparativa (capo II, titolo II, d.lgs. 150/2022).
//
// CONTROLLO ONESTO sull'art. 4: la 2ª Commissione (Giustizia) ha dato PARERE CONTRARIO
// all'emendamento che novella l'art. 604-bis, ritenendo la condotta punibile "generica,
// suscettibile di determinare una violazione dei principi di tassatività e
// determinatezza propri del precetto penale" (seduta del 25 febbraio 2026). Per questo
// l'effetto sulla libertà di espressione è modellato come reale ma controverso.

const FONTE_DDL = {
  etichetta: 'Scheda DDL S. 1627 (Senato della Repubblica)',
  url: 'https://www.senato.it/leggi-e-documenti/disegni-di-legge/scheda-ddl?did=59493'
};
const FONTE_IHRA = {
  etichetta: "Definizione operativa di antisemitismo dell'IHRA",
  url: 'https://holocaustremembrance.com/resources/working-definition-antisemitism'
};
const FONTE_PE = {
  etichetta: 'Risoluzione del Parlamento europeo del 1° giugno 2017 sulla lotta contro l\'antisemitismo (2017/2692(RSP))',
  url: 'https://www.europarl.europa.eu/doceo/document/TA-8-2017-0243_IT.html'
};
const FONTE_604BIS = {
  etichetta: 'Art. 604-bis del codice penale (Normattiva)',
  url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:regio.decreto:1930-10-19;1398'
};

export const ddlAntisemitismo: Legge = {
  id: 'ddl-antisemitismo-2025',
  titoloDivulgativo: 'Contrasto all\'antisemitismo: definizione IHRA, formazione e nuovo reato',
  titoloUfficiale: 'DDL S. 1627 (XIX Leg.) — Disposizioni per il contrasto all\'antisemitismo e per l\'adozione della definizione operativa di antisemitismo',
  stato: 'discussione',
  ambiti: ['diritti-salute', 'sicurezza-privacy', 'scuola-universita-ricerca'],
  fonti: [FONTE_DDL, FONTE_IHRA, FONTE_PE, FONTE_604BIS],
  verificataIl: '2026-06-16',
  riassunto: 'Una proposta del Senato (ddl 1627) per combattere l\'antisemitismo, cioè l\'odio verso gli ebrei. Fa adottare all\'Italia la definizione internazionale dell\'IHRA, prevede formazione per polizia, magistrati, militari e insegnanti, corsi nelle scuole e nuove sanzioni a scuola e università. Aggiunge un reato per la propaganda antisemita, il negazionismo della Shoah e la negazione del diritto di Israele a esistere. Non è ancora legge: è stata unita ad altre proposte (testo 1004) ed è in discussione.',
  regole: [
    {
      // effetto universale: il nuovo reato (art. 4) cambia il perimetro di ciò che è
      // penalmente rilevante per tutti. Indiretto e a doppio taglio: tutela una minoranza
      // ma comprime un margine di espressione (rischio di tassatività segnalato in Senato).
      id: 'ddl-anti-liberta-espressione',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 14 }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'La proposta aggiunge all\'art. 604-bis del codice penale (la ex "legge Mancino") un nuovo reato: la propaganda, l\'istigazione o l\'incitamento fondati sull\'ostilità verso gli ebrei, sulla negazione della Shoah o sulla negazione del diritto dello Stato di Israele a esistere. È previsto un aumento di pena fino alla metà se si usano simboli antisemiti. Da un lato è una tutela in più contro l\'odio; dall\'altro tocca la tua libertà di manifestare il pensiero. La stessa Commissione Giustizia del Senato ha avvertito che la formulazione è "generica" e rischia di violare i principi di tassatività e determinatezza penale: il confine tra criticare le scelte del governo israeliano (lecito) e negarne il diritto a esistere (reato) può risultare incerto e spingere all\'autocensura.',
        breve: 'Nuovo reato per propaganda antisemita e negazionismo: più tutela, ma anche più limiti a ciò che si può dire.',
        direzione: 'misto',
        indiretto: true,
        dirittoToccato: {
          carta: 'Costituzione italiana',
          articolo: 'art. 21',
          diritto: 'libertà di manifestazione del pensiero',
          intensita: 'sensibile',
          url: 'https://www.senato.it/istituzione/la-costituzione/parte-i/titolo-i/articolo-21'
        }
      },
      timeline: { anno1: 'incerto', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'probabile',
      noteConfidenza: 'Effetto valido SE la proposta diventa legge con questo testo. La libertà di espressione resta tutelata dall\'art. 21 Cost. e dall\'art. 10 CEDU. Intensità "sensibile" (non "grave") perché colpisce un perimetro definito di condotte d\'odio, non l\'opinione in sé; ma la Commissione Giustizia ha dato parere CONTRARIO alla novella per genericità (25/2/2026), quindi il testo può cambiare in Parlamento.',
      fonteRegola: FONTE_604BIS
    },
    {
      // beneficiario diretto: chi è di religione ebraica. Più strumenti per riconoscere
      // e perseguire gli atti antisemiti (art. 1 definizione + art. 2 formazione polizia).
      id: 'ddl-anti-tutela-ebrei',
      campiNecessari: ['religione'],
      condizioni: [{ campo: 'religione', op: 'eq', valore: 'ebraica' }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'La proposta è pensata soprattutto per proteggere chi, come te, è di religione ebraica. Adottare la definizione IHRA dà a giudici e forze dell\'ordine un criterio chiaro per riconoscere un atto antisemita; le forze di polizia ricevono formazione apposita e una "Guida pratica" del Ministero dell\'Interno per scrivere correttamente le denunce; la Conferenza unificata monitora il fenomeno ogni due anni. In concreto: più possibilità che un\'offesa o un\'aggressione antisemita, anche verso i luoghi di culto o le istituzioni della comunità, venga riconosciuta e perseguita. Quanto sia efficace dipenderà da come la legge verrà applicata.',
        breve: 'Più tutela contro gli atti antisemiti: definizione chiara, polizia formata, monitoraggio ogni due anni.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'incerto', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'probabile',
      noteConfidenza: 'La definizione IHRA protegge dalle manifestazioni di antisemitismo dirette "verso le persone ebree o non ebree, i loro beni, le istituzioni delle comunità ebraiche e i loro luoghi di culto". Effetto condizionato all\'approvazione e all\'effettiva attuazione (i corsi sono previsti "nei limiti delle risorse disponibili").',
      fonteRegola: FONTE_IHRA
    },
    {
      // studenti: art. 2 c.2 (corsi annuali nelle scuole) + misure di prevenzione a scuola/università.
      id: 'ddl-anti-studenti',
      campiNecessari: ['condizioneLavorativa'],
      condizioni: [{ campo: 'condizioneLavorativa', op: 'in', valore: ['studente'] }],
      effetto: {
        tipo: 'servizio',
        descrizione: 'Se sei a scuola, le scuole di ogni ordine e grado attiveranno corsi annuali per gli studenti, per favorire il dialogo tra generazioni, culture e religioni diverse e per contrastare l\'antisemitismo (incluso l\'antisionismo). Nelle università sono previste misure di prevenzione e segnalazione degli atti razzisti o antisemiti. Per te significa più ore dedicate a questi temi e ambienti scolastici e universitari in cui gli episodi di odio dovrebbero essere intercettati prima.',
        breve: 'Corsi annui a scuola contro l\'antisemitismo e per il dialogo tra culture; misure anche all\'università.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'incerto', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'probabile',
      noteConfidenza: '"Studente" qui copre sia la scuola sia l\'università: i corsi annuali riguardano le scuole (art. 2, comma 2), mentre per le università valgono le misure di prevenzione e segnalazione dell\'art. 3. Effetto condizionato all\'approvazione del ddl.',
      fonteRegola: FONTE_DDL
    },
    {
      // dipendenti pubblici interessati: scuola, università, polizia, magistratura, difesa,
      // prefetture. Formazione obbligatoria (art. 2) e, per scuola/università, nuovo dovere
      // di prevenzione e segnalazione con sanzioni disciplinari (art. 3). 'dipende' perché
      // l'effetto vale solo per alcuni ruoli pubblici, non per tutti.
      id: 'ddl-anti-personale-pubblico',
      campiNecessari: ['condizioneLavorativa'],
      condizioni: [{ campo: 'condizioneLavorativa', op: 'in', valore: ['dipendente-pubblico'] }],
      effetto: {
        tipo: 'dovere',
        descrizione: 'Se lavori nella scuola, nell\'università, nelle forze di polizia, nella magistratura, nella difesa o nelle prefetture, sei tra le categorie coinvolte: sono previsti corsi di formazione obbligatori sulla cultura ebraica e sull\'analisi dei casi di antisemitismo (per la polizia anche sulla corretta redazione delle denunce). In più, per il personale di scuola e università nasce un dovere specifico di prevenire e segnalare tempestivamente gli atti razzisti o antisemiti: chi lo viola rischia sanzioni disciplinari (art. 492 del testo unico scuola per il personale scolastico; art. 10 della legge 240/2010 per docenti e ricercatori universitari). Per gli altri ruoli pubblici, invece, cambia poco o nulla.',
        breve: 'Formazione obbligatoria; a scuola e università nuovo obbligo di segnalare gli atti antisemiti, con sanzioni.',
        direzione: 'misto',
        indiretto: true
      },
      timeline: { anno1: 'incerto', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'dipende',
      noteConfidenza: 'L\'effetto dipende dal ruolo: riguarda chi lavora nella scuola, nell\'università, nelle forze di polizia, nella magistratura, nella difesa o nelle prefetture. Un dipendente pubblico con altre mansioni non è toccato direttamente. Effetto condizionato all\'approvazione del ddl.',
      fonteRegola: FONTE_DDL
    }
  ]
};
