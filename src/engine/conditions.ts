import type { Profilo, Condizione, FasciaReddito, FasciaIsee } from './types';

const ORDINE_REDDITO: FasciaReddito[] = [
  'nessuno', 'fino9k', 'da9a15k', 'da15a20k', 'da20a28k', 'da28a35k', 'da35a50k', 'oltre50k'
];
const ORDINE_ISEE: FasciaIsee[] = ['fino9360', 'da9360a15k', 'da15a25k', 'da25a40k', 'oltre40k'];

function ordinale(campo: keyof Profilo, valore: unknown): number {
  if (typeof valore === 'number') return valore;
  if (campo === 'fasciaReddito') return ORDINE_REDDITO.indexOf(valore as FasciaReddito);
  if (campo === 'fasciaIsee') return ORDINE_ISEE.indexOf(valore as FasciaIsee);
  return NaN;
}

export function valutaCondizioni(profilo: Profilo, condizioni: Condizione[]): boolean {
  return condizioni.every((c) => {
    const v = profilo[c.campo];
    if (v === undefined) return false;
    switch (c.op) {
      case 'eq':
        return v === c.valore;
      case 'in': {
        const lista = c.valore as unknown[];
        if (Array.isArray(v)) return v.some((x) => lista.includes(x));
        return lista.includes(v);
      }
      case 'almeno':
        return ordinale(c.campo, v) >= ordinale(c.campo, c.valore);
      case 'alPiu':
        return ordinale(c.campo, v) <= ordinale(c.campo, c.valore);
    }
  });
}

export function campiMancanti(profilo: Profilo, necessari: (keyof Profilo)[]): (keyof Profilo)[] {
  return necessari.filter((campo) => {
    const v = profilo[campo];
    return v === undefined || (Array.isArray(v) && v.length === 0);
  });
}
