import type { Legge } from '../../engine/types';

// Verificato da: ATTO CAMERA 3080 (XIX Legislatura), "Modifiche in materia di imputabilità
// del minore", disegno di legge d'iniziativa del Governo (MELONI, Presidente del Consiglio;
// NORDIO, Ministro della giustizia). Approvato dal Consiglio dei ministri il 23 luglio 2026
// (comunicato stampa n. 182), presentato alla Camera il 5 agosto 2026.
// Testo integrale: https://documenti.camera.it/apps/commonServices/getDocumento.ashx?sezione=lavori&tipoDoc=testo_pdl&idlegislatura=19&codice=leg.19.pdl.camera.3080.19PDL0211840
// Data verifica: 2026-09-01
//
// È il provvedimento che la stampa chiama "ddl anti maranza": quel nome non compare in
// nessun atto ufficiale, il titolo vero è "Modifiche in materia di imputabilità del minore".
//
// STATO REALE (non è legge): presentato il 5 agosto 2026, fase iter "Da assegnare" — non è
// ancora stato assegnato a una Commissione e nessuna delle due Camere lo ha esaminato.
// Lo modelliamo come PROPOSTA: tutte le regole hanno confidenza "dipende" e timeline incerta.
//
// Contenuti (dal testo ufficiale, tre articoli):
// - art. 1: all'articolo 98, primo comma, del codice penale è aggiunto in fine il periodo
//   «Nei casi di cui al primo periodo la capacità di intendere e di volere del minore si
//   presume fino a prova contraria». Non cambia l'età minima (restano i 14 anni dell'art. 97
//   c.p.) e non cambia la diminuzione di pena prevista per i minori imputabili.
// - art. 2: all'articolo 9 delle disposizioni sul processo penale minorile (DPR 448/1988)
//   al comma 1 sono soppresse le parole «l'imputabilità e» (cade quindi l'obbligo di
//   acquisire d'ufficio elementi personali, familiari, sociali e ambientali AI FINI
//   DELL'IMPUTABILITÀ); è inserito il comma 1-bis, per cui pubblico ministero e giudice
//   "possono altresì acquisire" quegli elementi ai fini del giudizio sull'imputabilità.
//   L'obbligo di accertamento resta per le altre finalità del comma 1 (personalità del
//   minore, misure da adottare).
// - art. 3: clausola di invarianza finanziaria (nessun costo per lo Stato).
//
// CONTROLLO ONESTO: qui NON esiste ancora un contrappeso istituzionale (niente assegnazione,
// niente audizioni, nessun dossier del Servizio Studi, nessun parere di Commissione). La
// relazione del Governo sostiene la tesi opposta a quella della regola sull'onere della
// prova: dice che la presunzione è "relativa", superabile, e cita il Code de la justice
// pénale des mineurs francese (2021), che presume il discernimento dai tredici anni. Le note
// riportano entrambe le letture e dichiarano quale è del Governo e quale di REF-LEX.
// TONO NEUTRO: REF-LEX dice cosa cambia e quali diritti tocca, non se è giusto o sbagliato.

const FONTE_TESTO = {
  etichetta: 'Atto Camera 3080 — testo integrale del disegno di legge (Camera dei deputati)',
  url: 'https://documenti.camera.it/apps/commonServices/getDocumento.ashx?sezione=lavori&tipoDoc=testo_pdl&idlegislatura=19&codice=leg.19.pdl.camera.3080.19PDL0211840'
};
const FONTE_ITER = {
  etichetta: 'Atto Camera 3080 — scheda e iter (Camera dei deputati)',
  url: 'https://www.camera.it/leg19/126?idDocumento=3080&leg=19'
};
const FONTE_CDM = {
  etichetta: 'Comunicato stampa del Consiglio dei ministri n. 182 del 23 luglio 2026 (Governo italiano)',
  url: 'https://www.governo.it/it/articolo/comunicato-stampa-del-consiglio-dei-ministri-n-182/32393'
};
const FONTE_DPR448 = {
  etichetta: 'DPR 22 settembre 1988, n. 448 — processo penale minorile, la norma che verrebbe modificata (Normattiva)',
  url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1988-09-22;448'
};
const FONTE_ART27 = {
  etichetta: 'Costituzione italiana, art. 27 — responsabilità penale e non colpevolezza (Senato della Repubblica)',
  url: 'https://www.senato.it/istituzione/la-costituzione/parte-i/titolo-i/articolo-27'
};
const FONTE_ART31 = {
  etichetta: 'Costituzione italiana, art. 31 — protezione della gioventù (Senato della Repubblica)',
  url: 'https://www.senato.it/istituzione/la-costituzione/parte-i/titolo-ii/articolo-31'
};

export const imputabilitaMinori: Legge = {
  id: 'ddl-imputabilita-minori-3080',
  titoloDivulgativo: 'Dai 14 anni si è ritenuti capaci di intendere e di volere, salvo prova contraria',
  titoloUfficiale: 'A.C. 3080 (XIX Leg.) — Modifiche in materia di imputabilità del minore',
  stato: 'discussione',
  ambiti: ['sicurezza-privacy', 'doveri'],
  fonti: [FONTE_TESTO, FONTE_ITER, FONTE_CDM, FONTE_DPR448, FONTE_ART27, FONTE_ART31],
  verificataIl: '2026-09-01',
  riassunto: 'È il provvedimento che i giornali chiamano "ddl anti maranza": il nome ufficiale è "Modifiche in materia di imputabilità del minore". Oggi, se un ragazzo tra i 14 e i 18 anni commette un reato, il giudice deve verificare caso per caso se era capace di intendere e di volere; se quella prova non c\'è, non è punibile. La proposta ribalta la regola: la capacità si presume, e tocca alla difesa dimostrare che mancava. L\'età minima resta 14 anni e resta lo sconto di pena per i minori. Presentata alla Camera il 5 agosto 2026, non è ancora assegnata a una Commissione.',
  regole: [
    {
      // effetto diretto sul destinatario della norma: chi ha tra 14 e 17 anni compiuti.
      id: 'imputabilita-minore-14-17',
      campiNecessari: ['eta'],
      condizioni: [
        { campo: 'eta', op: 'almeno', valore: 14 },
        { campo: 'eta', op: 'alPiu', valore: 17 }
      ],
      effetto: {
        tipo: 'dovere',
        descrizione: 'Hai tra i 14 e i 17 anni: sei l\'unica età a cui questa proposta parla direttamente. Oggi, se sei accusato di un reato, il giudice deve accertare positivamente, caso per caso, che eri capace di intendere e di volere nel momento del fatto: se quella prova non c\'è, non sei punibile. Con la modifica proposta all\'articolo 98 del codice penale, quella capacità si presume, e sei considerato imputabile a meno che dal processo emerga che ne eri privo. Non cambia l\'età minima, che resta 14 anni, e non cambia lo sconto di pena previsto per i minorenni imputabili. Cambia chi deve dimostrare cosa, e in un processo penale è una differenza che pesa.',
        breve: 'Da 14 a 17 anni saresti imputabile per presunzione, salvo dimostrare che non capivi.',
        direzione: 'negativo'
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'È solo una proposta: presentata alla Camera il 5 agosto 2026, risulta ancora "da assegnare" a una Commissione, quindi nessuna delle due Camere l\'ha esaminata e il testo può cambiare o fermarsi. Attenzione a due cose che la proposta NON fa: non abbassa l\'età dell\'imputabilità, che resta a 14 anni compiuti (articolo 97 del codice penale), e non tocca la riduzione di pena prevista per i minorenni.',
      fonteRegola: FONTE_TESTO
    },
    {
      // rovescio della medaglia sul processo: l'inversione dell'onere della prova e la caduta
      // dell'obbligo di indagine d'ufficio sull'imputabilità. Ancorata all'art. 27 Cost.
      id: 'imputabilita-onere-della-prova',
      campiNecessari: ['eta'],
      condizioni: [
        { campo: 'eta', op: 'almeno', valore: 14 },
        { campo: 'eta', op: 'alPiu', valore: 17 }
      ],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Effetto di riflesso sulle tue garanzie nel processo. Oggi l\'articolo 9 del DPR 448/1988 obbliga il pubblico ministero e il giudice ad acquisire d\'ufficio elementi sulla tua vita personale, familiare, sociale e ambientale anche per decidere sull\'imputabilità: è lo Stato che deve andare a cercarli. La proposta cancella le parole "l\'imputabilità e" da quell\'obbligo e le sposta in un nuovo comma dove pubblico ministero e giudice "possono" acquisirli. Insieme alla presunzione di capacità, il risultato è che l\'accertamento su quanto capivi non è più un passaggio dovuto: diventa qualcosa che la tua difesa deve sollevare e sostenere. L\'obbligo di indagine resta per le altre finalità della norma, cioè conoscere la tua personalità e scegliere le misure da adottare.',
        breve: 'L\'accertamento su quanto capivi non sarebbe più un passaggio obbligato: lo solleva la difesa.',
        direzione: 'negativo',
        indiretto: true,
        dirittoToccato: {
          carta: 'Costituzione italiana',
          articolo: 'art. 27',
          diritto: 'responsabilità penale personale e presunzione di non colpevolezza',
          intensita: 'sensibile',
          url: 'https://www.senato.it/istituzione/la-costituzione/parte-i/titolo-i/articolo-27'
        }
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'Qui ci sono due letture e vanno dette tutte e due. Quella del Governo, scritta nella relazione al disegno di legge: la presunzione è "relativa", non equipara il minore all\'adulto e resta sempre possibile escludere l\'imputabilità se dal processo emerge che il minore ne era privo; la relazione cita come precedente il Code de la justice pénale des mineurs francese, in vigore dal 2021, che presume il discernimento dai tredici anni. Quella di REF-LEX, che leggi qui sopra: spostare l\'onere della prova e trasformare un obbligo di indagine in una facoltà tocca l\'articolo 27 della Costituzione. Nessun ente si è ancora pronunciato: il disegno di legge non è stato assegnato a una Commissione, quindi non esistono audizioni, dossier del Servizio Studi né pareri ufficiali che diano ragione all\'una o all\'altra.',
      fonteRegola: FONTE_ART27
    },
    {
      // per chi ha figli minorenni a carico: l'effetto è indiretto ma concreto.
      id: 'imputabilita-genitori-di-minorenni',
      // il gancio su personeACarico evita di chiedere "chi hai a carico" a chi ha già
      // risposto di non avere nessuno a carico: senza, la regola resterebbe per sempre
      // "non calcolabile" e l'app chiederebbe un dato che il wizard non gli chiede più
      campiNecessari: ['personeACarico', 'tipiACarico'],
      condizioni: [
        { campo: 'personeACarico', op: 'eq', valore: true },
        { campo: 'tipiACarico', op: 'in', valore: ['figli-minorenni'] }
      ],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Hai figli minorenni a carico: la proposta non parla di te, ma di loro. Se tuo figlio ha compiuto 14 anni e venisse accusato di un reato, oggi lo Stato deve accertare che fosse capace di intendere e di volere prima di poterlo punire, e per farlo deve raccogliere d\'ufficio elementi sulla sua situazione personale, familiare, sociale e ambientale. Con questa modifica quella capacità si dà per presente, e diventa la difesa a dover dimostrare che mancava: può significare che tocca a voi come famiglia procurare relazioni, perizie e documenti che oggi il processo cerca da sé. Sotto i 14 anni non cambia nulla: il figlio non è imputabile in nessun caso.',
        breve: 'Se tuo figlio ha 14 anni o più, le prove sulla sua capacità toccherebbero alla difesa.',
        direzione: 'negativo',
        indiretto: true,
        dirittoToccato: {
          carta: 'Costituzione italiana',
          articolo: 'art. 31',
          diritto: 'protezione della gioventù e sostegno alla famiglia',
          intensita: 'lieve',
          url: 'https://www.senato.it/istituzione/la-costituzione/parte-i/titolo-ii/articolo-31'
        }
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'Proposta appena presentata e non ancora assegnata a una Commissione. Intensità "lieve" perché il testo non tocca né l\'età minima dei 14 anni né la riduzione di pena per i minorenni, e perché l\'obbligo per il giudice di conoscere la personalità del minore e di scegliere le misure adatte a lui resta scritto nell\'articolo 9 del DPR 448/1988: cade solo per la parte sull\'imputabilità.',
      fonteRegola: FONTE_DPR448
    }
  ]
};
