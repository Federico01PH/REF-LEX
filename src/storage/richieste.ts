// Richieste di simulazione scritte dall'utente: restano sul dispositivo
// (prefisso reflex. così "Cancella tutto" le elimina insieme al resto).

export interface RichiestaSimulazione {
  id: string;
  titolo: string;
  url?: string;
  creataIl: string; // ISO yyyy-mm-dd
}

const CHIAVE = 'reflex.richieste.v1';

export function caricaRichieste(): RichiestaSimulazione[] {
  try {
    const grezzo = localStorage.getItem(CHIAVE);
    if (!grezzo) return [];
    const dati = JSON.parse(grezzo);
    if (!Array.isArray(dati)) return [];
    return dati.filter((r) => r && typeof r.id === 'string' && typeof r.titolo === 'string');
  } catch {
    return [];
  }
}

function salva(lista: RichiestaSimulazione[]): void {
  try { localStorage.setItem(CHIAVE, JSON.stringify(lista)); } catch { /* modalità solo-sessione */ }
}

export function aggiungiRichiesta(titolo: string, url?: string): RichiestaSimulazione[] {
  const pulito = titolo.trim();
  const lista = caricaRichieste();
  if (!pulito || lista.some((r) => r.titolo === pulito)) return lista;
  const nuova: RichiestaSimulazione = {
    id: `richiesta-${Date.now()}-${lista.length}`,
    titolo: pulito,
    url,
    creataIl: new Date().toISOString().slice(0, 10)
  };
  const aggiornata = [...lista, nuova];
  salva(aggiornata);
  return aggiornata;
}

export function rimuoviRichiesta(id: string): RichiestaSimulazione[] {
  const aggiornata = caricaRichieste().filter((r) => r.id !== id);
  salva(aggiornata);
  return aggiornata;
}
