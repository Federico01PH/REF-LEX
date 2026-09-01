import { dlMigrazioneAsilo } from '../../src/data/laws/dl-migrazione-asilo-2026';
import { CATALOGO } from '../../src/data/laws';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

// La LEGGE 7 agosto 2026, n. 145 (GU n. 183 dell'8/8/2026, in vigore dal 9/8/2026) è la
// conversione del DL 12 giugno 2026, n. 100, già in catalogo. Il testo su Normattiva dice
// «È convertito in legge il decreto-legge 12 giugno 2026, n. 100», SENZA "con modificazioni":
// il contenuto non è cambiato di una virgola. Per questo non c'è una scheda nuova — sarebbe
// un doppione dello stesso testo — ma la scheda esistente va aggiornata.

test('la legge 145/2026 non crea un doppione: resta una sola scheda per il DL 100/2026', () => {
  const schede = CATALOGO.filter((l) =>
    l.titoloUfficiale.includes('100') && l.titoloUfficiale.includes('migrazione'));
  expect(schede).toHaveLength(1);
  expect(schede[0].id).toBe('dl-migrazione-asilo-2026');
});

test('il titolo ufficiale dice che è stato convertito senza modificazioni', () => {
  expect(dlMigrazioneAsilo.titoloUfficiale).toContain('legge 7 agosto 2026, n. 145');
  expect(dlMigrazioneAsilo.titoloUfficiale).toContain('senza modificazioni');
});

test('la legge di conversione è tra le fonti, con il link a Normattiva', () => {
  const fonte = dlMigrazioneAsilo.fonti.find((f) => f.etichetta.includes('145'));
  expect(fonte).toBeDefined();
  expect(fonte!.url).toContain('normattiva.it');
  expect(fonte!.url).toContain('2026-08-07;145');
});

// Prima della conversione le regole su frontiera, asilo ed Eurodac erano "probabile" solo
// perché il decreto poteva cambiare in conversione. Ora il testo è definitivo.
test('le regole sul decreto non sono più "probabile": il testo è definitivo', () => {
  const p: Profilo = { schemaVersion: 1, eta: 30, cittadinanza: 'extra-ue' };
  const effetti = simula(p, dlMigrazioneAsilo).effetti;
  expect(effetti.length).toBeGreaterThan(0);
  for (const e of effetti) expect(e.confidenza).toBe('certa');
});

test('nessuna nota dice più che il decreto è ancora da convertire', () => {
  for (const r of dlMigrazioneAsilo.regole)
    expect(r.noteConfidenza ?? '').not.toMatch(/da convertire/i);
});

test('il riassunto non promette più una conversione futura', () => {
  expect(dlMigrazioneAsilo.riassunto).not.toMatch(/va convertito/i);
  expect(dlMigrazioneAsilo.riassunto).toContain('7 agosto 2026');
});

test('la data di verifica è stata aggiornata al controllo sulla conversione', () => {
  expect(dlMigrazioneAsilo.verificataIl).toBe('2026-09-01');
});
