import { useState } from 'react';
import type { Legge, Orizzonte, Profilo, Regola } from '../engine/types';
import { ORIZZONTI } from '../engine/types';
import { orizzonteEtichetta, simula } from '../engine/simulate';
import { Icona } from '../ui/Icona';
import { descrizioneConEnfasi } from '../ui/enfasi';
import { CONFIDENZA } from '../ui/confidenza';
import { LegendaBadge } from '../ui/LegendaBadge';
import { SchedeReport } from '../ui/SchedeReport';

// i risultati spiccano sul resto della pagina: un bordo a sinistra colorato secondo
// il verso dell'effetto (bene/male/misto/neutro), come già fa il riquadro del totale
const COLORE_DIREZIONE = {
  positivo: 'var(--verde)', negativo: 'var(--rosso)', misto: 'var(--arancio)', neutro: 'var(--accento)'
} as const;

const ETICHETTA_CAMPO: Partial<Record<keyof Profilo, string>> = {
  fasciaReddito: 'il tuo reddito', fasciaIsee: 'il tuo ISEE', figli: 'quanti figli hai',
  abitazione: 'dove vivi', regione: 'la tua regione', condizioneLavorativa: 'di cosa ti occupi',
  titoloStudio: 'il tuo titolo di studio', numeroProprieta: 'quanti immobili possiedi',
  cittadinanza: 'la tua cittadinanza', permessoSoggiorno: 'se hai il permesso di soggiorno',
  settoriProfessionali: 'che lavoro fai', personeACarico: 'se hai persone a carico',
  tipiACarico: 'chi hai a carico'
};
const INTENSITA = {
  lieve: { classe: 'badge-lieve', parola: 'Compressione lieve' },
  sensibile: { classe: 'badge-sensibile', parola: 'Compressione sensibile' },
  grave: { classe: 'badge-grave', parola: 'Compressione grave' }
} as const;

function formattaIntervallo(min: number, max: number): string {
  const segno = (n: number) => (n > 0 ? `+${n}` : `${n}`);
  return min === max ? `${segno(min)} €` : `da ${segno(min)} a ${segno(max)} €`;
}

function RigaEffetto({ regola, orizzonte }: { regola: Regola; orizzonte: Orizzonte }) {
  const [aperta, setAperta] = useState(false);
  const conf = CONFIDENZA[regola.confidenza];
  // testo corto di default (campo breve), con "Spiega meglio" che apre la descrizione
  // completa + note + fonte. Senza breve resta il testo intero e il toggle "Dettagli e fonte".
  const haBreve = !!regola.effetto.breve;
  const testo = haBreve && !aperta ? regola.effetto.breve! : regola.effetto.descrizione;
  // nell'anno scelto l'effetto può essere spento (timeline 'nullo'): va detto, altrimenti
  // il selettore degli orizzonti non cambierebbe niente a schermo per le leggi senza euro.
  // Due ragioni diverse: o è già finito, o non è ancora partito.
  const spento = regola.timeline[orizzonte] === 'nullo';
  const giaFinito = spento &&
    ORIZZONTI.slice(0, ORIZZONTI.indexOf(orizzonte)).some((o) => regola.timeline[o] !== 'nullo');
  return (
    <div className={`card spazio risultato${spento ? ' spento' : ''}`}
      style={{ borderLeft: `5px solid ${spento ? 'var(--bordo)' : COLORE_DIREZIONE[regola.effetto.direzione]}` }}>
      <span className={`badge ${conf.classe}`}>{conf.parola}</span>
      <p style={{ margin: '8px 0' }}>{descrizioneConEnfasi(testo)}</p>
      {spento && (
        <p className="effetto-spento">
          <span className="badge badge-spento">{giaFinito ? 'Non vale più' : 'Non ancora'}</span>
          {giaFinito
            ? `Tra ${orizzonteEtichetta(orizzonte)} questo effetto è finito.`
            : `Tra ${orizzonteEtichetta(orizzonte)} questo effetto non è ancora partito.`}
        </p>
      )}
      {!spento && regola.effetto.importoMese && (
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
        {aperta ? (haBreve ? 'Mostra meno' : 'Nascondi dettagli') : (haBreve ? 'Spiega meglio' : 'Dettagli e fonte')}
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
  // la timeline serve solo se gli effetti cambiano davvero negli anni: o il totale, o lo stato di una regola
  const evoluzioneTemporale =
    ORIZZONTI.some((o) => r.totaleMese[o].min !== r.totaleMese.anno1.min || r.totaleMese[o].max !== r.totaleMese.anno1.max) ||
    r.effetti.some((e) => ORIZZONTI.some((o) => e.timeline[o] !== e.timeline.anno1));

  return (
    <div>
      <button className="btn btn-secondario" onClick={onIndietro} style={{ width: 'auto', display: 'inline-flex', gap: 6 }}>
        <Icona nome="indietro" dimensione={16} /> Catalogo
      </button>
      <h1 style={{ fontSize: 24 }}>{legge.titoloDivulgativo}</h1>
      <SchedeReport attiva="te" onTe={() => {}} onAltri={onAltri} />
      {esploratore && <p className="badge badge-dipende">Stai guardando con gli occhi di un profilo ipotetico</p>}
      <details className="dettaglio-sezione spazio">
        <summary>Cosa prevede questa legge</summary>
        <p style={{ margin: '8px 0 0' }}>{legge.riassunto}</p>
      </details>

      {nessunEffetto ? (
        <div className="card">
          <p style={{ fontWeight: 700 }}>Questa legge non cambia nulla per te.</p>
          <p className="testo-piccolo">Ma tocca altre persone: guarda chi.</p>
        </div>
      ) : (
        <>
          {evoluzioneTemporale && (
            <div className="spazio">
              <p className="testo-piccolo" style={{ margin: '0 0 6px' }}>
                Questa legge cambia nel tempo: tocca un anno per vedere com'è dopo 2, 5 o 10 anni.
              </p>
              <div role="group" aria-label="Orizzonte temporale">
                {ORIZZONTI.map((o) => (
                  <button key={o} className="pill" aria-pressed={orizzonte === o}
                    onClick={() => setOrizzonte(o)}>
                    {orizzonteEtichetta(o)}
                  </button>
                ))}
              </div>
            </div>
          )}
          {haTotale && (
            <div className={`riquadro-numero spazio ${totale.min >= 0 ? 'positivo' : totale.max <= 0 ? 'negativo' : 'incerto'}`}>
              <div className="numero">{formattaIntervallo(totale.min, totale.max)}</div>
              <div>al mese{evoluzioneTemporale ? ` tra ${orizzonteEtichetta(orizzonte)}` : ''} (effetti certi e probabili)</div>
            </div>
          )}
          <LegendaBadge conDiritti={r.effetti.some((e) => e.effetto.dirittoToccato)} />
          {r.effetti.some((e) => !e.effetto.indiretto) && (
            <h2 style={{ fontSize: 19, margin: '4px 0 2px' }}>Cosa cambia per te</h2>
          )}
          {r.effetti.filter((e) => !e.effetto.indiretto).map((regola) => <RigaEffetto key={regola.id} regola={regola} orizzonte={orizzonte} />)}
          {r.effetti.some((e) => e.effetto.indiretto) && (
            <section aria-label="Effetti indiretti" className="spazio">
              <h2 style={{ fontSize: 19, marginBottom: 2 }}>Effetti indiretti</h2>
              <p className="testo-piccolo" style={{ marginTop: 0 }}>
                Qui la legge non parla di te, ma ti tocca di riflesso: di solito è la parte che nessuno racconta.
              </p>
              {r.effetti.filter((e) => e.effetto.indiretto).map((regola) => <RigaEffetto key={regola.id} regola={regola} orizzonte={orizzonte} />)}
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

      {nonInVigore && (
        <p className="card spazio" style={{ borderLeft: '4px solid var(--arancio)' }}>
          <b>Attenzione: effetti non ancora attivi.</b>{' '}
          {legge.stato === 'approvata'
            ? 'Approvata, ma gli effetti concreti dipendono dai prossimi passi (i decreti attuativi).'
            : 'Non è ancora in vigore: vedi cosa succederebbe se passasse il testo di oggi.'}
        </p>
      )}

      <p className="testo-piccolo spazio">
        Simulazione a parità di tutte le altre leggi, con i dati di oggi. Catalogo aggiornato al {legge.verificataIl}.
        {' '}Fonti:{' '}
        {legge.fonti.map((f, i) => (
          <span key={f.url}>{i > 0 && ' · '}<a href={f.url} target="_blank" rel="noopener noreferrer">{f.etichetta}</a></span>
        ))}
      </p>

      <details className="disclaimer-ai spazio">
        <summary>
          Risultati generati dall'intelligenza artificiale, non ancora verificati riga per riga da una persona.
        </summary>
        <p style={{ marginBottom: 0 }}>
          REF-LEX legge i testi ufficiali delle leggi e calcola gli effetti con un modello di
          intelligenza artificiale. Una persona ha scritto le regole su come leggere quei testi e
          come fare le simulazioni, ma non ha ancora ricontrollato a mano ogni singolo risultato.
          Per questo possono esserci errori o semplificazioni: prima di prendere decisioni
          importanti, controlla sempre le fonti ufficiali qui sopra o chiedi a una persona esperta.
        </p>
      </details>
    </div>
  );
}
