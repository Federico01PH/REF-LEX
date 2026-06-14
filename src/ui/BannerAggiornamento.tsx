// Avviso non invasivo quando il service worker ha scaricato una nuova versione:
// l'utente decide quando ricaricare (clic su Aggiorna), invece di restare con la versione vecchia.
export function BannerAggiornamento({ pronto, onAggiorna }: { pronto: boolean; onAggiorna: () => void }) {
  if (!pronto) return null;
  return (
    <div className="banner-aggiornamento" role="status">
      <span>È disponibile una nuova versione di REF-LEX.</span>
      <button className="btn btn-piccolo" onClick={onAggiorna}>Aggiorna</button>
    </div>
  );
}
