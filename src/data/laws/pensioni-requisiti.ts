import type { Condizione, Legge, Regola } from '../../engine/types';

// Verified from: L. 199/2025 (Bilancio 2026) + circolare INPS 19/2026
// Verification date: 2026-06-11
//
// Requisiti 2026: vecchiaia 67 anni + 20 di contributi; anticipata 42a10m (uomini) / 41a10m (donne).
// Adeguamento speranza di vita: +1 mese dal 2027, +2 ulteriori dal 2028 (67 anni e 3 mesi);
//   esclusi i lavori gravosi/usuranti.
// Ape sociale prorogata per il 2026: 63 anni e 5 mesi + 30 anni di contributi
//   (disoccupati, caregiver, invalidi >= 74%) o 36 (lavori gravosi). Proroga ANNUALE, non strutturale.
// Opzione donna e Quota 103: NON rinnovate (chiuse a chi non ha maturato i requisiti entro il 2024/2025).

const FONTE = {
  etichetta: 'L. 199/2025 (Bilancio 2026) e circolare INPS 19/2026',
  url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2025;199'
};

const LAVORATORI: Condizione = {
  campo: 'condizioneLavorativa', op: 'in',
  valore: ['dipendente-privato', 'dipendente-pubblico', 'autonomo-ordinario', 'forfettario', 'imprenditore', 'disoccupato', 'caregiver', 'casalingo', 'altro']
};

// chi è GIÀ in pensione non è toccato dalle regole sull'età FUTURA di pensionamento,
// anche se accanto alla pensione ha ancora un lavoro: per lui vale solo "già pensionato".
const NON_PENSIONATO: Condizione = { campo: 'condizioneLavorativa', op: 'nonContiene', valore: ['pensionato'] };

function regolaVecchiaia(id: string, etaMin: number, etaMax: number, orizzonte: 'anno1' | 'anno5' | 'anno10', descrizione: string): Regola {
  return {
    id,
    campiNecessari: ['eta', 'condizioneLavorativa'],
    condizioni: [
      LAVORATORI,
      NON_PENSIONATO,
      { campo: 'eta', op: 'almeno', valore: etaMin },
      { campo: 'eta', op: 'alPiu', valore: etaMax }
    ],
    effetto: { tipo: 'diritto', descrizione, direzione: 'positivo' },
    timeline: {
      anno1: orizzonte === 'anno1' ? 'attivo' : 'nullo',
      anno2: orizzonte === 'anno1' ? 'attivo' : 'nullo',
      anno5: orizzonte === 'anno10' ? 'nullo' : 'attivo',
      anno10: 'attivo'
    },
    confidenza: 'probabile',
    noteConfidenza: 'Per la pensione di vecchiaia servono anche almeno 20 anni di contributi versati, un dato che non ti chiediamo: la data esatta dipende dalla tua storia contributiva.',
    fonteRegola: FONTE
  };
}

export const pensioniRequisiti: Legge = {
  id: 'pensioni-requisiti-2026',
  titoloDivulgativo: 'Quando potrai andare in pensione: i requisiti aggiornati',
  titoloUfficiale: 'Legge 30 dicembre 2025, n. 199 (Bilancio 2026), disposizioni su requisiti pensionistici e Ape sociale',
  meseAnno: 'dicembre 2025',
  stato: 'vigore',
  ambiti: ['pensioni-welfare'],
  fonti: [
    FONTE,
    {
      etichetta: 'INPS — Legge di bilancio 2026: le novità sulle pensioni',
      url: 'https://www.inps.it/it/it/inps-comunica/notizie/dettaglio-news-page.news.2026.02.legge-di-bilancio-2026-le-novit-sulle-pensioni.html'
    }
  ],
  verificataIl: '2026-06-11',
  riassunto: 'Nel 2026 si va in pensione di vecchiaia a 67 anni con 20 di contributi. Dal 2027 l\'età sale di 1 mese e dal 2028 di altri 2 (67 anni e 3 mesi), tranne per i lavori pesanti. L\'Ape sociale (uscita a 63 anni e 5 mesi per disoccupati, caregiver e invalidi) è prorogata solo per il 2026. Opzione donna e Quota 103 sono finite.',
  regole: [
    {
      id: 'pensioni-gia-pensionato',
      campiNecessari: ['condizioneLavorativa'],
      condizioni: [{ campo: 'condizioneLavorativa', op: 'in', valore: ['pensionato'] }],
      effetto: {
        tipo: 'servizio',
        descrizione: 'Sei già in pensione: i nuovi requisiti non ti toccano. La tua pensione non cambia per effetto di questa legge.',
        direzione: 'neutro'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa',
      fonteRegola: FONTE
    },
    {
      id: 'pensioni-adeguamento-speranza-vita',
      campiNecessari: ['eta', 'condizioneLavorativa'],
      condizioni: [LAVORATORI, NON_PENSIONATO, { campo: 'eta', op: 'alPiu', valore: 66 }],
      effetto: {
        tipo: 'dovere',
        descrizione: 'L\'età della pensione di vecchiaia sale: +1 mese dal 2027 e altri +2 mesi dal 2028 (in totale 67 anni e 3 mesi). Lavorerai fino a 3 mesi in più rispetto alle regole del 2026. Sono esclusi i lavori gravosi e usuranti.',
        direzione: 'negativo'
      },
      timeline: { anno1: 'nullo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa',
      noteConfidenza: 'L\'aumento è scritto nella legge di bilancio 2026. Calcolo "a parità di leggi future": un nuovo adeguamento biennale potrà scattare dal 2029.',
      fonteRegola: FONTE
    },
    {
      id: 'pensioni-ape-sociale',
      campiNecessari: ['eta', 'condizioneLavorativa'],
      condizioni: [
        { campo: 'eta', op: 'almeno', valore: 63 },
        { campo: 'condizioneLavorativa', op: 'in', valore: ['disoccupato', 'caregiver'] },
        NON_PENSIONATO
      ],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Con l\'Ape sociale puoi chiedere un\'indennità ponte e uscire dal lavoro a 63 anni e 5 mesi, prima della pensione di vecchiaia.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'attivo', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'Servono almeno 30 anni di contributi (un dato che non ti chiediamo) e la proroga vale solo fino al 31 dicembre 2026: per gli anni dopo servirà una nuova legge.',
      fonteRegola: FONTE
    },
    regolaVecchiaia('pensioni-vecchiaia-66', 66, 120, 'anno1',
      'Hai già raggiunto (o stai per raggiungere) i 67 anni: se hai almeno 20 anni di contributi, la pensione di vecchiaia è a portata di mano.'),
    regolaVecchiaia('pensioni-vecchiaia-62-65', 62, 65, 'anno5',
      'Raggiungerai l\'età della pensione di vecchiaia (67 anni e 3 mesi dal 2028) entro i prossimi 5 anni.'),
    regolaVecchiaia('pensioni-vecchiaia-57-61', 57, 61, 'anno10',
      'Raggiungerai l\'età della pensione di vecchiaia (67 anni e 3 mesi dal 2028) entro i prossimi 10 anni.')
  ]
};
