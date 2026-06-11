import { caricaCatalogoRemoto, caricaNovita } from '../../src/storage/datiRemoti';
import { CATALOGO } from '../../src/data/laws';

const catalogoRemoto = (versione: number) => ({
  versione, generatoIl: '2026-06-11', leggi: JSON.parse(JSON.stringify(CATALOGO))
});
const novitaFile = {
  generatoIl: '2026-06-11',
  voci: [{ id: 'camera-1', titolo: 'Proposta di esempio', tipo: 'camera', stato: 'discussione', data: '2026-06-09', url: 'https://www.camera.it/x' }]
};

function mockFetch(risposta: unknown, ok = true) {
  vi.stubGlobal('fetch', vi.fn(async () => ({
    ok, json: async () => risposta
  })) as unknown as typeof fetch);
}

beforeEach(() => { localStorage.clear(); vi.unstubAllGlobals(); });

test('catalogo remoto con versione maggiore: lo restituisce e lo mette in cache', async () => {
  mockFetch(catalogoRemoto(2));
  const r = await caricaCatalogoRemoto(1);
  expect(r?.versione).toBe(2);
  expect(localStorage.getItem('reflex.catalogo.cache')).not.toBeNull();
});

test('catalogo remoto con versione uguale o minore: null', async () => {
  mockFetch(catalogoRemoto(1));
  expect(await caricaCatalogoRemoto(1)).toBeNull();
});

test('JSON non valido: null e niente cache', async () => {
  mockFetch({ versione: 2, leggi: 'rotto' });
  expect(await caricaCatalogoRemoto(1)).toBeNull();
  expect(localStorage.getItem('reflex.catalogo.cache')).toBeNull();
});

test('fetch fallito ma cache valida presente: usa la cache', async () => {
  localStorage.setItem('reflex.catalogo.cache', JSON.stringify(catalogoRemoto(3)));
  vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline'); }) as unknown as typeof fetch);
  const r = await caricaCatalogoRemoto(1);
  expect(r?.versione).toBe(3);
});

test('fetch fallito e cache assente: null', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline'); }) as unknown as typeof fetch);
  expect(await caricaCatalogoRemoto(1)).toBeNull();
});

test('novità valide: le restituisce; fetch fallito: null', async () => {
  mockFetch(novitaFile);
  expect((await caricaNovita())?.voci).toHaveLength(1);
  vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline'); }) as unknown as typeof fetch);
  expect(await caricaNovita()).toBeNull();
});
