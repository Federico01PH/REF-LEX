import { SchemaNovita, type Novita } from '../../src/engine/novita';

// Query SPARQL verificata live su dati.camera.it/sparql (2026-06-11).
// Seleziona gli atti della legislatura 19 ordinati per data di ultima modifica
// decrescente, LIMIT 15. Usa DISTINCT per evitare duplicati da join multipli.
const QUERY_SPARQL = `PREFIX ocd: <http://dati.camera.it/ocd/>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX ods: <http://lod.xdams.org/ontologies/ods/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT DISTINCT ?atto ?numero ?presentazione ?titolo ?fase ?dataIter
WHERE {
  ?atto a ocd:atto ;
        ocd:rif_leg <http://dati.camera.it/ocd/legislatura.rdf/repubblica_19> ;
        dc:title ?titolo ;
        dc:identifier ?numero ;
        dc:date ?presentazione ;
        ocd:rif_statoIter ?statoIterRes ;
        ods:modified ?modifiedDt .
  ?statoIterRes rdfs:label ?fase .
  BIND(REPLACE(STR(?modifiedDt), "T.*$", "") AS ?dataIter)
}
ORDER BY DESC(?modifiedDt)
LIMIT 15`;

export const URL_FONTE =
  'https://dati.camera.it/sparql?query=' +
  encodeURIComponent(QUERY_SPARQL) +
  '&format=application%2Fsparql-results%2Bjson';

/**
 * Decodifica le entita HTML numeriche e nominali tipiche dei titoli Camera.
 * Poi rimuove eventuali tag residui come <em>, </em>.
 */
function decodificaEntita(testo: string): string {
  return testo
    // entita numeriche decimali &#160; &#233; ecc.
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    // entita numeriche esadecimali &#x00E0; ecc.
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    // entita nominali frequenti nei titoli Camera
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
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
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
    .replace(/&apos;/g, "'")
    // rimuove tag HTML residui come <em>, </em>, <strong> ecc.
    .replace(/<[^>]+>/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Converte una data in vari formati in yyyy-mm-dd.
 * Formati supportati:
 *   - yyyymmdd (dal fixture: "20260609")
 *   - yyyy-mm-dd o yyyy-mm-dd HH:MM:SS (dall'endpoint live)
 */
function convertiData(raw: string): string | null {
  const trimmed = raw.trim();
  // yyyymmdd
  if (/^\d{8}$/.test(trimmed)) {
    return `${trimmed.slice(0, 4)}-${trimmed.slice(4, 6)}-${trimmed.slice(6, 8)}`;
  }
  // yyyy-mm-dd (con o senza orario)
  const matchData = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
  if (matchData) return matchData[1];
  return null;
}

/**
 * Analizza il risultato SPARQL JSON della Camera dei Deputati.
 * Lancia un errore descrittivo se la struttura non e quella attesa.
 * Ogni voce passa da SchemaNovita.parse() — se invalida, lancia.
 */
export function analizzaCamera(jsonSparql: unknown): Novita[] {
  if (
    typeof jsonSparql !== 'object' ||
    jsonSparql === null ||
    !('results' in jsonSparql)
  ) {
    throw new Error('Camera: il JSON non contiene la chiave "results" — il server ha restituito una risposta non valida');
  }

  const radice = jsonSparql as Record<string, unknown>;
  const results = radice['results'];

  if (
    typeof results !== 'object' ||
    results === null ||
    !('bindings' in results) ||
    !Array.isArray((results as Record<string, unknown>)['bindings'])
  ) {
    throw new Error('Camera: results.bindings mancante o non e un array — struttura SPARQL non riconosciuta');
  }

  const bindings = (results as Record<string, unknown>)['bindings'] as unknown[];
  const voci: Novita[] = [];
  const visti = new Set<string>();

  for (const binding of bindings) {
    if (typeof binding !== 'object' || binding === null) continue;
    const b = binding as Record<string, { type: string; value: string } | undefined>;

    const numeroRaw = b['numero']?.value?.trim() ?? '';
    const titoloRaw = b['titolo']?.value ?? '';
    const dataIterRaw = b['dataIter']?.value?.trim() ?? '';

    if (!numeroRaw || !titoloRaw || !dataIterRaw) continue;

    // Deduplicazione: un atto puo apparire piu volte se ha piu stati iter
    if (visti.has(numeroRaw)) continue;
    visti.add(numeroRaw);

    const data = convertiData(dataIterRaw);
    if (!data) continue;

    const titoloDecodificato = decodificaEntita(titoloRaw);
    // Rimuovi eventuali "(numero)" finali inseriti dalla Camera nel titolo
    const titoloNetto = titoloDecodificato
      .replace(/\s*\(\d+\)\s*$/, '')
      .trim();

    if (!titoloNetto) continue;

    const troncato = titoloNetto.length > 160
      ? titoloNetto.slice(0, 160) + '…'
      : titoloNetto;

    const url = `https://www.camera.it/leg19/126?leg=19&idDocumento=${encodeURIComponent(numeroRaw)}`;

    voci.push(SchemaNovita.parse({
      id: `camera-${numeroRaw}`,
      titolo: troncato,
      tipo: 'camera',
      stato: 'discussione',
      data,
      url,
    }));
  }

  return voci;
}
