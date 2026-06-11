import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { SchemaNovitaFile, type Novita } from '../src/engine/novita';
import { scriviCatalogo } from './genera-catalogo';
import { analizzaGazzetta, URL_FONTE as URL_GAZZETTA } from './fonti/gazzetta';
import { analizzaCamera, URL_FONTE as URL_CAMERA } from './fonti/camera';
import { analizzaSenato, URL_FONTE as URL_SENATO } from './fonti/senato';

async function scarica(url: string, accept: string): Promise<string> {
  let risposta: Response;
  try {
    risposta = await fetch(url, {
      headers: { accept, 'user-agent': 'REF-LEX aggiorna-dati/1.0' },
      signal: AbortSignal.timeout(30000),
    });
  } catch (e) {
    throw new Error(`Fonte ${url}: ${(e as Error).message}`);
  }
  if (!risposta.ok) throw new Error(`Fonte ${url}: HTTP ${risposta.status}`);
  return risposta.text();
}

export function unisci(...gruppi: Novita[][]): Novita[] {
  return gruppi
    .flat()
    .sort((a, b) => b.data.localeCompare(a.data))
    .slice(0, 20);
}

async function main() {
  const oggi = new Date().toISOString().slice(0, 10);
  const radice = join(dirname(fileURLToPath(import.meta.url)), '..');
  const cartella = join(radice, 'public', 'dati');

  // Tutte le fonti devono riuscire: un fallimento blocca la pubblicazione
  // (mai dati parziali silenziosi).
  const [gazzetta, camera, senato] = await Promise.all([
    scarica(URL_GAZZETTA, 'application/rss+xml, application/xml, */*')
      .then(analizzaGazzetta),
    scarica(URL_CAMERA, 'application/sparql-results+json')
      .then((t) => analizzaCamera(JSON.parse(t))),
    scarica(URL_SENATO, 'application/sparql-results+json')
      .then((t) => analizzaSenato(JSON.parse(t))),
  ]);

  const file = SchemaNovitaFile.parse({
    generatoIl: oggi,
    voci: unisci(gazzetta, camera, senato),
  });

  mkdirSync(cartella, { recursive: true });
  writeFileSync(join(cartella, 'novita.json'), JSON.stringify(file, null, 2), 'utf8');
  scriviCatalogo(cartella, oggi);

  console.log(
    `novita.json: ${file.voci.length} voci` +
    ` (gazzetta: ${gazzetta.length}, camera: ${camera.length}, senato: ${senato.length})` +
    ` · catalogo.json rigenerato`
  );
}

// Eseguito direttamente (non importato come modulo)
const scriptPath = resolve(fileURLToPath(import.meta.url));
const argv1Path = resolve(process.argv[1] ?? '');
if (scriptPath === argv1Path) {
  main().catch((errore) => {
    console.error(errore);
    process.exit(1);
  });
}
