import type { Legge } from '../../engine/types';

// Verified from: schema di DPCM di aggiornamento dei LEA (Atto del Governo 370),
// ok Conferenza Stato-Regioni e pareri delle commissioni parlamentari; a giugno 2026
// il DPCM NON risulta ancora pubblicato in Gazzetta Ufficiale → nessun effetto operativo.
// Verification date: 2026-06-11
//
// Contenuto: la sindrome fibromialgica entra nei LEA SOLO nella forma molto severa
// (punteggio FIQR > 82): codice di esenzione dal ticket (attestato minimo 2 anni),
// visita specialistica, 10 sedute riabilitative, visita psichiatrica.

const FONTE = {
  etichetta: 'Schema DPCM aggiornamento LEA (Atto Governo 370) — Camera dei deputati',
  url: 'https://documenti.camera.it/apps/nuovosito/attigoverno/Schedalavori/getTesto.ashx?file=0370.pdf'
};

export const fibromialgiaLea: Legge = {
  id: 'fibromialgia-lea-2026',
  titoloDivulgativo: 'Fibromialgia riconosciuta dal servizio sanitario: cure senza ticket',
  titoloUfficiale: 'Schema di DPCM di aggiornamento dei Livelli essenziali di assistenza (Atto del Governo n. 370)',
  stato: 'discussione',
  ambito: 'diritti-salute',
  fonti: [
    FONTE,
    {
      etichetta: 'Ministero della Salute — Livelli essenziali di assistenza',
      url: 'https://www.salute.gov.it/portale/lea/menuContenutoLea.jsp?lingua=italiano&area=Lea'
    }
  ],
  verificataIl: '2026-06-11',
  riassunto: 'Per la prima volta lo Stato riconosce la fibromialgia tra le malattie croniche del servizio sanitario: esenzione dal ticket, visite specialistiche e 10 sedute riabilitative. Ma attenzione: vale solo per le forme molto gravi (punteggio FIQR sopra 82) e il decreto non è ancora stato pubblicato, quindi oggi non è ancora operativo.',
  regole: [
    {
      id: 'fibromialgia-esenzione',
      campiNecessari: ['disabilita'],
      condizioni: [{ campo: 'disabilita', op: 'in', valore: ['condizione-non-riconosciuta'] }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Se la tua condizione è la fibromialgia in forma molto severa, avrai un codice di esenzione dal ticket (valido almeno 2 anni), una visita specialistica, 10 sedute riabilitative e una visita psichiatrica a carico del servizio sanitario.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'Due incertezze oneste: 1) il decreto LEA non è ancora pubblicato in Gazzetta Ufficiale, quindi non è in vigore; 2) anche quando lo sarà, varrà solo per le forme molto severe (punteggio FIQR sopra 82), non per tutte le persone con fibromialgia.',
      fonteRegola: FONTE
    },
    {
      id: 'fibromialgia-forme-lievi',
      campiNecessari: ['disabilita'],
      condizioni: [{ campo: 'disabilita', op: 'in', valore: ['condizione-non-riconosciuta'] }],
      effetto: {
        tipo: 'servizio',
        descrizione: 'Se la tua forma non è classificata come molto severa, questo aggiornamento non ti dà ancora esenzioni: il riconoscimento pieno della fibromialgia resta affidato ai disegni di legge in discussione al Senato.',
        direzione: 'neutro'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'certa',
      noteConfidenza: 'È il limite dichiarato dello schema di decreto: l\'esenzione riguarda solo i casi con punteggio FIQR sopra 82.',
      fonteRegola: FONTE
    }
  ]
};
