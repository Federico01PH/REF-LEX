// Accorcia il titolo lungo di una novità (es. "Conversione in legge del decreto-legge
// 2 marzo 2024, n. 19, recante...") al solo nome+numero (es. "DL n. 19/2024"). Per gli
// atti parlamentari in testa (S. 936, A.C. 2822) tiene l'identificativo. Se non riesce a
// estrarre nulla di sensato, restituisce il titolo intero (così il chiamante non mostra la tendina).
export function titoloNovitaBreve(titolo: string): string {
  const t = titolo.trim();
  // atto parlamentare in testa: "S. 936", "C. 1921", "A.C. 2822", "A.S. 935"
  const atto = t.match(/^(A\.\s*[CS]\.|[CS]\.)\s*(\d+)/i);
  if (atto) return `${atto[1].replace(/\s+/g, '').toUpperCase()} ${atto[2]}`;
  let tipo = '';
  if (/decreto[-\s]legge/i.test(t)) tipo = 'DL';
  else if (/decreto\s+legislativo/i.test(t)) tipo = 'D.Lgs.';
  else if (/disegno di legge/i.test(t)) tipo = 'DDL';
  else if (/proposta di legge/i.test(t)) tipo = 'PDL';
  else if (/\blegge\b/i.test(t)) tipo = 'L.';
  const num = t.match(/n\.\s*(\d+)/i);
  const anno = t.match(/\b(?:19|20)\d{2}\b/);
  if (tipo && num && anno) return `${tipo} n. ${num[1]}/${anno[0]}`;
  if (tipo && num) return `${tipo} n. ${num[1]}`;
  return t;
}

// Converte una data ISO (yyyy-mm-dd) in italiano leggibile, senza sorprese di fuso orario.
export function dataLeggibile(iso: string): string {
  const [anno, mese, giorno] = iso.split('-').map(Number);
  if (!anno || !mese || !giorno) return iso;
  return new Date(anno, mese - 1, giorno).toLocaleDateString('it-IT', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}
