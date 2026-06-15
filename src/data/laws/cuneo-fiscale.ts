import type { Condizione, Legge, Regola } from '../../engine/types';

// Verified from: L. 207/2024, art. 1, commi 4-9 (Normattiva, linknetsrl.it)
// Verification date: 2026-06-10
//
// SOMMA INTEGRATIVA (comma 4, reddito <= 20.000 €):
//   <=  8.500 €: 7,1%  → max = 7,1% × 8.500 / 12 =  50 €/mese (ottimale a 8.500; sopra cala al 5,3%)
//   8.501-15.000 €: 5,3% → min = 5,3% × 9.000 / 12 = 40; max = 5,3% × 15.000 / 12 = 66 €/mese
//   15.001-20.000 €: 4,8% → min = 4,8% × 15.000 / 12 = 60; max = 4,8% × 20.000 / 12 = 80 €/mese
//
// DETRAZIONE AGGIUNTIVA (commi 6-7, reddito > 20.000 €):
//   20.001-32.000 €: 1.000 €/anno fissi → 1.000/12 = 83 €/mese
//   32.001-40.000 €: 1.000 × (40.000 − reddito) / 8.000 → a 35.000 = 625/12 = 52; a 40.000 = 0
//   > 40.000 €: 0

const DIPENDENTI: Condizione = {
  campo: 'condizioneLavorativa', op: 'in', valore: ['dipendente-privato', 'dipendente-pubblico']
};

const FONTE = {
  etichetta: 'L. 207/2024, art. 1, commi 4-9 (Normattiva)',
  url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2024-12-30;207'
};

const TIMELINE_STRUTTURALE = {
  anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo'
} as const;

function regolaFascia(
  id: string, fascia: string, min: number, max: number, descrizione: string
): Regola {
  return {
    id,
    campiNecessari: ['condizioneLavorativa', 'fasciaReddito'],
    condizioni: [DIPENDENTI, { campo: 'fasciaReddito', op: 'eq', valore: fascia }],
    effetto: { tipo: 'economico', importoMese: { min, max }, descrizione, direzione: 'positivo' },
    timeline: TIMELINE_STRUTTURALE,
    confidenza: 'certa',
    noteConfidenza: 'Misura resa strutturale dalla legge di bilancio 2025; il valore esatto dipende dal tuo reddito preciso dentro la fascia. Calcolo "a parità di leggi future".',
    fonteRegola: FONTE
  };
}

export const cuneoFiscale: Legge = {
  id: 'cuneo-fiscale-2025',
  titoloDivulgativo: 'Taglio del cuneo fiscale per i dipendenti',
  titoloUfficiale: 'Legge 30 dicembre 2024, n. 207, art. 1, commi 4-9 (Bilancio 2025)',
  meseAnno: 'dicembre 2024',
  stato: 'vigore',
  ambiti: ['fisco-lavoro'],
  fonti: [
    FONTE,
    {
      etichetta: 'Scheda Camera dei deputati',
      url: 'https://temi.camera.it/leg19/temi/il-taglio-del-cuneo-fiscale.html'
    }
  ],
  verificataIl: '2026-06-10',
  riassunto: 'Chi lavora come dipendente paga meno tasse sullo stipendio: fino a 20.000 di reddito arriva una somma extra in busta paga (dal 4,8% al 7,1% del reddito); tra 20.000 e 32.000 euro una detrazione di 1.000 euro l\'anno, che si riduce fino a sparire a 40.000 euro.',
  regole: [
    // Somma integrativa 7,1% per redditi <= 8.500; 5,3% da 8.500 a 9.000 (soglia banda)
    // max nella banda: 7,1% × 8.500 / 12 = 603,5 / 12 = 50 €/mese (il massimo assoluto e' a 8.500)
    // min: 0 (reddito zero)
    regolaFascia('cuneo-fino9k', 'fino9k', 0, 50,
      'Somma extra in busta paga: 7,1% del reddito fino a 8.500 euro, poi 5,3% fino a 9.000 euro.'),

    // Somma integrativa 5,3% per 9.001-15.000 €
    // min = 5,3% × 9.000 / 12 = 477 / 12 = 39,75 → 40 €/mese
    // max = 5,3% × 15.000 / 12 = 795 / 12 = 66,25 → 66 €/mese
    regolaFascia('cuneo-9-15k', 'da9a15k', 40, 66,
      'Somma extra in busta paga: 5,3% del reddito (9.000-15.000 euro).'),

    // Somma integrativa 4,8% per 15.001-20.000 €
    // min = 4,8% × 15.000 / 12 = 720 / 12 = 60 €/mese
    // max = 4,8% × 20.000 / 12 = 960 / 12 = 80 €/mese
    regolaFascia('cuneo-15-20k', 'da15a20k', 60, 80,
      'Somma extra in busta paga: 4,8% del reddito (15.000-20.000 euro).'),

    // Detrazione 1.000 €/anno fissa per 20.001-32.000 €
    // 1.000 / 12 = 83,33 → 83 €/mese
    regolaFascia('cuneo-20-28k', 'da20a28k', 83, 83,
      'Detrazione fissa di 1.000 euro l\'anno sull\'IRPEF.'),

    // Detrazione per 28.001-35.000 €:
    // - da 28.001 a 32.000: ancora piena = 1.000 €/anno = 83 €/mese
    // - da 32.001 a 35.000: décalage; a 35.000 = 1.000 × (40.000-35.000)/8.000 = 625 €/anno = 52 €/mese
    // min (estremo superiore della banda: 35.000) = 52 €/mese; max = 83 €/mese
    regolaFascia('cuneo-28-35k', 'da28a35k', 52, 83,
      'Detrazione piena di 1.000 euro/anno fino a 32.000 euro, poi in riduzione (formula: 1.000 × (40.000 - reddito) / 8.000).'),

    // Detrazione per 35.001-50.000 €:
    // - da 35.001 a 40.000: décalage; a 35.001 ≈ 52 €/mese; a 40.000 = 0 €/mese
    // - oltre 40.000: nessun beneficio
    // min = 0 (a 40.000+); max ≈ 52 (al bordo inferiore 35.001)
    regolaFascia('cuneo-35-50k', 'da35a50k', 0, 52,
      'Detrazione residua in riduzione: da circa 52 euro/mese a 35.000 euro fino a zero a 40.000 euro; oltre, nessun beneficio.')
  ]
};
