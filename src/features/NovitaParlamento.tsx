import type { NovitaFile } from '../engine/novita';
import type { StatoLegge } from '../engine/types';

const STATI: Record<StatoLegge, { etichetta: string; colore: string }> = {
  vigore: { etichetta: 'In vigore', colore: 'var(--verde)' },
  approvata: { etichetta: 'Appena approvata', colore: 'var(--teal)' },
  discussione: { etichetta: 'In discussione', colore: 'var(--giallo)' },
  bozza: { etichetta: 'Bozza', colore: 'var(--testo-2)' },
  referendum: { etichetta: 'Referendum', colore: 'var(--viola)' }
};

export function NovitaParlamento({ novita }: { novita: NovitaFile }) {
  return (
    <section aria-label="Novità dal Parlamento" className="spazio">
      <h2 style={{ fontSize: 19, marginBottom: 2 }}>Novità dal Parlamento</h2>
      <p className="testo-piccolo" style={{ marginTop: 0 }}>
        Dalle fonti ufficiali, aggiornato al {novita.generatoIl}. Non sono ancora simulabili: le stiamo verificando.
      </p>
      {novita.voci.map((voce) => {
        const stato = STATI[voce.stato];
        return (
          <article key={voce.id} className="card spazio" style={{ borderLeft: `4px solid ${stato.colore}`, padding: 12 }}>
            <span className="testo-piccolo" style={{ fontWeight: 800, color: stato.colore }}>{stato.etichetta}</span>
            <span style={{ display: 'block', fontWeight: 700 }}>{voce.titolo}</span>
            <span className="testo-piccolo">{voce.data} · <span className="badge badge-dipende">Simulazione in preparazione</span></span>
            <a className="testo-piccolo" style={{ display: 'block', marginTop: 4 }}
              href={voce.url} target="_blank" rel="noopener noreferrer">
              Leggi il testo ufficiale
            </a>
          </article>
        );
      })}
    </section>
  );
}
