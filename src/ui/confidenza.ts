import type { Confidenza } from '../engine/types';

// Le parole dei badge devono spiegarsi da sole: "Certo / Probabile / Dipende"
// costringeva a leggere una legenda che nessuno apriva. Stanno qui, in un posto
// solo, perché il report e "per gli altri" non possano più divergere.
export const CONFIDENZA: Record<Confidenza, { classe: string; parola: string; spiega: string }> = {
  certa: { classe: 'badge-certa', parola: 'Sicuro', spiega: 'è già legge' },
  probabile: { classe: 'badge-probabile', parola: 'Quasi sicuro', spiega: 'manca un passaggio' },
  dipende: { classe: 'badge-dipende', parola: 'Dipende da te', spiega: 'cambia secondo il tuo caso' }
};

export const LIVELLI: Confidenza[] = ['certa', 'probabile', 'dipende'];
