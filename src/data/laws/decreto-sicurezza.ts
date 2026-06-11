import type { Legge } from '../../engine/types';

// Verified from: L. 9 giugno 2025, n. 80 (conversione del DL sicurezza), GU n. 131 del 9/6/2025.
// Verification date: 2026-06-11
//
// 39 articoli, 14 nuovi reati e 9 aggravanti. Per i cittadini:
// - nuovo reato di occupazione arbitraria di immobile destinato a domicilio + sgombero rapido;
// - aggravante per le truffe agli anziani;
// - bodycam alle forze di polizia e fondi per videosorveglianza (20+ milioni in 3 anni);
// - blocco stradale durante le proteste diventa reato;
// - pene piu' severe per lesioni e resistenza a pubblico ufficiale.

const FONTE = {
  etichetta: 'L. 80/2025, conversione del DL sicurezza (Normattiva)',
  url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2025-06-09;80'
};

export const decretoSicurezza: Legge = {
  id: 'decreto-sicurezza-2025',
  titoloDivulgativo: 'Decreto sicurezza: nuovi reati, sgomberi rapidi e telecamere',
  titoloUfficiale: 'Legge 9 giugno 2025, n. 80 — Disposizioni urgenti in materia di sicurezza pubblica',
  stato: 'vigore',
  ambito: 'sicurezza-privacy',
  fonti: [FONTE],
  verificataIl: '2026-06-11',
  riassunto: 'Una legge con 14 nuovi reati e 9 aggravanti. Chi occupa abusivamente la casa di qualcuno commette un reato e lo sgombero diventa più rapido. Le truffe agli anziani sono punite più duramente. Le forze dell\'ordine avranno bodycam e più telecamere nelle città. Bloccare una strada durante una protesta diventa reato.',
  regole: [
    {
      id: 'sicurezza-occupazione-casa',
      campiNecessari: ['abitazione'],
      condizioni: [{ campo: 'abitazione', op: 'eq', valore: 'proprieta' }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Se qualcuno occupa abusivamente la tua casa, ora è un reato specifico (fino a 7 anni se è il tuo domicilio) e c\'è una procedura veloce per farti riavere l\'immobile.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa',
      fonteRegola: FONTE
    },
    {
      id: 'sicurezza-truffe-anziani',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 65 }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Le truffe contro le persone anziane sono punite più severamente: una tutela in più contro raggiri al telefono, alla porta o online.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa',
      fonteRegola: FONTE
    },
    {
      id: 'sicurezza-videosorveglianza',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 13 }],
      effetto: {
        tipo: 'qualita-vita',
        descrizione: 'Più telecamere nelle città e bodycam addosso agli agenti: più protezione negli spazi pubblici, ma anche più occhi puntati sulla vita di tutti. Le immagini sono comunque soggette alle regole sulla privacy.',
        direzione: 'misto'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa',
      fonteRegola: FONTE
    },
    {
      id: 'sicurezza-proteste',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 13 }],
      effetto: {
        tipo: 'dovere',
        descrizione: 'Bloccare una strada o una ferrovia durante una manifestazione è diventato reato (prima era una multa): se partecipi a proteste, il rischio legale è più alto.',
        direzione: 'misto'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa',
      noteConfidenza: 'Vale per i blocchi con il proprio corpo o con ostacoli; manifestare resta un diritto costituzionale, cambia cosa succede se si blocca la circolazione.',
      fonteRegola: FONTE
    }
  ]
};
