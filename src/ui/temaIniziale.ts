// Decide se mostrare il tema scuro o chiaro a partire dalla scelta salvata
// e dalla preferenza di sistema. 'auto' (o valore mancante/ignoto) segue il sistema.
// NB: la stessa logica è replicata in public/tema.js per applicarla prima del paint
// (evita il lampo bianco all'avvio in tema scuro). Se cambia qui, aggiorna anche lì.
export function risolviTema(temaSalvato: string | null, sistemaScuro: boolean): 'dark' | 'light' {
  if (temaSalvato === 'dark') return 'dark';
  if (temaSalvato === 'light') return 'light';
  return sistemaScuro ? 'dark' : 'light';
}
