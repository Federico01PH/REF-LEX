import type { Legge } from '../../engine/types';

// Verified from: Direttiva (UE) 2024/1275 (EPBD IV) + stampa specializzata maggio-giugno 2026.
// Verification date: 2026-06-11
//
// Approccio "a portafoglio": il consumo medio del parco residenziale nazionale deve
// scendere del 16% al 2030 e del 20-22% al 2035; NON esiste un obbligo individuale
// di classe energetica per il singolo proprietario.
// Dal 1/1/2025: stop agli incentivi pubblici per caldaie solo a combustibili fossili (gia' recepito).
// Nuovi edifici a zero emissioni dal 2028 (pubblici) e dal 2030 (tutti).
// Recepimento italiano: scadenza 29 maggio 2026 NON rispettata (procedura di infrazione UE);
// gli obblighi concreti per i cittadini arriveranno solo col decreto di recepimento.

const FONTE = {
  etichetta: 'Direttiva (UE) 2024/1275 (EUR-Lex)',
  url: 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:32024L1275'
};

export const caseGreen: Legge = {
  id: 'case-green-epbd',
  titoloDivulgativo: 'Case green: le regole europee sull\'efficienza delle case',
  titoloUfficiale: 'Direttiva (UE) 2024/1275 sulla prestazione energetica nell\'edilizia (EPBD IV)',
  stato: 'approvata',
  ambito: 'casa',
  origine: 'europea',
  fonti: [FONTE],
  verificataIl: '2026-06-11',
  riassunto: 'L\'Europa chiede che le case italiane, in media, consumino il 16% in meno entro il 2030 e il 20-22% in meno entro il 2035. Non c\'è un obbligo per la singola casa: toccherà allo Stato decidere come arrivarci, ma l\'Italia è in ritardo nel tradurre la direttiva in legge. Una cosa è già attiva: niente più bonus per le caldaie solo a gas o gasolio.',
  regole: [
    {
      id: 'epbd-caldaia-incentivi',
      campiNecessari: ['abitazione'],
      condizioni: [{ campo: 'abitazione', op: 'eq', valore: 'proprieta' }],
      effetto: {
        tipo: 'servizio',
        descrizione: 'Se devi sostituire la caldaia, quelle solo a gas o gasolio non hanno più nessun bonus statale dal 2025: la paghi a prezzo pieno. Gli incentivi restano per pompe di calore e sistemi ibridi.',
        direzione: 'negativo'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa',
      noteConfidenza: 'Divieto di incentivi già operativo in Italia (Ecobonus escluso per caldaie solo fossili dal 2025; Conto Termico 3.0 solo per ibridi).',
      fonteRegola: FONTE
    },
    {
      id: 'epbd-requisiti-proprietari',
      campiNecessari: ['abitazione'],
      condizioni: [{ campo: 'abitazione', op: 'eq', valore: 'proprieta' }],
      effetto: {
        tipo: 'dovere',
        descrizione: 'In futuro potrebbero arrivare requisiti o spinte a ristrutturare le case che consumano di più (e chi ristruttura risparmia in bolletta e rivaluta la casa). Ma oggi non esiste nessun obbligo per la tua singola casa.',
        direzione: 'misto'
      },
      timeline: { anno1: 'nullo', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'L\'Italia non ha ancora recepito la direttiva (scadenza del 29 maggio 2026 mancata): quali case e quali obblighi dipenderà dal decreto di recepimento e dal piano nazionale di ristrutturazione.',
      fonteRegola: FONTE
    },
    {
      id: 'epbd-affitto',
      campiNecessari: ['abitazione'],
      condizioni: [{ campo: 'abitazione', op: 'eq', valore: 'affitto' }],
      effetto: {
        tipo: 'qualita-vita',
        descrizione: 'Se la casa che affitti verrà ristrutturata, pagherai meno di bolletta e vivrai meglio; ma i lavori potrebbero riflettersi sul canone. Dipende dalle scelte del proprietario e dalle regole italiane in arrivo.',
        direzione: 'misto'
      },
      timeline: { anno1: 'nullo', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'Nessun obbligo individuale è ancora legge in Italia: l\'effetto su chi è in affitto dipenderà dal recepimento.',
      fonteRegola: FONTE
    }
  ]
};
