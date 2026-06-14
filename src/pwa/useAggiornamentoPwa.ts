import { useEffect, useState } from 'react';

// Registra il service worker e segnala quando è pronta una nuova versione.
// Niente reload automatico: l'utente decide quando aggiornare (vedi BannerAggiornamento).
// In dev/test non c'è service worker, quindi l'hook resta inerte.
export function useAggiornamentoPwa(): { pronto: boolean; aggiorna: () => void } {
  const [pronto, setPronto] = useState(false);
  const [aggiorna, setAggiorna] = useState<() => void>(() => () => {});

  useEffect(() => {
    if (!import.meta.env.PROD) return;
    let annullato = false;
    import('virtual:pwa-register')
      .then(({ registerSW }) => {
        const updateSW = registerSW({
          onNeedRefresh() { if (!annullato) setPronto(true); }
        });
        if (!annullato) setAggiorna(() => () => updateSW(true)); // updateSW(true) attiva il nuovo SW e ricarica
      })
      .catch(() => { /* il service worker non è disponibile: l'app funziona comunque */ });
    return () => { annullato = true; };
  }, []);

  return { pronto, aggiorna };
}
