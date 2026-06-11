// Converte una data ISO (yyyy-mm-dd) in italiano leggibile, senza sorprese di fuso orario.
export function dataLeggibile(iso: string): string {
  const [anno, mese, giorno] = iso.split('-').map(Number);
  if (!anno || !mese || !giorno) return iso;
  return new Date(anno, mese - 1, giorno).toLocaleDateString('it-IT', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}
