import { useState } from 'react';
import { cancellaTutto } from '../storage/profilo';
import { Icona } from '../ui/Icona';

export function Privacy({ tema, onCambiaTema, onCancellaTutto, onIndietro }: {
  tema: string; onCambiaTema: (t: string) => void;
  onCancellaTutto: () => void; onIndietro: () => void;
}) {
  const [conferma, setConferma] = useState(false);
  return (
    <div>
      <button className="btn btn-secondario" onClick={onIndietro} style={{ width: 'auto', display: 'inline-flex', gap: 6 }}>
        <Icona nome="indietro" dimensione={16} /> Indietro
      </button>
      <h1 style={{ fontSize: 24, display: 'flex', gap: 8, alignItems: 'center' }}>
        <Icona nome="lucchetto" dimensione={24} /> I tuoi dati
      </h1>
      <div className="card">
        <p><b>I tuoi dati restano solo su questo dispositivo.</b> Non chiediamo nome né cognome, non creiamo account, non usiamo cookie né tracker.</p>
        <p>Non inviamo i tuoi dati a nessuno, non li vendiamo e non li vediamo nemmeno noi: l&apos;app funziona tutta sul tuo telefono o computer.</p>
        <p className="testo-piccolo">Se cancelli i dati o disinstalli l&apos;app, spariscono per sempre: non ne esiste nessuna copia altrove.</p>
      </div>
      <div className="card spazio">
        <h2 style={{ fontSize: 17, marginTop: 0 }}>Aspetto</h2>
        <div role="group" aria-label="Tema dell'app">
          <button className="pill" aria-pressed={tema === 'auto'} onClick={() => onCambiaTema('auto')}>Automatico</button>
          <button className="pill" aria-pressed={tema === 'light'} onClick={() => onCambiaTema('light')}>Chiaro</button>
          <button className="pill" aria-pressed={tema === 'dark'} onClick={() => onCambiaTema('dark')}>Scuro</button>
        </div>
      </div>
      <div className="card spazio">
        <h2 style={{ fontSize: 17, marginTop: 0 }}>Cancellazione</h2>
        {!conferma ? (
          <button className="btn btn-pericolo" onClick={() => setConferma(true)}>
            Cancella tutti i miei dati
          </button>
        ) : (
          <>
            <p><b>Sicuro/a?</b> Il profilo verrà eliminato per sempre da questo dispositivo.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondario" style={{ flex: 1 }} onClick={() => setConferma(false)}>No, tienili</button>
              <button className="btn btn-pericolo" style={{ flex: 1 }}
                onClick={() => { cancellaTutto(); onCancellaTutto(); }}>
                Sì, cancella
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
