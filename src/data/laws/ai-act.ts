import type { Legge } from '../../engine/types';

// Verified from: Regolamento (UE) 2024/1689 (AI Act), art. 113 (calendario di applicazione).
// Verification date: 2026-06-11
//
// Gia' in vigore (dal 2 febbraio 2025): pratiche vietate — punteggio sociale,
// riconoscimento delle emozioni a scuola e al lavoro, manipolazione dannosa,
// raccolta indiscriminata di volti da internet.
// Dal 2 agosto 2026: obblighi pieni per i sistemi "ad alto rischio" (assunzioni,
// gestione dei lavoratori, scuola, credito, servizi essenziali): supervisione umana,
// trasparenza, diritto di reclamo. Chatbot e deepfake vanno dichiarati.
// Attenzione: la proposta UE "digital omnibus" potrebbe rinviare parte degli obblighi
// ad alto rischio: nota di onesta' inclusa.

const FONTE = {
  etichetta: 'Regolamento (UE) 2024/1689 — AI Act (EUR-Lex)',
  url: 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:32024R1689'
};

export const aiAct: Legge = {
  id: 'ai-act-2024',
  titoloDivulgativo: 'AI Act: le regole europee che ti proteggono dall\'intelligenza artificiale',
  titoloUfficiale: 'Regolamento (UE) 2024/1689 che stabilisce regole armonizzate sull\'intelligenza artificiale',
  stato: 'approvata',
  ambito: 'sicurezza-privacy',
  origine: 'europea',
  fonti: [FONTE],
  verificataIl: '2026-06-11',
  riassunto: 'L\'Europa ha messo dei paletti all\'intelligenza artificiale. Già vietati: il punteggio sociale, il riconoscimento delle emozioni a scuola e al lavoro, gli inganni costruiti con l\'IA. Dal 2 agosto 2026 scattano le tutele piene quando un\'IA decide su di te (assunzioni, prestiti, scuola): supervisione umana e diritto di sapere e reclamare. Chatbot e deepfake devono dichiararsi.',
  regole: [
    {
      id: 'ai-act-divieti',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 13 }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Nessuno può usare l\'IA per darti un "punteggio sociale", leggerti le emozioni a scuola o al lavoro, o manipolarti con tecniche ingannevoli: sono pratiche vietate in tutta Europa, con multe fino a 35 milioni di euro.',
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
        descrizione: 'Se un\'IA viene usata per decidere su di te — selezionarti per un lavoro, valutarti a scuola, concederti un prestito — dal 2 agosto 2026 servono supervisione umana, dati di qualità e hai diritto a una spiegazione e al reclamo.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'probabile',
      noteConfidenza: 'La data del 2 agosto 2026 è scritta nel regolamento, ma a Bruxelles si discute una proposta ("digital omnibus") che potrebbe rinviare una parte di questi obblighi: per questo segniamo "probabile" e non "certo".',
      fonteRegola: FONTE
    }
  ]
};
