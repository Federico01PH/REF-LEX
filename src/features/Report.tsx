import { useState } from 'react';
import type { Legge, Orizzonte, Profilo, Regola } from '../engine/types';
import { ORIZZONTI } from '../engine/types';
import { orizzonteEtichetta, simula } from '../engine/simulate';
import { Icona } from '../ui/Icona';

const ETICHETTA_CAMPO: Partial<Record<keyof Profilo, string>> = {
  fasciaReddito: 'il tuo reddito', fasciaIsee: 'il tuo ISEE', figli: 'quanti figli hai',
  abitazione: 'dove vivi', regione: 'la tua regione', condizioneLavorativa: 'di cosa ti occupi',
  titoloStudio: 'il tuo titolo di studio', numeroProprieta: 'quanti immobili possiedi',
  cittadinanza: 'la tua cittadinanza', permessoSoggiorno: 'se hai il permesso di soggiorno'
};
const CONFIDENZA = {
  certa: { classe: 'badge-certa', parola: 'Certo' },
  probabile: { classe: 'badge-probabile', parola: 'Probabile' },
  dipende: { classe: 'badge-dipende', parola: 'Dipende' }
} as const;
const INTENSITA = {
  lieve: { classe: 'badge-lieve', parola: 'Compressione lieve' },
  sensibile: { classe: 'badge-sensibile', parola: 'Compressione sensibile' },
  grave: { classe: 'badge-grave', parola: 'Compressione grave' }
} as const;

function formattaIntervallo(min: number, max: number): string {
  const segno = (n: number) => (n > 0 ? `+${n}` : `${n}`);
  return min === max ? `${segno(min)} €` : `da ${segno(min)} a ${segno(max)} €`;
}

function RigaEffetto({ regola }: { regola: Regola }) {
  const [aperta, setAperta] = useState(false);
  const conf = CONFIDENZA[regola.confidenza];
  return (
    <div className="card spazio">
      <span className={`badge ${conf.classe}`}>{conf.parola}</span>
      <p style={{ margin: '8px 0', fontWeight: 600 }}>{regola.effetto.descrizione}</p>
      {regola.effetto.importoMese && (
        <p style={{ margin: '4px 0', fontWeight: 900, fontSize: 20 }}>
          {formattaIntervallo(
            regola.effetto.direzione === 'negativo' ? -regola.effetto.importoMese.max : regola.effetto.importoMese.min,
            regola.effetto.direzione === 'negativo' ? -regola.effetto.importoMese.min : regola.effetto.importoMese.max
          )} al mese
        </p>
      )}
      {regola.effetto.dirittoToccato && (() => {
        const d = regola.effetto.dirittoToccato;
        const ref = `${d.carta}, ${d.articolo}`;
        return (
          <div className="diritto-toccato">
            <span className={`badge ${INTENSITA[d.intensita].classe}`}>{INTENSITA[d.intensita].parola}</span>
            <span>
              Diritto toccato: <b>{d.diritto}</b> —{' '}
              {d.url
                ? <a href={d.url} target="_blank" rel="noopener noreferrer">{ref}</a>
                : ref}
            </span>
          </div>
        );
      })()}
      <button className="testo-piccolo" onClick={() => setAperta(!aperta)} aria-expanded={aperta}
        style={{ background: 'none', border: 'none', textDecoration: 'underline', color: 'var(--accento)', cursor: 'pointer', padding: 0 }}>
        {aperta ? 'Nascondi dettagli' : 'Dettagli e fonte'}
      </button>
      {aperta && (
        <div className="testo-piccolo spazio">
          {regola.noteConfidenza && <p>{regola.noteConfidenza}</p>}
          <p>
            Fonte:{' '}
            <a href={regola.fonteRegola.url} target="_blank" rel="noopener noreferrer">
              {regola.fonteRegola.etichetta}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

export function Report({ profilo, legge, esploratore, onAltri, onIndietro }: {
  profilo: Profilo; legge: Legge; esploratore: boolean;
  onAltri: () => void; onIndietro: () => void;
}) {
  const [orizzonte, setOrizzonte] = useState<Orizzonte>('anno1');
  const r = simula(profilo, legge);
  const totale = r.totaleMese[orizzonte];
  const nonInVigore = legge.stato !== 'vigore';
  const nessunEffetto = r.effetti.length === 0 && r.nonCalcolabili.length === 0;
  const haTotale = r.effetti.some((e) => e.confidenza !== 'dipende' && e.effetto.importoMese);

  return (
    <div>
      <button className="btn btn-secondario" onClick={onIndietro} style={{ width: 'auto', display: 'inline-flex', gap: 6 }}>
        <Icona nome="indietro" dimensione={16} /> Catalogo
      </button>
      <h1 style={{ fontSize: 24 }}>{legge.titoloDivulgativo}</h1>
      {esploratore && <p className="badge badge-dipende">Stai guardando con gli occhi di un profilo ipotetico</p>}
      {nonInVigore && (
        <p className="card" style={{ borderLeft: '4px solid var(--arancio)' }}>
          <b>Attenzione: effetti non ancora attivi.</b>{' '}
          {legge.stato === 'approvata'
            ? 'Questa legge è stata approvata ma i suoi effetti concreti dipendono dai passi successivi (per esempio i decreti attuativi).'
            : 'Questa legge NON è ancora in vigore: ti mostriamo cosa succederebbe SE venisse approvata nel testo attuale.'}
        </p>
      )}
      <p>{legge.riassunto}</p>

      {nessunEffetto ? (
        <div className="card">
          <p style={{ fontWeight: 700 }}>Questa legge non cambia nulla per te.</p>
          <p className="testo-piccolo">Ma tocca altre persone: guarda chi.</p>
        </div>
      ) : (
        <>
          <div role="group" aria-label="Orizzonte temporale" className="spazio">
            {ORIZZONTI.map((o) => (
              <button key={o} className="pill" aria-pressed={orizzonte === o}
                onClick={() => setOrizzonte(o)}>
                {orizzonteEtichetta(o)}
              </button>
            ))}
          </div>
          {haTotale && (
            <div className={`riquadro-numero spazio ${totale.min >= 0 ? 'positivo' : totale.max <= 0 ? 'negativo' : 'incerto'}`}>
              <div className="numero">{formattaIntervallo(totale.min, totale.max)}</div>
              <div>al mese tra {orizzonteEtichetta(orizzonte)} (effetti certi e probabili)</div>
            </div>
          )}
          {r.effetti.filter((e) => !e.effetto.indiretto).map((regola) => <RigaEffetto key={regola.id} regola={regola} />)}
          {r.effetti.some((e) => e.effetto.indiretto) && (
            <section aria-label="Effetti indiretti" className="spazio">
              <h2 style={{ fontSize: 19, marginBottom: 2 }}>Effetti indiretti</h2>
              <p className="testo-piccolo" style={{ marginTop: 0 }}>
                Qui la legge non parla di te, ma ti tocca di riflesso: di solito è la parte che nessuno racconta.
              </p>
              {r.effetti.filter((e) => e.effetto.indiretto).map((regola) => <RigaEffetto key={regola.id} regola={regola} />)}
            </section>
          )}
          {r.effetti.some((e) => e.timeline[orizzonte] === 'incerto') && (
            <p className="card spazio testo-piccolo" style={{ borderLeft: '4px solid var(--arancio)' }}>
              Alcuni effetti sono incerti in questo orizzonte temporale: non li contiamo nel totale finché non ci sono dati certi.
            </p>
          )}
          {[...new Map(r.nonCalcolabili.map((nc) => [nc.campiMancanti.join('|'), nc.campiMancanti])).values()].map((campi) => (
            <div key={campi.join('|')} className="card spazio" style={{ borderLeft: '4px solid var(--arancio)' }}>
              <p style={{ margin: 0 }}>
                C'è un effetto che non possiamo calcolare: ci serve {campi.map((c) => ETICHETTA_CAMPO[c as keyof Profilo] ?? c).join(' e ')}.
              </p>
              <p className="testo-piccolo">Aggiungi questo dato al profilo per vederlo.</p>
            </div>
          ))}
        </>
      )}

      <p className="testo-piccolo spazio">
        Simulazione a parità di tutte le altre leggi, con i dati di oggi. Catalogo aggiornato al {legge.verificataIl}.
        {' '}Fonti:{' '}
        {legge.fonti.map((f, i) => (
          <span key={f.url}>{i > 0 && ' · '}<a href={f.url} target="_blank" rel="noopener noreferrer">{f.etichetta}</a></span>
        ))}
      </p>
      <button className="btn spazio" onClick={onAltri}>E per gli altri?</button>
    </div>
  );
}
