import { XMLParser } from 'fast-xml-parser';
import { SchemaNovita, type Novita } from '../../src/engine/novita';
import { decodificaEntita } from './testo';

export const URL_FONTE = 'https://www.gazzettaufficiale.it/rss/SG';

/**
 * Converte una data RFC 822 (pubDate dell'RSS) in formato yyyy-mm-dd.
 * Esempi: "Wed, 10 Jun 2026 17:01:02 GMT" => "2026-06-10"
 * Nota: la data viene calcolata sull'istante GMT. La GU pubblica tipicamente
 * nel pomeriggio (Europe/Rome), quindi non si sposta oltre mezzanotte GMT; in
 * caso contrario la data potrebbe risultare sfasata di un giorno.
 */
function parsePubDate(pubDate: string): string | null {
  try {
    const d = new Date(pubDate);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().slice(0, 10);
  } catch {
    return null;
  }
}

/**
 * Atti normativi primari ammessi nel feed novita.
 * Esclude atti amministrativi: decreti ministeriali, comunicati,
 * determine, ordinanze, provvedimenti.
 */
const ATTO_NORMATIVO = /\b(LEGGE|DECRETO-LEGGE|DECRETO LEGISLATIVO|TESTO COORDINATO|DECRETO DEL PRESIDENTE DELLA REPUBBLICA)\b/i;

/**
 * Analizza il feed RSS della Gazzetta Ufficiale Serie Generale.
 * Lancia un errore descrittivo se l'XML non contiene la struttura attesa.
 * Ogni voce passa da SchemaNovita.parse() — se invalida, lancia.
 * Solo gli atti normativi primari (LEGGE, DECRETO-LEGGE, ecc.) passano il filtro.
 */
export function analizzaGazzetta(xml: string): Novita[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    // Gestisce i namespace (content:encoded diventa "content:encoded" o "content_encoded")
    parseAttributeValue: true,
    // Rimuove spazi bianchi ridondanti
    trimValues: true,
    // Tratta "content:encoded" come attributo con namespace
    processEntities: true,
    htmlEntities: true,
  });

  let documento: unknown;
  try {
    documento = parser.parse(xml);
  } catch (err) {
    throw new Error(`Gazzetta: XML non valido — ${(err as Error).message}`);
  }

  const doc = documento as Record<string, unknown>;
  const rss = doc['rss'] as Record<string, unknown> | undefined;
  if (!rss) {
    throw new Error('Gazzetta: il feed non contiene un elemento <rss> radice — il server ha restituito una pagina non valida');
  }

  const channel = rss['channel'] as Record<string, unknown> | undefined;
  if (!channel) {
    throw new Error('Gazzetta: elemento <channel> mancante nel feed RSS');
  }

  const items = channel['item'];
  if (!items) {
    // Nessun item — potrebbe essere un numero vuoto; non e malformato
    return [];
  }

  const listaItem: Record<string, unknown>[] = Array.isArray(items) ? items : [items];

  const voci: Novita[] = [];

  for (const item of listaItem) {
    const titoloRaw = String(item['title'] ?? '').trim();

    // Filtra: solo atti normativi primari (leggi, decreti-legge, d.lgs., DPR)
    if (!ATTO_NORMATIVO.test(titoloRaw)) continue;

    const link = String(item['link'] ?? '').trim();
    const pubDate = String(item['pubDate'] ?? '').trim();

    if (!link || !pubDate) continue;
    // Solo URL http/https
    if (!link.startsWith('http://') && !link.startsWith('https://')) continue;

    const data = parsePubDate(pubDate);
    if (!data) continue;

    // Titolo: usiamo content:encoded se presente, altrimenti title
    // fast-xml-parser trasforma "content:encoded" in una proprieta con il nome letterale
    const contenuto = String(
      (item as Record<string, unknown>)['content:encoded'] ?? titoloRaw
    ).trim();

    // Prendo il titolo principale (da <title>) + il testo del decreto
    // Costruisco un titolo leggibile: "MINISTERO X - DECRETO dd mese aaaa: testo"
    const titoloDecodificato = decodificaEntita(titoloRaw);
    const contenutoDecodificato = decodificaEntita(contenuto);

    // Il titolo finale: ministero + descrizione dell'atto (primo periodo del contenuto)
    const primoPerioodo = contenutoDecodificato.split(/[.\n]/)[0].trim();
    const titoloCompleto = primoPerioodo.length > 10
      ? `${titoloDecodificato}: ${primoPerioodo}`
      : titoloDecodificato;

    // URL: la GU usa http, convertiamo in https per superare la validazione
    const urlFinal = link.replace(/^http:\/\/www\.gazzettaufficiale\.it/, 'https://www.gazzettaufficiale.it');

    // Estrai il codice ELI come identificativo
    // Esempio: https://www.gazzettaufficiale.it/eli/id/2026/06/10/26A02867/SG
    const matchEli = urlFinal.match(/eli\/id\/[\d/]+\/([A-Z0-9]+)\/SG/);
    const codice = matchEli ? matchEli[1] : urlFinal.split('/').filter(Boolean).pop() ?? 'sconosciuto';

    // titolo intero: l'accorciamento avviene a video (titoloNovitaBreve), col testo
    // completo nella tendina. Salvarlo troncato perdeva pezzi di titolo (come camera/senato).
    voci.push(SchemaNovita.parse({
      id: `gazzetta-${codice}`,
      titolo: titoloCompleto,
      tipo: 'gazzetta',
      stato: 'approvata',
      data,
      url: urlFinal,
    }));
  }

  return voci;
}
