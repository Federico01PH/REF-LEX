import type { Legge } from '../../engine/types';

// Verified from: D.Lgs. 62/2024 (attuazione L. delega 227/2021) + disabilita.governo.it.
// Verification date: 2026-06-11
//
// La riforma: accertamento unico INPS con certificato medico introduttivo (una sola visita,
// meno burocrazia), valutazione multidimensionale, Progetto di vita personalizzato con
// budget di progetto. Sperimentazione: 9 province dal 2025, +11 dal 30/9/2025,
// +40 dal 1/3/2026 (totale 60). Entrata in vigore in tutta Italia: 1 gennaio 2027
// (gia' rinviata una volta: era prevista per il 2026).

const FONTE = {
  etichetta: 'D.Lgs. 27 maggio 2024, n. 62 (Normattiva)',
  url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2024-05-03;62'
};

const FONTE_GOVERNO = {
  etichetta: 'Ministero per le disabilità — sperimentazione estesa a 40 nuove province',
  url: 'https://disabilita.governo.it/it/notizie/al-via-sperimentazione-riforma-disabilita-in-altre-40-province/'
};

export const riformaDisabilita: Legge = {
  id: 'riforma-disabilita-2024',
  titoloDivulgativo: 'Riforma della disabilità: una sola visita e un progetto di vita',
  titoloUfficiale: 'Decreto legislativo 3 maggio 2024, n. 62 (attuazione della legge delega 227/2021)',
  meseAnno: 'maggio 2024',
  stato: 'approvata',
  ambiti: ['diritti-salute', 'scuola-universita-ricerca'],
  fonti: [FONTE, FONTE_GOVERNO],
  verificataIl: '2026-06-11',
  riassunto: 'Cambia il modo di riconoscere la disabilità: una sola visita INPS al posto delle tante commissioni, un certificato del proprio medico per avviare tutto, e il diritto a un "progetto di vita" costruito sulla persona, con un budget dedicato. Nel 2026 vale in 60 province di prova; dal 1° gennaio 2027 dovrebbe valere in tutta Italia.',
  regole: [
    {
      id: 'disabilita-accertamento-unico',
      campiNecessari: ['disabilita'],
      condizioni: [{ campo: 'disabilita', op: 'in', valore: ['motoria', 'visiva', 'uditiva', 'intellettiva', 'malattia-cronica'] }],
      effetto: {
        tipo: 'servizio',
        descrizione: 'Meno burocrazia: una sola visita INPS per il riconoscimento, avviata dal certificato del tuo medico, al posto delle vecchie commissioni multiple e delle visite di rinnovo ripetute.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'incerto', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'probabile',
      noteConfidenza: 'Nel 2026 il nuovo sistema vale solo in 60 province di sperimentazione: se la tua non è tra queste, per ora resta la vecchia procedura. L\'avvio nazionale del 1° gennaio 2027 è già stato rinviato una volta e potrebbe slittare ancora.',
      fonteRegola: FONTE_GOVERNO
    },
    {
      id: 'disabilita-progetto-di-vita',
      campiNecessari: ['disabilita'],
      condizioni: [{ campo: 'disabilita', op: 'in', valore: ['motoria', 'visiva', 'uditiva', 'intellettiva', 'malattia-cronica'] }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Diritto al "progetto di vita": un piano costruito con te (scuola, lavoro, casa, tempo libero) con un budget di progetto che puoi contribuire a gestire.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'incerto', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'probabile',
      noteConfidenza: 'Vale dove la sperimentazione è attiva (60 province nel 2026), poi in tutta Italia dal 2027. Le risorse del budget di progetto dipendono dai servizi del tuo territorio.',
      fonteRegola: FONTE
    },
    {
      id: 'disabilita-condizione-non-riconosciuta',
      campiNecessari: ['disabilita'],
      condizioni: [{ campo: 'disabilita', op: 'in', valore: ['condizione-non-riconosciuta'] }],
      effetto: {
        tipo: 'servizio',
        descrizione: 'La riforma cambia il come si accerta la disabilità, non l\'elenco delle condizioni riconosciute: se la tua condizione non è ancora riconosciuta, questa legge da sola non basta. Se nel catalogo c\'è una proposta dedicata alla tua condizione, la trovi tra le leggi su salute e diritti.',
        direzione: 'neutro'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa',
      fonteRegola: FONTE
    },
    {
      id: 'disabilita-caregiver',
      campiNecessari: ['condizioneLavorativa'],
      condizioni: [{ campo: 'condizioneLavorativa', op: 'in', valore: ['caregiver'] }],
      effetto: {
        tipo: 'qualita-vita',
        descrizione: 'Se assisti una persona con disabilità, il progetto di vita coinvolge anche la famiglia: la valutazione considera i bisogni di chi assiste e coordina i servizi in un piano unico.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'incerto', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'probabile',
      noteConfidenza: 'Anche per te dipende dalla provincia fino a fine 2026; il sostegno concreto dipende dai servizi del territorio.',
      fonteRegola: FONTE
    },
    {
      id: 'disabilita-dati-sanitari',
      campiNecessari: ['disabilita'],
      condizioni: [{ campo: 'disabilita', op: 'in', valore: ['motoria', 'visiva', 'uditiva', 'intellettiva', 'malattia-cronica'] }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Effetto indiretto sui tuoi dati sanitari: la valutazione unica e il "progetto di vita" raccolgono in un solo fascicolo digitale, gestito dall\'INPS e condiviso tra i servizi, informazioni molto intime sulla tua salute, autonomia e vita quotidiana. È più comodo (una visita sola), ma concentra dati sensibili che prima erano sparsi, aumentando il peso di un eventuale uso improprio o di un accesso non autorizzato.',
        direzione: 'misto',
        indiretto: true,
        dirittoToccato: {
          carta: 'Carta UE dei diritti fondamentali',
          articolo: 'art. 8',
          diritto: 'protezione dei dati sanitari',
          intensita: 'lieve',
          url: 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:12012P/TXT'
        }
      },
      timeline: { anno1: 'incerto', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'probabile',
      noteConfidenza: 'I dati sulla salute sono una "categoria particolare" protetta dal GDPR (art. 9) e dall\'art. 8 della Carta UE; il diritto alla salute è tutelato dall\'art. 32 della Costituzione. Intensità "lieve": la riforma serve ad aiutarti e il trattamento è regolato, ma concentrare dati sensibili in un unico fascicolo è di per sé un rischio in più.',
      fonteRegola: FONTE
    }
  ]
};
