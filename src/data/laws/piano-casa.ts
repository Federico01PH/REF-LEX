import type { Legge } from '../../engine/types';

// Verificato da: DECRETO-LEGGE 7 maggio 2026, n. 66 «Disposizioni urgenti per il
// Piano Casa» (GU n. 104 del 7 maggio 2026), IN VIGORE dall'8 maggio 2026, convertito
// con modificazioni dalla LEGGE 2 luglio 2026, n. 116 (GU n. 152 del 3 luglio 2026).
// Testo ufficiale: Normattiva e Gazzetta Ufficiale.
// Data verifica: 2026-07-08
//
// Struttura (testo coordinato con la legge di conversione, 18 articoli in 4 Capi):
// - Art. 2: Programma straordinario nazionale di recupero degli alloggi ERP/ERS
//   (970 mln 2026-2030, gestione Invitalia).
// - Art. 4: Fondo di garanzia per la morosità incolpevole dei conduttori ERP
//   (22 mln 2026 + 2 mln 2027); copre canone e cauzione se il conduttore non riesce a
//   pagare per cause a lui non imputabili; il Fondo si surroga nei diritti del locatore.
// - Art. 4-bis: priorità nell'accesso al Fondo di garanzia per la prima casa alle
//   persone con disabilità grave (L. 104/1992) e ai nuclei con un convivente disabile;
//   garanzia 50% della quota capitale, elevabile all'80% per ISEE <= 40.000 €.
// - Art. 4-ter: incremento (8,5 mln 2026) del fondo per il contributo alle spese di
//   locazione degli studenti universitari fuori sede.
// - Art. 5: riscatto degli alloggi ERP esistenti; diritto di opzione all'acquisto per
//   l'assegnatario NON moroso che NON possiede un'altra abitazione.
// - Art. 6: edilizia residenziale sociale in locazione di lunga durata con facoltà di
//   riscatto progressiva (priorità a giovani, giovani coppie, genitori separati).
// - Art. 9: programmi di edilizia integrata per chi ha ISEE sopra i limiti ERP ma non
//   accede al mercato libero: >=70% convenzionata, prezzi/canoni calmierati di almeno
//   il 33% sotto le quotazioni OMI dell'Agenzia delle entrate, vincolo trentennale.
// - Art. 9-bis: alloggi di servizio dell'Arma dei carabinieri; potenziamento del
//   patrimonio immobiliare della Difesa per Forze armate e Guardia di finanza.
//
// CONTROLLO ONESTO: è una legge-cornice. Molte misure diventano operative solo con i
// decreti attuativi (una ventina, dai DM ai DPCM alle convenzioni) ancora da adottare:
// per questo gli effetti concreti sono per lo più 'dipende'/'probabile', non 'certi'.
// Le misure sugli inquilini ERP valgono per chi abita in una casa popolare: qui le
// intercettiamo in modo prudente da "affitto + ISEE basso", spiegando che sono per l'ERP.

const NORMATTIVA = 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legge:2026;66';
const fonteArt = (etichetta: string) => ({ etichetta, url: NORMATTIVA });

export const pianoCasa: Legge = {
  id: 'piano-casa-2026',
  titoloDivulgativo: 'Piano Casa: alloggi popolari, riscatto, aiuti a studenti, disabili e giovani',
  titoloUfficiale: 'Decreto-legge 7 maggio 2026, n. 66 «Disposizioni urgenti per il Piano Casa» (convertito dalla L. 2 luglio 2026, n. 116)',
  meseAnno: 'maggio 2026',
  stato: 'vigore',
  ambiti: ['casa', 'pensioni-welfare'],
  fonti: [
    { etichetta: 'Decreto-legge 7 maggio 2026, n. 66 «Piano Casa» (Normattiva)', url: NORMATTIVA },
    { etichetta: 'Testo pubblicato in Gazzetta Ufficiale n. 104 del 7 maggio 2026', url: 'https://www.gazzettaufficiale.it/eli/id/2026/05/07/26G00090/sg' },
    { etichetta: 'Legge di conversione 2 luglio 2026, n. 116 (Normattiva)', url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2026;116' }
  ],
  verificataIl: '2026-07-08',
  riassunto: 'Un decreto già in vigore (maggio 2026) sulla casa. Recupera alloggi popolari sfitti; protegge chi vive in una casa popolare e non riesce a pagare l\'affitto per cause non sue, e gli permette di riscattarla. Aiuta studenti fuori sede, persone con disabilità grave e famiglie con un disabile a trovare o comprare casa, e crea abitazioni a prezzo calmierato per giovani, genitori separati e redditi medi. Molte misure partono davvero solo con i decreti attuativi.',
  regole: [
    {
      // Art. 4 (morosità incolpevole) + Art. 5 (riscatto). Beneficiario: chi abita in ERP.
      // Non avendo un campo "casa popolare", lo intercettiamo da affitto + ISEE basso e lo
      // diciamo esplicitamente nel testo. 'dipende' anche per i decreti attuativi.
      id: 'pc-erp-inquilini',
      campiNecessari: ['abitazione', 'fasciaIsee'],
      condizioni: [
        { campo: 'abitazione', op: 'eq', valore: 'affitto' },
        { campo: 'fasciaIsee', op: 'in', valore: ['fino9360', 'da9360a15k', 'da15a25k'] }
      ],
      effetto: {
        tipo: 'servizio',
        descrizione: 'Se abiti in una casa popolare (edilizia residenziale pubblica), il decreto ti dà due tutele. La prima: un Fondo di garanzia contro la morosità incolpevole (art. 4) copre l\'affitto e la cauzione se non riesci a pagare per cause non tue, come la perdita del lavoro o una malattia; così è più difficile finire sotto sfratto per un periodo difficile. La seconda: un diritto di opzione all\'acquisto (art. 5) ti permette, se sei in regola con i pagamenti e non possiedi già un\'altra casa, di riscattare l\'alloggio in cui vivi e diventarne proprietario. Sono misure pensate per gli alloggi pubblici: se sei in un affitto privato non valgono, e i dettagli (quote, prezzi, tempi) arriveranno con i decreti attuativi.',
        breve: 'Se sei in una casa popolare: scudo contro la morosità incolpevole e diritto a riscattare l\'alloggio.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'incerto', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'dipende',
      noteConfidenza: 'Vale per gli assegnatari di edilizia residenziale pubblica (casa popolare); il riscatto richiede di essere non morosi e di non possedere un\'altra abitazione. Le regole operative sono rinviate a un decreto interministeriale (art. 4 e art. 5).',
      fonteRegola: fonteArt('Art. 4 e 5 del D.L. 66/2026 (morosità incolpevole e riscatto ERP)')
    },
    {
      // Art. 4-ter: incremento del fondo per il contributo affitto agli studenti fuori sede.
      id: 'pc-studenti-fuorisede',
      campiNecessari: ['condizioneLavorativa', 'abitazione'],
      condizioni: [
        { campo: 'condizioneLavorativa', op: 'in', valore: ['studente'] },
        { campo: 'abitazione', op: 'eq', valore: 'affitto' }
      ],
      effetto: {
        tipo: 'economico',
        descrizione: 'Se sei uno studente universitario fuori sede (studi in una città diversa da quella dove risiedi) e vivi in affitto, il decreto aumenta di 8,5 milioni di euro per il 2026 il fondo che rimborsa una parte delle spese di affitto. Non è un assegno automatico: si ottiene facendo domanda al bando, di solito in base all\'ISEE e alla graduatoria. Se non sei fuori sede, questa misura non ti riguarda.',
        breve: 'Se studi fuori sede e sei in affitto, più fondi per il contributo sulle spese di affitto.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'attivo', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'L\'incremento è per l\'anno 2026 e riguarda solo gli studenti universitari fuori sede in affitto; il contributo si ottiene tramite bando e graduatoria per ISEE, quindi non è garantito a tutti.',
      fonteRegola: fonteArt('Art. 4-ter del D.L. 66/2026 (contributo affitto studenti fuori sede)')
    },
    {
      // Art. 4-bis: priorità sul Fondo di garanzia per la prima casa a chi ha disabilità grave.
      id: 'pc-disabilita-primacasa',
      campiNecessari: ['disabilita'],
      condizioni: [{ campo: 'disabilita', op: 'in', valore: ['motoria', 'visiva', 'uditiva', 'intellettiva', 'malattia-cronica'] }],
      effetto: {
        tipo: 'servizio',
        descrizione: 'Se hai una disabilità grave riconosciuta (ai sensi della legge 104/1992), il decreto ti mette tra le categorie prioritarie del Fondo di garanzia per la prima casa: lo Stato fa da garante con la banca per una parte del mutuo, così è più facile ottenerlo. La garanzia copre il 50% della quota capitale, che sale fino all\'80% se il tuo ISEE non supera i 40.000 euro all\'anno. Serve comunque avere i requisiti della banca per il mutuo.',
        breve: 'Con una disabilità grave, priorità sul Fondo garanzia mutuo prima casa (fino all\'80% se ISEE ≤ 40.000).',
        direzione: 'positivo'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'probabile',
      noteConfidenza: 'La priorità riguarda la disabilità grave accertata ai sensi della legge 104/1992; opera attraverso il Fondo di garanzia per la prima casa già esistente, con dotazione incrementata (art. 4-bis).',
      fonteRegola: fonteArt('Art. 4-bis del D.L. 66/2026 (priorità Fondo prima casa, disabilità grave)')
    },
    {
      // Art. 4-bis: stessa priorità per i nuclei con un convivente disabile.
      id: 'pc-familiare-disabile-primacasa',
      campiNecessari: ['personeACarico', 'tipiACarico'],
      // il gancio su personeACarico evita di chiedere "chi hai a carico" a chi ha già
      // detto di non averne: per loro la regola è semplicemente non applicabile
      condizioni: [
        { campo: 'personeACarico', op: 'eq', valore: true },
        { campo: 'tipiACarico', op: 'in', valore: ['familiare-disabile'] }
      ],
      effetto: {
        tipo: 'servizio',
        descrizione: 'Se nella tua famiglia convive una persona con disabilità, il decreto vi include tra le categorie prioritarie del Fondo di garanzia per la prima casa: lo Stato garantisce alla banca una parte del mutuo (il 50% della quota capitale, fino all\'80% se l\'ISEE non supera i 40.000 euro), rendendo più facile ottenerlo per comprare casa.',
        breve: 'Se convivi con un familiare disabile, priorità sul Fondo garanzia mutuo prima casa.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'probabile',
      noteConfidenza: 'La misura cita espressamente i nuclei familiari con un convivente disabile; opera tramite il Fondo di garanzia per la prima casa (art. 4-bis).',
      fonteRegola: fonteArt('Art. 4-bis del D.L. 66/2026 (priorità Fondo prima casa, nuclei con disabile)')
    },
    {
      // Art. 6: edilizia sociale in affitto lungo con riscatto, priorità ai giovani.
      id: 'pc-giovani-casa',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'alPiu', valore: 35 }],
      effetto: {
        tipo: 'servizio',
        descrizione: 'Se sei giovane, il decreto punta a creare nuove case di edilizia sociale: alloggi in affitto di lunga durata a canone calmierato, con la possibilità di riscattarli poco alla volta fino a diventarne proprietario (art. 6). La priorità è per giovani, giovani coppie e genitori separati. È un modello nuovo: quanti alloggi e dove dipenderà dalle convenzioni con i Comuni e dai fondi disponibili, quindi si vedrà soprattutto negli anni.',
        breve: 'Se sei giovane, nuove case sociali in affitto lungo con possibilità di riscattarle nel tempo.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'dipende',
      noteConfidenza: 'L\'edilizia sociale con riscatto (art. 6) è una cornice: la disponibilità reale dipende dalle convenzioni con i Comuni e dalle risorse. Priorità a giovani, giovani coppie e genitori separati.',
      fonteRegola: fonteArt('Art. 6 del D.L. 66/2026 (locazione sociale con riscatto)')
    },
    {
      // Art. 6: stessa misura per i genitori separati non più giovani (i giovani sono già coperti).
      id: 'pc-separati-casa',
      campiNecessari: ['statoCivile', 'figli', 'eta'],
      condizioni: [
        { campo: 'statoCivile', op: 'eq', valore: 'separato' },
        { campo: 'figli', op: 'almeno', valore: 1 },
        { campo: 'eta', op: 'almeno', valore: 36 }
      ],
      effetto: {
        tipo: 'servizio',
        descrizione: 'Da genitore separato con figli, dopo una separazione trovare casa è spesso la difficoltà più grande. Il decreto ti mette tra le categorie prioritarie della nuova edilizia sociale in affitto di lunga durata con riscatto (art. 6): alloggi a canone calmierato che puoi arrivare a comprare un po\' alla volta. Come per i giovani, la disponibilità concreta dipenderà dalle convenzioni con i Comuni.',
        breve: 'Da genitore separato, priorità per le nuove case sociali in affitto con riscatto.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'dipende',
      noteConfidenza: 'Stessa misura dell\'art. 6: i genitori separati sono una categoria prioritaria esplicita. Qui la mostriamo a chi ha più di 35 anni per non ripetere l\'effetto già visto dai più giovani.',
      fonteRegola: fonteArt('Art. 6 del D.L. 66/2026 (locazione sociale con riscatto, genitori separati)')
    },
    {
      // Art. 9: edilizia integrata per chi sta sopra le soglie ERP ma non regge il mercato.
      id: 'pc-isee-medio-integrata',
      campiNecessari: ['fasciaIsee'],
      condizioni: [{ campo: 'fasciaIsee', op: 'in', valore: ['da25a40k'] }],
      effetto: {
        tipo: 'servizio',
        descrizione: 'Con un ISEE medio sei in una zona scomoda: troppo "ricco" per la casa popolare, ma con prezzi di mercato spesso fuori portata. Il decreto crea i programmi di edilizia integrata (art. 9): nuovi quartieri in cui almeno il 70% degli alloggi è convenzionato, con prezzi di vendita o canoni di affitto calmierati di almeno il 33% sotto le quotazioni di mercato dell\'Agenzia delle entrate, e un vincolo di trent\'anni che li mantiene accessibili. È rivolto proprio a chi ha redditi medi.',
        breve: 'Con ISEE medio, case a prezzo o affitto calmierato di almeno il 33% sotto il mercato (edilizia integrata).',
        direzione: 'positivo'
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'dipende',
      noteConfidenza: 'L\'edilizia integrata (art. 9) è rivolta a chi ha ISEE sopra i limiti dell\'edilizia pubblica ma non accede al mercato libero; la realizzazione dipende dai programmi presentati dai privati e dalle convenzioni con i Comuni.',
      fonteRegola: fonteArt('Art. 9 del D.L. 66/2026 (programmi di edilizia integrata)')
    },
    {
      // Art. 9-bis: alloggi di servizio Carabinieri + potenziamento patrimonio Difesa (FFAA, GdF).
      // Usa il mestiere scritto in chiaro (settore forze-ordine).
      id: 'pc-forze-ordine-alloggi',
      campiNecessari: ['settoriProfessionali'],
      condizioni: [{ campo: 'settoriProfessionali', op: 'in', valore: ['forze-ordine'] }],
      effetto: {
        tipo: 'servizio',
        descrizione: 'Se lavori nelle forze dell\'ordine o nelle Forze armate, il decreto interviene anche sugli alloggi di servizio: nuove regole e risorse per gli alloggi dell\'Arma dei carabinieri (art. 9-bis) e per il potenziamento del patrimonio immobiliare della Difesa, utile a chi presta servizio lontano da casa (Forze armate e Guardia di finanza). Le condizioni e le rette dipenderanno dai regolamenti attuativi.',
        breve: 'Nelle forze dell\'ordine o armate: nuovi alloggi di servizio (Arma dei carabinieri, Difesa).',
        direzione: 'positivo'
      },
      timeline: { anno1: 'incerto', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'dipende',
      noteConfidenza: 'Riguarda in particolare Carabinieri, Forze armate e Guardia di finanza (alloggi di servizio); criteri di concessione e rette sono rinviati a un regolamento (art. 9-bis).',
      fonteRegola: fonteArt('Art. 9-bis del D.L. 66/2026 (alloggi di servizio e patrimonio della Difesa)')
    }
  ]
};
