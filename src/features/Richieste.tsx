import { useState } from 'react';
import type { RichiestaSimulazione } from '../storage/richieste';
import { creaMailto } from '../config/contatti';
import { Icona } from '../ui/Icona';

export function Richieste({ richieste, onAggiungi, onRimuovi }: {
  richieste: RichiestaSimulazione[];
  onAggiungi: (titolo: string) => void;
  onRimuovi: (id: string) => void;
}) {
  const [testo, setTesto] = useState('');
  const corpo = [
    'Ciao, vorrei poter simulare queste leggi in REF-LEX:',
    '',
    ...richieste.map((r) => `- ${r.titolo}${r.url ? ` (${r.url})` : ''}`)
  ].join('\n');

  return (
    <section aria-label="Chiedi una simulazione" className="card">
      <h2 style={{ fontSize: 19, marginTop: 0, marginBottom: 2 }}>Chiedi una simulazione</h2>
      <p className="testo-piccolo" style={{ marginTop: 0 }}>
        Hai letto nelle novità una legge che ti interessa? Segnala qui il titolo: la studiamo
        e la trovi nel menu a un prossimo aggiornamento.
      </p>
      <form onSubmit={(e) => { e.preventDefault(); onAggiungi(testo); setTesto(''); }}>
        <label className="visually-hidden" htmlFor="nuova-richiesta">Quale legge vuoi simulare?</label>
        <input id="nuova-richiesta" className="campo-testo" type="text" value={testo}
          placeholder="Scrivi il titolo della legge…"
          onChange={(e) => setTesto(e.target.value)} />
        <button type="submit" className="btn btn-secondario" style={{ marginTop: 8 }}
          disabled={testo.trim() === ''}>
          Aggiungi alla lista
        </button>
      </form>
      {richieste.length > 0 && (
        <>
          <ul aria-label="Le tue richieste" style={{ listStyle: 'none', padding: 0, margin: '12px 0 0' }}>
            {richieste.map((r) => (
              <li key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderTop: '1px solid var(--bordo)' }}>
                <span style={{ flex: 1 }}>{r.titolo}</span>
                <button onClick={() => onRimuovi(r.id)} aria-label={`Togli la richiesta: ${r.titolo}`}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--rosso)', minHeight: 44, minWidth: 44 }}>
                  <Icona nome="cestino" dimensione={18} />
                </button>
              </li>
            ))}
          </ul>
          <a className="btn" style={{ textAlign: 'center', textDecoration: 'none', marginTop: 8 }}
            href={creaMailto('REF-LEX: richiesta di simulazione', corpo)}>
            Invia {richieste.length === 1 ? 'la richiesta' : `le ${richieste.length} richieste`}
          </a>
          <p className="testo-piccolo" style={{ marginBottom: 0 }}>
            Si apre la tua app di posta: parte solo il testo che vedi qui sopra, mai i dati del tuo profilo.
          </p>
        </>
      )}
    </section>
  );
}
