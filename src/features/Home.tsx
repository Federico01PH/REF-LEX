import { Marchio } from '../ui/Marchio';
import { Icona } from '../ui/Icona';

// La home è solo il marchio, la missione e un bottone: tutto il resto
// (catalogo, novità, richieste, segnalazioni) vive nella pagina delle simulazioni.
export function Home({ haProfilo, nome, onAvanti, onPrivacy }: {
  haProfilo: boolean; nome?: string; onAvanti: () => void; onPrivacy: () => void;
}) {
  return (
    <div className="home">
      <h1 className="marchio-riga"><Marchio /></h1>
      {haProfilo && nome && <p className="saluto">Ciao, {nome}.</p>}
      <p className="motto-grande">
        Le leggi decidono stipendio, casa, salute e diritti.
        Ma sono scritte in un linguaggio per pochi.
      </p>
      <p className="motto">
        REF-LEX le traduce in parole semplici: rispondi a qualche domanda anonima e in 2 minuti
        scopri cosa cambia nella tua vita — comprese le cose che nessuno racconta.
      </p>
      <button className="btn" onClick={onAvanti}>
        {haProfilo ? 'Vai alle simulazioni' : 'Inizia: 2 minuti, niente account'}
      </button>
      <p className="testo-piccolo" style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Icona nome="lucchetto" dimensione={16} /> Nessun tuo dato personale viene inviato: il profilo resta sul tuo dispositivo.{' '}
        <button className="collegamento testo-piccolo" onClick={onPrivacy}>Come funziona la privacy</button>
      </p>
    </div>
  );
}
