// Accorcia SOLO il titolo "boilerplate" delle conversioni in legge, del tipo
// "Conversione in legge del decreto-legge 2 marzo 2024, n. 19, recante <oggetto>",
// tenendo l'oggetto (la parte che dice di cosa parla) ed eventualmente il numero del
// decreto: -> "DL 19/2024: <oggetto>". I titoli del feed che sono GIÀ una descrizione
// (es. "Disposizioni in materia di welfare aziendale e asili nido", o "Modifiche alla
// legge ..., n. 464, concernenti ...") vengono lasciati intatti: un numero di legge
// CITATO nel testo non deve mai sostituire il titolo. Se non si accorcia nulla viene
// restituito il titolo identico, così il chiamante non mostra la tendina.
export function titoloNovitaBreve(titolo: string): string {
  const t = titolo.trim().replace(/^["“”']+/, '').trim();
  if (/conversione in legge/i.test(t)) {
    const recante = t.match(/\brecante\s+(.+?)[…\s]*$/i);
    if (recante) {
      const oggetto = recante[1].trim().replace(/[.,;:]+$/, '');
      const oggettoMaiusc = oggetto.charAt(0).toUpperCase() + oggetto.slice(1);
      const num = t.match(/decreto[-\s]legge[^,]*,\s*n\.\s*(\d+)/i);
      const anno = t.match(/\b(?:19|20)\d{2}\b/);
      return num && anno ? `DL ${num[1]}/${anno[0]}: ${oggettoMaiusc}` : oggettoMaiusc;
    }
  }
  return titolo;
}

// Converte una data ISO (yyyy-mm-dd) in italiano leggibile, senza sorprese di fuso orario.
export function dataLeggibile(iso: string): string {
  const [anno, mese, giorno] = iso.split('-').map(Number);
  if (!anno || !mese || !giorno) return iso;
  return new Date(anno, mese - 1, giorno).toLocaleDateString('it-IT', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}
