import { useState } from 'react';
import type { Profilo } from '../engine/types';
import { DOMANDE } from '../data/wizard';
import { Icona } from '../ui/Icona';

export function Wizard({ iniziale, esploratore, onFine, onAnnulla }: {
  iniziale: Profilo | null; esploratore: boolean;
  onFine: (p: Profilo) => void; onAnnulla: () => void;
}) {
  const [indice, setIndice] = useState(0);
  const [bozza, setBozza] = useState<Partial<Profilo>>(iniziale ?? { schemaVersion: 1 });
  const domanda = DOMANDE[indice];
  const valore = bozza[domanda.campo];

  function avanza(prossimaBozza: Partial<Profilo>) {
    if (indice + 1 >= DOMANDE.length) onFine(prossimaBozza as Profilo);
    else { setBozza(prossimaBozza); setIndice((i) => i + 1); }
  }

  function seleziona(v: unknown) {
    if (domanda.tipo === 'multi') {
      const attuale = (valore as unknown[] | undefined) ?? [];
      const nuovo = attuale.includes(v) ? attuale.filter((x) => x !== v)
        : v === 'nessuna' ? ['nessuna'] : [...attuale.filter((x) => x !== 'nessuna'), v];
      setBozza({ ...bozza, [domanda.campo]: nuovo });
    } else {
      setBozza({ ...bozza, [domanda.campo]: v });
    }
  }

  const etaValida = domanda.campo !== 'eta' || (typeof valore === 'number' && valore >= 13 && valore <= 120);

  return (
    <div>
      {esploratore && <p className="badge badge-dipende">Modalità esploratore: stai creando un profilo ipotetico</p>}
      <div className="progress" role="progressbar" aria-valuemin={1} aria-valuemax={DOMANDE.length}
        aria-valuenow={indice + 1} aria-label={`Domanda ${indice + 1} di ${DOMANDE.length}`}>
        {DOMANDE.map((d, i) => (
          <span key={d.campo} className={i < indice ? 'fatto' : i === indice ? 'attuale' : ''} />
        ))}
      </div>
      <div className="card">
        <h1 style={{ fontSize: 22, marginTop: 0 }}>{domanda.titolo}</h1>
        {domanda.tipo === 'numero' && (
          <input type="number" inputMode="numeric" min={13} max={120} step={1} className="pill"
            style={{ width: '100%', fontSize: 20 }}
            aria-label={domanda.titolo}
            value={typeof valore === 'number' ? valore : ''}
            onChange={(e) => setBozza({ ...bozza, [domanda.campo]: e.target.value === '' ? undefined : Number(e.target.value) })} />
        )}
        {(domanda.tipo === 'scelta' || domanda.tipo === 'multi') && (
          <div role="group" aria-label={domanda.titolo}>
            {domanda.opzioni!.map((o) => {
              const selezionata = domanda.tipo === 'multi'
                ? ((valore as unknown[] | undefined) ?? []).includes(o.valore)
                : valore === o.valore;
              return (
                <button key={String(o.valore)} type="button" className="pill"
                  aria-pressed={selezionata} onClick={() => seleziona(o.valore)}>
                  {o.etichetta}
                </button>
              );
            })}
          </div>
        )}
        <p className="testo-piccolo" style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
          <Icona nome="info" dimensione={16} /> <span><b>Perché lo chiediamo:</b> {domanda.perche}</span>
        </p>
      </div>
      <div className="spazio" style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-secondario" style={{ flex: 1 }} onClick={onAnnulla}>Annulla</button>
        {!domanda.obbligatoria && (
          <button className="btn btn-secondario" style={{ flex: 1 }}
            onClick={() => {
              const { [domanda.campo]: _ignorato, ...resto } = bozza;
              avanza(resto as Partial<Profilo>);
            }}>
            Salta
          </button>
        )}
        <button className="btn" style={{ flex: 1 }} disabled={!etaValida} onClick={() => avanza(bozza)}>
          {indice + 1 >= DOMANDE.length ? 'Fine' : 'Avanti'}
        </button>
      </div>
    </div>
  );
}
