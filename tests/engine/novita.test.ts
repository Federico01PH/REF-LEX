import { SchemaNovitaFile, SchemaCatalogoRemoto, ambitiNovita } from '../../src/engine/novita';
import { CATALOGO } from '../../src/data/laws';
import { VERSIONE_CATALOGO } from '../../src/data/laws/versione';

const novitaValida = {
  generatoIl: '2026-06-11',
  voci: [{
    id: 'gazzetta-2026-90', titolo: 'Legge di esempio', tipo: 'gazzetta',
    stato: 'approvata', data: '2026-06-10', url: 'https://www.gazzettaufficiale.it/eli/id/2026/06/10/x'
  }]
};

test('accetta un file novità valido', () => {
  expect(SchemaNovitaFile.safeParse(novitaValida).success).toBe(true);
});

test('rifiuta voce con tipo sconosciuto o url non valido', () => {
  const rotta = structuredClone(novitaValida);
  rotta.voci[0].tipo = 'blog' as never;
  expect(SchemaNovitaFile.safeParse(rotta).success).toBe(false);
  const rotta2 = structuredClone(novitaValida);
  rotta2.voci[0].url = 'non-un-url';
  expect(SchemaNovitaFile.safeParse(rotta2).success).toBe(false);
});

test('rifiuta url con schemi pericolosi (solo http/https)', () => {
  const rotta = structuredClone(novitaValida);
  rotta.voci[0].url = 'javascript:alert(1)';
  expect(SchemaNovitaFile.safeParse(rotta).success).toBe(false);
});

test('rifiuta più di 20 voci', () => {
  const troppe = { ...novitaValida, voci: Array.from({ length: 21 }, (_, i) => ({ ...novitaValida.voci[0], id: `v${i}` })) };
  expect(SchemaNovitaFile.safeParse(troppe).success).toBe(false);
});

test('ambitiNovita classifica il titolo dal contenuto (parole chiave)', () => {
  expect(ambitiNovita('Disposizioni in materia di welfare aziendale e asili nido')).toContain('pensioni-welfare');
  expect(ambitiNovita('Delega al Governo in materia di energia nucleare sostenibile')).toContain('ambiente');
  expect(ambitiNovita('Istituzione dei "Distretti Termali" quali Zone Franche Urbane')).toContain('turismo');
  expect(ambitiNovita('Introduzione dell\'articolo 148-bis del codice dei beni culturali e del paesaggio')).toContain('arte');
  // un titolo generico che non tocca nessun argomento noto resta senza ambiti (solo "Tutte")
  expect(ambitiNovita('Disposizioni varie e finali')).toHaveLength(0);
});

test('il catalogo incorporato serializzato rispetta SchemaCatalogoRemoto', () => {
  const file = { versione: VERSIONE_CATALOGO, generatoIl: '2026-06-11', leggi: CATALOGO };
  const esito = SchemaCatalogoRemoto.safeParse(JSON.parse(JSON.stringify(file)));
  if (!esito.success) throw new Error(esito.error.message);
});
