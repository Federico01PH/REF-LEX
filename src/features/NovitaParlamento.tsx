import { useState } from 'react';
import type { NovitaFile } from '../engine/novita';
import { ambitiNovita } from '../engine/novita';
import type { Ambito, StatoLegge } from '../engine/types';
import { dataLeggibile, titoloNovitaBreve } from '../ui/formato';

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
export function NovitaParlamento({ novita, ambito = 'tutte', onRichiedi }: {
  novita: NovitaFile;
  ambito?: Ambito | 'tutte';
  onRichiedi?: (titolo: string, url: string) => void;
}) {
  const [tutte, setTutte] = useState(false);
  const filtrate = ambito === 'tutte'
    ? novita.voci
    : novita.voci.filter((v) => ambitiNovita(v.titolo).includes(ambito));
  const voci = tutte ? filtrate : filtrate.slice(0, VOCI_IN_EVIDENZA);
  const nascoste = filtrate.length - VOCI_IN_EVIDENZA;

  return (
    <section aria-label="Novità dal Parlamento" className="spazio">
      <h2 style={{ fontSize: 17, marginBottom: 2 }}>Novità dal Parlamento</h2>
      <p className="testo-piccolo" style={{ marginTop: 0 }}>
        Dalle fonti ufficiali, aggiornato al {dataLeggibile(novita.generatoIl)}. Non ancora simulabili:
        prima le studiamo e le traduciamo in regole verificate. Se una ti interessa, chiedila: ha la precedenza.
      </p>
      {filtrate.length === 0 && (
        <p className="testo-piccolo" style={{ marginBottom: 0 }}>
          Per questo argomento non ci sono novità in arrivo dal Parlamento in questo momento.
        </p>
      )}
      <div className="lista-novita">
        {voci.map((voce) => {
          const stato = STATI[voce.stato];
          const breve = titoloNovitaBreve(voce.titolo);
          const haDettaglio = breve !== voce.titolo;
          return (
            <article key={voce.id} className="voce-novita" style={{ borderLeft: `3px solid ${stato.colore}` }}>
              {haDettaglio ? (
                <details className="novita-titolo">
                  <summary><b>{breve}</b></summary>
                  <span className="testo-piccolo">{voce.titolo}</span>
                </details>
              ) : (
                <span style={{ fontWeight: 700 }}>{breve}</span>
              )}
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
          {tutte ? 'Mostra meno novità' : `Mostra tutte le novità (${filtrate.length})`}
        </button>
      )}
    </section>
  );
}
