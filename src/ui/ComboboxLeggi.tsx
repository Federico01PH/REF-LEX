import { useEffect, useId, useRef, useState } from 'react';
import type { Legge } from '../engine/types';

// minuscolo + senza accenti, per cercare "citta" e trovare "città"
function normalizza(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// Tendina ricercabile (combobox ARIA): scrivendo le prime lettere del titolo
// le leggi si filtrano; si sceglie col mouse o con la tastiera (frecce + Invio).
export function ComboboxLeggi({ leggi, valoreId, onScegli, etichettaStato }: {
  leggi: Legge[];
  valoreId: string;
  onScegli: (id: string) => void;
  etichettaStato: (l: Legge) => string;
}) {
  const labelId = useId();
  const listaId = useId();
  const [testo, setTesto] = useState('');
  const [aperta, setAperta] = useState(false);
  const [attivo, setAttivo] = useState(0); // indice evidenziato per la tastiera
  const boxRef = useRef<HTMLDivElement>(null);
  const listaRef = useRef<HTMLUListElement>(null);

  const sceltaCorrente = leggi.find((l) => l.id === valoreId) ?? null;
  // mostriamo il titolo in PAROLE (titoloDivulgativo), senza numeri: la citazione ufficiale
  // con numeri e date compare solo nella scheda, una volta scelta la legge. La ricerca però
  // guarda anche il titolo ufficiale, così si trova una legge anche scrivendo il nome reale.
  const query = normalizza(testo);
  const filtrate = aperta && query
    ? leggi.filter((l) => normalizza(l.titoloDivulgativo).includes(query) || normalizza(l.titoloUfficiale).includes(query))
    : leggi;

  // se il filtro per argomento cambia la legge scelta, riallineo il testo mostrato
  useEffect(() => {
    if (!aperta) setTesto(sceltaCorrente ? sceltaCorrente.titoloDivulgativo : '');
  }, [valoreId, aperta, sceltaCorrente]);

  // tiene l'opzione evidenziata dentro la vista mentre si scorre con la tastiera
  useEffect(() => {
    if (!aperta) return;
    const opt = listaRef.current?.querySelector('.combobox-opt.attivo');
    (opt as HTMLElement | null)?.scrollIntoView?.({ block: 'nearest' });
  }, [attivo, aperta]);

  // clic fuori: chiude
  useEffect(() => {
    function fuori(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setAperta(false);
    }
    document.addEventListener('mousedown', fuori);
    return () => document.removeEventListener('mousedown', fuori);
  }, []);

  function scegli(l: Legge) {
    onScegli(l.id);
    setTesto(l.titoloDivulgativo);
    setAperta(false);
  }

  function apri() {
    setAperta(true);
    setAttivo(0);
    if (sceltaCorrente) setTesto(''); // riparte la ricerca da vuoto, mostrando tutto
  }

  function suTasto(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!aperta) { apri(); return; }
      setAttivo((i) => Math.min(i + 1, filtrate.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setAttivo((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Home') {
      if (aperta) { e.preventDefault(); setAttivo(0); }
    } else if (e.key === 'End') {
      if (aperta) { e.preventDefault(); setAttivo(filtrate.length - 1); }
    } else if (e.key === 'Enter') {
      if (aperta && filtrate[attivo]) { e.preventDefault(); scegli(filtrate[attivo]); }
    } else if (e.key === 'Escape') {
      setAperta(false);
    }
  }

  return (
    <div className="combobox" ref={boxRef}>
      <label id={labelId} htmlFor={`${listaId}-input`} style={{ display: 'block', fontWeight: 800, marginBottom: 8 }}>
        Scegli la legge da simulare
      </label>
      <input
        id={`${listaId}-input`}
        className="tendina"
        type="text"
        role="combobox"
        aria-expanded={aperta}
        aria-controls={aperta ? listaId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={aperta && filtrate[attivo] ? `${listaId}-opt-${filtrate[attivo].id}` : undefined}
        placeholder="Scrivi le prime lettere o apri l'elenco…"
        value={testo}
        onChange={(e) => { setTesto(e.target.value); setAperta(true); setAttivo(0); }}
        onFocus={apri}
        onClick={apri}
        onKeyDown={suTasto}
        onBlur={() => setAperta(false)}
      />
      {aperta && (
        <ul className="combobox-lista" id={listaId} role="listbox" aria-labelledby={labelId} ref={listaRef}>
          {filtrate.length === 0 ? (
            <li className="combobox-vuoto" role="option" aria-selected={false} aria-disabled="true">
              Nessuna legge con queste lettere.
            </li>
          ) : (
            filtrate.map((l, i) => (
              <li
                key={l.id}
                id={`${listaId}-opt-${l.id}`}
                role="option"
                aria-selected={l.id === valoreId}
                className={i === attivo ? 'combobox-opt attivo' : 'combobox-opt'}
                onMouseEnter={() => setAttivo(i)}
                onMouseDown={(e) => { e.preventDefault(); scegli(l); }}
              >
                {l.titoloDivulgativo} <span className="combobox-stato">— {etichettaStato(l)}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
