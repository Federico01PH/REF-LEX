import { useState } from 'react';
import type { Legge, Profilo, RisultatoSimulazione } from '../engine/types';
import { PERSONAGGI } from '../data/personas';
import { simula } from '../engine/simulate';
import { Icona } from '../ui/Icona';
import { descrizioneConEnfasi } from '../ui/enfasi';

const CONFIDENZA = {
  certa: { classe: 'badge-certa', parola: 'Certo' },
  probabile: { classe: 'badge-probabile', parola: 'Probabile' },
  dipende: { classe: 'badge-dipende', parola: 'Dipende' }
} as const;

// il report del singolo profilo, mostrato solo quando si apre la sua scheda
function DettaglioPersona({ r, legge }: { r: RisultatoSimulazione; legge: Legge }) {
  const totale = r.totaleMese.anno1;
  const haEconomico = r.effetti.some((e) => e.confidenza !== 'dipende' && e.effetto.importoMese);
  const coloreImporto = totale.min >= 0 ? 'var(--verde)' : totale.max <= 0 ? 'var(--rosso)' : 'var(--arancio)';
  return (
    <div>
      {haEconomico ? (
        <p style={{ fontWeight: 900, fontSize: 20, margin: '8px 0 0', color: coloreImporto }}>
          {totale.min === totale.max
            ? `${totale.min > 0 ? '+' : ''}${totale.min} €`
            : `da ${totale.min > 0 ? '+' : ''}${totale.min} a ${totale.max > 0 ? '+' : ''}${totale.max} €`} al mese{' '}
          <span className="testo-piccolo" style={{ fontWeight: 600 }}>(stima al 1° anno)</span>
        </p>
      ) : (
        r.effetti.map((e) => (
          <p key={e.id} style={{ margin: '8px 0 0' }}>
            <span className={`badge ${CONFIDENZA[e.confidenza].classe}`}>{CONFIDENZA[e.confidenza].parola}</span>{' '}
            {descrizioneConEnfasi(e.effetto.descrizione)}
          </p>
        ))
      )}
      <p className="testo-piccolo" style={{ margin: '8px 0 0' }}>
        Fonti:{' '}
        {legge.fonti.map((f, i) => (
          <span key={f.url}>{i > 0 && ' · '}<a href={f.url} target="_blank" rel="noopener noreferrer">{f.etichetta}</a></span>
        ))}
      </p>
    </div>
  );
}

// firma degli effetti: l'insieme delle regole che scattano. Due profili con la stessa firma
// vedono lo stesso identico report (gli effetti sono fissi per regola), quindi è inutile
// mostrarli entrambi: "E per gli altri?" serve a far vedere chi cambia in modo DIVERSO.
function firmaEffetti(r: RisultatoSimulazione): string {
  return r.effetti.map((e) => e.id).sort().join('|');
}

export function Empatia({ profilo, legge, onCreaIpotetico, onIndietro }: {
  profilo?: Profilo; legge: Legge; onCreaIpotetico: () => void; onIndietro: () => void;
}) {
  // a chi fa la simulazione mostriamo solo gli ALTRI casi: profili a cui questa legge cambia
  // qualcosa (niente schede vuote) e in modo diverso da come cambia a lui (niente doppioni).
  const miaFirma = profilo ? firmaEffetti(simula(profilo, legge)) : null;
  const rilevanti = PERSONAGGI
    .map((p) => ({ p, r: simula(p.profilo, legge) }))
    .filter((x) => x.r.effetti.length > 0 && (miaFirma === null || firmaEffetti(x.r) !== miaFirma));
  const [aperto, setAperto] = useState<string | null>(null);

  return (
    <div>
      <button className="btn btn-secondario" onClick={onIndietro} style={{ width: 'auto', display: 'inline-flex', gap: 6 }}>
        <Icona nome="indietro" dimensione={16} /> Il mio report
      </button>
      <h1 style={{ fontSize: 24 }}>E per gli altri?</h1>
      {rilevanti.length === 0 ? (
        <p>
          {miaFirma === null
            ? 'Questa legge non cambia nulla nemmeno per i profili di esempio. Prova a creare un profilo ipotetico.'
            : 'Tra i profili di esempio non ce n\'è nessuno a cui questa legge cambi le cose in modo diverso da te. Prova a creare un profilo ipotetico.'}
        </p>
      ) : (
        <>
          <p>
            {miaFirma === null
              ? 'Le persone a cui questa legge cambia qualcosa. Tocca un profilo per vedere il suo report.'
              : 'Persone a cui questa legge cambia le cose in modo diverso da te. Tocca un profilo per vedere il suo report.'}
          </p>
          <ul className="lista-profili">
            {rilevanti.map(({ p, r }) => {
              const espanso = aperto === p.id;
              return (
                <li key={p.id} className="card">
                  <button className="profilo-chip" aria-expanded={espanso}
                    onClick={() => setAperto(espanso ? null : p.id)}>
                    <span className="profilo-icona" aria-hidden="true"><Icona nome="persona" dimensione={22} /></span>
                    <span className="profilo-testo">
                      <b>{p.nome}</b>
                      <span className="testo-piccolo">{p.descrizione}</span>
                    </span>
                    <span className="profilo-freccia" aria-hidden="true"><Icona nome="freccia" dimensione={18} /></span>
                  </button>
                  {espanso && <DettaglioPersona r={r} legge={legge} />}
                </li>
              );
            })}
          </ul>
        </>
      )}
      <button className="btn btn-secondario spazio" onClick={onCreaIpotetico}
        style={{ borderStyle: 'dashed', display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
        <Icona nome="persone" /> Crea un profilo ipotetico
      </button>
    </div>
  );
}
