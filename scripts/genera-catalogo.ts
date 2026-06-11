import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { CATALOGO } from '../src/data/laws';
import { VERSIONE_CATALOGO } from '../src/data/laws/versione';

export function costruisciCatalogoRemoto(generatoIl: string) {
  return { versione: VERSIONE_CATALOGO, generatoIl, leggi: CATALOGO };
}

export function scriviCatalogo(cartellaDati: string, generatoIl: string): void {
  mkdirSync(cartellaDati, { recursive: true });
  writeFileSync(join(cartellaDati, 'catalogo.json'),
    JSON.stringify(costruisciCatalogoRemoto(generatoIl), null, 2), 'utf8');
}

// Eseguito direttamente: genera in public/dati.
// Nota Windows: il confronto con resolve() è più robusto del confronto diretto
// (differenze di separatore e maiuscole del drive letter con tsx su Windows).
const scriptPath = resolve(fileURLToPath(import.meta.url));
const argv1Path = resolve(process.argv[1] ?? '');
if (scriptPath === argv1Path) {
  const radice = join(dirname(fileURLToPath(import.meta.url)), '..');
  scriviCatalogo(join(radice, 'public', 'dati'), new Date().toISOString().slice(0, 10));
  console.log('catalogo.json generato');
}
