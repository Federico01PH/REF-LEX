import { Icona } from './Icona';

// Le due viste della stessa legge — com'è per te, com'è per gli altri — stanno sotto
// il titolo come due schede. Prima "per gli altri" era un bottone in fondo alla pagina,
// dopo le fonti, e non lo notava nessuno. Niente role="tab": non sono due pannelli
// nello stesso documento ma due schermate, e aria-current dice qual è quella aperta.
export function SchedeReport({ attiva, onTe, onAltri }: {
  attiva: 'te' | 'altri'; onTe: () => void; onAltri: () => void;
}) {
  return (
    <nav className="schede" aria-label="Chi guardare">
      <button className="scheda" aria-current={attiva === 'te' ? 'page' : undefined}
        onClick={attiva === 'te' ? undefined : onTe}>
        <Icona nome="persona" dimensione={16} /> Come tocca a te
      </button>
      <button className="scheda" aria-current={attiva === 'altri' ? 'page' : undefined}
        onClick={attiva === 'altri' ? undefined : onAltri}>
        <Icona nome="persone" dimensione={16} /> Come tocca agli altri
      </button>
    </nav>
  );
}
