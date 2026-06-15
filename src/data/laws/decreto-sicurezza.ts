import type { Legge } from '../../engine/types';

// Verified from: L. 9 giugno 2025, n. 80 (conversione del DL sicurezza), GU n. 131 del 9/6/2025.
// Verification date: 2026-06-11
//
// 39 articoli, 14 nuovi reati e 9 aggravanti. Per i cittadini:
// - nuovo reato di occupazione arbitraria di immobile destinato a domicilio + sgombero rapido;
// - aggravante per le truffe agli anziani;
// - bodycam alle forze di polizia e fondi per videosorveglianza (20+ milioni in 3 anni);
// - blocco stradale durante le proteste diventa reato;
// - pene piu' severe per lesioni e resistenza a pubblico ufficiale;
// - SIM (art. 32, modifica l'art. 98 del Codice comunicazioni elettroniche): chi e' extra-UE
//   deve mostrare un documento di riconoscimento valido. La proposta iniziale chiedeva il
//   permesso di soggiorno: requisito ELIMINATO nella versione definitiva (verificato 12/06/2026).
// - L'obbligo per universita' e PA di collaborare con i servizi segreti (art. 31 del ddl
//   originale) e' SPARITO dal decreto in vigore: l'art. 31 attuale riguarda solo i poteri
//   operativi dei servizi. Non va modellato finche' non torna in una legge vera.

const FONTE = {
  etichetta: 'L. 80/2025, conversione del DL sicurezza (Normattiva)',
  url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2025-06-09;80'
};

export const decretoSicurezza: Legge = {
  id: 'decreto-sicurezza-2025',
  titoloDivulgativo: 'Decreto sicurezza: nuovi reati, sgomberi rapidi e telecamere',
  titoloUfficiale: 'Legge 9 giugno 2025, n. 80 — Disposizioni urgenti in materia di sicurezza pubblica',
  meseAnno: 'giugno 2025',
  stato: 'vigore',
  ambiti: ['sicurezza-privacy'],
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
    },
    {
      id: 'sicurezza-sim-documento',
      campiNecessari: ['cittadinanza'],
      condizioni: [{ campo: 'cittadinanza', op: 'eq', valore: 'extra-ue' }],
      effetto: {
        tipo: 'dovere',
        descrizione: 'Per comprare una SIM telefonica devi mostrare un documento di riconoscimento valido (passaporto, carta d\'identità o documento equipollente). Il permesso di soggiorno NON è richiesto: era nella proposta iniziale, ma è stato tolto dalla legge definitiva. Se un negozio te lo chiede come obbligo, sta sbagliando.',
        direzione: 'misto',
        indiretto: true
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa',
      noteConfidenza: 'Art. 32 della legge, che modifica l\'art. 98 del Codice delle comunicazioni elettroniche. Il negozio che vende SIM senza verificare il documento rischia la chiusura da 5 a 30 giorni; usare il documento di un\'altra persona è reato.',
      fonteRegola: FONTE
    },
    {
      id: 'sicurezza-liberta-manifestazione',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 13 }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Effetto indiretto sulla tua libertà di protesta: trasformare in reato il blocco stradale o ferroviario (prima era un illecito amministrativo) alza il rischio penale di forme di protesta finora tollerate, come i sit-in sulla strada. Anche se non hai mai manifestato, è il margine della libertà di tutti che si restringe: chi protesta tende ad autocensurarsi per paura della fedina penale.',
        direzione: 'negativo',
        indiretto: true,
        dirittoToccato: {
          carta: 'Costituzione italiana',
          articolo: 'art. 17',
          diritto: 'libertà di riunione e di manifestazione',
          intensita: 'sensibile',
          url: 'https://www.senato.it/istituzione/la-costituzione/parte-i/titolo-i/articolo-17'
        }
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa',
      noteConfidenza: 'Manifestare resta un diritto costituzionale (art. 17 Cost.; art. 11 CEDU; art. 12 della Carta UE dei diritti fondamentali). Cambia il prezzo del dissenso: ciò che era una multa può diventare reato. Intensità "sensibile" perché colpisce una forma specifica di protesta, non il diritto di riunirsi in sé.',
      fonteRegola: FONTE
    },
    {
      id: 'sicurezza-sorveglianza-privacy',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 13 }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Effetto indiretto sulla tua riservatezza: più telecamere in città e bodycam sugli agenti significano più momenti della tua giornata ripresi e archiviati, anche se non hai fatto nulla. È una protezione in più contro i reati, ma anche più dati sui movimenti di tutti in mani pubbliche, con il rischio che vengano usati per scopi diversi da quelli iniziali.',
        direzione: 'misto',
        indiretto: true,
        dirittoToccato: {
          carta: 'Costituzione italiana',
          articolo: 'artt. 14-15',
          diritto: 'riservatezza e libertà delle comunicazioni',
          intensita: 'lieve',
          url: 'https://www.senato.it/istituzione/la-costituzione/parte-i/titolo-i/articolo-14'
        }
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa',
      noteConfidenza: 'Le immagini restano soggette al GDPR e alle regole del Garante privacy (art. 8 CEDU; artt. 7-8 della Carta UE dei diritti fondamentali). Intensità "lieve": la sorveglianza degli spazi pubblici è ammessa se proporzionata, ma più dispositivi significano più dati e più possibili usi futuri.',
      fonteRegola: FONTE
    }
  ]
};
