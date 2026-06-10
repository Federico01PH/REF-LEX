import { Icona } from '../ui/Icona';

export function Benvenuto({ onInizia, onPrivacy }: { onInizia: () => void; onPrivacy: () => void }) {
  return (
    <div>
      <div className="card" style={{ background: 'var(--grad-azione)', color: '#fff' }}>
        <h1 style={{ margin: 0, fontSize: 26 }}>Scopri come le leggi cambiano la TUA vita</h1>
        <p style={{ opacity: 0.9 }}>2 minuti, in forma anonima. Niente nome, niente account.</p>
      </div>
      <div className="card spazio">
        <p style={{ margin: 0, fontWeight: 700, display: 'flex', gap: 8, alignItems: 'center' }}>
          <Icona nome="lucchetto" /> Zero dati inviati. Zero account. Zero tracker.
        </p>
        <p className="testo-piccolo">
          Tutto quello che scrivi resta solo sul tuo dispositivo.{' '}
          <button className="testo-piccolo" onClick={onPrivacy}
            style={{ background: 'none', border: 'none', textDecoration: 'underline', color: 'var(--blu)', cursor: 'pointer', padding: 0 }}>
            Come funziona la privacy
          </button>
        </p>
      </div>
      <button className="btn spazio" onClick={onInizia}>Inizia</button>
    </div>
  );
}
