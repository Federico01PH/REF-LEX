import { useState } from 'react';
import type { Ambito, Legge, Profilo, StatoLegge } from '../engine/types';
import { rilevanza } from '../engine/simulate';
import { Icona } from '../ui/Icona';
import type { NovitaFile } from '../engine/novita';
import { NovitaParlamento } from './NovitaParlamento';
import { Richieste } from './Richieste';
import { Segnalazione } from './Segnalazione';
import { aggiungiRichiesta, caricaRichieste, rimuoviRichiesta } from '../storage/richieste';
import { dataLeggibile } from '../ui/formato';
import { Marchio } from '../ui/Marchio';
import { ComboboxLeggi } from '../ui/ComboboxLeggi';

const STATI: Record<StatoLegge, { etichetta: string; colore: string }> = {
  vigore: { etichetta: 'In vigore', colore: 'var(--verde)' },
  approvata: { etichetta: 'Appena approvata', colore: 'var(--teal)' },
  discussione: { etichetta: 'In discussione', colore: 'var(--giallo)' },
  bozza: { etichetta: 'Bozza', colore: 'var(--testo-2)' },
  referendum: { etichetta: 'Referendum', colore: 'var(--viola)' }
};
const AMBITI: { valore: Ambito | 'tutte'; etichetta: string }[] = [
  { valore: 'tutte', etichetta: 'Tutte' },
  { valore: 'fisco-lavoro', etichetta: 'Fisco e lavoro' },
  { valore: 'pensioni-welfare', etichetta: 'Pensioni e welfare' },
  { valore: 'casa', etichetta: 'Casa' },
  { valore: 'diritti-salute', etichetta: 'Diritti e salute' },
  { valore: 'sicurezza-privacy', etichetta: 'Sicurezza e privacy' },
  { valore: 'doveri', etichetta: 'Doveri e obblighi' },
  { valore: 'scuola-universita-ricerca', etichetta: 'Scuola, università e ricerca' }
];
const RILEVANZA = {
  alta: 'Ti riguarda quasi sicuramente',
  media: 'Potrebbe riguardarti',
  bassa: 'Non ti tocca direttamente'
};

export function Catalogo({ profilo, esploratore, leggi, novita, infoCatalogo, onScegli, onModificaProfilo, onPrivacy, onHome, onEsciEsploratore }: {
  profilo: Profilo; esploratore: boolean; leggi: Legge[]; novita: NovitaFile | null;
  infoCatalogo: { fonte: 'locale' | 'remoto'; generatoIl?: string };
  onScegli: (id: string) => void; onModificaProfilo: () => void; onPrivacy: () => void;
  onHome: () => void; onEsciEsploratore: () => void;
}) {
  const [ambito, setAmbito] = useState<Ambito | 'tutte'>('tutte');
  const [sceltaId, setSceltaId] = useState('');
  const [richieste, setRichieste] = useState(() => caricaRichieste());
  const visibili = leggi.filter((l) => ambito === 'tutte' || l.ambiti.includes(ambito));
  const scelta = visibili.find((l) => l.id === sceltaId) ?? null;

  return (
    <div>
      <header className="riga-testata">
        <h1 className="marchio-riga"><Marchio /></h1>
        <button className="btn btn-secondario" onClick={onHome}
          style={{ width: 'auto', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
          <Icona nome="indietro" dimensione={16} /> Home
        </button>
      </header>
      {esploratore && (
        <p className="badge badge-dipende">
          Profilo ipotetico attivo —{' '}
          <button onClick={onEsciEsploratore} style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', font: 'inherit', color: 'inherit' }}>
            torna al tuo profilo
          </button>
        </p>
      )}
      <section aria-label="Profilo e dati" className="card spazio">
        <h2 style={{ fontSize: 17, marginTop: 0, marginBottom: 2 }}>I tuoi dati</h2>
        <p className="testo-piccolo" style={{ marginTop: 0 }}>
          Le simulazioni partono dal tuo profilo. Resta sul tuo dispositivo: puoi cambiarlo o cancellarlo quando vuoi.
        </p>
        <div className="riga-azioni">
          <button className="btn btn-secondario" onClick={onModificaProfilo}>
            <Icona nome="persona" dimensione={16} /> Modifica profilo
          </button>
          <button className="btn btn-secondario" onClick={onPrivacy}>
            <Icona nome="lucchetto" dimensione={16} /> Privacy e cancellazione
          </button>
        </div>
      </section>
      <div className="spazio">
        <p className="etichetta-filtri">Filtra per argomento, poi scegli la legge qui sotto:</p>
        <div role="group" aria-label="Filtra per argomento">
          {AMBITI.map((a) => (
            <button key={a.valore} className="pill" aria-pressed={ambito === a.valore}
              onClick={() => { setAmbito(a.valore); setSceltaId(''); }}>{a.etichetta}</button>
          ))}
        </div>
      </div>
      <div className="card spazio">
        <ComboboxLeggi
          leggi={visibili}
          valoreId={sceltaId}
          onScegli={(id) => setSceltaId(id)}
          etichettaStato={(l) => STATI[l.stato].etichetta}
        />
        {visibili.length === 0 && (
          <p className="testo-piccolo" style={{ marginBottom: 0 }}>
            Per questo argomento non abbiamo ancora leggi nel catalogo: stanno arrivando.
          </p>
        )}
        {!scelta && visibili.length > 0 && (
          <p className="testo-piccolo" style={{ marginBottom: 0 }}>
            I titoli sono scritti in parole semplici: scegline uno e ti mostriamo anche il nome ufficiale e cosa prevede.
          </p>
        )}
      </div>
      {scelta && (
        <article className="card spazio" style={{ borderLeft: `4px solid ${STATI[scelta.stato].colore}` }}>
          <span className="testo-piccolo" style={{ fontWeight: 800, color: STATI[scelta.stato].colore }}>
            {STATI[scelta.stato].etichetta}
          </span>
          {scelta.origine === 'europea' && (
            <span className="badge badge-europea" style={{ marginLeft: 8 }}>Norma europea — vale anche in Italia</span>
          )}
          <h2 style={{ fontSize: 20, margin: '4px 0' }}>{scelta.titoloDivulgativo}</h2>
          <p className="testo-piccolo" style={{ marginTop: 0 }}>Nome ufficiale: {scelta.titoloUfficiale}</p>
          <p style={{ marginTop: 8 }}>{scelta.riassunto}</p>
          <p className="testo-piccolo">{RILEVANZA[rilevanza(profilo, scelta)]} · il report richiede 2 minuti</p>
          <button className="btn" onClick={() => onScegli(scelta.id)}>Vedi come ti tocca</button>
        </article>
      )}
      {novita && novita.voci.length > 0 && (
        <div className="sezione-novita">
          <NovitaParlamento novita={novita}
            onRichiedi={(titolo, url) => setRichieste(aggiungiRichiesta(titolo, url))} />
        </div>
      )}
      <div className="sezione-minore">
        <hr className="divisore" />
        <p className="testo-piccolo" style={{ marginTop: 14, marginBottom: 0 }}>
          Aiutaci a migliorare REF-LEX:
        </p>
        <div className="griglia-due spazio">
          <Richieste richieste={richieste}
            onAggiungi={(titolo) => setRichieste(aggiungiRichiesta(titolo))}
            onRimuovi={(id) => setRichieste(rimuoviRichiesta(id))} />
          <Segnalazione />
        </div>
      </div>
      <p className="testo-piccolo spazio">
        {infoCatalogo.fonte === 'remoto' && infoCatalogo.generatoIl
          ? `Catalogo aggiornato automaticamente al ${dataLeggibile(infoCatalogo.generatoIl)}.`
          : 'Catalogo locale incluso nell\'app: si aggiorna da solo quando sei online.'}
      </p>
    </div>
  );
}
