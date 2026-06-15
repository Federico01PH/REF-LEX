import type { Legge } from '../../engine/types';

// Verified from: DL 30 aprile 2026, n. 62 (GU n. 99 del 30/4/2026, in vigore dal 1/5/2026),
// c.d. "Decreto Primo Maggio" / "salario giusto". 17 articoli, 4 Capi, ~934 milioni.
// Fonti consultate il 13/06/2026: Normattiva, Gazzetta Ufficiale, dirittobancario.it
// (salario giusto = art. 7), lavorosi.it e assistal.it (importi bonus e regole piattaforme).
//
// Tre assi:
// 1) Bonus assunzioni 2026 (esonero contributivo, va al DATORE, non in busta al lavoratore):
//    - giovani under 35 a tempo indeterminato: esonero 100% fino a 500 EUR/mese, 24 mesi
//      (650 EUR/mese nelle regioni del Sud); serve incremento occupazionale netto e niente
//      licenziamenti precedenti;
//    - donne disoccupate da 24+ mesi o svantaggiate: esonero fino a 650 EUR/mese, 24 mesi
//      (800 EUR/mese nelle ZES del Sud);
//    - stabilizzazione under 35 (tempo determinato -> indeterminato, ago-dic 2026): 500 EUR/mese, 24 mesi;
//    - ZES Sud, aziende <=10 dipendenti che assumono over 35 disoccupati di lungo periodo: 650 EUR/mese.
// 2) "Salario giusto" (art. 7): la contrattazione collettiva determina il trattamento economico
//    complessivo (TEC) adeguato; un CCNL diverso non puo' essere inferiore al TEC del CCNL di
//    riferimento (c.3); l'accesso ai bonus richiede TEC individuale non inferiore (c.5). NON e'
//    un minimo orario di legge: e' un aggancio ai CCNL fatto valere tramite gli incentivi.
// 3) Lavoro su piattaforme digitali / "caporalato digitale": presunzione di subordinazione quando
//    c'e' controllo algoritmico; trasparenza sulle decisioni automatizzate; formazione sicurezza
//    entro 30 giorni; account con SPID/CIE; conservazione obbligatoria per 5 anni di accessi,
//    assegnazioni, rifiuti e compensi (qui l'effetto indiretto sui dati).
//
// E' un decreto-legge: in vigore subito, ma da convertire entro ~60 giorni (fine giugno 2026).
// Per questo le regole sono "probabile" (puo' essere modificato in conversione) e i bonus 2026
// si spengono dopo i 24 mesi (attivo anno1-anno2, poi nullo).

const FONTE = {
  etichetta: 'DL 30 aprile 2026, n. 62 - Decreto Lavoro "salario giusto" (Normattiva)',
  url: 'https://www.normattiva.it/eli/id/2026/04/30/26G00082/ORIGINAL'
};
const FONTE_GU = {
  etichetta: 'Gazzetta Ufficiale - DL 62/2026 (testo pubblicato)',
  url: 'https://www.gazzettaufficiale.it/eli/id/2026/04/30/26G00082/sg'
};
const FONTE_SALARIO = {
  etichetta: 'Diritto Bancario - il salario giusto (art. 7) nel Decreto Lavoro 2026',
  url: 'https://www.dirittobancario.it/art/il-salario-giusto-per-lavoratori-dipendenti-nel-nuovo-decreto-lavoro/'
};

export const decretoLavoro: Legge = {
  id: 'decreto-lavoro-2026',
  titoloDivulgativo: 'Decreto Lavoro "salario giusto": bonus assunzioni e tutele per chi lavora con le app',
  titoloUfficiale: 'Decreto-legge 30 aprile 2026, n. 62 - Disposizioni urgenti in materia di salario giusto, di incentivi all\'occupazione e di contrasto del caporalato digitale',
  meseAnno: 'aprile 2026',
  stato: 'vigore',
  ambiti: ['fisco-lavoro'],
  fonti: [FONTE, FONTE_GU, FONTE_SALARIO],
  verificataIl: '2026-06-13',
  riassunto: 'Un decreto in vigore dal 1° maggio 2026 su lavoro e stipendi. Chi assume a tempo indeterminato giovani under 35 o donne disoccupate non paga i contributi per due anni (di più al Sud). Introduce il "salario giusto": per avere quei bonus l\'azienda deve pagarti almeno quanto previsto dal contratto collettivo del settore. Per chi lavora con le app (rider e simili) arrivano più tutele, ma anche più controllo da parte degli algoritmi. È un decreto-legge: va convertito entro fine giugno 2026.',
  regole: [
    {
      id: 'lavoro-bonus-giovani',
      campiNecessari: ['eta', 'condizioneLavorativa'],
      condizioni: [
        { campo: 'eta', op: 'alPiu', valore: 35 },
        { campo: 'condizioneLavorativa', op: 'in', valore: ['disoccupato', 'studente'] }
      ],
      effetto: {
        tipo: 'qualita-vita',
        descrizione: 'Hai meno di 35 anni e cerchi lavoro: chi ti assume a tempo indeterminato non paga i contributi (esonero fino a 500 euro al mese per 24 mesi, 650 al Sud). Non sono soldi in busta paga per te, ma ti rendono molto più conveniente da assumere stabilmente.',
        breve: 'Under 35 in cerca di lavoro: chi ti assume stabile non paga i contributi, così sei più conveniente da assumere.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'nullo', anno10: 'nullo' },
      confidenza: 'probabile',
      noteConfidenza: 'L\'esonero va al datore di lavoro, non a te, e l\'azienda lo ottiene solo con un incremento netto di occupati e senza licenziamenti recenti. È un bonus del 2026 (dura 24 mesi, poi finisce). Essendo un decreto-legge da convertire entro fine giugno 2026, alcuni dettagli possono cambiare.',
      fonteRegola: FONTE
    },
    {
      id: 'lavoro-bonus-donne',
      campiNecessari: ['genere', 'condizioneLavorativa'],
      condizioni: [
        { campo: 'genere', op: 'eq', valore: 'donna' },
        { campo: 'condizioneLavorativa', op: 'in', valore: ['disoccupato'] }
      ],
      effetto: {
        tipo: 'qualita-vita',
        descrizione: 'Sei una donna in cerca di lavoro: se sei disoccupata da molto tempo o in una categoria svantaggiata, chi ti assume ha l\'esonero totale dei contributi fino a 650 euro al mese per 24 mesi (800 nelle Zone Economiche Speciali del Sud). Un incentivo pensato per farti assumere prima.',
        breve: 'Donna in cerca di lavoro: chi ti assume ha l\'esonero totale dei contributi, un incentivo per farti assumere prima.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'nullo', anno10: 'nullo' },
      confidenza: 'probabile',
      noteConfidenza: 'Il beneficio è dell\'azienda, non tuo, e l\'importo massimo vale soprattutto per chi è disoccupata da 24 mesi o più o rientra nelle categorie svantaggiate. Bonus 2026 valido 24 mesi. Decreto-legge da convertire entro fine giugno 2026.',
      fonteRegola: FONTE
    },
    {
      id: 'lavoro-salario-giusto',
      campiNecessari: ['condizioneLavorativa'],
      condizioni: [{ campo: 'condizioneLavorativa', op: 'in', valore: ['dipendente-privato'] }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Arriva il principio del "salario giusto": per ottenere i bonus, la tua azienda deve pagarti almeno quanto prevede il contratto collettivo del tuo settore (il trattamento economico complessivo). I contratti "pirata" che pagano meno perdono gli incentivi: una spinta verso stipendi più equi, soprattutto se oggi sei sotto i minimi dei contratti maggiori.',
        breve: '"Salario giusto": per avere i bonus l\'azienda deve pagarti almeno il contratto del settore, stop ai contratti pirata.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'probabile',
      noteConfidenza: 'Art. 7 del decreto. Attenzione: NON è un salario minimo orario fissato per legge. È un aggancio ai contratti collettivi dei sindacati più rappresentativi, fatto rispettare togliendo gli incentivi a chi paga meno. Se il tuo contratto è già in linea con il CCNL del settore, cambia poco. Decreto da convertire entro fine giugno 2026.',
      fonteRegola: FONTE_SALARIO
    },
    {
      id: 'lavoro-piattaforme-tutele',
      campiNecessari: ['condizioneLavorativa'],
      condizioni: [{ campo: 'condizioneLavorativa', op: 'in', valore: ['autonomo-ordinario', 'altro'] }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Se lavori tramite piattaforme digitali (rider, consegne, lavoretti gestiti da un\'app): quando è l\'algoritmo a comandare scatta la presunzione che tu sia un lavoratore subordinato (con le relative tutele), hai diritto a una spiegazione delle decisioni automatizzate che ti riguardano, a una formazione sulla sicurezza entro 30 giorni e a un account protetto con SPID o CIE.',
        breve: 'Lavori con un\'app (rider, consegne): se comanda l\'algoritmo sei presunto dipendente, con le relative tutele.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'probabile',
      noteConfidenza: 'Vale se lavori davvero tramite piattaforme digitali (un dato che non ti chiediamo: lo mostriamo a chi è autonomo o ha indicato "altro"). La presunzione di subordinazione può essere contestata dalla piattaforma con prova contraria. Decreto da convertire entro fine giugno 2026.',
      fonteRegola: FONTE
    },
    {
      id: 'lavoro-piattaforme-dati',
      campiNecessari: ['condizioneLavorativa'],
      condizioni: [{ campo: 'condizioneLavorativa', op: 'in', valore: ['autonomo-ordinario', 'altro'] }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Effetto indiretto sui tuoi dati: la stessa legge che ti tutela impone alle piattaforme di conservare per 5 anni ogni tuo accesso, incarico, rifiuto e compenso, e regola la gestione fatta dall\'algoritmo. Più trasparenza, sì, ma anche un registro dettagliato e duraturo del tuo comportamento lavorativo in mano all\'azienda, e una vita lavorativa governata da un software.',
        breve: 'Effetto indiretto: più trasparenza, ma la piattaforma tiene 5 anni di accessi, incarichi, rifiuti e compensi.',
        direzione: 'misto',
        indiretto: true,
        dirittoToccato: {
          carta: 'Carta UE dei diritti fondamentali',
          articolo: 'art. 8',
          diritto: 'protezione dei dati personali',
          intensita: 'lieve',
          url: 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:12012P/TXT'
        }
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'probabile',
      noteConfidenza: 'I dati restano soggetti al GDPR e devono servire solo a gestire e controllare il lavoro (art. 8 della Carta UE; la gestione algoritmica tocca anche l\'art. 31 sulle condizioni di lavoro giuste). Intensità "lieve": la conservazione è prevista dalla legge e a fini di tutela, ma 5 anni di tracciamento di ogni gesto lavorativo restano un occhio costante su di te.',
      fonteRegola: FONTE
    }
  ]
};
