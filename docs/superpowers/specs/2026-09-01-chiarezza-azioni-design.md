# Rendere evidenti le azioni: catalogo, report, legenda

Data: 2026-09-01

## Problema

Segnalazioni degli utenti, tre punti:

1. Nel catalogo non si capisce cosa fare per primo. Le persone credono che le
   pillole degli argomenti siano le scelte, e non vedono la barra che apre
   l'elenco delle leggi.
2. Nel report non si accorgono che possono vedere l'effetto della stessa legge
   sugli altri.
3. Non capiscono la legenda "Certo / Probabile / Dipende".

Causa comune, osservata guardando l'app da telefono:

- La prima schermata intera è occupata dalla card "I tuoi dati", che non è
  l'azione principale; sotto, dodici pillole-filtro riempiono mezzo schermo e la
  barra — l'azione vera — arriva dopo il muro, come campo grigio con testo
  sbiadito, senza lente né freccia.
- La scritta "Filtra per argomento, poi scegli la legge" dice esplicitamente di
  filtrare prima: il filtro sembra obbligatorio.
- Nel report "Vedi com'è per gli altri" è in fondo, dopo il paragrafo delle fonti.
- La legenda è un `details` chiuso, in cima, con frasi lunghe: nessuno lo apre.

## Soluzione

### 1. Catalogo: barra prima, filtri dopo e compatti

- Dentro `.scelta-legge` la **combobox viene per prima**, ingrandita, con icona
  lente a sinistra e freccia in giù a destra, e un testo dentro che dice l'azione
  e la quantità: `Tocca qui: scegli tra N leggi` (N calcolato, non scritto a mano).
- Sotto, i filtri: etichetta **"Oppure restringi per argomento"** (non più "prima
  filtra, poi scegli") e pillole su **una riga sola che scorre di lato**, invece
  del blocco a capo che riempiva mezzo schermo.
- La card **"I tuoi dati" scende in fondo**, nella sezione di servizio con
  richieste e segnalazioni, con testo accorciato.

### 2. Report: due schede in cima

- Sotto il titolo della legge, due schede: **"Come tocca a te"** e **"Come tocca
  agli altri"**. Componente unico `SchedeReport`, usato sia da `Report` sia da
  `Empatia`, con `aria-current="page"` sulla scheda attiva (niente `role=tab`:
  sono due viste separate, non due pannelli nello stesso DOM).
- `Empatia` mostra lo stesso titolo di legge del report: le due schermate si
  leggono come una sola pagina con due viste. La scheda "Come tocca a te"
  sostituisce il bottone "Il mio report".
- Il blocco `.invito-altri` in fondo al report **sparisce**: le schede fanno il
  suo lavoro, e via un pezzo di testo.

### 3. Legenda: parole che si spiegano da sole, sempre visibili

- Le parole dei badge cambiano: **Certo → Sicuro**, **Probabile → Quasi sicuro**,
  **Dipende → Dipende da te**.
- Il `details` chiuso è sostituito da **una riga sempre visibile** appena sopra
  gli effetti: badge vero + tre o quattro parole ciascuno.
  `[Sicuro] è già legge · [Quasi sicuro] manca un passaggio · [Dipende da te] cambia secondo il tuo caso`
- La voce **Compressione** compare in quella riga **solo** se nel report c'è un
  effetto con `dirittoToccato`: meno testo quando non serve.

## Struttura del codice

Le parole di confidenza erano duplicate in `Report.tsx` e `Empatia.tsx`.
Diventano un modulo solo, `src/ui/confidenza.ts`, con parola e spiegazione breve;
la legenda le legge da lì, così non possono più divergere.

Componenti nuovi:

- `src/ui/confidenza.ts` — parola e spiegazione per ogni livello di confidenza.
- `src/ui/LegendaBadge.tsx` — la riga compatta, con la voce Compressione opzionale.
- `src/ui/SchedeReport.tsx` — le due schede, condivise da Report ed Empatia.

## Come si verifica

Test in `tests/features/Catalogo.test.tsx`, `Report.test.tsx`, `Empatia.test.tsx`,
scritti prima del codice:

- la barra viene prima dei filtri nell'ordine del documento;
- la barra dice quante leggi ci sono;
- i filtri sono presentati come restringimento, non come primo passo;
- "I tuoi dati" viene dopo la scelta della legge;
- le schede ci sono in entrambe le viste e portano dove devono;
- la legenda si legge senza aprire niente, e la voce Compressione compare solo
  quando serve;
- i badge usano le parole nuove.

Più `tests/a11y.test.tsx`, che gira axe su catalogo, report ed empatia.
