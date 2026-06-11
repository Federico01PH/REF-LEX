# REF-LEX — Aggiornamento automatico del catalogo e Novità dal Parlamento (+ restyle "più umano")

**Data:** 11 giugno 2026
**Stato:** design approvato a sezioni dall'utente; in attesa di revisione finale della spec scritta.
**Si appoggia a:** spec MVP `2026-06-10-reflex-mvp-design.md` (Piano 1, completato e su master).

## 1. Obiettivo

Le leggi devono entrare nell'app automaticamente dai siti ufficiali dello Stato, senza che l'utente aggiorni l'app. Due livelli, entrambi onesti:

1. **Catalogo remoto aggiornabile** — le leggi modellate e verificate arrivano a tutte le app installate alla prima apertura utile.
2. **Novità dal Parlamento** — leggi appena pubblicate e proposte in movimento, prese ogni notte dagli open data ufficiali, mostrate subito con stato e link al testo, etichettate "Simulazione in preparazione".

**Chiarimento vincolante (richiesto dall'utente):** "non simulabile" non significa "non approvata". Le leggi in discussione, bozza o referendum SONO simulabili una volta modellate (il report mostra l'avviso "cosa succederebbe SE venisse approvata"). "Simulazione in preparazione" significa solo: troppo recente, la modellazione con verifica delle fonti non è ancora completata. Appena completata, la legge passa nel catalogo simulabile via aggiornamento remoto.

## 2. I due file di dati e il caricamento nell'app

- **`public/dati/catalogo.json`** — `{ versione: number, generatoIl: 'yyyy-mm-dd', leggi: Legge[] }`. Generato serializzando il catalogo TypeScript (fonte di verità resta `src/data/laws/`). Pubblicarlo = aggiornare tutte le app.
- **`public/dati/novita.json`** — `{ generatoIl: 'yyyy-mm-dd', voci: Novita[] }` con `Novita = { id, titolo, tipo: 'gazzetta' | 'camera' | 'senato', stato: StatoLegge, data: 'yyyy-mm-dd', url }`. Massimo 20 voci, ordinate per data discendente. Nessun testo interpretato: solo metadati ufficiali.
- **Caricamento (`src/storage/datiRemoti.ts`):** all'avvio l'app fa `fetch` dei due file **dalla stessa origine** (CSP `connect-src 'self'` invariata; richiesta anonima, nessun dato personale né query string). Validazione con zod: catalogo con lo stesso `SchemaLegge` severo + campo versione; novità con schema dedicato. File invalido o fetch fallito → si scarta in silenzio e si usa il fallback. Il catalogo remoto valido sostituisce quello incorporato solo se `versione` è maggiore; viene salvato in `localStorage` (`reflex.catalogo.cache`) come ultima copia buona per gli avvii offline.
- **Fallback dichiarato:** offline o senza dati remoti, l'app usa il catalogo incorporato/cache e il footer del report dice "catalogo locale del [data]".

## 3. La pipeline notturna (`scripts/aggiorna-dati`)

- Script Node eseguibile con `npm run aggiorna-dati`. Fa due cose:
  1. **Serializza il catalogo** TS → `public/dati/catalogo.json` (versione incrementata quando il contenuto cambia).
  2. **Interroga gli open data ufficiali** e rigenera `public/dati/novita.json`:
     - Gazzetta Ufficiale (feed/elenco serie generale) → leggi e decreti appena pubblicati;
     - dati.camera.it (endpoint SPARQL) → proposte di legge con movimenti recenti;
     - dati.senato.it (endpoint SPARQL) → disegni di legge con movimenti recenti.
- Filtro: solo atti normativi (leggi, decreti-legge, d.lgs., DDL); le 20 voci più recenti; titoli abbreviati con cura ma mai riscritti.
- **Fallimento rumoroso:** se una fonte cambia formato o non risponde, lo script esce con errore e NON pubblica dati parziali o sbagliati; l'app continua con l'ultimo dato buono.
- **Automazione:** workflow GitHub Actions schedulato ogni notte (eseguibile anche a mano), che lancia lo script e ripubblica il sito. Si attiva quando il repository sarà su GitHub con deploy collegato; fino ad allora lo script si lancia manualmente prima di ogni pubblicazione.
- I test della pipeline usano risposte d'esempio salvate su file (fixture); nessun test tocca la rete.

## 4. UI: sezione "Novità dal Parlamento" nel catalogo

- In cima alla schermata "Scegli una legge", sopra i filtri: titolo di sezione, data di aggiornamento ("dal Parlamento, aggiornato al [generatoIl]") e card compatte: stato col colore semaforico esistente, titolo, data, link "Leggi il testo ufficiale" (target _blank, noopener), badge **"Simulazione in preparazione"** (stile badge-dipende). Niente numeri, niente stime.
- Se `novita.json` non è disponibile: la sezione non compare (nessun errore mostrato).
- Le voci di novità NON sono cliccabili verso il report: il solo link è al testo ufficiale.

## 5. Restyle "più umano" (richiesto dall'utente)

- **Sfondo principale bianco** (`--sfondo: #FFFFFF` nel tema chiaro). Le card si distinguono con **bordo sottile** (`1px solid var(--bordo)`) e ombra molto tenue, non con il contrasto di colore di fondo. `--superficie-2` resta per chip e riquadri secondari.
- **Colore concentrato dove serve:** bottoni primari (gradiente blu→viola), numeri del report (riquadri verdi/arancio), badge e semafori. Tutto il resto respira in bianco.
- **Tipografia con carattere:** titoli (h1/h2) con un font serif/display self-hosted dal carattere editoriale e caldo (es. Fraunces o simile, file locale, niente CDN); corpo testo resta sans di sistema, ≥16px. Più spazio bianco tra le sezioni.
- Obiettivo dichiarato: l'app non deve sembrare il tipico prodotto "generato dall'AI" (gradienti ovunque, card galleggianti, viola di default): deve sembrare disegnata da persone per persone. Tema scuro: si adegua con gli stessi principi (sfondo scuro pieno, card bordate).
- I contrasti WCAG AA già verificati restano vincolanti dopo il restyle (ricontrollo nei test).

## 6. Errori e test

- Loader remoto: test per JSON valido (sostituisce), versione non maggiore (ignora), JSON corrotto (scarta), fetch fallito (fallback), offline con cache (usa cache).
- Novità UI: test resa con dati, con file mancante (sezione assente), link con noopener.
- Pipeline: test parser per ciascuna fonte su fixture salvate; test del filtro e dell'ordinamento; test che il catalogo serializzato rispetti `SchemaLegge`.
- Accessibilità: axe sulle schermate toccate; i contrasti del restyle verificati con i rapporti.

## 7. Fuori perimetro (futuro)

- Notifiche push ("è uscita una legge che ti riguarda") — richiede backend.
- Modellazione assistita automatica delle leggi — resta vietata senza revisione umana.
- Frequenze di aggiornamento superiori alla notturna.
