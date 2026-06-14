import type { Legge } from '../../engine/types';

// Verified from: DECRETO-LEGGE 12 giugno 2026, n. 100 (GU n. 134 del 12/6/2026, 26G00119,
// in vigore dal 12/6/2026), letto su Normattiva il 2026-06-15.
// "Misure urgenti in materia di giustizia e per l'attuazione del Patto dell'Unione europea
// sulla migrazione e l'asilo del 14 maggio 2024." Tre Capi:
//
// Capo I (giustizia): Art. 1 riscrive l'esame di Stato per avvocato — sessione unica annuale,
//   due prove scritte (parere + atto, su materia scelta tra civile/penale/amministrativo, in
//   presenza, solo codici annotati, niente strumenti elettronici) + prova orale; soglie di
//   punteggio definite; tassa d'esame 62 EUR; strumenti compensativi e tempi più lunghi per
//   i candidati con DSA; abrogati gli artt. 46, 47, 49 della L. 247/2012. Si applica dalla
//   prima sessione dopo l'entrata in vigore. (Il Capo I contiene anche norme su GIP collegiale,
//   digitalizzazione della giustizia, responsabilità dei notai, equa riparazione L. 89/2001:
//   non toccano i campi del profilo, quindi non sono modellate.)
//
// Capo II (migrazione/asilo): attua i Regolamenti UE 2024/1348 (procedura comune di asilo),
//   2024/1349 (rimpatrio alla frontiera), 2024/1356 (accertamenti/screening alle frontiere
//   esterne), 2024/1358 (Eurodac, confronto dati biometrici) e la Direttiva UE 2024/1346
//   (accoglienza). Punti chiave: procedura di asilo ALLA FRONTIERA obbligatoria (art. 45 Reg.
//   2024/1348) da concludere entro un massimo di 12 settimane (art. 51); il richiedente può
//   essere autorizzato a risiedere solo in un luogo specifico (art. 9 Dir. 2024/1346);
//   designazione delle autorità nazionali competenti. Dalla stampa istituzionale e dal quadro
//   UE: screening alle frontiere fino a 7 giorni, procedura accelerata per chi proviene da
//   Paesi sicuri o con tasso di riconoscimento sotto il 20% o con documenti falsi.
//
// È un DECRETO-LEGGE: in vigore subito, ma da convertire entro ~60 giorni (entro ~agosto 2026),
// e può essere modificato in conversione → confidenza "probabile". Le norme migrazione/asilo
// recepiscono regolamenti UE direttamente applicabili: struttura stabile, timeline attiva.
// TONO NEUTRO: REF-LEX segnala cosa cambia e quali diritti tocca, non dice se è giusto o no.

const FONTE = {
  etichetta: 'DL 12 giugno 2026, n. 100 (Normattiva)',
  url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legge:2026-06-12;100'
};
const FONTE_GU = {
  etichetta: 'Gazzetta Ufficiale — DL 100/2026 (GU n. 134 del 12/6/2026)',
  url: 'https://www.gazzettaufficiale.it/eli/id/2026/06/12/26G00119/sg'
};
const FONTE_SENATO = {
  etichetta: 'Senato della Repubblica — DDL di conversione del DL 100/2026',
  url: 'https://dati.senato.it/ddl/60214'
};

const ART10_COST = 'https://www.senato.it/istituzione/la-costituzione/principi-fondamentali/articolo-10';
const CARTA_UE = 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:12012P/TXT';

export const dlMigrazioneAsilo: Legge = {
  id: 'dl-migrazione-asilo-2026',
  titoloDivulgativo: 'Decreto giustizia e migrazione: asilo alla frontiera e nuovo esame da avvocato',
  titoloUfficiale: 'Decreto-legge 12 giugno 2026, n. 100 — Misure urgenti in materia di giustizia e per l\'attuazione del Patto dell\'Unione europea sulla migrazione e l\'asilo del 14 maggio 2024',
  stato: 'vigore',
  ambiti: ['sicurezza-privacy', 'scuola-universita-ricerca'],
  fonti: [FONTE, FONTE_GU, FONTE_SENATO],
  verificataIl: '2026-06-15',
  riassunto: 'Un decreto-legge in vigore dal 12 giugno 2026 che fa due cose diverse. Sul fronte migrazione attua il Patto europeo su migrazione e asilo: procedure di asilo accelerate alla frontiera (massimo 12 settimane), controlli e identificazione all\'arrivo, banca dati europea Eurodac con impronte e foto. Sul fronte giustizia cambia l\'esame di Stato per diventare avvocato: una sola sessione l\'anno, due prove scritte e un orale. È un decreto-legge: per restare in vigore va convertito in legge dal Parlamento entro circa due mesi.',
  regole: [
    {
      id: 'dl100-procedura-frontiera',
      campiNecessari: ['cittadinanza'],
      condizioni: [{ campo: 'cittadinanza', op: 'eq', valore: 'extra-ue' }],
      effetto: {
        tipo: 'servizio',
        descrizione: 'Se sei (o se in futuro fossi) un cittadino extra-UE che chiede asilo in Italia, cambia la procedura: per molti casi la domanda viene esaminata direttamente alla frontiera, con una decisione più rapida (entro 12 settimane al massimo) e con un primo controllo di identificazione all\'arrivo. Durante la procedura ti può essere chiesto di restare in un luogo specifico. Più veloce, ma con più vincoli su dove stai mentre aspetti la risposta.',
        direzione: 'misto'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'probabile',
      noteConfidenza: 'Attua i Regolamenti UE 2024/1348 e 2024/1356. La procedura di frontiera si applica soprattutto a chi proviene da Paesi considerati sicuri o con basso tasso di riconoscimento della protezione, o in caso di documenti falsi. È un decreto-legge da convertire entro circa due mesi: alcuni dettagli possono cambiare.',
      fonteRegola: FONTE
    },
    {
      id: 'dl100-asilo-diritto',
      campiNecessari: ['cittadinanza'],
      condizioni: [{ campo: 'cittadinanza', op: 'eq', valore: 'extra-ue' }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Effetto indiretto sul diritto d\'asilo: decisioni più rapide alla frontiera, con la possibilità di doverti trattenere in un luogo determinato durante l\'esame, comprimono i tempi e i margini per preparare la tua domanda e per fare ricorso. Per chi lo sostiene è un modo per gestire meglio gli arrivi; per chi lo critica è il rischio che la protezione di chi fugge davvero diventi più difficile da ottenere.',
        direzione: 'negativo',
        indiretto: true,
        dirittoToccato: {
          carta: 'Costituzione italiana',
          articolo: 'art. 10',
          diritto: 'diritto d\'asilo per chi fugge da Paesi non liberi',
          intensita: 'sensibile',
          url: ART10_COST
        }
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'probabile',
      noteConfidenza: 'Il diritto d\'asilo resta garantito dall\'art. 10 della Costituzione, dalla Convenzione di Ginevra e dal diritto UE, con possibilità di ricorso al giudice. Intensità "sensibile": cambiano tempi e modalità della procedura, non l\'esistenza del diritto. Decreto-legge da convertire.',
      fonteRegola: FONTE
    },
    {
      id: 'dl100-eurodac-dati',
      campiNecessari: ['cittadinanza'],
      condizioni: [{ campo: 'cittadinanza', op: 'eq', valore: 'extra-ue' }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Effetto indiretto sui tuoi dati: il decreto attiva il nuovo Eurodac, la banca dati europea che raccoglie dati biometrici (impronte digitali e immagine del volto) di chi chiede asilo o si trova in posizione irregolare. Questi dati possono essere confrontati anche dalle forze di polizia e da Europol. Più strumenti di identificazione e controllo, ma anche una traccia biometrica di te conservata e condivisa tra più Paesi.',
        direzione: 'misto',
        indiretto: true,
        dirittoToccato: {
          carta: 'Carta UE dei diritti fondamentali',
          articolo: 'art. 8',
          diritto: 'protezione dei dati personali',
          intensita: 'sensibile',
          url: CARTA_UE
        }
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'probabile',
      noteConfidenza: 'Attua il Regolamento UE 2024/1358 (Eurodac). I dati biometrici restano soggetti al GDPR e alle garanzie UE, con limiti d\'uso e tempi di conservazione. Intensità "sensibile" perché si tratta di dati biometrici accessibili anche a fini di contrasto. Decreto-legge da convertire.',
      fonteRegola: FONTE
    },
    {
      id: 'dl100-esame-avvocato',
      campiNecessari: ['titoloStudio'],
      condizioni: [{ campo: 'titoloStudio', op: 'eq', valore: 'laurea' }],
      effetto: {
        tipo: 'servizio',
        descrizione: 'Se sei laureato in giurisprudenza e punti a diventare avvocato, cambia l\'esame di Stato: una sola sessione all\'anno, due prove scritte (un parere e un atto, su una materia che scegli tra civile, penale e amministrativo) da svolgere in presenza con i soli codici annotati e senza strumenti elettronici, più una prova orale. La tassa d\'esame è di 62 euro; per chi ha un disturbo specifico dell\'apprendimento sono previsti strumenti e tempi aggiuntivi.',
        direzione: 'misto'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'dipende',
      noteConfidenza: 'Vale solo se sei laureato in giurisprudenza e intendi sostenere l\'esame di abilitazione forense: un dato che non ti chiediamo, per questo la mostriamo a chi ha una laurea. Le nuove regole (art. 1 del decreto) si applicano dalla prima sessione dopo l\'entrata in vigore e abrogano gli artt. 46, 47 e 49 della L. 247/2012. Decreto-legge da convertire.',
      fonteRegola: FONTE
    }
  ]
};
