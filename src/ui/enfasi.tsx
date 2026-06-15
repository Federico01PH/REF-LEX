// Alleggerisce il testo di un'osservazione: niente paragrafi interamente in grassetto.
// Se l'osservazione inizia con un "titolo:" breve (il modo in cui le regole introducono
// la parte chiave), resta in grassetto solo quello; il resto torna a peso normale.
// Usato sia nel report personale sia nella sezione "E per gli altri?".
export function descrizioneConEnfasi(testo: string) {
  const duePunti = testo.indexOf(':');
  if (duePunti > 0 && duePunti <= 60 && duePunti < testo.length - 1) {
    return <><strong style={{ fontWeight: 600 }}>{testo.slice(0, duePunti + 1)}</strong>{testo.slice(duePunti + 1)}</>;
  }
  return <>{testo}</>;
}
