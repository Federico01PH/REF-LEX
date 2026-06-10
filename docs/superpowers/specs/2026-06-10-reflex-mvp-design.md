# REF-LEX — Design della prima versione (MVP)

**Data:** 10 giugno 2026
**Stato:** approvato a sezioni dall'utente durante il brainstorming; in attesa di revisione finale sulla spec scritta.

## 1. Visione

REF-LEX è un simulatore dell'impatto delle leggi sulla vita delle persone. L'utente descrive la propria situazione (senza nome e cognome), sceglie una legge — in vigore, in discussione, in bozza, a referendum o appena approvata — e riceve un report chiaro di come quella legge cambierà la sua vita su una timeline di 1, 2, 5 e 10 anni. Può poi rivedere la stessa legge "con gli occhi di un altro": profili predefiniti o costruiti liberamente, per capire l'impatto su persone diverse da sé e formarsi una coscienza politica basata su fatti.

Pubblico: dai 13 ai 100 anni (linguaggio comprensibile da terza media), incluse persone con disabilità visive, uditive e motorie.

**Principio fondante: mai inventare un numero.** Ogni effetto mostrato ha una fonte ufficiale citata e un livello di confidenza dichiarato. La credibilità è l'unico capitale del progetto.

## 2. Perimetro della prima versione

### Dentro

1. **Wizard del profilo** a passi brevi, salvato solo sul dispositivo. Campi: età, genere, identità di genere, orientamento sessuale, stato civile, regione di residenza (e domicilio se diverso), condizione lavorativa (dipendente pubblico/privato, P.IVA ordinaria, forfettario, imprenditore, studente, pensionato, disoccupato, caregiver, casalinga/o, altro), reddito/ISEE a fasce, figli e composizione familiare, abitazione (proprietà, affitto, comodato), disabilità e condizioni di salute (incluse condizioni non ancora riconosciute formalmente in Italia, es. fibromialgia), cittadinanza/provenienza, religione. Tutti i campi sensibili sono **facoltativi**, ciascuno con la spiegazione "perché lo chiediamo".
2. **Catalogo di 12 leggi italiane reali**, 2 per ambito: fisco e lavoro; pensioni e welfare; casa e quotidianità; diritti e salute; sicurezza e privacy; doveri e obblighi. Ogni legge ha: titolo divulgativo + titolo ufficiale, stato (in vigore / appena approvata / in discussione / bozza / referendum), fonti ufficiali con link, data di ultima verifica, regole di impatto modellate a mano.
3. **Report personale** con timeline 1/2/5/10 anni: effetti in euro dove quantificabili, effetti su diritti/doveri/accesso a servizi/qualità della vita dove no. Ogni effetto mostra fonte cliccabile e livello di confidenza. Il report dichiara: "a parità di tutte le altre leggi" e "catalogo aggiornato al [data]".
4. **"E per gli altri?"**: la stessa legge applicata a 8 personaggi predefiniti realistici (es. pensionata con minima, studente part-time, artigiano P.IVA, famiglia monoreddito con figli, persona con disabilità, neoassunta, imprenditore, persona immigrata con permesso di lungo periodo) + **modalità esploratore**: costruzione libera di profili ipotetici riusando lo stesso wizard, senza sovrascrivere il profilo personale.
5. **Accessibilità WCAG 2.2 AA** (vedi §8).
6. **PWA installabile**, funzionante offline dopo la prima visita, pubblicata su hosting statico con HTTPS.

### Fuori (versioni future, in ordine previsto)

- Pubblicazione su Google Play Store tramite Capacitor (la struttura nasce già compatibile).
- Account utente, sincronizzazione cloud, piani a pagamento per team/ONG/università/governi, API B2B.
- Acquisizione automatica in tempo reale delle leggi dai portali ufficiali (nel frattempo: il catalogo si aggiorna pubblicando nuove versioni dell'app, con data ben visibile).
- Lingue oltre l'italiano; leggi di altri Paesi e dell'UE in dettaglio.

## 3. Architettura

- **Stack:** Vite + React + TypeScript. PWA (manifest + service worker). Nessun backend.
- **Persistenza:** profilo in `localStorage` del dispositivo con chiave versionata (`reflex.profile.v1`). Nessun cookie, nessun tracker, nessuna chiamata di rete con dati personali. Tasto "Cancella tutti i miei dati" sempre raggiungibile.
- **Catalogo leggi:** file TypeScript/JSON versionati nel repository (`src/data/laws/*.ts`), uno per legge. Validati da uno schema (zod) in fase di build e di test.
- **Motore di simulazione:** modulo puro (`src/engine/`), nessuna dipendenza da React: `simula(profilo, legge) → RisultatoSimulazione`. Lo stesso motore serve il report personale, i personaggi predefiniti e la modalità esploratore.
- **Deploy:** hosting statico gratuito (Netlify o Vercel) con HTTPS e header di sicurezza (CSP severa, `Referrer-Policy`, `X-Content-Type-Options`, ecc.). Nessun asset da CDN di terzi: tutto self-hosted, font inclusi.

### Struttura del progetto

```
src/
  data/laws/          # 1 file per legge: metadati + regole + fonti
  data/personas.ts    # gli 8 personaggi predefiniti
  engine/             # motore puro: tipi, valutatore regole, formattazione effetti
  features/
    onboarding/       # benvenuto + wizard profilo
    catalog/          # elenco e filtri leggi
    report/           # report con timeline
    empathy/          # "E per gli altri?" + modalità esploratore
    privacy/          # schermata privacy + cancella dati
  ui/                 # design system "Civico energetico" (componenti riusabili)
  storage/            # lettura/scrittura/migrazione profilo locale
tests/                # test motore (per legge), accessibilità, flusso
```

## 4. Modello dati

### Profilo

Oggetto TypeScript con tutti i campi del wizard, ognuno opzionale tranne l'età. Include `schemaVersion` per le migrazioni. I valori sono enumerazioni (niente testo libero sui dati sensibili), le fasce economiche sono intervalli (es. ISEE: <9.360 / 9.360–15.000 / 15.000–25.000 / 25.000–40.000 / >40.000), così il dato è meno identificante e le regole restano semplici.

### Legge

```
{
  id, titoloDivulgativo, titoloUfficiale,
  stato: vigore | approvata | discussione | bozza | referendum,
  ambito: fisco-lavoro | pensioni-welfare | casa | diritti-salute | sicurezza-privacy | doveri,
  fonti: [{etichetta, url}],          // Normattiva, Gazzetta, Camera/Senato, INPS, MEF, ISTAT
  verificataIl: data,
  riassunto: testo semplice (max ~80 parole, livello terza media),
  regole: Regola[]
}
```

### Regola di impatto

```
{
  id,
  condizioni: espressione dichiarativa sul profilo
              (es. lavoro=dipendente AND redditoFascia<=25k),
  campiNecessari: [campi del profilo richiesti],   // per il messaggio "aggiungi questo dato"
  effetto: {
    tipo: economico | diritto | dovere | servizio | qualitaVita,
    valore: importo €/mese o €/anno (solo per tipo economico),
    descrizione: testo semplice,
    direzione: positivo | negativo | neutro | misto
  },
  timeline: { anno1, anno2, anno5, anno10 },        // l'effetto a ogni orizzonte
  confidenza: certa | probabile | dipende,
  noteConfidenza: testo (es. "in attesa del decreto attuativo previsto entro il…"),
  fonteRegola: riferimento puntuale (articolo/comma + link)
}
```

### Risultato simulazione

Lista di effetti applicabili ordinati per rilevanza + lista di "effetti non calcolabili" con il dato mancante + totale economico per orizzonte temporale (solo somma degli effetti a confidenza certa/probabile, con gli "dipende" mostrati a parte come scenari).

## 5. Motore di simulazione e onestà

- Funzione pura e deterministica: stesso profilo + stessa legge → stesso risultato.
- Tre livelli di confidenza, sempre visibili con colore + parola + spiegazione:
  - 🟢 **Certo** — scritto nella legge (aliquote, importi, scadenze).
  - 🟡 **Probabile** — stima su dati ufficiali (ISTAT, relazioni tecniche MEF) con ipotesi esplicitate nel report.
  - 🟠 **Dipende** — rimanda a decreti attuativi o la legge è ancora in discussione: si mostrano gli scenari possibili, mai un numero unico finto.
- Per le leggi non in vigore (discussione/bozza/referendum) il report apre con un avviso chiaro: "Questa legge NON è ancora in vigore: ecco cosa succederebbe SE venisse approvata nel testo attuale".
- Ogni numero è tracciabile: regola → fonte puntuale (articolo, comma) → link ufficiale.

## 6. Catalogo iniziale (candidato)

Due leggi per ambito. La selezione finale e tutti i valori verranno **verificati sulle fonti ufficiali durante l'implementazione**; se una proposta nel frattempo è decaduta o cambiata, si sostituisce con l'equivalente attuale e si aggiorna lo stato.

| Ambito | Legge (titolo divulgativo) | Stato previsto |
|---|---|---|
| Fisco e lavoro | Riforma IRPEF a tre aliquote e taglio del cuneo | In vigore |
| Fisco e lavoro | Salario minimo legale | In discussione |
| Pensioni e welfare | Requisiti di pensionamento e canali di uscita anticipata | In vigore |
| Pensioni e welfare | Assegno di inclusione | In vigore |
| Casa e quotidianità | Direttiva UE "Case green" (EPBD) | Approvata, attuazione scaglionata |
| Casa e quotidianità | Bonus edilizi (ristrutturazioni/efficienza) | In vigore, a scalare |
| Diritti e salute | Riforma della disabilità (progetto di vita, nuovo accertamento) | Approvata, in attuazione |
| Diritti e salute | Riconoscimento della fibromialgia nei LEA | In discussione |
| Sicurezza e privacy | AI Act europeo (obblighi e tutele per i cittadini) | Approvato, applicazione scaglionata |
| Sicurezza e privacy | Norme su videosorveglianza/sicurezza urbana più recenti | In vigore |
| Doveri e obblighi | Nuovo Codice della strada | In vigore |
| Doveri e obblighi | Referendum cittadinanza (riduzione anni di residenza) | Referendum |

Ogni legge entra nel catalogo solo con: fonti verificate, regole modellate, casi di test scritti.

## 7. UX e design

### Flusso in 5 schermate (mockup approvati)

1. **Benvenuto** — promessa personale ("Scopri come le leggi cambiano la TUA vita"), costo dichiarato basso ("2 minuti"), fiducia esplicita ("Zero dati inviati. Zero account. Zero tracker."), un solo bottone "Inizia".
2. **Wizard profilo** — una domanda per schermata, risposte a "pillole" toccabili grandi, barra di progresso, "perché lo chiediamo" su ogni dato sensibile, possibilità di saltare i campi facoltativi.
3. **Catalogo** — card per legge con stato a colore semaforico (verde=vigore, giallo=discussione, viola=referendum, azzurro=appena approvata, grigio=bozza), badge di rilevanza personale ("Ti riguarda quasi sicuramente / Potrebbe riguardarti / Non ti tocca direttamente") calcolato dal motore, filtri per ambito, tempo di lettura dichiarato.
4. **Report** — il numero/verdetto principale subito in alto (ricompensa immediata), timeline 1/2/5/10 anni navigabile, dettagli e fonti in sezioni espandibili (divulgazione progressiva), badge di confidenza su ogni effetto, avviso per leggi non in vigore, "catalogo aggiornato al [data]", CTA "E per gli altri?".
5. **E per gli altri?** — carosello degli 8 personaggi con nome, volto (emoji/illustrazione) ed esito a confronto; insight finale in una frase ("Questa legge aiuta i dipendenti, ma non tocca pensionati e autonomi"); bottone "Crea un profilo ipotetico" (modalità esploratore, wizard riusato, profilo personale intatto).

### Design system "Civico energetico" (approvato su mockup)

- Base di fiducia: blu istituzionale `#1A3A8F` su fondi chiari `#F2F5FB`, card bianche arrotondate con ombre morbide.
- Energia: gradienti per i numeri e le CTA — verde→teal (`#0BBF7D→#06A8C9`) per effetti positivi, arancio (`#FFB547→#FF8A3D`) per incertezza/attenzione, blu→viola (`#1A3A8F→#6C4BFF`) per le azioni principali a pillola. Rosso riservato agli effetti negativi.
- Tema chiaro predefinito + tema scuro opzionale (e rispetto di `prefers-color-scheme`).
- Tipografia: font sans leggibile self-hosted, corpo ≥16px, numeri del report grandi e in grassetto.

### Principi di psicologia applicati (requisiti, non decorazione)

- Rilevanza personale prima di tutto (il "TUA" in homepage, i badge "ti riguarda").
- Ricompensa immediata: mai più di un passo tra un'azione dell'utente e qualcosa di interessante da vedere.
- Carico cognitivo minimo: una domanda per schermata, max 7 scelte visibili, linguaggio terza media.
- Effetto Zeigarnik: barre di progresso visibili nel wizard.
- Trasparenza = fiducia: "perché lo chiediamo", fonti cliccabili, confidenza dichiarata.
- Effetto vittima identificabile: nella schermata empatia, persone con nome ed età, mai percentuali astratte.
- Colori semantici coerenti in tutta l'app (il verde è sempre "guadagni/diritti in più", l'arancio sempre "incerto", il rosso sempre "perdi qualcosa").
- Nessun dark pattern: niente urgenza finta, niente colpevolizzazione nel saltare campi facoltativi.

## 8. Accessibilità (WCAG 2.2 AA)

- HTML semantico, landmark, heading gerarchici; tutto usabile da solo tastiera con focus visibile.
- Screen reader: etichette ARIA dove serve, annunci di cambio schermata nel wizard, testi alternativi; i numeri del report letti con contesto ("più 86 euro al mese dal primo anno, fonte certa").
- Contrasto ≥4.5:1 in entrambi i temi; informazione mai affidata al solo colore (stato legge = colore + simbolo + parola).
- Target tattili ≥44px; layout a una colonna su mobile; testo ridimensionabile fino al 200% senza rotture; rispetto di `prefers-reduced-motion`.
- Linguaggio semplice ovunque; glossario inline per i termini tecnici inevitabili (es. "ISEE: ⓘ").

## 9. Privacy e sicurezza

- **Privacy by design:** nessun dato personale lascia il dispositivo, mai. Nessun account, cookie, analytics o font/script di terze parti. GDPR soddisfatto alla radice (non c'è trattamento lato server di dati personali).
- Schermata "I tuoi dati" che spiega in parole semplici dove sono i dati (sul dispositivo), cosa NON facciamo (inviarli, venderli, profilarti) e bottone "Cancella tutto" con conferma.
- Header di sicurezza sul hosting: Content-Security-Policy severa (solo self), HSTS, `X-Content-Type-Options`, `Referrer-Policy: no-referrer`.
- Dipendenze npm minime e verificate; lockfile committato; build riproducibile.
- I link alle fonti aprono i siti ufficiali con `rel="noopener noreferrer"`.

## 10. Gestione errori

- **Dato mancante per una regola:** l'effetto compare come "non calcolabile: aggiungi [dato] al profilo" con scorciatoia per aggiungerlo. Mai errori silenziosi né numeri sbagliati.
- **Legge che non tocca il profilo:** messaggio chiaro + redirect propositivo verso "E per gli altri?".
- **Profilo salvato con schema vecchio:** migrazione automatica se possibile, altrimenti invito gentile a rifare il wizard (con spiegazione).
- **`localStorage` non disponibile** (modalità incognito restrittiva): l'app funziona in sola sessione e lo dichiara.
- **Offline:** la PWA funziona; i link alle fonti esterne mostrano "disponibile quando torni online".

## 11. Test

- **Motore (vitest):** per ogni legge, casi di test con profili tipo e valori attesi presi dalle fonti ufficiali (es. "dipendente, 28.000€ → +X€/mese al 1° anno, confidenza certa"). Test delle condizioni limite (fasce di confine, campi mancanti, profili vuoti).
- **Schema catalogo:** validazione zod di tutte le leggi in CI/build — una legge malformata rompe la build.
- **Accessibilità:** test automatici axe-core sulle 5 schermate + checklist manuale (tastiera, screen reader) prima di ogni release.
- **Flusso (Playwright):** percorso completo benvenuto → wizard → catalogo → report → empatia, su viewport mobile e desktop.

## 12. Roadmap dopo l'MVP

1. Capacitor → pubblicazione su Google Play Store (e in seguito App Store).
2. Aggiornamento del catalogo assistito da fonti ufficiali (Normattiva/dati.camera.it) con revisione umana obbligatoria.
3. Account opzionali e piani a pagamento per ONG, università, enti di ricerca e istituzioni (simulazioni di massa su profili sintetici, export, API) — modello freemium del business model: gratuito per sempre per la persona singola.
4. Più leggi, più Paesi, più lingue.
