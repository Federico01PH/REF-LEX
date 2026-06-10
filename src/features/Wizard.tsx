import type { Profilo } from '../engine/types';

export function Wizard(_props: {
  iniziale: Profilo | null;
  esploratore: boolean;
  onFine: (p: Profilo) => void;
  onAnnulla: () => void;
}) {
  return <h1>Il tuo profilo</h1>;
}
