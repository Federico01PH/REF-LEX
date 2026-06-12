import { useState } from 'react';
import { creaMailto } from '../config/contatti';

export function Segnalazione() {
  const [testo, setTesto] = useState('');
  const pronto = testo.trim() !== '';

  return (
    <section aria-label="Segnala un problema" className="card">
      <h2 style={{ fontSize: 19, marginTop: 0, marginBottom: 2 }}>Qualcosa non va?</h2>
      <p className="testo-piccolo" style={{ marginTop: 0 }}>
        Un errore, un numero che non torna, una frase poco chiara: dimmelo e lo sistemiamo.
      </p>
      <label className="visually-hidden" htmlFor="testo-segnalazione">Descrivi il problema</label>
      <textarea id="testo-segnalazione" className="campo-testo" rows={3} value={testo}
        placeholder="Descrivi cosa hai visto…"
        onChange={(e) => setTesto(e.target.value)} />
      {pronto ? (
        <a className="btn btn-secondario" style={{ textAlign: 'center', textDecoration: 'none', marginTop: 8 }}
          href={creaMailto('REF-LEX: segnalazione', testo)}>
          Invia la segnalazione
        </a>
      ) : (
        <button className="btn btn-secondario" style={{ marginTop: 8 }} disabled>
          Invia la segnalazione
        </button>
      )}
      <p className="testo-piccolo" style={{ marginBottom: 0 }}>
        Anche qui: si apre la tua app di posta e parte solo quello che hai scritto.
      </p>
    </section>
  );
}
