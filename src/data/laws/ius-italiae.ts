import type { Legge } from '../../engine/types';

// Verified from: proposta di legge "Ius Italiae" (Forza Italia, 2026) + stampa parlamentare.
// Verification date: 2026-06-11
//
// Sostituisce nel catalogo il referendum cittadinanza del giugno 2025, decaduto
// (quorum non raggiunto). Contenuto della proposta: cittadinanza a 16 anni per chi
// e' nato in Italia o arrivato entro i 5 anni, con 10 anni di residenza continuativa
// e il completamento del ciclo scolastico (5 elementari + 3 medie + 2 superiori).
// Stato: depositata, NON calendarizzata; maggioranza divisa (in Parlamento risultano
// 31 proposte di modifica della cittadinanza). Tutto a orizzonte incerto.

const FONTE = {
  etichetta: 'Camera dei deputati — proposte di legge sulla cittadinanza (XIX legislatura)',
  url: 'https://www.camera.it/leg19/126?tab=1&leg=19&idDocumento=cittadinanza'
};

export const iusItaliae: Legge = {
  id: 'ius-italiae-2026',
  titoloDivulgativo: 'Ius Italiae: la cittadinanza per chi cresce a scuola in Italia',
  titoloUfficiale: 'Proposta di legge "Ius Italiae" — nuove norme sull\'acquisto della cittadinanza italiana (XIX legislatura)',
  stato: 'discussione',
  ambiti: ['doveri', 'scuola-universita-ricerca'],
  fonti: [FONTE],
  verificataIl: '2026-06-11',
  riassunto: 'Una proposta di legge (non ancora votata) per dare la cittadinanza italiana a 16 anni ai ragazzi nati in Italia o arrivati da piccoli, se hanno studiato qui per almeno 10 anni completando il percorso scolastico. Il referendum del 2025 sullo stesso tema è fallito per mancanza di quorum; ora la discussione riparte dal Parlamento, ma i partiti sono divisi e non c\'è una data.',
  regole: [
    {
      id: 'ius-italiae-figli',
      campiNecessari: ['cittadinanza', 'figli'],
      condizioni: [
        { campo: 'cittadinanza', op: 'eq', valore: 'extra-ue' },
        { campo: 'figli', op: 'almeno', valore: 1 }
      ],
      effetto: {
        tipo: 'diritto',
        descrizione: 'SE la proposta venisse approvata: i tuoi figli nati in Italia (o arrivati entro i 5 anni) potrebbero diventare cittadini italiani a 16 anni dopo aver completato 10 anni di scuola qui.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'La legge non esiste ancora: è una proposta non calendarizzata e i partiti sono divisi. Dipende anche dal percorso scolastico effettivo dei tuoi figli, che non ti chiediamo.',
      fonteRegola: FONTE
    },
    {
      id: 'ius-italiae-giovani',
      campiNecessari: ['cittadinanza', 'eta'],
      condizioni: [
        { campo: 'cittadinanza', op: 'eq', valore: 'extra-ue' },
        { campo: 'eta', op: 'alPiu', valore: 25 }
      ],
      effetto: {
        tipo: 'diritto',
        descrizione: 'SE la proposta venisse approvata e sei cresciuto a scuola in Italia: percorso più chiaro verso la cittadinanza, senza aspettare i 18 anni con la trafila attuale.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'Vale per chi è nato in Italia o arrivato entro i 5 anni, con 10 anni di scuola completati: dati che non ti chiediamo. E la proposta deve ancora essere votata.',
      fonteRegola: FONTE
    }
  ]
};
