import type { Profilo, Legge } from '../engine/types';

export function Report(_props: {
  profilo: Profilo;
  legge: Legge;
  esploratore: boolean;
  onAltri: () => void;
  onIndietro: () => void;
}) {
  return <h1>Il tuo report</h1>;
}
