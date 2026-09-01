import { CONFIDENZA, LIVELLI } from './confidenza';

// Una riga sola, sempre visibile, appena sopra gli effetti: prima era un "details"
// chiuso con frasi lunghe e non lo apriva nessuno. La voce "Compressione" compare
// solo se un effetto tocca davvero un diritto, così non si legge testo inutile.
export function LegendaBadge({ conDiritti }: { conDiritti: boolean }) {
  return (
    <p className="legenda-riga">
      {LIVELLI.map((livello) => (
        <span key={livello} className="legenda-voce">
          <span className={`badge ${CONFIDENZA[livello].classe}`}>{CONFIDENZA[livello].parola}</span>
          {CONFIDENZA[livello].spiega}
        </span>
      ))}
      {conDiritti && (
        <span className="legenda-voce">
          <span className="badge badge-sensibile">Compressione</span>
          quanto limita un tuo diritto
        </span>
      )}
    </p>
  );
}
