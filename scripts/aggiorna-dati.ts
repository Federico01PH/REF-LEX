import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { SchemaNovitaFile, type Novita, type NovitaFile } from '../src/engine/novita';
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

// Il job notturno aggiorna SOLO il feed delle novita (novita.json).
// catalogo.json NON va rigenerato ogni notte: cambierebbe solo il campo generatoIl,
// producendo commit e deploy inutili. Lo si rigenera a mano con `npm run genera-catalogo`
// quando si bumpa VERSIONE_CATALOGO (vedi flusso di deploy).
export function scriviDati(cartella: string, file: NovitaFile): void {
  mkdirSync(cartella, { recursive: true });
  writeFileSync(join(cartella, 'novita.json'), JSON.stringify(file, null, 2), 'utf8');
}

async function main() {
  const oggi = new Date().toISOString().slice(0, 10);
  const radice = join(dirname(fileURLToPath(import.meta.url)), '..');
  const cartella = join(radice, 'public', 'dati');

  // Resiliente: se una fonte non e disponibile (es. la Camera blocca spesso il
  // fetch automatico con una pagina anti-bot) la SALTIAMO con un avviso rumoroso,
  // invece di bloccare l'intero aggiornamento. Cosi il feed resta fresco con le
  // fonti che rispondono. Serve pero' almeno una fonte: mai un feed vuoto silenzioso.
  async function provaFonte(nome: string, fn: () => Promise<Novita[]>): Promise<Novita[]> {
    try {
      const voci = await fn();
      console.log(`${nome}: ${voci.length} voci`);
      return voci;
    } catch (e) {
      console.warn(`AVVISO — fonte "${nome}" non disponibile, la salto: ${(e as Error).message}`);
      return [];
    }
  }

  const gazzetta = await provaFonte('gazzetta', () =>
    scarica(URL_GAZZETTA, 'application/rss+xml, application/xml, */*').then(analizzaGazzetta));
  const camera = await provaFonte('camera', () =>
    scarica(URL_CAMERA, 'application/sparql-results+json').then((t) => analizzaCamera(JSON.parse(t))));
  const senato = await provaFonte('senato', () =>
    scarica(URL_SENATO, 'application/sparql-results+json').then((t) => analizzaSenato(JSON.parse(t))));

  const voci = unisci(gazzetta, camera, senato);
  if (voci.length === 0) {
    throw new Error('Nessuna fonte disponibile: feed non aggiornato (tutte le fonti hanno fallito).');
  }

  const file = SchemaNovitaFile.parse({ generatoIl: oggi, voci });

  scriviDati(cartella, file);

  console.log(
    `novita.json: ${file.voci.length} voci` +
    ` (gazzetta: ${gazzetta.length}, camera: ${camera.length}, senato: ${senato.length})`
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
