import type { Legge } from '../../engine/types';

// Verified from: Regolamento (UE) 2024/1689 (AI Act), art. 113 (calendario di applicazione),
// COME MODIFICATO dal Regolamento (UE) 2026/1744 (Omnibus digitale sull'IA), in vigore dal
// 27 luglio 2026. Verification date: 2026-06-11; aggiornata il 2026-09-01.
//
// Gia' in vigore (dal 2 febbraio 2025): pratiche vietate — punteggio sociale,
// riconoscimento delle emozioni a scuola e al lavoro, manipolazione dannosa,
// raccolta indiscriminata di volti da internet.
// AGGIORNAMENTO 2026-09-01: la data del 2 agosto 2026 per gli obblighi pieni sui sistemi
// "ad alto rischio" NON vale più. L'Omnibus digitale ha sostituito l'art. 113, terzo comma,
// lett. c) dell'AI Act: capo III, sezioni 1-3 dal 2 DICEMBRE 2027 per i sistemi ad alto
// rischio dell'art. 6 par. 2 e dell'allegato III (lavoro, scuola, credito, servizi) e dal
// 2 AGOSTO 2028 per quelli dell'art. 6 par. 1 e dell'allegato I (IA dentro i prodotti).
// Il rinvio non è più un'ipotesi: è diritto vigente, quindi la confidenza sale a "certa".
// L'Omnibus ha anche aggiunto due divieti nuovi (deepfake intimi non consensuali e materiale
// pedopornografico generato da IA), applicabili dal 2 dicembre 2026: sono modellati nella
// scheda dedicata "Regolamento (UE) 2026/1744", che racconta tutto ciò che l'Omnibus cambia.

const FONTE = {
  etichetta: 'Regolamento (UE) 2024/1689 — AI Act (EUR-Lex)',
  url: 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:32024R1689'
};
const FONTE_OMNIBUS = {
  etichetta: 'Regolamento (UE) 2026/1744 — Omnibus digitale sull\'IA, che ha spostato le date (EUR-Lex)',
  url: 'https://eur-lex.europa.eu/legal-content/IT/TXT/HTML/?uri=OJ:L_202601744'
};

export const aiAct: Legge = {
  id: 'ai-act-2024',
  titoloDivulgativo: 'AI Act: le regole europee che ti proteggono dall\'intelligenza artificiale',
  titoloUfficiale: 'Regolamento (UE) 2024/1689 che stabilisce regole armonizzate sull\'intelligenza artificiale',
  meseAnno: 'giugno 2024',
  stato: 'approvata',
  ambiti: ['sicurezza-privacy', 'scuola-universita-ricerca'],
  origine: 'europea',
  fonti: [FONTE, FONTE_OMNIBUS],
  verificataIl: '2026-09-01',
  riassunto: 'L\'Europa ha messo dei paletti all\'intelligenza artificiale. Già vietati: il punteggio sociale, il riconoscimento delle emozioni a scuola e al lavoro, gli inganni costruiti con l\'IA. Le tutele piene per quando un\'IA decide su di te (assunzioni, prestiti, scuola) dovevano arrivare il 2 agosto 2026, ma l\'Omnibus digitale del luglio 2026 le ha spostate al 2 dicembre 2027, e al 2 agosto 2028 per l\'IA dentro i prodotti. Chatbot e deepfake devono comunque dichiararsi.',
  regole: [
    {
      id: 'ai-act-divieti',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 13 }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Nessuno può usare l\'IA per darti un "punteggio sociale", leggerti le emozioni a scuola o al lavoro, o manipolarti con tecniche ingannevoli: sono pratiche vietate in tutta Europa, con multe fino a 35 milioni di euro.',
        breve: 'Vietati in Europa il "punteggio sociale", il riconoscimento delle emozioni a scuola o al lavoro e l\'IA manipolatoria.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa',
      noteConfidenza: 'I divieti sono operativi dal 2 febbraio 2025 in tutti i paesi UE, Italia compresa, senza bisogno di leggi nazionali.',
      fonteRegola: FONTE
    },
    {
      id: 'ai-act-trasparenza',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 13 }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Quando parli con un\'IA (chatbot) deve dirtelo, e le immagini o i video creati dall\'IA (deepfake) devono essere dichiarati come tali.',
        breve: 'I chatbot devono dichiararsi e i contenuti creati dall\'IA (deepfake) vanno segnalati come tali.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa',
      fonteRegola: FONTE
    },
    {
      id: 'ai-act-alto-rischio-lavoro',
      campiNecessari: ['condizioneLavorativa'],
      condizioni: [{
        campo: 'condizioneLavorativa', op: 'in',
        valore: ['dipendente-privato', 'dipendente-pubblico', 'disoccupato', 'studente']
      }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Se un\'IA viene usata per decidere su di te — selezionarti per un lavoro, valutarti a scuola, concederti un prestito — servono supervisione umana, dati di qualità, e hai diritto a una spiegazione e al reclamo. Queste tutele dovevano scattare il 2 agosto 2026: l\'Omnibus digitale sull\'IA, in vigore dal 27 luglio 2026, le ha spostate al 2 dicembre 2027 per i sistemi elencati nell\'allegato III (fra cui lavoro, istruzione, credito e servizi essenziali) e al 2 agosto 2028 per l\'IA incorporata nei prodotti.',
        breve: 'Controllo umano, spiegazione e reclamo quando un\'IA decide su di te: ma solo dal 2 dicembre 2027.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa',
      noteConfidenza: 'Il rinvio non è più un\'ipotesi: il "digital omnibus" è diventato il Regolamento (UE) 2026/1744, pubblicato il 24 luglio 2026 e in vigore dal 27, e ha riscritto le date dell\'articolo 113 dell\'AI Act. Le tutele restano scritte e arriveranno, ma più tardi: 2 dicembre 2027 per i sistemi dell\'allegato III, 2 agosto 2028 per quelli dentro i prodotti, e fino al 2 agosto 2030 per i sistemi ad alto rischio già in uso presso le autorità pubbliche.',
      fonteRegola: FONTE_OMNIBUS
    },
    {
      id: 'ai-act-sorveglianza-residua',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 13 }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Effetto indiretto sulla tua privacy: l\'AI Act ti protegge, ma lascia delle porte aperte. Il riconoscimento facciale in tempo reale negli spazi pubblici resta vietato "salvo eccezioni" per le forze dell\'ordine, e le autorità pubbliche possono comunque usare sistemi che ti profilano. In più, l\'Omnibus digitale del luglio 2026 ha rinviato di oltre un anno le tutele sui sistemi ad alto rischio: la rete di protezione c\'è, ma con maglie più larghe di quanto sembri e con tempi più lunghi di quelli promessi.',
        breve: 'Effetto indiretto: tutele sulla privacy, ma con eccezioni per il volto in pubblico e la profilazione pubblica.',
        direzione: 'misto',
        indiretto: true,
        dirittoToccato: {
          carta: 'Carta UE dei diritti fondamentali',
          articolo: 'artt. 7 e 8',
          diritto: 'vita privata e protezione dei dati',
          intensita: 'lieve',
          url: 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:12012P/TXT'
        }
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa',
      noteConfidenza: 'Le eccezioni per l\'identificazione biometrica a fini di sicurezza e l\'uso pubblico di sistemi di profilazione sono nel testo del regolamento (artt. 5 e allegato III). Il rinvio degli obblighi non è più un\'ipotesi: è stato deciso dal Regolamento (UE) 2026/1744. Intensità "lieve" perché l\'impianto generale resta protettivo, ma le eccezioni e le nuove scadenze riducono la tutela reale rispetto a quella promessa.',
      fonteRegola: FONTE
    }
  ]
};
