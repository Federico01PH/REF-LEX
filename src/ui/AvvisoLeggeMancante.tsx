// Mostrato quando l'id di una legge non esiste più nel catalogo
// (es. il catalogo remoto è cambiato mentre l'utente era su un report):
// invece di crashare con schermo bianco, avvisa e riporta al catalogo.
export function AvvisoLeggeMancante({ onIndietro }: { onIndietro: () => void }) {
  return (
    <div className="home">
      <h2>Legge non più disponibile</h2>
      <p className="motto">
        Questa legge non è più nel catalogo: forse è stata aggiornata o sostituita.
        Torna all'elenco per sceglierne un'altra.
      </p>
      <button className="btn" onClick={onIndietro}>Torna al catalogo</button>
    </div>
  );
}
