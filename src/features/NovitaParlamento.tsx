import { useState } from 'react';
import type { NovitaFile } from '../engine/novita';
import type { StatoLegge } from '../engine/types';
import { dataLeggibile } from '../ui/formato';

const STATI: Record<StatoLegge, { etichetta: string; colore: string }> = {
  vigore: { etichetta: 'In vigore', colore: 'var(--verde)' },
  approvata: { etichetta: 'Appena approvata', colore: 'var(--teal)' },
  discussione: { etichetta: 'In discussione', colore: 'var(--giallo)' },
  bozza: { etichetta: 'Bozza', colore: 'var(--testo-2)' },
  referendum: { etichetta: 'Referendum', colore: 'var(--viola)' }
};

const VOCI_IN_EVIDENZA = 3;

// Sezione volutamente compatta: righe sottili invece di card, per non rubare
// spazio all'azione principale (scegliere una legge da simulare).
export function NovitaParlamento({ novita, onRichiedi }: {
  novita: NovitaFile;
  onRichiedi?: (titolo: string, url: string) => void;
}) {
  const [tutte, setTutte] = useState(false);
  const voci = tutte ? novita.voci : novita.voci.slice(0, VOCI_IN_EVIDENZA);
  const nascoste = novita.voci.length - VOCI_IN_EVIDENZA;

  return (
    <section aria-label="Novità dal Parlamento" className="spazio">
      <h2 style={{ fontSize: 17, marginBottom: 2 }}>Novità dal Parlamento</h2>
      <p className="testo-piccolo" style={{ marginTop: 0 }}>
        Dalle fonti ufficiali, aggiornato al {dataLeggibile(novita.generatoIl)}. Non ancora simulabili:
        prima le studiamo e le traduciamo in regole verificate. Se una ti interessa, chiedila: ha la precedenza.
      </p>
      <div className="lista-novita">
        {voci.map((voce) => {
          const stato = STATI[voce.stato];
          return (
            <article key={voce.id} className="voce-novita" style={{ borderLeft: `3px solid ${stato.colore}` }}>
              <span style={{ fontWeight: 700 }}>{voce.titolo}</span>
              <span className="testo-piccolo" style={{ display: 'block', marginTop: 2 }}>
                <span style={{ fontWeight: 800, color: stato.colore }}>{stato.etichetta}</span>
                {' '}· {dataLeggibile(voce.data)} · Non ancora simulabile
                {' '}·{' '}
                <a href={voce.url} target="_blank" rel="noopener noreferrer"
                  aria-label={`Leggi il testo ufficiale: ${voce.titolo}`}>
                  Leggi il testo ufficiale
                </a>
                {onRichiedi && (
                  <>
                    {' '}·{' '}
                    <button className="collegamento testo-piccolo"
                      onClick={() => onRichiedi(voce.titolo, voce.url)}>
                      Chiedila in simulazione
                    </button>
                  </>
                )}
              </span>
            </article>
          );
        })}
      </div>
      {nascoste > 0 && (
        <button className="pill" style={{ marginTop: 10, marginLeft: 0 }} onClick={() => setTutte(!tutte)}>
          {tutte ? 'Mostra meno novità' : `Mostra tutte le novità (${novita.voci.length})`}
        </button>
      )}
    </section>
  );
}
