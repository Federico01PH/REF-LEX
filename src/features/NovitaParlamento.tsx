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

export function NovitaParlamento({ novita, onRichiedi }: {
  novita: NovitaFile;
  onRichiedi?: (titolo: string, url: string) => void;
}) {
  const [tutte, setTutte] = useState(false);
  const voci = tutte ? novita.voci : novita.voci.slice(0, VOCI_IN_EVIDENZA);
  const nascoste = novita.voci.length - VOCI_IN_EVIDENZA;

  return (
    <section aria-label="Novità dal Parlamento" className="spazio">
      <h2 style={{ fontSize: 19, marginBottom: 2 }}>Novità dal Parlamento</h2>
      <p className="testo-piccolo" style={{ marginTop: 0 }}>
        Dalle fonti ufficiali, aggiornato al {dataLeggibile(novita.generatoIl)}. Queste non sono ancora
        simulabili: prima una persona del nostro team deve studiarle e tradurle in regole verificate,
        poi compaiono nel menu qui sopra. Se una ti interessa, chiedila: le richieste hanno la precedenza.
      </p>
      <div className="griglia-novita">
        {voci.map((voce) => {
          const stato = STATI[voce.stato];
          return (
            <article key={voce.id} className="card" style={{ borderLeft: `4px solid ${stato.colore}`, padding: 12 }}>
              <span className="testo-piccolo" style={{ fontWeight: 800, color: stato.colore }}>{stato.etichetta}</span>
              <span style={{ display: 'block', fontWeight: 700 }}>{voce.titolo}</span>
              <span className="testo-piccolo">{dataLeggibile(voce.data)} · <span className="badge badge-dipende">Non ancora simulabile</span></span>
              <a className="testo-piccolo" style={{ display: 'block', marginTop: 4 }}
                href={voce.url} target="_blank" rel="noopener noreferrer"
                aria-label={`Leggi il testo ufficiale: ${voce.titolo}`}>
                Leggi il testo ufficiale
              </a>
              {onRichiedi && (
                <button className="pill" style={{ marginTop: 8, marginLeft: 0 }}
                  onClick={() => onRichiedi(voce.titolo, voce.url)}>
                  Chiedila in simulazione
                </button>
              )}
            </article>
          );
        })}
      </div>
      {nascoste > 0 && (
        <button className="pill" style={{ marginTop: 12, marginLeft: 0 }} onClick={() => setTutte(!tutte)}>
          {tutte ? 'Mostra meno novità' : `Mostra tutte le novità (${novita.voci.length})`}
        </button>
      )}
    </section>
  );
}
