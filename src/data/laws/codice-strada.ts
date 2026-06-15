import type { Legge } from '../../engine/types';

// Verified from: L. 25 novembre 2024, n. 177 (GU 8/12/2024), in vigore dal 14 dicembre 2024.
// Verification date: 2026-06-11
//
// - Cellulare alla guida: multe 250-1.500 €, fino a 10 punti, sospensione breve della patente.
// - Alcol: oltre 0,8 g/l scattano i codici sulla patente (divieto assoluto di alcol alla guida
//   per 2-3 anni e obbligo di alcolock sui veicoli).
// - Neopatentati: zero alcol per i primi 3 anni; limiti di potenza estesi a 3 anni.
// - Monopattini: casco obbligatorio per tutti; targa e assicurazione previste ma legate
//   ai decreti attuativi; circolazione solo su strade urbane fino a 50 km/h.

const FONTE = {
  etichetta: 'L. 177/2024, revisione del Codice della strada (Normattiva)',
  url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2024-11-25;177'
};

export const codiceStrada: Legge = {
  id: 'codice-strada-2024',
  titoloDivulgativo: 'Nuovo Codice della strada: multe più dure e regole nuove',
  titoloUfficiale: 'Legge 25 novembre 2024, n. 177 — Interventi in materia di sicurezza stradale e delega per la revisione del Codice della strada',
  meseAnno: 'novembre 2024',
  stato: 'vigore',
  ambiti: ['doveri'],
  fonti: [
    FONTE,
    {
      etichetta: 'Governo — La revisione del Codice della strada',
      url: 'https://www.programmagoverno.gov.it/it/notizie/la-revisione-del-codice-della-strada-entra-in-vigore-il-14-dicembre-2024/'
    }
  ],
  verificataIl: '2026-06-11',
  riassunto: 'Dal dicembre 2024 chi guida col cellulare in mano rischia multe fino a 1.500 euro e la sospensione della patente. Chi viene trovato con troppo alcol ha il divieto di bere prima di guidare per 2-3 anni e l\'obbligo dell\'alcolock. I neopatentati hanno zero alcol e limiti di potenza per 3 anni. Sui monopattini serve il casco.',
  regole: [
    {
      id: 'strada-cellulare-alcol',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 18 }],
      effetto: {
        tipo: 'dovere',
        descrizione: 'Se guidi: cellulare in mano = multa da 250 a 1.500 euro, fino a 10 punti e sospensione della patente; con tasso alcolico oltre 0,8 scatta il divieto assoluto di alcol alla guida per 2-3 anni con obbligo di alcolock. In cambio, strade più sicure per tutti.',
        direzione: 'misto'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa',
      fonteRegola: FONTE
    },
    {
      id: 'strada-neopatentati',
      campiNecessari: ['eta'],
      condizioni: [
        { campo: 'eta', op: 'almeno', valore: 18 },
        { campo: 'eta', op: 'alPiu', valore: 25 }
      ],
      effetto: {
        tipo: 'dovere',
        descrizione: 'Per chi ha la patente da meno di 3 anni: zero alcol assoluto alla guida e limiti sulla potenza delle auto estesi a 3 anni.',
        direzione: 'misto'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'dipende',
      noteConfidenza: 'Vale solo se hai preso la patente da meno di 3 anni, un dato che non ti chiediamo: l\'età da sola non basta a dirlo.',
      fonteRegola: FONTE
    },
    {
      id: 'strada-monopattini',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 14 }],
      effetto: {
        tipo: 'dovere',
        descrizione: 'Se usi un monopattino elettrico: casco obbligatorio per tutti, si circola solo su strade urbane fino a 50 km/h, e sono in arrivo targa e assicurazione obbligatorie.',
        direzione: 'misto'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'probabile',
      noteConfidenza: 'L\'obbligo del casco è già in vigore; targa e assicurazione partono con i decreti attuativi, non ancora completati al giugno 2026.',
      fonteRegola: FONTE
    },
    {
      id: 'strada-positivita-liberta-personale',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 18 }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Effetto indiretto sulla libertà personale: la nuova norma sulle droghe punisce la semplice positività al test, anche senza guida alterata. Significa che puoi perdere la patente per una sostanza assunta giorni prima, quando non eri più sotto effetto. Tocca soprattutto chi usa cannabis terapeutica o ha consumato nel tempo libero lontano dalla guida.',
        direzione: 'negativo',
        indiretto: true,
        dirittoToccato: {
          carta: 'Costituzione italiana',
          articolo: 'artt. 13 e 27',
          diritto: 'libertà personale e presunzione di non colpevolezza',
          intensita: 'sensibile',
          url: 'https://www.senato.it/istituzione/la-costituzione/parte-i/titolo-i/articolo-13'
        }
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'probabile',
      noteConfidenza: 'Punire la positività e non lo stato di alterazione sposta la sanzione da "guidavi pericolosamente" a "hai quella sostanza nel sangue": diversi giuristi la ritengono in tensione con la libertà personale (art. 13 Cost.) e la presunzione di non colpevolezza (art. 27 Cost.). Sono attese pronunce e circolari chiarificatrici, per questo è "probabile" e non "certa".',
      fonteRegola: FONTE
    }
  ]
};
