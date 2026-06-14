import { SchemaNovita, type Novita } from '../../src/engine/novita';
import { decodificaEntita } from './testo';

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
 * Lancia se bindings e vuoto (deriva di ontologia) o se nessun atto e estraibile.
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

  if (bindings.length === 0) {
    throw new Error('Camera: la query SPARQL non ha restituito alcun atto — probabile cambiamento dell\'ontologia, verificare la query');
  }

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

    const url = `https://www.camera.it/leg19/126?leg=19&idDocumento=${encodeURIComponent(numeroRaw)}`;

    voci.push(SchemaNovita.parse({
      id: `camera-${numeroRaw}`,
      // titolo intero: l'accorciamento avviene a video (titoloNovitaBreve), col testo
      // completo nella tendina. Salvarlo troncato perdeva pezzi di titolo.
      titolo: titoloNetto,
      tipo: 'camera',
      stato: 'discussione',
      data,
      url,
    }));
  }

  if (voci.length === 0) {
    throw new Error('Camera: nessun atto valido estratto dai bindings — i campi attesi potrebbero essere cambiati nell\'ontologia');
  }

  return voci;
}
