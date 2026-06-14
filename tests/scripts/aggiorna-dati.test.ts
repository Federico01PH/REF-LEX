import { mkdtempSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { scriviDati, unisci } from '../../scripts/aggiorna-dati';
import type { Novita } from '../../src/engine/novita';

function voce(id: string, data: string): Novita {
  return { id, titolo: `Atto ${id}`, tipo: 'gazzetta', stato: 'approvata', data, url: 'https://www.normattiva.it' };
}

test('unisce le voci ordinandole per data e tiene le 20 piu recenti', () => {
  const tante = Array.from({ length: 30 }, (_, i) => voce(`g${i}`, `2026-01-${String((i % 28) + 1).padStart(2, '0')}`));
  expect(unisci(tante).length).toBe(20);
});

test('il job notturno scrive solo novita.json, NON catalogo.json', () => {
  const cartella = mkdtempSync(join(tmpdir(), 'reflex-dati-'));
  try {
    scriviDati(cartella, { generatoIl: '2026-06-14', voci: [voce('g1', '2026-06-14')] });
    expect(existsSync(join(cartella, 'novita.json'))).toBe(true);
    // catalogo.json va rigenerato a mano con `npm run genera-catalogo`, non ogni notte
    expect(existsSync(join(cartella, 'catalogo.json'))).toBe(false);
    const scritto = JSON.parse(readFileSync(join(cartella, 'novita.json'), 'utf8'));
    expect(scritto.voci).toHaveLength(1);
  } finally {
    rmSync(cartella, { recursive: true, force: true });
  }
});
