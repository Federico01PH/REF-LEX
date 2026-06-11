import type { Legge } from '../engine/types';
import { PERSONAGGI } from '../data/personas';
import { simula } from '../engine/simulate';
import { Icona } from '../ui/Icona';

const CONFIDENZA = {
  certa: { classe: 'badge-certa', parola: 'Certo' },
  probabile: { classe: 'badge-probabile', parola: 'Probabile' },
  dipende: { classe: 'badge-dipende', parola: 'Dipende' }
} as const;

export function Empatia({ legge, onCreaIpotetico, onIndietro }: {
  legge: Legge; onCreaIpotetico: () => void; onIndietro: () => void;
}) {
  return (
    <div>
      <button className="btn btn-secondario" onClick={onIndietro} style={{ width: 'auto', display: 'inline-flex', gap: 6 }}>
        <Icona nome="indietro" dimensione={16} /> Il mio report
      </button>
      <h1 style={{ fontSize: 24 }}>E per gli altri?</h1>
      <p>La stessa legge, vista con gli occhi di otto persone diverse.</p>
      {PERSONAGGI.map((p) => {
        const r = simula(p.profilo, legge);
        const totale = r.totaleMese.anno1;
        const haEconomico = r.effetti.some((e) => e.confidenza !== 'dipende' && e.effetto.importoMese);
        const haAltro = r.effetti.length > 0;
        const coloreImporto = totale.min >= 0
          ? 'var(--verde)'
          : totale.max <= 0
            ? 'var(--rosso)'
            : 'var(--arancio)';
        return (
          <article key={p.id} className="card spazio">
            <h2 style={{ fontSize: 17, margin: 0, display: 'flex', gap: 8, alignItems: 'center' }}>
              <Icona nome="persona" /> {p.nome}
            </h2>
            <p className="testo-piccolo" style={{ margin: '4px 0' }}>{p.descrizione}</p>
            {haEconomico ? (
              <p style={{ fontWeight: 900, fontSize: 20, margin: 0, color: coloreImporto }}>
                {totale.min === totale.max
                  ? `${totale.min > 0 ? '+' : ''}${totale.min} €`
                  : `da ${totale.min > 0 ? '+' : ''}${totale.min} a ${totale.max > 0 ? '+' : ''}${totale.max} €`} al mese{' '}
                <span className="testo-piccolo" style={{ fontWeight: 600 }}>(stima al 1° anno)</span>
              </p>
            ) : haAltro ? (
              <div>
                {r.effetti.map((e) => (
                  <p key={e.id} style={{ fontWeight: 700, margin: '4px 0 0' }}>
                    <span className={`badge ${CONFIDENZA[e.confidenza].classe}`}>{CONFIDENZA[e.confidenza].parola}</span>{' '}
                    {e.effetto.descrizione}
                  </p>
                ))}
              </div>
            ) : (
              <p style={{ fontWeight: 700, margin: 0, color: 'var(--testo-2)' }}>Nessun effetto per questa persona.</p>
            )}
          </article>
        );
      })}
      <button className="btn btn-secondario spazio" onClick={onCreaIpotetico}
        style={{ borderStyle: 'dashed', display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
        <Icona nome="persone" /> Crea un profilo ipotetico
      </button>
    </div>
  );
}
