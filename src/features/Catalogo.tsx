import type { Profilo } from '../engine/types';

export function Catalogo(_props: {
  profilo: Profilo;
  esploratore: boolean;
  onScegli: (id: string) => void;
  onModificaProfilo: () => void;
  onPrivacy: () => void;
  onEsciEsploratore: () => void;
}) {
  return <h1>Scegli una legge</h1>;
}
