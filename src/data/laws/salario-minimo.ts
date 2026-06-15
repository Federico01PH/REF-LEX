import type { Legge } from '../../engine/types';

// Verificato il 2026-06-10:
// La proposta di legge AC 1275 (9 euro/ora) e' diventata Legge 26 settembre 2025, n. 144
// (GU n. 230 del 3 ottobre 2025), ma si tratta di una LEGGE DELEGA: non ha fissato
// un minimo orario universale di 9 euro, bensì ha delegato il Governo ad adottare decreti
// legislativi che individuino i CCNL "maggiormente applicati" come soglia minima di
// retribuzione. I decreti attuativi non erano ancora adottati alla data di verifica.
// Fonte: normattiva.it, avvocatotessitore.it, studio-borghi.it (verificati 2026-06-10)

const FONTE_LEGGE = {
  etichetta: 'Legge 26 settembre 2025, n. 144 (GU n. 230/2025)',
  url: 'https://www.normattiva.it/uri-res/N2Ls?urn%3Anir%3Astato%3Alegge%3A2025%3B144='
};

const FONTE_AC = {
  etichetta: 'Proposta di legge AC 1275 (Camera dei deputati)',
  url: 'https://www.camera.it/leg19/126?tab=&leg=19&idDocumento=1275'
};

export const salarioMinimo: Legge = {
  id: 'salario-minimo-l144-2025',
  titoloDivulgativo: 'Salario minimo: la legge delega sui contratti collettivi',
  titoloUfficiale: 'Legge 26 settembre 2025, n. 144 — Delega al Governo in materia di retribuzione dei lavoratori e di contrattazione collettiva',
  meseAnno: 'settembre 2025',
  stato: 'approvata',
  ambiti: ['fisco-lavoro'],
  fonti: [FONTE_LEGGE, FONTE_AC],
  verificataIl: '2026-06-10',
  riassunto: 'La legge è in vigore dall\'ottobre 2025, ma non ha fissato il minimo a 9 euro/ora come chiedevano le opposizioni. Invece, delega il Governo a stabilire per legge i minimi salariali dei contratti collettivi più diffusi. Bisogna ancora aspettare i decreti attuativi per sapere chi guadagnerà di più.',
  regole: [
    {
      id: 'salario-minimo-bassi-redditi',
      condizioni: [
        { campo: 'condizioneLavorativa', op: 'in', valore: ['dipendente-privato', 'dipendente-pubblico'] },
        { campo: 'fasciaReddito', op: 'alPiu', valore: 'da9a15k' }
      ],
      campiNecessari: ['condizioneLavorativa', 'fasciaReddito'],
      effetto: {
        tipo: 'economico',
        descrizione: 'Se il tuo CCNL non è tra quelli "maggiormente applicati", o se il tuo contratto prevede paghe sotto il minimo che il Governo stabilirà, potresti ricevere un aumento. L\'importo dipende dal tuo contratto collettivo attuale.',
        breve: 'Se il tuo contratto paga sotto il minimo che il Governo fisserà, potresti avere un aumento.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'La legge delega è in vigore, ma i decreti attuativi non sono ancora stati adottati (verifica: 2026-06-10). L\'effetto concreto dipende dal contratto collettivo applicato al tuo settore e dalla paga oraria attuale.',
      fonteRegola: { etichetta: 'L. 144/2025, art. 1', url: 'https://www.normattiva.it/uri-res/N2Ls?urn%3Anir%3Astato%3Alegge%3A2025%3B144=' }
    }
  ]
};
