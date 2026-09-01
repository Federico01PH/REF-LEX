import type { Legge } from '../../engine/types';

// Verificato da: REGOLAMENTO (UE) 2026/1744 del Parlamento europeo e del Consiglio
// dell'8 luglio 2026, «che modifica i regolamenti (UE) 2024/1689, (UE) 2018/1139 e
// (UE) 2023/1230 per quanto riguarda la semplificazione dell'attuazione di regole armonizzate
// sull'intelligenza artificiale (Omnibus digitale sull'IA)».
// Pubblicato nella GUUE, serie L, il 24 luglio 2026; entra in vigore il terzo giorno
// successivo alla pubblicazione, cioè il 27 luglio 2026 (art. 4).
// Testo integrale letto su EUR-Lex il 2026-09-01:
// https://eur-lex.europa.eu/legal-content/IT/TXT/HTML/?uri=OJ:L_202601744
//
// È un REGOLAMENTO UE: obbligatorio in tutti i suoi elementi e direttamente applicabile in
// ogni Stato membro, Italia compresa, senza bisogno di una legge italiana di recepimento.
// Per questo le regole hanno confidenza "certa": non dipendono dal Parlamento italiano.
//
// Cosa cambia davvero nell'AI Act (Reg. UE 2024/1689), dal testo:
// - NUOVI DIVIETI (art. 5, par. 1, lettere b bis e b ter, inseriti dal punto 7): è vietato
//   immettere sul mercato, mettere in servizio o usare un sistema di IA che genera o manipola
//   immagini, video, audio o materiale analogo delle parti intime di una persona fisica
//   riconoscibile, o di una persona riconoscibile che partecipi ad atti sessualmente
//   espliciti, senza il suo consenso liberamente prestato, specifico, informato e
//   inequivocabile; ed è vietato il sistema che genera o manipola materiale o spettacoli ai
//   sensi dell'art. 2, lettere c) ed e), della direttiva 2011/93/UE (materiale
//   pedopornografico), salvo cause di giustificazione previste dal diritto nazionale.
//   Nuovi paragrafi 1 bis e 1 ter: l'immissione sul mercato è vietata solo se quella
//   generazione è la finalità prevista del sistema oppure ne è un risultato ragionevolmente
//   prevedibile e riproducibile senza modifiche tecniche significative e il sistema non ha
//   misure di sicurezza ragionevoli; l'USO è vietato se il deployer lo impiega proprio per
//   generare quel materiale; non è "manipolazione" un ritocco che non aumenta l'esposizione
//   delle parti intime né altera la natura degli atti ritratti.
//   Questi due divieti si applicano dal 2 DICEMBRE 2026 (art. 113, terzo comma, lett. a),
//   come sostituita dal punto 40).
// - RINVIO DELLE TUTELE SUI SISTEMI AD ALTO RISCHIO (punto 40, lett. b): il capo III,
//   sezioni 1, 2 e 3 si applica dal 2 DICEMBRE 2027 per i sistemi ad alto rischio dell'art. 6
//   par. 2 e dell'allegato III (fra cui occupazione e gestione dei lavoratori, istruzione,
//   accesso a servizi essenziali e al credito) e dal 2 AGOSTO 2028 per quelli dell'art. 6
//   par. 1 e dell'allegato I (IA dentro i prodotti). La data precedente era il 2 agosto 2026.
//   Inoltre (punto 39, lett. a) i sistemi ad alto rischio già sul mercato e destinati alle
//   autorità pubbliche devono conformarsi entro il 2 agosto 2030.
// - MARCATURA DEI CONTENUTI SINTETICI (punto 39, lett. b, nuovo art. 111 par. 4): chi fornisce
//   sistemi di IA, compresi quelli per finalità generali, che generano audio, immagini, video
//   o testi sintetici e li ha immessi sul mercato PRIMA del 2 agosto 2026 deve adeguarsi
//   all'art. 50 par. 2 (marcatura leggibile dalla macchina) entro il 2 DICEMBRE 2026.
//   Il punto 20 riscrive l'art. 50 par. 7 sui codici di buone pratiche per rilevazione,
//   marcatura ed etichettatura, con potere della Commissione di imporre norme comuni con atto
//   di esecuzione se i codici non bastano.
// - DATI SENSIBILI PER CORREGGERE LE DISTORSIONI (punto 6, nuovo art. 4 bis): i fornitori di
//   sistemi ad alto rischio possono eccezionalmente trattare categorie particolari di dati
//   personali per rilevare e correggere le distorsioni, ma solo se non bastano dati sintetici
//   o anonimizzati, con pseudonimizzazione, limiti tecnici al riutilizzo, controlli e
//   documentazione degli accessi, divieto di trasmissione a terzi e cancellazione a
//   correzione avvenuta o a fine conservazione.
// - ALFABETIZZAZIONE IN MATERIA DI IA (punto 5, art. 4 riscritto): fornitori e deployer
//   adottano misure per l'alfabetizzazione del personale, ma «tale obbligo non impone ai
//   fornitori o ai deployer di garantire un livello specifico di alfabetizzazione in materia
//   di IA per alcuna persona».
// - PMI E PICCOLE IMPRESE A MEDIA CAPITALIZZAZIONE: sistema di gestione della qualità
//   semplificato per le PMI senza imprese associate o collegate (punto 26, art. 63 par. 1);
//   spazio di sperimentazione normativa a livello UE con accesso prioritario per PMI,
//   start-up e piccole imprese a media capitalizzazione (punto 22); sanzioni pecuniarie
//   limitate al minore tra percentuale e importo fisso per le piccole imprese a media
//   capitalizzazione (punto 38, art. 99 par. 6 bis).
//
// L'AI Act resta in catalogo come legge a sé: qui modelliamo che cosa cambia rispetto a
// quella scheda. TONO NEUTRO: nuove tutele e tutele rinviate stanno nello stesso testo, e
// vengono dette entrambe.

const FONTE = {
  etichetta: 'Regolamento (UE) 2026/1744 — Omnibus digitale sull\'IA, testo integrale (EUR-Lex)',
  url: 'https://eur-lex.europa.eu/legal-content/IT/TXT/HTML/?uri=OJ:L_202601744'
};
const FONTE_ELI = {
  etichetta: 'Regolamento (UE) 2026/1744 — scheda dell\'atto (EUR-Lex)',
  url: 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:32026R1744'
};
const FONTE_AI_ACT = {
  etichetta: 'Regolamento (UE) 2024/1689 — AI Act, il testo modificato (EUR-Lex)',
  url: 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:32024R1689'
};
const FONTE_CARTA = {
  etichetta: 'Carta dei diritti fondamentali dell\'Unione europea (EUR-Lex)',
  url: 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:12012P/TXT'
};

export const digitalOmnibusAi: Legge = {
  id: 'reg-ue-2026-1744-omnibus-ia',
  titoloDivulgativo: 'Omnibus digitale sull\'IA: vietati i deepfake intimi, rinviate le tutele su lavoro e scuola',
  titoloUfficiale: 'Regolamento (UE) 2026/1744 — modifiche al regolamento (UE) 2024/1689 sull\'intelligenza artificiale (Omnibus digitale sull\'IA)',
  meseAnno: 'luglio 2026',
  stato: 'vigore',
  ambiti: ['sicurezza-privacy', 'fisco-lavoro', 'scuola-universita-ricerca'],
  origine: 'europea',
  fonti: [FONTE, FONTE_ELI, FONTE_AI_ACT, FONTE_CARTA],
  verificataIl: '2026-09-01',
  riassunto: 'L\'Europa ha corretto l\'AI Act. Da una parte aggiunge due divieti nuovi, in vigore dal 2 dicembre 2026: niente sistemi di IA fatti per creare immagini o video sessuali di una persona riconoscibile senza il suo consenso, né materiale pedopornografico. Dall\'altra rinvia le tutele piene sui sistemi che decidono su di te — assunzioni, scuola, credito, servizi — dal 2 agosto 2026 al 2 dicembre 2027, e al 2 agosto 2028 per l\'IA dentro i prodotti. In più: entro il 2 dicembre 2026 i contenuti creati dall\'IA già sul mercato vanno marcati.',
  regole: [
    {
      // nuovi divieti: valgono per chiunque possa esserne vittima. Soglia 13 anni come per
      // l'AI Act: sotto quell'età l'app non profila comunque.
      id: 'omnibus-divieto-deepfake-intimi',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 13 }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Dal 2 dicembre 2026 è vietato in tutta Europa mettere sul mercato, attivare o usare un sistema di intelligenza artificiale che genera o manipola immagini, video, audio o materiale simile delle parti intime di una persona riconoscibile, o che la mostra in atti sessualmente espliciti, senza un suo consenso libero, specifico, informato e inequivocabile. È vietato allo stesso modo un sistema che genera materiale pedopornografico. Il divieto colpisce chi costruisce e vende questi sistemi quando servono proprio a questo, o quando il risultato è prevedibile e ottenibile senza modifiche tecniche significative e mancano protezioni ragionevoli; e colpisce chi li usa per creare quel materiale. Non conta come manipolazione un ritocco che non aumenta l\'esposizione delle parti intime e non cambia la natura degli atti ritratti.',
        breve: 'Dal 2 dicembre 2026 vietata in Europa l\'IA che crea immagini sessuali di te senza il tuo consenso.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa',
      noteConfidenza: 'È un regolamento europeo già in vigore dal 27 luglio 2026: vale direttamente in Italia, senza bisogno di una legge italiana. La data del 2 dicembre 2026 è quella che il testo fissa per l\'entrata in applicazione di questi due divieti. Attenzione a cosa il divieto NON copre: riguarda i sistemi di IA e chi li fornisce o li usa per generare quel materiale, non sostituisce i reati già previsti dal codice penale italiano per la diffusione di immagini sessuali senza consenso.',
      fonteRegola: FONTE
    },
    {
      // marcatura dei contenuti sintetici già sul mercato: art. 111 par. 4 nuovo.
      id: 'omnibus-marcatura-contenuti-ia',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 13 }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Chi fornisce sistemi di intelligenza artificiale che producono audio, immagini, video o testi artificiali e li aveva già sul mercato prima del 2 agosto 2026 ha tempo fino al 2 dicembre 2026 per adeguarsi all\'obbligo di marcare quei contenuti in un formato leggibile dalle macchine. In pratica è la regola che permette a piattaforme, motori di ricerca e strumenti di verifica di riconoscere che un contenuto è stato generato da un\'IA anche quando a occhio non si vede. La Commissione europea deve favorire codici di buone pratiche su rilevazione, marcatura ed etichettatura, e se quei codici non bastano può imporre regole comuni con un proprio atto.',
        breve: 'Entro il 2 dicembre 2026 anche i sistemi già esistenti devono marcare i contenuti creati dall\'IA.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa',
      noteConfidenza: 'La marcatura è pensata per essere letta dalle macchine: non garantisce da sola che tu veda un\'etichetta visibile su ogni immagine o video. L\'obbligo riguarda chi fornisce il sistema, non chi pubblica il contenuto.',
      fonteRegola: FONTE
    },
    {
      // il rinvio pesa su chi può finire davanti a una decisione automatica: lavoro,
      // ricerca di lavoro, scuola, accesso a servizi essenziali e credito.
      id: 'omnibus-rinvio-tutele-alto-rischio',
      campiNecessari: ['condizioneLavorativa'],
      condizioni: [{
        campo: 'condizioneLavorativa', op: 'in',
        valore: ['dipendente-privato', 'dipendente-pubblico', 'disoccupato', 'studente']
      }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Le tutele piene sull\'intelligenza artificiale ad alto rischio — quella usata per selezionarti in un\'assunzione, valutarti sul lavoro o a scuola, decidere su un prestito o sull\'accesso a un servizio essenziale — dovevano scattare il 2 agosto 2026. Questo regolamento le sposta al 2 dicembre 2027, e al 2 agosto 2028 per l\'IA incorporata nei prodotti. Fino ad allora restano validi solo i divieti già in vigore e gli obblighi di trasparenza: non sono ancora obbligatorie la supervisione umana, la qualità dei dati e le procedure di reclamo previste per questi sistemi. C\'è anche un caso particolare: i sistemi ad alto rischio già sul mercato e destinati alle autorità pubbliche hanno tempo fino al 2 agosto 2030. Restano comunque validi i tuoi diritti sui dati personali, che vengono dal GDPR e non da questo regolamento.',
        breve: 'Le tutele piene quando un\'IA decide su lavoro, scuola o credito slittano dal 2026 al dicembre 2027.',
        direzione: 'negativo'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa',
      noteConfidenza: 'Il rinvio è scritto nel testo, non è un\'ipotesi: il regolamento sostituisce le date dell\'articolo 113 dell\'AI Act. Le ragioni dichiarate nei considerando sono il ritardo nella preparazione delle norme tecniche e dei sistemi nazionali di controllo, e un onere di adeguamento risultato più pesante del previsto. Il testo afferma di non voler ridurre il livello di protezione: sposta le date, non cancella gli obblighi.',
      fonteRegola: FONTE
    },
    {
      // semplificazioni per chi fa impresa: PMI, start-up e piccole imprese a media
      // capitalizzazione. Il forfettario e l'autonomo ordinario ci rientrano.
      id: 'omnibus-semplificazioni-imprese',
      campiNecessari: ['condizioneLavorativa'],
      condizioni: [{
        campo: 'condizioneLavorativa', op: 'in',
        valore: ['autonomo-ordinario', 'forfettario', 'imprenditore']
      }],
      effetto: {
        tipo: 'dovere',
        descrizione: 'Se lavori in proprio o hai un\'impresa e usi o sviluppi intelligenza artificiale, questo regolamento alleggerisce alcuni adempimenti. Le piccole e medie imprese senza imprese associate o collegate possono rispettare in modo semplificato una parte del sistema di gestione della qualità, e la Commissione europea deve pubblicare linee guida su quali elementi si semplificano. Viene creato uno spazio di sperimentazione a livello europeo con accesso prioritario per PMI, start-up e piccole imprese a media capitalizzazione, e ogni Stato deve averne uno nazionale operativo entro il 2 agosto 2027. Per le piccole imprese a media capitalizzazione le multe non possono superare il minore fra la percentuale del fatturato e l\'importo fisso previsti. Resta l\'obbligo di formare chi lavora con l\'IA, ma il testo chiarisce che non devi garantire a nessuno un livello specifico di preparazione: la Commissione pubblicherà esempi pratici di come rispettarlo.',
        breve: 'Se hai un\'impresa: adempimenti più leggeri sull\'IA, sperimentazione agevolata e multe con un tetto.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa',
      noteConfidenza: 'Le semplificazioni riguardano il modo di dimostrare la conformità, non il livello di protezione richiesto: gli obblighi restano, cambia quanto lavoro burocratico serve per rispettarli. Il tetto alle sanzioni vale per le piccole imprese a media capitalizzazione, categoria definita dalla raccomandazione (UE) 2025/1099, non per tutte le imprese.',
      fonteRegola: FONTE
    },
    {
      // effetto indiretto sui diritti: il rinvio lascia scoperto un anno e mezzo, e il nuovo
      // art. 4 bis apre al trattamento di dati sensibili, sia pure con paletti stretti.
      id: 'omnibus-dati-e-tutele-indiretto',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 13 }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Effetto di riflesso sui tuoi dati e sulle tue tutele. Da un lato il regolamento allunga di oltre un anno il periodo in cui un sistema di IA può valutarti per un lavoro, un prestito o un percorso di studi senza che siano ancora obbligatorie la supervisione umana e le procedure di reclamo dell\'AI Act. Dall\'altro introduce un articolo nuovo che permette a chi sviluppa sistemi ad alto rischio di trattare, in via eccezionale, categorie particolari di dati personali — quelli su salute, origine etnica, opinioni, religione, vita sessuale — al solo scopo di scoprire e correggere le distorsioni dei sistemi. I paletti sono stretti e scritti nel testo: si può fare solo se dati sintetici o anonimizzati non bastano, con pseudonimizzazione, limiti tecnici al riutilizzo, accessi controllati e documentati, divieto di passare quei dati a terzi e cancellazione una volta corretta la distorsione.',
        breve: 'Più tempo senza tutele piene, e dati sensibili trattabili per correggere le distorsioni dell\'IA.',
        direzione: 'misto',
        indiretto: true,
        dirittoToccato: {
          carta: 'Carta UE dei diritti fondamentali',
          articolo: 'artt. 7 e 8',
          diritto: 'vita privata e protezione dei dati personali',
          intensita: 'lieve',
          url: 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:12012P/TXT'
        }
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa',
      noteConfidenza: 'Intensità "lieve" e non di più per due motivi scritti nel testo: il trattamento dei dati sensibili è ammesso solo se strettamente necessario e con garanzie elencate una per una, e il regolamento lascia espressamente impregiudicati il GDPR e le altre norme europee sulla protezione dei dati. Il punto discutibile è soprattutto il tempo: fino al 2 dicembre 2027 le tutele piene sui sistemi ad alto rischio non sono ancora esigibili.',
      fonteRegola: FONTE
    }
  ]
};
