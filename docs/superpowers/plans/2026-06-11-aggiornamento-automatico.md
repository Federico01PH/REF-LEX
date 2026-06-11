# REF-LEX — Aggiornamento automatico + Novità dal Parlamento + restyle umano (Piano di implementazione)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** L'app si aggiorna da sola: catalogo remoto scaricato all'avvio (stessa origine, anonimo), sezione "Novità dal Parlamento" alimentata ogni notte dagli open data ufficiali, e restyle "umano" (sfondo bianco, card bordate, titoli serif).

**Architecture:** Nessun backend. Una pipeline Node (`scripts/`) interroga le fonti ufficiali e rigenera due JSON statici in `public/dati/`; l'app li scarica a runtime dalla stessa origine, li valida con zod e degrada con onestà (fallback al catalogo incorporato + cache localStorage). La UI aggiunge una sezione novità in cima al Catalogo. CSP resta `connect-src 'self'`.

**Tech Stack:** esistente (Vite 6, React 18, TS 5, zod, vitest) + devDeps nuove: `tsx` (esegue script TS), `fast-xml-parser` (feed Gazzetta), `@fontsource-variable/fraunces` (font titoli self-hosted).

**Spec:** `docs/superpowers/specs/2026-06-11-aggiornamento-automatico-design.md`

**Regole trasversali:** UI in italiano corretto (accenti letterali, MAI scrivere file via PowerShell: usare i tool Write/Edit). NIENTE emoji. Commit frequenti con suffisso `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`. I test non toccano mai la rete (fetch mockato, fixture su file).

---

## Mappa dei file

```
src/ui/tokens.css                 # MODIFICA: sfondo bianco, ombra tenue
src/ui/base.css                   # MODIFICA: card bordate, titoli Fraunces
src/main.tsx                      # MODIFICA: import font
src/engine/novita.ts              # NUOVO: tipo Novita + SchemaNovitaFile + SchemaCatalogoRemoto
src/data/laws/versione.ts         # NUOVO: VERSIONE_CATALOGO
src/storage/datiRemoti.ts         # NUOVO: caricaCatalogoRemoto(), caricaNovita() + cache
src/features/NovitaParlamento.tsx # NUOVO: sezione UI novità
src/features/Catalogo.tsx         # MODIFICA: props leggi/novita/infoCatalogo + sezione
src/App.tsx                       # MODIFICA: stato catalogo attivo, fetch all'avvio
scripts/genera-catalogo.ts        # NUOVO: serializza catalogo → public/dati/catalogo.json
scripts/fonti/gazzetta.ts         # NUOVO: parser feed GU → Novita[]
scripts/fonti/camera.ts           # NUOVO: parser SPARQL Camera → Novita[]
scripts/fonti/senato.ts           # NUOVO: parser SPARQL Senato → Novita[]
scripts/aggiorna-dati.ts          # NUOVO: orchestratore (fallisce rumorosamente)
.github/workflows/aggiorna-dati.yml # NUOVO: cron notturno
public/dati/catalogo.json         # GENERATO e committato
public/dati/novita.json           # GENERATO e committato
tests/engine/novita.test.ts, tests/storage/datiRemoti.test.ts,
tests/features/NovitaParlamento.test.tsx, tests/scripts/fonti.test.ts,
tests/scripts/genera-catalogo.test.ts, tests/scripts/fixtures/*  # NUOVI
```

---

### Task 1: Restyle "umano" (sfondo bianco, card bordate, titoli serif)

**Files:** Modify: `src/ui/tokens.css`, `src/ui/base.css`, `src/main.tsx`, `package.json`

- [ ] **Step 1: Installa il font** — `npm install @fontsource-variable/fraunces`

- [ ] **Step 2: Modifica `src/ui/tokens.css`** — nel blocco `:root` cambia SOLO queste righe:

```css
  --sfondo: #FFFFFF; --superficie: #FFFFFF; --superficie-2: #F2F5FB;
  --ombra: 0 2px 10px rgba(22, 38, 92, 0.06);
```
(il tema scuro resta invariato)

- [ ] **Step 3: Modifica `src/ui/base.css`**:
  - alla regola `.card` aggiungi `border: 1px solid var(--bordo);`
  - dopo la regola `h1, h2, h3 { line-height: 1.25; }` aggiungi:
```css
h1, h2 { font-family: 'Fraunces Variable', Georgia, 'Times New Roman', serif; letter-spacing: -0.01em; }
```
  - alla regola `main` porta il padding a `padding: 20px 16px 32px;`

- [ ] **Step 4: Modifica `src/main.tsx`** — aggiungi come prima riga di import:
```ts
import '@fontsource-variable/fraunces';
```

- [ ] **Step 5: Verifica** — `npm test` (tutti verdi, inclusi gli axe esistenti) e `npm run build` (verde). Avvia `npm run dev` e controlla a occhio: sfondo bianco, card bordate, titoli serif, tema scuro intatto.

- [ ] **Step 6: Commit** — `git add -A; git commit -m "Restyle umano: sfondo bianco, card bordate, titoli Fraunces"`

---

### Task 2: Tipi e schemi dei dati remoti

**Files:** Create: `src/engine/novita.ts`, `src/data/laws/versione.ts`. Test: `tests/engine/novita.test.ts`

- [ ] **Step 1: Test che fallisce** — `tests/engine/novita.test.ts`:

```ts
import { SchemaNovitaFile, SchemaCatalogoRemoto } from '../../src/engine/novita';
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

test('rifiuta più di 20 voci', () => {
  const troppe = { ...novitaValida, voci: Array.from({ length: 21 }, (_, i) => ({ ...novitaValida.voci[0], id: `v${i}` })) };
  expect(SchemaNovitaFile.safeParse(troppe).success).toBe(false);
});

test('il catalogo incorporato serializzato rispetta SchemaCatalogoRemoto', () => {
  const file = { versione: VERSIONE_CATALOGO, generatoIl: '2026-06-11', leggi: CATALOGO };
  const esito = SchemaCatalogoRemoto.safeParse(JSON.parse(JSON.stringify(file)));
  if (!esito.success) throw new Error(esito.error.message);
});
```

- [ ] **Step 2: Esegui** — `npm test -- novita` → FAIL (moduli inesistenti).

- [ ] **Step 3: Implementa.** `src/data/laws/versione.ts`:

```ts
// Incrementare a ogni modifica del contenuto del catalogo: il client
// sostituisce il catalogo incorporato solo se la versione remota è maggiore.
export const VERSIONE_CATALOGO = 1;
```

`src/engine/novita.ts`:

```ts
import { z } from 'zod';
import { SchemaLegge } from './schema';

export const SchemaNovita = z.object({
  id: z.string().min(1),
  titolo: z.string().min(5),
  tipo: z.enum(['gazzetta', 'camera', 'senato']),
  stato: z.enum(['vigore', 'approvata', 'discussione', 'bozza', 'referendum']),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  url: z.string().url()
});
export type Novita = z.infer<typeof SchemaNovita>;

export const SchemaNovitaFile = z.object({
  generatoIl: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  voci: z.array(SchemaNovita).max(20)
});
export type NovitaFile = z.infer<typeof SchemaNovitaFile>;

export const SchemaCatalogoRemoto = z.object({
  versione: z.number().int().positive(),
  generatoIl: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  leggi: z.array(SchemaLegge).min(1)
});
```

- [ ] **Step 4: Esegui** — `npm test -- novita` → PASS (4 test). `npm run build` verde.

- [ ] **Step 5: Commit** — `git add -A; git commit -m "Tipi e schemi zod per novita e catalogo remoto, versione catalogo"`

---

### Task 3: Loader dei dati remoti

**Files:** Create: `src/storage/datiRemoti.ts`. Test: `tests/storage/datiRemoti.test.ts`

- [ ] **Step 1: Test che fallisce** — `tests/storage/datiRemoti.test.ts`:

```ts
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
```

- [ ] **Step 2: Esegui** — `npm test -- datiRemoti` → FAIL.

- [ ] **Step 3: Implementa `src/storage/datiRemoti.ts`**:

```ts
import { SchemaCatalogoRemoto, SchemaNovitaFile, type NovitaFile } from '../engine/novita';
import type { Legge } from '../engine/types';

const CHIAVE_CACHE = 'reflex.catalogo.cache';

export interface CatalogoRemoto { versione: number; generatoIl: string; leggi: Legge[]; }

async function scaricaJson(percorso: string): Promise<unknown | null> {
  try {
    const base = import.meta.env?.BASE_URL ?? '/';
    const risposta = await fetch(`${base}${percorso}`, { cache: 'no-store' });
    if (!risposta.ok) return null;
    return await risposta.json();
  } catch {
    return null;
  }
}

function leggiCache(versioneLocale: number): CatalogoRemoto | null {
  try {
    const grezzo = localStorage.getItem(CHIAVE_CACHE);
    if (!grezzo) return null;
    const esito = SchemaCatalogoRemoto.safeParse(JSON.parse(grezzo));
    if (!esito.success || esito.data.versione <= versioneLocale) return null;
    return esito.data as CatalogoRemoto;
  } catch {
    return null;
  }
}

export async function caricaCatalogoRemoto(versioneLocale: number): Promise<CatalogoRemoto | null> {
  const grezzo = await scaricaJson('dati/catalogo.json');
  if (grezzo !== null) {
    const esito = SchemaCatalogoRemoto.safeParse(grezzo);
    if (esito.success && esito.data.versione > versioneLocale) {
      try { localStorage.setItem(CHIAVE_CACHE, JSON.stringify(esito.data)); } catch { /* solo sessione */ }
      return esito.data as CatalogoRemoto;
    }
    if (esito.success) return null; // remoto valido ma non più nuovo
  }
  return leggiCache(versioneLocale);
}

export async function caricaNovita(): Promise<NovitaFile | null> {
  const grezzo = await scaricaJson('dati/novita.json');
  if (grezzo === null) return null;
  const esito = SchemaNovitaFile.safeParse(grezzo);
  return esito.success ? esito.data : null;
}
```

ATTENZIONE coerenza test/implementazione: nel test "JSON non valido" il fetch riesce ma la validazione fallisce e non c'è cache → il loader prova `leggiCache` che restituisce null → ok. Nel test "versione uguale": remoto valido ma non più nuovo → `return null` SENZA passare dalla cache (comportamento voluto: il chiamante userà il catalogo incorporato).

- [ ] **Step 4: Esegui** — `npm test -- datiRemoti` → PASS (6 test).

- [ ] **Step 5: Commit** — `git add -A; git commit -m "Loader dati remoti: catalogo versionato con cache e novita validate"`

---

### Task 4: Integrazione in App (catalogo attivo + novità)

**Files:** Modify: `src/App.tsx`, `src/features/Catalogo.tsx`, `tests/features/Catalogo.test.tsx`, `tests/App.test.tsx`

- [ ] **Step 1: Aggiorna i test** (prima, TDD). In `tests/features/Catalogo.test.tsx` aggiungi a ogni `render(<Catalogo ... />)` le nuove prop `leggi={CATALOGO} novita={null} infoCatalogo={{ fonte: 'locale' }}` (import `CATALOGO` da `../../src/data/laws`). Aggiungi test:

```tsx
test('mostra la nota sulla fonte del catalogo', () => {
  render(<Catalogo profilo={dipendente} esploratore={false} leggi={CATALOGO} novita={null}
    infoCatalogo={{ fonte: 'locale' }} onScegli={vi.fn()}
    onModificaProfilo={vi.fn()} onPrivacy={vi.fn()} onEsciEsploratore={vi.fn()} />);
  expect(screen.getByText(/catalogo locale/i)).toBeInTheDocument();
});
```

In `tests/App.test.tsx` aggiungi in cima (il fetch dei dati remoti non deve toccare la rete nei test):

```ts
beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('niente rete nei test'); }) as unknown as typeof fetch);
});
afterEach(() => vi.unstubAllGlobals());
```
(sostituisce il `beforeEach` esistente con solo `localStorage.clear()`).

- [ ] **Step 2: Esegui** — `npm test -- Catalogo App` → FAIL (prop mancanti).

- [ ] **Step 3: Modifica `src/features/Catalogo.tsx`**:
  - nuova firma delle props (aggiunte in coda, nessuna rimozione):
```tsx
import type { NovitaFile } from '../engine/novita';
import { NovitaParlamento } from './NovitaParlamento';
// ...
export function Catalogo({ profilo, esploratore, leggi, novita, infoCatalogo, onScegli, onModificaProfilo, onPrivacy, onEsciEsploratore }: {
  profilo: Profilo; esploratore: boolean; leggi: Legge[]; novita: NovitaFile | null;
  infoCatalogo: { fonte: 'locale' | 'remoto'; generatoIl?: string };
  onScegli: (id: string) => void; onModificaProfilo: () => void; onPrivacy: () => void; onEsciEsploratore: () => void;
}) {
```
  - rimuovi `import { CATALOGO } from '../data/laws';` e sostituisci `CATALOGO.filter` con `leggi.filter` (aggiungi `import type { Legge } ...` ai tipi già importati);
  - subito dopo l'`h1` (e l'eventuale badge esploratore) inserisci:
```tsx
      {novita && novita.voci.length > 0 && <NovitaParlamento novita={novita} />}
```
  - in fondo, prima dei due bottoni footer, aggiungi la nota fonte:
```tsx
      <p className="testo-piccolo spazio">
        {infoCatalogo.fonte === 'remoto'
          ? `Catalogo aggiornato automaticamente al ${infoCatalogo.generatoIl}.`
          : 'Catalogo locale incluso nell\'app: si aggiorna da solo quando sei online.'}
      </p>
```
  NOTA: `NovitaParlamento` non esiste ancora — crea in questo task un segnaposto `src/features/NovitaParlamento.tsx` che accetta `{ novita: NovitaFile }` e rende `<h2>Novità dal Parlamento</h2>` (implementazione completa nel Task 5).

- [ ] **Step 4: Modifica `src/App.tsx`**:
  - import nuovi:
```tsx
import { VERSIONE_CATALOGO } from './data/laws/versione';
import { caricaCatalogoRemoto, caricaNovita } from './storage/datiRemoti';
import type { Legge } from './engine/types';
import type { NovitaFile } from './engine/novita';
```
  - nuovo stato e caricamento (dentro `App`, accanto agli stati esistenti):
```tsx
  const [catalogo, setCatalogo] = useState<Legge[]>(CATALOGO);
  const [infoCatalogo, setInfoCatalogo] = useState<{ fonte: 'locale' | 'remoto'; generatoIl?: string }>({ fonte: 'locale' });
  const [novita, setNovita] = useState<NovitaFile | null>(null);

  useEffect(() => {
    let attivo = true;
    caricaCatalogoRemoto(VERSIONE_CATALOGO).then((r) => {
      if (attivo && r) { setCatalogo(r.leggi); setInfoCatalogo({ fonte: 'remoto', generatoIl: r.generatoIl }); }
    });
    caricaNovita().then((n) => { if (attivo) setNovita(n); });
    return () => { attivo = false; };
  }, []);
```
  - `const legge = (id: string) => catalogo.find((l) => l.id === id)!;` (usa lo stato, non più CATALOGO)
  - al componente `<Catalogo ...>` aggiungi `leggi={catalogo} novita={novita} infoCatalogo={infoCatalogo}`.

- [ ] **Step 5: Esegui** — `npm test` → tutto verde. `npm run build` verde.

- [ ] **Step 6: Commit** — `git add -A; git commit -m "App: catalogo remoto attivo all'avvio e novita passate al Catalogo"`

---

### Task 5: Sezione "Novità dal Parlamento"

**Files:** Modify: `src/features/NovitaParlamento.tsx` (sostituisce il segnaposto). Test: `tests/features/NovitaParlamento.test.tsx`

- [ ] **Step 1: Test che fallisce** — `tests/features/NovitaParlamento.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { NovitaParlamento } from '../../src/features/NovitaParlamento';
import type { NovitaFile } from '../../src/engine/novita';

const novita: NovitaFile = {
  generatoIl: '2026-06-11',
  voci: [
    { id: 'gazzetta-1', titolo: 'Nuova legge sulla scuola', tipo: 'gazzetta', stato: 'approvata', data: '2026-06-10', url: 'https://www.gazzettaufficiale.it/x' },
    { id: 'camera-2', titolo: 'Proposta sul lavoro agile', tipo: 'camera', stato: 'discussione', data: '2026-06-09', url: 'https://www.camera.it/y' }
  ]
};

test('mostra titolo sezione, data aggiornamento e voci con stato', () => {
  render(<NovitaParlamento novita={novita} />);
  expect(screen.getByRole('heading', { name: /novità dal parlamento/i })).toBeInTheDocument();
  expect(screen.getByText(/aggiornato al 2026-06-11/i)).toBeInTheDocument();
  expect(screen.getByText(/nuova legge sulla scuola/i)).toBeInTheDocument();
  expect(screen.getByText(/appena approvata/i)).toBeInTheDocument();
  expect(screen.getByText(/in discussione/i)).toBeInTheDocument();
});

test('ogni voce ha badge "simulazione in preparazione" e link al testo ufficiale sicuro', () => {
  render(<NovitaParlamento novita={novita} />);
  expect(screen.getAllByText(/simulazione in preparazione/i)).toHaveLength(2);
  const link = screen.getAllByRole('link', { name: /leggi il testo ufficiale/i });
  expect(link).toHaveLength(2);
  expect(link[0]).toHaveAttribute('rel', 'noopener noreferrer');
  expect(link[0]).toHaveAttribute('target', '_blank');
});
```

- [ ] **Step 2: Esegui** — `npm test -- NovitaParlamento` → FAIL (segnaposto).

- [ ] **Step 3: Implementa `src/features/NovitaParlamento.tsx`**:

```tsx
import type { NovitaFile } from '../engine/novita';
import type { StatoLegge } from '../engine/types';

const STATI: Record<StatoLegge, { etichetta: string; colore: string }> = {
  vigore: { etichetta: 'In vigore', colore: 'var(--verde)' },
  approvata: { etichetta: 'Appena approvata', colore: 'var(--teal)' },
  discussione: { etichetta: 'In discussione', colore: 'var(--giallo)' },
  bozza: { etichetta: 'Bozza', colore: 'var(--testo-2)' },
  referendum: { etichetta: 'Referendum', colore: 'var(--viola)' }
};

export function NovitaParlamento({ novita }: { novita: NovitaFile }) {
  return (
    <section aria-label="Novità dal Parlamento" className="spazio">
      <h2 style={{ fontSize: 19, marginBottom: 2 }}>Novità dal Parlamento</h2>
      <p className="testo-piccolo" style={{ marginTop: 0 }}>
        Dalle fonti ufficiali, aggiornato al {novita.generatoIl}. Non sono ancora simulabili: le stiamo verificando.
      </p>
      {novita.voci.map((voce) => {
        const stato = STATI[voce.stato];
        return (
          <article key={voce.id} className="card spazio" style={{ borderLeft: `4px solid ${stato.colore}`, padding: 12 }}>
            <span className="testo-piccolo" style={{ fontWeight: 800, color: stato.colore }}>{stato.etichetta}</span>
            <span style={{ display: 'block', fontWeight: 700 }}>{voce.titolo}</span>
            <span className="testo-piccolo">{voce.data} · <span className="badge badge-dipende">Simulazione in preparazione</span></span>
            <a className="testo-piccolo" style={{ display: 'block', marginTop: 4 }}
              href={voce.url} target="_blank" rel="noopener noreferrer">
              Leggi il testo ufficiale
            </a>
          </article>
        );
      })}
    </section>
  );
}
```

- [ ] **Step 4: Esegui** — `npm test -- NovitaParlamento` → PASS (2 test). Poi `npm test` tutto verde.

- [ ] **Step 5: Commit** — `git add -A; git commit -m "Sezione Novita dal Parlamento con stati, badge onesto e link ufficiali"`

---

### Task 6: Serializzatore del catalogo

**Files:** Create: `scripts/genera-catalogo.ts`. Modify: `package.json`. Test: `tests/scripts/genera-catalogo.test.ts`. Genera: `public/dati/catalogo.json`

- [ ] **Step 1: Installa tsx** — `npm install -D tsx fast-xml-parser` (fast-xml-parser serve al Task 7, installalo ora).

- [ ] **Step 2: Test che fallisce** — `tests/scripts/genera-catalogo.test.ts`:

```ts
import { costruisciCatalogoRemoto } from '../../scripts/genera-catalogo';
import { SchemaCatalogoRemoto } from '../../src/engine/novita';
import { VERSIONE_CATALOGO } from '../../src/data/laws/versione';

test('il file generato è valido e porta la versione del catalogo', () => {
  const file = costruisciCatalogoRemoto('2026-06-11');
  const esito = SchemaCatalogoRemoto.safeParse(JSON.parse(JSON.stringify(file)));
  if (!esito.success) throw new Error(esito.error.message);
  expect(file.versione).toBe(VERSIONE_CATALOGO);
  expect(file.leggi.length).toBeGreaterThanOrEqual(2);
});
```

- [ ] **Step 3: Esegui** — `npm test -- genera-catalogo` → FAIL.

- [ ] **Step 4: Implementa `scripts/genera-catalogo.ts`**:

```ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
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

// eseguito direttamente: genera in public/dati
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const radice = join(dirname(fileURLToPath(import.meta.url)), '..');
  scriviCatalogo(join(radice, 'public', 'dati'), new Date().toISOString().slice(0, 10));
  console.log('catalogo.json generato');
}
```

- [ ] **Step 5: Aggiungi gli script npm** in `package.json` → `"scripts"`:

```json
    "genera-catalogo": "tsx scripts/genera-catalogo.ts",
    "aggiorna-dati": "tsx scripts/aggiorna-dati.ts"
```
(`aggiorna-dati` esisterà dal Task 7; aggiungerlo ora non rompe nulla finché non lo si invoca.)

- [ ] **Step 6: Esegui** — `npm test -- genera-catalogo` → PASS. Poi `npm run genera-catalogo` → crea `public/dati/catalogo.json`; apri il file e verifica versione 1 e 2+ leggi.

- [ ] **Step 7: Commit** — `git add -A; git commit -m "Serializzatore del catalogo in public/dati/catalogo.json"`

---

### Task 7: Pipeline novità dalle fonti ufficiali

**Files:** Create: `scripts/fonti/gazzetta.ts`, `scripts/fonti/camera.ts`, `scripts/fonti/senato.ts`, `scripts/aggiorna-dati.ts`, `tests/scripts/fixtures/gazzetta.xml`, `tests/scripts/fixtures/camera.json`, `tests/scripts/fixtures/senato.json`. Test: `tests/scripts/fonti.test.ts`. Genera: `public/dati/novita.json`

**LAVORO DI RICERCA RICHIESTO (prima di scrivere i parser):** verifica con WebFetch/WebSearch gli endpoint reali e il formato delle risposte:
1. Gazzetta Ufficiale: feed RSS/atom della Serie Generale (cerca "gazzetta ufficiale rss serie generale"); se non esiste un RSS ufficiale, usa l'elenco ELI di Normattiva con gli atti più recenti.
2. Camera: endpoint SPARQL `https://dati.camera.it/sparql` (output `format=application/sparql-results+json`) — query candidata sui `ocd:atto` della legislatura corrente ordinati per data di presentazione/ultimo aggiornamento; verifica i predicati reali nell'ontologia OCD prima di fissare la query.
3. Senato: endpoint SPARQL `https://dati.senato.it/sparql` (ontologia OSR, `osr:Ddl`) — stesso lavoro.
Salva una risposta REALE (abbreviata a 3-5 voci) di ciascuna fonte come fixture in `tests/scripts/fixtures/`. I parser si testano SOLO sulle fixture. Se una fonte risulta inaccessibile o senza formato stabile, escludila dall'orchestratore, dichiara la cosa nel report come DONE_WITH_CONCERNS e procedi con le fonti funzionanti (minimo una).

- [ ] **Step 1: Contratto dei parser.** Ogni modulo in `scripts/fonti/` esporta:

```ts
import type { Novita } from '../../src/engine/novita';
// gazzetta.ts
export function analizzaGazzetta(xml: string): Novita[];
// camera.ts
export function analizzaCamera(jsonSparql: unknown): Novita[];
// senato.ts
export function analizzaSenato(jsonSparql: unknown): Novita[];
// ciascuno esporta anche la propria URL:
export const URL_FONTE: string;
```
Regole comuni: titoli presi tali e quali dalla fonte (al più troncati a 160 caratteri con "…"); `stato`: 'approvata' per atti pubblicati in Gazzetta, 'discussione' per DDL Camera/Senato; `data` in formato yyyy-mm-dd; `id` = `tipo-` + identificativo stabile della fonte; `url` = link alla pagina ufficiale dell'atto. Voci senza data o senza url si scartano.

- [ ] **Step 2: Test sui parser (con le fixture vere)** — `tests/scripts/fonti.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { analizzaGazzetta } from '../../scripts/fonti/gazzetta';
import { analizzaCamera } from '../../scripts/fonti/camera';
import { analizzaSenato } from '../../scripts/fonti/senato';
import { SchemaNovita } from '../../src/engine/novita';

const fixture = (nome: string) =>
  readFileSync(fileURLToPath(new URL(`fixtures/${nome}`, import.meta.url)), 'utf8');

test('gazzetta: estrae voci valide', () => {
  const voci = analizzaGazzetta(fixture('gazzetta.xml'));
  expect(voci.length).toBeGreaterThan(0);
  for (const v of voci) {
    const esito = SchemaNovita.safeParse(v);
    if (!esito.success) throw new Error(esito.error.message);
    expect(v.tipo).toBe('gazzetta');
  }
});

test('camera: estrae voci valide', () => {
  const voci = analizzaCamera(JSON.parse(fixture('camera.json')));
  expect(voci.length).toBeGreaterThan(0);
  for (const v of voci) expect(SchemaNovita.safeParse(v).success).toBe(true);
});

test('senato: estrae voci valide', () => {
  const voci = analizzaSenato(JSON.parse(fixture('senato.json')));
  expect(voci.length).toBeGreaterThan(0);
  for (const v of voci) expect(SchemaNovita.safeParse(v).success).toBe(true);
});

test('input malformato: i parser lanciano (mai dati parziali silenziosi)', () => {
  expect(() => analizzaGazzetta('<html>pagina di errore</html>')).toThrow();
  expect(() => analizzaCamera({ qualcosa: 'altro' })).toThrow();
  expect(() => analizzaSenato({ qualcosa: 'altro' })).toThrow();
});
```
(Se una fonte è stata esclusa per inaccessibilità, rimuovi il suo test e il suo file, e dichiara la cosa.)

- [ ] **Step 3: Implementa i parser** (gazzetta con `fast-xml-parser` XMLParser; camera/senato leggono `results.bindings` del JSON SPARQL). Ogni parser valida la struttura d'ingresso e lancia `Error` descrittivo se non riconosce il formato. Ogni voce prodotta passa da `SchemaNovita.parse(...)` (lancia se invalida).

- [ ] **Step 4: Implementa `scripts/aggiorna-dati.ts`** (orchestratore):

```ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { SchemaNovitaFile, type Novita } from '../src/engine/novita';
import { scriviCatalogo } from './genera-catalogo';
import { analizzaGazzetta, URL_FONTE as URL_GAZZETTA } from './fonti/gazzetta';
import { analizzaCamera, URL_FONTE as URL_CAMERA } from './fonti/camera';
import { analizzaSenato, URL_FONTE as URL_SENATO } from './fonti/senato';

async function scarica(url: string, accept: string): Promise<string> {
  const risposta = await fetch(url, { headers: { accept, 'user-agent': 'REF-LEX aggiorna-dati' } });
  if (!risposta.ok) throw new Error(`Fonte ${url}: HTTP ${risposta.status}`);
  return risposta.text();
}

export function unisci(...gruppi: Novita[][]): Novita[] {
  return gruppi.flat()
    .sort((a, b) => b.data.localeCompare(a.data))
    .slice(0, 20);
}

async function main() {
  const oggi = new Date().toISOString().slice(0, 10);
  const radice = join(dirname(fileURLToPath(import.meta.url)), '..');
  const cartella = join(radice, 'public', 'dati');

  // Tutte le fonti devono riuscire: un fallimento blocca la pubblicazione (mai dati parziali).
  const [gazzetta, camera, senato] = await Promise.all([
    scarica(URL_GAZZETTA, 'application/xml').then(analizzaGazzetta),
    scarica(URL_CAMERA, 'application/sparql-results+json').then((t) => analizzaCamera(JSON.parse(t))),
    scarica(URL_SENATO, 'application/sparql-results+json').then((t) => analizzaSenato(JSON.parse(t)))
  ]);

  const file = SchemaNovitaFile.parse({ generatoIl: oggi, voci: unisci(gazzetta, camera, senato) });
  mkdirSync(cartella, { recursive: true });
  writeFileSync(join(cartella, 'novita.json'), JSON.stringify(file, null, 2), 'utf8');
  scriviCatalogo(cartella, oggi);
  console.log(`novita.json: ${file.voci.length} voci · catalogo.json rigenerato`);
}

main().catch((errore) => { console.error(errore); process.exit(1); });
```
(Adatta gli `accept` e gli argomenti se nella ricerca hai scoperto endpoint con formati diversi; se hai escluso una fonte, togli la sua riga dal `Promise.all`.)

- [ ] **Step 5: Esegui i test** — `npm test -- fonti` → PASS. Poi esegui la pipeline VERA una volta: `npm run aggiorna-dati` → deve creare `public/dati/novita.json` con voci reali. Apri il file e controlla a occhio: titoli sensati, url ufficiali, date recenti. Se la rete fallisce in questo ambiente, dichiara DONE_WITH_CONCERNS.

- [ ] **Step 6: Commit** — `git add -A; git commit -m "Pipeline novita dalle fonti ufficiali con parser testati su fixture reali"`

---

### Task 8: Automazione notturna, README e verifica finale

**Files:** Create: `.github/workflows/aggiorna-dati.yml`. Modify: `README.md`

- [ ] **Step 1: Crea `.github/workflows/aggiorna-dati.yml`**:

```yaml
name: Aggiorna dati da fonti ufficiali
on:
  schedule:
    - cron: '0 3 * * *'   # ogni notte alle 03:00 UTC
  workflow_dispatch: {}    # eseguibile anche a mano
permissions:
  contents: write
jobs:
  aggiorna:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run aggiorna-dati
      - name: Commit e push se ci sono novità
        run: |
          git config user.name "ref-lex-bot"
          git config user.email "bot@users.noreply.github.com"
          if ! git diff --quiet public/dati; then
            git add public/dati
            git commit -m "Aggiornamento automatico dati dalle fonti ufficiali"
            git push
          fi
```

- [ ] **Step 2: Aggiorna `README.md`** — aggiungi la sezione (dopo i comandi):

```markdown
## Aggiornamento automatico dei dati

- `npm run aggiorna-dati` — interroga le fonti ufficiali (Gazzetta Ufficiale, Camera, Senato),
  rigenera `public/dati/novita.json` e `public/dati/catalogo.json`. Se una fonte fallisce,
  lo script esce con errore e non pubblica nulla (mai dati parziali).
- Il workflow `.github/workflows/aggiorna-dati.yml` esegue lo stesso comando ogni notte
  quando il repository è su GitHub; con il deploy collegato, le app installate ricevono
  i dati nuovi alla prima apertura (il client scarica `dati/*.json` dalla stessa origine).
- Le leggi nuove diventano simulabili SOLO dopo la modellazione con verifica umana delle
  fonti (vedi spec): fino ad allora compaiono come "Simulazione in preparazione".
```

- [ ] **Step 3: Verifica finale completa** — `npm test` (tutto verde) e `npm run build` (verde). Avvia `npm run preview` e controlla: sezione novità visibile con i dati veri generati nel Task 7, sfondo bianco, nota fonte catalogo nel Catalogo, tema scuro ok, offline (spegni il server e ricarica con la PWA) l'app funziona col catalogo incorporato.

- [ ] **Step 4: Commit** — `git add -A; git commit -m "Workflow notturno di aggiornamento dati e README"`

---

## Dopo questo piano

1. **Piano 2 (già previsto):** le 10 leggi rimanenti del catalogo — che ora, una volta modellate, arriveranno alle app via `catalogo.json` senza ripubblicare l'app.
2. **Deploy** su hosting statico + attivazione del workflow notturno.
3. Rifinitura visiva con frontend-design sul nuovo stile bianco.
