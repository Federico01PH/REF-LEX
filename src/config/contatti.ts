// Indirizzo che riceve richieste di simulazione e segnalazioni.
// L'invio avviene dall'app di posta dell'utente (mailto): nessun server, nessun dato nascosto.
export const EMAIL_CONTATTO = '115112@proton.me';

export function creaMailto(oggetto: string, corpo: string): string {
  return `mailto:${EMAIL_CONTATTO}?subject=${encodeURIComponent(oggetto)}&body=${encodeURIComponent(corpo)}`;
}
