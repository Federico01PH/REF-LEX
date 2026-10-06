import type { Legge } from '../../engine/types';

// Verificato da: Camera dei deputati, A.C. 2822-B (Bignami e altri) - "Disposizioni in materia
// di elezioni della Camera dei deputati e del Senato della Repubblica", approvata dalla Camera
// il 16 luglio 2026 (stampato Senato n. 1971) e MODIFICATA DAL SENATO il 15 settembre 2026.
// Testo a fronte ufficiale: documenti.camera.it, leg.19.pdl.camera.2822.19PDL0213710.pdf.
// Riscontro delle modifiche del Senato: dossier del Servizio Bilancio della Camera n. 526 del
// 30/9/2026 (VQ2822B). Data verifica: 2026-10-06.
//
// STATO AL 6/10/2026: terza lettura alla Camera. La I Commissione non ha cambiato il testo del
// Senato; in Aula il Governo ha posto la fiducia sugli articoli (art. 1 approvato il 6/10 con
// 226 sì) e il voto finale è fissato per l'8 ottobre 2026. Con la fiducia il testo non può più
// cambiare, ma finché manca il voto finale NON è legge: stato "discussione", confidenza al
// massimo "probabile" (manca un passaggio).
//
// Cosa dice il testo (articoli citati del DPR 361/1957 e del d.lgs. 533/1993 come modificati):
// - art. 1, c. 1: sistema proporzionale con "premio di governabilità" alla lista o coalizione
//   prima in ENTRAMBE le Camere che superi il 42% dei voti validi in ciascuna: 70 seggi alla
//   Camera, 35 al Senato (art. 2), assegnati a liste circoscrizionali apposite; tetto di 220
//   deputati e 113 senatori (circoscrizione Estero esclusa).
// - art. 1, c. 4 e c. 8 lett. g (modifiche del Senato): liste di collegio di 7 candidati,
//   capolista compreso, in ordine alternato di genere; capolista bloccato; fino a TRE
//   preferenze sugli altri sei, di sesso diverso, pena l'annullamento della seconda e terza.
// - art. 1, c. 8 lett. h (modifica del Senato): soppresso il secondo periodo dell'art. 18-bis,
//   c. 3.1, cioè il tetto del 60% per genere sulle posizioni di capolista.
// - art. 1, c. 8 lett. a-b (modifica del Senato): firme per presentare le liste da 1.500-2.000
//   a 6.000-7.000 per collegio, salvo i partiti con un gruppo parlamentare (restano 1.500-2.000
//   o l'esenzione); liste in almeno la metà delle circoscrizioni.
// - art. 1, c. 12: le liste che non dichiarano il nome proposto per l'incarico di Presidente
//   del Consiglio sono ricusate (restano salve le prerogative del Presidente della Repubblica).
// - art. 6-7: circoscrizione Estero su due ripartizioni; voto per corrispondenza con tagliando
//   a lettura ottica, plico per raccomandata nel 2027, pene per i brogli da 2 a 5 anni.
// - art. 8: voto fuori sede per studio o lavoro (almeno nove mesi in un'altra regione), per cure
//   di almeno tre mesi e, dal Senato, per i caregiver familiari; vale per politiche, europee e
//   referendum.

const FONTE_ITER = {
  etichetta: 'Camera dei deputati - A.C. 2822-B, scheda e iter',
  url: 'https://www.camera.it/leg19/126?idDocumento=2822&leg=19'
};
const FONTE_TESTO = {
  etichetta: 'Camera dei deputati - A.C. 2822-B, testo approvato dalla Camera e modificato dal Senato',
  url: 'https://documenti.camera.it/leg19/pdl/pdf/leg.19.pdl.camera.2822.19PDL0213710.pdf'
};
const FONTE_DOSSIER = {
  etichetta: 'Camera dei deputati - Dossier n. 526 del 30/9/2026 sulle modifiche del Senato',
  url: 'https://documenti.camera.it/leg19/dossier/Pdf/VQ2822B.pdf'
};
const COST = 'https://www.senato.it/istituzione/la-costituzione/parte-i/titolo-iv/';

// chi vota alle politiche: cittadini italiani maggiorenni
const ELETTORE = [
  { campo: 'eta' as const, op: 'almeno' as const, valore: 18 },
  { campo: 'cittadinanza' as const, op: 'eq' as const, valore: 'italiana' }
];
// le prossime politiche cadono a cavallo del primo anno (la legislatura scade nell'autunno
// 2027): nel primo anno è incerto se si vota già, dopo la legge si applica
const DALLE_PROSSIME_POLITICHE = { anno1: 'incerto', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' } as const;
const NOTA_VOTO_FINALE = 'Testo approvato dalla Camera e modificato dal Senato, blindato dalla fiducia: manca solo il voto finale della Camera, fissato per l\'8 ottobre 2026.';

export const leggeElettorale: Legge = {
  id: 'legge-elettorale-2026',
  titoloDivulgativo: 'Nuova legge elettorale: proporzionale con premio di maggioranza e preferenze',
  titoloUfficiale: 'Proposta di legge A.C. 2822-B (Bignami e altri) - Disposizioni in materia di elezioni della Camera dei deputati e del Senato della Repubblica, approvata dalla Camera e modificata dal Senato',
  stato: 'discussione',
  ambiti: ['politica-voto'],
  fonti: [FONTE_ITER, FONTE_TESTO, FONTE_DOSSIER],
  verificataIl: '2026-10-06',
  riassunto: 'La nuova legge per eleggere Camera e Senato. È stata approvata dalla Camera il 16 luglio e, con modifiche, dal Senato il 15 settembre 2026: ora manca il voto finale della Camera, fissato per l\'8 ottobre. Sistema proporzionale con un premio di seggi a chi supera il 42% in entrambe le Camere. Tornano le preferenze, fino a tre, ma il capolista resta bloccato. Si potrà votare dove si studia o si lavora fuori regione.',
  regole: [
    {
      id: 'elettorale-come-voti',
      campiNecessari: ['eta', 'cittadinanza'],
      condizioni: ELETTORE,
      effetto: {
        tipo: 'diritto',
        descrizione: 'Alle prossime elezioni politiche voterai così. Il sistema è proporzionale: i seggi si dividono in base ai voti di ogni lista, e i collegi uninominali spariscono (restano solo in Valle d\'Aosta e Trentino-Alto Adige). In ogni collegio ogni lista ha 7 candidati, alternati tra donne e uomini. Il primo, il capolista, è bloccato: se la lista prende almeno un seggio entra lui, senza bisogno di preferenze. Sugli altri sei puoi dare fino a tre preferenze, con una croce accanto al nome; se ne dai più di una devono essere di sesso diverso, altrimenti la seconda e la terza non valgono. Ogni lista o coalizione deve dichiarare chi propone come Presidente del Consiglio, altrimenti le sue liste non sono ammesse; la nomina resta però al Presidente della Repubblica. Resta la soglia del 3% per entrare in Parlamento.',
        breve: 'Voti con il proporzionale: capolista bloccato, ma puoi dare fino a tre preferenze sugli altri candidati.',
        direzione: 'misto'
      },
      timeline: DALLE_PROSSIME_POLITICHE,
      confidenza: 'probabile',
      noteConfidenza: `${NOTA_VOTO_FINALE} Le preferenze con capolista bloccato sono una modifica del Senato: il testo uscito dalla Camera a luglio aveva liste interamente bloccate.`,
      fonteRegola: FONTE_TESTO
    },
    {
      id: 'elettorale-premio-governabilita',
      campiNecessari: ['eta', 'cittadinanza'],
      condizioni: ELETTORE,
      effetto: {
        tipo: 'diritto',
        descrizione: 'Effetto indiretto sul peso del tuo voto. La lista o la coalizione che arriva prima in entrambe le Camere e supera il 42% dei voti in ciascuna riceve un premio di governabilità: 70 seggi in più alla Camera e 35 al Senato. Serve a dare governi più stabili, ma vuol dire che chi vince ottiene molti più seggi della sua percentuale di voti, e chi vota per gli altri pesa di meno. C\'è un tetto: chi vince non può superare 220 deputati su 400 e 113 senatori su 200, senza contare gli eletti all\'estero. I seggi del premio vanno a candidati di liste a parte, scritte sulla scheda sotto il simbolo: per loro non si danno preferenze.',
        breve: 'Effetto indiretto: il premio dà più seggi a chi vince col 42%, così il voto per gli altri pesa di meno.',
        direzione: 'misto',
        indiretto: true,
        dirittoToccato: {
          carta: 'Costituzione italiana',
          articolo: 'art. 48',
          diritto: 'eguaglianza del voto',
          intensita: 'sensibile',
          url: `${COST}articolo-48`
        }
      },
      timeline: DALLE_PROSSIME_POLITICHE,
      confidenza: 'probabile',
      noteConfidenza: `La Corte costituzionale ha già bocciato premi di maggioranza troppo sproporzionati: sentenza 1/2014 sul "Porcellum" e 35/2017 sull'"Italicum". Qui una soglia (42%) e un tetto ai seggi sono pensati per rispettarle, ma l'eguaglianza del voto (art. 48 Cost.) resta al centro del dibattito. Se nessuno arriva al 42% in entrambe le Camere il premio non scatta. ${NOTA_VOTO_FINALE}`,
      fonteRegola: FONTE_TESTO
    },
    {
      // il Senato ha soppresso il tetto del 60% per genere sui capilista (art. 18-bis, c. 3.1,
      // secondo periodo, DPR 361/1957): i posti con elezione garantita non hanno più vincoli
      id: 'elettorale-capilista-genere',
      campiNecessari: ['eta', 'cittadinanza', 'genere'],
      condizioni: [...ELETTORE, { campo: 'genere', op: 'eq', valore: 'donna' }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Effetto indiretto sulla presenza delle donne in Parlamento. Il capolista è l\'unico posto con elezione quasi garantita, e il Senato ha tolto la regola per cui nessun genere poteva superare il 60% dei capilista di un partito. In pratica un partito può mettere solo uomini in testa a tutte le sue liste. Restano l\'alternanza donna-uomo dentro ogni lista e l\'obbligo di dare le preferenze a persone di sesso diverso, ma chi entra dopo il capolista dipende dalle preferenze, quindi il numero di donne elette non è più assicurato. Se pensi di candidarti, i posti sicuri non hanno più quote.',
        breve: 'Effetto indiretto: sparisce il limite di genere sui capilista, i posti più sicuri possono andare tutti a uomini.',
        direzione: 'negativo',
        indiretto: true,
        dirittoToccato: {
          carta: 'Costituzione italiana',
          articolo: 'art. 51',
          diritto: 'pari opportunità tra donne e uomini nell\'accesso alle cariche elettive',
          intensita: 'lieve',
          url: `${COST}articolo-51`
        }
      },
      timeline: DALLE_PROSSIME_POLITICHE,
      confidenza: 'probabile',
      noteConfidenza: `Intensità "lieve": la legge non esclude nessuno e mantiene l'alternanza di genere nelle liste; l'effetto reale dipende da come i partiti sceglieranno i capilista. Il tetto del 60% resta invece per le liste del premio di governabilità. ${NOTA_VOTO_FINALE}`,
      fonteRegola: FONTE_TESTO
    },
    {
      id: 'elettorale-firme-nuovi-partiti',
      campiNecessari: ['eta', 'cittadinanza'],
      condizioni: ELETTORE,
      effetto: {
        tipo: 'diritto',
        descrizione: 'Effetto indiretto sulla scelta che trovi sulla scheda. Per presentarsi, un partito che non ha già un gruppo in Parlamento deve raccogliere da 6.000 a 7.000 firme in ogni collegio, invece delle 1.500-2.000 di oggi, e presentare liste in almeno la metà delle circoscrizioni. Per chi ha già un gruppo parlamentare restano 1.500-2.000 firme, o nessuna. Per un movimento nuovo diventa molto più difficile arrivare al voto, quindi potresti trovare meno alternative ai partiti che ci sono già.',
        breve: 'Effetto indiretto: per i partiti nuovi servono da 6.000 a 7.000 firme per collegio, quattro volte più di prima.',
        direzione: 'negativo',
        indiretto: true,
        dirittoToccato: {
          carta: 'Costituzione italiana',
          articolo: 'art. 49',
          diritto: 'libertà di associarsi in partiti per concorrere alla politica nazionale',
          intensita: 'lieve',
          url: `${COST}articolo-49`
        }
      },
      timeline: DALLE_PROSSIME_POLITICHE,
      confidenza: 'probabile',
      noteConfidenza: `Intensità "lieve": nessun partito è vietato, ma la soglia di ingresso per chi non è già in Parlamento quadruplica. Per le prime elezioni, chi vuole l'esenzione deve averne i requisiti già al 31 dicembre 2025 (art. 5). ${NOTA_VOTO_FINALE}`,
      fonteRegola: FONTE_TESTO
    },
    {
      // art. 8, c. 2-3: chi per studio o lavoro è domiciliato in un'altra regione
      id: 'elettorale-fuori-sede',
      campiNecessari: ['eta', 'cittadinanza', 'condizioneLavorativa'],
      condizioni: [...ELETTORE, {
        campo: 'condizioneLavorativa', op: 'in',
        valore: ['studente', 'dipendente-privato', 'dipendente-pubblico', 'autonomo-ordinario', 'forfettario', 'imprenditore', 'altro']
      }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Se studi o lavori in una regione diversa da quella dove sei iscritto per votare, e ci resti almeno nove mesi, potrai votare lì invece di tornare a casa. Vale per le elezioni politiche, per le europee e per i referendum. Devi chiedere l\'iscrizione all\'elenco degli elettori fuori sede del comune dove vivi ora entro il 31 dicembre, per votare l\'anno dopo; se diventi fuori sede dopo, hai 30 giorni (e comunque fino a 45 giorni prima del voto). La domanda si fa di persona o online, con un documento e un attestato di studio o lavoro. Voterai per i candidati del posto in cui ti trovi.',
        breve: 'Se studi o lavori in un\'altra regione per almeno nove mesi, potrai votare lì senza tornare a casa.',
        direzione: 'positivo'
      },
      timeline: DALLE_PROSSIME_POLITICHE,
      confidenza: 'dipende',
      noteConfidenza: `Vale solo se sei davvero fuori sede in un'altra regione per almeno nove mesi e chiedi l'iscrizione in tempo. ${NOTA_VOTO_FINALE}`,
      fonteRegola: FONTE_TESTO
    },
    {
      // art. 8, c. 4-5: cure in un'altra regione e, dal Senato, caregiver familiari
      id: 'elettorale-fuori-sede-cura',
      campiNecessari: ['eta', 'cittadinanza', 'condizioneLavorativa'],
      condizioni: [...ELETTORE, { campo: 'condizioneLavorativa', op: 'in', valore: ['caregiver'] }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Se assisti un familiare che per almeno tre mesi è in cura in una struttura sanitaria di un\'altra regione, e in quel periodo cade un\'elezione o un referendum, potrai votare nel comune dove lo stai assistendo. Lo stesso vale per i genitori che accompagnano un figlio minorenne in cura fuori regione, e per chi è in cura lui stesso. La domanda va fatta al comune entro 45 giorni prima del voto, con un documento e un certificato della struttura.',
        breve: 'Se assisti un familiare in cura in un\'altra regione per almeno tre mesi, potrai votare lì.',
        direzione: 'positivo'
      },
      timeline: DALLE_PROSSIME_POLITICHE,
      confidenza: 'dipende',
      noteConfidenza: `L'estensione ai caregiver familiari (definiti dalla legge 205/2017) è una modifica del Senato. Vale solo se l'assistenza dura almeno tre mesi e comprende il giorno del voto. ${NOTA_VOTO_FINALE}`,
      fonteRegola: FONTE_TESTO
    },
    {
      // artt. 6-7: circoscrizione Estero e voto per corrispondenza (legge 459/2001)
      id: 'elettorale-estero',
      campiNecessari: ['eta', 'cittadinanza', 'regione'],
      condizioni: [...ELETTORE, { campo: 'regione', op: 'eq', valore: 'Vivo all\'estero' }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Se vivi all\'estero cambia il tuo voto per corrispondenza. Il certificato elettorale avrà un tagliando con un codice letto da una macchina, per controllare che ogni busta sia di un elettore vero e che nessuno voti due volte. Per le elezioni del 2027 il plico arriverà per raccomandata o con un mezzo altrettanto sicuro, e i consolati pubblicheranno quanti plichi hanno spedito e ricevuto. Le pene per alcuni reati legati al voto dall\'estero salgono da 1-3 a 2-5 anni di carcere. Le zone del mondo per la Camera passano da quattro a due (Europa e resto del mondo), e per il Senato la circoscrizione Estero diventa unica.',
        breve: 'Se vivi all\'estero: voto per posta con codice di controllo, plico per raccomandata nel 2027, zone ridotte a due.',
        direzione: 'misto'
      },
      timeline: DALLE_PROSSIME_POLITICHE,
      confidenza: 'probabile',
      noteConfidenza: `Più controlli contro i brogli, ma zone più grandi: i candidati dovranno rappresentare territori molto più ampi. La raccomandata è prevista solo per il 2027. ${NOTA_VOTO_FINALE}`,
      fonteRegola: FONTE_TESTO
    }
  ]
};
