# REF-LEX

Simulatore dell'impatto delle leggi sulla tua vita. Anonimo: tutti i dati restano sul dispositivo.

## Comandi

- `npm install` — installa le dipendenze
- `npm run dev` — avvia in sviluppo (http://localhost:5173)
- `npm test` — esegue tutti i test
- `npm run build` — build di produzione in `dist/`
- `npm run preview` — serve la build di produzione in locale

## Regole del catalogo leggi

Ogni legge in `src/data/laws/` deve avere: fonti ufficiali verificate, regole con
confidenza dichiarata (certa/probabile/dipende), casi di test sui valori in `tests/data/`.
**Mai inventare un numero.** Vedi la spec in `docs/superpowers/specs/`.

## Principi

- Privacy by design: nessun dato personale lascia mai il dispositivo (niente account, cookie, tracker).
- Accessibilità WCAG 2.2 AA: test axe automatici su ogni schermata.
- Linguaggio semplice (terza media), niente emoji nell'interfaccia: solo icone SVG.
- Header di sicurezza per l'hosting statico in `public/_headers` (formato Netlify; per Vercel replicarli in `vercel.json` al momento del deploy).
