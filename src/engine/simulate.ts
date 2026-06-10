import type { Legge, Orizzonte, Profilo, Rilevanza, RisultatoSimulazione } from './types';
import { ORIZZONTI } from './types';
import { campiMancanti, valutaCondizioni } from './conditions';

export function simula(profilo: Profilo, legge: Legge): RisultatoSimulazione {
  const risultato: RisultatoSimulazione = {
    leggeId: legge.id, effetti: [], nonCalcolabili: [],
    totaleMese: { anno1: { min: 0, max: 0 }, anno2: { min: 0, max: 0 }, anno5: { min: 0, max: 0 }, anno10: { min: 0, max: 0 } }
  };

  for (const regola of legge.regole) {
    const mancanti = campiMancanti(profilo, regola.campiNecessari);
    if (mancanti.length > 0) {
      // non calcolabile solo se le condizioni sui campi presenti non escludono già il profilo
      const condizioniValutabili = regola.condizioni.filter((c) => !mancanti.includes(c.campo));
      if (valutaCondizioni(profilo, condizioniValutabili)) {
        risultato.nonCalcolabili.push({ regola, campiMancanti: mancanti });
      }
      continue;
    }
    if (valutaCondizioni(profilo, regola.condizioni)) risultato.effetti.push(regola);
  }

  for (const orizzonte of ORIZZONTI) {
    for (const regola of risultato.effetti) {
      if (regola.confidenza === 'dipende') continue;
      if (regola.effetto.direzione !== 'positivo' && regola.effetto.direzione !== 'negativo') continue;
      if (regola.timeline[orizzonte] !== 'attivo') continue;
      const importo = regola.effetto.importoMese;
      if (!importo) continue;
      const segno = regola.effetto.direzione === 'negativo' ? -1 : 1;
      risultato.totaleMese[orizzonte].min += segno * (segno < 0 ? importo.max : importo.min);
      risultato.totaleMese[orizzonte].max += segno * (segno < 0 ? importo.min : importo.max);
    }
  }
  return risultato;
}

export function rilevanza(profilo: Profilo, legge: Legge): Rilevanza {
  const r = simula(profilo, legge);
  if (r.effetti.some((e) => e.confidenza !== 'dipende')) return 'alta';
  if (r.effetti.length > 0 || r.nonCalcolabili.length > 0) return 'media';
  return 'bassa';
}

export function orizzonteEtichetta(o: Orizzonte): string {
  return { anno1: '1 anno', anno2: '2 anni', anno5: '5 anni', anno10: '10 anni' }[o];
}
