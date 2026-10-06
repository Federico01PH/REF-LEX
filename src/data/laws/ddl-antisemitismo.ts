import type { Legge } from '../../engine/types';

// Verificato da: proposta di legge A.C. 2830, "Disposizioni per il contrasto all'antisemitismo
// e per l'adozione della definizione operativa di antisemitismo", d'iniziativa dei senatori
// Romeo, Pirovano, Bergesio, APPROVATA DAL SENATO il 4 marzo 2026 (S. 1004: 105 sì, 24 no,
// 21 astenuti) e trasmessa alla Camera il 5 marzo 2026.
// Testo: documenti.camera.it, leg.19.pdl.camera.2830.19PDL0185570.pdf (5 articoli).
// Dossier del Servizio Studi della Camera n. 603/1 del 1/10/2026 (AC0477a).
// Data verifica: 2026-10-06.
//
// CORREZIONE RISPETTO ALLA SCHEDA DI GIUGNO: allora avevamo modellato il ddl Gasparri S. 1627
// (nuovo reato nell'art. 604-bis c.p., sanzioni disciplinari a scuola e università). Il 4 marzo
// il Senato ha approvato invece il testo S. 1004, che ha ASSORBITO il 1627 e altri cinque ddl:
// nel testo approvato NON c'è nessun nuovo reato, nessuna sanzione, nessun divieto di riunione.
//
// STATO AL 6/10/2026: alla Camera la I Commissione ha adottato il testo del Senato come testo
// base (22/7/2026) e ha chiuso l'esame SENZA modifiche (30/9/2026); discussione generale in
// Aula dal 2/10/2026. Manca il voto finale: se passa così com'è, diventa legge. Non è ancora
// legge, quindi stato "discussione" e confidenza mai "certa".
//
// I 5 articoli:
// - Art. 1: la Repubblica ripudia l'antisemitismo "ferme restando la libertà di critica politica
//   e di espressione del pensiero e la libertà di riunione e di associazione"; adotta la
//   definizione operativa IHRA del 26/5/2016 "ivi inclusi i relativi indicatori" (gli esempi,
//   tra cui alcuni su Israele) ai fini dell'applicazione della legge.
// - Art. 2: Strategia nazionale triennale adottata dal Consiglio dei ministri; tra i fini,
//   "adeguate misure di sicurezza alle comunità ebraiche e ai loro luoghi di aggregazione".
// - Art. 3: linee d'azione — banca dati delle Forze di polizia (art. 8 l. 121/1981) usata anche
//   per monitorare gli episodi; misure contro l'odio antisemita online sentita l'AGCOM; azioni
//   formative per docenti e attività per gli studenti, anche nel Giorno della Memoria, e
//   comunicazione delle azioni delle scuole al tavolo tecnico della l. 71/2017 e al Coordinatore;
//   università: ricerca, seminari, misure di prevenzione/monitoraggio/contrasto, eventuale
//   referente interno; formazione per Forze armate, Forze dell'ordine, prefetti e magistratura;
//   campagne sul servizio pubblico radiotelevisivo; formazione nello sport e nelle associazioni.
// - Art. 4: Coordinatore nazionale presso la Presidenza del Consiglio + Gruppo tecnico di
//   lavoro (anche UCEI e Unione giovani ebrei d'Italia).
// - Art. 5: invarianza finanziaria, nessuna spesa nuova.

const FONTE_ITER = {
  etichetta: 'Camera dei deputati - A.C. 2830, scheda e iter',
  url: 'https://www.camera.it/leg19/126?idDocumento=2830&leg=19'
};
const FONTE_TESTO = {
  etichetta: 'Camera dei deputati - A.C. 2830, testo approvato dal Senato il 4 marzo 2026',
  url: 'https://documenti.camera.it/leg19/pdl/pdf/leg.19.pdl.camera.2830.19PDL0185570.pdf'
};
const FONTE_DOSSIER = {
  etichetta: 'Camera dei deputati - Servizio Studi, dossier n. 603/1 del 1/10/2026',
  url: 'https://documenti.camera.it/leg19/dossier/Pdf/AC0477a.pdf'
};
const FONTE_SENATO = {
  etichetta: 'Senato della Repubblica - Scheda DDL S. 1004',
  url: 'https://www.senato.it/leggi-e-documenti/disegni-di-legge/scheda-ddl?did=57902'
};
const FONTE_IHRA = {
  etichetta: "Definizione operativa di antisemitismo dell'IHRA",
  url: 'https://holocaustremembrance.com/resources/working-definition-antisemitism'
};

const NOTA_VOTO_FINALE = 'Il testo è quello approvato dal Senato il 4 marzo 2026; la Commissione della Camera non l\'ha cambiato e manca solo il voto finale dell\'Aula.';
// se la legge passa, gli strumenti (Strategia, Coordinatore) richiedono tempo per partire
const DAL_SECONDO_ANNO = { anno1: 'incerto', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' } as const;

export const ddlAntisemitismo: Legge = {
  id: 'ddl-antisemitismo-2025',
  titoloDivulgativo: 'Contrasto all\'antisemitismo: definizione IHRA, Strategia nazionale e formazione',
  titoloUfficiale: 'Proposta di legge A.C. 2830 (S. 1004, Romeo e altri), approvata dal Senato — Disposizioni per il contrasto all\'antisemitismo e per l\'adozione della definizione operativa di antisemitismo',
  stato: 'discussione',
  ambiti: ['diritti-salute', 'sicurezza-privacy', 'scuola-universita-ricerca'],
  fonti: [FONTE_ITER, FONTE_TESTO, FONTE_DOSSIER, FONTE_SENATO, FONTE_IHRA],
  verificataIl: '2026-10-06',
  riassunto: 'La legge contro l\'antisemitismo, cioè l\'odio verso gli ebrei. Il Senato l\'ha approvata il 4 marzo 2026; la Camera l\'ha esaminata senza cambiarla e manca solo il suo voto finale. Adotta la definizione di antisemitismo dell\'IHRA, crea una Strategia nazionale ogni tre anni e un Coordinatore, e promuove formazione per forze dell\'ordine, magistrati e insegnanti, attività a scuola e misure contro l\'odio online. Non crea nuovi reati e non stanzia soldi nuovi.',
  regole: [
    {
      // effetto indiretto su tutti: niente reati, ma la definizione IHRA "con i relativi
      // indicatori" guida monitoraggio, misure online, università e campagne. Dai 14 anni:
      // in Italia è l'età da cui si può aprire da soli un profilo social.
      id: 'ddl-anti-liberta-espressione',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 14 }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Questa legge non crea nuovi reati e non prevede multe: quello che oggi puoi dire resta lecito. Però adotta la definizione di antisemitismo dell\'IHRA "con i relativi indicatori", cioè con una lista di esempi che comprende anche alcuni modi di parlare di Israele, come applicargli "due pesi e due misure" o paragonare la sua politica a quella dei nazisti. Questa definizione guiderà il monitoraggio degli episodi nella banca dati delle forze di polizia, le misure contro l\'odio online decise sentita l\'Autorità per le comunicazioni, le misure delle università e le campagne del servizio pubblico. La legge stessa dice che restano ferme la libertà di critica politica, di espressione, di riunione e di associazione. Ma nei casi dubbi il confine tra criticare lo Stato di Israele e l\'antisemitismo lo tracceranno le persone che applicano la definizione, e questo può spingere qualcuno a parlare con più cautela.',
        breve: 'Nessun nuovo reato, ma la definizione IHRA, con esempi su Israele, guiderà monitoraggi e controlli online.',
        direzione: 'misto',
        indiretto: true,
        dirittoToccato: {
          carta: 'Costituzione italiana',
          articolo: 'art. 21',
          diritto: 'libertà di manifestazione del pensiero',
          intensita: 'lieve',
          url: 'https://www.senato.it/istituzione/la-costituzione/parte-i/titolo-i/articolo-21'
        }
      },
      timeline: DAL_SECONDO_ANNO,
      confidenza: 'probabile',
      noteConfidenza: `Intensità "lieve": a giugno era "sensibile" perché la proposta del sen. Gasparri (S. 1627) aggiungeva un reato all'art. 604-bis del codice penale; quel reato nel testo approvato dal Senato non c'è. L'IHRA stessa definisce la sua definizione "non giuridicamente vincolante", e il dossier della Camera ricorda un'alternativa proposta da studiosi nel 2021, la Dichiarazione di Gerusalemme. La legge sulla banca dati delle forze di polizia (l. 121/1981, art. 7) vieta di raccogliere dati su una persona solo per la sua opinione politica o la sua fede. ${NOTA_VOTO_FINALE}`,
      fonteRegola: FONTE_DOSSIER
    },
    {
      // beneficiario diretto: chi è di religione ebraica (artt. 2, 3 e 4)
      id: 'ddl-anti-tutela-ebrei',
      campiNecessari: ['religione'],
      condizioni: [{ campo: 'religione', op: 'eq', valore: 'ebraica' }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'La legge è pensata per proteggere chi, come te, è di religione ebraica. Il Governo dovrà adottare ogni tre anni una Strategia nazionale contro l\'antisemitismo, preparata dal Coordinatore nazionale presso la Presidenza del Consiglio con un gruppo di lavoro di cui fanno parte anche l\'Unione delle comunità ebraiche italiane e l\'Unione giovani ebrei d\'Italia. Tra gli obiettivi ci sono misure di sicurezza adeguate per le comunità ebraiche e i loro luoghi di ritrovo, il monitoraggio degli episodi nella banca dati delle forze di polizia, la formazione di forze dell\'ordine e magistrati e la conoscenza della storia e della cultura ebraica. In concreto: più possibilità che un\'offesa o un\'aggressione antisemita venga riconosciuta e contata. La legge però non stanzia soldi nuovi: tutto si fa con le risorse che ci sono già.',
        breve: 'Più tutela: Strategia nazionale ogni tre anni, sicurezza per le comunità, episodi monitorati dalla polizia.',
        direzione: 'positivo'
      },
      timeline: DAL_SECONDO_ANNO,
      confidenza: 'probabile',
      noteConfidenza: `La definizione IHRA protegge dalle manifestazioni di odio "dirette verso le persone ebree e non ebree, i loro beni, le istituzioni della comunità e i luoghi di culto ebraici". Con la clausola di invarianza finanziaria (art. 5) quanto la legge funzionerà dipende dalle risorse che le amministrazioni useranno. ${NOTA_VOTO_FINALE}`,
      fonteRegola: FONTE_TESTO
    },
    {
      // studenti: art. 3, lett. c (scuola) e lett. d (università)
      id: 'ddl-anti-studenti',
      campiNecessari: ['condizioneLavorativa'],
      condizioni: [{ campo: 'condizioneLavorativa', op: 'in', valore: ['studente'] }],
      effetto: {
        tipo: 'servizio',
        descrizione: 'Se vai a scuola, la legge promuove attività sull\'antisemitismo e sulla storia della diaspora ebraica, anche in occasione del Giorno della Memoria (27 gennaio), per favorire il dialogo tra generazioni, culture e religioni diverse. Ogni scuola ha già un tavolo contro il bullismo e il cyberbullismo: dovrà comunicare cosa fa contro gli episodi di antisemitismo. Se sei all\'università, l\'ateneo dovrà adottare misure per prevenire, monitorare e contrastare gli atti antisemiti, e potrà nominare una persona che se ne occupa; sono previsti anche ricerche e seminari sul rispetto reciproco.',
        breve: 'A scuola più attività sull\'antisemitismo e sul Giorno della Memoria; all\'università misure di prevenzione.',
        direzione: 'positivo'
      },
      timeline: DAL_SECONDO_ANNO,
      confidenza: 'dipende',
      noteConfidenza: `Dipende dalla tua scuola o università: le attività si fanno "nel rispetto dell'autonomia delle istituzioni scolastiche" e con le risorse già disponibili, quindi non sono garantite allo stesso modo ovunque. ${NOTA_VOTO_FINALE}`,
      fonteRegola: FONTE_TESTO
    },
    {
      // art. 3, lett. a ed e: formazione per Forze armate e Forze dell'ordine (anche prefetti
      // e magistratura, che il classificatore dei mestieri non distingue) + banca dati
      id: 'ddl-anti-forze-ordine',
      campiNecessari: ['settoriProfessionali'],
      condizioni: [{ campo: 'settoriProfessionali', op: 'in', valore: ['forze-ordine'] }],
      effetto: {
        tipo: 'dovere',
        descrizione: 'Se lavori nelle forze dell\'ordine o nelle forze armate, la Strategia nazionale prevede iniziative di formazione e aggiornamento sull\'antisemitismo (le stesse valgono per prefetti e magistrati). La banca dati delle forze di polizia sarà usata anche per monitorare gli episodi di antisemitismo, letti con la definizione dell\'IHRA, per avere un quadro completo del fenomeno in Italia.',
        breve: 'Formazione sull\'antisemitismo per forze dell\'ordine e armate; episodi monitorati nella banca dati della polizia.',
        direzione: 'neutro'
      },
      timeline: DAL_SECONDO_ANNO,
      confidenza: 'dipende',
      noteConfidenza: `La formazione è "promossa" con le risorse già esistenti: quanta ne farai dipende dal tuo corpo e dal tuo ruolo. ${NOTA_VOTO_FINALE}`,
      fonteRegola: FONTE_TESTO
    },
    {
      // art. 3, lett. c (docenti) e lett. d (università)
      id: 'ddl-anti-docenti',
      campiNecessari: ['settoriProfessionali'],
      condizioni: [{ campo: 'settoriProfessionali', op: 'in', valore: ['scuola'] }],
      effetto: {
        tipo: 'dovere',
        descrizione: 'Se insegni, la legge promuove corsi di formazione per i docenti sull\'antisemitismo e sulla diaspora ebraica, anche per preparare le attività con gli studenti nel Giorno della Memoria. La tua scuola, dopo gli episodi emersi dal tavolo che già controlla bullismo e cyberbullismo, dovrà comunicare le azioni fatte al tavolo tecnico nazionale e al Coordinatore nazionale per la lotta contro l\'antisemitismo. Se lavori all\'università, l\'ateneo adotterà misure di prevenzione e monitoraggio degli atti antisemiti, secondo il suo codice etico.',
        breve: 'Formazione per i docenti; la scuola comunica al Coordinatore nazionale cosa fa contro gli episodi antisemiti.',
        direzione: 'neutro'
      },
      timeline: DAL_SECONDO_ANNO,
      confidenza: 'dipende',
      noteConfidenza: `Nessuna sanzione per i docenti: c'era nella proposta del sen. Gasparri, non nel testo approvato dal Senato. I corsi si fanno "nel rispetto dell'autonomia delle istituzioni scolastiche" e con le risorse esistenti. ${NOTA_VOTO_FINALE}`,
      fonteRegola: FONTE_TESTO
    }
  ]
};
