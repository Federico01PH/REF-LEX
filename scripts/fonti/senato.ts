import { SchemaNovita, type Novita } from '../../src/engine/novita';

// Query SPARQL verificata live su dati.senato.it/sparql (2026-06-11).
// Seleziona i disegni di legge della legislatura 19 ordinati per
// dataPresentazione decrescente, LIMIT 15.
const QUERY_SPARQL = `PREFIX osr: <http://dati.senato.it/osr/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
SELECT ?ddl ?titolo ?dataPresentazione ?fase
WHERE {
  ?ddl a osr:Ddl ;
       osr:titolo ?titolo ;
       osr:dataPresentazione ?dataPresentazione ;
       osr:fase ?fase ;
       osr:legislatura "19"^^xsd:integer .
}
ORDER BY DESC(?dataPresentazione)
LIMIT 15`;

export const URL_FONTE =
  'https://dati.senato.it/sparql?query=' +
  encodeURIComponent(QUERY_SPARQL) +
  '&format=application%2Fsparql-results%2Bjson';

/**
 * Estrae l'ID numerico dalla URI del DDL Senato.
 * Esempio: "http://dati.senato.it/ddl/60199" -> "60199"
 */
function estraiIdDdl(uri: string): string | null {
  const match = uri.match(/\/ddl\/(\d+)$/);
  return match ? match[1] : null;
}

/**
 * Analizza il risultato SPARQL JSON del Senato.
 * Lancia un errore descrittivo se la struttura non e quella attesa.
 * Ogni voce passa da SchemaNovita.parse() — se invalida, lancia.
 */
export function analizzaSenato(jsonSparql: unknown): Novita[] {
  if (
    typeof jsonSparql !== 'object' ||
    jsonSparql === null ||
    !('results' in jsonSparql)
  ) {
    throw new Error('Senato: il JSON non contiene la chiave "results" — il server ha restituito una risposta non valida');
  }

  const radice = jsonSparql as Record<string, unknown>;
  const results = radice['results'];

  if (
    typeof results !== 'object' ||
    results === null ||
    !('bindings' in results) ||
    !Array.isArray((results as Record<string, unknown>)['bindings'])
  ) {
    throw new Error('Senato: results.bindings mancante o non e un array — struttura SPARQL non riconosciuta');
  }

  const bindings = (results as Record<string, unknown>)['bindings'] as unknown[];
  const voci: Novita[] = [];

  for (const binding of bindings) {
    if (typeof binding !== 'object' || binding === null) continue;
    const b = binding as Record<string, { type: string; value: string } | undefined>;

    const ddlUri = b['ddl']?.value?.trim() ?? '';
    const titoloRaw = b['titolo']?.value?.trim() ?? '';
    const dataPresentazione = b['dataPresentazione']?.value?.trim() ?? '';

    if (!ddlUri || !titoloRaw || !dataPresentazione) continue;

    // La data e gia in formato yyyy-mm-dd
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataPresentazione)) continue;

    const id = estraiIdDdl(ddlUri);
    if (!id) continue;

    const troncato = titoloRaw.length > 160
      ? titoloRaw.slice(0, 160) + '…'
      : titoloRaw;

    // dati.senato.it fornisce un URI RDF. Con schema https il server
    // reindirizza a una pagina HTML leggibile sul sito istituzionale.
    const url = ddlUri.replace(/^http:\/\//, 'https://');

    voci.push(SchemaNovita.parse({
      id: `senato-${id}`,
      titolo: troncato,
      tipo: 'senato',
      stato: 'discussione',
      data: dataPresentazione,
      url,
    }));
  }

  return voci;
}
