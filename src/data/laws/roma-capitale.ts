import type { Legge } from '../../engine/types';

// Verificato da: DISEGNO DI LEGGE COSTITUZIONALE A.C. 2564 (XIX Legislatura), "Modifica
// dell'articolo 114 della Costituzione in materia di Roma Capitale", d'iniziativa del Governo
// (MELONI; ALBERTI CASELLATI, Ministra per le riforme istituzionali; di concerto con
// CALDEROLI, Ministro per gli affari regionali). Presentato alla Camera il 5 agosto 2025.
// Testo letto sul fascicolo del Senato A.S. 1888 (il testo approvato dalla Camera) e sullo
// stampato Camera 2564-A. Data verifica: 2026-09-01.
//
// ITER REALE (non è ancora Costituzione): assegnato alla I Commissione Affari costituzionali
// della Camera il 10 settembre 2025; esame in Commissione dal 1° ottobre 2025 all'11 marzo
// 2026; APPROVATO IN PRIMA DELIBERAZIONE dalla Camera il 29 aprile 2026 con 159 sì, 33 no e
// 55 astenuti; trasmesso al Senato il 30 aprile 2026 (A.S. 1888) e assegnato il 4 maggio 2026
// alla 1ª Commissione permanente (Affari Costituzionali) in sede referente, dove al
// 1° settembre 2026 l'esame NON è ancora iniziato. Ha assorbito le proposte C.278, C.514,
// C.1241 e C.2001.
//
// Serve il procedimento dell'articolo 138 della Costituzione: QUATTRO deliberazioni (due per
// Camera, a distanza di almeno tre mesi l'una dall'altra). Se nella seconda votazione il
// testo non ottiene i due terzi dei componenti in ciascuna Camera, un quinto dei membri di
// una Camera, 500.000 elettori o cinque Consigli regionali possono chiedere il REFERENDUM
// CONFERMATIVO. Alla Camera i sì sono stati 159 su 400 componenti: molto sotto i due terzi
// (267), quindi allo stato dei fatti il referendum è uno sbocco concreto. Non è una
// previsione politica: è il conto tra i voti verbalizzati e la soglia dell'art. 138.
//
// Contenuti del testo approvato dalla Camera (due articoli):
// - art. 1: sostituisce l'articolo 114 della Costituzione. Roma Capitale entra nell'elenco
//   degli enti di cui si compone la Repubblica (primo comma) e tra gli enti autonomi con
//   propri statuti, poteri e funzioni (secondo comma). Terzo comma: «Roma è la capitale della
//   Repubblica. Esercita la potestà legislativa nelle seguenti materie: trasporto pubblico
//   locale; polizia amministrativa locale; governo del territorio; commercio; valorizzazione
//   dei beni culturali e ambientali; promozione e organizzazione di attività culturali;
//   turismo; artigianato; servizi e politiche sociali; edilizia residenziale pubblica;
//   organizzazione amministrativa di Roma Capitale» (undici materie). Quarto comma: una legge
//   dello Stato approvata a maggioranza assoluta dei componenti di ciascuna Camera, sentiti
//   il Consiglio della Regione Lazio e l'Assemblea elettiva di Roma Capitale, ne disciplina
//   l'ordinamento e le attribuisce condizioni peculiari di autonomia amministrativa e
//   finanziaria nel rispetto dell'art. 119. Sesto comma (aggiunto in Commissione): «La legge
//   dello Stato può attribuire ai Comuni capoluogo delle Città metropolitane ulteriori e
//   specifiche funzioni amministrative sulla base dei princìpi di sussidiarietà,
//   differenziazione e adeguatezza».
// - art. 2 (disposizioni transitorie): Roma Capitale esercita le nuove funzioni legislative
//   solo A PARTIRE DALLE PRIME ELEZIONI della sua Assemblea successive all'entrata in vigore
//   (comma 1); fino ad allora, e comunque fino a quando Roma non legifera su una singola
//   materia, continuano ad applicarsi le leggi della Regione Lazio (comma 2) e le norme
//   vigenti sull'ordinamento di Roma Capitale (comma 3); nelle materie di competenza
//   concorrente la potestà si esercita nel rispetto dei princìpi fondamentali dello Stato
//   (comma 4); se il Lazio ottenesse l'autonomia differenziata dell'art. 116 terzo comma,
//   l'intesa Stato-Regione, sentita Roma Capitale, definirebbe il coordinamento (comma 5);
//   a Roma Capitale si applicano gli artt. 114 sesto comma, 118, 119, 120, 127 e 134 Cost.
//   (comma 6, ampliato in Commissione).
//
// CONTRAPPESO ISTITUZIONALE: i pareri delle Commissioni della Camera (VI Finanze, VII
// Cultura, VIII Ambiente, IX Trasporti, X Attività produttive, XII Affari sociali) sono
// tutti FAVOREVOLI e sono citati dove servono. Il Senato non ha ancora iniziato l'esame,
// quindi non esiste nessun parere critico di un ente su questo testo: dove REF-LEX aggiunge
// una lettura propria, la nota lo dichiara.
// TONO NEUTRO: diciamo cosa cambia e per chi, non se è giusto o sbagliato.

const FONTE_TESTO = {
  etichetta: 'A.S. 1888 — testo approvato dalla Camera il 29 aprile 2026 (Senato della Repubblica)',
  url: 'https://www.senato.it/service/PDF/PDFServer/BGT/01505564.pdf'
};
const FONTE_ITER_CAMERA = {
  etichetta: 'Atto Camera 2564 — scheda e iter completo (Camera dei deputati)',
  url: 'https://www.camera.it/leg19/126?idDocumento=2564&leg=19'
};
const FONTE_ITER_SENATO = {
  etichetta: 'Atto Senato 1888 — scheda e stato dell\'esame (Senato della Repubblica)',
  url: 'https://www.senato.it/leggi-e-documenti/disegni-di-legge/scheda-ddl?did=60105'
};
const FONTE_COMMISSIONE = {
  etichetta: 'Stampato Camera 2564-A — testo della Commissione e pareri delle Commissioni (Camera dei deputati)',
  url: 'https://documenti.camera.it/leg19/pdl/pdf/leg.19.pdl.camera.2564_A.19PDL0186660.pdf'
};
const FONTE_ART114 = {
  etichetta: 'Costituzione italiana, art. 114 — gli enti di cui si compone la Repubblica (Senato della Repubblica)',
  url: 'https://www.senato.it/istituzione/la-costituzione/parte-ii/titolo-v/articolo-114'
};
const FONTE_ART138 = {
  etichetta: 'Costituzione italiana, art. 138 — come si cambia la Costituzione e quando si vota il referendum (Senato della Repubblica)',
  url: 'https://www.senato.it/istituzione/la-costituzione/parte-ii/titolo-vi/sezione-ii/articolo-138'
};
const FONTE_ART3 = {
  etichetta: 'Costituzione italiana, art. 3 — uguaglianza davanti alla legge (Senato della Repubblica)',
  url: 'https://www.senato.it/istituzione/la-costituzione/principi-fondamentali/articolo-3'
};

// tutte le regioni tranne il Lazio: per chi vive fuori dal Lazio il capoluogo metropolitano
// di riferimento non è Roma, quindi la clausola sui Comuni capoluogo lo riguarda davvero.
// 'Vivo all'estero' resta fuori di proposito: non ha un capoluogo metropolitano italiano.
const REGIONI_FUORI_LAZIO = [
  'Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna', 'Friuli-Venezia Giulia',
  'Liguria', 'Lombardia', 'Marche', 'Molise', 'Piemonte', 'Puglia', 'Sardegna', 'Sicilia',
  'Toscana', 'Trentino-Alto Adige', 'Umbria', "Valle d'Aosta", 'Veneto'
];

export const romaCapitale: Legge = {
  id: 'ddl-cost-roma-capitale-114',
  titoloDivulgativo: 'Roma Capitale entra in Costituzione e potrebbe fare leggi sue su trasporti, casa e servizi',
  titoloUfficiale: 'A.C. 2564 / A.S. 1888 (XIX Leg.) — Modifica dell\'articolo 114 della Costituzione in materia di Roma Capitale',
  stato: 'discussione',
  ambiti: ['politica-voto', 'casa'],
  fonti: [FONTE_TESTO, FONTE_ITER_CAMERA, FONTE_ITER_SENATO, FONTE_COMMISSIONE, FONTE_ART114, FONTE_ART138, FONTE_ART3],
  verificataIl: '2026-09-01',
  riassunto: 'Una riforma della Costituzione che mette Roma Capitale accanto a Comuni, Province, Città metropolitane, Regioni e Stato, e le dà il potere di fare leggi proprie su undici materie: trasporto pubblico locale, polizia amministrativa, governo del territorio, commercio, beni culturali e ambientali, attività culturali, turismo, artigianato, servizi e politiche sociali, edilizia residenziale pubblica e la propria organizzazione. Le leggi del Lazio restano valide finché Roma non legifera. La Camera l\'ha approvata in prima lettura il 29 aprile 2026; al Senato l\'esame non è ancora iniziato. Servono quattro voti in tutto e può finire in referendum.',
  regole: [
    {
      // chi vive nel Lazio è l'unico a cui cambia il livello di governo che scrive le regole
      // di trasporti, casa popolare e servizi sociali. Misto: più vicinanza, ma anche un
      // confine nuovo dentro la stessa regione.
      id: 'roma-lazio-nuove-leggi',
      campiNecessari: ['regione'],
      condizioni: [{ campo: 'regione', op: 'eq', valore: 'Lazio' }],
      effetto: {
        tipo: 'servizio',
        descrizione: 'Vivi nel Lazio: sei nella regione dove questa riforma cambia davvero chi scrive le regole della tua vita quotidiana. Oggi trasporto pubblico locale, governo del territorio, commercio, turismo, artigianato, servizi e politiche sociali ed edilizia residenziale pubblica sono materie della Regione Lazio, e valgono uguali da Roma a Rieti. Con la riforma, dentro Roma Capitale quelle materie le regolerebbe Roma con leggi proprie, mentre nel resto del Lazio continuerebbero a valere le leggi regionali. Non succede subito: Roma potrà legiferare solo a partire dalle prime elezioni della sua Assemblea successive all\'entrata in vigore della riforma, e fino a quando non fa una legge su una singola materia resta in vigore quella del Lazio. In concreto, con il tempo le graduatorie per la casa popolare, i servizi sociali, gli orari e le tariffe del trasporto locale potrebbero seguire regole diverse a seconda che tu viva dentro o fuori Roma.',
        breve: 'Nel Lazio: dentro Roma le regole di trasporti, casa popolare e servizi le farebbe Roma, non la Regione.',
        direzione: 'misto'
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'Riforma costituzionale a metà strada: approvata dalla Camera in prima deliberazione il 29 aprile 2026, al Senato è assegnata alla 1ª Commissione dal 4 maggio 2026 ma l\'esame non è ancora iniziato. Servono in tutto quattro deliberazioni (due per Camera, ad almeno tre mesi di distanza), e anche se venisse approvata l\'effetto sarebbe ulteriormente rinviato: le funzioni legislative partono solo dalle prime elezioni dell\'Assemblea di Roma Capitale successive all\'entrata in vigore, e ogni materia passa a Roma solo quando Roma ci fa sopra una legge. Fino ad allora valgono le leggi della Regione Lazio.',
      fonteRegola: FONTE_TESTO
    },
    {
      // rovescio della medaglia per chi vive nel Lazio ma fuori Roma: stessa regione, regole
      // potenzialmente diverse. Nessun ente ha sollevato il punto: lo dichiariamo nella nota.
      id: 'roma-lazio-due-regole-nella-stessa-regione',
      campiNecessari: ['regione'],
      condizioni: [{ campo: 'regione', op: 'eq', valore: 'Lazio' }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Effetto di riflesso, e riguarda soprattutto chi nel Lazio vive fuori da Roma. Su undici materie che toccano la vita di tutti i giorni si creerebbero due legislatori nella stessa regione: Roma Capitale dentro il suo territorio, la Regione Lazio fuori. Su servizi e politiche sociali o su edilizia residenziale pubblica questo può voler dire requisiti, graduatorie e importi diversi per persone che stanno nella stessa condizione a pochi chilometri di distanza. Il testo prova a tenere insieme le cose: nelle materie di competenza concorrente Roma dovrà rispettare i princìpi fondamentali fissati dalle leggi dello Stato, e se un giorno il Lazio ottenesse l\'autonomia differenziata l\'intesa con lo Stato, sentita Roma Capitale, dovrà indicare come le due si coordinano. Resta che la differenziazione tra territori è il punto della riforma, non un suo incidente.',
        breve: 'Nella stessa regione due legislatori: su casa popolare e servizi sociali le regole possono divergere.',
        direzione: 'misto',
        indiretto: true,
        dirittoToccato: {
          carta: 'Costituzione italiana',
          articolo: 'art. 3',
          diritto: 'uguaglianza davanti alla legge',
          intensita: 'lieve',
          url: 'https://www.senato.it/istituzione/la-costituzione/principi-fondamentali/articolo-3'
        }
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'Questa è una lettura di REF-LEX, non il parere di un ente: sul punto nessuna istituzione si è pronunciata. Alla Camera tutte le Commissioni chiamate a esprimersi (Finanze, Cultura, Ambiente, Trasporti, Attività produttive, Affari sociali) hanno dato parere FAVOREVOLE, e la Commissione Ambiente ha osservato che nelle materie concorrenti Roma dovrà comunque rispettare i princìpi fondamentali dello Stato ai sensi dell\'art. 117 terzo comma. Il Senato non ha ancora iniziato l\'esame, quindi non ci sono audizioni né dossier che valutino questo aspetto. Intensità "lieve" perché differenze tra territori esistono già oggi tra le Regioni e perché i princìpi fondamentali statali restano il pavimento comune.',
      fonteRegola: FONTE_COMMISSIONE
    },
    {
      // il pezzo nazionale: alla Camera i sì sono stati 159 su 400, molto sotto i due terzi.
      // Chi vota può ritrovarsi a decidere in un referendum confermativo.
      id: 'roma-referendum-confermativo',
      campiNecessari: ['cittadinanza', 'eta'],
      condizioni: [
        { campo: 'cittadinanza', op: 'eq', valore: 'italiana' },
        { campo: 'eta', op: 'almeno', valore: 18 }
      ],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Sei cittadino italiano maggiorenne, quindi potresti ritrovarti a votare su questa riforma. Cambiare la Costituzione richiede quattro deliberazioni, due per ciascuna Camera, a non meno di tre mesi l\'una dall\'altra. Se nella seconda votazione il testo non raggiunge i due terzi dei componenti in entrambe le Camere, allora un quinto dei membri di una Camera, cinquecentomila elettori o cinque Consigli regionali possono chiedere un referendum confermativo, e a quel punto decidi tu con un sì o un no. Il conto, oggi, dice che quella strada è aperta: alla Camera il 29 aprile 2026 i sì sono stati 159 su 400 componenti, mentre i due terzi sarebbero 267. Nel referendum confermativo non c\'è quorum di partecipanti: vince la maggioranza dei voti validi, quindi conta chi va a votare.',
        breve: 'Potresti votarla in un referendum: alla Camera i sì (159 su 400) sono lontani dai due terzi.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'Il referendum non è automatico: è possibile solo se il testo arriva in fondo alle quattro letture senza i due terzi e se qualcuno lo chiede entro tre mesi dalla pubblicazione. Oggi siamo alla prima delle quattro deliberazioni e il Senato non ha ancora iniziato l\'esame, quindi la riforma potrebbe anche fermarsi prima. I numeri citati sono quelli verbalizzati dalla Camera il 29 aprile 2026: 159 favorevoli, 33 contrari, 55 astenuti.',
      fonteRegola: FONTE_ART138
    },
    {
      // la clausola aggiunta in Commissione riguarda le ALTRE città metropolitane: per chi
      // vive nel Lazio il capoluogo metropolitano è Roma, quindi la escludiamo di proposito.
      id: 'roma-altri-capoluoghi-metropolitani',
      campiNecessari: ['regione'],
      condizioni: [{ campo: 'regione', op: 'in', valore: REGIONI_FUORI_LAZIO }],
      effetto: {
        tipo: 'servizio',
        descrizione: 'Vivi fuori dal Lazio, ma la riforma non parla solo di Roma. Nel testo approvato dalla Camera c\'è una frase aggiunta in Commissione: «La legge dello Stato può attribuire ai Comuni capoluogo delle Città metropolitane ulteriori e specifiche funzioni amministrative sulla base dei princìpi di sussidiarietà, differenziazione e adeguatezza». Riguarda i capoluoghi delle Città metropolitane — Milano, Torino, Genova, Venezia, Bologna, Firenze, Napoli, Bari, Reggio Calabria, Palermo, Catania, Messina, Cagliari — e apre la porta a dare anche a loro più poteri. Due differenze importanti rispetto a Roma: qui si parla di funzioni amministrative, non del potere di fare leggi, e non succede nulla in automatico, perché serve comunque una legge dello Stato che decida quali funzioni e a chi.',
        breve: 'Fuori dal Lazio: lo Stato potrebbe dare più funzioni amministrative ai capoluoghi metropolitani.',
        direzione: 'misto'
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'Doppia incertezza. La prima: la riforma è alla prima di quattro deliberazioni e al Senato l\'esame non è ancora iniziato. La seconda: anche se la riforma passasse, questa clausola è solo una possibilità aperta allo Stato, che dovrà approvare una legge ordinaria per attribuire davvero le funzioni. Se quella legge non arriva, per i capoluoghi metropolitani non cambia niente.',
      fonteRegola: FONTE_TESTO
    }
  ]
};
