import { useState } from 'react';
import type { Ambito, Legge, Profilo, StatoLegge } from '../engine/types';
import { rilevanza } from '../engine/simulate';
import { Icona } from '../ui/Icona';
import type { NovitaFile } from '../engine/novita';
import { NovitaParlamento } from './NovitaParlamento';
import { dataLeggibile } from '../ui/formato';

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
  { valore: 'doveri', etichetta: 'Doveri e obblighi' }
];
const RILEVANZA = {
  alta: 'Ti riguarda quasi sicuramente',
  media: 'Potrebbe riguardarti',
  bassa: 'Non ti tocca direttamente'
};

export function Catalogo({ profilo, esploratore, leggi, novita, infoCatalogo, onScegli, onModificaProfilo, onPrivacy, onEsciEsploratore }: {
  profilo: Profilo; esploratore: boolean; leggi: Legge[]; novita: NovitaFile | null;
  infoCatalogo: { fonte: 'locale' | 'remoto'; generatoIl?: string };
  onScegli: (id: string) => void; onModificaProfilo: () => void; onPrivacy: () => void; onEsciEsploratore: () => void;
}) {
  const [ambito, setAmbito] = useState<Ambito | 'tutte'>('tutte');
  const visibili = leggi.filter((l) => ambito === 'tutte' || l.ambito === ambito);

  return (
    <div>
      <h1 style={{ fontSize: 24 }}>Scegli una legge</h1>
      {esploratore && (
        <p className="badge badge-dipende">
          Profilo ipotetico attivo —{' '}
          <button onClick={onEsciEsploratore} style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', font: 'inherit', color: 'inherit' }}>
            torna al tuo profilo
          </button>
        </p>
      )}
      {novita && novita.voci.length > 0 && <NovitaParlamento novita={novita} />}
      <div role="group" aria-label="Filtra per argomento">
        {AMBITI.map((a) => (
          <button key={a.valore} className="pill" aria-pressed={ambito === a.valore}
            onClick={() => setAmbito(a.valore)}>{a.etichetta}</button>
        ))}
      </div>
      <div className="spazio">
        {visibili.map((legge) => {
          const stato = STATI[legge.stato];
          const r = rilevanza(profilo, legge);
          return (
            <button key={legge.id} className="card spazio" onClick={() => onScegli(legge.id)}
              style={{ display: 'block', width: '100%', textAlign: 'left', border: 'none',
                borderLeft: `4px solid ${stato.colore}`, cursor: 'pointer', font: 'inherit', color: 'inherit' }}>
              <span className="testo-piccolo" style={{ fontWeight: 800, color: stato.colore }}>{stato.etichetta}</span>
              <span style={{ display: 'block', fontWeight: 800, fontSize: 17 }}>{legge.titoloDivulgativo}</span>
              <span className="testo-piccolo">{RILEVANZA[r]} · 2 min</span>
            </button>
          );
        })}
        {visibili.length === 0 && (
          <p className="card spazio">Per questo argomento non abbiamo ancora leggi nel catalogo: stanno arrivando.</p>
        )}
      </div>
      <p className="testo-piccolo spazio">
        {infoCatalogo.fonte === 'remoto' && infoCatalogo.generatoIl
          ? `Catalogo aggiornato automaticamente al ${dataLeggibile(infoCatalogo.generatoIl)}.`
          : 'Catalogo locale incluso nell\'app: si aggiorna da solo quando sei online.'}
      </p>
      <div className="spazio" style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-secondario" style={{ flex: 1 }} onClick={onModificaProfilo}>
          <Icona nome="persona" dimensione={16} /> Modifica profilo
        </button>
        <button className="btn btn-secondario" style={{ flex: 1 }} onClick={onPrivacy}>
          <Icona nome="lucchetto" dimensione={16} /> I tuoi dati
        </button>
      </div>
    </div>
  );
}
