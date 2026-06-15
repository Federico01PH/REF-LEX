import type { Legge, Orizzonte, Regola, StatoOrizzonte } from '../../engine/types';

// Verified from: DL 48/2023 (conv. L. 85/2023), aggiornato da L. 199/2025 (Bilancio 2026);
// INPS "Assegno di Inclusione: le novità 2026". Verification date: 2026-06-11
//
// Requisiti 2026: ISEE <= 10.140 €; reddito familiare <= 6.500 €/anno × scala di equivalenza
//   (8.190 € per nuclei tutti over 67 o con disabilità grave).
// Nel nucleo serve almeno: un minorenne, una persona con disabilità certificata,
//   una persona con almeno 60 anni, o una persona in svantaggio certificato.
// Importi: integrazione al reddito fino a 6.500 €/anno (542 €/mese) × scala equivalenza
//   + contributo affitto fino a 3.640 €/anno (303 €/mese) → max base ~845 €/mese.
// Novità L. 199/2025: niente più mese di sospensione tra i rinnovi (prima mensilità al 50%).

const FONTE = {
  etichetta: 'DL 48/2023, art. 1-13 (conv. L. 85/2023) e L. 199/2025 (Normattiva)',
  url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legge:2023-05-04;48'
};

const TIMELINE_STRUTTURALE: Record<Orizzonte, StatoOrizzonte> = {
  anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo'
};

const NOTA_COMUNE =
  'L\'importo esatto dipende dal reddito familiare e dalla composizione del nucleo (scala di equivalenza), dati che non ti chiediamo. Contano anche i requisiti su casa e risparmi (patrimonio immobiliare e mobiliare).';

function regolaAdi(id: string, campiNecessari: Regola['campiNecessari'], condizioni: Regola['condizioni'], descrizione: string, nota: string): Regola {
  return {
    id,
    campiNecessari,
    condizioni,
    effetto: {
      tipo: 'economico',
      importoMese: { min: 0, max: 845 },
      descrizione,
      direzione: 'positivo'
    },
    timeline: TIMELINE_STRUTTURALE,
    confidenza: 'dipende',
    noteConfidenza: `${nota} ${NOTA_COMUNE}`,
    fonteRegola: FONTE
  };
}

export const assegnoInclusione: Legge = {
  id: 'assegno-inclusione-2026',
  titoloDivulgativo: 'Assegno di inclusione: il sostegno per le famiglie con pochi soldi',
  titoloUfficiale: 'Decreto-legge 4 maggio 2023, n. 48 — Misure urgenti per l\'inclusione sociale e l\'accesso al mondo del lavoro (artt. 1-13, convertito in L. 85/2023, aggiornato dalla L. 199/2025)',
  meseAnno: 'maggio 2023',
  stato: 'vigore',
  ambiti: ['pensioni-welfare'],
  fonti: [
    FONTE,
    {
      etichetta: 'INPS — Assegno di Inclusione: le novità 2026',
      url: 'https://www.inps.it/it/it/inps-comunica/notizie/dettaglio-news-page.news.2026.02.assegno-di-inclusione-le-novit-2026.html'
    },
    {
      etichetta: 'Ministero del Lavoro — Assegno di inclusione',
      url: 'https://www.lavoro.gov.it/temi-e-priorita/decreto-lavoro/Pagine/assegno-di-inclusione'
    }
  ],
  verificataIl: '2026-06-11',
  riassunto: 'Un aiuto economico mensile per le famiglie con ISEE fino a 10.140 euro in cui vive un minorenne, una persona con disabilità, una persona con almeno 60 anni o una persona in svantaggio certificato. Vale fino a circa 542 euro al mese (di più per famiglie numerose), più un contributo per l\'affitto fino a 303 euro. Dura 18 mesi e si rinnova; dal 2026 senza più il mese di pausa.',
  regole: [
    regolaAdi(
      'adi-isee-figli',
      ['fasciaIsee', 'figli'],
      [
        { campo: 'fasciaIsee', op: 'eq', valore: 'fino9360' },
        { campo: 'figli', op: 'almeno', valore: 1 }
      ],
      'Con un ISEE sotto i 9.360 euro e figli nel nucleo puoi chiedere l\'Assegno di inclusione: fino a 542 euro al mese più 303 di contributo affitto.',
      'Serve che almeno un figlio sia minorenne (o che nel nucleo ci sia un\'altra persona tra quelle previste).'
    ),
    regolaAdi(
      'adi-isee-over60',
      ['fasciaIsee', 'eta'],
      [
        { campo: 'fasciaIsee', op: 'eq', valore: 'fino9360' },
        { campo: 'eta', op: 'almeno', valore: 60 }
      ],
      'Con un ISEE sotto i 9.360 euro e almeno 60 anni puoi chiedere l\'Assegno di inclusione: fino a 542 euro al mese più 303 di contributo affitto.',
      'Il requisito dell\'età (60 anni) è soddisfatto dal tuo profilo.'
    ),
    regolaAdi(
      'adi-isee-disabilita',
      ['fasciaIsee', 'disabilita'],
      [
        { campo: 'fasciaIsee', op: 'eq', valore: 'fino9360' },
        { campo: 'disabilita', op: 'in', valore: ['motoria', 'visiva', 'uditiva', 'intellettiva', 'malattia-cronica'] }
      ],
      'Con un ISEE sotto i 9.360 euro e una disabilità o malattia cronica certificata puoi chiedere l\'Assegno di inclusione: fino a 542 euro al mese più 303 di contributo affitto.',
      'Serve che la disabilità sia certificata dalle commissioni mediche; le condizioni non ancora riconosciute ufficialmente purtroppo non bastano.'
    ),
    regolaAdi(
      'adi-soglia-vicina',
      ['fasciaIsee'],
      [{ campo: 'fasciaIsee', op: 'eq', valore: 'da9360a15k' }],
      'La soglia ISEE per l\'Assegno di inclusione è 10.140 euro: se il tuo ISEE è tra 9.360 e 10.140 puoi rientrare; sopra, no.',
      'Il tuo ISEE è nella fascia 9.360-15.000: solo la parte fino a 10.140 dà diritto all\'assegno, e serve comunque un minorenne, una persona con disabilità o un over 60 nel nucleo.'
    ),
    {
      id: 'adi-dati-condizionalita',
      campiNecessari: ['fasciaIsee'],
      condizioni: [{ campo: 'fasciaIsee', op: 'in', valore: ['fino9360', 'da9360a15k'] }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Effetto indiretto sui tuoi dati: per ricevere l\'assegno devi consegnare allo Stato un quadro molto dettagliato della tua vita (reddito, patrimonio, immobili, conti, composizione del nucleo) e iscriverti alla piattaforma SIISL, firmando un patto di attivazione con controlli e obblighi periodici. Sono dati sensibili sulla tua condizione economica concentrati in mano pubblica, con il rischio che servano anche a profilarti o a incrociare informazioni.',
        direzione: 'misto',
        indiretto: true,
        dirittoToccato: {
          carta: 'Carta UE dei diritti fondamentali',
          articolo: 'art. 8',
          diritto: 'protezione dei dati personali',
          intensita: 'lieve',
          url: 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:12012P/TXT'
        }
      },
      timeline: TIMELINE_STRUTTURALE,
      confidenza: 'probabile',
      noteConfidenza: 'È il prezzo "informativo" di quasi ogni sussidio: i dati sono trattati secondo il GDPR e devono servire solo a erogare e controllare l\'assegno (art. 8 della Carta UE dei diritti fondamentali). Intensità "lieve" perché la raccolta è prevista dalla legge e finalizzata, ma la condizionalità e i controlli restano un occhio costante sulla tua vita.',
      fonteRegola: FONTE
    }
  ]
};
