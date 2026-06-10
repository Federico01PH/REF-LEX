# REF-LEX MVP — Piano di implementazione (Piano 1: l'app)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Costruire la PWA REF-LEX funzionante: wizard profilo (dati solo sul dispositivo), catalogo leggi, motore di simulazione con timeline 1/2/5/10 anni e livelli di confidenza, schermata empatia con personaggi e modalità esploratore, privacy, accessibilità — con le prime 2 leggi modellate (taglio del cuneo fiscale, salario minimo).

**Architecture:** SPA statica Vite + React + TypeScript, nessun backend. Profilo in `localStorage`. Catalogo = file TypeScript validati con zod. Motore = funzioni pure in `src/engine/` testate con vitest. Navigazione a stato in `App.tsx` (niente router). Design system "Civico energetico" in CSS puro con variabili (tema chiaro/scuro). Niente emoji nell'interfaccia: solo SVG.

**Tech Stack:** Vite 6, React 18, TypeScript 5, zod, vitest + Testing Library + jsdom, vite-plugin-pwa, axe-core. (Playwright E2E: rimandato al piano successivo.)

**Spec di riferimento:** `docs/superpowers/specs/2026-06-10-reflex-mvp-design.md`

**Regole trasversali (valgono per ogni task):**
- Linguaggio UI: italiano semplice (terza media). Niente emoji: icone SVG inline.
- Nessuna chiamata di rete con dati personali. Nessuna dipendenza CDN.
- Commit frequenti, messaggi in italiano, suffisso `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Tutti i valori delle leggi vanno ricontrollati sulle fonti citate prima del commit del task relativo (WebFetch su Normattiva/Camera). Se un valore non corrisponde, correggere dato e test, mai forzare il test.

---

## Mappa dei file

```
package.json, vite.config.ts, tsconfig.json, index.html, public/_headers, public/icon.svg
src/main.tsx, src/App.tsx
src/ui/tokens.css          # variabili colore/tipografia, tema chiaro+scuro
src/ui/base.css            # classi: btn, card, pill, badge, progress, ecc.
src/ui/Icona.tsx           # icone SVG inline (info, freccia, lucchetto, persona, ...)
src/engine/types.ts        # Profilo, Legge, Regola, Effetto, RisultatoSimulazione
src/engine/conditions.ts   # valutatore condizioni dichiarative
src/engine/simulate.ts     # simula(profilo, legge) + rilevanza(profilo, legge)
src/engine/schema.ts       # schema zod del catalogo
src/data/laws/cuneo-fiscale.ts
src/data/laws/salario-minimo.ts
src/data/laws/index.ts     # CATALOGO: Legge[]
src/data/personas.ts       # 8 personaggi predefiniti
src/data/wizard.ts         # definizione domande wizard (data-driven)
src/storage/profilo.ts     # carica/salva/cancella/migra profilo locale
src/features/Benvenuto.tsx
src/features/Wizard.tsx
src/features/Catalogo.tsx
src/features/Report.tsx
src/features/Empatia.tsx
src/features/Privacy.tsx
tests/  (specchia src/)
```

---

### Task 1: Scaffold del progetto

**Files:** Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`, `tests/setup.ts`

- [ ] **Step 1: Crea `package.json`**

```json
{
  "name": "ref-lex",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "axe-core": "^4.10.2",
    "jsdom": "^25.0.1",
    "typescript": "~5.6.3",
    "vite": "^6.0.3",
    "vite-plugin-pwa": "^0.21.1",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Crea `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noEmit": true,
    "skipLibCheck": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src", "tests"]
}
```

- [ ] **Step 3: Crea `vite.config.ts`**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'REF-LEX — Le leggi e la tua vita',
        short_name: 'REF-LEX',
        description: 'Scopri come le leggi cambiano la tua vita. Anonimo, i dati restano sul tuo dispositivo.',
        lang: 'it',
        theme_color: '#1A3A8F',
        background_color: '#F2F5FB',
        display: 'standalone',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }]
      }
    })
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['tests/setup.ts']
  }
});
```

- [ ] **Step 4: Crea `index.html`, `src/main.tsx`, `src/App.tsx` (placeholder), `src/vite-env.d.ts`, `tests/setup.ts`**

`index.html`:
```html
<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="REF-LEX: scopri come le leggi cambiano la tua vita. Anonimo e gratuito." />
    <title>REF-LEX — Le leggi e la tua vita</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`src/main.tsx`:
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './ui/tokens.css';
import './ui/base.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

`src/App.tsx` (placeholder, sostituito nel Task 11):
```tsx
export default function App() {
  return <main><h1>REF-LEX</h1></main>;
}
```

`src/vite-env.d.ts`:
```ts
/// <reference types="vite/client" />
```

`tests/setup.ts`:
```ts
import '@testing-library/jest-dom';
```

Crea anche `src/ui/tokens.css` e `src/ui/base.css` **vuoti** (riempiti nel Task 2), così `main.tsx` compila.

- [ ] **Step 5: Installa e verifica**

Esegui: `npm install` poi `npm run build`
Atteso: build completata senza errori (cartella `dist/` creata).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Scaffold progetto Vite + React + TypeScript con PWA e vitest"
```

---

### Task 2: Design system "Civico energetico" (CSS + icone)

**Files:** Modify: `src/ui/tokens.css`, `src/ui/base.css`. Create: `src/ui/Icona.tsx`, `public/icon.svg`. Test: `tests/ui/Icona.test.tsx`

- [ ] **Step 1: Scrivi `src/ui/tokens.css`**

```css
:root {
  --blu: #1A3A8F; --blu-scuro: #16265C; --viola: #6C4BFF;
  --verde: #0BBF7D; --teal: #06A8C9; --arancio: #FF8A3D; --arancio-chiaro: #FFB547;
  --rosso: #D63B4A; --giallo: #E0A800;
  --sfondo: #F2F5FB; --superficie: #FFFFFF; --superficie-2: #EEF1FA;
  --testo: #16265C; --testo-2: #5A6694; --bordo: #D4D9EC;
  --grad-azione: linear-gradient(135deg, #1A3A8F, #6C4BFF);
  --grad-positivo: linear-gradient(135deg, #0BBF7D, #06A8C9);
  --grad-incerto: linear-gradient(135deg, #FFB547, #FF8A3D);
  --ombra: 0 4px 16px rgba(26, 58, 143, 0.10);
  --raggio: 16px; --raggio-pillola: 999px;
}
[data-theme='dark'] {
  --sfondo: #10162E; --superficie: #1A2342; --superficie-2: #232E55;
  --testo: #FFFFFF; --testo-2: #9AA6D6; --bordo: #2C3866;
  --blu: #4F74FF; --viola: #9B7BFF;
  --grad-azione: linear-gradient(135deg, #4F74FF, #9B7BFF);
  --ombra: 0 4px 16px rgba(0, 0, 0, 0.35);
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 2: Scrivi `src/ui/base.css`**

```css
* { box-sizing: border-box; }
body { margin: 0; background: var(--sfondo); color: var(--testo);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  font-size: 16px; line-height: 1.5; }
main { max-width: 480px; margin: 0 auto; padding: 16px; min-height: 100vh; }
h1, h2, h3 { line-height: 1.25; }
a { color: var(--blu); }
:focus-visible { outline: 3px solid var(--viola); outline-offset: 2px; border-radius: 4px; }

.card { background: var(--superficie); border-radius: var(--raggio);
  padding: 16px; box-shadow: var(--ombra); }
.btn { display: block; width: 100%; min-height: 48px; padding: 12px 20px;
  border: none; border-radius: var(--raggio-pillola); cursor: pointer;
  font-size: 17px; font-weight: 800; color: #fff; background: var(--grad-azione); }
.btn-secondario { background: none; border: 2px solid var(--blu);
  color: var(--blu); font-weight: 700; }
.btn-pericolo { background: var(--rosso); }
.pill { display: inline-block; min-height: 44px; padding: 10px 16px; margin: 4px;
  border-radius: var(--raggio-pillola); border: 1.5px solid var(--bordo);
  background: var(--superficie); color: var(--testo); font-size: 16px; cursor: pointer; }
.pill[aria-pressed='true'] { background: var(--blu); border-color: var(--blu); color: #fff; }
.badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px;
  border-radius: var(--raggio-pillola); font-size: 13px; font-weight: 800; }
.badge-certa { background: #E4F8EF; color: #066B45; }
.badge-probabile { background: #FBF3D7; color: #6B5200; }
.badge-dipende { background: #FFEDDD; color: #9A4A00; }
[data-theme='dark'] .badge-certa { background: #0E3A2A; color: #7BE6BB; }
[data-theme='dark'] .badge-probabile { background: #3A330E; color: #E6D77B; }
[data-theme='dark'] .badge-dipende { background: #3F2A14; color: #FFC08A; }
.progress { display: flex; gap: 4px; margin: 12px 0; }
.progress > span { flex: 1; height: 6px; border-radius: 3px; background: var(--bordo); }
.progress > span.fatto { background: var(--verde); }
.progress > span.attuale { background: var(--viola); }
.riquadro-numero { border-radius: 12px; padding: 12px; text-align: center; color: #fff; }
.riquadro-numero .numero { font-size: 28px; font-weight: 900; }
.positivo { background: var(--grad-positivo); }
.incerto { background: var(--grad-incerto); }
.negativo { background: var(--rosso); }
.testo-piccolo { font-size: 13px; color: var(--testo-2); }
.spazio { margin-top: 16px; }
.visually-hidden { position: absolute; width: 1px; height: 1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
```

- [ ] **Step 3: Scrivi il test che fallisce per `Icona`** — `tests/ui/Icona.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import { Icona } from '../../src/ui/Icona';

test('Icona renderizza un SVG decorativo nascosto agli screen reader', () => {
  render(<Icona nome="lucchetto" />);
  const svg = screen.getByTestId('icona-lucchetto');
  expect(svg).toHaveAttribute('aria-hidden', 'true');
});

test('Icona con etichetta è annunciata', () => {
  render(<Icona nome="info" etichetta="maggiori informazioni" />);
  expect(screen.getByRole('img', { name: 'maggiori informazioni' })).toBeInTheDocument();
});
```

- [ ] **Step 4: Esegui il test** — `npm test -- Icona`. Atteso: FAIL (modulo inesistente).

- [ ] **Step 5: Implementa `src/ui/Icona.tsx`**

```tsx
const TRACCIATI: Record<string, string> = {
  lucchetto: 'M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 0 1 6 0v3H9Z',
  info: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1 7h2v2h-2V9Zm0 4h2v6h-2v-6Z',
  freccia: 'M5 12h12m0 0-5-5m5 5-5 5',
  indietro: 'M19 12H7m0 0 5 5m-5-5 5-5',
  persona: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6Z',
  persone: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20v-1c0-2.5 3-4 6-4s6 1.5 6 4v1H2Zm14 0v-1c0-1.4-.6-2.5-1.5-3.4 1-.4 2.2-.6 3.5-.6 3 0 4 1.5 4 4v1h-6Z',
  spunta: 'M5 13l4 4L19 7',
  cestino: 'M9 3h6l1 2h4v2H4V5h4l1-2Zm-3 6h12l-1 12H7L6 9Z',
  occhio: 'M12 5C5 5 2 12 2 12s3 7 10 7 10-7 10-7-3-7-10-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z',
  documento: 'M6 2h9l5 5v15H6V2Zm8 1v5h5'
};

export function Icona({ nome, etichetta, dimensione = 20 }:
  { nome: keyof typeof TRACCIATI | string; etichetta?: string; dimensione?: number }) {
  return (
    <svg data-testid={`icona-${nome}`} width={dimensione} height={dimensione}
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      role={etichetta ? 'img' : undefined}
      aria-label={etichetta} aria-hidden={etichetta ? undefined : true}>
      <path d={TRACCIATI[nome] ?? ''} />
    </svg>
  );
}
```

- [ ] **Step 6: Crea `public/icon.svg`** (icona dell'app: lettera R su gradiente)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#1A3A8F"/><stop offset="1" stop-color="#6C4BFF"/>
  </linearGradient></defs>
  <rect width="512" height="512" rx="112" fill="url(#g)"/>
  <text x="256" y="346" font-family="Arial, sans-serif" font-size="280" font-weight="900"
    fill="#fff" text-anchor="middle">R</text>
</svg>
```

- [ ] **Step 7: Esegui i test** — `npm test -- Icona`. Atteso: PASS (2 test).

- [ ] **Step 8: Commit** — `git add -A && git commit -m "Design system Civico energetico: tokens, classi base, icone SVG"`

---

### Task 3: Tipi di dominio

**Files:** Create: `src/engine/types.ts`. Test: nessuno (soli tipi; verificati da `tsc` e usati da tutti i task successivi)

- [ ] **Step 1: Scrivi `src/engine/types.ts`**

```ts
export type CondizioneLavorativa =
  | 'dipendente-privato' | 'dipendente-pubblico' | 'autonomo-ordinario'
  | 'forfettario' | 'imprenditore' | 'studente' | 'pensionato'
  | 'disoccupato' | 'caregiver' | 'casalingo' | 'altro';

export type FasciaReddito =
  | 'nessuno' | 'fino9k' | 'da9a15k' | 'da15a20k' | 'da20a28k'
  | 'da28a35k' | 'da35a50k' | 'oltre50k';

export type FasciaIsee =
  | 'fino9360' | 'da9360a15k' | 'da15a25k' | 'da25a40k' | 'oltre40k' | 'nonLoSo';

export type Disabilita =
  | 'nessuna' | 'motoria' | 'visiva' | 'uditiva' | 'intellettiva'
  | 'malattia-cronica' | 'condizione-non-riconosciuta';

export interface Profilo {
  schemaVersion: 1;
  eta: number;
  genere?: 'donna' | 'uomo' | 'non-binario' | 'preferisco-non-dirlo';
  identitaGenere?: 'cisgender' | 'transgender' | 'preferisco-non-dirlo';
  orientamento?: 'eterosessuale' | 'omosessuale' | 'bisessuale' | 'altro' | 'preferisco-non-dirlo';
  statoCivile?: 'non-sposato' | 'sposato' | 'unione-civile' | 'separato' | 'vedovo';
  regione?: string;
  condizioneLavorativa?: CondizioneLavorativa;
  fasciaReddito?: FasciaReddito;
  fasciaIsee?: FasciaIsee;
  figli?: 0 | 1 | 2 | 3; // 3 = tre o più
  abitazione?: 'proprieta' | 'affitto' | 'comodato' | 'altro';
  disabilita?: Disabilita[];
  cittadinanza?: 'italiana' | 'ue' | 'extra-ue';
  religione?: 'nessuna' | 'cattolica' | 'altra-cristiana' | 'musulmana' | 'ebraica' | 'altra' | 'preferisco-non-dirlo';
}

export type Operatore = 'eq' | 'in' | 'almeno' | 'alPiu';
export interface Condizione { campo: keyof Profilo; op: Operatore; valore: unknown; }

export type Confidenza = 'certa' | 'probabile' | 'dipende';
export type Orizzonte = 'anno1' | 'anno2' | 'anno5' | 'anno10';
export const ORIZZONTI: Orizzonte[] = ['anno1', 'anno2', 'anno5', 'anno10'];
export type StatoOrizzonte = 'attivo' | 'nullo' | 'incerto';

export interface Effetto {
  tipo: 'economico' | 'diritto' | 'dovere' | 'servizio' | 'qualita-vita';
  importoMese?: { min: number; max: number }; // € al mese, solo tipo economico
  descrizione: string;
  direzione: 'positivo' | 'negativo' | 'neutro' | 'misto';
}

export interface Regola {
  id: string;
  condizioni: Condizione[]; // tutte devono valere (AND)
  campiNecessari: (keyof Profilo)[];
  effetto: Effetto;
  timeline: Record<Orizzonte, StatoOrizzonte>;
  confidenza: Confidenza;
  noteConfidenza?: string;
  fonteRegola: { etichetta: string; url: string };
}

export type StatoLegge = 'vigore' | 'approvata' | 'discussione' | 'bozza' | 'referendum';
export type Ambito =
  | 'fisco-lavoro' | 'pensioni-welfare' | 'casa'
  | 'diritti-salute' | 'sicurezza-privacy' | 'doveri';

export interface Legge {
  id: string;
  titoloDivulgativo: string;
  titoloUfficiale: string;
  stato: StatoLegge;
  ambito: Ambito;
  fonti: { etichetta: string; url: string }[];
  verificataIl: string; // ISO yyyy-mm-dd
  riassunto: string;    // max ~80 parole, linguaggio terza media
  regole: Regola[];
}

export interface EffettoNonCalcolabile { regola: Regola; campiMancanti: (keyof Profilo)[]; }

export interface RisultatoSimulazione {
  leggeId: string;
  effetti: Regola[];                 // regole applicabili al profilo
  nonCalcolabili: EffettoNonCalcolabile[];
  totaleMese: Record<Orizzonte, { min: number; max: number }>; // solo certa+probabile attivi
}

export type Rilevanza = 'alta' | 'media' | 'bassa';
```

- [ ] **Step 2: Verifica compilazione** — `npm run build`. Atteso: nessun errore.

- [ ] **Step 3: Commit** — `git add src/engine/types.ts && git commit -m "Tipi di dominio: Profilo, Legge, Regola, RisultatoSimulazione"`

---

### Task 4: Valutatore di condizioni

**Files:** Create: `src/engine/conditions.ts`. Test: `tests/engine/conditions.test.ts`

- [ ] **Step 1: Scrivi i test che falliscono** — `tests/engine/conditions.test.ts`

```ts
import { valutaCondizioni, campiMancanti } from '../../src/engine/conditions';
import type { Profilo, Condizione } from '../../src/engine/types';

const profilo: Profilo = {
  schemaVersion: 1, eta: 34, condizioneLavorativa: 'dipendente-privato',
  fasciaReddito: 'da15a20k', disabilita: ['nessuna']
};

test('eq vale per valore uguale', () => {
  const c: Condizione[] = [{ campo: 'condizioneLavorativa', op: 'eq', valore: 'dipendente-privato' }];
  expect(valutaCondizioni(profilo, c)).toBe(true);
});

test('in vale se il valore è nella lista', () => {
  const c: Condizione[] = [{ campo: 'condizioneLavorativa', op: 'in', valore: ['dipendente-privato', 'dipendente-pubblico'] }];
  expect(valutaCondizioni(profilo, c)).toBe(true);
});

test('almeno/alPiu funzionano sui numeri (età)', () => {
  expect(valutaCondizioni(profilo, [{ campo: 'eta', op: 'almeno', valore: 18 }])).toBe(true);
  expect(valutaCondizioni(profilo, [{ campo: 'eta', op: 'alPiu', valore: 30 }])).toBe(false);
});

test('almeno/alPiu funzionano sulle fasce di reddito (ordinali)', () => {
  expect(valutaCondizioni(profilo, [{ campo: 'fasciaReddito', op: 'alPiu', valore: 'da20a28k' }])).toBe(true);
  expect(valutaCondizioni(profilo, [{ campo: 'fasciaReddito', op: 'almeno', valore: 'da28a35k' }])).toBe(false);
});

test('in su campo array (disabilita) vale se almeno un elemento coincide', () => {
  expect(valutaCondizioni(profilo, [{ campo: 'disabilita', op: 'in', valore: ['motoria', 'nessuna'] }])).toBe(true);
  expect(valutaCondizioni(profilo, [{ campo: 'disabilita', op: 'in', valore: ['visiva'] }])).toBe(false);
});

test('condizioni multiple sono in AND', () => {
  const c: Condizione[] = [
    { campo: 'eta', op: 'almeno', valore: 18 },
    { campo: 'condizioneLavorativa', op: 'eq', valore: 'pensionato' }
  ];
  expect(valutaCondizioni(profilo, c)).toBe(false);
});

test('campiMancanti elenca i campi necessari non compilati', () => {
  expect(campiMancanti(profilo, ['eta', 'fasciaIsee', 'figli'])).toEqual(['fasciaIsee', 'figli']);
  expect(campiMancanti(profilo, ['eta'])).toEqual([]);
});
```

- [ ] **Step 2: Esegui** — `npm test -- conditions`. Atteso: FAIL (modulo inesistente).

- [ ] **Step 3: Implementa `src/engine/conditions.ts`**

```ts
import type { Profilo, Condizione, FasciaReddito, FasciaIsee } from './types';

const ORDINE_REDDITO: FasciaReddito[] = [
  'nessuno', 'fino9k', 'da9a15k', 'da15a20k', 'da20a28k', 'da28a35k', 'da35a50k', 'oltre50k'
];
const ORDINE_ISEE: FasciaIsee[] = ['fino9360', 'da9360a15k', 'da15a25k', 'da25a40k', 'oltre40k'];

function ordinale(campo: keyof Profilo, valore: unknown): number {
  if (typeof valore === 'number') return valore;
  if (campo === 'fasciaReddito') return ORDINE_REDDITO.indexOf(valore as FasciaReddito);
  if (campo === 'fasciaIsee') return ORDINE_ISEE.indexOf(valore as FasciaIsee);
  return NaN;
}

export function valutaCondizioni(profilo: Profilo, condizioni: Condizione[]): boolean {
  return condizioni.every((c) => {
    const v = profilo[c.campo];
    if (v === undefined) return false;
    switch (c.op) {
      case 'eq':
        return v === c.valore;
      case 'in': {
        const lista = c.valore as unknown[];
        if (Array.isArray(v)) return v.some((x) => lista.includes(x));
        return lista.includes(v);
      }
      case 'almeno':
        return ordinale(c.campo, v) >= ordinale(c.campo, c.valore);
      case 'alPiu':
        return ordinale(c.campo, v) <= ordinale(c.campo, c.valore);
    }
  });
}

export function campiMancanti(profilo: Profilo, necessari: (keyof Profilo)[]): (keyof Profilo)[] {
  return necessari.filter((campo) => {
    const v = profilo[campo];
    return v === undefined || (Array.isArray(v) && v.length === 0);
  });
}
```

- [ ] **Step 4: Esegui** — `npm test -- conditions`. Atteso: PASS (7 test).

- [ ] **Step 5: Commit** — `git add -A && git commit -m "Motore: valutatore di condizioni dichiarative"`

---

### Task 5: Motore di simulazione

**Files:** Create: `src/engine/simulate.ts`. Test: `tests/engine/simulate.test.ts`

- [ ] **Step 1: Scrivi i test che falliscono** — `tests/engine/simulate.test.ts`

```ts
import { simula, rilevanza } from '../../src/engine/simulate';
import type { Legge, Profilo, Regola } from '../../src/engine/types';

const regolaBase: Omit<Regola, 'id' | 'condizioni' | 'effetto' | 'confidenza'> = {
  campiNecessari: ['condizioneLavorativa', 'fasciaReddito'],
  timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
  fonteRegola: { etichetta: 'test', url: 'https://example.org' }
};

const legge: Legge = {
  id: 'test-legge', titoloDivulgativo: 'Test', titoloUfficiale: 'Test',
  stato: 'vigore', ambito: 'fisco-lavoro',
  fonti: [{ etichetta: 'test', url: 'https://example.org' }],
  verificataIl: '2026-06-10', riassunto: 'Legge di prova.',
  regole: [
    { ...regolaBase, id: 'r-bonus', confidenza: 'certa',
      condizioni: [{ campo: 'condizioneLavorativa', op: 'eq', valore: 'dipendente-privato' }],
      effetto: { tipo: 'economico', importoMese: { min: 60, max: 80 }, descrizione: 'Bonus', direzione: 'positivo' } },
    { ...regolaBase, id: 'r-tassa', confidenza: 'probabile',
      condizioni: [{ campo: 'condizioneLavorativa', op: 'eq', valore: 'dipendente-privato' }],
      effetto: { tipo: 'economico', importoMese: { min: 10, max: 10 }, descrizione: 'Costo', direzione: 'negativo' },
      timeline: { anno1: 'nullo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' } },
    { ...regolaBase, id: 'r-forse', confidenza: 'dipende',
      condizioni: [{ campo: 'condizioneLavorativa', op: 'eq', valore: 'dipendente-privato' }],
      effetto: { tipo: 'economico', importoMese: { min: 100, max: 100 }, descrizione: 'Forse', direzione: 'positivo' } },
    { ...regolaBase, id: 'r-isee', confidenza: 'certa', campiNecessari: ['fasciaIsee'],
      condizioni: [{ campo: 'fasciaIsee', op: 'alPiu', valore: 'da9360a15k' }],
      effetto: { tipo: 'servizio', descrizione: 'Sconto', direzione: 'positivo' } }
  ]
};

const dipendente: Profilo = {
  schemaVersion: 1, eta: 34,
  condizioneLavorativa: 'dipendente-privato', fasciaReddito: 'da15a20k'
};

test('applica le regole con condizioni vere', () => {
  const r = simula(dipendente, legge);
  expect(r.effetti.map((e) => e.id)).toEqual(['r-bonus', 'r-tassa', 'r-forse']);
});

test('segnala le regole non calcolabili con i campi mancanti', () => {
  const r = simula(dipendente, legge);
  expect(r.nonCalcolabili).toHaveLength(1);
  expect(r.nonCalcolabili[0].campiMancanti).toEqual(['fasciaIsee']);
});

test('totale: somma certa+probabile attive, esclude dipende, rispetta direzione e timeline', () => {
  const r = simula(dipendente, legge);
  expect(r.totaleMese.anno1).toEqual({ min: 60, max: 80 });   // tassa nulla anno1, dipende escluso
  expect(r.totaleMese.anno2).toEqual({ min: 50, max: 70 });   // 60-10 / 80-10
});

test('profilo non toccato: nessun effetto', () => {
  const pensionato: Profilo = { schemaVersion: 1, eta: 70, condizioneLavorativa: 'pensionato', fasciaReddito: 'da9a15k', fasciaIsee: 'oltre40k' };
  const r = simula(pensionato, legge);
  expect(r.effetti).toHaveLength(0);
  expect(r.nonCalcolabili).toHaveLength(0);
});

test('rilevanza: alta con effetti certi/probabili, media con soli dipende o non calcolabili, bassa altrimenti', () => {
  expect(rilevanza(dipendente, legge)).toBe('alta');
  const soloIseeMancante: Profilo = { schemaVersion: 1, eta: 50, condizioneLavorativa: 'pensionato', fasciaReddito: 'da9a15k' };
  expect(rilevanza(soloIseeMancante, legge)).toBe('media');
  const fuori: Profilo = { schemaVersion: 1, eta: 70, condizioneLavorativa: 'pensionato', fasciaReddito: 'da9a15k', fasciaIsee: 'oltre40k' };
  expect(rilevanza(fuori, legge)).toBe('bassa');
});
```

- [ ] **Step 2: Esegui** — `npm test -- simulate`. Atteso: FAIL.

- [ ] **Step 3: Implementa `src/engine/simulate.ts`**

```ts
import type { Legge, Orizzonte, Profilo, Rilevanza, RisultatoSimulazione } from './types';
import { ORIZZONTI } from './types';
import { campiMancanti, valutaCondizioni } from './conditions';

export function simula(profilo: Profilo, legge: Legge): RisultatoSimulazione {
  const risultato: RisultatoSimulazione = {
    leggeId: legge.id, effetti: [], nonCalcolabili: [],
    totaleMese: { anno1: { min: 0, max: 0 }, anno2: { min: 0, max: 0 }, anno5: { min: 0, max: 0 }, anno10: { min: 0, max: 0 } }
  };

  for (const regola of legge.regole) {
    const mancanti = campiMancanti(profilo, regola.campiNecessari);
    if (mancanti.length > 0) {
      // non calcolabile solo se le condizioni sui campi presenti non escludono già il profilo
      const condizioniValutabili = regola.condizioni.filter((c) => !mancanti.includes(c.campo));
      if (valutaCondizioni(profilo, condizioniValutabili)) {
        risultato.nonCalcolabili.push({ regola, campiMancanti: mancanti });
      }
      continue;
    }
    if (valutaCondizioni(profilo, regola.condizioni)) risultato.effetti.push(regola);
  }

  for (const orizzonte of ORIZZONTI) {
    for (const regola of risultato.effetti) {
      if (regola.confidenza === 'dipende') continue;
      if (regola.timeline[orizzonte] !== 'attivo') continue;
      const importo = regola.effetto.importoMese;
      if (!importo) continue;
      const segno = regola.effetto.direzione === 'negativo' ? -1 : 1;
      risultato.totaleMese[orizzonte].min += segno * (segno < 0 ? importo.max : importo.min);
      risultato.totaleMese[orizzonte].max += segno * (segno < 0 ? importo.min : importo.max);
    }
  }
  return risultato;
}

export function rilevanza(profilo: Profilo, legge: Legge): Rilevanza {
  const r = simula(profilo, legge);
  if (r.effetti.some((e) => e.confidenza !== 'dipende')) return 'alta';
  if (r.effetti.length > 0 || r.nonCalcolabili.length > 0) return 'media';
  return 'bassa';
}

export function orizzonteEtichetta(o: Orizzonte): string {
  return { anno1: '1 anno', anno2: '2 anni', anno5: '5 anni', anno10: '10 anni' }[o];
}
```

- [ ] **Step 4: Esegui** — `npm test -- simulate`. Atteso: PASS (5 test).

- [ ] **Step 5: Commit** — `git add -A && git commit -m "Motore di simulazione: effetti, non calcolabili, totali per orizzonte, rilevanza"`

---

### Task 6: Schema zod del catalogo

**Files:** Create: `src/engine/schema.ts`. Test: `tests/engine/schema.test.ts`

- [ ] **Step 1: Test che fallisce** — `tests/engine/schema.test.ts`

```ts
import { SchemaLegge } from '../../src/engine/schema';

const leggeValida = {
  id: 'x', titoloDivulgativo: 'X', titoloUfficiale: 'X', stato: 'vigore', ambito: 'casa',
  fonti: [{ etichetta: 'Normattiva', url: 'https://www.normattiva.it' }],
  verificataIl: '2026-06-10', riassunto: 'Breve.',
  regole: [{
    id: 'r1', condizioni: [{ campo: 'eta', op: 'almeno', valore: 18 }],
    campiNecessari: ['eta'],
    effetto: { tipo: 'diritto', descrizione: 'd', direzione: 'positivo' },
    timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
    confidenza: 'certa', fonteRegola: { etichetta: 'art. 1', url: 'https://www.normattiva.it' }
  }]
};

test('accetta una legge valida', () => {
  expect(SchemaLegge.safeParse(leggeValida).success).toBe(true);
});

test('rifiuta legge senza fonti', () => {
  expect(SchemaLegge.safeParse({ ...leggeValida, fonti: [] }).success).toBe(false);
});

test('rifiuta regola economica senza importo coerente (min > max)', () => {
  const rotta = structuredClone(leggeValida);
  rotta.regole[0].effetto = { tipo: 'economico', importoMese: { min: 10, max: 5 }, descrizione: 'd', direzione: 'positivo' } as never;
  expect(SchemaLegge.safeParse(rotta).success).toBe(false);
});
```

- [ ] **Step 2: Esegui** — `npm test -- schema`. Atteso: FAIL.

- [ ] **Step 3: Implementa `src/engine/schema.ts`**

```ts
import { z } from 'zod';

const SchemaFonte = z.object({ etichetta: z.string().min(1), url: z.string().url() });

const SchemaEffetto = z.object({
  tipo: z.enum(['economico', 'diritto', 'dovere', 'servizio', 'qualita-vita']),
  importoMese: z.object({ min: z.number(), max: z.number() })
    .refine((i) => i.min <= i.max, 'min deve essere <= max').optional(),
  descrizione: z.string().min(1),
  direzione: z.enum(['positivo', 'negativo', 'neutro', 'misto'])
});

const SchemaRegola = z.object({
  id: z.string().min(1),
  condizioni: z.array(z.object({
    campo: z.string(), op: z.enum(['eq', 'in', 'almeno', 'alPiu']), valore: z.unknown()
  })),
  campiNecessari: z.array(z.string()),
  effetto: SchemaEffetto,
  timeline: z.object({
    anno1: z.enum(['attivo', 'nullo', 'incerto']), anno2: z.enum(['attivo', 'nullo', 'incerto']),
    anno5: z.enum(['attivo', 'nullo', 'incerto']), anno10: z.enum(['attivo', 'nullo', 'incerto'])
  }),
  confidenza: z.enum(['certa', 'probabile', 'dipende']),
  noteConfidenza: z.string().optional(),
  fonteRegola: SchemaFonte
});

export const SchemaLegge = z.object({
  id: z.string().min(1),
  titoloDivulgativo: z.string().min(1),
  titoloUfficiale: z.string().min(1),
  stato: z.enum(['vigore', 'approvata', 'discussione', 'bozza', 'referendum']),
  ambito: z.enum(['fisco-lavoro', 'pensioni-welfare', 'casa', 'diritti-salute', 'sicurezza-privacy', 'doveri']),
  fonti: z.array(SchemaFonte).min(1),
  verificataIl: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  riassunto: z.string().min(10),
  regole: z.array(SchemaRegola).min(1)
});
```

- [ ] **Step 4: Esegui** — `npm test -- schema`. Atteso: PASS (3 test).

- [ ] **Step 5: Commit** — `git add -A && git commit -m "Schema zod di validazione del catalogo leggi"`

---

### Task 7: Legge 1 — Taglio del cuneo fiscale / IRPEF

**Files:** Create: `src/data/laws/cuneo-fiscale.ts`, `src/data/laws/index.ts`. Test: `tests/data/cuneo-fiscale.test.ts`

**ATTENZIONE:** prima di scrivere i dati, verifica i valori su Normattiva (L. 30/12/2024 n. 207, art. 1 commi 4-9): soglie 8.500/15.000/20.000/32.000/40.000 €, percentuali 7,1%/5,3%/4,8%, detrazione 1.000 €. Se i valori reali differiscono da quelli qui sotto, correggi dati E test.

- [ ] **Step 1: Test che fallisce** — `tests/data/cuneo-fiscale.test.ts`

```ts
import { cuneoFiscale } from '../../src/data/laws/cuneo-fiscale';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(cuneoFiscale);
  expect(esito.success).toBe(true);
});

test('dipendente 15-20k: bonus 4,8-5,3% → 60-88 €/mese, certo al 1° anno', () => {
  const p: Profilo = { schemaVersion: 1, eta: 34, condizioneLavorativa: 'dipendente-privato', fasciaReddito: 'da15a20k' };
  const r = simula(p, cuneoFiscale);
  expect(r.effetti).toHaveLength(1);
  expect(r.effetti[0].effetto.importoMese).toEqual({ min: 60, max: 88 });
  expect(r.effetti[0].confidenza).toBe('certa');
  expect(r.totaleMese.anno1).toEqual({ min: 60, max: 88 });
});

test('dipendente 20-28k: detrazione 1.000 €/anno → 83 €/mese', () => {
  const p: Profilo = { schemaVersion: 1, eta: 40, condizioneLavorativa: 'dipendente-pubblico', fasciaReddito: 'da20a28k' };
  const r = simula(p, cuneoFiscale);
  expect(r.effetti[0].effetto.importoMese).toEqual({ min: 83, max: 83 });
});

test('pensionato: nessun effetto', () => {
  const p: Profilo = { schemaVersion: 1, eta: 70, condizioneLavorativa: 'pensionato', fasciaReddito: 'da9a15k' };
  const r = simula(p, cuneoFiscale);
  expect(r.effetti).toHaveLength(0);
});

test('dipendente senza fascia reddito: effetto non calcolabile', () => {
  const p: Profilo = { schemaVersion: 1, eta: 30, condizioneLavorativa: 'dipendente-privato' };
  const r = simula(p, cuneoFiscale);
  expect(r.effetti).toHaveLength(0);
  expect(r.nonCalcolabili.length).toBeGreaterThan(0);
  expect(r.nonCalcolabili[0].campiMancanti).toContain('fasciaReddito');
});
```

- [ ] **Step 2: Esegui** — `npm test -- cuneo`. Atteso: FAIL.

- [ ] **Step 3: Implementa `src/data/laws/cuneo-fiscale.ts`**

I sei scaglioni sotto derivano dall'incrocio tra le fasce del profilo e gli scaglioni di legge; dove la fascia copre più scaglioni l'importo è un intervallo onesto (min–max). Dipendenti = privato + pubblico. Timeline: misura strutturale → attiva su tutti gli orizzonti; confidenza certa su anno1/anno2, nota che oltre dipende dalle future leggi di bilancio (ceteris paribus → resta certa, con nota).

```ts
import type { Condizione, Legge, Regola } from '../../engine/types';

const DIPENDENTI: Condizione = {
  campo: 'condizioneLavorativa', op: 'in', valore: ['dipendente-privato', 'dipendente-pubblico']
};
const FONTE = { etichetta: 'L. 207/2024, art. 1, commi 4-9 (Normattiva)', url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2024-12-30;207' };
const TIMELINE_STRUTTURALE = { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' } as const;

function regolaFascia(id: string, fascia: string, min: number, max: number, descrizione: string): Regola {
  return {
    id, campiNecessari: ['condizioneLavorativa', 'fasciaReddito'],
    condizioni: [DIPENDENTI, { campo: 'fasciaReddito', op: 'eq', valore: fascia }],
    effetto: { tipo: 'economico', importoMese: { min, max }, descrizione, direzione: 'positivo' },
    timeline: TIMELINE_STRUTTURALE, confidenza: 'certa',
    noteConfidenza: 'Misura resa strutturale dalla legge di bilancio 2025; il valore esatto dipende dal tuo reddito preciso dentro la fascia. Calcolo "a parità di leggi future".',
    fonteRegola: FONTE
  };
}

export const cuneoFiscale: Legge = {
  id: 'cuneo-fiscale-2025',
  titoloDivulgativo: 'Taglio del cuneo fiscale per i dipendenti',
  titoloUfficiale: 'Legge 30 dicembre 2024, n. 207, art. 1, commi 4-9 (Bilancio 2025)',
  stato: 'vigore', ambito: 'fisco-lavoro',
  fonti: [FONTE, { etichetta: 'Scheda Camera dei deputati', url: 'https://temi.camera.it/leg19/temi/il-taglio-del-cuneo-fiscale.html' }],
  verificataIl: '2026-06-10',
  riassunto: 'Chi lavora come dipendente paga meno tasse sullo stipendio: fino a 20.000 € di reddito arriva una somma extra in busta paga (dal 4,8% al 7,1% del reddito); tra 20.000 e 32.000 € una detrazione di 1.000 € l\'anno, che si riduce fino a sparire a 40.000 €.',
  regole: [
    regolaFascia('cuneo-fino9k', 'fino9k', 0, 53, 'Somma extra in busta paga: 7,1% del reddito (fino a 9.000 €).'),
    regolaFascia('cuneo-9-15k', 'da9a15k', 40, 66, 'Somma extra in busta paga: 5,3% del reddito (9.000-15.000 €).'),
    regolaFascia('cuneo-15-20k', 'da15a20k', 60, 88, 'Somma extra in busta paga: 4,8-5,3% del reddito (15.000-20.000 €).'),
    regolaFascia('cuneo-20-28k', 'da20a28k', 83, 83, 'Detrazione fissa di 1.000 € l\'anno sull\'IRPEF.'),
    regolaFascia('cuneo-28-35k', 'da28a35k', 35, 83, 'Detrazione in riduzione da 1.000 € verso zero (azzeramento a 40.000 €).'),
    regolaFascia('cuneo-35-50k', 'da35a50k', 0, 35, 'Detrazione residua solo fino a 40.000 € di reddito; oltre, nessun beneficio.')
  ]
};
```

- [ ] **Step 4: Crea `src/data/laws/index.ts`**

```ts
import type { Legge } from '../../engine/types';
import { cuneoFiscale } from './cuneo-fiscale';

export const CATALOGO: Legge[] = [cuneoFiscale];
```

- [ ] **Step 5: Esegui** — `npm test -- cuneo`. Atteso: PASS (5 test).

- [ ] **Step 6: Commit** — `git add -A && git commit -m "Catalogo: taglio del cuneo fiscale (L. 207/2024) con test sui valori"`

---

### Task 8: Legge 2 — Salario minimo (proposta in discussione)

**Files:** Create: `src/data/laws/salario-minimo.ts`. Modify: `src/data/laws/index.ts`. Test: `tests/data/salario-minimo.test.ts`

**ATTENZIONE:** verifica lo stato della proposta (PDL "salario minimo 9 €/h", Camera AC 1275 o successiva) prima del commit; aggiorna `stato`, fonti e riassunto se nel frattempo è cambiata.

- [ ] **Step 1: Test che fallisce** — `tests/data/salario-minimo.test.ts`

```ts
import { salarioMinimo } from '../../src/data/laws/salario-minimo';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

test('rispetta lo schema ed è in stato discussione', () => {
  expect(SchemaLegge.safeParse(salarioMinimo).success).toBe(true);
  expect(salarioMinimo.stato).toBe('discussione');
});

test('dipendente a basso reddito: effetto con confidenza dipende, escluso dal totale', () => {
  const p: Profilo = { schemaVersion: 1, eta: 22, condizioneLavorativa: 'dipendente-privato', fasciaReddito: 'fino9k' };
  const r = simula(p, salarioMinimo);
  expect(r.effetti).toHaveLength(1);
  expect(r.effetti[0].confidenza).toBe('dipende');
  expect(r.totaleMese.anno1).toEqual({ min: 0, max: 0 });
});

test('autonomo: nessun effetto', () => {
  const p: Profilo = { schemaVersion: 1, eta: 45, condizioneLavorativa: 'autonomo-ordinario', fasciaReddito: 'da20a28k' };
  expect(simula(p, salarioMinimo).effetti).toHaveLength(0);
});
```

- [ ] **Step 2: Esegui** — `npm test -- salario`. Atteso: FAIL.

- [ ] **Step 3: Implementa `src/data/laws/salario-minimo.ts`**

```ts
import type { Legge } from '../../engine/types';

const FONTE = { etichetta: 'Proposta di legge AC 1275 (Camera dei deputati)', url: 'https://www.camera.it/leg19/126?tab=&leg=19&idDocumento=1275' };

export const salarioMinimo: Legge = {
  id: 'salario-minimo-pdl',
  titoloDivulgativo: 'Salario minimo legale a 9 € l\'ora',
  titoloUfficiale: 'Proposta di legge AC 1275 — Disposizioni in materia di salario minimo',
  stato: 'discussione', ambito: 'fisco-lavoro',
  fonti: [FONTE],
  verificataIl: '2026-06-10',
  riassunto: 'Una proposta di legge (NON ancora in vigore) vuole fissare una paga minima di 9 € lordi all\'ora per tutti i lavoratori dipendenti. Se venisse approvata, chi oggi guadagna meno di 9 € l\'ora riceverebbe un aumento; per gli altri non cambierebbe nulla.',
  regole: [
    {
      id: 'salario-minimo-bassi-redditi',
      condizioni: [
        { campo: 'condizioneLavorativa', op: 'in', valore: ['dipendente-privato', 'dipendente-pubblico'] },
        { campo: 'fasciaReddito', op: 'alPiu', valore: 'da9a15k' }
      ],
      campiNecessari: ['condizioneLavorativa', 'fasciaReddito'],
      effetto: {
        tipo: 'economico',
        descrizione: 'Se la tua paga oraria è sotto i 9 € lordi (capita spesso in part-time, servizi, agricoltura), il tuo stipendio dovrebbe salire fino a quel minimo.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'La proposta è in discussione in Parlamento: potrebbe essere approvata, modificata o respinta. L\'importo dipende dalla tua paga oraria attuale, che l\'app non conosce.',
      fonteRegola: { etichetta: 'AC 1275, art. 2', url: 'https://www.camera.it/leg19/126?tab=&leg=19&idDocumento=1275' }
    }
  ]
};
```

- [ ] **Step 4: Aggiorna `src/data/laws/index.ts`**

```ts
import type { Legge } from '../../engine/types';
import { cuneoFiscale } from './cuneo-fiscale';
import { salarioMinimo } from './salario-minimo';

export const CATALOGO: Legge[] = [cuneoFiscale, salarioMinimo];
```

- [ ] **Step 5: Test di integrità dell'intero catalogo** — aggiungi a `tests/data/catalogo.test.ts`:

```ts
import { CATALOGO } from '../../src/data/laws';
import { SchemaLegge } from '../../src/engine/schema';

test('ogni legge del catalogo rispetta lo schema', () => {
  for (const legge of CATALOGO) {
    const esito = SchemaLegge.safeParse(legge);
    if (!esito.success) throw new Error(`Legge ${legge.id} non valida: ${esito.error.message}`);
  }
});

test('gli id sono unici', () => {
  const id = CATALOGO.map((l) => l.id);
  expect(new Set(id).size).toBe(id.length);
});
```

- [ ] **Step 6: Esegui** — `npm test`. Atteso: PASS (tutti).

- [ ] **Step 7: Commit** — `git add -A && git commit -m "Catalogo: salario minimo (AC 1275, in discussione) + test integrità catalogo"`

---

### Task 9: Personaggi predefiniti

**Files:** Create: `src/data/personas.ts`. Test: `tests/data/personas.test.ts`

- [ ] **Step 1: Test che fallisce** — `tests/data/personas.test.ts`

```ts
import { PERSONAGGI } from '../../src/data/personas';

test('ci sono 8 personaggi con nome, descrizione e profilo completo dei campi chiave', () => {
  expect(PERSONAGGI).toHaveLength(8);
  for (const p of PERSONAGGI) {
    expect(p.nome.length).toBeGreaterThan(0);
    expect(p.descrizione.length).toBeGreaterThan(0);
    expect(p.profilo.eta).toBeGreaterThan(0);
    expect(p.profilo.condizioneLavorativa).toBeDefined();
    expect(p.profilo.fasciaReddito).toBeDefined();
    expect(p.profilo.fasciaIsee).toBeDefined();
  }
});
```

- [ ] **Step 2: Esegui** — `npm test -- personas`. Atteso: FAIL.

- [ ] **Step 3: Implementa `src/data/personas.ts`**

```ts
import type { Profilo } from '../engine/types';

export interface Personaggio { id: string; nome: string; descrizione: string; profilo: Profilo; }

const base = { schemaVersion: 1 as const };

export const PERSONAGGI: Personaggio[] = [
  { id: 'anna', nome: 'Anna, 74 anni', descrizione: 'Pensionata con pensione minima, vive sola in affitto',
    profilo: { ...base, eta: 74, genere: 'donna', condizioneLavorativa: 'pensionato', fasciaReddito: 'fino9k', fasciaIsee: 'fino9360', abitazione: 'affitto', figli: 2, statoCivile: 'vedovo', disabilita: ['nessuna'], cittadinanza: 'italiana' } },
  { id: 'luca', nome: 'Luca, 22 anni', descrizione: 'Studente universitario con lavoro part-time',
    profilo: { ...base, eta: 22, genere: 'uomo', condizioneLavorativa: 'dipendente-privato', fasciaReddito: 'fino9k', fasciaIsee: 'da9360a15k', abitazione: 'affitto', figli: 0, disabilita: ['nessuna'], cittadinanza: 'italiana' } },
  { id: 'karim', nome: 'Karim, 45 anni', descrizione: 'Artigiano con partita IVA, due figli, residente in Italia da 20 anni',
    profilo: { ...base, eta: 45, genere: 'uomo', condizioneLavorativa: 'autonomo-ordinario', fasciaReddito: 'da20a28k', fasciaIsee: 'da15a25k', abitazione: 'proprieta', figli: 2, statoCivile: 'sposato', disabilita: ['nessuna'], cittadinanza: 'extra-ue' } },
  { id: 'giulia', nome: 'Giulia, 38 anni', descrizione: 'Impiegata, famiglia monoreddito con tre figli, casa di proprietà col mutuo',
    profilo: { ...base, eta: 38, genere: 'donna', condizioneLavorativa: 'dipendente-privato', fasciaReddito: 'da28a35k', fasciaIsee: 'da15a25k', abitazione: 'proprieta', figli: 3, statoCivile: 'sposato', disabilita: ['nessuna'], cittadinanza: 'italiana' } },
  { id: 'marco', nome: 'Marco, 52 anni', descrizione: 'Operaio con disabilità motoria, lavora a tempo pieno',
    profilo: { ...base, eta: 52, genere: 'uomo', condizioneLavorativa: 'dipendente-privato', fasciaReddito: 'da20a28k', fasciaIsee: 'da15a25k', abitazione: 'proprieta', figli: 1, disabilita: ['motoria'], cittadinanza: 'italiana' } },
  { id: 'sara', nome: 'Sara, 29 anni', descrizione: 'Neoassunta in città, single, in affitto, convive con la fibromialgia',
    profilo: { ...base, eta: 29, genere: 'donna', condizioneLavorativa: 'dipendente-privato', fasciaReddito: 'da15a20k', fasciaIsee: 'da9360a15k', abitazione: 'affitto', figli: 0, statoCivile: 'non-sposato', disabilita: ['condizione-non-riconosciuta'], cittadinanza: 'italiana' } },
  { id: 'elena', nome: 'Elena, 61 anni', descrizione: 'Imprenditrice con una piccola azienda di famiglia',
    profilo: { ...base, eta: 61, genere: 'donna', condizioneLavorativa: 'imprenditore', fasciaReddito: 'oltre50k', fasciaIsee: 'oltre40k', abitazione: 'proprieta', figli: 2, statoCivile: 'sposato', disabilita: ['nessuna'], cittadinanza: 'italiana' } },
  { id: 'pavel', nome: 'Pavel, 35 anni', descrizione: 'Caregiver: assiste la madre non autosufficiente, lavora poco e quando può',
    profilo: { ...base, eta: 35, genere: 'uomo', condizioneLavorativa: 'caregiver', fasciaReddito: 'nessuno', fasciaIsee: 'fino9360', abitazione: 'affitto', figli: 0, disabilita: ['nessuna'], cittadinanza: 'ue' } }
];
```

- [ ] **Step 4: Esegui** — `npm test -- personas`. Atteso: PASS.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "Otto personaggi predefiniti per la schermata empatia"`

---

### Task 10: Storage del profilo

**Files:** Create: `src/storage/profilo.ts`. Test: `tests/storage/profilo.test.ts`

- [ ] **Step 1: Test che fallisce** — `tests/storage/profilo.test.ts`

```ts
import { caricaProfilo, salvaProfilo, cancellaTutto, storageDisponibile } from '../../src/storage/profilo';
import type { Profilo } from '../../src/engine/types';

const profilo: Profilo = { schemaVersion: 1, eta: 34, condizioneLavorativa: 'studente' };

beforeEach(() => localStorage.clear());

test('salva e ricarica il profilo', () => {
  salvaProfilo(profilo);
  expect(caricaProfilo()).toEqual(profilo);
});

test('restituisce null se non c\'è nulla', () => {
  expect(caricaProfilo()).toBeNull();
});

test('restituisce null e pulisce se i dati sono corrotti', () => {
  localStorage.setItem('reflex.profilo.v1', '{rotto');
  expect(caricaProfilo()).toBeNull();
  expect(localStorage.getItem('reflex.profilo.v1')).toBeNull();
});

test('restituisce null se schemaVersion è sconosciuta', () => {
  localStorage.setItem('reflex.profilo.v1', JSON.stringify({ schemaVersion: 99, eta: 30 }));
  expect(caricaProfilo()).toBeNull();
});

test('cancellaTutto rimuove ogni chiave reflex', () => {
  salvaProfilo(profilo);
  localStorage.setItem('reflex.tema', 'dark');
  cancellaTutto();
  expect(localStorage.getItem('reflex.profilo.v1')).toBeNull();
  expect(localStorage.getItem('reflex.tema')).toBeNull();
});

test('storageDisponibile è true in ambiente di test', () => {
  expect(storageDisponibile()).toBe(true);
});
```

- [ ] **Step 2: Esegui** — `npm test -- profilo`. Atteso: FAIL.

- [ ] **Step 3: Implementa `src/storage/profilo.ts`**

```ts
import type { Profilo } from '../engine/types';

const CHIAVE = 'reflex.profilo.v1';

export function storageDisponibile(): boolean {
  try {
    localStorage.setItem('reflex.test', '1');
    localStorage.removeItem('reflex.test');
    return true;
  } catch {
    return false;
  }
}

export function caricaProfilo(): Profilo | null {
  try {
    const grezzo = localStorage.getItem(CHIAVE);
    if (!grezzo) return null;
    const dati = JSON.parse(grezzo) as Profilo;
    if (dati.schemaVersion !== 1 || typeof dati.eta !== 'number') {
      localStorage.removeItem(CHIAVE);
      return null;
    }
    return dati;
  } catch {
    try { localStorage.removeItem(CHIAVE); } catch { /* storage non disponibile */ }
    return null;
  }
}

export function salvaProfilo(profilo: Profilo): void {
  try { localStorage.setItem(CHIAVE, JSON.stringify(profilo)); } catch { /* modalità solo-sessione */ }
}

export function cancellaTutto(): void {
  try {
    for (const chiave of Object.keys(localStorage)) {
      if (chiave.startsWith('reflex.')) localStorage.removeItem(chiave);
    }
  } catch { /* storage non disponibile */ }
}
```

- [ ] **Step 4: Esegui** — `npm test -- profilo`. Atteso: PASS (6 test).

- [ ] **Step 5: Commit** — `git add -A && git commit -m "Storage locale del profilo con versioning e cancella tutto"`

---

### Task 11: App shell e schermata Benvenuto

**Files:** Modify: `src/App.tsx`. Create: `src/features/Benvenuto.tsx`. Test: `tests/features/Benvenuto.test.tsx`, `tests/App.test.tsx`

- [ ] **Step 1: Test che fallisce** — `tests/features/Benvenuto.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Benvenuto } from '../../src/features/Benvenuto';

test('mostra promessa, garanzia privacy e bottone Inizia', async () => {
  const onInizia = vi.fn();
  render(<Benvenuto onInizia={onInizia} onPrivacy={vi.fn()} />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/le leggi cambiano la tua vita/i);
  expect(screen.getByText(/zero dati inviati/i)).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /inizia/i }));
  expect(onInizia).toHaveBeenCalled();
});
```

E `tests/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import App from '../src/App';

beforeEach(() => localStorage.clear());

test('senza profilo salvato parte dal benvenuto', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/le leggi cambiano la tua vita/i);
});

test('con profilo salvato parte dal catalogo', () => {
  localStorage.setItem('reflex.profilo.v1', JSON.stringify({ schemaVersion: 1, eta: 34, condizioneLavorativa: 'studente' }));
  render(<App />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/scegli una legge/i);
});
```

- [ ] **Step 2: Esegui** — `npm test -- Benvenuto App`. Atteso: FAIL.

- [ ] **Step 3: Implementa `src/features/Benvenuto.tsx`**

```tsx
import { Icona } from '../ui/Icona';

export function Benvenuto({ onInizia, onPrivacy }: { onInizia: () => void; onPrivacy: () => void }) {
  return (
    <div>
      <div className="card" style={{ background: 'var(--grad-azione)', color: '#fff' }}>
        <h1 style={{ margin: 0, fontSize: 26 }}>Scopri come le leggi cambiano la TUA vita</h1>
        <p style={{ opacity: 0.9 }}>2 minuti, in forma anonima. Niente nome, niente account.</p>
      </div>
      <div className="card spazio">
        <p style={{ margin: 0, fontWeight: 700, display: 'flex', gap: 8, alignItems: 'center' }}>
          <Icona nome="lucchetto" /> Zero dati inviati. Zero account. Zero tracker.
        </p>
        <p className="testo-piccolo">
          Tutto quello che scrivi resta solo sul tuo dispositivo.{' '}
          <button className="testo-piccolo" onClick={onPrivacy}
            style={{ background: 'none', border: 'none', textDecoration: 'underline', color: 'var(--blu)', cursor: 'pointer', padding: 0 }}>
            Come funziona la privacy
          </button>
        </p>
      </div>
      <button className="btn spazio" onClick={onInizia}>Inizia</button>
    </div>
  );
}
```

- [ ] **Step 4: Implementa `src/App.tsx` (shell di navigazione completa)**

Le schermate Wizard/Catalogo/Report/Empatia/Privacy vengono implementate nei task 12-16: per ora crea **segnaposto minimi** in `src/features/` che rendono solo l'`h1` corretto, così App compila e i test passano; ogni task successivo sostituisce il suo segnaposto. Segnaposto: `Wizard.tsx` (`<h1>Il tuo profilo</h1>`), `Catalogo.tsx` (`<h1>Scegli una legge</h1>`), `Report.tsx` (`<h1>Il tuo report</h1>`), `Empatia.tsx` (`<h1>E per gli altri?</h1>`), `Privacy.tsx` (`<h1>I tuoi dati</h1>`), ognuno che accetta le props indicate sotto (anche se non le usa ancora).

```tsx
import { useEffect, useState } from 'react';
import type { Profilo } from './engine/types';
import { CATALOGO } from './data/laws';
import { caricaProfilo, salvaProfilo } from './storage/profilo';
import { Benvenuto } from './features/Benvenuto';
import { Wizard } from './features/Wizard';
import { Catalogo } from './features/Catalogo';
import { Report } from './features/Report';
import { Empatia } from './features/Empatia';
import { Privacy } from './features/Privacy';

type Vista =
  | { nome: 'benvenuto' } | { nome: 'wizard'; esploratore: boolean }
  | { nome: 'catalogo' } | { nome: 'report'; leggeId: string }
  | { nome: 'empatia'; leggeId: string } | { nome: 'privacy' };

export default function App() {
  const [profilo, setProfilo] = useState<Profilo | null>(() => caricaProfilo());
  const [profiloEsploratore, setProfiloEsploratore] = useState<Profilo | null>(null);
  const [vista, setVista] = useState<Vista>(() => (caricaProfilo() ? { nome: 'catalogo' } : { nome: 'benvenuto' }));
  const [tema, setTema] = useState<string>(() => localStorage.getItem('reflex.tema') ?? 'auto');

  useEffect(() => {
    const scuroSistema = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const scuro = tema === 'dark' || (tema === 'auto' && scuroSistema);
    document.documentElement.dataset.theme = scuro ? 'dark' : 'light';
  }, [tema]);

  const legge = (id: string) => CATALOGO.find((l) => l.id === id)!;

  return (
    <main>
      {vista.nome === 'benvenuto' && (
        <Benvenuto onInizia={() => setVista({ nome: 'wizard', esploratore: false })}
          onPrivacy={() => setVista({ nome: 'privacy' })} />
      )}
      {vista.nome === 'wizard' && (
        <Wizard
          iniziale={vista.esploratore ? null : profilo}
          esploratore={vista.esploratore}
          onFine={(p) => {
            if (vista.esploratore) { setProfiloEsploratore(p); }
            else { setProfilo(p); salvaProfilo(p); setProfiloEsploratore(null); }
            setVista({ nome: 'catalogo' });
          }}
          onAnnulla={() => setVista(profilo ? { nome: 'catalogo' } : { nome: 'benvenuto' })} />
      )}
      {vista.nome === 'catalogo' && (profilo || profiloEsploratore) && (
        <Catalogo profilo={profiloEsploratore ?? profilo!}
          esploratore={profiloEsploratore !== null}
          onScegli={(leggeId) => setVista({ nome: 'report', leggeId })}
          onModificaProfilo={() => setVista({ nome: 'wizard', esploratore: profiloEsploratore !== null })}
          onPrivacy={() => setVista({ nome: 'privacy' })}
          onEsciEsploratore={() => setProfiloEsploratore(null)} />
      )}
      {vista.nome === 'report' && (profilo || profiloEsploratore) && (
        <Report profilo={profiloEsploratore ?? profilo!} legge={legge(vista.leggeId)}
          esploratore={profiloEsploratore !== null}
          onAltri={() => setVista({ nome: 'empatia', leggeId: vista.leggeId })}
          onIndietro={() => setVista({ nome: 'catalogo' })} />
      )}
      {vista.nome === 'empatia' && (
        <Empatia legge={legge(vista.leggeId)}
          onCreaIpotetico={() => setVista({ nome: 'wizard', esploratore: true })}
          onIndietro={() => setVista({ nome: 'report', leggeId: vista.leggeId })} />
      )}
      {vista.nome === 'privacy' && (
        <Privacy tema={tema}
          onCambiaTema={(t) => { setTema(t); localStorage.setItem('reflex.tema', t); }}
          onCancellaTutto={() => { setProfilo(null); setProfiloEsploratore(null); setVista({ nome: 'benvenuto' }); }}
          onIndietro={() => setVista(profilo ? { nome: 'catalogo' } : { nome: 'benvenuto' })} />
      )}
    </main>
  );
}
```

- [ ] **Step 5: Esegui** — `npm test`. Atteso: PASS.

- [ ] **Step 6: Commit** — `git add -A && git commit -m "App shell con navigazione a stato e schermata Benvenuto"`

---

### Task 12: Wizard del profilo

**Files:** Create: `src/data/wizard.ts`. Modify: `src/features/Wizard.tsx` (sostituisce il segnaposto). Test: `tests/features/Wizard.test.tsx`

- [ ] **Step 1: Scrivi `src/data/wizard.ts`** (definizione data-driven delle domande; l'ordine è quello mostrato)

```ts
import type { Profilo } from '../engine/types';

export interface Opzione { valore: unknown; etichetta: string; }
export interface Domanda {
  campo: keyof Profilo;
  titolo: string;
  perche: string;           // "Perché lo chiediamo"
  tipo: 'numero' | 'scelta' | 'multi';
  obbligatoria?: boolean;   // solo eta
  opzioni?: Opzione[];
}

export const DOMANDE: Domanda[] = [
  { campo: 'eta', titolo: 'Quanti anni hai?', tipo: 'numero', obbligatoria: true,
    perche: 'Molte leggi valgono solo per certe età: pensioni, scuola, patente, agevolazioni giovani.' },
  { campo: 'condizioneLavorativa', titolo: 'Di cosa ti occupi?', tipo: 'scelta',
    perche: 'Tasse, bonus e tutele cambiano molto tra dipendenti, autonomi, studenti e pensionati.',
    opzioni: [
      { valore: 'dipendente-privato', etichetta: 'Dipendente (azienda privata)' },
      { valore: 'dipendente-pubblico', etichetta: 'Dipendente pubblico' },
      { valore: 'autonomo-ordinario', etichetta: 'Partita IVA' },
      { valore: 'forfettario', etichetta: 'Partita IVA forfettaria' },
      { valore: 'imprenditore', etichetta: 'Imprenditore/trice' },
      { valore: 'studente', etichetta: 'Studente/ssa' },
      { valore: 'pensionato', etichetta: 'In pensione' },
      { valore: 'disoccupato', etichetta: 'In cerca di lavoro' },
      { valore: 'caregiver', etichetta: 'Mi prendo cura di un familiare' },
      { valore: 'casalingo', etichetta: 'Mi occupo della casa' },
      { valore: 'altro', etichetta: 'Altro' }] },
  { campo: 'fasciaReddito', titolo: 'Quanto guadagni all\'anno, più o meno?', tipo: 'scelta',
    perche: 'Serve per calcolare tasse e bonus. Basta la fascia: non chiediamo la cifra esatta.',
    opzioni: [
      { valore: 'nessuno', etichetta: 'Nessun reddito' }, { valore: 'fino9k', etichetta: 'Fino a 9.000 €' },
      { valore: 'da9a15k', etichetta: '9.000 - 15.000 €' }, { valore: 'da15a20k', etichetta: '15.000 - 20.000 €' },
      { valore: 'da20a28k', etichetta: '20.000 - 28.000 €' }, { valore: 'da28a35k', etichetta: '28.000 - 35.000 €' },
      { valore: 'da35a50k', etichetta: '35.000 - 50.000 €' }, { valore: 'oltre50k', etichetta: 'Più di 50.000 €' }] },
  { campo: 'fasciaIsee', titolo: 'Conosci il tuo ISEE?', tipo: 'scelta',
    perche: 'L\'ISEE è il "termometro" economico della famiglia: decide bonus, sconti e aiuti.',
    opzioni: [
      { valore: 'fino9360', etichetta: 'Fino a 9.360 €' }, { valore: 'da9360a15k', etichetta: '9.360 - 15.000 €' },
      { valore: 'da15a25k', etichetta: '15.000 - 25.000 €' }, { valore: 'da25a40k', etichetta: '25.000 - 40.000 €' },
      { valore: 'oltre40k', etichetta: 'Più di 40.000 €' }, { valore: 'nonLoSo', etichetta: 'Non lo so' }] },
  { campo: 'figli', titolo: 'Hai figli?', tipo: 'scelta',
    perche: 'Assegni, detrazioni e congedi dipendono dal numero di figli.',
    opzioni: [
      { valore: 0, etichetta: 'No' }, { valore: 1, etichetta: 'Uno' },
      { valore: 2, etichetta: 'Due' }, { valore: 3, etichetta: 'Tre o più' }] },
  { campo: 'statoCivile', titolo: 'Qual è il tuo stato civile?', tipo: 'scelta',
    perche: 'Matrimonio e unione civile cambiano tasse, pensioni di reversibilità ed eredità.',
    opzioni: [
      { valore: 'non-sposato', etichetta: 'Non sposato/a' }, { valore: 'sposato', etichetta: 'Sposato/a' },
      { valore: 'unione-civile', etichetta: 'Unione civile' }, { valore: 'separato', etichetta: 'Separato/a o divorziato/a' },
      { valore: 'vedovo', etichetta: 'Vedovo/a' }] },
  { campo: 'abitazione', titolo: 'Dove vivi?', tipo: 'scelta',
    perche: 'Bonus casa, regole sugli affitti e tasse sulla casa dipendono da questo.',
    opzioni: [
      { valore: 'proprieta', etichetta: 'Casa di proprietà' }, { valore: 'affitto', etichetta: 'In affitto' },
      { valore: 'comodato', etichetta: 'Ospite / comodato (es. dai genitori)' }, { valore: 'altro', etichetta: 'Altro' }] },
  { campo: 'regione', titolo: 'In che regione vivi?', tipo: 'scelta',
    perche: 'Alcune leggi e aiuti valgono solo in certe regioni.',
    opzioni: ['Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna', 'Friuli-Venezia Giulia', 'Lazio',
      'Liguria', 'Lombardia', 'Marche', 'Molise', 'Piemonte', 'Puglia', 'Sardegna', 'Sicilia', 'Toscana',
      'Trentino-Alto Adige', 'Umbria', 'Valle d\'Aosta', 'Veneto', 'Vivo all\'estero']
      .map((r) => ({ valore: r, etichetta: r })) },
  { campo: 'disabilita', titolo: 'Convivi con una disabilità o una malattia?', tipo: 'multi',
    perche: 'Molte leggi riguardano diritti, aiuti e accessibilità. Contano anche le condizioni non ancora riconosciute ufficialmente in Italia, come la fibromialgia.',
    opzioni: [
      { valore: 'nessuna', etichetta: 'No' }, { valore: 'motoria', etichetta: 'Disabilità motoria' },
      { valore: 'visiva', etichetta: 'Disabilità visiva' }, { valore: 'uditiva', etichetta: 'Disabilità uditiva' },
      { valore: 'intellettiva', etichetta: 'Disabilità intellettiva o psichica' },
      { valore: 'malattia-cronica', etichetta: 'Malattia cronica riconosciuta' },
      { valore: 'condizione-non-riconosciuta', etichetta: 'Condizione non ancora riconosciuta (es. fibromialgia)' }] },
  { campo: 'cittadinanza', titolo: 'Qual è la tua cittadinanza?', tipo: 'scelta',
    perche: 'Permessi, voto e accesso ad alcuni aiuti dipendono dalla cittadinanza.',
    opzioni: [
      { valore: 'italiana', etichetta: 'Italiana' }, { valore: 'ue', etichetta: 'Di un Paese UE' },
      { valore: 'extra-ue', etichetta: 'Di un Paese fuori dall\'UE' }] },
  { campo: 'genere', titolo: 'In quale genere ti riconosci?', tipo: 'scelta',
    perche: 'Alcune leggi (pensioni, congedi, tutele) trattano diversamente uomini e donne.',
    opzioni: [
      { valore: 'donna', etichetta: 'Donna' }, { valore: 'uomo', etichetta: 'Uomo' },
      { valore: 'non-binario', etichetta: 'Non binario' }, { valore: 'preferisco-non-dirlo', etichetta: 'Preferisco non dirlo' }] },
  { campo: 'identitaGenere', titolo: 'La tua identità di genere corrisponde al sesso assegnato alla nascita?', tipo: 'scelta',
    perche: 'Esistono leggi su documenti, transizione e antidiscriminazione che riguardano le persone trans.',
    opzioni: [
      { valore: 'cisgender', etichetta: 'Sì' }, { valore: 'transgender', etichetta: 'No' },
      { valore: 'preferisco-non-dirlo', etichetta: 'Preferisco non dirlo' }] },
  { campo: 'orientamento', titolo: 'Qual è il tuo orientamento sentimentale?', tipo: 'scelta',
    perche: 'Unioni civili, adozioni e leggi antidiscriminazione hanno effetti diversi a seconda dell\'orientamento.',
    opzioni: [
      { valore: 'eterosessuale', etichetta: 'Eterosessuale' }, { valore: 'omosessuale', etichetta: 'Gay / lesbica' },
      { valore: 'bisessuale', etichetta: 'Bisessuale' }, { valore: 'altro', etichetta: 'Altro' },
      { valore: 'preferisco-non-dirlo', etichetta: 'Preferisco non dirlo' }] },
  { campo: 'religione', titolo: 'Pratichi una religione?', tipo: 'scelta',
    perche: 'Alcune leggi toccano luoghi di culto, festività, simboli religiosi e ore di religione a scuola.',
    opzioni: [
      { valore: 'nessuna', etichetta: 'No' }, { valore: 'cattolica', etichetta: 'Cattolica' },
      { valore: 'altra-cristiana', etichetta: 'Altra cristiana' }, { valore: 'musulmana', etichetta: 'Musulmana' },
      { valore: 'ebraica', etichetta: 'Ebraica' }, { valore: 'altra', etichetta: 'Altra' },
      { valore: 'preferisco-non-dirlo', etichetta: 'Preferisco non dirlo' }] }
];
```

- [ ] **Step 2: Test che fallisce** — `tests/features/Wizard.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Wizard } from '../../src/features/Wizard';

test('percorso minimo: età obbligatoria, poi salto delle facoltative fino alla fine', async () => {
  const onFine = vi.fn();
  render(<Wizard iniziale={null} esploratore={false} onFine={onFine} onAnnulla={vi.fn()} />);

  expect(screen.getByRole('heading', { name: /quanti anni hai/i })).toBeInTheDocument();
  // senza età non si avanza
  expect(screen.queryByRole('button', { name: /salta/i })).not.toBeInTheDocument();
  await userEvent.type(screen.getByRole('spinbutton'), '34');
  await userEvent.click(screen.getByRole('button', { name: /avanti/i }));

  // tutte le successive sono facoltative: si possono saltare
  for (let i = 0; i < 13; i++) {
    await userEvent.click(screen.getByRole('button', { name: /salta/i }));
  }
  expect(onFine).toHaveBeenCalledWith(expect.objectContaining({ schemaVersion: 1, eta: 34 }));
});

test('risposta a scelta: la pillola selezionata finisce nel profilo', async () => {
  const onFine = vi.fn();
  render(<Wizard iniziale={null} esploratore={false} onFine={onFine} onAnnulla={vi.fn()} />);
  await userEvent.type(screen.getByRole('spinbutton'), '70');
  await userEvent.click(screen.getByRole('button', { name: /avanti/i }));
  await userEvent.click(screen.getByRole('button', { name: /in pensione/i }));
  await userEvent.click(screen.getByRole('button', { name: /avanti/i }));
  for (let i = 0; i < 12; i++) {
    await userEvent.click(screen.getByRole('button', { name: /salta/i }));
  }
  expect(onFine).toHaveBeenCalledWith(expect.objectContaining({ eta: 70, condizioneLavorativa: 'pensionato' }));
});

test('mostra il "perché lo chiediamo" e la barra di progresso', () => {
  render(<Wizard iniziale={null} esploratore={false} onFine={vi.fn()} onAnnulla={vi.fn()} />);
  expect(screen.getByText(/perché lo chiediamo/i)).toBeInTheDocument();
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});
```

- [ ] **Step 3: Esegui** — `npm test -- Wizard`. Atteso: FAIL.

- [ ] **Step 4: Implementa `src/features/Wizard.tsx`**

```tsx
import { useState } from 'react';
import type { Profilo } from '../engine/types';
import { DOMANDE } from '../data/wizard';
import { Icona } from '../ui/Icona';

export function Wizard({ iniziale, esploratore, onFine, onAnnulla }: {
  iniziale: Profilo | null; esploratore: boolean;
  onFine: (p: Profilo) => void; onAnnulla: () => void;
}) {
  const [indice, setIndice] = useState(0);
  const [bozza, setBozza] = useState<Partial<Profilo>>(iniziale ?? { schemaVersion: 1 });
  const domanda = DOMANDE[indice];
  const valore = bozza[domanda.campo];

  function avanza(prossimaBozza: Partial<Profilo>) {
    if (indice + 1 >= DOMANDE.length) onFine(prossimaBozza as Profilo);
    else { setBozza(prossimaBozza); setIndice(indice + 1); }
  }

  function seleziona(v: unknown) {
    if (domanda.tipo === 'multi') {
      const attuale = (valore as unknown[] | undefined) ?? [];
      const nuovo = attuale.includes(v) ? attuale.filter((x) => x !== v)
        : v === 'nessuna' ? ['nessuna'] : [...attuale.filter((x) => x !== 'nessuna'), v];
      setBozza({ ...bozza, [domanda.campo]: nuovo });
    } else {
      setBozza({ ...bozza, [domanda.campo]: v });
    }
  }

  const etaValida = domanda.campo !== 'eta' || (typeof valore === 'number' && valore >= 13 && valore <= 120);

  return (
    <div>
      {esploratore && <p className="badge badge-dipende">Modalità esploratore: stai creando un profilo ipotetico</p>}
      <div className="progress" role="progressbar" aria-valuemin={1} aria-valuemax={DOMANDE.length}
        aria-valuenow={indice + 1} aria-label={`Domanda ${indice + 1} di ${DOMANDE.length}`}>
        {DOMANDE.map((d, i) => (
          <span key={d.campo} className={i < indice ? 'fatto' : i === indice ? 'attuale' : ''} />
        ))}
      </div>
      <div className="card">
        <h1 style={{ fontSize: 22, marginTop: 0 }}>{domanda.titolo}</h1>
        {domanda.tipo === 'numero' && (
          <input type="number" inputMode="numeric" min={13} max={120} className="pill"
            style={{ width: '100%', fontSize: 20 }}
            aria-label={domanda.titolo}
            value={typeof valore === 'number' ? valore : ''}
            onChange={(e) => setBozza({ ...bozza, [domanda.campo]: e.target.value === '' ? undefined : Number(e.target.value) })} />
        )}
        {(domanda.tipo === 'scelta' || domanda.tipo === 'multi') && (
          <div role="group" aria-label={domanda.titolo}>
            {domanda.opzioni!.map((o) => {
              const selezionata = domanda.tipo === 'multi'
                ? ((valore as unknown[] | undefined) ?? []).includes(o.valore)
                : valore === o.valore;
              return (
                <button key={String(o.valore)} type="button" className="pill"
                  aria-pressed={selezionata} onClick={() => seleziona(o.valore)}>
                  {o.etichetta}
                </button>
              );
            })}
          </div>
        )}
        <p className="testo-piccolo" style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
          <Icona nome="info" dimensione={16} /> <span><b>Perché lo chiediamo:</b> {domanda.perche}</span>
        </p>
      </div>
      <div className="spazio" style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-secondario" style={{ flex: 1 }} onClick={onAnnulla}>Annulla</button>
        {!domanda.obbligatoria && (
          <button className="btn btn-secondario" style={{ flex: 1 }}
            onClick={() => { const b = { ...bozza }; delete b[domanda.campo]; avanza(b); }}>
            Salta
          </button>
        )}
        <button className="btn" style={{ flex: 1 }} disabled={!etaValida} onClick={() => avanza(bozza)}>
          {indice + 1 >= DOMANDE.length ? 'Fine' : 'Avanti'}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Esegui** — `npm test -- Wizard`. Atteso: PASS (3 test).

- [ ] **Step 6: Commit** — `git add -A && git commit -m "Wizard del profilo: 14 domande data-driven, una per schermata, facoltative saltabili"`

---

### Task 13: Catalogo delle leggi

**Files:** Modify: `src/features/Catalogo.tsx` (sostituisce il segnaposto). Test: `tests/features/Catalogo.test.tsx`

- [ ] **Step 1: Test che fallisce** — `tests/features/Catalogo.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Catalogo } from '../../src/features/Catalogo';
import type { Profilo } from '../../src/engine/types';

const dipendente: Profilo = { schemaVersion: 1, eta: 34, condizioneLavorativa: 'dipendente-privato', fasciaReddito: 'da15a20k' };

test('mostra le leggi con stato e badge di rilevanza', () => {
  render(<Catalogo profilo={dipendente} esploratore={false} onScegli={vi.fn()}
    onModificaProfilo={vi.fn()} onPrivacy={vi.fn()} onEsciEsploratore={vi.fn()} />);
  expect(screen.getByText(/taglio del cuneo fiscale/i)).toBeInTheDocument();
  expect(screen.getByText(/in vigore/i)).toBeInTheDocument();
  expect(screen.getByText(/salario minimo/i)).toBeInTheDocument();
  expect(screen.getByText(/in discussione/i)).toBeInTheDocument();
  expect(screen.getAllByText(/ti riguarda quasi sicuramente/i).length).toBeGreaterThan(0);
});

test('scegliere una legge chiama onScegli con il suo id', async () => {
  const onScegli = vi.fn();
  render(<Catalogo profilo={dipendente} esploratore={false} onScegli={onScegli}
    onModificaProfilo={vi.fn()} onPrivacy={vi.fn()} onEsciEsploratore={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: /taglio del cuneo fiscale/i }));
  expect(onScegli).toHaveBeenCalledWith('cuneo-fiscale-2025');
});

test('il filtro per ambito nasconde le leggi degli altri ambiti', async () => {
  render(<Catalogo profilo={dipendente} esploratore={false} onScegli={vi.fn()}
    onModificaProfilo={vi.fn()} onPrivacy={vi.fn()} onEsciEsploratore={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: /^casa$/i }));
  expect(screen.queryByText(/taglio del cuneo/i)).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Esegui** — `npm test -- Catalogo`. Atteso: FAIL.

- [ ] **Step 3: Implementa `src/features/Catalogo.tsx`**

```tsx
import { useState } from 'react';
import type { Ambito, Profilo, StatoLegge } from '../engine/types';
import { CATALOGO } from '../data/laws';
import { rilevanza } from '../engine/simulate';
import { Icona } from '../ui/Icona';

const STATI: Record<StatoLegge, { etichetta: string; colore: string }> = {
  vigore: { etichetta: 'In vigore', colore: 'var(--verde)' },
  approvata: { etichetta: 'Appena approvata', colore: 'var(--teal)' },
  discussione: { etichetta: 'In discussione', colore: 'var(--giallo)' },
  bozza: { etichetta: 'Bozza', colore: 'var(--testo-2)' },
  referendum: { etichetta: 'Referendum', colore: 'var(--viola)' }
};
const AMBITI: { valore: Ambito | 'tutte'; etichetta: string }[] = [
  { valore: 'tutte', etichetta: 'Tutte' },
  { valore: 'fisco-lavoro', etichetta: 'Fisco e lavoro' },
  { valore: 'pensioni-welfare', etichetta: 'Pensioni e welfare' },
  { valore: 'casa', etichetta: 'Casa' },
  { valore: 'diritti-salute', etichetta: 'Diritti e salute' },
  { valore: 'sicurezza-privacy', etichetta: 'Sicurezza e privacy' },
  { valore: 'doveri', etichetta: 'Doveri e obblighi' }
];
const RILEVANZA = {
  alta: 'Ti riguarda quasi sicuramente',
  media: 'Potrebbe riguardarti',
  bassa: 'Non ti tocca direttamente'
};

export function Catalogo({ profilo, esploratore, onScegli, onModificaProfilo, onPrivacy, onEsciEsploratore }: {
  profilo: Profilo; esploratore: boolean; onScegli: (id: string) => void;
  onModificaProfilo: () => void; onPrivacy: () => void; onEsciEsploratore: () => void;
}) {
  const [ambito, setAmbito] = useState<Ambito | 'tutte'>('tutte');
  const visibili = CATALOGO.filter((l) => ambito === 'tutte' || l.ambito === ambito);

  return (
    <div>
      <h1 style={{ fontSize: 24 }}>Scegli una legge</h1>
      {esploratore && (
        <p className="badge badge-dipende">
          Profilo ipotetico attivo —{' '}
          <button onClick={onEsciEsploratore} style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', font: 'inherit', color: 'inherit' }}>
            torna al tuo profilo
          </button>
        </p>
      )}
      <div role="group" aria-label="Filtra per argomento">
        {AMBITI.map((a) => (
          <button key={a.valore} className="pill" aria-pressed={ambito === a.valore}
            onClick={() => setAmbito(a.valore)}>{a.etichetta}</button>
        ))}
      </div>
      <div className="spazio">
        {visibili.map((legge) => {
          const stato = STATI[legge.stato];
          const r = rilevanza(profilo, legge);
          return (
            <button key={legge.id} className="card spazio" onClick={() => onScegli(legge.id)}
              style={{ display: 'block', width: '100%', textAlign: 'left', border: 'none',
                borderLeft: `4px solid ${stato.colore}`, cursor: 'pointer', font: 'inherit', color: 'inherit' }}>
              <span className="testo-piccolo" style={{ fontWeight: 800, color: stato.colore }}>{stato.etichetta}</span>
              <span style={{ display: 'block', fontWeight: 800, fontSize: 17 }}>{legge.titoloDivulgativo}</span>
              <span className="testo-piccolo">{RILEVANZA[r]} · 2 min</span>
            </button>
          );
        })}
        {visibili.length === 0 && (
          <p className="card spazio">Per questo argomento non abbiamo ancora leggi nel catalogo: stanno arrivando.</p>
        )}
      </div>
      <div className="spazio" style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-secondario" style={{ flex: 1 }} onClick={onModificaProfilo}>
          <Icona nome="persona" dimensione={16} /> Modifica profilo
        </button>
        <button className="btn btn-secondario" style={{ flex: 1 }} onClick={onPrivacy}>
          <Icona nome="lucchetto" dimensione={16} /> I tuoi dati
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Esegui** — `npm test -- Catalogo`. Atteso: PASS (3 test).

- [ ] **Step 5: Commit** — `git add -A && git commit -m "Catalogo leggi con stati semaforici, rilevanza personale e filtri per ambito"`

---

### Task 14: Report con timeline

**Files:** Modify: `src/features/Report.tsx` (sostituisce il segnaposto). Test: `tests/features/Report.test.tsx`

- [ ] **Step 1: Test che fallisce** — `tests/features/Report.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Report } from '../../src/features/Report';
import { cuneoFiscale } from '../../src/data/laws/cuneo-fiscale';
import { salarioMinimo } from '../../src/data/laws/salario-minimo';
import type { Profilo } from '../../src/engine/types';

const dipendente: Profilo = { schemaVersion: 1, eta: 34, condizioneLavorativa: 'dipendente-privato', fasciaReddito: 'da15a20k' };

test('mostra il totale del primo anno, il badge di confidenza e la fonte', () => {
  render(<Report profilo={dipendente} legge={cuneoFiscale} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  // l'intervallo compare sia nel totale sia nella riga effetto: si usa getAllByText
  expect(screen.getAllByText(/da \+60 a \+88 €/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/^certo$/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /normattiva/i })).toBeInTheDocument();
  expect(screen.getByText(/a parità di tutte le altre leggi/i)).toBeInTheDocument();
});

test('la timeline cambia orizzonte', async () => {
  render(<Report profilo={dipendente} legge={cuneoFiscale} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  await userEvent.click(screen.getByRole('tab', { name: /10 anni/i }));
  expect(screen.getByRole('tab', { name: /10 anni/i })).toHaveAttribute('aria-selected', 'true');
});

test('legge non in vigore: avviso ben visibile', () => {
  const p: Profilo = { schemaVersion: 1, eta: 22, condizioneLavorativa: 'dipendente-privato', fasciaReddito: 'fino9k' };
  render(<Report profilo={p} legge={salarioMinimo} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  expect(screen.getByText(/non è ancora in vigore/i)).toBeInTheDocument();
});

test('legge che non tocca il profilo: messaggio chiaro e invito a vedere gli altri', () => {
  const pensionato: Profilo = { schemaVersion: 1, eta: 70, condizioneLavorativa: 'pensionato', fasciaReddito: 'da9a15k' };
  render(<Report profilo={pensionato} legge={cuneoFiscale} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  expect(screen.getByText(/non cambia nulla per te/i)).toBeInTheDocument();
});

test('campo mancante: invito ad aggiungere il dato', () => {
  const senzaReddito: Profilo = { schemaVersion: 1, eta: 30, condizioneLavorativa: 'dipendente-privato' };
  render(<Report profilo={senzaReddito} legge={cuneoFiscale} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  expect(screen.getByText(/aggiungi questo dato al profilo/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Esegui** — `npm test -- Report`. Atteso: FAIL.

- [ ] **Step 3: Implementa `src/features/Report.tsx`**

```tsx
import { useState } from 'react';
import type { Legge, Orizzonte, Profilo, Regola } from '../engine/types';
import { ORIZZONTI } from '../engine/types';
import { orizzonteEtichetta, simula } from '../engine/simulate';
import { Icona } from '../ui/Icona';

const ETICHETTA_CAMPO: Partial<Record<keyof Profilo, string>> = {
  fasciaReddito: 'il tuo reddito', fasciaIsee: 'il tuo ISEE', figli: 'quanti figli hai',
  abitazione: 'dove vivi', regione: 'la tua regione', condizioneLavorativa: 'di cosa ti occupi'
};
const CONFIDENZA = {
  certa: { classe: 'badge-certa', parola: 'Certo' },
  probabile: { classe: 'badge-probabile', parola: 'Probabile' },
  dipende: { classe: 'badge-dipende', parola: 'Dipende' }
} as const;

function formattaIntervallo(min: number, max: number): string {
  const segno = (n: number) => (n > 0 ? `+${n}` : `${n}`);
  return min === max ? `${segno(min)} €` : `da ${segno(min)} a ${segno(max)} €`;
}

function RigaEffetto({ regola }: { regola: Regola }) {
  const [aperta, setAperta] = useState(false);
  const conf = CONFIDENZA[regola.confidenza];
  return (
    <div className="card spazio">
      <span className={`badge ${conf.classe}`}>{conf.parola}</span>
      <p style={{ margin: '8px 0', fontWeight: 600 }}>{regola.effetto.descrizione}</p>
      {regola.effetto.importoMese && (
        <p style={{ margin: '4px 0', fontWeight: 900, fontSize: 20 }}>
          {formattaIntervallo(
            regola.effetto.direzione === 'negativo' ? -regola.effetto.importoMese.max : regola.effetto.importoMese.min,
            regola.effetto.direzione === 'negativo' ? -regola.effetto.importoMese.min : regola.effetto.importoMese.max
          )} al mese
        </p>
      )}
      <button className="testo-piccolo" onClick={() => setAperta(!aperta)} aria-expanded={aperta}
        style={{ background: 'none', border: 'none', textDecoration: 'underline', color: 'var(--blu)', cursor: 'pointer', padding: 0 }}>
        {aperta ? 'Nascondi dettagli' : 'Dettagli e fonte'}
      </button>
      {aperta && (
        <div className="testo-piccolo spazio">
          {regola.noteConfidenza && <p>{regola.noteConfidenza}</p>}
          <p>
            Fonte:{' '}
            <a href={regola.fonteRegola.url} target="_blank" rel="noopener noreferrer">
              {regola.fonteRegola.etichetta}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

export function Report({ profilo, legge, esploratore, onAltri, onIndietro }: {
  profilo: Profilo; legge: Legge; esploratore: boolean;
  onAltri: () => void; onIndietro: () => void;
}) {
  const [orizzonte, setOrizzonte] = useState<Orizzonte>('anno1');
  const r = simula(profilo, legge);
  const totale = r.totaleMese[orizzonte];
  const nonInVigore = legge.stato !== 'vigore' && legge.stato !== 'approvata';
  const nessunEffetto = r.effetti.length === 0 && r.nonCalcolabili.length === 0;
  const haTotale = r.effetti.some((e) => e.confidenza !== 'dipende' && e.effetto.importoMese);

  return (
    <div>
      <button className="btn btn-secondario" onClick={onIndietro} style={{ width: 'auto', display: 'inline-flex', gap: 6 }}>
        <Icona nome="indietro" dimensione={16} /> Catalogo
      </button>
      <h1 style={{ fontSize: 24 }}>{legge.titoloDivulgativo}</h1>
      {esploratore && <p className="badge badge-dipende">Stai guardando con gli occhi di un profilo ipotetico</p>}
      {nonInVigore && (
        <p className="card" style={{ borderLeft: '4px solid var(--arancio)' }}>
          <b>Questa legge NON è ancora in vigore.</b> Ti mostriamo cosa succederebbe SE venisse approvata nel testo attuale.
        </p>
      )}
      <p>{legge.riassunto}</p>

      {nessunEffetto ? (
        <div className="card">
          <p style={{ fontWeight: 700 }}>Questa legge non cambia nulla per te.</p>
          <p className="testo-piccolo">Ma tocca altre persone: guarda chi.</p>
        </div>
      ) : (
        <>
          <div role="tablist" aria-label="Orizzonte temporale" className="spazio">
            {ORIZZONTI.map((o) => (
              <button key={o} role="tab" className="pill" aria-selected={orizzonte === o}
                aria-pressed={orizzonte === o} onClick={() => setOrizzonte(o)}>
                {orizzonteEtichetta(o)}
              </button>
            ))}
          </div>
          {haTotale && (
            <div className={`riquadro-numero spazio ${totale.min + totale.max >= 0 ? 'positivo' : 'negativo'}`}>
              <div className="numero">{formattaIntervallo(totale.min, totale.max)}</div>
              <div>al mese tra {orizzonteEtichetta(orizzonte)} (effetti certi e probabili)</div>
            </div>
          )}
          {r.effetti.map((regola) => <RigaEffetto key={regola.id} regola={regola} />)}
          {/* più regole possono richiedere lo stesso dato: una card per insieme di campi mancanti, non per regola */}
          {[...new Map(r.nonCalcolabili.map((nc) => [nc.campiMancanti.join('|'), nc.campiMancanti])).values()].map((campi) => (
            <div key={campi.join('|')} className="card spazio" style={{ borderLeft: '4px solid var(--arancio)' }}>
              <p style={{ margin: 0 }}>
                C'è un effetto che non possiamo calcolare: ci serve {campi.map((c) => ETICHETTA_CAMPO[c] ?? c).join(' e ')}.
              </p>
              <p className="testo-piccolo">Aggiungi questo dato al profilo per vederlo.</p>
            </div>
          ))}
        </>
      )}

      <p className="testo-piccolo spazio">
        Simulazione a parità di tutte le altre leggi, con i dati di oggi. Catalogo aggiornato al {legge.verificataIl}.
        {' '}Fonti:{' '}
        {legge.fonti.map((f, i) => (
          <span key={f.url}>{i > 0 && ' · '}<a href={f.url} target="_blank" rel="noopener noreferrer">{f.etichetta}</a></span>
        ))}
      </p>
      <button className="btn spazio" onClick={onAltri}>E per gli altri?</button>
    </div>
  );
}
```

- [ ] **Step 4: Esegui** — `npm test -- Report`. Atteso: PASS (5 test).

- [ ] **Step 5: Commit** — `git add -A && git commit -m "Report: timeline 1/2/5/10 anni, totali onesti, confidenza e fonti per ogni effetto"`

---

### Task 15: Schermata Empatia + modalità esploratore

**Files:** Modify: `src/features/Empatia.tsx` (sostituisce il segnaposto). Test: `tests/features/Empatia.test.tsx`

- [ ] **Step 1: Test che fallisce** — `tests/features/Empatia.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Empatia } from '../../src/features/Empatia';
import { cuneoFiscale } from '../../src/data/laws/cuneo-fiscale';

test('mostra gli 8 personaggi con il loro esito', () => {
  render(<Empatia legge={cuneoFiscale} onCreaIpotetico={vi.fn()} onIndietro={vi.fn()} />);
  expect(screen.getByText(/anna, 74 anni/i)).toBeInTheDocument();
  expect(screen.getByText(/luca, 22 anni/i)).toBeInTheDocument();
  // Anna è pensionata: per lei il cuneo non cambia nulla
  const cardAnna = screen.getByText(/anna, 74 anni/i).closest('article')!;
  expect(cardAnna).toHaveTextContent(/nessun effetto/i);
  // Luca è dipendente a basso reddito: per lui c'è un effetto positivo
  const cardLuca = screen.getByText(/luca, 22 anni/i).closest('article')!;
  expect(cardLuca).toHaveTextContent(/€/);
});

test('il bottone crea profilo ipotetico chiama onCreaIpotetico', async () => {
  const onCrea = vi.fn();
  render(<Empatia legge={cuneoFiscale} onCreaIpotetico={onCrea} onIndietro={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: /crea un profilo ipotetico/i }));
  expect(onCrea).toHaveBeenCalled();
});
```

- [ ] **Step 2: Esegui** — `npm test -- Empatia`. Atteso: FAIL.

- [ ] **Step 3: Implementa `src/features/Empatia.tsx`**

```tsx
import type { Legge } from '../engine/types';
import { PERSONAGGI } from '../data/personas';
import { simula } from '../engine/simulate';
import { Icona } from '../ui/Icona';

export function Empatia({ legge, onCreaIpotetico, onIndietro }: {
  legge: Legge; onCreaIpotetico: () => void; onIndietro: () => void;
}) {
  return (
    <div>
      <button className="btn btn-secondario" onClick={onIndietro} style={{ width: 'auto', display: 'inline-flex', gap: 6 }}>
        <Icona nome="indietro" dimensione={16} /> Il mio report
      </button>
      <h1 style={{ fontSize: 24 }}>E per gli altri?</h1>
      <p>La stessa legge, vista con gli occhi di otto persone diverse.</p>
      {PERSONAGGI.map((p) => {
        const r = simula(p.profilo, legge);
        const totale = r.totaleMese.anno1;
        const haEconomico = r.effetti.some((e) => e.confidenza !== 'dipende' && e.effetto.importoMese);
        const haAltro = r.effetti.length > 0;
        return (
          <article key={p.id} className="card spazio">
            <h2 style={{ fontSize: 17, margin: 0, display: 'flex', gap: 8, alignItems: 'center' }}>
              <Icona nome="persona" /> {p.nome}
            </h2>
            <p className="testo-piccolo" style={{ margin: '4px 0' }}>{p.descrizione}</p>
            {haEconomico ? (
              <p style={{ fontWeight: 900, fontSize: 20, margin: 0,
                color: totale.min + totale.max >= 0 ? 'var(--verde)' : 'var(--rosso)' }}>
                {totale.min === totale.max
                  ? `${totale.min > 0 ? '+' : ''}${totale.min} €`
                  : `da ${totale.min > 0 ? '+' : ''}${totale.min} a ${totale.max > 0 ? '+' : ''}${totale.max} €`} al mese
              </p>
            ) : haAltro ? (
              <p style={{ fontWeight: 700, margin: 0 }}>{r.effetti[0].effetto.descrizione}</p>
            ) : (
              <p style={{ fontWeight: 700, margin: 0, color: 'var(--testo-2)' }}>Nessun effetto per questa persona.</p>
            )}
          </article>
        );
      })}
      <button className="btn btn-secondario spazio" onClick={onCreaIpotetico}
        style={{ borderStyle: 'dashed', display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
        <Icona nome="persone" /> Crea un profilo ipotetico
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Esegui** — `npm test -- Empatia`. Atteso: PASS (2 test).

- [ ] **Step 5: Commit** — `git add -A && git commit -m "Schermata empatia: la legge vista da otto persone diverse + accesso esploratore"`

---

### Task 16: Schermata Privacy

**Files:** Modify: `src/features/Privacy.tsx` (sostituisce il segnaposto). Test: `tests/features/Privacy.test.tsx`

- [ ] **Step 1: Test che fallisce** — `tests/features/Privacy.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Privacy } from '../../src/features/Privacy';

test('spiega dove sono i dati e cosa non facciamo', () => {
  render(<Privacy tema="auto" onCambiaTema={vi.fn()} onCancellaTutto={vi.fn()} onIndietro={vi.fn()} />);
  expect(screen.getByText(/restano solo su questo dispositivo/i)).toBeInTheDocument();
  expect(screen.getByText(/non li vendiamo/i)).toBeInTheDocument();
});

test('cancella tutto chiede conferma e poi svuota lo storage', async () => {
  localStorage.setItem('reflex.profilo.v1', JSON.stringify({ schemaVersion: 1, eta: 34 }));
  const onCancella = vi.fn();
  render(<Privacy tema="auto" onCambiaTema={vi.fn()} onCancellaTutto={onCancella} onIndietro={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: /cancella tutti i miei dati/i }));
  await userEvent.click(screen.getByRole('button', { name: /sì, cancella/i }));
  expect(localStorage.getItem('reflex.profilo.v1')).toBeNull();
  expect(onCancella).toHaveBeenCalled();
});

test('selettore tema chiama onCambiaTema', async () => {
  const onTema = vi.fn();
  render(<Privacy tema="auto" onCambiaTema={onTema} onCancellaTutto={vi.fn()} onIndietro={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: /scuro/i }));
  expect(onTema).toHaveBeenCalledWith('dark');
});
```

- [ ] **Step 2: Esegui** — `npm test -- Privacy`. Atteso: FAIL.

- [ ] **Step 3: Implementa `src/features/Privacy.tsx`**

```tsx
import { useState } from 'react';
import { cancellaTutto } from '../storage/profilo';
import { Icona } from '../ui/Icona';

export function Privacy({ tema, onCambiaTema, onCancellaTutto, onIndietro }: {
  tema: string; onCambiaTema: (t: string) => void;
  onCancellaTutto: () => void; onIndietro: () => void;
}) {
  const [conferma, setConferma] = useState(false);
  return (
    <div>
      <button className="btn btn-secondario" onClick={onIndietro} style={{ width: 'auto', display: 'inline-flex', gap: 6 }}>
        <Icona nome="indietro" dimensione={16} /> Indietro
      </button>
      <h1 style={{ fontSize: 24, display: 'flex', gap: 8, alignItems: 'center' }}>
        <Icona nome="lucchetto" dimensione={24} /> I tuoi dati
      </h1>
      <div className="card">
        <p><b>I tuoi dati restano solo su questo dispositivo.</b> Non chiediamo nome né cognome, non creiamo account, non usiamo cookie né tracker.</p>
        <p>Non inviamo i tuoi dati a nessuno, non li vendiamo e non li vediamo nemmeno noi: l'app funziona tutta sul tuo telefono o computer.</p>
        <p className="testo-piccolo">Se cancelli i dati o disinstalli l'app, spariscono per sempre: non ne esiste nessuna copia altrove.</p>
      </div>
      <div className="card spazio">
        <h2 style={{ fontSize: 17, marginTop: 0 }}>Aspetto</h2>
        <div role="group" aria-label="Tema dell'app">
          <button className="pill" aria-pressed={tema === 'auto'} onClick={() => onCambiaTema('auto')}>Automatico</button>
          <button className="pill" aria-pressed={tema === 'light'} onClick={() => onCambiaTema('light')}>Chiaro</button>
          <button className="pill" aria-pressed={tema === 'dark'} onClick={() => onCambiaTema('dark')}>Scuro</button>
        </div>
      </div>
      <div className="card spazio">
        <h2 style={{ fontSize: 17, marginTop: 0 }}>Cancellazione</h2>
        {!conferma ? (
          <button className="btn btn-pericolo" onClick={() => setConferma(true)}>
            Cancella tutti i miei dati
          </button>
        ) : (
          <>
            <p><b>Sicuro/a?</b> Il profilo verrà eliminato per sempre da questo dispositivo.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondario" style={{ flex: 1 }} onClick={() => setConferma(false)}>No, tienili</button>
              <button className="btn btn-pericolo" style={{ flex: 1 }}
                onClick={() => { cancellaTutto(); onCancellaTutto(); }}>
                Sì, cancella
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Esegui** — `npm test -- Privacy`. Atteso: PASS (3 test).

- [ ] **Step 5: Commit** — `git add -A && git commit -m "Schermata privacy: spiegazione semplice, tema, cancella tutto con conferma"`

---

### Task 17: Accessibilità automatica (axe) su tutte le schermate

**Files:** Create: `tests/a11y.test.tsx`

- [ ] **Step 1: Scrivi il test** — `tests/a11y.test.tsx`

```tsx
import { render } from '@testing-library/react';
import axe from 'axe-core';
import { Benvenuto } from '../src/features/Benvenuto';
import { Wizard } from '../src/features/Wizard';
import { Catalogo } from '../src/features/Catalogo';
import { Report } from '../src/features/Report';
import { Empatia } from '../src/features/Empatia';
import { Privacy } from '../src/features/Privacy';
import { cuneoFiscale } from '../src/data/laws/cuneo-fiscale';
import type { Profilo } from '../src/engine/types';

const profilo: Profilo = { schemaVersion: 1, eta: 34, condizioneLavorativa: 'dipendente-privato', fasciaReddito: 'da15a20k' };

async function verificaAccessibilita(elemento: React.ReactElement, nome: string) {
  const { container } = render(elemento);
  const risultato = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } }); // jsdom non calcola i colori
  const violazioni = risultato.violations.map((v) => `${nome}: ${v.id} — ${v.help}`);
  expect(violazioni).toEqual([]);
}

test('Benvenuto è accessibile', () =>
  verificaAccessibilita(<Benvenuto onInizia={() => {}} onPrivacy={() => {}} />, 'Benvenuto'));
test('Wizard è accessibile', () =>
  verificaAccessibilita(<Wizard iniziale={null} esploratore={false} onFine={() => {}} onAnnulla={() => {}} />, 'Wizard'));
test('Catalogo è accessibile', () =>
  verificaAccessibilita(<Catalogo profilo={profilo} esploratore={false} onScegli={() => {}}
    onModificaProfilo={() => {}} onPrivacy={() => {}} onEsciEsploratore={() => {}} />, 'Catalogo'));
test('Report è accessibile', () =>
  verificaAccessibilita(<Report profilo={profilo} legge={cuneoFiscale} esploratore={false}
    onAltri={() => {}} onIndietro={() => {}} />, 'Report'));
test('Empatia è accessibile', () =>
  verificaAccessibilita(<Empatia legge={cuneoFiscale} onCreaIpotetico={() => {}} onIndietro={() => {}} />, 'Empatia'));
test('Privacy è accessibile', () =>
  verificaAccessibilita(<Privacy tema="auto" onCambiaTema={() => {}} onCancellaTutto={() => {}} onIndietro={() => {}} />, 'Privacy'));
```

- [ ] **Step 2: Esegui** — `npm test -- a11y`. Atteso: probabile FAIL alla prima esecuzione (axe segnala problemi reali: heading multipli, aria mancanti).

- [ ] **Step 3: Correggi le violazioni segnalate** modificando i componenti indicati nei messaggi di axe (NON disattivare regole oltre a `color-contrast`, che in jsdom non è calcolabile). Tipiche correzioni: un solo `h1` per schermata, `aria-label` sui gruppi, ruoli corretti.

- [ ] **Step 4: Esegui** — `npm test`. Atteso: PASS (tutta la suite).

- [ ] **Step 5: Commit** — `git add -A && git commit -m "Test di accessibilità axe-core su tutte le schermate"`

---### Task 18: Sicurezza dell'hosting e verifica finale

**Files:** Create: `public/_headers`, `README.md`

- [ ] **Step 1: Crea `public/_headers`** (header di sicurezza per Netlify; per Vercel andranno replicati in `vercel.json` al momento del deploy)

```
/*
  Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; script-src 'self'; connect-src 'self'; frame-ancestors 'none'
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
```

- [ ] **Step 2: Crea `README.md`**

```markdown
# REF-LEX

Simulatore dell'impatto delle leggi sulla tua vita. Anonimo: tutti i dati restano sul dispositivo.

## Comandi

- `npm install` — installa le dipendenze
- `npm run dev` — avvia in sviluppo (http://localhost:5173)
- `npm test` — esegue tutti i test
- `npm run build` — build di produzione in `dist/`

## Regole del catalogo leggi

Ogni legge in `src/data/laws/` deve avere: fonti ufficiali verificate, regole con
confidenza dichiarata (certa/probabile/dipende), casi di test sui valori in `tests/data/`.
**Mai inventare un numero.** Vedi la spec in `docs/superpowers/specs/`.
```

- [ ] **Step 3: Verifica finale completa**

Esegui: `npm test && npm run build`
Atteso: tutta la suite PASS, build senza errori.

Esegui: `npm run preview` e apri l'URL indicato: percorri a mano benvenuto → wizard → catalogo → report → empatia → privacy. Verifica tema scuro e cancella-tutto.

- [ ] **Step 4: Commit** — `git add -A && git commit -m "Header di sicurezza per l'hosting e README"`

---

## Dopo questo piano

1. **Piano 2 — Catalogo completo:** le restanti 10 leggi (2 per ambito mancante), ciascuna: ricerca fonti con WebFetch → modellazione regole → test sui valori → commit. Stessa struttura del Task 7/8.
2. **Verifica visiva** con la skill frontend-design per rifinire la UI rispetto ai mockup approvati.
3. **Test E2E Playwright** del flusso completo (benvenuto → wizard → catalogo → report → empatia) su viewport mobile e desktop.
4. **Deploy** su Netlify/Vercel; poi Capacitor per il Play Store.
