/**
 * Utility condivise per la manipolazione del testo nei parser delle fonti.
 */

/**
 * Decodifica le entita HTML nominali e numeriche tipiche dei titoli parlamentari.
 * Poi rimuove eventuali tag HTML residui come <em>, </em>, <strong>.
 */
export function decodificaEntita(testo: string): string {
  return testo
    // entita numeriche decimali &#160; &#233; ecc.
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    // entita numeriche esadecimali &#x00E0; ecc.
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    // entita nominali frequenti nei titoli parlamentari
    .replace(/&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rdquo;/g, '”')
    .replace(/&ldquo;/g, '“')
    .replace(/&agrave;/g, 'à')
    .replace(/&egrave;/g, 'è')
    .replace(/&eacute;/g, 'é')
    .replace(/&igrave;/g, 'ì')
    .replace(/&ograve;/g, 'ò')
    .replace(/&ugrave;/g, 'ù')
    .replace(/&aacute;/g, 'á')
    .replace(/&oacute;/g, 'ó')
    .replace(/&uacute;/g, 'ú')
    .replace(/&iacute;/g, 'í')
    .replace(/&ntilde;/g, 'ñ')
    .replace(/&ccedil;/g, 'ç')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&hellip;/g, '…')
    .replace(/&ecirc;/g, 'ê')
    .replace(/&ocirc;/g, 'ô')
    .replace(/&icirc;/g, 'î')
    .replace(/&ucirc;/g, 'û')
    .replace(/&auml;/g, 'ä')
    .replace(/&euml;/g, 'ë')
    .replace(/&iuml;/g, 'ï')
    .replace(/&ouml;/g, 'ö')
    .replace(/&uuml;/g, 'ü')
    .replace(/&Agrave;/g, 'À')
    .replace(/&Egrave;/g, 'È')
    .replace(/&Eacute;/g, 'É')
    .replace(/&Igrave;/g, 'Ì')
    .replace(/&Ograve;/g, 'Ò')
    .replace(/&Ugrave;/g, 'Ù')
    // entita GU supplementari
    .replace(/&amp;amp;/g, '&')
    // rimuove tag HTML residui come <em>, </em>, <strong> ecc.
    .replace(/<[^>]+>/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Tronca il testo alla fine dell'ultima parola che sta entro `max` caratteri,
 * aggiungendo '…' solo se il testo e stato effettivamente troncato.
 * Se nessuno spazio e presente entro `max`, applica un taglio duro.
 */
export function tronca(testo: string, max = 160): string {
  if (testo.length <= max) return testo;
  const segmento = testo.slice(0, max);
  const ultimoSpazio = segmento.lastIndexOf(' ');
  const base = ultimoSpazio > 0 ? segmento.slice(0, ultimoSpazio) : segmento;
  return base.trimEnd() + '…';
}
