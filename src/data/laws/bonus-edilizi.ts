import type { Legge } from '../../engine/types';

// Verified from: art. 16-bis TUIR come modificato da L. 207/2024 e L. 199/2025 (Bilancio 2026);
// guida Agenzia delle Entrate "Ristrutturazioni edilizie" (febbraio 2026).
// Verification date: 2026-06-11
//
// 2026: detrazione 50% sull'abitazione principale, 36% sulle altre case;
//   tetto di spesa 96.000 € per unità; recupero in 10 quote annuali.
//   Massimo teorico: 50% × 96.000 / 10 anni / 12 mesi = 400 €/mese (prima casa);
//   36% × 96.000 / 10 / 12 = 288 €/mese (altre case).
// Dal 2027: aliquote in discesa (36% prima casa, 30% altre), salvo nuove proroghe.
// Caldaie solo a combustibili fossili: escluse dalla detrazione (2025-2027).
// Possono usarla proprietari ma anche inquilini e comodatari che pagano i lavori.

const FONTE = {
  etichetta: 'Art. 16-bis TUIR e L. 199/2025; guida Agenzia delle Entrate (febbraio 2026)',
  url: 'https://www.agenziaentrate.gov.it/portale/web/guest/aree-tematiche/casa/agevolazioni/ristrutturazioni-edilizie'
};

const NOTA_2027 =
  'La detrazione esiste di sicuro per le spese 2026; dal 2027 le aliquote scendono (36% prima casa, 30% altre) salvo nuove proroghe. Quanto recuperi dipende da quanto spendi: il massimo è su 96.000 euro di lavori, rimborsati in 10 anni.';

export const bonusEdilizi: Legge = {
  id: 'bonus-edilizi-2026',
  titoloDivulgativo: 'Bonus ristrutturazioni: metà dei lavori di casa scaricata dalle tasse',
  titoloUfficiale: 'Art. 16-bis del TUIR (DPR 917/1986), aggiornato dalla L. 207/2024 e dalla L. 199/2025',
  stato: 'vigore',
  ambito: 'casa',
  fonti: [FONTE],
  verificataIl: '2026-06-11',
  riassunto: 'Chi fa lavori in casa nel 2026 recupera dalle tasse il 50% della spesa se è l\'abitazione principale (36% per le altre case), fino a 96.000 euro di lavori, restituiti in 10 anni. Vale anche per inquilini e comodatari che pagano i lavori. Le caldaie solo a gas o gasolio sono escluse. Dal 2027 le percentuali scendono, salvo proroghe.',
  regole: [
    {
      id: 'bonus-edilizi-proprietario',
      campiNecessari: ['abitazione'],
      condizioni: [{ campo: 'abitazione', op: 'eq', valore: 'proprieta' }],
      effetto: {
        tipo: 'economico',
        importoMese: { min: 0, max: 400 },
        descrizione: 'Se ristrutturi casa tua nel 2026 recuperi il 50% della spesa in 10 anni: fino a 400 euro al mese di tasse in meno (con il tetto massimo di 96.000 euro di lavori sull\'abitazione principale).',
        direzione: 'positivo'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: NOTA_2027,
      fonteRegola: FONTE
    },
    {
      id: 'bonus-edilizi-inquilino',
      campiNecessari: ['abitazione'],
      condizioni: [{ campo: 'abitazione', op: 'in', valore: ['affitto', 'comodato'] }],
      effetto: {
        tipo: 'economico',
        importoMese: { min: 0, max: 400 },
        descrizione: 'Anche chi è in affitto o in comodato può usare il bonus, se paga i lavori con il consenso del proprietario: 50% di detrazione se è la tua abitazione principale.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: NOTA_2027,
      fonteRegola: FONTE
    }
  ]
};
