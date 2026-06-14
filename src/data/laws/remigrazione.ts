import type { Legge } from '../../engine/types';

// Verified from: proposta di legge di iniziativa popolare "Remigrazione e Riconquista"
// (testo depositato, 24 articoli) + portale del Ministero della Giustizia per la raccolta
// firme delle iniziative popolari. Verification date: 2026-06-15.
//
// ATTENZIONE alla parola "referendum": qui NON c'è un referendum. È una LEGGE DI INIZIATIVA
// POPOLARE (art. 71 Cost.): un comitato (CasaPound, Rete dei Patrioti e altri gruppi) ha
// raccolto online le firme dei cittadini. Il "quorum raggiunto" sono le 50.000 firme minime
// previste dalla legge per poter depositare la proposta in Parlamento: superate in poche ore
// sul portale del Ministero della Giustizia. Raggiungere le firme NON significa che la legge
// sia approvata: la proposta arriva alle Camere, che la possono discutere, modificare,
// bocciare o ignorare. Per questo: stato "discussione", ogni orizzonte "incerto",
// confidenza "dipende". REF-LEX segnala il tema e gli effetti possibili, non dice come votare.
//
// Contenuto principale (per chi vive in Italia):
// - programma nazionale di "Remigrazione": rientro volontario assistito degli stranieri
//   regolari, con incentivo economico ma con un "Patto" che vieta il reingresso e prevede la
//   restituzione dei fondi e sanzioni penali in caso di rientro non autorizzato (artt. 10-13);
// - abrogazione del decreto flussi: ingresso di lavoratori extra-UE solo "residuale" (art. 15);
// - revisione del ricongiungimento familiare e abolizione della protezione speciale (art. 9);
// - espulsione obbligatoria dello straniero condannato + divieto di rientro (art. 6);
// - revoca della cittadinanza acquisita per naturalizzazione in caso di condanne gravi (art. 7);
// - tassa del 3% sulle rimesse inviate all'estero, per finanziare il Fondo Remigrazione (art. 13);
// - sanzioni e confische per le imprese che impiegano stranieri irregolari; incentivi a chi
//   assume solo regolari (artt. 3-4);
// - Fondo per la Natalità Italiana: bonus nascita, asili nido gratuiti, mutui e affitti
//   calmierati riservati in via prioritaria alle famiglie con genitori entrambi italiani; il
//   Fondo però parte solo se la remigrazione produce almeno 500 milioni di risparmi (art. 17).

const FONTE = {
  etichetta: 'Ministero della Giustizia — raccolta firme per referendum e iniziative popolari',
  url: 'https://firmereferendum.giustizia.it/referendum/open'
};
const FONTE_CAMERA = {
  etichetta: 'Camera dei deputati — proposte di legge di iniziativa popolare',
  url: 'https://www.camera.it/leg19/1334'
};

const ART3_COST = 'https://www.senato.it/istituzione/la-costituzione/principi-fondamentali/articolo-3';
const ART10_COST = 'https://www.senato.it/istituzione/la-costituzione/principi-fondamentali/articolo-10';
const ART22_COST = 'https://www.senato.it/istituzione/la-costituzione/parte-i/titolo-i/articolo-22';

export const remigrazione: Legge = {
  id: 'remigrazione-riconquista-2026',
  titoloDivulgativo: 'Remigrazione e Riconquista: la proposta di legge popolare sui migranti',
  titoloUfficiale: 'Proposta di legge di iniziativa popolare "Remigrazione e Riconquista" — Disposizioni in materia di governo dei flussi migratori, programma nazionale di Remigrazione e Fondo per la Natalità italiana',
  stato: 'discussione',
  ambiti: ['sicurezza-privacy', 'politica-voto', 'fisco-lavoro', 'pensioni-welfare'],
  fonti: [FONTE, FONTE_CAMERA],
  verificataIl: '2026-06-15',
  riassunto: 'Una proposta di legge di iniziativa popolare (promossa da CasaPound, Rete dei Patrioti e altri gruppi) che in poche ore ha superato le 50.000 firme necessarie per arrivare in Parlamento. Non è un referendum e non è ancora legge: dovrà essere discussa e votata. Prevede un programma di "remigrazione" per il rientro degli stranieri, lo stop al decreto flussi, espulsioni e revoca della cittadinanza per chi commette reati, una tassa sulle rimesse inviate all\'estero e un fondo per la natalità riservato in via prioritaria alle famiglie italiane.',
  regole: [
    {
      id: 'remigrazione-ingresso-flussi',
      campiNecessari: ['cittadinanza'],
      condizioni: [{ campo: 'cittadinanza', op: 'eq', valore: 'extra-ue' }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'SE la proposta diventasse legge: viene abrogato il "decreto flussi", cioè la programmazione annuale degli ingressi per lavoro. L\'ingresso di lavoratori extra-UE sarebbe consentito solo in casi "residuali" e documentati, con priorità ai lavoratori europei. Per chi è extra-UE diventerebbe più difficile entrare per lavoro o far entrare familiari dall\'estero.',
        direzione: 'negativo'
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'È una proposta non ancora discussa né votata. L\'abrogazione del decreto flussi (art. 3 del d.lgs. 286/1998) e le regole sull\'ingresso dipendono anche dal rispetto del diritto dell\'Unione europea sulla libera circolazione e sui ricongiungimenti.',
      fonteRegola: FONTE
    },
    {
      id: 'remigrazione-programma-rientro',
      campiNecessari: ['cittadinanza'],
      condizioni: [{ campo: 'cittadinanza', op: 'eq', valore: 'extra-ue' }],
      effetto: {
        tipo: 'servizio',
        descrizione: 'SE la proposta diventasse legge: nasce un programma di "remigrazione", cioè rientro volontario assistito nel Paese di origine, con un incentivo economico, formazione e supporto. In cambio si firma un "Patto" che vieta di rientrare in Italia (salvo permessi temporanei) e prevede la restituzione dei fondi e sanzioni penali in caso di rientro non autorizzato. Per chi la sostiene è un aiuto a chi vuole tornare; per chi la critica è una spinta a far andare via gli stranieri.',
        direzione: 'misto'
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'L\'adesione sarebbe volontaria e aperta agli extracomunitari regolari da almeno 12 mesi, ai richiedenti asilo che rinunciano alla domanda e ai titolari di permessi in scadenza. La proposta deve ancora essere votata.',
      fonteRegola: FONTE
    },
    {
      id: 'remigrazione-tassa-rimesse',
      campiNecessari: ['cittadinanza'],
      condizioni: [{ campo: 'cittadinanza', op: 'eq', valore: 'extra-ue' }],
      effetto: {
        tipo: 'economico',
        descrizione: 'SE la proposta diventasse legge: chi invia denaro (rimesse) verso l\'estero pagherebbe una tassa del 3% su quanto manda, per finanziare il Fondo per la Remigrazione. Se mandi soldi alla tua famiglia nel Paese di origine, ti costerebbe il 3% in più ogni volta.',
        direzione: 'negativo'
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'Quanto pesa dipende da quanto denaro invii all\'estero, dato che non ti chiediamo. Una tassa applicata solo alle rimesse potrebbe inoltre essere contestata come discriminatoria: la proposta deve ancora essere discussa.',
      fonteRegola: FONTE
    },
    {
      id: 'remigrazione-asilo-famiglia',
      campiNecessari: ['cittadinanza'],
      condizioni: [{ campo: 'cittadinanza', op: 'eq', valore: 'extra-ue' }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Effetto indiretto sul diritto d\'asilo e sulla vita familiare: la proposta abolisce la "protezione speciale" (un permesso per chi non può essere rimpatriato senza rischi) e restringe il ricongiungimento familiare, escludendo chi si è regolarizzato con una sanatoria e introducendo nuove verifiche. Per chi è extra-UE significa meno strade per restare in Italia o per ricongiungersi con i familiari.',
        direzione: 'negativo',
        indiretto: true,
        dirittoToccato: {
          carta: 'Costituzione italiana',
          articolo: 'art. 10',
          diritto: 'diritto d\'asilo e protezione di chi fugge da Paesi non sicuri',
          intensita: 'grave',
          url: ART10_COST
        }
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'Tocca anche l\'art. 8 della CEDU (rispetto della vita privata e familiare) e gli artt. 29-31 della Costituzione sulla famiglia. Intensità "grave" perché rimuove un canale di protezione oggi esistente; ma è solo una proposta, non ancora votata, e dovrebbe comunque rispettare gli obblighi internazionali inderogabili.',
      fonteRegola: FONTE
    },
    {
      id: 'remigrazione-revoca-cittadinanza',
      campiNecessari: ['cittadinanza'],
      condizioni: [{ campo: 'cittadinanza', op: 'eq', valore: 'extra-ue' }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Effetto indiretto sul diritto alla cittadinanza: se in futuro ottenessi la cittadinanza italiana per naturalizzazione, la proposta prevede che possa esserti revocata in caso di condanna definitiva per reati gravi (terrorismo, criminalità organizzata, reati puniti fino a 5 anni o più), con espulsione e divieto di rientro. La cittadinanza acquisita diventerebbe quindi più "fragile" di quella di chi è italiano dalla nascita.',
        direzione: 'negativo',
        indiretto: true,
        dirittoToccato: {
          carta: 'Costituzione italiana',
          articolo: 'art. 22',
          diritto: 'nessuno può essere privato della cittadinanza',
          intensita: 'grave',
          url: ART22_COST
        }
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'Riguarda solo la cittadinanza ottenuta per naturalizzazione, non quella dalla nascita: un dato che non ti chiediamo. La revoca solleva il tema del rischio di apolidia (restare senza nessuna cittadinanza), vietato dalle convenzioni internazionali. Intensità "grave" per la gravità della conseguenza; resta una proposta da votare.',
      fonteRegola: FONTE
    },
    {
      id: 'remigrazione-uguaglianza',
      campiNecessari: ['cittadinanza'],
      condizioni: [{ campo: 'cittadinanza', op: 'eq', valore: 'extra-ue' }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Effetto indiretto sull\'uguaglianza di trattamento: diverse misure distinguono in base alla nazionalità. La tassa del 3% colpisce solo le rimesse verso l\'estero; il bonus nascita, gli asili nido gratuiti e gli aiuti per la casa del Fondo Natalità sono riservati in via prioritaria alle famiglie con genitori entrambi italiani. Per chi è straniero significa contribuire alle tasse ma con meno accesso ad alcuni aiuti.',
        direzione: 'negativo',
        indiretto: true,
        dirittoToccato: {
          carta: 'Costituzione italiana',
          articolo: 'art. 3',
          diritto: 'uguaglianza e pari dignità senza distinzioni',
          intensita: 'sensibile',
          url: ART3_COST
        }
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'Trattamenti diversi su base di nazionalità possono entrare in tensione con l\'art. 3 della Costituzione e con il divieto di discriminazione dell\'Unione europea. È un giudizio che spetterebbe poi ai giudici; intanto è solo una proposta da discutere.',
      fonteRegola: FONTE
    },
    {
      id: 'remigrazione-fondo-natalita',
      campiNecessari: ['cittadinanza', 'figli'],
      condizioni: [
        { campo: 'cittadinanza', op: 'eq', valore: 'italiana' },
        { campo: 'figli', op: 'almeno', valore: 1 }
      ],
      effetto: {
        tipo: 'economico',
        descrizione: 'SE la proposta diventasse legge: nasce il Fondo per la Natalità Italiana, con bonus nascita fino a 3.000 euro per figlio, contributi fino a 10.000 euro dal terzo figlio in poi, asili nido gratuiti e mutui o affitti calmierati, riservati in via prioritaria alle famiglie con genitori entrambi cittadini italiani. Se hai (o avrai) figli, potresti riceverne un aiuto economico.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'Il Fondo parte solo dall\'anno successivo a quando la remigrazione avrà prodotto almeno 500 milioni di risparmi pubblici certificati: un effetto quindi doppiamente incerto, perché la legge non esiste ancora e perché i fondi dipendono da risultati futuri. Gli aiuti spettano se entrambi i genitori sono italiani.',
      fonteRegola: FONTE
    },
    {
      id: 'remigrazione-imprese',
      campiNecessari: ['condizioneLavorativa'],
      condizioni: [{ campo: 'condizioneLavorativa', op: 'eq', valore: 'imprenditore' }],
      effetto: {
        tipo: 'dovere',
        descrizione: 'SE la proposta diventasse legge: per le imprese aumentano molto i rischi se impiegano lavoratori stranieri irregolari (reclusione, multe fino a 1 milione, confisca dei beni, blocco dei conti, revoca delle licenze). Allo stesso tempo sono previsti incentivi e premi per le aziende che assumono solo lavoratori regolari. Se hai dipendenti, conviene avere tutto in regola.',
        direzione: 'misto'
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'Impiegare lavoratori irregolari è già oggi sanzionato; la proposta inasprisce le pene e aggiunge confische e premi. È comunque una proposta non ancora votata.',
      fonteRegola: FONTE
    }
  ]
};
